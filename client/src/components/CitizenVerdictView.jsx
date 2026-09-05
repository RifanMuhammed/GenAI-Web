import React, { useState } from 'react';
import { ShieldCheck, AlertOctagon, Share2, ChevronDown, ChevronUp, Eye, Download, Info } from 'lucide-react';

export default function CitizenVerdictView({ report, onSwitchToForensics, onOpenExportModal }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!report) return null;

  const isSynthetic = report.authenticityScore < 45;
  const syntheticScore = 100 - report.authenticityScore;

  return (
    <div className="max-w-4xl mx-auto px-4 mb-8 animate-fadeIn">
      <div className={`glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden ${
        isSynthetic 
          ? 'border-red-500/30 bg-gradient-to-b from-red-950/20 to-slate-900/90'
          : 'border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-slate-900/90'
      }`}>

        {/* Top Header: Badge + Title + Score */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className={`p-2.5 rounded-2xl ${isSynthetic ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {isSynthetic ? <AlertOctagon className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  isSynthetic ? 'bg-red-500/15 text-red-300 border border-red-500/30' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {isSynthetic ? 'AI Synthetic Media' : 'Authentic Media'}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {report.detectedGenerator || 'Diffusion AI'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 font-display">
                {report.title || 'Analysis Result'}
              </h2>
            </div>
          </div>

          {/* Large Authenticity Score */}
          <div className="flex items-center gap-3 sm:text-right">
            <div>
              <div className={`text-3xl sm:text-4xl font-black font-display ${isSynthetic ? 'text-red-400' : 'text-emerald-400'}`}>
                {isSynthetic ? `${syntheticScore}%` : `${report.authenticityScore}%`}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                {isSynthetic ? 'AI Probability' : 'Authenticity Index'}
              </div>
            </div>
          </div>
        </div>

        {/* Media Preview & Core Summary */}
        <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 mb-5">
          {report.mediaPreview && (
            <div className="w-full md:w-36 h-36 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 flex items-center justify-center border border-slate-800">
              {report.mediaType === 'audio' ? (
                <div className="text-xs font-mono text-purple-300 p-2 text-center">Audio Sample</div>
              ) : report.mediaType === 'video' ? (
                <video src={report.mediaPreview} className="w-full h-full object-cover" muted autoPlay loop />
              ) : (
                <img src={report.mediaPreview} alt="Target" className="w-full h-full object-cover" />
              )}
            </div>
          )}

          <div className="flex-1 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>Verdict Summary:</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-normal">
              {report.citizenSummary}
            </p>
          </div>
        </div>

        {/* Social Media Sharing Advice Bar */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl border mb-4 text-xs ${
          isSynthetic ? 'bg-red-950/20 border-red-500/30 text-red-200' : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
        }`}>
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            <span className="font-semibold">{report.sharingGuidance}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onSwitchToForensics}
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Investigate (ELA)</span>
            </button>
            <button
              onClick={onOpenExportModal}
              className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF Report</span>
            </button>
          </div>
        </div>

        {/* Expandable Red Flags Details */}
        {report.redFlags && report.redFlags.length > 0 && (
          <div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-slate-200 py-1"
            >
              <span>{showDetails ? 'Hide Detected Anomaly Breakdown' : `View ${report.redFlags.length} Detected Red Flags & Technical Anomalies`}</span>
              {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showDetails && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800">
                {report.redFlags.map((flag, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span>{flag}</span>
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
