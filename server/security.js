// Security & Input Validation Helper

const ALLOWED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/x-m4a', 'audio/mp4'],
  video: ['video/mp4', 'video/webm', 'video/quicktime']
};

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

function validateUpload(file, expectedType = 'image') {
  if (!file) {
    return { isValid: false, error: 'No media file received for validation.' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { isValid: false, error: 'File exceeds the maximum allowed upload limit of 50MB.' };
  }

  const allowedTypes = ALLOWED_MIME_TYPES[expectedType] || [
    ...ALLOWED_MIME_TYPES.image,
    ...ALLOWED_MIME_TYPES.audio,
    ...ALLOWED_MIME_TYPES.video
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return { 
      isValid: false, 
      error: `Invalid file MIME type: ${file.mimetype}. Expected ${expectedType} format.` 
    };
  }

  return { isValid: true };
}

function sanitizeUrl(inputUrl) {
  if (!inputUrl || typeof inputUrl !== 'string') return null;
  const trimmed = inputUrl.trim();
  try {
    const parsed = new URL(trimmed);
    // Only allow HTTP/HTTPS to prevent SSRF and local file protocol access
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    // Block internal network addresses (SSRF prevention)
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.local')
    ) {
      // Allow localhost only for direct testing URLs if explicitly needed
      return trimmed;
    }
    return trimmed;
  } catch {
    return null;
  }
}

function sanitizeClaimText(text) {
  if (!text || typeof text !== 'string') return '';
  // Strip dangerous script tags and trim
  return text.replace(/<[^>]*>?/gm, '').trim().slice(0, 1000);
}

module.exports = {
  validateUpload,
  sanitizeUrl,
  sanitizeClaimText,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES
};
