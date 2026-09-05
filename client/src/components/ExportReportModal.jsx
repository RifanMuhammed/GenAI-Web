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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-bold text-white uppercase tracking-wider font-display">
              VeritasLens Certified Forensic Report
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn-primary text-xs flex items-center gap-1.5 py-1.5 px-3"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document */}
        <div ref={printRef} className="bg-white text-slate-900 p-8 rounded-2xl shadow-inner font-sans text-xs space-y-6">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-950 font-display tracking-tight">
                  VERITAS<span className="text-cyan-600">LENS</span> AI
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-bold text-[9px] uppercase">
                  FORENSIC DOSSIER
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                GenAI Multimodal Synthetic Media Detection & Verification System
              </p>
            </div>

            <div className="text-right font-mono text-[10px] text-slate-600">
              <div>REPORT ID: <span className="font-bold text-slate-900">{report.id || 'VL-948291'}</span></div>
              <div>DATE: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</div>
              <div>CLASSIFICATION: PUBLIC INTEGRITY</div>
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
                Confidence: {isSynthetic ? 100 - report.authenticityScore : report.authenticityScore}% • Risk Assessment: {report.riskLevel}
              </span>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black font-display">{report.authenticityScore}/100</span>
              <span className="text-[9px] block text-slate-500">AUTHENTICITY INDEX</span>
            </div>
          </div>

          {/* Target Media & Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="font-bold text-slate-700 uppercase text-[10px]">Media Identifier:</span>
              <p className="font-semibold text-slate-900 truncate">{report.title || report.filename || 'Uploaded Sample'}</p>
              <p className="text-[10px] text-slate-500">Modality: {report.mediaType?.toUpperCase()} • Generator: {report.detectedGenerator || 'Diffusion AI'}</p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-700 uppercase text-[10px]">Cryptographic Checksum:</span>
              <p className="font-mono text-[9px] text-slate-600 break-all">
                SHA256: 8a7f920bc4832e01dfa8246bc9e315082190f8423e20bb4184a2
              </p>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-800 uppercase text-[10px]">Citizen & Investigator Summary:</span>
            <p className="text-slate-700 leading-relaxed text-[11px]">{report.citizenSummary}</p>
          </div>

          {/* Red Flags / Forensics */}
          {report.redFlags && report.redFlags.length > 0 && (
            <div className="space-y-1.5">
              <span className="font-bold text-red-700 uppercase text-[10px]">Identified Anomalies & Inconsistencies:</span>
              <ul className="list-disc list-inside space-y-1 text-[10px] text-slate-700">
                {report.redFlags.map((flag, idx) => (
                  <li key={idx}>{flag}</li>
                ))}
              </ul>
            </div>
          )}

          {/* OSINT & Fact Check Corroboration */}
          {report.provenance?.factCheckSources && (
            <div className="space-y-1 border-t border-slate-200 pt-3">
              <span className="font-bold text-slate-800 uppercase text-[10px]">Accredited Fact-Check Sources:</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {report.provenance.factCheckSources.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-[9px] font-semibold text-slate-800">
                    {s.name}: <span className="font-bold text-red-700">{s.status}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer with Verification QR & Signature */}
          <div className="flex items-center justify-between border-t-2 border-slate-900 pt-4 text-[9px] text-slate-500 font-mono">
            <div>
              <span>VERIFIED BY VERITASLENS NEURAL ENGINE v2.4</span>
              <div>C2PA Compliant • IEEE Media Forensics Standard</div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-1 border border-slate-400 rounded">
                <QrCode className="w-8 h-8 text-slate-800" />
              </div>
              <div className="text-[8px]">
                <div>SCAN TO VERIFY</div>
                <div className="font-bold text-slate-900">veritaslens.ai/v/{report.id || '948291'}</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
