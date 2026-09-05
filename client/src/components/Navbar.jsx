import React from 'react';
import { Shield, Download, Sparkles } from 'lucide-react';

export default function Navbar({ 
  userMode, 
  setUserMode, 
  onReset,
  currentReport,
  onOpenExportModal
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#07090E]/95 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        
        {/* Brand Logo */}
        <button 
          onClick={onReset} 
          className="flex items-center gap-2 text-left focus:outline-none group flex-shrink-0"
          aria-label="ProofLens Home"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-600/20 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-sm group-hover:border-sky-400/60 transition-all">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-lg font-black tracking-tight text-white font-display">
                Proof<span className="text-sky-400">Lens</span>
              </span>
              <span className="px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-mono font-semibold uppercase rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="hidden xs:inline">Live</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden md:block">Multimodal Forensic Intelligence</p>
          </div>
        </button>

        {/* Right Actions: Persona Switch & PDF Export */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          
          {/* Persona Switch (Citizen vs Forensic Pro) */}
          <div className="flex items-center p-0.5 sm:p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            <button
              onClick={() => setUserMode('citizen')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                userMode === 'citizen'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label="Citizen Mode"
            >
              <span className="sm:hidden">Citizen</span>
              <span className="hidden sm:inline">Citizen View</span>
            </button>

            <button
              onClick={() => setUserMode('forensic')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                userMode === 'forensic'
                  ? 'bg-sky-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label="Forensic Pro Mode"
            >
              <span className="sm:hidden">Pro</span>
              <span className="hidden sm:inline">Forensic Pro</span>
            </button>
          </div>

          {/* Export Report Action */}
          {currentReport && (
            <button
              onClick={onOpenExportModal}
              className="btn-primary text-[11px] sm:text-xs py-1 sm:py-1.5 px-2.5 sm:px-3.5 flex items-center gap-1.5 font-bold shadow-md cursor-pointer"
              aria-label="Export Certified Forensic Dossier"
            >
              <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden xs:inline">PDF</span>
              <span className="hidden sm:inline">Export</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
