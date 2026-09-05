import React from 'react';
import { Shield, Eye, FileSearch, Sparkles, Video, Globe, BookOpen, Download, AlertTriangle } from 'lucide-react';

export default function Navbar({ 
  userMode, 
  setUserMode, 
  activeTab, 
  setActiveTab, 
  onReset,
  currentReport,
  onOpenExportModal
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#07090E]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={onReset}>
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[2px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#07090E] rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white font-display">
                Veritas<span className="text-cyan-400">Lens</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                GenAI Forensics v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Multimodal Synthetic Media Detection & Provenance Hub
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'scanner'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileSearch className="w-4 h-4" />
            <span>Forensic Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('live-hud')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'live-hud'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Video className="w-4 h-4 text-purple-400" />
            <span>Live Stream Shield</span>
          </button>

          <button
            onClick={() => setActiveTab('social-extension')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'social-extension'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Social Share Shield</span>
          </button>

          <button
            onClick={() => setActiveTab('edu-hub')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'edu-hub'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Truth Academy</span>
          </button>
        </nav>

        {/* Right Section: Persona Toggle & Export Button */}
        <div className="flex items-center gap-3">
          
          {/* Persona Switch: Citizen vs Investigator */}
          <div className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            <button
              onClick={() => setUserMode('citizen')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                userMode === 'citizen'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Citizen Mode: Plain-language verdict, quick confidence rating & sharing advice"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Citizen</span>
            </button>

            <button
              onClick={() => setUserMode('forensic')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                userMode === 'forensic'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Forensic Mode: ELA Heatmaps, Spectrograms, EXIF & Cryptographic Provenance"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Forensic Pro</span>
            </button>
          </div>

          {/* Export Report CTA (Active when a report exists) */}
          {currentReport && (
            <button
              onClick={onOpenExportModal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:brightness-110 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Report</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
