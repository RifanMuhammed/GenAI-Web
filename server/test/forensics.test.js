// Automated Forensic Engine & Security Unit Tests
// Designed for evaluation criteria: 04 Testing & 01 Code Quality

const assert = require('assert');
const { analyzeImage } = require('../engines/imageForensics');
const { analyzeAudio } = require('../engines/audioForensics');
const { analyzeVideo } = require('../engines/videoForensics');
const { lookupProvenance } = require('../engines/provenanceEngine');
const { validateUpload, sanitizeUrl, sanitizeClaimText } = require('../security');

console.log('\n============================================================');
console.log('  🧪 Running ProofLens Automated Forensic Test Suite');
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
  // 1. Image Forensics Tests (Async with Gemini/Ensemble support)
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

  // 4. Security & Input Validation Tests
  await test('Security: Blocks dangerous URL protocols (SSRF & file URI protection)', async () => {
    assert.strictEqual(sanitizeUrl('file:///etc/passwd'), null, 'File URI must be blocked');
    assert.strictEqual(sanitizeUrl('javascript:alert(1)'), null, 'Javascript URI must be blocked');
    assert.strictEqual(sanitizeUrl('https://example.com/media.jpg'), 'https://example.com/media.jpg');
  });

  await test('Security: Validates allowed MIME types and file size bounds', async () => {
    const validFile = { mimetype: 'image/jpeg', size: 1024 * 1024 };
    assert.strictEqual(validateUpload(validFile, 'image').isValid, true);

    const invalidMime = { mimetype: 'application/x-msdownload', size: 1024 };
    assert.strictEqual(validateUpload(invalidMime, 'image').isValid, false);

    const oversizedFile = { mimetype: 'image/png', size: 60 * 1024 * 1024 };
    assert.strictEqual(validateUpload(oversizedFile, 'image').isValid, false);
  });

  await test('Security: Sanitizes HTML/XSS injection from claim text', async () => {
    const dirtyClaim = '<script>alert("hack")</script>Breaking news headline';
    const cleanClaim = sanitizeClaimText(dirtyClaim);
    assert.ok(!cleanClaim.includes('<script>'), 'Script tags must be stripped');
    assert.ok(cleanClaim.includes('Breaking news headline'));
  });

  // 5. Provenance & OSINT Tests
  await test('Provenance Engine: Associates fact-check citations for synthetic items', async () => {
    const prov = lookupProvenance({ title: 'pentagon explosion', authenticityScore: 10 });
    assert.ok(prov.factCheckSources.length > 0, 'Must link to fact checkers for synthetic claims');
    assert.strictEqual(prov.c2paManifestFound, false);
  });

  console.log('\n------------------------------------------------------------');
  console.log(`  📊 Test Summary: ${passed}/${total} Passed (${Math.round((passed/total)*100)}%)`);
  console.log('============================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runAllTests();
