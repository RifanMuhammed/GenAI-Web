# 🔍 ProofLens — Media Forensics & Verification Intelligence

> **Next-Generation Multimodal Synthetic Media Forensics, OSINT Provenance & Deepfake Detection Engine**  
> *Built for PromptWars x µLearn SJCET Hackathon • Google for Developers "Build with AI"*

---

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel%20Deployment-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://gen-ai-web-45it.vercel.app/)
[![Tests](https://img.shields.io/badge/Security%20Tests-28%2F28%20Passing%20(100%25)-emerald?style=for-the-badge&logo=jest&logoColor=white)](server/test/forensics.test.js)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-Google%20Gemini%20Multimodal-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Security](https://img.shields.io/badge/Security-Enterprise%20SSRF%20%26%20Magic--Bytes-purple?style=for-the-badge&logo=auth0&logoColor=white)](server/security.js)
[![Standard](https://img.shields.io/badge/Standard-C2PA%20v1.3%20%7C%20IEEE--1857-orange?style=for-the-badge)](https://c2pa.org/)

**[🌐 Experience Live Demo](https://gen-ai-web-45it.vercel.app/)** • **[📊 Test Suite](#-automated-testing)** • **[🛡️ Security Architecture](#️-enterprise-security--integrity-architecture)** • **[⚡ Quick Start](#-quick-start--local-setup)**

</div>

---

## 📌 Table of Contents

- [The Problem](#-the-problem)
- [The Solution: ProofLens](#-the-solution-prooflens)
- [Core Modalities & Features](#-core-modalities--features)
- [Dual-Audience Architecture](#-dual-audience-architecture)
- [Enterprise Security & Integrity Architecture](#️-enterprise-security--integrity-architecture)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Repository Structure](#-repository-structure)
- [Quick Start & Local Setup](#-quick-start--local-setup)
- [Automated Testing](#-automated-testing)
- [Deployment](#-deployment)
- [Standards & Compliance](#-standards--compliance)
- [License](#-license)

---

## 💡 The Problem

In an era of hyper-realistic generative models (**Midjourney v6, Flux, ElevenLabs, Sora, SimSwap**), synthetic media can be weaponized in seconds to fabricate viral news, political deepfakes, financial fraud, and voice clone scams.

- **Ordinary Citizens** lack technical forensics tools to verify what is authentic, making them vulnerable to deceptive virality.
- **Journalists & OSINT Investigators** must spend hours manually analyzing pixel grids, audio spectrums, and reverse-image sightings.
- **Traditional Fact-Checkers** take hours or days to publish debunks, while misinformation spreads in minutes.

---

## 🛡️ The Solution: ProofLens

**ProofLens** bridges the gap between deep forensic science and plain-language public understanding. Powered by **Google Gemini Multimodal AI** (`gemini-3.1-flash-lite`, `gemini-3.5-flash`) and mathematical signal-processing heuristics, ProofLens delivers instantaneous, explainable authenticity verdicts across **Images, Audio, Video, and News Claims**.

```
   ┌─────────────────────────────────────────────────────────────┐
   │                        PROOFLENS                            │
   │  Multimodal Forensics • C2PA Manifests • OSINT Provenance   │
   └───────────────┬─────────────────────────────┬───────────────┘
                   │                             │
        ┌──────────▼──────────┐       ┌──────────▼──────────┐
        │   👤 Citizen Mode   │       │   🔬 Forensic Pro   │
        │ Plain English       │       │ Raw Telemetry & ELA │
        │ 3-Point Checklist   │       │ Fourier Spectrogram │
        │ Safe Share Guidance │       │ Certified Dossier   │
        └─────────────────────┘       └─────────────────────┘
```

---

## ✨ Core Modalities & Features

### 🖼️ 1. Image Forensics & Diffusion Artifact Detection
- **Error Level Analysis (ELA)**: Interactive canvas rendering highlighting pixel-level JPEG compression resave gradients.
- **Sensor Bayer Noise Inspection**: Distinguishes real photon shot noise from Poisson-Gaussian synthetic smoothing.
- **Spatial Latent Anomalies**: Detects anatomical hallucinations, surreal lighting vectors, and diffusion seam boundaries.

### 🎙️ 2. Audio Voice Clone & Phonation Forensics
- **Fourier Spectral Frequency Ceiling**: Spots the distinctive **16.2 kHz hard-cutoff** characteristic of neural vocoders downsampling from 32 kHz.
- **Glottal Pulse Jitter Analysis**: Measures robotic pitch micro-flatness (<0.05% vs human 0.5%–2.0%).
- **Biological Respiratory Verification**: Analyzes natural respiratory inhalation pauses between spoken phonemes.

### 🎬 3. Video Deepfake & Temporal Coherence Analysis
- **Viseme-Phoneme Lip-Sync Desynchronization**: Identifies millisecond lag between acoustic vowels and facial mouth closure.
- **Blink Dynamics (PERCLOS)**: Flags abnormal eyelid curvature and missing micro-saccadic eye movement.
- **Temporal Keyframe Timeline**: Highlights frame-by-frame seam warping and latent boundary flickering.

### 📰 4. Viral News & Claim Verification Engine
- **OSINT Ground-Truth Fact-Checking**: Corroborates viral headlines with indexed archives and accredited wires.
- **Accredited Domain Allowlist**: Validates against recognized institutions (Reuters, AP, BBC, Snopes, AFP, WHO, FactCheck.org) and eliminates AI-hallucinated citations.
- **Zero Hallucination Guard**: Never fabricates third-party verdicts; uncataloged media displays honest *"No verified fact-check source found in public registries."*

### 🛡️ 5. Live Camera & Audio Shield
- **Real-Time Stream Verification**: Evaluates live webcam facial landmarks, motion jitter, and optical continuity to prevent biometric spoofing.

### 📄 6. Certified Printable PDF Dossier
- **Cryptographic Tamper-Evident Report**: Generates professional PDF dossiers with real **SHA-256 binary digests**, **C2PA lineage IDs**, and official verification seals.

---

## 👥 Dual-Audience Architecture

| Citizen Mode 👤 | Forensic Pro Mode 🔬 |
|---|---|
| Plain English, non-technical verdict | Raw signal-processing telemetry & score matrices |
| 3-Point Clarity Checklist | Interactive Error Level Analysis (ELA) canvas |
| Social media sharing guidance (*"Safe to share"* vs *"Do not share"*) | Fourier 4-band acoustic spectral breakdown |
| One-click summary download | Certified cryptographic PDF dossier export |

---

## 🛡️ Enterprise Security & Integrity Architecture

ProofLens was engineered with strict **zero-trust** security principles:

```
                          ┌──────────────────────────┐
                          │     Incoming Request     │
                          └─────────────┬────────────┘
                                        │
           ┌────────────────────────────▼────────────────────────────┐
           │ 1. Security Headers (CSP, HSTS, X-Frame-Options: DENY)   │
           │ 2. Strict Origin CORS (Allowlist & Vercel Preview Regex)│
           │ 3. Client IP Resolver (getTrustedClientIp Header Guard) │
           │ 4. Distributed Rate Limiter (Upstash Redis + In-Memory) │
           └────────────────────────────┬────────────────────────────┘
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 │                                             │
      [ File Upload Pipeline ]                       [ Remote URL Pipeline ]
                 │                                             │
   ┌─────────────▼─────────────┐                 ┌─────────────▼─────────────┐
   │ • 50MB Max Size Limit     │                 │ • DNS Pre-Resolution Check│
   │ • Magic-Byte Verification │                 │ • Private IP / CIDR Block │
   │ • 128-bit Crypto Filename │                 │ • Cloud Metadata Block    │
   │ • Ephemeral Auto-Cleanup  │                 │ • 6s Timeout / 15MB Cap   │
   └─────────────┬─────────────┘                 └─────────────┬─────────────┘
                 │                                             │
                 └──────────────────────┬──────────────────────┘
                                        │
           ┌────────────────────────────▼────────────────────────────┐
           │ 5. Prompt-Injection Boundary Tags (<untrusted_claim>)   │
           │ 6. Server-Side GEMINI_API_KEY (Zero Client Key Passing) │
           │ 7. Accredited Fact-Check Domain Whitelist Validator     │
           │ 8. Cryptographic SHA-256 Digesting & C2PA ID Generation │
           │ 9. Masked Error Handler with Server Correlation UUIDs   │
           └────────────────────────────┬────────────────────────────┘
                                        │
                          ┌─────────────▼────────────┐
                          │ Tamper-Evident Dossier   │
                          └──────────────────────────┘
```

- **Server-Only API Keys**: Gemini API keys are strictly sourced from `process.env.GEMINI_API_KEY`. No client headers (`x-gemini-api-key`), query parameters, or client bundles have access to API keys.
- **Strict CORS Policy**: Production frontend (`https://gen-ai-web-45it.vercel.app`), local development ports, and authorized Vercel preview environments are explicitly allowlisted. Wildcard `origin: true` is disabled.
- **Hardened Client-IP Trust Boundary**: `getTrustedClientIp()` strictly verifies the server execution environment (`TRUSTED_PROXY_PLATFORM=vercel` or `VERCEL=1`) before trusting platform-forwarded headers, preventing client-side spoofing and header injection bypasses.
- **Fail-Safe Distributed Rate Limiting**: Enforces Upstash Redis REST pipeline rate limiting for multi-instance Vercel serverless scale. In production, missing or failing Redis configurations fail safely with HTTP 503 rather than allowing uncoordinated in-memory rate limiting.
- **Advanced SSRF Shield & IP Filtering**: Blocks all private IPv4/IPv6 CIDRs (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), Carrier-Grade NAT (`100.64.0.0/10`), Link-Local / Cloud Metadata (`169.254.169.254`), Loopback (`127.0.0.1`, `::1`), octal IPv4 notations (`0177.0.0.1`), dotted hexadecimal, documentation IPv6 prefixes (`2001:db8::`), and IPv4-mapped IPv6 addresses.
- **Deep Magic-Byte Binary Verification**: Inspects raw binary header signatures for all media types (JPEG, PNG, WebP, GIF, MP3, WAV, OGG, MP4, WebM) to neutralize spoofed MIME types and disguised executables.
- **Fact-Check Source Integrity & Model Boundaries**: Validates fact-checking sources against verified domains (`reuters.com`, `apnews.com`, `snopes.com`, `bbc.com`, `afp.com`, `who.int`, `factcheck.org`). AI-generated candidate links are explicitly labeled as unverified candidates and cannot spoof independent verification flags.
- **Safe Server-Side Logging**: Server exceptions are processed through `redactSensitiveLog()` to strip API keys, Bearer tokens, secrets, passwords, cookies, and internal server paths before logging, preventing credential exposure in cloud monitoring tools.
- **Ephemeral Storage & Privacy**: Uploads are renamed with 128-bit cryptographic random IDs, deleted immediately after analysis, and swept by an automated garbage collector. Public static `/uploads` serving is disabled.
- **Production HTTP Headers & Cache Control**: Enforces `Cache-Control: no-store` on all API routes along with Content-Security-Policy (CSP), COOP, CORP, HSTS, `X-Content-Type-Options: nosniff`, and `X-Frame-Options: DENY`.

---

## 💻 Tech Stack

| Domain | Technologies |
|---|---|
| **Frontend UI** | React 18, Vite 8, Tailwind CSS, Lucide Icons, HTML5 Canvas 2D |
| **Backend Server** | Node.js, Express, Multer (Streaming Multi-Part) |
| **AI / Intelligence** | Google Gemini Multimodal Vision & Reasoning API (`gemini-3.1-flash-lite`, `gemini-3.5-flash`) |
| **Forensic Standards** | C2PA v1.3 Manifest Specifications, IEEE-1857 Cryptographic Lineage |
| **Security Suite** | Custom SSRF IP Parser, Binary Magic-Byte Detector, Upstash Redis Rate Limiter, Crypto SHA-256 |
| **Cloud Deployment** | Vercel Serverless Functions + Edge CDN |

---

## 📁 Repository Structure

```
veritas-lens/
├── api/
│   └── index.js                   # Vercel serverless entrypoint
├── client/
│   ├── public/                    # Static assets & icons
│   ├── src/
│   │   ├── components/
│   │   │   ├── BenchmarkArsenal.jsx    # Pre-loaded forensic test cases
│   │   │   ├── CitizenVerdictView.jsx  # Plain-English citizen UI
│   │   │   ├── ExportReportModal.jsx   # Certified PDF dossier builder
│   │   │   ├── ForensicDeepDiveView.jsx# Pro telemetry, ELA canvas, spectra
│   │   │   ├── HeroSection.jsx         # Header & mode toggles
│   │   │   ├── MediaDropzone.jsx       # Multi-modal media & URL dropzone
│   │   │   ├── Navbar.jsx              # Brand navigation & status
│   │   │   ├── ProvenanceTimeline.jsx  # OSINT & fact-check timeline
│   │   │   └── ScanningOverlay.jsx     # Real-time scan animation
│   │   ├── App.jsx                     # Core application orchestrator
│   │   ├── index.css                   # Tailwind styles & animations
│   │   └── main.jsx                    # React entrypoint
│   ├── index.html                      # HTML template with typography
│   ├── package.json                    # Frontend dependencies
│   └── vite.config.js                  # Vite dev proxy configuration
├── server/
│   ├── engines/
│   │   ├── aiExplainer.js              # Plain-English & Pro explainability
│   │   ├── audioForensics.js           # Phonation & 16.2kHz vocoder detector
│   │   ├── claimVerifier.js            # Gemini fact-checking engine & validator
│   │   ├── imageForensics.js           # Gemini Vision & ELA pixel engine
│   │   ├── provenanceEngine.js         # OSINT citation corroborator
│   │   └── videoForensics.js           # Temporal coherence & lip-sync engine
│   ├── test/
│   │   └── forensics.test.js           # 28/28 Automated security & unit test suite
│   ├── index.js                        # Express API, CORS, & security middleware
│   ├── sampleCases.js                  # Real-world benchmark cases (SRK, Pope, etc.)
│   ├── security.js                     # SSRF shield, magic-bytes, Upstash rate limiter
│   └── package.json                    # Backend dependencies
├── .env.example                        # Template environment variables
├── .gitignore                          # Git ignore rules for keys and uploads
├── README.md                           # Documentation
├── start.js                            # Unified process launcher
└── vercel.json                         # Vercel deployment & security headers config
```

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- **Node.js** v18 or later
- **Google Gemini API Key** (Get one free at [Google AI Studio](https://aistudio.google.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/RifanMuhammed/GenAI-Web.git
cd GenAI-Web
```

### 2. Install Dependencies
```bash
# Install root, backend, and client dependencies
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### 3. Configure Environment Variables
Create a `.env` file in the `server/` directory:
```bash
# In server/.env
PORT=3001
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Optional: Upstash Redis for distributed rate limiting in serverless
UPSTASH_REDIS_REST_URL=https://your-upstash-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_bearer_token
```

### 4. Run the Automated Security & Forensic Test Suite
```bash
node server/test/forensics.test.js
```

### 5. Launch the Platform
```bash
npm start
# or: node start.js
```

Visit **`http://localhost:5173`** in your browser to start analyzing media.

---

## 🧪 Automated Testing

ProofLens includes an automated test suite verifying all forensic engines, SSRF protections, magic-byte checks, distributed rate limiters, client IP resolution, CORS allowlists, fact-checking integrity, secret isolation, and error log sanitization:

```bash
$ node server/test/forensics.test.js

============================================================
  🧪 Running ProofLens Comprehensive Security & Forensic Test Suite
============================================================

  ✔ PASS Image Engine: Correctly flags diffusion synthetic markers for AI prompts
  ✔ PASS Image Engine: Correctly verifies authentic camera captures & celebrity photojournalism
  ✔ PASS Audio Engine: Detects 16.2kHz neural vocoder downsampling in voice clones
  ✔ PASS Audio Engine: Verifies wide-bandwidth natural broadcast audio
  ✔ PASS Video Engine: Identifies temporal boundary and lip-sync viseme lag
  ✔ PASS SSRF Protection: Blocks local, loopback and dangerous URI schemes
  ✔ PASS SSRF Protection: isPrivateOrInternalIP blocks private IPv4, IPv6, Link-Local & Cloud Metadata
  ✔ PASS SSRF Protection: validateAndResolveUrl rejects loopback and invalid URLs
  ✔ PASS Magic Bytes: Accurate detection of genuine media signatures
  ✔ PASS Upload Security: validateUpload verifies magic bytes and blocks malicious payloads
  ✔ PASS Input Sanitization: Strips XSS payloads and directory traversal sequences
  ✔ PASS Error Masking: Returns safe correlation IDs without revealing stack traces
  ✔ PASS Rate Limiting: Middleware enforces sliding-window threshold
  ✔ PASS CORS Policy: Rejects unauthorized origins while allowing verified domains
  ✔ PASS Client IP Resolution: getTrustedClientIp enforces strict environment trust boundary and rejects injected headers
  ✔ PASS Fact-Checking Integrity: validateFactCheckSource filters unaccredited domains & SSRF URLs
  ✔ PASS Claim Verifier: Handles extremely long text and malicious injections gracefully
  ✔ PASS API Key Isolation: Guarantees server key exclusivity and zero response leakage
  ✔ PASS Filename Sanitization: Neutralizes encoded traversal and illegal symbols
  ✔ PASS AI Output Schema: Validates score boundaries and structure
  ✔ PASS Provenance Integrity: Distinguishes known benchmarks from uncataloged user uploads
  ✔ PASS Security: Hardened trusted IP detection and IPv4/IPv6 normalization
  ✔ PASS Security: Rate limiter fails safely with HTTP 503 if Redis missing in production
  ✔ PASS Fact-Check Integrity: Labels AI candidate URLs as unverified candidates and rejects model-injected verification fields
  ✔ PASS SSRF Defense: Blocks octal IPv4, dotted hex, documentation IPv6, and IPv4-mapped addresses
  ✔ PASS Provenance Integrity: Arbitrary uploads never report fabricated C2PA or reverse search matches
  ✔ PASS Live-Shield: /api/verify/live-frame returns explicit simulation flag and deterministic metrics
  ✔ PASS Secrets: Errors mask internal details and never leak API keys or file paths

------------------------------------------------------------
  📊 Test Summary: 28/28 Passed (100%)
============================================================
```

---

## 🚀 Deployment

The project is pre-configured for instant zero-configuration deployment to **Vercel**:

1. Push your repository to GitHub.
2. Import the project into **Vercel**.
3. Under **Project Settings** → **Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Google Gemini API Key *(Server-Only)*.
   - *(Optional)* `UPSTASH_REDIS_REST_URL`: Upstash Redis REST endpoint.
   - *(Optional)* `UPSTASH_REDIS_REST_TOKEN`: Upstash Redis Bearer token.
4. Deploy! Vercel will automatically build the client bundle and expose serverless backend endpoints via `/api/*`.

---

## 📜 Standards & Compliance

- **C2PA v1.3**: Coalition for Content Provenance and Authenticity specification compliance.
- **IEEE-1857**: Standard for synthetic media provenance metadata structures.
- **WCAG 2.1 AA**: High-contrast, accessible user interface design.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for PromptWars x µLearn SJCET Hackathon**  
*Empowering journalists, researchers, and citizens with verifiable truth.*

</div>
