import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, FileText, Sparkles, X, ArrowRight, Image, Mic, Video } from 'lucide-react';

export default function MediaDropzone({ onAnalyzeFile, onAnalyzeUrl, onAnalyzeClaim, isLoading }) {
  const [inputMode, setInputMode] = useState('upload'); // 'upload' | 'url' | 'claim'
  const [urlInput, setUrlInput] = useState('');
  const [claimText, setClaimText] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file) => {
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    let type = 'image';
    if (file.type.startsWith('audio/')) type = 'audio';
    else if (file.type.startsWith('video/')) type = 'video';

    setPreviewMedia({
      url: objectUrl,
      type,
      name: file.name
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleTriggerFileAnalysis = () => {
    if (selectedFile) {
      onAnalyzeFile(selectedFile, previewMedia.type);
    }
  };

  const handleTriggerUrlAnalysis = (e) => {
    e.preventDefault();
    if (urlInput.trim()) onAnalyzeUrl(urlInput.trim(), 'image');
  };

  const handleTriggerClaimAnalysis = (e) => {
    e.preventDefault();
    if (claimText.trim()) onAnalyzeClaim(claimText.trim());
  };

  return (
    <div className="max-w-4xl mx-auto px-4 mb-6">
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border-slate-800 bg-slate-900/80 shadow-2xl">
        
        {/* Simple Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/90 rounded-2xl max-w-md mx-auto mb-5 border border-slate-800 shadow-inner">
          <button
            onClick={() => setInputMode('upload')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              inputMode === 'upload' ? 'bg-sky-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Media</span>
          </button>

          <button
            onClick={() => setInputMode('url')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              inputMode === 'url' ? 'bg-sky-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Paste Link</span>
          </button>

          <button
            onClick={() => setInputMode('claim')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              inputMode === 'claim' ? 'bg-sky-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Fact-Check Claim</span>
          </button>
        </div>

        {/* 1. UPLOAD MODE */}
        {inputMode === 'upload' && (
          <div>
            {!previewMedia ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl py-9 px-4 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-sky-400 bg-sky-950/30 scale-[1.01]'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950/50 hover:bg-slate-950/80'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,audio/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center shadow-md">
                  <Upload className="w-6 h-6 animate-bounce" />
                </div>

                <div className="text-sm sm:text-base font-bold text-white mb-1">
                  Drag & drop any photo, voice clip, or video here, or <span className="text-sky-400 underline">browse</span>
                </div>
                <div className="text-xs text-slate-400">
                  Supports Images (JPG, PNG, WEBP), Audio (MP3, WAV), and Videos (MP4)
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-950/90 rounded-2xl border border-slate-800 shadow-md">
                {previewMedia.type === 'image' && (
                  <img src={previewMedia.url} alt="Preview" className="w-20 h-20 object-cover rounded-xl border border-slate-800" />
                )}
                {previewMedia.type === 'audio' && (
                  <div className="w-20 h-20 rounded-xl bg-purple-950/40 text-purple-300 flex items-center justify-center font-mono text-xs border border-purple-800">
                    Audio Clip
                  </div>
                )}
                {previewMedia.type === 'video' && (
                  <video src={previewMedia.url} className="w-20 h-20 object-cover rounded-xl border border-slate-800" muted autoPlay loop />
                )}

                <div className="flex-1 text-center sm:text-left min-w-0">
                  <div className="text-xs font-bold text-white truncate mb-0.5">{previewMedia.name}</div>
                  <div className="text-[11px] text-slate-400 capitalize">{previewMedia.type} ready for AI analysis</div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => { setPreviewMedia(null); setSelectedFile(null); }}
                    className="p-2 text-slate-400 hover:text-red-400 rounded-xl transition-colors"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleTriggerFileAnalysis}
                    disabled={isLoading}
                    className="btn-primary text-xs py-2 px-4 flex items-center justify-center gap-1.5 flex-1 sm:flex-none font-bold"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Scan Authenticity</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. URL LINK MODE */}
        {inputMode === 'url' && (
          <form onSubmit={handleTriggerUrlAnalysis} className="space-y-3">
            <div className="relative">
              <input
                type="url"
                placeholder="https://example.com/image-or-video.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !urlInput.trim()}
                className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5 font-bold"
              >
                <span>Verify Media Link</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* 3. NEWS CLAIM MODE */}
        {inputMode === 'claim' && (
          <form onSubmit={handleTriggerClaimAnalysis} className="space-y-3">
            <div>
              <textarea
                placeholder="Paste any viral rumor or news claim (e.g. 'Breaking: Explosion reported near building...')"
                value={claimText}
                onChange={(e) => setClaimText(e.target.value)}
                rows={3}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !claimText.trim()}
                className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5 font-bold"
              >
                <span>Check News Accuracy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
