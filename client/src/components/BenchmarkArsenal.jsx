import React from 'react';
import { Flame, ImageIcon, Mic, Video, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function BenchmarkArsenal({ cases, onSelectCase, activeCaseId, isLoading }) {
  if (!cases || cases.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Flame className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Try Quick Real-World Examples:
        </span>
      </div>

      {/* Sleek horizontal scrolling pill selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {cases.map((item) => {
          const isSelected = activeCaseId === item.id;
          const isSynthetic = item.verdict.status === 'SYNTHETIC_MANIPULATED';

          return (
            <button
              key={item.id}
              onClick={() => onSelectCase(item)}
              disabled={isLoading}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-md shadow-cyan-500/10 scale-[1.02]'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className={`p-1 rounded-md ${
                item.type === 'image' ? 'bg-blue-500/20 text-blue-400' :
                item.type === 'audio' ? 'bg-purple-500/20 text-purple-400' :
                'bg-amber-500/20 text-amber-400'
              }`}>
                {item.type === 'image' && <ImageIcon className="w-3.5 h-3.5" />}
                {item.type === 'audio' && <Mic className="w-3.5 h-3.5" />}
                {item.type === 'video' && <Video className="w-3.5 h-3.5" />}
              </span>

              <span className="truncate max-w-[140px] sm:max-w-[200px]">{item.title}</span>

              <span className={`w-1.5 h-1.5 rounded-full ${isSynthetic ? 'bg-red-400' : 'bg-emerald-400'}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
