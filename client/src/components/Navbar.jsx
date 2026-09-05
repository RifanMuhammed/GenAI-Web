import React from 'react';
import { Shield, Download, CheckCircle2 } from 'lucide-react';

export default function Navbar({ 
  userMode, 
  setUserMode, 
  onReset,
  currentReport,
  onOpenExportModal
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#07090E]/90 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button 
          onClick={onReset} 
          className="flex items-center gap-2.5 text-left focus:outline-none group"
          aria-label="ProofLens Home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-600/20 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-sm group-hover:border-sky-400/60 transition-all">
            <Shield className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white font-display">
                Proof<span className="text-sky-400">Lens</span>
              </span>
              <span className="px-2 py-0.5 text-[9px] font-mono font-semibold uppercase rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                AI Core Live
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">Multimodal Forensic Intelligence Hub</p>
          </div>
        </button>

        {/* Right Actions: Persona Switch & PDF Export */}
        <div className="flex items-center gap-3">
          
          {/* Persona Switch (Citizen vs Forensic Pro) */}
          <div className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            <button
              onClick={() => setUserMode('citizen')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                userMode === 'citizen'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label="Citizen Mode"
            >
              Citizen View
            </button>

            <button
              onClick={() => setUserMode('forensic')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                userMode === 'forensic'
                  ? 'bg-sky-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label="Forensic Pro Mode"
            >
              Forensic Pro
            </button>
          </div>

          {/* Export Report Action */}
          {currentReport && (
            <button
              onClick={onOpenExportModal}
              className="btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1.5 font-bold"
              aria-label="Export Certified Forensic Dossier"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
