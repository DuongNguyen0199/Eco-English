import React from 'react';
import { Mic, Volume2, Sparkles, Loader2 } from 'lucide-react';

export default function EmmiAvatar({ status = 'idle', onClick }) {
  // Statuses: 'idle' | 'listening' | 'thinking' | 'speaking'

  return (
    <div className="flex flex-col items-center justify-center my-4 cursor-pointer group" onClick={onClick}>
      {/* Orb Visual Container */}
      <div className={`emmi-orb-container transition-transform duration-300 group-hover:scale-105 ${status === 'speaking' ? 'emmi-orb-speaking scale-110' : ''}`}>
        {/* Glow Layer 1 */}
        <div
          className={`emmi-orb-layer-1 ${
            status === 'listening'
              ? '!bg-gradient-to-r !from-red-500 !to-pink-500 !opacity-100 animate-pulse'
              : status === 'thinking'
              ? '!bg-gradient-to-r !from-amber-400 !to-purple-600 animate-spin'
              : ''
          }`}
        />

        {/* Glow Layer 2 */}
        <div className="emmi-orb-layer-2" />

        {/* Inner Core */}
        <div className="emmi-orb-core flex items-center justify-center">
          {status === 'thinking' ? (
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          ) : status === 'listening' ? (
            <Mic className="w-8 h-8 text-pink-600 animate-pulse" />
          ) : status === 'speaking' ? (
            <Volume2 className="w-8 h-8 text-indigo-600 animate-bounce" />
          ) : (
            <Sparkles className="w-8 h-8 text-purple-500 transition-transform group-hover:rotate-12" />
          )}
        </div>
      </div>

      {/* Voice Wave Animation when speaking */}
      {status === 'speaking' && (
        <div className="flex items-center gap-1 mt-4 h-6">
          <div className="w-1 bg-purple-400 rounded-full animate-wave" style={{ animationDelay: '0ms' }} />
          <div className="w-1 bg-indigo-400 rounded-full animate-wave" style={{ animationDelay: '150ms' }} />
          <div className="w-1 bg-pink-400 rounded-full animate-wave" style={{ animationDelay: '300ms' }} />
          <div className="w-1 bg-blue-400 rounded-full animate-wave" style={{ animationDelay: '450ms' }} />
          <div className="w-1 bg-purple-400 rounded-full animate-wave" style={{ animationDelay: '600ms' }} />
        </div>
      )}

      {/* Assistant Status Badge */}
      <div className="mt-3 px-3.5 py-1 rounded-full ios-glass-button text-[11px] font-medium tracking-wide text-neutral-300 flex items-center gap-1.5 shadow-md">
        <div
          className={`w-2 h-2 rounded-full ${
            status === 'listening'
              ? 'bg-red-500 animate-ping'
              : status === 'thinking'
              ? 'bg-amber-400 animate-bounce'
              : status === 'speaking'
              ? 'bg-indigo-400 animate-pulse'
              : 'bg-green-400'
          }`}
        />
        <span>
          {status === 'listening'
            ? 'Đang lắng nghe...'
            : status === 'thinking'
            ? 'Đang kết nối Notion...'
            : status === 'speaking'
            ? 'Emmi đang nói...'
            : 'Trợ lý Emmi sẵn sàng'}
        </span>
      </div>
    </div>
  );
}
