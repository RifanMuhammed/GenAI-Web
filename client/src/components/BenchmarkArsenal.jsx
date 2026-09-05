import React from 'react';
import { Sparkles, ImageIcon, Mic, Video, Flame } from 'lucide-react';

export default function BenchmarkArsenal({ cases, onSelectCase, activeCaseId, isLoading }) {
  if (!cases || cases.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 mb-5">
      <div className="flex items-center gap-1.5 mb-2">
        <Flame className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
          Try 1-Click Examples:
        </span>
      </div>

      {/* Smooth touch-enabled horizontal scroll container */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-0.5 scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0 touch-pan-x">
        {cases.map((item) => {
          const isSelected = activeCaseId === item.id;
          const isSynthetic = item.verdict.status === 'SYNTHETIC_MANIPULATED';

          return (
            <button
              key={item.id}
              onClick={() => onSelectCase(item)}
              disabled={isLoading}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all border active:scale-95 cursor-pointer ${
                isSelected
                  ? 'bg-sky-500/20 text-sky-200 border-sky-400 shadow-md shadow-sky-500/10'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className={`p-1 rounded-lg ${
                item.type === 'image' ? 'bg-sky-500/20 text-sky-400' :
                item.type === 'audio' ? 'bg-purple-500/20 text-purple-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                {item.type === 'image' && <ImageIcon className="w-3.5 h-3.5" />}
                {item.type === 'audio' && <Mic className="w-3.5 h-3.5" />}
                {item.type === 'video' && <Video className="w-3.5 h-3.5" />}
              </span>

              <span className="truncate max-w-[130px] sm:max-w-[200px] text-[11px] sm:text-xs">{item.title}</span>

              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isSynthetic ? 'bg-red-400 animate-pulse' : 'bg-emerald-400'}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
