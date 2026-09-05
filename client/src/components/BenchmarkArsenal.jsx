import React from 'react';
import { Sparkles, ImageIcon, Mic, Video, CheckCircle2, AlertTriangle, Flame } from 'lucide-react';

export default function BenchmarkArsenal({ cases, onSelectCase, activeCaseId, isLoading }) {
  if (!cases || cases.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 mb-6">
      <div className="flex items-center gap-2 mb-2.5">
        <Flame className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Try 1-Click Real World Examples:
        </span>
      </div>

      {/* Sleek horizontal pill selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {cases.map((item) => {
          const isSelected = activeCaseId === item.id;
          const isSynthetic = item.verdict.status === 'SYNTHETIC_MANIPULATED';

          return (
            <button
              key={item.id}
              onClick={() => onSelectCase(item)}
              disabled={isLoading}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                isSelected
                  ? 'bg-sky-500/20 text-sky-200 border-sky-400 shadow-md shadow-sky-500/10 scale-[1.02]'
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

              <span className="truncate max-w-[150px] sm:max-w-[220px]">{item.title}</span>

              <span className={`w-2 h-2 rounded-full ${isSynthetic ? 'bg-red-400 animate-pulse' : 'bg-emerald-400'}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
