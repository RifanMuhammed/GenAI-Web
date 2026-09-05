import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Cpu, Layers, Radio, CheckCircle2, Search, Database } from 'lucide-react';

export default function ScanningOverlay() {
  const [step, setStep] = useState(0);

  const steps = [
    { name: 'Inspecting digital pixels & compression edges', icon: Layers },
    { name: 'Running Google Gemini Multimodal Vision AI', icon: Sparkles },
    { name: 'Checking camera sensor noise & genuine lens data', icon: Cpu },
    { name: 'Checking global fact-check databases & news archives', icon: Database },
    { name: 'Generating clear citizen verdict & summary', icon: Shield }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 my-8 animate-fadeIn">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl text-center relative overflow-hidden bg-slate-950/90 border border-sky-500/40 shadow-2xl shadow-sky-950/30">
        
        {/* Animated Scanning Beam */}
        <div className="scan-beam"></div>

        {/* Central Pulsing Radar */}
        <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-sky-500/15 border border-sky-400/40 pulse-radar"></div>
          <div className="w-14 h-14 rounded-full bg-sky-500/20 border-2 border-sky-400 flex items-center justify-center text-sky-300 shadow-lg shadow-sky-500/30">
            <Sparkles className="w-7 h-7 animate-pulse" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-1.5 font-display tracking-tight">
          Analyzing Media with AI Forensics
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Examining pixels, lighting physics, camera sensors, and fact-checking records...
        </p>

        {/* Dynamic Step Progress */}
        <div className="space-y-2 text-left max-w-md mx-auto">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isDone = idx < step;
            const isCurrent = idx === step;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs transition-all duration-300 ${
                  isCurrent
                    ? 'bg-sky-950/50 border-sky-500/60 text-sky-200 font-semibold scale-[1.02] shadow-sm'
                    : isDone
                    ? 'bg-slate-900/40 border-slate-800 text-slate-300'
                    : 'opacity-30 border-transparent text-slate-600'
                }`}
              >
                <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                  isCurrent ? 'bg-sky-500/20 text-sky-400' :
                  isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-600'
                }`}>
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className="truncate flex-1 font-medium">{s.name}</span>
                {isCurrent && (
                  <span className="text-[10px] text-sky-400 font-mono animate-pulse font-bold">Scanning...</span>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
