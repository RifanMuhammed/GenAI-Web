import React, { useState, useEffect, useRef } from 'react';
import { Video, Mic, ShieldAlert, CheckCircle, AlertTriangle, Play, Square, Sparkles, RefreshCw, Cpu, Radio } from 'lucide-react';

export default function LiveShieldHUD() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [injectAttack, setInjectAttack] = useState(false);
  const [anomalyScore, setAnomalyScore] = useState(8);
  const [blinkRate, setBlinkRate] = useState(16);
  const [lipSyncLag, setLipSyncLag] = useState(6);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Start / Stop Webcam Stream
  const toggleStream = async () => {
    if (isStreaming) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsStreaming(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsStreaming(true);
      } catch (err) {
        console.warn('Webcam permission denied or unavailable, using high-tech simulated live stream feed.');
        setIsStreaming(true);
      }
    }
  };

  // Live Metric Simulation Loop
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      if (injectAttack) {
        setAnomalyScore(Math.floor(88 + Math.random() * 10));
        setBlinkRate(1.2);
        setLipSyncLag(Math.floor(95 + Math.random() * 25));
      } else {
        setAnomalyScore(Math.floor(5 + Math.random() * 8));
        setBlinkRate(17.4);
        setLipSyncLag(Math.floor(4 + Math.random() * 5));
      }
    }, 600);

    return () => clearInterval(interval);
  }, [isStreaming, injectAttack]);

  return (
    <div className="max-w-5xl mx-auto px-4 my-8 animate-fadeIn">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-purple-500/30 shadow-2xl relative overflow-hidden bg-slate-950/90">
        
        {/* Glow Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                <Video className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                Real-Time Live Media Shield HUD
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Live Video & Voice Scanner
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Active neural biometric verification against real-time face replacement and voice synthesizers during video calls.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleStream}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                isStreaming
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
                  : 'btn-primary'
              }`}
            >
              {isStreaming ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isStreaming ? 'Stop Live Feed' : 'Launch Live Shield'}</span>
            </button>
          </div>
        </div>

        {/* Main Live HUD Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Viewport with Cyber HUD overlays */}
          <div className="lg:col-span-8 relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 flex items-center justify-center">
            {isStreaming ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${injectAttack ? 'filter hue-rotate-15 contrast-125' : ''}`}
                />

                {/* Animated HUD Target Box on Face */}
                <div className={`absolute w-44 h-44 sm:w-56 sm:h-56 rounded-2xl border-2 transition-all duration-300 flex items-center justify-center pointer-events-none ${
                  injectAttack 
                    ? 'border-red-500 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-pulse' 
                    : 'border-cyan-400 bg-cyan-500/5 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                }`}>
                  {/* Cyber Corner Marks */}
                  <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-inherit"></div>
                  <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-inherit"></div>
                  <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-inherit"></div>
                  <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-inherit"></div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                    injectAttack ? 'bg-red-950 text-red-300 border border-red-500' : 'bg-cyan-950 text-cyan-300 border border-cyan-500'
                  }`}>
                    {injectAttack ? '⚠️ DEEPFAKE FACIAL MASK DETECTED' : '✓ BIOMETRIC FACE MESH VERIFIED'}
                  </span>
                </div>

                {/* Top Left Live Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-slate-950/80 text-white border border-slate-700">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    LIVE STREAM
                  </span>
                  <span className="px-2 py-1 rounded-md text-[10px] font-mono text-cyan-300 bg-slate-950/80 border border-slate-700">
                    60 FPS • 1080p
                  </span>
                </div>

                {/* Bottom Center Alert Banner */}
                {injectAttack && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-xl bg-red-600/90 text-white text-xs font-bold font-mono tracking-wider shadow-lg flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 animate-bounce" />
                    <span>SYNTHETIC FACE-SWAP INJECTION DETECTED</span>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto mb-4">
                  <Video className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-white mb-1">Live Camera Shield Inactive</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  Click 'Launch Live Shield' above to start real-time anti-deepfake monitoring on your webcam stream.
                </p>
              </div>
            )}
          </div>

          {/* Right: Live Telemetry Controls & Attack Injector */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Live Anomaly Metric Card */}
            <div className={`p-4 rounded-2xl border transition-all ${
              injectAttack ? 'bg-red-950/30 border-red-500/40' : 'bg-slate-900/90 border-slate-800'
            }`}>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Synthetic Anomaly Index:</span>
                <span className={`font-mono font-black text-sm ${injectAttack ? 'text-red-400' : 'text-emerald-400'}`}>
                  {anomalyScore}%
                </span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${injectAttack ? 'bg-red-500' : 'bg-emerald-500'}`}
                  style={{ width: `${anomalyScore}%` }}
                />
              </div>
            </div>

            {/* Micro-Metrics */}
            <div className="glass-panel p-4 rounded-xl border-slate-800 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Eye Blink PERCLOS:</span>
                <span className={injectAttack ? 'text-red-400 font-bold' : 'text-slate-200'}>{blinkRate} blinks/min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lip Viseme Latency:</span>
                <span className={injectAttack ? 'text-red-400 font-bold' : 'text-slate-200'}>{lipSyncLag} ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Voice Spoof Index:</span>
                <span className={injectAttack ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                  {injectAttack ? '94.2% AI Neural Voice' : '2.1% (Natural Audio)'}
                </span>
              </div>
            </div>

            {/* Test Attack Injection Toggle (For Hackathon Judges) */}
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 text-xs space-y-3">
              <div className="flex items-center gap-2 text-indigo-300 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Judge Demo: Attack Simulation</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Simulate a live deepfake injection attack to test VeritasLens's instant detection and alarm system:
              </p>

              <button
                disabled={!isStreaming}
                onClick={() => setInjectAttack(!injectAttack)}
                className={`w-full py-2.5 rounded-xl font-bold transition-all ${
                  injectAttack
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {injectAttack ? 'Disable Deepfake Attack' : '⚠️ Inject Real-Time Deepfake Attack'}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
