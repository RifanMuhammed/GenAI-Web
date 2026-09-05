import React from 'react';
import { Image, Mic, Video, FileText, Sparkles } from 'lucide-react';

export default function HeroSection({ userMode }) {
  return (
    <section className="pt-4 sm:pt-8 pb-3 sm:pb-5 text-center max-w-3xl mx-auto px-2 sm:px-4" aria-labelledby="hero-heading">
      <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 text-[10px] sm:text-xs font-semibold mb-3 sm:mb-4 shadow-sm max-w-full">
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-400 flex-shrink-0" />
        <span className="truncate">Gemini Multimodal AI + Forensic Detection</span>
      </div>

      <h1 id="hero-heading" className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-2 sm:mb-3 font-display">
        Verify Digital <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">Authenticity</span>
      </h1>

      <p className="text-xs sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto mb-4 sm:mb-5 px-2">
        Zero-shot AI deepfake detection across images, voice clones, videos, and news claims with 
        plain-English citizen verdicts and deep forensic telemetry.
      </p>

      {/* Quick Modality Badges */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-400">
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800">
          <Image className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" /> Image ELA
        </span>
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800">
          <Mic className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" /> Voice Clone
        </span>
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800">
          <Video className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> Deepfake Video
        </span>
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800">
          <FileText className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" /> News Fact-Check
        </span>
      </div>
    </section>
  );
}
