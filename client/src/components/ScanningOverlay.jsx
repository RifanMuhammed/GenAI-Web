import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Cpu, Layers, Radio, CheckCircle2 } from 'lucide-react';

export default function ScanningOverlay() {
  const [step, setStep] = useState(0);

  const steps = [
    { name: 'Extracting Latent Spatial Gradients & Pixel Residuals', icon: Layers },
    { name: 'Executing Real-Time Error Level Analysis (ELA)', icon: Cpu },
    { name: 'Analyzing Fourier High-Frequency Spectrum & Phonation Cutoffs', icon: Radio },
    { name: 'Inspecting C2PA Manifest & Sensor Bayer Noise Signatures', icon: Shield },
    { name: 'Synthesizing Explainable GenAI Forensic Verdict', icon: Sparkles }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 my-8">
      <div className="glass-panel-glow-cyan p-8 rounded-3xl text-center relative overflow-hidden bg-slate-950/90 border border-cyan-500/40">
        
        {/* Animated Scanning Line */}
        <div className="scan-beam"></div>

        {/* Central Pulsing Radar */}
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-cyan-500/15 border border-cyan-400/40 pulse-radar"></div>
          <div className="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/30">
            <Cpu className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 font-display tracking-tight">
          Multimodal Neural Forensics Active
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Running ensemble deep learning classifiers, spectral harmonics & cryptographic validation...
        </p>

        {/* Dynamic Step Progress */}
        <div className="space-y-2.5 text-left max-w-md mx-auto">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isDone = idx < step;
            const isCurrent = idx === step;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs transition-all duration-300 ${
                  isCurrent
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 font-semibold scale-[1.02]'
                    : isDone
                    ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                    : 'opacity-40 border-transparent text-slate-600'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${
                  isCurrent ? 'bg-cyan-500/20 text-cyan-400 animate-spin' :
                  isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-600'
                }`}>
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span className="truncate flex-1">{s.name}</span>
                {isCurrent && (
                  <span className="text-[10px] text-cyan-400 font-mono animate-pulse font-bold">Scanning...</span>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
