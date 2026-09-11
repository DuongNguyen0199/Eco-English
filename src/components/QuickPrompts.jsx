import React from 'react';
import { Mic, Volume2, Settings, MessageSquarePlus } from 'lucide-react';

export default function QuickPrompts({ onAskEmmi, onRepeatSpeech, onOpenSettings, isListening }) {
  return (
    <div className="space-y-2 my-2 select-none">
      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-1">
        Câu hỏi gợi ý
      </span>

      {/* Main Request Prompt Button */}
      <button
        onClick={onAskEmmi}
        disabled={isListening}
        className="w-full ios-glass-button p-3.5 rounded-2xl flex items-center justify-between group border border-purple-500/30 hover:border-purple-400 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-blue-950/40 transition-all duration-200 active:scale-[0.98] shadow-lg shadow-purple-950/30"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/80 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Mic className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-purple-200 uppercase tracking-wider">Hỏi nhanh Emmi</h4>
            <p className="text-sm font-semibold text-white">"Emmi, nay có task gì không?"</p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 group-hover:bg-purple-500 group-hover:text-white transition-colors">
          Hỏi ngay
        </span>
      </button>

      {/* Secondary Quick Action Pills */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onRepeatSpeech}
          className="ios-glass-button p-2.5 rounded-xl flex items-center gap-2 text-xs font-medium text-neutral-200 hover:text-white active:scale-95 transition-all border border-white/5"
        >
          <Volume2 className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="truncate">🔊 Đọc lại bằng giọng nói</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="ios-glass-button p-2.5 rounded-xl flex items-center gap-2 text-xs font-medium text-neutral-200 hover:text-white active:scale-95 transition-all border border-white/5"
        >
          <Settings className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="truncate">⚙️ Cấu hình Notion API</span>
        </button>
      </div>
    </div>
  );
}
