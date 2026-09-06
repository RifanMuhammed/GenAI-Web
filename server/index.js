const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');

const sampleCases = require('./sampleCases');
const { analyzeImage } = require('./engines/imageForensics');
const { analyzeAudio } = require('./engines/audioForensics');
const { analyzeVideo } = require('./engines/videoForensics');
const { verifyClaim } = require('./engines/claimVerifier');
const { lookupProvenance } = require('./engines/provenanceEngine');
const { generateExplanation } = require('./engines/aiExplainer');
const { 
  validateUpload, 
  sanitizeUrl, 
  sanitizeClaimText, 
  sanitizeFilename,
  safeFetchMedia,
  detectMimeTypeFromBuffer,
  createRateLimiter,
  maskError,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES 
} = require('./security');

const app = express();
const PORT = process.env.PORT || 3001;

// Disable fingerprinting header
app.disable('x-powered-by');

// Trust reverse proxy (e.g. Vercel / Cloudflare) for accurate client IP in rate limiting
app.set('trust proxy', 1);

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(self), microphone=(self), geolocation=()');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' https: data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https:; font-src 'self' https://fonts.gstatic.com data: https:; img-src 'self' data: blob: https:; media-src 'self' data: blob: https:; connect-src 'self' https: wss: ws: http://localhost:* ws://localhost:*; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
  );
  // Prevent caching of sensitive analysis API responses
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});

// HTTP Parameter Pollution (HPP) Guard: Normalize query params to single scalar values
app.use((req, res, next) => {
  if (req.query && typeof req.query === 'object') {
    for (const key of Object.keys(req.query)) {
      if (Array.isArray(req.query[key])) {
        req.query[key] = req.query[key][0]; // Take only first scalar to prevent array type confusion
      }
    }
  }
  next();
});

// Strict Origin Whitelist & Controlled Vercel Preview Pattern Matcher
const ALLOWED_ORIGINS = [
  'https://gen-ai-web-45it.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001'
];

const isOriginAllowed = (origin, callback) => {
  // Allow non-browser requests (e.g. mobile apps, curl, server-side tests)
  if (!origin) return callback(null, true);

  if (ALLOWED_ORIGINS.includes(origin)) {
    return callback(null, true);
  }

  // Allow all Vercel domains (*.vercel.app) and local development ports
  const isVercelDomain = /^https:\/\/([a-zA-Z0-9_-]+\.)*vercel\.app$/.test(origin);
  const isLocalDomain = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

  if (isVercelDomain || isLocalDomain) {
    return callback(null, true);
  }

  return callback(new Error('CORS policy: Access denied for this origin.'), false);
};

// Middlewares
app.use(cors({
  origin: isOriginAllowed,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  maxAge: 86400
}));

// Restrict JSON and form body parsing to 1MB to prevent memory exhaustion DoS
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Serve static benchmark sample assets safely
app.use('/benchmarks', express.static(path.join(__dirname, 'public/benchmarks')));
app.use('/benchmarks', express.static(path.join(__dirname, '../client/public/benchmarks')));

// Ensure upload directory exists
const uploadsDir = process.env.VERCEL ? path.join('/tmp', 'uploads') : path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
  } catch (e) {
    console.warn('Upload dir creation notice:', e.message);
  }
}

// Automatic cleanup sweep for temporary files older than 10 minutes
function cleanupOldUploads() {
  if (!fs.existsSync(uploadsDir)) return;
  try {
    const files = fs.readdirSync(uploadsDir);
    const now = Date.now();
    for (const file of files) {
      // Never delete .gitkeep or dotfiles
      if (file === '.gitkeep' || file.startsWith('.')) continue;
      const filePath = path.join(uploadsDir, file);
      try {
        const stats = fs.statSync(filePath);
        if (now - stats.mtimeMs > 10 * 60 * 1000) {
          fs.unlinkSync(filePath);
        }
      } catch {}
    }
  } catch {}
}
setInterval(cleanupOldUploads, 5 * 60 * 1000).unref();

// Helper to safely delete single upload file after analysis
function safeUnlink(filePath) {
  if (!filePath) return;
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (e) {
    // Non-fatal warning
  }
}

// Multer storage configuration with cryptographically secure random names
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safeExt = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '');
    const randomHex = crypto.randomBytes(16).toString('hex');
    cb(null, `prooflens-${Date.now()}-${randomHex}${safeExt || '.bin'}`);
  }
});

const upload = multer({ 
  storage, 
  limits: { 
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1
  }
});

// Note: Static /uploads route is deliberately not mounted to prevent unauthenticated public file access.
// Uploaded files are ephemeral and deleted immediately upon analysis completion.

// Tiered Distributed Rate Limiters
const generalApiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 60,
  message: 'API rate limit exceeded. Please wait a minute before making more requests.'
});

const imageAnalysisLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 20,
  message: 'Image analysis rate limit exceeded. Please wait a minute before submitting further jobs.'
});

const audioAnalysisLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 20,
  message: 'Audio analysis rate limit exceeded. Please wait a minute before submitting further jobs.'
});

const videoAnalysisLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 10,
  message: 'Video analysis rate limit exceeded. Video forensic pipelines are computationally intensive.'
});

const urlAnalysisLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 15,
  message: 'Remote URL analysis rate limit exceeded. Please wait a minute before submitting further requests.'
});

const claimAnalysisLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 20,
  message: 'Claim fact-checking rate limit exceeded. Please wait a minute before submitting further claims.'
});

const liveShieldLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 120,
  message: 'Live shield frame rate limit exceeded.'
});

// --- API Routes ---

// Health & System Diagnostic Info (Public diagnostic)
app.get('/api/health', (req, res) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);
  const hasRedis = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
  const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);

  res.json({
    status: 'online',
    version: '2.0.0',
    platform: 'ProofLens Forensic Intelligence Hub',
    timestamp: new Date().toISOString(),
    environment: isProd ? 'production' : (process.env.NODE_ENV || 'development'),
    services: {
      rateLimiter: {
        driver: hasRedis 
          ? 'Upstash Redis (Distributed Cloud)' 
          : 'In-Memory Sliding-Window Token Bucket (Instance Limiter)',
        status: 'healthy'
      },
      aiForensicEngine: {
        driver: hasGeminiKey ? 'Google Gemini Vision & Multimodal Pipeline' : 'Local Pixel & Signal Processing Forensic Engine',
        status: 'ready'
      }
    },
    standards: ['C2PA-v1.3', 'IEEE-1857-Forensics', 'WCAG-2.1-AA'],
    engines: [
      'ImageDiffusionForensics', 
      'AudioPhonationAnalyzer', 
      'VideoTemporalCoherence', 
      'OSINTProvenanceCorroborator', 
      'ExplainableGenAI'
    ]
  });
});

// Benchmark Arsenal cases (Public static metadata)
app.get('/api/cases', (req, res) => {
  res.json(sampleCases);
});

app.get('/api/cases/:id', (req, res) => {
  const safeId = String(req.params.id || '').replace(/[^a-zA-Z0-9_\-]/g, '');
  const item = sampleCases.find(c => c.id === safeId);
  if (!item) return res.status(404).json({ error: 'Case not found' });
  res.json(item);
});

// Apply general limiter to all stateful / analysis / computation endpoints
app.use('/api/', generalApiLimiter);

// Unified response generator
function buildUnifiedReport(baseAnalysis, filename, url, buffer = null) {
  const { authenticityScore = 50, mediaType = 'image', redFlags = [], detectedGenerator, forensicMetrics } = baseAnalysis;
  const safeName = sanitizeFilename(filename || (url ? path.basename(url) : 'Uploaded Media'));
  const provenance = lookupProvenance({ title: safeName, type: mediaType, authenticityScore });
  const explainer = generateExplanation({ mediaType, authenticityScore, forensicMetrics, redFlags, detectedGenerator });

  const hasMediaBuffer = buffer && Buffer.isBuffer(buffer);
  const mediaSha256 = hasMediaBuffer ? crypto.createHash('sha256').update(buffer).digest('hex') : null;
  const reportUniqueId = 'proof-' + Date.now().toString(36) + '-' + crypto.randomBytes(4).toString('hex');
  const reportDigest = crypto.createHash('sha256').update(reportUniqueId + safeName + (url || '')).digest('hex');

  return {
    id: reportUniqueId,
    timestamp: new Date().toISOString(),
    filename: safeName,
    sourceUrl: sanitizeUrl(url),
    mediaPreview: url ? sanitizeUrl(url) : null,
    mediaSha256,
    sha256: mediaSha256 || reportDigest,
    c2paId: null, // No synthetic C2PA ID generated unless hardware manifest is physically present
    ...baseAnalysis,
    provenance,
    citizenSummary: baseAnalysis.citizenSummary || explainer.citizenSummary,
    sharingGuidance: explainer.sharingGuidance,
    technicalBreakdown: explainer.technicalBreakdown
  };
}

// Image Analysis Endpoint (with magic-byte verification & Gemini Vision support)
app.post('/api/analyze/image', imageAnalysisLimiter, upload.single('mediaFile'), async (req, res) => {
  let uploadedFilePath = null;
  let fileBuffer = null;
  try {
    if (req.file) {
      uploadedFilePath = req.file.path;
      if (fs.existsSync(uploadedFilePath)) {
        try { fileBuffer = fs.readFileSync(uploadedFilePath); } catch {}
      }
      const validation = validateUpload(req.file, 'image');
      if (!validation.isValid) {
        safeUnlink(uploadedFilePath);
        return res.status(400).json({ error: validation.error });
      }
    }

    const filename = req.file ? req.file.filename : (req.body.filename ? sanitizeFilename(req.body.filename) : null);
    const originalName = req.file ? sanitizeFilename(req.file.originalname) : (req.body.filename ? sanitizeFilename(req.body.filename) : '');
    const filePath = uploadedFilePath;
    const mimeType = req.file ? req.file.mimetype : 'image/jpeg';
    const url = sanitizeUrl(req.body.url);
    
    const analysis = await analyzeImage({ filename, originalName, filePath, fileBuffer, mimeType, url });
    const report = buildUnifiedReport(analysis, originalName || filename, url, fileBuffer);
    
    // Clean up temporary upload file after successful analysis to prevent data leaks
    safeUnlink(uploadedFilePath);
    res.json(report);
  } catch (err) {
    safeUnlink(uploadedFilePath);
    const masked = maskError(err, 'Image Analysis Route');
    res.status(500).json(masked);
  }
});

// Audio Analysis Endpoint (with magic-byte verification)
app.post('/api/analyze/audio', audioAnalysisLimiter, upload.single('mediaFile'), (req, res) => {
  let uploadedFilePath = null;
  let fileBuffer = null;
  try {
    if (req.file) {
      uploadedFilePath = req.file.path;
      if (fs.existsSync(uploadedFilePath)) {
        try { fileBuffer = fs.readFileSync(uploadedFilePath); } catch {}
      }
      const validation = validateUpload(req.file, 'audio');
      if (!validation.isValid) {
        safeUnlink(uploadedFilePath);
        return res.status(400).json({ error: validation.error });
      }
    }

    const filename = req.file ? req.file.filename : (req.body.filename ? sanitizeFilename(req.body.filename) : null);
    const originalName = req.file ? sanitizeFilename(req.file.originalname) : (req.body.filename ? sanitizeFilename(req.body.filename) : '');
    const url = sanitizeUrl(req.body.url);
    
    const analysis = analyzeAudio({ filename: originalName || filename, fileBuffer, url });
    const report = buildUnifiedReport(analysis, originalName || filename, url, fileBuffer);
    
    safeUnlink(uploadedFilePath);
    res.json(report);
  } catch (err) {
    safeUnlink(uploadedFilePath);
    const masked = maskError(err, 'Audio Analysis Route');
    res.status(500).json(masked);
  }
});

// Video Analysis Endpoint (with magic-byte verification & Gemini Multimodal Video support)
app.post('/api/analyze/video', videoAnalysisLimiter, upload.single('mediaFile'), async (req, res) => {
  let uploadedFilePath = null;
  let fileBuffer = null;
  try {
    if (req.file) {
      uploadedFilePath = req.file.path;
      if (fs.existsSync(uploadedFilePath)) {
        try { fileBuffer = fs.readFileSync(uploadedFilePath); } catch {}
      }
      const validation = validateUpload(req.file, 'video');
      if (!validation.isValid) {
        safeUnlink(uploadedFilePath);
        return res.status(400).json({ error: validation.error });
      }
    }

    const filename = req.file ? req.file.filename : (req.body.filename ? sanitizeFilename(req.body.filename) : null);
    const originalName = req.file ? sanitizeFilename(req.file.originalname) : (req.body.filename ? sanitizeFilename(req.body.filename) : '');
    const filePath = uploadedFilePath;
    const mimeType = req.file ? req.file.mimetype : 'video/mp4';
    const url = sanitizeUrl(req.body.url);

    const analysis = await analyzeVideo({ filename, originalName, filePath, fileBuffer, mimeType, url });
    const report = buildUnifiedReport(analysis, originalName || filename, url, fileBuffer);
    
    safeUnlink(uploadedFilePath);
    res.json(report);
  } catch (err) {
    safeUnlink(uploadedFilePath);
    const masked = maskError(err, 'Video Analysis Route');
    res.status(500).json(masked);
  }
});

// SSRF-Protected Remote Media & URL Verifier
app.post('/api/analyze/url', urlAnalysisLimiter, async (req, res) => {
  try {
    const rawUrl = req.body.url;
    if (!rawUrl || typeof rawUrl !== 'string') {
      return res.status(400).json({ error: 'Valid URL is required.' });
    }

    // SSRF-Safe Media Download with strict IP validation and timeout
    let fetched;
    try {
      fetched = await safeFetchMedia(rawUrl);
    } catch (fetchErr) {
      return res.status(400).json({ error: fetchErr.message || 'Unable to safely fetch remote media.' });
    }

    const { buffer, finalUrl } = fetched;

    // Validate downloaded buffer using magic-byte binary signature inspection
    const detectedMime = detectMimeTypeFromBuffer(buffer);
    if (!detectedMime) {
      return res.status(400).json({
        error: 'Remote media signature validation failed. Downloaded content is not a supported media format (JPEG, PNG, WebP, GIF, MP3, WAV, OGG, MP4, WebM, MOV).'
      });
    }

    const allAllowedMimes = [
      ...ALLOWED_MIME_TYPES.image,
      ...ALLOWED_MIME_TYPES.audio,
      ...ALLOWED_MIME_TYPES.video
    ];

    if (!allAllowedMimes.includes(detectedMime)) {
      return res.status(400).json({
        error: `Unsupported media format (${detectedMime}). Only standard image, audio, and video formats are supported.`
      });
    }

    // Engine routing is strictly determined by validated magic-byte MIME type
    let analysis;
    if (ALLOWED_MIME_TYPES.audio.includes(detectedMime)) {
      analysis = analyzeAudio({ fileBuffer: buffer, mimeType: detectedMime, url: finalUrl });
    } else if (ALLOWED_MIME_TYPES.video.includes(detectedMime)) {
      analysis = await analyzeVideo({ fileBuffer: buffer, mimeType: detectedMime, url: finalUrl });
    } else {
      analysis = await analyzeImage({ fileBuffer: buffer, mimeType: detectedMime, url: finalUrl });
    }

    const report = buildUnifiedReport(analysis, null, finalUrl, buffer);
    res.json(report);
  } catch (err) {
    const masked = maskError(err, 'URL Analysis Route');
    res.status(500).json(masked);
  }
});

// Viral News Claim / Text Verification with Gemini AI Fact-Checking Engine
app.post('/api/analyze/claim', claimAnalysisLimiter, async (req, res) => {
  try {
    const rawClaim = req.body.claimText;
    const claimText = sanitizeClaimText(rawClaim);
    if (!claimText) {
      return res.status(400).json({ error: 'Claim text is required and must not be empty.' });
    }

    const report = await verifyClaim({ claimText });
    res.json(report);
  } catch (err) {
    const masked = maskError(err, 'Claim Verification Route');
    res.status(500).json(masked);
  }
});

// Live Camera/Audio Frame Verification Endpoint for Live Shield
app.post('/api/verify/live-frame', liveShieldLimiter, (req, res) => {
  try {
    const { hasFace = true, motionJitter = 0.1 } = req.body;
    const safeJitter = Math.min(1.0, Math.max(0.0, Number(motionJitter) || 0.1));
    const anomalyScore = Math.min(100, Math.max(2, Math.round(safeJitter * 85)));
    const isDeepfake = anomalyScore > 65;

    res.json({
      timestamp: Date.now(),
      isSimulation: true,
      analysisMode: 'Client-Heuristic Telemetry Simulation (Demo)',
      anomalyScore,
      isDeepfake,
      faceDetected: Boolean(hasFace),
      landmarkConsistency: isDeepfake ? 42.1 : 97.6,
      blinkRatePerMinute: isDeepfake ? 3.2 : 18.4,
      lipSyncDelayMs: isDeepfake ? 110 : 8,
      statusText: isDeepfake ? '⚠️ SIMULATED ANOMALY FLAGGED (Demo)' : '🛡️ STREAM NOMINAL (Simulated Stream Check)',
      disclaimer: 'Live Shield real-time telemetry operates as a client-side demonstration simulation.'
    });
  } catch (err) {
    const masked = maskError(err, 'Live Frame Route');
    res.status(500).json(masked);
  }
});

// Generic 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Resource not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: `File size exceeds the limit of ${Math.round(MAX_FILE_SIZE_BYTES / (1024 * 1024))}MB.` });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  const masked = maskError(err, 'Global Express Handler');
  res.status(500).json(masked);
});

if (require.main === module || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`ProofLens Forensic Backend running at http://localhost:${PORT}`);
  });
}

module.exports = app;

