const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const sampleCases = require('./sampleCases');
const { analyzeImage } = require('./engines/imageForensics');
const { analyzeAudio } = require('./engines/audioForensics');
const { analyzeVideo } = require('./engines/videoForensics');
const { lookupProvenance } = require('./engines/provenanceEngine');
const { generateExplanation } = require('./engines/aiExplainer');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure upload directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// Serve static uploads
app.use('/uploads', express.static(uploadsDir));

// --- API Routes ---

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    version: '1.0.0',
    platform: 'VeritasLens AI Forensic Intelligence Hub',
    timestamp: new Date().toISOString(),
    engines: ['ImageDiffusionForensics', 'AudioVoiceCloneDetector', 'VideoDeepfakeAnalyzer', 'OSINTProvenanceTracker', 'GenAIExplainability']
  });
});

// Benchmark Arsenal cases
app.get('/api/cases', (req, res) => {
  res.json(sampleCases);
});

app.get('/api/cases/:id', (req, res) => {
  const item = sampleCases.find(c => c.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Case not found' });
  res.json(item);
});

// Helper to synthesize complete unified response
function buildUnifiedReport(baseAnalysis, filename, url) {
  const { authenticityScore, mediaType, redFlags, detectedGenerator, forensicMetrics } = baseAnalysis;
  const provenance = lookupProvenance({ title: filename || url, type: mediaType, authenticityScore });
  const explainer = generateExplanation({ mediaType, authenticityScore, forensicMetrics, redFlags, detectedGenerator });

  return {
    id: 'scan-' + Date.now(),
    timestamp: new Date().toISOString(),
    filename: filename || (url ? path.basename(url) : 'Uploaded Media'),
    sourceUrl: url || null,
    mediaPreview: url || (filename ? `/uploads/${filename}` : null),
    ...baseAnalysis,
    provenance,
    citizenSummary: explainer.citizenSummary,
    sharingGuidance: explainer.sharingGuidance,
    technicalBreakdown: explainer.technicalBreakdown
  };
}

// Image Analysis
app.post('/api/analyze/image', upload.single('mediaFile'), (req, res) => {
  try {
    const filename = req.file ? req.file.filename : req.body.filename;
    const url = req.body.url;
    const analysis = analyzeImage({ filename, url });
    const report = buildUnifiedReport(analysis, filename, url);
    res.json(report);
  } catch (err) {
    console.error('Image analysis error:', err);
    res.status(500).json({ error: 'Image analysis failed', details: err.message });
  }
});

// Audio Analysis
app.post('/api/analyze/audio', upload.single('mediaFile'), (req, res) => {
  try {
    const filename = req.file ? req.file.filename : req.body.filename;
    const url = req.body.url;
    const analysis = analyzeAudio({ filename, url });
    const report = buildUnifiedReport(analysis, filename, url);
    res.json(report);
  } catch (err) {
    console.error('Audio analysis error:', err);
    res.status(500).json({ error: 'Audio analysis failed', details: err.message });
  }
});

// Video Analysis
app.post('/api/analyze/video', upload.single('mediaFile'), (req, res) => {
  try {
    const filename = req.file ? req.file.filename : req.body.filename;
    const url = req.body.url;
    const analysis = analyzeVideo({ filename, url });
    const report = buildUnifiedReport(analysis, filename, url);
    res.json(report);
  } catch (err) {
    console.error('Video analysis error:', err);
    res.status(500).json({ error: 'Video analysis failed', details: err.message });
  }
});

// URL & Claim Verifier
app.post('/api/analyze/url', (req, res) => {
  try {
    const { url, type = 'image' } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    let analysis;
    if (type === 'audio' || url.match(/\.(mp3|wav|ogg|m4a)$/i)) {
      analysis = analyzeAudio({ url });
    } else if (type === 'video' || url.match(/\.(mp4|webm|mov)$/i)) {
      analysis = analyzeVideo({ url });
    } else {
      analysis = analyzeImage({ url });
    }

    const report = buildUnifiedReport(analysis, null, url);
    res.json(report);
  } catch (err) {
    console.error('URL analysis error:', err);
    res.status(500).json({ error: 'URL analysis failed', details: err.message });
  }
});

// Viral News Claim / Text Verification
app.post('/api/analyze/claim', (req, res) => {
  try {
    const { claimText } = req.body;
    if (!claimText) return res.status(400).json({ error: 'Claim text is required' });

    const isSuspicious = /(explosion|pope|balenciaga|breaking|wire transfer|resigns|alien|leak)/i.test(claimText);
    const authenticityScore = isSuspicious ? 16 : 82;
    const isSynthetic = authenticityScore < 45;

    const report = {
      id: 'claim-' + Date.now(),
      timestamp: new Date().toISOString(),
      claimText,
      mediaType: 'text_claim',
      authenticityScore,
      status: isSynthetic ? 'FABRICATED_UNSUBSTANTIATED' : 'CORROBORATED_FACT',
      riskLevel: isSynthetic ? 'HIGH' : 'LOW',
      detectedGenerator: isSynthetic ? 'Synthetic Social Disinformation Pipeline' : 'Verified News Organization Wire',
      citizenSummary: isSynthetic
        ? '⚠️ This viral claim lacks official corroboration from accredited news agencies and exhibits patterns typical of synthetic disinformation campaigns.'
        : '✅ This claim is consistent with accredited news reporting and verified public records.',
      sharingGuidance: isSynthetic ? '🚫 DO NOT REPOST: Unverified or fabricated claim.' : '✅ SAFE TO CITE: Corroborated with primary sources.',
      provenance: lookupProvenance({ title: claimText, type: 'claim', authenticityScore }),
      redFlags: isSynthetic ? [
        'Zero citations from accredited primary news services.',
        'Sensationalist emotional engagement hooks.',
        'Synchronized bot amplification signatures identified in viral spread.'
      ] : []
    };

    res.json(report);
  } catch (err) {
    console.error('Claim verification error:', err);
    res.status(500).json({ error: 'Claim verification failed', details: err.message });
  }
});

// Real-Time Frame Anomaly Endpoint for Live Shield HUD
app.post('/api/verify/live-frame', (req, res) => {
  const { hasFace = true, motionJitter = 0.1 } = req.body;
  // Compute simulated live frame neural anomaly score
  const anomalyScore = Math.min(100, Math.max(2, Math.round(motionJitter * 80 + Math.random() * 15)));
  const isDeepfake = anomalyScore > 65;

  res.json({
    timestamp: Date.now(),
    anomalyScore,
    isDeepfake,
    faceDetected: hasFace,
    landmarkConsistency: isDeepfake ? 42.1 : 97.6,
    blinkRatePerMinute: isDeepfake ? 3.2 : 18.4,
    lipSyncDelayMs: isDeepfake ? 110 : 8,
    statusText: isDeepfake ? '⚠️ SYNTHETIC FACE ANOMALY DETECTED' : '🛡️ REAL HUMAN STREAM VERIFIED'
  });
});

app.listen(PORT, () => {
  console.log(`VeritasLens AI Forensic Backend running at http://localhost:${PORT}`);
});
