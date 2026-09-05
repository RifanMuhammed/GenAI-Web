import React, { useState } from 'react';
import { Globe, ShieldAlert, CheckCircle, Share2, AlertOctagon, MessageCircle, Heart, Repeat, ArrowRight, ShieldCheck, X } from 'lucide-react';

export default function SocialShieldSimulator() {
  const [platform, setPlatform] = useState('twitter'); // 'twitter' | 'whatsapp'
  const [showInterceptModal, setShowInterceptModal] = useState(false);
  const [interceptTarget, setInterceptTarget] = useState(null);

  const handleAttemptShare = (postTitle) => {
    setInterceptTarget(postTitle);
    setShowInterceptModal(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 my-8 animate-fadeIn">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-emerald-500/30 shadow-2xl bg-slate-950/90">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Globe className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                Social Media "Share Shield" Extension Simulator
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Simulates how VeritasLens integrates into social feeds (X / Twitter, WhatsApp) to intercept viral deepfakes before they spread.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              onClick={() => setPlatform('twitter')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                platform === 'twitter' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Twitter / X Feed
            </button>
            <button
              onClick={() => setPlatform('whatsapp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                platform === 'whatsapp' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              WhatsApp Group Chat
            </button>
          </div>
        </div>

        {/* FEED PREVIEW */}
        {platform === 'twitter' ? (
          <div className="max-w-xl mx-auto space-y-4">
            
            {/* Post 1: Synthetic Post Flagged */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 relative overflow-hidden">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-300">
                  VX
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-white">Viral News Central</span>
                    <span className="text-xs text-slate-500">@viral_news_hub • 12m</span>
                  </div>
                  <p className="text-xs text-slate-300 my-2">
                    🚨 BREAKING: Look at this photo of Pope Francis in Rome today! Incredible fashion statement!
                  </p>

                  {/* VeritasLens Warning Badge Overlay */}
                  <div className="relative rounded-xl overflow-hidden border border-red-500/40 mb-3 group">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
                      alt="Pope Puffer Fake"
                      className="w-full h-48 object-cover filter contrast-90"
                    />

                    {/* Warning overlay pill */}
                    <div className="absolute top-2.5 left-2.5 px-3 py-1.5 rounded-lg bg-red-950/90 text-red-200 border border-red-500/60 text-xs font-bold flex items-center gap-2 shadow-lg backdrop-blur-md">
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                      <span>VeritasLens Flag: AI Generated Image (Midjourney v5)</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> 842</span>
                    <button
                      onClick={() => handleAttemptShare('Pope Francis Puffer Coat AI Image')}
                      className="flex items-center gap-1 text-red-400 hover:text-red-300 font-bold px-2 py-1 rounded bg-red-500/10 border border-red-500/20"
                    >
                      <Repeat className="w-3.5 h-3.5" /> Retweet (Shield Intercept)
                    </button>
                    <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> 14.2K</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Post 2: Verified Authentic Post */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                  RN
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-white">Reuters Verified</span>
                    <span className="text-xs text-slate-500">@Reuters • 1h</span>
                  </div>
                  <p className="text-xs text-slate-300 my-2">
                    Athletes surge past the finish line during the Olympic 100m sprint finals.
                  </p>

                  <div className="relative rounded-xl overflow-hidden border border-emerald-500/40 mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80"
                      alt="Olympic sprint"
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 px-3 py-1.5 rounded-lg bg-emerald-950/90 text-emerald-200 border border-emerald-500/60 text-xs font-bold flex items-center gap-2 shadow-lg backdrop-blur-md">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>VeritasLens: 97% Verified Authentic (Camera C2PA Signed)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* WHATSAPP GROUP SIMULATOR */
          <div className="max-w-md mx-auto bg-[#0b141a] rounded-2xl p-4 border border-slate-800 text-xs space-y-3 font-sans">
            <div className="text-center text-slate-500 text-[11px] pb-2 border-b border-slate-800">
              Family & Friends WhatsApp Group (8 members)
            </div>

            {/* Incoming voice note warning */}
            <div className="bg-[#1f2c34] p-3 rounded-xl rounded-tl-none border-l-4 border-red-500 max-w-xs space-y-2">
              <div className="text-red-400 font-bold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>⚠️ VeritasLens Warning: Synthetic Voice Clone</span>
              </div>
              <p className="text-slate-200">
                "Voice Note: CEO Emergency Transfer instructions.wav"
              </p>
              <div className="text-[10px] text-slate-400">
                Probability: 92% AI Generated (ElevenLabs TTS). Do not send funds.
              </div>
              <button
                onClick={() => handleAttemptShare('CEO Voice Clone WhatsApp Audio')}
                className="w-full py-1.5 rounded-lg bg-red-600/80 hover:bg-red-500 text-white font-bold text-center"
              >
                Forward to Another Chat (Test Intercept)
              </button>
            </div>
          </div>
        )}

        {/* INTERCEPT POPUP MODAL */}
        {showInterceptModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border-2 border-red-500/60 bg-slate-950 shadow-2xl relative animate-scaleUp">
              <button
                onClick={() => setShowInterceptModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-500/40">
                <AlertOctagon className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-white text-center mb-2 font-display">
                Share Shield Intercept Alert!
              </h3>
              <p className="text-xs text-slate-300 text-center mb-6">
                You are attempting to forward content flagged as <span className="text-red-400 font-bold">AI Synthetic Media</span>:
              </p>

              <div className="p-3 bg-red-950/30 rounded-xl border border-red-500/30 text-xs text-red-200 mb-6 font-mono">
                "{interceptTarget}"
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setShowInterceptModal(false)}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  ✓ Cancel Forward (Protect Community)
                </button>
                <button
                  onClick={() => {
                    alert('Forwarded with automatic VeritasLens Synthetic Disclaimer attached.');
                    setShowInterceptModal(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                >
                  Forward with "AI Synthetic" Label
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
