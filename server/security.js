// ProofLens Enterprise Security, SSRF Shield, Magic-Byte Validator & Rate Limiter
const dns = require('dns').promises;
const net = require('net');
const http = require('http');
const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB max upload
const MAX_URL_FETCH_SIZE_BYTES = 15 * 1024 * 1024; // 15MB max for remote URL fetch
const URL_FETCH_TIMEOUT_MS = 6000; // 6s timeout

const ALLOWED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/x-m4a', 'audio/mp4'],
  video: ['video/mp4', 'video/webm', 'video/quicktime']
};

const ALLOWED_EXTENSIONS = {
  image: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  audio: ['.mp3', '.wav', '.ogg', '.m4a'],
  video: ['.mp4', '.webm', '.mov']
};

// --- 1. IP & SSRF Defense Utilities ---

/**
 * Checks if an IPv4 address string (in standard dotted format, octal, or hex) is private or internal.
 */
function isPrivateIPv4(ip) {
  if (!ip || typeof ip !== 'string') return true;
  const rawParts = ip.trim().split('.');
  if (rawParts.length !== 4) return true;

  const parts = rawParts.map(p => {
    p = p.trim();
    if (p.startsWith('0x') || p.startsWith('0X')) return parseInt(p, 16);
    if (p.length > 1 && p.startsWith('0')) return parseInt(p, 8);
    return parseInt(p, 10);
  });
  if (parts.some(isNaN) || parts.some(n => n < 0 || n > 255)) return true;

  const [b0, b1, b2, b3] = parts;

  // 0.0.0.0/8 (Current network)
  if (b0 === 0) return true;
  // 10.0.0.0/8 (Private network)
  if (b0 === 10) return true;
  // 100.64.0.0/10 (Shared address space / CGNAT)
  if (b0 === 100 && b1 >= 64 && b1 <= 127) return true;
  // 127.0.0.0/8 (Loopback)
  if (b0 === 127) return true;
  // 169.254.0.0/16 (Link-Local & Cloud Metadata e.g. 169.254.169.254)
  if (b0 === 169 && b1 === 254) return true;
  // 172.16.0.0/12 (Private network)
  if (b0 === 172 && b1 >= 16 && b1 <= 31) return true;
  // 192.0.0.0/24 (IETF Protocol Assignments)
  if (b0 === 192 && b1 === 0 && b2 === 0) return true;
  // 192.0.2.0/24 (TEST-NET-1)
  if (b0 === 192 && b1 === 0 && b2 === 2) return true;
  // 192.168.0.0/16 (Private network)
  if (b0 === 192 && b1 === 168) return true;
  // 198.18.0.0/15 (Benchmarking)
  if (b0 === 198 && (b1 === 18 || b1 === 19)) return true;
  // 198.51.100.0/24 (TEST-NET-2)
  if (b0 === 198 && b1 === 51 && b2 === 100) return true;
  // 203.0.113.0/24 (TEST-NET-3)
  if (b0 === 203 && b1 === 0 && b2 === 113) return true;
  // 224.0.0.0/4 (Multicast)
  if (b0 >= 224 && b0 <= 239) return true;
  // 240.0.0.0/4 (Reserved / Broadcast 255.255.255.255)
  if (b0 >= 240) return true;

  return false;
}

/**
 * Checks if an IPv6 address is private, loopback, link-local, documentation, or IPv4-mapped private.
 */
function isPrivateIPv6(ip) {
  if (!ip || typeof ip !== 'string') return true;
  const normalized = ip.toLowerCase().trim();

  // Loopback, unspecified, and ::ffff:0:0/96
  if (normalized === '::1' || normalized === '::' || normalized === '0:0:0:0:0:0:0:1' || normalized === '0:0:0:0:0:0:0:0') return true;

  // IPv4-mapped IPv6 (::ffff:127.0.0.1 or ::ffff:7f00:1 or ::ffff:192.168.1.1)
  if (normalized.includes('::ffff:')) {
    const rawIpv4 = normalized.split('::ffff:')[1];
    if (rawIpv4) {
      if (net.isIPv4(rawIpv4) || rawIpv4.includes('.')) {
        return isPrivateIPv4(rawIpv4);
      }
      // Dotted hex or 32-bit hex in IPv6 (e.g. 7f00:1)
      const hexParts = rawIpv4.split(':');
      if (hexParts.length <= 2) {
        try {
          const num = parseInt(hexParts.join(''), 16);
          if (!isNaN(num)) {
            const b0 = (num >>> 24) & 255;
            const b1 = (num >>> 16) & 255;
            const b2 = (num >>> 8) & 255;
            const b3 = num & 255;
            return isPrivateIPv4(`${b0}.${b1}.${b2}.${b3}`);
          }
        } catch {}
      }
    }
    return true;
  }

  // Link-Local (fe80::/10 -> fe8, fe9, fea, feb)
  if (normalized.startsWith('fe8') || normalized.startsWith('fe9') || normalized.startsWith('fea') || normalized.startsWith('feb')) {
    return true;
  }

  // Unique Local Address (fc00::/7 -> fc, fd)
  if (normalized.startsWith('fc') || normalized.startsWith('fd')) {
    return true;
  }

  // Multicast (ff00::/8)
  if (normalized.startsWith('ff')) {
    return true;
  }

  // Documentation / Example prefix (2001:db8::/32)
  if (normalized.startsWith('2001:db8') || normalized.startsWith('2001:0db8')) {
    return true;
  }

  // Discard Prefix (100::/64)
  if (normalized.startsWith('100::') || normalized.startsWith('0100::')) {
    return true;
  }

  return false;
}

/**
 * Normalizes and checks any IP (IPv4 or IPv6 or encoded integer) against private ranges.
 */
function isPrivateOrInternalIP(ipStr) {
  if (!ipStr || typeof ipStr !== 'string') return false;
  let trimmed = ipStr.trim();
  
  // Strip enclosing brackets if IPv6 literal e.g. [::1]
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    trimmed = trimmed.slice(1, -1);
  }

  // Check standard IPv4
  if (net.isIPv4(trimmed) || (trimmed.includes('.') && trimmed.split('.').length === 4)) {
    return isPrivateIPv4(trimmed);
  }

  // Check standard IPv6
  if (net.isIPv6(trimmed) || trimmed.includes(':')) {
    return isPrivateIPv6(trimmed);
  }

  // Check integer / hex representations (e.g. 2130706433 or 0x7f000001)
  if (/^(0x[0-9a-fA-F]+|\d+)$/.test(trimmed)) {
    try {
      const intVal = parseInt(trimmed, trimmed.startsWith('0x') ? 16 : 10);
      if (!isNaN(intVal) && intVal >= 0 && intVal <= 0xffffffff) {
        const b0 = (intVal >>> 24) & 255;
        const b1 = (intVal >>> 16) & 255;
        const b2 = (intVal >>> 8) & 255;
        const b3 = intVal & 255;
        const reconstructed = `${b0}.${b1}.${b2}.${b3}`;
        return isPrivateIPv4(reconstructed);
      }
    } catch {
      return true;
    }
  }

  // If it's a domain name (not an IP address literal), it's not a private IP literal
  return false;
}

/**
 * Validates a user-supplied URL and checks its destination IP via DNS resolution.
 */
async function validateAndResolveUrl(inputUrl) {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return { isValid: false, error: 'URL is required.' };
  }

  const trimmed = inputUrl.trim();
  if (trimmed.length > 1000) {
    return { isValid: false, error: 'URL exceeds maximum allowable length of 1000 characters.' };
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { isValid: false, error: 'Malformed URL syntax.' };
  }

  // Enforce HTTP / HTTPS protocol only
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { isValid: false, error: 'Disallowed protocol. Only http:// and https:// URLs are supported.' };
  }

  // Block credentials in URL
  if (parsed.username || parsed.password) {
    return { isValid: false, error: 'URLs containing embedded credentials are not allowed.' };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block localhost and internal domain names directly
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.arpa') ||
    hostname.endsWith('.home') ||
    hostname.endsWith('.lan')
  ) {
    return { isValid: false, error: 'Access to internal or loopback domain names is restricted.' };
  }

  // Check if hostname is directly an IP literal
  if (net.isIP(hostname) || isPrivateOrInternalIP(hostname)) {
    if (isPrivateOrInternalIP(hostname)) {
      return { isValid: false, error: 'Access to private or local IP addresses is restricted.' };
    }
    return { isValid: true, sanitizedUrl: parsed.toString() };
  }

  // Resolve hostname through DNS to prevent DNS rebinding / internal host resolution
  try {
    const records = await dns.lookup(hostname, { all: true });
    if (!records || records.length === 0) {
      return { isValid: false, error: 'Could not resolve host.' };
    }

    for (const record of records) {
      if (isPrivateOrInternalIP(record.address)) {
        return { isValid: false, error: 'Access to private or local network destination is restricted.' };
      }
    }

    return { isValid: true, sanitizedUrl: parsed.toString() };
  } catch (dnsErr) {
    return { isValid: false, error: 'Domain name resolution failed.' };
  }
}

/**
 * Synchronous URL sanitizer for fast non-blocking basic validation.
 */
function sanitizeUrl(inputUrl) {
  if (!inputUrl || typeof inputUrl !== 'string') return null;
  const trimmed = inputUrl.trim();
  if (trimmed.length > 1000) return null;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    if (parsed.username || parsed.password) return null;

    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.arpa') ||
      hostname.endsWith('.home') ||
      hostname.endsWith('.lan') ||
      isPrivateOrInternalIP(hostname)
    ) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * SSRF-Safe HTTP/HTTPS fetcher with size limits, timeout, and redirect re-validation.
 */
async function safeFetchMedia(url, maxSizeBytes = MAX_URL_FETCH_SIZE_BYTES) {
  const validation = await validateAndResolveUrl(url);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  return new Promise((resolve, reject) => {
    let redirectsFollowed = 0;
    const maxRedirects = 3;

    function executeFetch(targetUrl) {
      let parsed;
      try {
        parsed = new URL(targetUrl);
      } catch (err) {
        return reject(new Error('Invalid redirect target URL'));
      }

      const client = parsed.protocol === 'https:' ? https : http;
      const req = client.get(targetUrl, {
        timeout: URL_FETCH_TIMEOUT_MS,
        headers: {
          'User-Agent': 'ProofLens-Forensic-Bot/2.0 (+https://prooflens.org)',
          'Accept': 'image/*,audio/*,video/*;q=0.9,*/*;q=0.5'
        }
      }, (res) => {
        // Handle Redirects safely
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          redirectsFollowed++;
          if (redirectsFollowed > maxRedirects) {
            res.resume();
            return reject(new Error('Too many redirects followed.'));
          }

          const redirectUrl = new URL(res.headers.location, targetUrl).toString();
          res.resume();

          // Re-validate resolved IP for every redirect
          validateAndResolveUrl(redirectUrl).then(redirectCheck => {
            if (!redirectCheck.isValid) {
              return reject(new Error(`Redirect destination rejected: ${redirectCheck.error}`));
            }
            executeFetch(redirectUrl);
          }).catch(reject);
          return;
        }

        if (res.statusCode < 200 || res.statusCode >= 300) {
          res.resume();
          return reject(new Error(`Remote server responded with HTTP status ${res.statusCode}`));
        }

        const contentLength = parseInt(res.headers['content-length'], 10);
        if (!isNaN(contentLength) && contentLength > maxSizeBytes) {
          res.resume();
          return reject(new Error(`Remote resource exceeds maximum size of ${Math.round(maxSizeBytes / (1024 * 1024))}MB`));
        }

        const chunks = [];
        let totalBytes = 0;

        res.on('data', (chunk) => {
          totalBytes += chunk.length;
          if (totalBytes > maxSizeBytes) {
            req.destroy();
            return reject(new Error('Remote download aborted: resource exceeded maximum allowable size limit.'));
          }
          chunks.push(chunk);
        });

        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const mimeType = res.headers['content-type'] || 'application/octet-stream';
          resolve({ buffer, mimeType, finalUrl: targetUrl });
        });

        res.on('error', reject);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Remote media fetch timed out.'));
      });

      req.on('error', reject);
    }

    executeFetch(validation.sanitizedUrl);
  });
}

// --- 2. Magic Byte & Binary Signature Validation ---

/**
 * Inspects raw buffer magic bytes to determine genuine media file format.
 */
function detectMimeTypeFromBuffer(buffer) {
  if (!buffer || buffer.length < 4) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47 &&
    buffer[4] === 0x0d && buffer[5] === 0x0a && buffer[6] === 0x1a && buffer[7] === 0x0a
  ) {
    return 'image/png';
  }

  // GIF: 47 49 46 38
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) {
    return 'image/gif';
  }

  // WebP / WAV (RIFF container)
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 && buffer.length >= 12) {
    const riffType = buffer.slice(8, 12).toString('ascii');
    if (riffType === 'WEBP') return 'image/webp';
    if (riffType === 'WAVE') return 'audio/wav';
  }

  // MP3: ID3 tag or sync word FF FB / FF F3 / FF F2 / FF E3
  if (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) {
    return 'audio/mpeg';
  }
  if (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0) {
    return 'audio/mpeg';
  }

  // OGG: OggS (4F 67 67 53)
  if (buffer[0] === 0x4f && buffer[1] === 0x67 && buffer[2] === 0x67 && buffer[3] === 0x53) {
    return 'audio/ogg';
  }

  // WebM: 1A 45 DF A3 (EBML container)
  if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) {
    return 'video/webm';
  }

  // MP4 / QuickTime: 'ftyp' box in first 16 bytes
  if (buffer.length >= 12) {
    const boxType = buffer.slice(4, 8).toString('ascii');
    if (boxType === 'ftyp') {
      const majorBrand = buffer.slice(8, 12).toString('ascii');
      if (majorBrand.includes('qt')) return 'video/quicktime';
      return 'video/mp4';
    }
    if (boxType === 'moov' || boxType === 'mdat' || boxType === 'wide') {
      return 'video/mp4';
    }
  }

  return null;
}

/**
 * Validates uploaded file size, claimed MIME type, and verified binary signature.
 */
function validateUpload(file, expectedType = 'image') {
  if (!file) {
    return { isValid: false, error: 'No media file received for validation.' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { isValid: false, error: `File size exceeds the allowable limit of ${Math.round(MAX_FILE_SIZE_BYTES / (1024 * 1024))}MB.` };
  }

  if (file.size === 0) {
    return { isValid: false, error: 'Uploaded file is empty.' };
  }

  // Read header bytes to check magic bytes
  let headerBuffer = null;
  if (file.buffer) {
    headerBuffer = file.buffer.slice(0, 64);
  } else if (file.path && fs.existsSync(file.path)) {
    try {
      const fd = fs.openSync(file.path, 'r');
      const buf = Buffer.alloc(64);
      fs.readSync(fd, buf, 0, 64, 0);
      fs.closeSync(fd);
      headerBuffer = buf;
    } catch (readErr) {
      return { isValid: false, error: 'Unable to inspect binary file signature.' };
    }
  }

  const detectedMime = headerBuffer ? detectMimeTypeFromBuffer(headerBuffer) : null;
  const allowedMimes = ALLOWED_MIME_TYPES[expectedType] || [
    ...ALLOWED_MIME_TYPES.image,
    ...ALLOWED_MIME_TYPES.audio,
    ...ALLOWED_MIME_TYPES.video
  ];

  if (!detectedMime || !allowedMimes.includes(detectedMime)) {
    return {
      isValid: false,
      error: `File signature validation failed. Expected valid ${expectedType} format (JPEG, PNG, WebP, MP3, WAV, MP4, WebM).`
    };
  }

  return { 
    isValid: true, 
    detectedMimeType: detectedMime,
    safeExtension: getExtensionForMime(detectedMime)
  };
}

function getExtensionForMime(mime) {
  const map = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'audio/mpeg': '.mp3',
    'audio/wav': '.wav',
    'audio/ogg': '.ogg',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    'video/quicktime': '.mov'
  };
  return map[mime] || '.bin';
}

// --- 3. Input Sanitization & Path Traversal Guards ---

function sanitizeClaimText(text, maxLength = 500) {
  if (!text || typeof text !== 'string') return '';
  // Strip HTML / script tags, control characters, and trim
  return text
    .replace(/<[^>]*>?/gm, '')
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);
}

function sanitizeFilename(name, maxLength = 180) {
  if (!name || typeof name !== 'string') return 'media-target';
  let decoded = name;
  try {
    decoded = decodeURIComponent(name);
  } catch {}

  // Strip path traversal sequences, slashes, and control characters
  let clean = decoded
    .replace(/^.*[\\\/]/, '') // Strip leading path
    .replace(/(\.\.[\/\\])+/g, '') // Strip traversal
    .replace(/\.\.+/g, '') // Strip multiple dots
    .replace(/[^a-zA-Z0-9._\- ]/g, '_')
    .replace(/^_+/, '')
    .trim()
    .slice(0, maxLength);

  return clean || 'media-target';
}

// --- 4. Client IP Resolution & Distributed Rate Limiter ---

/**
 * Normalizes IPv4 and IPv6 strings (e.g. ::ffff:192.0.2.1 -> 192.0.2.1).
 */
function normalizeIp(ipStr) {
  if (!ipStr || typeof ipStr !== 'string') return '127.0.0.1';
  let cleaned = ipStr.trim();
  if (cleaned.startsWith('::ffff:')) {
    cleaned = cleaned.slice(7);
  }
  if (net.isIP(cleaned)) {
    return cleaned;
  }
  return '127.0.0.1';
}

/**
 * Resolves trusted client IP in Vercel serverless or standard proxy environments.
 * Prioritizes platform-injected edge headers (x-vercel-forwarded-for) and normalizes IPv4/IPv6.
 */
function getTrustedClientIp(req) {
  if (!req) return '127.0.0.1';

  const headers = req.headers || {};
  
  // Platform / deployment trust boundary ONLY from server environment (never inferred from client headers)
  const isVercel = Boolean(process.env.VERCEL) || Boolean(process.env.VERCEL_ENV);
  const isTrustedProxy = isVercel || process.env.TRUSTED_PROXY === 'true';

  // 1. If running on Vercel platform, platform-injected edge header is authoritative
  if (isVercel) {
    if (headers['x-vercel-forwarded-for']) {
      const firstIp = headers['x-vercel-forwarded-for'].split(',')[0].trim();
      if (firstIp) return normalizeIp(firstIp);
    }
    if (headers['x-real-ip']) {
      return normalizeIp(headers['x-real-ip']);
    }
    if (headers['x-forwarded-for']) {
      const leftmost = headers['x-forwarded-for'].split(',')[0].trim();
      if (leftmost) return normalizeIp(leftmost);
    }
  }

  // 2. If running behind an explicitly configured trusted reverse proxy (TRUSTED_PROXY=true)
  if (isTrustedProxy) {
    if (headers['x-real-ip']) {
      return normalizeIp(headers['x-real-ip']);
    }
    if (headers['x-forwarded-for']) {
      const leftmost = headers['x-forwarded-for'].split(',')[0].trim();
      if (leftmost) return normalizeIp(leftmost);
    }
  }

  // 3. Direct Node.js / Localhost / Test connections without trusted proxy configuration:
  // Forwarded headers MUST NEVER be trusted to establish client identity or bypass rate limiting.
  const socketAddr = req.socket?.remoteAddress || req.connection?.remoteAddress || (typeof req.ip === 'string' ? req.ip : null);
  if (socketAddr) {
    return normalizeIp(socketAddr);
  }

  return '127.0.0.1';
}

/**
 * Distributed Rate Limiter with Upstash Redis REST enforcement for Production / Vercel
 * and an in-memory sliding-window token bucket for development / test environments only.
 */
function createRateLimiter({ windowMs = 60000, maxRequests = 30, message = 'Rate limit exceeded. Please wait a moment before trying again.' }) {
  const ipHits = new Map();
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const hasDistributedRedis = Boolean(redisUrl && redisToken);

  // Distinguish production deployment vs development/test
  const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL) || process.env.VERCEL_ENV === 'production';
  const isTestOrDev = process.env.NODE_ENV === 'test' || (!isProduction && process.env.NODE_ENV !== 'production');

  // Periodic in-memory garbage collection for dev/test fallback
  if (isTestOrDev) {
    setInterval(() => {
      const now = Date.now();
      for (const [ip, data] of ipHits.entries()) {
        if (now - data.resetTime > windowMs) {
          ipHits.delete(ip);
        }
      }
    }, 180000).unref();
  }

  return async (req, res, next) => {
    const ip = getTrustedClientIp(req);
    const now = Date.now();

    // 1. Production / Vercel Environment MUST enforce Upstash Redis (No silent in-memory fallback)
    if (isProduction && !isTestOrDev) {
      if (!hasDistributedRedis) {
        console.error('[RateLimiter Configuration Error] UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required in production.');
        return res.status(503).json({
          error: 'Rate limiting service is not properly configured for production. UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required.'
        });
      }

      try {
        const key = `ratelimit:${ip}:${Math.floor(now / windowMs)}`;
        const expireSeconds = Math.ceil(windowMs / 1000) * 2;
        const response = await fetch(`${redisUrl}/pipeline`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${redisToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify([
            ['INCR', key],
            ['EXPIRE', key, expireSeconds]
          ])
        });

        if (response.ok) {
          const data = await response.json();
          const count = data[0]?.result || 1;
          if (count > maxRequests) {
            const retryAfterSec = Math.ceil(windowMs / 1000);
            res.setHeader('Retry-After', retryAfterSec);
            return res.status(429).json({
              error: message,
              retryAfterSeconds: retryAfterSec
            });
          }
          return next();
        } else {
          console.error(`[RateLimiter Error] Upstash Redis returned HTTP ${response.status}`);
          return res.status(503).json({
            error: 'Rate limiting service temporarily unavailable. Please try again shortly.'
          });
        }
      } catch (redisErr) {
        console.error('[RateLimiter Error] Upstash Redis connection failed:', redisErr.message);
        return res.status(503).json({
          error: 'Rate limiting service temporarily unavailable. Please try again shortly.'
        });
      }
    }

    // 2. Development & Test Fallback: In-Memory Sliding-Window Token Bucket
    let record = ipHits.get(ip);
    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + windowMs };
      ipHits.set(ip, record);
      return next();
    }

    record.count++;
    if (record.count > maxRequests) {
      const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSec);
      return res.status(429).json({
        error: message,
        retryAfterSeconds: retryAfterSec
      });
    }

    next();
  };
}

// --- 5. Fact-Check Domain & Source Verification ---

const ACCREDITED_FACT_CHECK_DOMAINS = [
  'reuters.com',
  'apnews.com',
  'snopes.com',
  'bbc.com',
  'bbc.co.uk',
  'factcheck.org',
  'afp.com',
  'factcheck.afp.com',
  'who.int',
  'politifact.com',
  'fullfact.org',
  'leadstories.com',
  'checkyourfact.com',
  'usatoday.com',
  'washingtonpost.com',
  'nytimes.com'
];

const ACCREDITED_ORGANIZATION_NAMES = [
  'reuters',
  'ap',
  'associated press',
  'snopes',
  'bbc',
  'afp',
  'agence france-presse',
  'factcheck.org',
  'factcheck',
  'who',
  'world health organization',
  'politifact',
  'full fact',
  'fullfact',
  'lead stories',
  'leadstories',
  'check your fact',
  'checkyourfact',
  'usa today',
  'washington post',
  'new york times'
];

/**
 * Live Fact-Check Article Verifier
 * Safely fetches remote article via SSRF-shielded HTTP/HTTPS client,
 * confirms HTTP 200, checks text/html MIME type, extracts title/meta description,
 * and checks relevance against the analyzed claim.
 */
async function verifyFactCheckArticle(rawUrl, claimText = '') {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return {
      isVerified: false,
      status: 'AI_SUGGESTED_CANDIDATE',
      verificationNote: 'AI-suggested source — not independently verified'
    };
  }

  let parsed;
  try {
    parsed = new URL(rawUrl.trim());
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {
        isVerified: false,
        status: 'AI_SUGGESTED_CANDIDATE',
        verificationNote: 'AI-suggested source — not independently verified'
      };
    }
  } catch {
    return {
      isVerified: false,
      status: 'AI_SUGGESTED_CANDIDATE',
      verificationNote: 'AI-suggested source — not independently verified'
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const isAccreditedDomain = ACCREDITED_FACT_CHECK_DOMAINS.some(domain =>
    hostname === domain || hostname.endsWith('.' + domain)
  );

  if (!isAccreditedDomain) {
    return {
      isVerified: false,
      status: 'UNVERIFIED_DOMAIN',
      verificationNote: 'AI-suggested source — not independently verified'
    };
  }

  try {
    const fetched = await safeFetchMedia(parsed.toString(), 2 * 1024 * 1024);
    if (!fetched || !fetched.buffer) {
      return {
        isVerified: false,
        status: 'AI_SUGGESTED_CANDIDATE',
        verificationNote: 'AI-suggested source — not independently verified'
      };
    }

    const htmlSnippet = fetched.buffer.slice(0, 100000).toString('utf-8');
    const isHtml = (fetched.mimeType && fetched.mimeType.includes('text/html')) ||
                   /<html|<!doctype html|<body|<title/i.test(htmlSnippet);

    if (!isHtml) {
      return {
        isVerified: false,
        status: 'AI_SUGGESTED_CANDIDATE',
        verificationNote: 'AI-suggested source — not independently verified'
      };
    }

    let articleTitle = null;
    let metaDescription = null;

    const titleMatch = htmlSnippet.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      articleTitle = sanitizeClaimText(titleMatch[1].replace(/\s+/g, ' '), 200);
    }

    const metaMatch = htmlSnippet.match(/<meta[^>]+(?:name|property)=["'](?:description|og:description|og:title)["'][^>]+content=["']([^"']+)["']/i);
    if (metaMatch && metaMatch[1]) {
      metaDescription = sanitizeClaimText(metaMatch[1].replace(/\s+/g, ' '), 300);
    }

    let hasTopicRelevance = true;
    if (claimText && typeof claimText === 'string' && claimText.trim().length > 0) {
      const claimWords = claimText.toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 3 && !['this', 'that', 'with', 'from', 'have', 'were', 'what', 'when', 'where', 'image', 'photo', 'video', 'news'].includes(w));

      if (claimWords.length > 0) {
        const combinedText = `${articleTitle || ''} ${metaDescription || ''} ${htmlSnippet.slice(0, 5000)}`.toLowerCase();
        const matchingWordCount = claimWords.filter(w => combinedText.includes(w)).length;
        hasTopicRelevance = matchingWordCount >= 1;
      }
    }

    if (articleTitle && hasTopicRelevance) {
      return {
        isVerified: true,
        status: 'INDEPENDENTLY_VERIFIED',
        articleTitle,
        metaDescription,
        verificationNote: `Independently verified published report: "${articleTitle}"`
      };
    }

    return {
      isVerified: false,
      status: 'AI_SUGGESTED_CANDIDATE',
      verificationNote: 'AI-suggested source — not independently verified'
    };
  } catch (fetchErr) {
    return {
      isVerified: false,
      status: 'AI_SUGGESTED_CANDIDATE',
      verificationNote: 'AI-suggested source — not independently verified'
    };
  }
}

function validateFactCheckSource(source, serverVerification = null) {
  if (!source || typeof source !== 'object') return null;
  const name = sanitizeClaimText(source.name || '', 100);
  const claim = sanitizeClaimText(source.claim || '', 300);
  const rawUrl = source.url && typeof source.url === 'string' ? source.url.trim() : null;

  if (!name) return null;

  const normalizedName = name.toLowerCase();
  const isAccreditedOrg = ACCREDITED_ORGANIZATION_NAMES.some(org => 
    normalizedName.includes(org) || org.includes(normalizedName)
  );

  let verifiedUrl = null;
  let isAccreditedDomain = false;

  if (rawUrl) {
    try {
      const parsed = new URL(rawUrl);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        const host = parsed.hostname.toLowerCase();
        isAccreditedDomain = ACCREDITED_FACT_CHECK_DOMAINS.some(domain => 
          host === domain || host.endsWith('.' + domain)
        );
        // Ensure destination is an accredited domain and not a private/internal IP
        if (isAccreditedDomain && !isPrivateOrInternalIP(host)) {
          verifiedUrl = parsed.toString();
        }
      }
    } catch {
      verifiedUrl = null;
    }
  }

  // Reject hallucinated sources that are neither accredited organizations nor have accredited URLs
  if (!isAccreditedOrg && !isAccreditedDomain) {
    return null;
  }

  // Curated benchmark reference cases
  const isKnownBenchmark = Boolean(source.isBenchmark);

  let status = 'AI_SUGGESTED_CANDIDATE';
  let isIndependentlyVerified = false;
  let verifiedTitle = null;
  let verificationNote = 'AI-suggested source — not independently verified';

  if (isKnownBenchmark) {
    status = sanitizeClaimText(source.status || 'BENCHMARK_REFERENCE', 50);
    verificationNote = 'Benchmark reference evidence (historical incident documentation).';
  } else if (
    serverVerification &&
    typeof serverVerification === 'object' &&
    serverVerification.isVerified === true &&
    typeof serverVerification.articleTitle === 'string' &&
    serverVerification.articleTitle.trim().length > 0
  ) {
    // ONLY server-side verification from verifyFactCheckArticle() establishes INDEPENDENTLY_VERIFIED
    // Never trust model/Gemini output fields (isIndependentlyVerified, verifiedTitle, status)
    status = 'INDEPENDENTLY_VERIFIED';
    isIndependentlyVerified = true;
    verifiedTitle = sanitizeClaimText(serverVerification.articleTitle, 200);
    verificationNote = `Independently verified published report: "${verifiedTitle}"`;
  } else {
    // If live verification was not performed or failed
    status = 'AI_SUGGESTED_CANDIDATE';
    isIndependentlyVerified = false;
    verifiedTitle = null;
    verificationNote = 'AI-suggested source — not independently verified';
  }

  return {
    name,
    status,
    claim: claim || 'Documented report cataloged in public registry.',
    url: verifiedUrl,
    isVerifiedDomain: Boolean(verifiedUrl),
    isBenchmark: Boolean(isKnownBenchmark),
    isIndependentlyVerified,
    verifiedTitle,
    verificationNote
  };
}

// --- 6. Error Masking Utility ---

/**
 * Sanitizes and redacts sensitive patterns (passwords, tokens, API keys, secrets)
 * from server diagnostic logs to prevent secret leakage into production log streams.
 */
function redactSensitiveLog(text) {
  if (!text || typeof text !== 'string') return '';
  let sanitized = text;

  // Redact known active environment secrets if present
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5) {
    sanitized = sanitized.split(process.env.GEMINI_API_KEY).join('[REDACTED_GEMINI_KEY]');
  }
  if (process.env.UPSTASH_REDIS_REST_TOKEN && process.env.UPSTASH_REDIS_REST_TOKEN.length > 5) {
    sanitized = sanitized.split(process.env.UPSTASH_REDIS_REST_TOKEN).join('[REDACTED_REDIS_TOKEN]');
  }

  // Redact Google / Gemini API key signature (AIzaSy...)
  sanitized = sanitized.replace(/AIzaSy[a-zA-Z0-9_-]{10,}/g, '[REDACTED_API_KEY]');

  // Redact credentials (passwords, secrets, tokens, api keys) with := or space separators
  sanitized = sanitized.replace(
    /((?:api[_-]?key|apikey|secret|password|passwd|pwd|access[_-]?token|refresh[_-]?token|auth[_-]?token|token)\s*[:=\s]\s*['"]?)([^'"\s,;&]+)(['"]?)/gi,
    '$1[REDACTED_SECRET]$3'
  );

  // Redact Bearer and Basic authorization headers/tokens
  sanitized = sanitized.replace(
    /(Authorization\s*[:=\s]\s*['"]?(?:Bearer|Basic)\s+)([^'"\s,;&]+)(['"]?)/gi,
    '$1[REDACTED_TOKEN]$3'
  );
  sanitized = sanitized.replace(
    /\b(?:Bearer|Basic)\s+([a-zA-Z0-9._~+/-]{10,}=*)/gi,
    'Bearer [REDACTED_TOKEN]'
  );

  // Redact Cookie and Session values
  sanitized = sanitized.replace(
    /((?:cookie|session|set-cookie)\s*[:=\s]\s*['"]?)([^'"\r\n;]+)(['"]?)/gi,
    '$1[REDACTED_COOKIE]$3'
  );

  return sanitized;
}

function maskError(err, context = 'Forensic Engine') {
  const correlationId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36);
  
  // Extract and sanitize error details for safe server-side logging
  const rawLog = err ? (err.stack || err.message || String(err)) : 'Unknown internal exception';
  const redactedLog = redactSensitiveLog(rawLog);

  console.error(`[Security Log] [${correlationId}] ${context} Error:`, redactedLog);

  return {
    error: 'An internal error occurred during analysis. Please check your media format and try again.',
    correlationId
  };
}

module.exports = {
  isPrivateOrInternalIP,
  validateAndResolveUrl,
  sanitizeUrl,
  safeFetchMedia,
  detectMimeTypeFromBuffer,
  validateUpload,
  sanitizeClaimText,
  sanitizeFilename,
  getTrustedClientIp,
  createRateLimiter,
  verifyFactCheckArticle,
  validateFactCheckSource,
  redactSensitiveLog,
  maskError,
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS,
  ACCREDITED_FACT_CHECK_DOMAINS,
  MAX_FILE_SIZE_BYTES,
  MAX_URL_FETCH_SIZE_BYTES
};
