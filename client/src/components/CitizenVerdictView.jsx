import React, { useState } from 'react';
import { ShieldCheck, AlertOctagon, Share2, ChevronDown, ChevronUp, Eye, Download, Info, CheckCircle2, XCircle, HelpCircle, Sparkles } from 'lucide-react';

export default function CitizenVerdictView({ report, onSwitchToForensics, onOpenExportModal }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!report) return null;

  const isSynthetic = report.authenticityScore < 45;
  const displayScore = isSynthetic ? (100 - report.authenticityScore) : report.authenticityScore;

  // Simple plain-English helper items
  const simpleChecklist = isSynthetic ? [
    { title: 'Computer Generated', desc: 'Drawn by an AI program, not a real human with a camera.' },
    { title: 'Unnatural Details', desc: 'Notice smoothed skin, weird lighting, or impossible physical objects.' },
    { title: 'No Camera Records', desc: 'Missing natural camera sensor grain and real photography info.' }
  ] : [
    { title: 'Real Camera Capture', desc: 'Real optical lens focus with natural skin pores and realistic lighting.' },
    { title: 'Natural Physics', desc: 'Light, reflections, shadows, and textures follow real-world physics.' },
    { title: 'Verified Background', desc: 'Matches documented real-world events and certified camera telemetry.' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 mb-6 animate-fadeIn">
      <div className={`glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden transition-all duration-300 ${
        isSynthetic 
          ? 'border-red-500/40 bg-gradient-to-b from-red-950/30 via-slate-900/95 to-slate-950 shadow-2xl shadow-red-950/20'
          : 'border-emerald-500/40 bg-gradient-to-b from-emerald-950/30 via-slate-900/95 to-slate-950 shadow-2xl shadow-emerald-950/20'
      }`}>

        {/* Ambient Top Glow Line */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
          isSynthetic 
            ? 'from-transparent via-red-500 to-transparent' 
            : 'from-transparent via-emerald-400 to-transparent'
        }`} />

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className={`p-3.5 rounded-2xl shadow-lg transition-transform hover:scale-105 ${
              isSynthetic 
                ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}>
              {isSynthetic ? <AlertOctagon className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
            </div>
            
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                  isSynthetic 
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {isSynthetic ? '🔴 AI Fake Detected' : '🟢 Real Photograph / Media'}
                </span>
                
                <span className="text-xs text-slate-400 font-mono bg-slate-900/90 px-2.5 py-0.5 rounded-md border border-slate-800">
                  {report.detectedGenerator || (isSynthetic ? 'AI Generator' : 'Real Camera')}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
                {report.title || 'Analysis Verdict'}
              </h2>
            </div>
          </div>

          {/* Large Easy-to-Read Confidence Card */}
          <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 self-start sm:self-auto shadow-inner">
            <div className="text-right">
              <div className={`text-3xl sm:text-4xl font-black font-display tracking-tight ${
                isSynthetic ? 'text-red-400' : 'text-emerald-400'
              }`}>
                {displayScore}%
              </div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                {isSynthetic ? 'AI Probability' : 'Authenticity Score'}
              </div>
            </div>

            <div className="w-2.5 h-12 bg-slate-800 rounded-full overflow-hidden flex flex-col justify-end">
              <div 
                className={`w-full transition-all duration-1000 ${isSynthetic ? 'bg-red-500' : 'bg-emerald-500'}`}
                style={{ height: `${displayScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Media Preview & Core Summary */}
        <div className="flex flex-col md:flex-row items-center gap-6 p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 mb-5 shadow-lg">
          {report.mediaPreview ? (
            <div className="w-full md:w-44 h-44 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 flex items-center justify-center border border-slate-800 relative group shadow-md">
              {report.mediaType === 'audio' ? (
                <div className="text-xs font-mono text-purple-300 p-3 text-center flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-lg">🎙️</div>
                  <span>Voice Audio Track</span>
                </div>
              ) : report.mediaType === 'video' ? (
                <video src={report.mediaPreview} className="w-full h-full object-cover" muted autoPlay loop />
              ) : (
                <img src={report.mediaPreview} alt="Media preview" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />
              )}
            </div>
          ) : report.mediaType === 'text_claim' ? (
            <div className="w-full md:w-44 h-44 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 flex-shrink-0 flex flex-col items-center justify-center p-3 text-center border border-slate-800 shadow-md">
              <div className="w-10 h-10 rounded-full bg-sky-500/15 text-sky-400 flex items-center justify-center mb-2 shadow-inner">
                📰
              </div>
              <span className="text-[11px] font-bold text-slate-300 line-clamp-3 italic">
                "{report.claimText || report.title}"
              </span>
              <span className="text-[9px] font-mono text-slate-500 uppercase mt-2">Verified Claim</span>
            </div>
          ) : null}

          <div className="flex-1 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Plain English Explanation:</span>
            </div>

            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
              {report.citizenSummary}
            </p>

            {/* 3 Easy Plain English Checklist Points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              {simpleChecklist.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 mb-0.5">
                    {isSynthetic ? (
                      <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    )}
                    <span className="truncate">{item.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Media Sharing Advice Bar */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border mb-4 text-xs font-semibold ${
          isSynthetic 
            ? 'bg-red-950/30 border-red-500/30 text-red-200' 
            : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <Share2 className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{report.sharingGuidance}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onSwitchToForensics}
              className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 font-bold"
            >
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              <span>Forensic Pro Deep Dive</span>
            </button>
            <button
              onClick={onOpenExportModal}
              className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Report</span>
            </button>
          </div>
        </div>

        {/* Expandable Red Flags / Details */}
        {report.redFlags && report.redFlags.length > 0 && (
          <div className="pt-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-400 hover:text-slate-200 py-2 transition-colors"
            >
              <span>{showDetails ? '▲ Hide Specific Visual Clues' : `▼ See ${report.redFlags.length} Specific Clues Found by AI`}</span>
              {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showDetails && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-slate-800/80 animate-fadeIn">
                {report.redFlags.map((flag, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5 shadow-sm">
                    <span className="text-red-400 font-bold text-sm leading-none">•</span>
                    <span className="leading-relaxed">{flag}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
