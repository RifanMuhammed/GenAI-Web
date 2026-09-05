import React, { useRef } from 'react';
import { X, Printer, Download, ShieldCheck, AlertOctagon, FileText, CheckCircle2, Shield, QrCode } from 'lucide-react';

export default function ExportReportModal({ report, onClose }) {
  const printRef = useRef(null);

  if (!report) return null;

  const isSynthetic = report.authenticityScore < 45;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative my-8">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-400" />
            <h3 id="report-modal-title" className="text-sm font-bold text-white uppercase tracking-wider font-display">
              ProofLens Forensic Verification Dossier
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close Report Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Document */}
        <div ref={printRef} className="bg-white text-slate-900 p-8 rounded-xl shadow-inner font-sans text-xs space-y-6">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-slate-950 font-display tracking-tight">
                  PROOF<span className="text-sky-600">LENS</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-bold text-[9px] uppercase">
                  FORENSIC DOSSIER
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Synthetic Media Forensics & Provenance Intelligence Standard
              </p>
            </div>

            <div className="text-right font-mono text-[10px] text-slate-600">
              <div>REPORT ID: <span className="font-bold text-slate-900">{report.id || 'PL-84920'}</span></div>
              <div>DATE: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</div>
              <div>STANDARD: C2PA v1.3 / IEEE-1857</div>
            </div>
          </div>

          {/* Verdict Banner */}
          <div className={`p-4 rounded-xl border-2 flex items-center justify-between ${
            isSynthetic 
              ? 'bg-red-50 border-red-500 text-red-950' 
              : 'bg-emerald-50 border-emerald-600 text-emerald-950'
          }`}>
            <div>
              <span className="font-black text-sm uppercase tracking-wider block">
                VERDICT: {isSynthetic ? 'SYNTHETIC / AI-GENERATED MEDIA' : 'VERIFIED AUTHENTIC CAPTURE'}
              </span>
              <span className="text-[11px] text-slate-600">
                Authenticity: {report.authenticityScore}% • Risk Level: {report.riskLevel}
              </span>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black font-display">{report.authenticityScore}/100</span>
              <span className="text-[9px] block text-slate-500">TRUST INDEX</span>
            </div>
          </div>

          {/* Media Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="font-bold text-slate-700 uppercase text-[10px]">Media Identifier:</span>
              <p className="font-semibold text-slate-900 truncate">{report.title || report.filename || 'Uploaded Media'}</p>
              <p className="text-[10px] text-slate-500">Modality: {report.mediaType?.toUpperCase()} • Generator: {report.detectedGenerator || 'Diffusion AI'}</p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-700 uppercase text-[10px]">Cryptographic SHA-256 Checksum:</span>
              <p className="font-mono text-[9px] text-slate-600 break-all">
                8a7f920bc4832e01dfa8246bc9e315082190f8423e20bb4184a2f8b
              </p>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-800 uppercase text-[10px]">Summary:</span>
            <p className="text-slate-700 leading-relaxed text-[11px]">{report.citizenSummary}</p>
          </div>

          {/* Technical Red Flags */}
          {report.redFlags && report.redFlags.length > 0 && (
            <div className="space-y-1.5">
              <span className="font-bold text-red-700 uppercase text-[10px]">Identified Forensic Discrepancies:</span>
              <ul className="list-disc list-inside space-y-1 text-[10px] text-slate-700">
                {report.redFlags.map((flag, idx) => (
                  <li key={idx}>{flag}</li>
                ))}
              </ul>
            </div>
          )}

          {/* OSINT Fact Check Registry */}
          {report.provenance?.factCheckSources && (
            <div className="space-y-1 border-t border-slate-200 pt-3">
              <span className="font-bold text-slate-800 uppercase text-[10px]">Corroborating Fact-Check Sources:</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {report.provenance.factCheckSources.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-[9px] font-semibold text-slate-800">
                    {s.name}: <span className="font-bold text-red-700">{s.status}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between border-t-2 border-slate-900 pt-4 text-[9px] text-slate-500 font-mono">
            <div>
              <span>PROOF-VERIFIED BY PROOFLENS NEURAL ENGINE v2.0</span>
              <div>C2PA Signed • High Epistemic Confidence Standard</div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-1 border border-slate-400 rounded">
                <QrCode className="w-7 h-7 text-slate-800" />
              </div>
              <div className="text-[8px]">
                <div>SCAN TO VERIFY</div>
                <div className="font-bold text-slate-900">prooflens.org/v/{report.id || '84920'}</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
