import React from 'react';
import { Compass, ExternalLink, Globe, Calendar } from 'lucide-react';

export default function ProvenanceTimeline({ provenance, report }) {
  if (!provenance && !report?.provenance) return null;
  const data = provenance || report.provenance;
  const isSynthetic = (report?.authenticityScore || 50) < 45;

  return (
    <section className="max-w-4xl mx-auto px-4 mb-12 animate-fadeIn" aria-labelledby="provenance-heading">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 bg-slate-900/60 shadow-xl">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="p-2 rounded-xl bg-slate-800 text-sky-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 id="provenance-heading" className="text-lg sm:text-xl font-bold text-white font-display">
              OSINT Provenance & Fact-Check Verification
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Corroboration against reverse search sightings & accredited global fact-checking registries
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Origin Stats */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Reverse Search Matches
              </span>
              <div className="text-xl sm:text-2xl font-bold text-sky-400 font-display">
                {data.reverseMatches != null ? (
                  <>
                    {data.reverseMatches.toLocaleString()} <span className="text-xs font-normal text-slate-500">sightings</span>
                  </>
                ) : (
                  <span className="text-sm font-medium text-slate-400">Not Indexed in Registries</span>
                )}
              </div>
              {data.isBenchmark && (
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/30 mt-2 inline-block">
                  Benchmark Evidence
                </span>
              )}
            </div>

            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Earliest Indexed Appearance
              </span>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mt-1">
                <Calendar className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                <span className="truncate">{data.firstSeen || data.earliestAppearance || 'No prior public registry record'}</span>
              </div>
            </div>
          </div>

          {/* Right: Accredited Sources */}
          <div className="lg:col-span-8 space-y-2.5">
            <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>Accredited Fact-Checker Status:</span>
            </div>

            {data.factCheckSources && data.factCheckSources.length > 0 ? (
              data.factCheckSources.map((src, idx) => {
                const isSafeUrl = src.url && /^https?:\/\//i.test(src.url);
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{src.name}</span>
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          src.status && (src.status.includes('SYNTHETIC') || src.status.includes('DEBUNKED') || src.status.includes('FALSE') || src.status.includes('FABRICATED'))
                            ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                            : (src.status && (src.status.includes('CANDIDATE') || src.status.includes('UNVERIFIED') || src.status.includes('SUGGESTED')))
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {src.status || 'UNVERIFIED'}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] max-w-md">
                        {src.claim || 'Forensic lab corroboration confirms synthetic generation signatures.'}
                      </p>
                      {src.verificationNote && (
                        <p className="text-slate-500 text-[10px] italic">
                          ℹ️ {src.verificationNote}
                        </p>
                      )}
                    </div>

                    {isSafeUrl && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 font-semibold self-start sm:self-center"
                      >
                        <span>Read Report</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center gap-2 text-slate-300 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>No verified fact-check source found</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  No independent third-party fact-checker report has cataloged this specific media file in public registries. Evaluation is calculated directly from biometric, spectral, and error level forensics.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
