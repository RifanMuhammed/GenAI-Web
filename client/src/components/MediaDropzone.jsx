import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, FileText, Sparkles, X, ArrowUpRight } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto px-4 mb-8">
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border-slate-800 bg-slate-900/70 shadow-xl">
        
        {/* Sleek Segmented Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl max-w-sm mx-auto mb-5 border border-slate-800">
          <button
            onClick={() => setInputMode('upload')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              inputMode === 'upload' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setInputMode('url')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              inputMode === 'url' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Paste Link
          </button>
          <button
            onClick={() => setInputMode('claim')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              inputMode === 'claim' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            News Claim
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
                className={`border-2 border-dashed rounded-xl py-8 px-4 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-cyan-400 bg-cyan-950/20'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/70'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,audio/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-sm font-semibold text-white">
                  Drop image, audio, or video here, or <span className="text-cyan-400">browse</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WEBP, MP3, WAV, MP4</div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                {previewMedia.type === 'image' && (
                  <img src={previewMedia.url} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-slate-800" />
                )}
                {previewMedia.type === 'audio' && (
                  <div className="w-20 h-20 rounded-lg bg-purple-950/40 text-purple-300 flex items-center justify-center font-mono text-xs border border-purple-800">
                    Audio Clip
                  </div>
                )}
                {previewMedia.type === 'video' && (
                  <video src={previewMedia.url} className="w-20 h-20 object-cover rounded-lg border border-slate-800" muted autoPlay loop />
                )}

                <div className="flex-1 text-center sm:text-left min-w-0">
                  <div className="text-xs font-bold text-white truncate">{previewMedia.name}</div>
                  <div className="text-[11px] text-slate-400 capitalize">{previewMedia.type} media ready for scan</div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => { setPreviewMedia(null); setSelectedFile(null); }}
                    className="p-2 text-slate-400 hover:text-red-400 rounded-lg"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleTriggerFileAnalysis}
                    disabled={isLoading}
                    className="flex-1 sm:flex-initial btn-primary py-2 px-4 text-xs font-bold"
                  >
                    {isLoading ? 'Scanning...' : 'Verify Media'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. URL MODE */}
        {inputMode === 'url' && (
          <form onSubmit={handleTriggerUrlAnalysis} className="flex gap-2">
            <input
              type="url"
              placeholder="Paste image/audio/video URL from web or social media..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              required
            />
            <button
              type="submit"
              disabled={isLoading || !urlInput.trim()}
              className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5 flex-shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Analyzing...' : 'Scan URL'}</span>
            </button>
          </form>
        )}

        {/* 3. CLAIM MODE */}
        {inputMode === 'claim' && (
          <form onSubmit={handleTriggerClaimAnalysis} className="space-y-3">
            <textarea
              rows={2}
              placeholder="e.g. 'Breaking: Explosion reported near the Pentagon...'"
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !claimText.trim()}
                className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Cross-Checking...' : 'Verify Claim'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
