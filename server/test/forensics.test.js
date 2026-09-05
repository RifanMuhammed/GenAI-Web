// Automated Forensic Engine & Security Unit Tests
// Comprehensive verification suite for Security, SSRF, Magic-Bytes, Rate Limiting, & Provenance Integrity

const assert = require('assert');
const { analyzeImage } = require('../engines/imageForensics');
const { analyzeAudio } = require('../engines/audioForensics');
const { analyzeVideo } = require('../engines/videoForensics');
const { verifyClaim } = require('../engines/claimVerifier');
const { lookupProvenance } = require('../engines/provenanceEngine');
const { 
  validateUpload, 
  sanitizeUrl, 
  validateAndResolveUrl, 
  isPrivateOrInternalIP, 
  detectMimeTypeFromBuffer, 
  sanitizeClaimText, 
  sanitizeFilename,
  createRateLimiter,
  maskError
} = require('../security');

console.log('\n============================================================');
console.log('  🧪 Running ProofLens Comprehensive Security & Forensic Test Suite');
console.log('============================================================\n');

let passed = 0;
let total = 0;

async function test(name, fn) {
  total++;
  try {
    await fn();
    console.log(`  \x1b[32m✔ PASS\x1b[0m ${name}`);
    passed++;
  } catch (err) {
    console.error(`  \x1b[31m✖ FAIL\x1b[0m ${name}`);
    console.error(`    Error: ${err.message}`);
  }
}

async function runAllTests() {
  // 1. Image Forensics Tests (Multimodal with Fallback)
  await test('Image Engine: Correctly flags diffusion synthetic markers for AI prompts', async () => {
    const result = await analyzeImage({ filename: 'midjourney_alien_pink_sky.jpg' });
    assert.strictEqual(result.mediaType, 'image');
    assert.ok(result.authenticityScore < 30, 'Synthetic image should score low authenticity');
    assert.strictEqual(result.status, 'SYNTHETIC_MANIPULATED');
    assert.ok(result.redFlags.length > 0, 'Must produce red flags for synthetic media');
  });

  await test('Image Engine: Correctly verifies authentic camera captures & celebrity photojournalism', async () => {
    const result = await analyzeImage({ filename: 'canon_eos_shah_rukh_khan_cannes.jpg' });
    assert.strictEqual(result.mediaType, 'image');
    assert.ok(result.authenticityScore > 75, 'Authentic camera capture should score high');
    assert.strictEqual(result.status, 'VERIFIED_AUTHENTIC');
  });

  // 2. Audio Voice Clone Forensics Tests
  await test('Audio Engine: Detects 16.2kHz neural vocoder downsampling in voice clones', async () => {
    const result = analyzeAudio({ filename: 'elevenlabs_ceo_urgent_transfer.wav' });
    assert.strictEqual(result.mediaType, 'audio');
    assert.ok(result.forensicMetrics.spectralCutoffKhz <= 17, 'Should flag 16.2kHz ceiling');
    assert.ok(result.forensicMetrics.pitchJitterVariance < 0.1, 'Should detect robotic pitch flatness');
    assert.strictEqual(result.status, 'SYNTHETIC_MANIPULATED');
  });

  await test('Audio Engine: Verifies wide-bandwidth natural broadcast audio', async () => {
    const result = analyzeAudio({ filename: 'npr_studio_podcast_interview.wav' });
    assert.ok(result.authenticityScore > 75, 'Natural speech should pass with high score');
    assert.ok(result.forensicMetrics.spectralCutoffKhz > 20, 'Should have full 20+ kHz overtones');
  });

  // 3. Video Deepfake Forensics Tests
  await test('Video Engine: Identifies temporal boundary and lip-sync viseme lag', async () => {
    const result = await analyzeVideo({ filename: 'simswap_politician_concession.mp4' });
    assert.strictEqual(result.mediaType, 'video');
    assert.ok(result.forensicMetrics.temporalInconsistencyScore > 80, 'Must flag high temporal jitter');
    assert.ok(result.timelineFrames.length > 0, 'Must produce keyframe anomaly timeline');
  });

  // 4. SSRF & URL Protection Suite
  await test('SSRF Protection: Blocks local, loopback and dangerous URI schemes', async () => {
    assert.strictEqual(sanitizeUrl('file:///etc/passwd'), null, 'file:// URI must be blocked');
    assert.strictEqual(sanitizeUrl('javascript:alert(1)'), null, 'javascript: URI must be blocked');
    assert.strictEqual(sanitizeUrl('http://localhost:3000'), null, 'localhost must be blocked');
    assert.strictEqual(sanitizeUrl('http://127.0.0.1:8080/admin'), null, '127.0.0.1 must be blocked');
    assert.strictEqual(sanitizeUrl('http://0.0.0.0'), null, '0.0.0.0 must be blocked');
    assert.strictEqual(sanitizeUrl('http://service.internal'), null, 'Internal domain must be blocked');
    assert.strictEqual(sanitizeUrl('https://example.com/media.jpg'), 'https://example.com/media.jpg');
  });

  await test('SSRF Protection: isPrivateOrInternalIP blocks private IPv4, IPv6, Link-Local & Cloud Metadata', async () => {
    // Cloud metadata endpoint
    assert.strictEqual(isPrivateOrInternalIP('169.254.169.254'), true, 'AWS/GCP metadata IP 169.254.169.254 must be blocked');
    // Private IPv4 ranges
    assert.strictEqual(isPrivateOrInternalIP('10.0.0.1'), true, '10.0.0.0/8 must be blocked');
    assert.strictEqual(isPrivateOrInternalIP('172.16.5.10'), true, '172.16.0.0/12 must be blocked');
    assert.strictEqual(isPrivateOrInternalIP('192.168.1.1'), true, '192.168.0.0/16 must be blocked');
    assert.strictEqual(isPrivateOrInternalIP('127.0.0.1'), true, 'Loopback must be blocked');
    assert.strictEqual(isPrivateOrInternalIP('100.64.0.1'), true, 'CGNAT must be blocked');
    // IPv6 Loopback, Link-Local & Unique Local
    assert.strictEqual(isPrivateOrInternalIP('::1'), true, 'IPv6 loopback ::1 must be blocked');
    assert.strictEqual(isPrivateOrInternalIP('fe80::1'), true, 'IPv6 link-local must be blocked');
    assert.strictEqual(isPrivateOrInternalIP('fc00::1'), true, 'IPv6 ULA must be blocked');
    // Decimal & Hex encoded IP representations
    assert.strictEqual(isPrivateOrInternalIP('2130706433'), true, 'Decimal 127.0.0.1 (2130706433) must be blocked');
    assert.strictEqual(isPrivateOrInternalIP('0x7f000001'), true, 'Hex 127.0.0.1 (0x7f000001) must be blocked');
    // Public safe IPs
    assert.strictEqual(isPrivateOrInternalIP('8.8.8.8'), false, 'Google DNS 8.8.8.8 should be allowed');
    assert.strictEqual(isPrivateOrInternalIP('1.1.1.1'), false, 'Cloudflare 1.1.1.1 should be allowed');
  });

  await test('SSRF Protection: validateAndResolveUrl rejects loopback and invalid URLs', async () => {
    const loopback = await validateAndResolveUrl('http://127.0.0.1/test.jpg');
    assert.strictEqual(loopback.isValid, false, '127.0.0.1 URL must fail resolution check');

    const metadata = await validateAndResolveUrl('http://169.254.169.254/latest/meta-data/');
    assert.strictEqual(metadata.isValid, false, 'Cloud metadata URL must fail resolution check');

    const validUrl = await validateAndResolveUrl('https://images.unsplash.com/photo-1');
    assert.strictEqual(validUrl.isValid, true, 'Valid public HTTPS URL must succeed');
  });

  // 5. Binary Signature & Magic Byte Validation
  await test('Magic Bytes: Accurate detection of genuine media signatures', async () => {
    const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);
    assert.strictEqual(detectMimeTypeFromBuffer(jpegBuffer), 'image/jpeg');

    const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    assert.strictEqual(detectMimeTypeFromBuffer(pngBuffer), 'image/png');

    const gifBuffer = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);
    assert.strictEqual(detectMimeTypeFromBuffer(gifBuffer), 'image/gif');

    const webpBuffer = Buffer.from([0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50]);
    assert.strictEqual(detectMimeTypeFromBuffer(webpBuffer), 'image/webp');

    const fakeJpgExe = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00]); // DOS / PE binary
    assert.strictEqual(detectMimeTypeFromBuffer(fakeJpgExe), null);
  });

  await test('Upload Security: validateUpload verifies magic bytes and blocks malicious payloads', async () => {
    const genuineImage = {
      originalname: 'photo.jpg',
      size: 1024 * 1024,
      buffer: Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46])
    };
    const validRes = validateUpload(genuineImage, 'image');
    assert.strictEqual(validRes.isValid, true);
    assert.strictEqual(validRes.detectedMimeType, 'image/jpeg');

    const disguisedExe = {
      originalname: 'malicious.jpg',
      size: 1024 * 1024,
      buffer: Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00]) // Executable header
    };
    const invalidRes = validateUpload(disguisedExe, 'image');
    assert.strictEqual(invalidRes.isValid, false);
    assert.ok(invalidRes.error.includes('signature validation failed'));

    const oversized = {
      originalname: 'huge.jpg',
      size: 60 * 1024 * 1024, // 60MB > 50MB
      buffer: Buffer.from([0xff, 0xd8, 0xff, 0xe0])
    };
    assert.strictEqual(validateUpload(oversized, 'image').isValid, false);
  });

  // 6. Input Sanitization & Path Traversal Guards
  await test('Input Sanitization: Strips XSS payloads and directory traversal sequences', async () => {
    const dirtyClaim = '<script>alert("xss")</script><img src=x onerror=alert(1)>Viral Breaking News Claim';
    const cleanClaim = sanitizeClaimText(dirtyClaim);
    assert.ok(!cleanClaim.includes('<script>'), 'Script tags stripped');
    assert.ok(!cleanClaim.includes('<img'), 'HTML tags stripped');
    assert.ok(cleanClaim.includes('Viral Breaking News Claim'));

    const traversalFilename = '../../../../etc/shadow';
    const cleanFilename = sanitizeFilename(traversalFilename);
    assert.ok(!cleanFilename.includes('..'), 'Path traversal must be stripped');
    assert.strictEqual(cleanFilename, 'shadow');
  });

  // 7. Error Masking & Information Leakage Prevention
  await test('Error Masking: Returns safe correlation IDs without revealing stack traces', async () => {
    const internalErr = new Error('Secret DB connection failed at /var/www/internal/db.js:42 - password=secret123');
    const masked = maskError(internalErr, 'Test Context');
    assert.ok(masked.correlationId, 'Must generate correlation ID');
    assert.ok(!masked.error.includes('secret123'), 'Secrets must never be in error message');
    assert.ok(!masked.error.includes('/var/www/'), 'Paths must never be in error message');
  });

  // 8. Sliding-Window Rate Limiter
  await test('Rate Limiting: Middleware enforces sliding-window threshold', async () => {
    const limiter = createRateLimiter({ windowMs: 1000, maxRequests: 2 });
    const req = { headers: { 'x-forwarded-for': '192.0.2.99' }, socket: {} };
    let statusCalled = null;
    let jsonCalled = null;
    const res = {
      setHeader: () => {},
      status: (code) => {
        statusCalled = code;
        return { json: (data) => { jsonCalled = data; } };
      }
    };

    let nextCount = 0;
    const next = () => { nextCount++; };

    limiter(req, res, next); // 1st request
    limiter(req, res, next); // 2nd request
    assert.strictEqual(nextCount, 2, 'First 2 requests should pass');

    limiter(req, res, next); // 3rd request (exceeds limit)
    assert.strictEqual(statusCalled, 429, '3rd request should receive HTTP 429');
    assert.ok(jsonCalled && jsonCalled.error, 'Should return rate limit error message');
  });

  // 9. Fact-Checking & Provenance Integrity
  await test('Provenance Integrity: Benchmark cases retain citations, user uploads are honest', async () => {
    // Known benchmark case
    const benchmark = lookupProvenance({ title: 'pope puffer jacket', authenticityScore: 8 });
    assert.ok(benchmark.factCheckSources.length > 0, 'Benchmark cases should have verified citations');

    // Arbitrary live user upload without external corroboration
    const userUpload = lookupProvenance({ title: 'random_user_photo_9281.jpg', authenticityScore: 12 });
    assert.strictEqual(userUpload.factCheckSources.length, 0, 'Arbitrary uploads must not invent fake news citations');
  });

  console.log('\n------------------------------------------------------------');
  console.log(`  📊 Test Summary: ${passed}/${total} Passed (${Math.round((passed/total)*100)}%)`);
  console.log('============================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runAllTests();
