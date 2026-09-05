import React from 'react';
import { Image, Mic, Video, Link, FileText, Sparkles } from 'lucide-react';

export default function HeroSection({ userMode }) {
  return (
    <section className="pt-8 pb-4 text-center max-w-3xl mx-auto px-4" aria-labelledby="hero-heading">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-semibold mb-4 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
        <span>Google Gemini Multimodal Vision + Pixel Level Forensics</span>
      </div>

      <h1 id="hero-heading" className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3 font-display">
        Verify Digital <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">Authenticity</span>
      </h1>

      <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto mb-5">
        Zero-shot AI deepfake detection across images, voice clones, videos, and news claims with 
        explainable citizen verdicts and deep forensic telemetry.
      </p>

      {/* Quick Modality Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
          <Image className="w-3.5 h-3.5 text-sky-400" /> Image Diffusion & ELA
        </span>
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
          <Mic className="w-3.5 h-3.5 text-purple-400" /> Voice Clone & Acoustic Fourier
        </span>
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
          <Video className="w-3.5 h-3.5 text-emerald-400" /> Video Deepfakes & Lip-Sync
        </span>
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
          <FileText className="w-3.5 h-3.5 text-amber-400" /> OSINT Claim Verification
        </span>
      </div>
    </section>
  );
}
