# 🔍 ProofLens
### Next-Gen Multimodal Synthetic Media Forensics & Deepfake Verification Engine
*Built for PromptWars x µLearn SJCET Hackathon • Google for Developers "Build with AI"*

[![Tests Passing](https://img.shields.io/badge/Tests-9%2F9%20Passing-emerald?style=flat-square&logo=jest)](server/test/forensics.test.js)
[![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Gemini%20AI-sky?style=flat-square)](client)
[![Standard](https://img.shields.io/badge/Standard-C2PA%20v1.3%20%7C%20IEEE-purple?style=flat-square)](client)
[![License](https://img.shields.io/badge/License-MIT-slate?style=flat-square)](LICENSE)

---

## 💡 The Problem
With hyper-realistic AI generation (Midjourney, ElevenLabs, Flux, Deepfakes), anyone can fabricate images, voice clones, and viral news in seconds. Citizens lack the technical tools to verify what is real, while traditional fact-checkers take hours or days to debunk viral media.

## 🛡️ The Solution: ProofLens
**ProofLens** is a multimodal digital forensics platform powered by **Google Gemini Multimodal AI** and signal-processing forensics to deliver instantaneous, explainable authenticity verdicts across **Images, Audio, Video, and News Claims**.

---

## ✨ Key Features

* 🔍 **Image Error Level Analysis (ELA)**: Detects compression discrepancies and AI diffusion artifacts at the pixel level.
* 🎙️ **Fourier Acoustic Spectrum**: Catches AI voice clones via 16.2 kHz neural vocoder cutoffs and robotic glottal pulse jitter (0.03%).
* 🎬 **Video Deepfake Detection**: Spots lip-sync viseme desynchronization, abnormal blink rates (PERCLOS), and boundary warping.
* 📰 **Real-Time News Fact-Checking**: Corroborates viral text rumors against OSINT fact-checking registries with Gemini ground-truth verification.
* 👥 **Dual Persona Architecture**:
  * **Citizen View**: Plain-English explanations, 3-point clarity checklists, and social sharing safety advice.
  * **Forensic Pro View**: Raw telemetry, interactive ELA canvas filters, temporal keyframe timelines, and C2PA provenance credentials.
* 📄 **Certified PDF Dossier Export**: Generates printable forensic certificates complete with SHA-256 cryptographic hashes and verification stamps.
* 📱 **100% Mobile Responsive**: Fluid touch-scrolling and adaptive UI on all devices.

---

## 🏗️ Architecture & Tech Stack

* **Frontend**: React, Vite, TailwindCSS, Lucide Icons, HTML5 Canvas 2D.
* **Backend**: Node.js, Express, Multer, REST API.
* **AI Intelligence**: Google Gemini Multimodal Vision & Reasoning API (`gemini-3.1-flash-lite` / `gemini-3.5-flash`).
* **Forensics Standard**: C2PA Manifests & IEEE-1857 cryptographic provenance models.
* **Security**: Strict MIME whitelisting, SSRF/URI injection protection, and XSS sanitization.

---

## ⚡ Quick Start

```bash
# 1. Clone Repository
git clone https://github.com/RifanMuhammed/GenAI-Web.git
cd GenAI-Web

# 2. Run Automated Test Suite (9/9 Unit & Integration Tests)
npm test

# 3. Start Development Server
npm start
```

Visit **`http://localhost:5173`** to use ProofLens.
