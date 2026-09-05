import React, { useState } from 'react';
import { BookOpen, Sparkles, Eye, Mic, Video, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function TruthHubEdu() {
  const [selectedTopic, setSelectedTopic] = useState('hands-eyes');

  const topics = [
    {
      id: 'hands-eyes',
      title: '1. Hands, Eyes & Specular Reflections',
      icon: Eye,
      summary: 'Why diffusion models struggle with human extremities and physical light reflection vectors.',
      content: [
        'Anatomical Fingers: Generative AI models struggle with continuous joint topology, often rendering 6 fingers, fused knuckles, or fingernails that melt into skin.',
        'Corneal Specular Reflections: In real photos, pupil reflections mirror the exact environment light source (e.g. windows, sun). In synthetic images, each pupil often reflects completely different shapes.',
        'Ear & Jewelry Symmetry: Earrings, glasses rims, and necklace links frequently dissolve irregularly into hair or neck textures.'
      ]
    },
    {
      id: 'audio-clones',
      title: '2. Spotting AI Voice Clones & TTS',
      icon: Mic,
      summary: 'Acoustic cues to identify ElevenLabs, Tortoise, and neural vocoder voice clones.',
      content: [
        'Hard 16kHz Cutoff: Neural vocoders downsample audio to reduce computation, creating a sharp drop in energy above 16kHz (real human speech extends to 22-24kHz).',
        'Robotic Pitch Flatness: Natural human vocal cords vary frequency by 0.5% - 2.0% micro-jitter per cycle. AI speech often shows unnaturally perfect 0.02% regularity.',
        'Absence of Breath Micro-Dynamics: Cloned voices rarely contain the organic inhalation pauses that occur naturally before emphatic words.'
      ]
    },
    {
      id: 'video-deepfakes',
      title: '3. Video Face-Swaps & Lip-Sync (Wav2Lip)',
      icon: Video,
      summary: 'Temporal boundary glitches and phoneme-viseme desynchronization.',
      content: [
        'Blink Frequency (PERCLOS): Deepfake subjects frequently exhibit abnormally low blink rates (e.g. 1 blink per 20 seconds instead of normal 15-20 blinks/minute).',
        'Bilabial Consonant Misalignment: Letters like /M/, /B/, /P/ require complete physical lip contact. AI lip-sync models often fail to close lips during these sounds.',
        'Facial Edge Jitter: Watch the boundary between the jawline and collar during rapid head turns for color flickering and pixel blurring.'
      ]
    },
    {
      id: 'c2pa-provenance',
      title: '4. Cryptographic Provenance (C2PA & Content Credentials)',
      icon: ShieldCheck,
      summary: 'How hardware signatures and digital watermarking create verifiable trust chains.',
      content: [
        'Hardware Manifest: Cameras like Leica M11-P and Sony Alpha sign raw sensor data with a hardware-bound private key at the moment of shutter press.',
        'Audit Trail: Every subsequent crop, edit, or color grading in Photoshop is cryptographically appended to the C2PA manifest.',
        'Tamper Detection: If a single pixel is altered by an AI generator without a valid signing key, the cryptographic hash breaks instantly.'
      ]
    }
  ];

  const active = topics.find(t => t.id === selectedTopic) || topics[0];
  const Icon = active.icon;

  return (
    <div className="max-w-5xl mx-auto px-4 my-8 animate-fadeIn">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-amber-500/30 shadow-2xl bg-slate-950/90">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              Veritas Truth Academy: Spot Synthetic Media Like a Pro
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Interactive forensic guides and physical heuristics for journalists, researchers, and citizens
            </p>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Topic Selector List */}
          <div className="lg:col-span-4 space-y-2">
            {topics.map((item) => {
              const ItemIcon = item.icon;
              const isSelected = item.id === selectedTopic;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedTopic(item.id)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500/50 text-white shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <ItemIcon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="font-bold text-xs sm:text-sm text-slate-200">{item.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 ml-6">{item.summary}</p>
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Guide Card */}
          <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white font-display">{active.title}</h3>
                <p className="text-xs text-slate-400">{active.summary}</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {active.content.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs sm:text-sm text-slate-300">
                  <span className="p-1 rounded bg-amber-500/20 text-amber-400 font-bold text-xs">
                    0{idx + 1}
                  </span>
                  <span className="leading-relaxed">{point}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 mt-4">
              <span className="font-bold">Pro-Tip for Fact-Checkers:</span>
              <p className="mt-1 text-slate-400">
                Always request uncompressed camera originals (.CR3, .ARW, .DNG) or audio WAV files whenever possible, as social media re-compression strips crucial high-frequency forensic signals.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
