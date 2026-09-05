// Curated benchmark library representing high-profile real-world synthetic media cases and authentic controls
module.exports = [
  {
    id: 'case-pope-puffer',
    type: 'image',
    title: 'Pope Francis in Balenciaga Puffer Coat',
    category: 'Viral AI Diffusion',
    sourceUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    mediaPreview: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    description: 'The infamous viral image showing Pope Francis walking the streets of Rome wearing a lavish white designer puffer coat with crucifix chain.',
    modelUsed: 'Midjourney v5',
    verdict: {
      status: 'SYNTHETIC_MANIPULATED',
      label: 'AI-Generated Image (Diffusion Model)',
      authenticityScore: 8, // 8% authentic -> 92% synthetic
      riskLevel: 'HIGH',
      citizenSummary: 'This image is completely AI-generated using Midjourney v5 and never happened in reality. Notice how the crucifix chain blends awkwardly into the coat fabric, and the Pope’s right hand has unnatural finger proportions and missing thumb joint lines.',
      redFlags: [
        'Anatomical glitch: The Pope\'s right hand holding the coffee cup shows distorted finger blending and blurred nail contours.',
        'Lighting vector mismatch: Diffuse specular reflections on the glossy puffer coat do not align with natural outdoor sun angle.',
        'Lack of lens EXIF data and presence of Midjourney latent diffusion noise signatures.',
        'Eyeglasses rim boundary merges into facial skin texture without physical shadow cast.'
      ],
      forensicMetrics: {
        elaDiscrepancy: 88,
        noisePatternVariance: 79,
        anatomicalAnomalyIndex: 94,
        frequencyCutoffScore: 83,
        c2paProvenance: 'NO_AUTHENTIC_SIGNATURE',
        detectedGenerator: 'Midjourney Diffusion Latent v5.1'
      },
      provenance: {
        firstSeen: 'March 24, 2023 (Reddit r/midjourney by Pablo Xavier)',
        reverseMatches: 1420,
        factCheckSources: [
          { name: 'Reuters Fact Check', url: 'https://reuters.com/fact-check', status: 'DEBUNKED' },
          { name: 'Snopes', url: 'https://snopes.com', status: 'FALSE' },
          { name: 'AFP FactCheck', url: 'https://factcheck.afp.com', status: 'SYNTHETIC' }
        ]
      }
    }
  },
  {
    id: 'case-pentagon-explosion',
    type: 'image',
    title: 'Pentagon Complex Fire & Explosion Hoax',
    category: 'Market Manipulation Disinformation',
    sourceUrl: 'https://images.unsplash.com/photo-1508847154043-be5407fcaa5a?auto=format&fit=crop&w=800&q=80',
    mediaPreview: 'https://images.unsplash.com/photo-1508847154043-be5407fcaa5a?auto=format&fit=crop&w=800&q=80',
    description: 'A fabricated image depicting thick black smoke billowing near the Pentagon that caused a momentary $500B drop in the S&P 500 stock index.',
    modelUsed: 'Stable Diffusion / Midjourney Hybrid',
    verdict: {
      status: 'SYNTHETIC_MANIPULATED',
      label: 'AI-Generated Disinformation',
      authenticityScore: 4,
      riskLevel: 'CRITICAL',
      citizenSummary: 'Fabricated AI image created to trigger panic. The building architecture shown does not match the actual Pentagon structure, the fence posts melt together irregularly, and official security cameras confirmed zero incidents.',
      redFlags: [
        'Structural inconsistency: Columns and fence railings dissolve into pavement with variable geometry.',
        'Smoke physics violation: Particle density and plume dissipation follow algorithmic blur patterns rather than turbulent fluid dynamics.',
        'No emergency dispatch records or geo-corroboration from Washington D.C. emergency response.',
        'Origin traced to synchronized bot accounts on Twitter/X spreading financial panic.'
      ],
      forensicMetrics: {
        elaDiscrepancy: 92,
        noisePatternVariance: 85,
        anatomicalAnomalyIndex: 70,
        frequencyCutoffScore: 89,
        c2paProvenance: 'SUSPICIOUS_UNVERIFIED',
        detectedGenerator: 'Diffusion-based Generative Inpainting'
      },
      provenance: {
        firstSeen: 'May 22, 2023 (Verified-check spoofed Twitter accounts)',
        reverseMatches: 890,
        factCheckSources: [
          { name: 'Associated Press (AP)', url: 'https://apnews.com', status: 'DEBUNKED' },
          { name: 'Arlington Fire Dept', url: 'https://twitter.com', status: 'OFFICIALLY_DENIED' }
        ]
      }
    }
  },
  {
    id: 'case-ceo-voice-clone',
    type: 'audio',
    title: 'CEO Emergency Wire Transfer Voice Clone',
    category: 'AI Voice Cloning / Audio Deepfake',
    sourceUrl: 'https://actions.google.com/sounds/v1/emergency/emergency_siren_short.ogg',
    mediaPreview: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
    description: 'A 24-second synthetic audio recording mimicking a company CEO demanding an urgent financial transaction over WhatsApp voice note.',
    modelUsed: 'ElevenLabs Voice Engine / Tortoise TTS',
    verdict: {
      status: 'SYNTHETIC_MANIPULATED',
      label: 'Cloned Voice (Neural TTS Synthesis)',
      authenticityScore: 11,
      riskLevel: 'HIGH',
      citizenSummary: 'This voice note is an AI-generated clone of the executive. Notice the unnatural robotic rhythm without human inhalation/exhalation pauses, and sharp unnatural pitch transitions between syllables.',
      redFlags: [
        'Spectral cutoff anomaly: Frequency content hard-truncates above 16.2 kHz, characteristic of 32kHz neural vocoder downsampling.',
        'Phonation phase incoherence: Glottal pulse spacing exhibits robotic mechanical regularity with 0.02% natural pitch jitter (human baseline is 0.5-2.0%).',
        'Acoustic room impulse response mismatch: Voice has dry studio acoustics while ambient background hiss was artificially overlaid.',
        'Zero breath pause micro-dynamics before high-stress exclamations.'
      ],
      forensicMetrics: {
        spectralCutoffKhz: 16.2,
        pitchJitterVariance: 0.04,
        syntheticBreathingAbsence: 96,
        phaseIncoherenceScore: 91,
        c2paProvenance: 'NO_AUDIO_WATERMARK',
        detectedGenerator: 'ElevenLabs Multilingual v2 Neural Vocoder'
      },
      provenance: {
        firstSeen: 'Internal Corporate Phishing Incident Report',
        reverseMatches: 0,
        factCheckSources: [
          { name: 'DeepTrace Audio Forensics', url: '#', status: 'SYNTHETIC_VOICE_CLONE' }
        ]
      }
    }
  },
  {
    id: 'case-politician-video-swap',
    type: 'video',
    title: 'State Official Fabricated Concession Speech',
    category: 'Video Deepfake / Lip-Sync Manipulation',
    sourceUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    mediaPreview: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    description: 'A fabricated 15-second high-resolution video of a senior public official making inflammatory policy statements never spoken.',
    modelUsed: 'Wav2Lip + SimSwap Deepfake Pipeline',
    verdict: {
      status: 'SYNTHETIC_MANIPULATED',
      label: 'Deepfake Video (Face-Swap & Lip-Sync)',
      authenticityScore: 14,
      riskLevel: 'CRITICAL',
      citizenSummary: 'Manipulated video using face replacement and AI lip-syncing. The speaker’s teeth remain unnaturally static while speaking, the jawline blurs during fast head movements, and the eye blinking rate is abnormally low.',
      redFlags: [
        'Lip-sync viseme misalignment: Bilabial consonants (/m/, /b/, /p/) fail to achieve complete lip closure in 4 key frames.',
        'Boundary seam artifacts: Temporal color tone shift between inner facial mask bounding box and outer neck skin.',
        'PERCLOS (Eye Blink Rate) Anomaly: Subject blinks only once in 18 seconds (normal baseline 6-8 blinks).',
        'Lighting shadow inconsistency: Teeth appear brightly illuminated even when head turns away from the key light source.'
      ],
      forensicMetrics: {
        temporalInconsistencyScore: 89,
        lipSyncMismatchIndex: 86,
        facialBoundaryJitter: 92,
        blinkRateAnomalyScore: 84,
        c2paProvenance: 'TAMPERED_MEDIA_STREAM',
        detectedGenerator: 'Latent Face-Swap + Wav2Lip Neural Sync'
      },
      provenance: {
        firstSeen: 'August 14, 2024 (Telegram propaganda channel)',
        reverseMatches: 312,
        factCheckSources: [
          { name: 'BBC Verify', url: 'https://bbc.com/news/reality_check', status: 'DEEPFAKE_CONFIRMED' },
          { name: 'PolitiFact', url: 'https://politifact.com', status: 'PANTS_ON_FIRE' }
        ]
      }
    }
  },
  {
    id: 'case-authentic-press-photo',
    type: 'image',
    title: 'Authentic Photojournalism: Olympic Sprint Finish',
    category: 'Verified Genuine Media (Control Case)',
    sourceUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    mediaPreview: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    description: 'Certified authentic raw press photograph captured during a major track and field championship.',
    modelUsed: 'None (Genuine Camera Capture)',
    verdict: {
      status: 'VERIFIED_AUTHENTIC',
      label: 'Verified Authentic Capture',
      authenticityScore: 97, // 97% authentic
      riskLevel: 'LOW',
      citizenSummary: 'This media passes all cryptographic, optical, and physical coherence checks. Natural optical depth-of-field blur, consistent Bayer pattern camera sensor noise, and valid camera EXIF metadata are present.',
      redFlags: [],
      forensicMetrics: {
        elaDiscrepancy: 6,
        noisePatternVariance: 8,
        anatomicalAnomalyIndex: 3,
        frequencyCutoffScore: 5,
        c2paProvenance: 'VALID_HARDWARE_SIGNATURE (Sony Alpha 1 / 50mm f/1.2)',
        detectedGenerator: 'None (Pure Optical Sensor Data)'
      },
      provenance: {
        firstSeen: 'Official Olympic Newsroom Archive / Getty Images',
        reverseMatches: 620,
        factCheckSources: [
          { name: 'Reuters Newsroom', url: 'https://reuters.com', status: 'VERIFIED_GENUINE' },
          { name: 'Associated Press Photo Registry', url: 'https://ap.org', status: 'AUTHENTIC' }
        ]
      }
    }
  },
  {
    id: 'case-authentic-podcast-audio',
    type: 'audio',
    title: 'Studio Interview: Natural Human Speech',
    category: 'Verified Genuine Audio (Control Case)',
    sourceUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
    mediaPreview: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80',
    description: 'Direct high-fidelity studio recording with full 48kHz acoustic bandwidth and natural human vocal tract dynamics.',
    modelUsed: 'None (Natural Human Vocal Cord Phonation)',
    verdict: {
      status: 'VERIFIED_AUTHENTIC',
      label: 'Authentic Human Voice Recording',
      authenticityScore: 95,
      riskLevel: 'LOW',
      citizenSummary: 'Natural acoustic recording with human glottal pulse variations, natural micro-breath intakes, and full harmonic overtones extending above 22kHz.',
      redFlags: [],
      forensicMetrics: {
        spectralCutoffKhz: 22.8,
        pitchJitterVariance: 1.15,
        syntheticBreathingAbsence: 4,
        phaseIncoherenceScore: 7,
        c2paProvenance: 'VALID_AUDIO_INTERFACE_SIGNATURE (Shure SM7B / Focusrite)',
        detectedGenerator: 'None (Organic Human Phonation)'
      },
      provenance: {
        firstSeen: 'Verified Public Podcast Stream (NPR Studio)',
        reverseMatches: 45,
        factCheckSources: [
          { name: 'Audio Forensics Lab', url: '#', status: 'VERIFIED_AUTHENTIC_SPEECH' }
        ]
      }
    }
  }
];
