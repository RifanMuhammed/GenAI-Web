import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function HeroSection({ userMode }) {
  return (
    <div className="relative pt-6 pb-6 text-center max-w-3xl mx-auto px-4">
      {/* Sleek Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-medium mb-5 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>PromptWars • AI Deepfake & Synthetic Media Verifier</span>
      </div>

      {/* Main Punchy Title */}
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3 font-display">
        Verify Media Authenticity
      </h1>

      {/* Clean 1-sentence Subtitle */}
      <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mb-4 font-normal">
        Instantly analyze images, audio, video, and news to detect AI generation, voice cloning, and deepfakes.
      </p>
    </div>
  );
}
