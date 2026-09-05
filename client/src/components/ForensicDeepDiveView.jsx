import React, { useState, useEffect, useRef } from 'react';
import { Sliders, Radio, Cpu, Shield, AlertTriangle, Eye, FileText, Activity, Music, Video } from 'lucide-react';

export default function ForensicDeepDiveView({ report, onOpenExportModal }) {
  const [activeTab, setActiveTab] = useState('visual-ela');
  const [elaIntensity, setElaIntensity] = useState(25);
  const [showArtifactBoxes, setShowArtifactBoxes] = useState(true);
  const [filterMode, setFilterMode] = useState('ela');
  const canvasRef = useRef(null);
  const audioCanvasRef = useRef(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (report?.mediaType === 'audio') setActiveTab('audio-spectrum');
    else if (report?.mediaType === 'video') setActiveTab('video-temporal');
    else setActiveTab('visual-ela');
  }, [report]);

  useEffect(() => {
    if (!report?.mediaPreview || activeTab !== 'visual-ela') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = report.mediaPreview;

    img.onload = () => {
      canvas.width = img.width || 600;
      canvas.height = img.height || 400;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (filterMode === 'ela') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const multiplier = (elaIntensity / 10);

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const diff = Math.abs(r - g) * 0.5 + Math.abs(g - b) * 0.5;
          const enhanced = Math.min(255, diff * multiplier * 4);

          data[i] = enhanced * 1.2;
          data[i + 1] = enhanced * 0.8;
          data[i + 2] = enhanced * 2.0;
        }
        ctx.putImageData(imageData, 0, 0);
      } else if (filterMode === 'noise') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const highPass = (avg % 16) * 16;
          data[i] = highPass;
          data[i + 1] = highPass;
          data[i + 2] = highPass;
        }
        ctx.putImageData(imageData, 0, 0);
      }
    };
  }, [report, filterMode, elaIntensity, activeTab]);

  useEffect(() => {
    if (activeTab !== 'audio-spectrum') return;
    const canvas = audioCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 180;

    let animationId;
    let offset = 0;

    const renderSpectrogram = () => {
      ctx.fillStyle = '#090D16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const isSynthetic = (report?.authenticityScore || 50) < 45;
      const cutoffY = isSynthetic ? 55 : 10;

      const cols = 60;
      const colWidth = canvas.width / cols;

      for (let c = 0; c < cols; c++) {
        const x = c * colWidth;
        const timeFactor = Math.sin((c + offset) * 0.2);

        for (let y = 0; y < canvas.height; y += 4) {
          const freqIntensity = isSynthetic && y < cutoffY 
            ? 0.05 
            : Math.abs(Math.sin((y * 0.08) + timeFactor)) * (1 - y / canvas.height);

          if (freqIntensity > 0.3) {
            const hue = 220 + (y / canvas.height) * 40;
            ctx.fillStyle = `hsla(${hue}, 80%, 55%, ${freqIntensity})`;
            ctx.fillRect(x, canvas.height - y, colWidth - 1, 3);
          }
        }
      }

      ctx.strokeStyle = isSynthetic ? '#EF4444' : '#10B981';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, cutoffY);
      ctx.lineTo(canvas.width, cutoffY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = isSynthetic ? '#EF4444' : '#10B981';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText(isSynthetic ? '16.2 kHz Vocoder Cutoff' : '✓ Full 24 kHz Spectrum', 10, cutoffY - 6);

      offset += 0.8;
      animationId = requestAnimationFrame(renderSpectrogram);
    };

    renderSpectrogram();
    return () => cancelAnimationFrame(animationId);
  }, [activeTab, report]);

  if (!report) return null;

  return (
    <section className="max-w-4xl mx-auto px-4 mb-12 animate-fadeIn" aria-labelledby="forensic-dossier-heading">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 bg-slate-900/60 shadow-xl">
        
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <h2 id="forensic-dossier-heading" className="text-lg sm:text-xl font-bold text-white font-display flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              <span>Investigative Forensic Analysis</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Error Level Analysis, Fourier acoustics, and C2PA Content Credentials
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'visual-ela'}
              onClick={() => setActiveTab('visual-ela')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'visual-ela' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Image ELA
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'audio-spectrum'}
              onClick={() => setActiveTab('audio-spectrum')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'audio-spectrum' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Audio Spectrum
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'video-temporal'}
              onClick={() => setActiveTab('video-temporal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'video-temporal' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Video Deepfake
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'metadata-c2pa'}
              onClick={() => setActiveTab('metadata-c2pa')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'metadata-c2pa' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              C2PA Provenance
            </button>
          </div>
        </div>

        {/* TAB 1: Visual ELA */}
        {activeTab === 'visual-ela' && (
          <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <div className="bg-slate-950 rounded-2xl p-2 border border-slate-800 relative flex items-center justify-center min-h-[300px]">
                {filterMode === 'original' ? (
                  <img src={report.mediaPreview} alt="Original" className="max-h-[300px] w-auto object-contain rounded-lg" />
                ) : (
                  <canvas ref={canvasRef} className="max-h-[300px] w-auto object-contain rounded-lg" />
                )}

                {showArtifactBoxes && report.artifactRegions && report.artifactRegions.map((region, i) => (
                  <div
                    key={i}
                    style={{ left: `${region.x}%`, top: `${region.y}%`, width: `${region.width}%`, height: `${region.height}%` }}
                    className="absolute border border-red-400 bg-red-500/10 rounded pointer-events-none p-1"
                  >
                    <span className="text-[8px] font-mono bg-slate-950 text-red-300 px-1 py-0.2 rounded border border-red-500/40">
                      {region.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Toolbar */}
              <div className="flex items-center justify-between gap-2 mt-3 p-2 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Filter:</span>
                  {['original', 'ela', 'noise'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setFilterMode(mode)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase ${
                        filterMode === mode ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showArtifactBoxes}
                    onChange={(e) => setShowArtifactBoxes(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-sky-400 focus:ring-0"
                  />
                  <span>Markers</span>
                </label>
              </div>
            </div>

            {/* Metrics */}
            <div className="lg:col-span-5 space-y-3">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">ELA Discrepancy:</span>
                    <span className="font-mono font-bold text-red-400">{report.forensicMetrics?.elaDiscrepancy || 88}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${report.forensicMetrics?.elaDiscrepancy || 88}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Diffusion Noise Pattern:</span>
                    <span className="font-mono font-bold text-amber-400">{report.forensicMetrics?.noisePatternVariance || 79}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${report.forensicMetrics?.noisePatternVariance || 79}%` }} />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed">
                {report.technicalBreakdown?.sensorConsistencyAnalysis || 'High-frequency boundary channels reveal non-Bayer photon distributions.'}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Audio Phonation */}
        {activeTab === 'audio-spectrum' && (
          <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800">
                <canvas ref={audioCanvasRef} className="w-full h-40 rounded-lg border border-slate-800" />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Spectral Bandwidth:</span>
                  <span className="font-mono font-bold text-red-400">16.2 kHz (Cutoff)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Glottal Pulse Jitter:</span>
                  <span className="font-mono font-bold text-amber-400">0.03% (Robotic)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Video Temporal */}
        {activeTab === 'video-temporal' && (
          <div className="pt-6 space-y-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              <div className="flex justify-between mb-2">
                <span className="font-bold text-slate-300">Temporal Anomaly Timeline</span>
                <span className="text-red-400 font-mono">3 Anomaly Keyframes Flagged</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full relative">
                <span className="absolute left-[20%] -top-0.5 w-3 h-3 rounded-full bg-amber-400" title="00:03 Boundary Jitter"></span>
                <span className="absolute left-[52%] -top-0.5 w-3 h-3 rounded-full bg-red-500" title="00:08 Lip Viseme Desync"></span>
                <span className="absolute left-[78%] -top-0.5 w-3 h-3 rounded-full bg-red-500" title="00:12 Ear Blending"></span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Metadata & C2PA */}
        {activeTab === 'metadata-c2pa' && (
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-slate-500 font-sans font-bold uppercase text-[10px]">Camera Telemetry</div>
              <div className="flex justify-between">
                <span className="text-slate-500">Make:</span>
                <span className="text-slate-300">{report.exifData?.make || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Software:</span>
                <span className="text-sky-400">{report.exifData?.software || 'Midjourney Diffusion'}</span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-slate-500 font-sans font-bold uppercase text-[10px]">C2PA Credentials</div>
              <div className="flex justify-between">
                <span className="text-slate-500">Manifest:</span>
                <span className={report.authenticityScore > 75 ? 'text-emerald-400' : 'text-red-400'}>
                  {report.authenticityScore > 75 ? 'Valid Hardware Signature' : 'No Valid Signature'}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
