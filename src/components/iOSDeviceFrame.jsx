import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';

export default function IOSDeviceFrame({ children, currentScreen = 'Home' }) {
  const [isFrameEnabled, setIsFrameEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-0 sm:p-4 selection:bg-purple-500 selection:text-white">
      {/* Frame View Toggle Bar for Desktop Preview */}
      <div className="hidden sm:flex items-center gap-3 mb-4 bg-neutral-900/80 px-4 py-2 rounded-full border border-neutral-800 backdrop-blur-md shadow-xl text-xs">
        <span className="text-neutral-400 font-medium">Chế độ xem:</span>
        <button
          onClick={() => setIsFrameEnabled(true)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
            isFrameEnabled ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Khung iPhone 15</span>
        </button>
        <button
          onClick={() => setIsFrameEnabled(false)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
            !isFrameEnabled ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Toàn màn hình</span>
        </button>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 relative ${
          isFrameEnabled
            ? 'max-w-[410px] h-[845px] rounded-[52px] border-[10px] border-neutral-800 shadow-[0_25px_70px_rgba(0,0,0,0.95)] ring-1 ring-white/10 overflow-hidden bg-black flex flex-col'
            : 'max-w-md h-screen sm:h-[840px] sm:rounded-3xl border border-neutral-800 bg-black flex flex-col overflow-hidden shadow-2xl'
        }`}
      >
        {/* iOS Status Bar */}
        <div className="pt-3 px-7 pb-2 flex items-center justify-between z-30 select-none bg-gradient-to-b from-black/80 to-transparent">
          {/* Time */}
          <span className="text-xs font-semibold tracking-tight text-white pl-1">
            {currentTime || '09:41'}
          </span>

          {/* Dynamic Island (iPhone 15 Pro style) */}
          {isFrameEnabled && (
            <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-[115px] h-[28px] bg-black rounded-full flex items-center justify-between px-2.5 border border-neutral-800/80 shadow-inner z-40">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-700/60" />
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-purple-500/80 animate-pulse" />
              </div>
            </div>
          )}

          {/* Status Icons */}
          <div className="flex items-center gap-1.5 text-white/90">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* App Content viewport */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
          {children}
        </div>

        {/* iOS Home Indicator */}
        <div className="py-2 flex justify-center z-30 bg-black/40 backdrop-blur-sm select-none">
          <div className="w-32 h-1 bg-white/40 rounded-full" />
        </div>
      </div>
    </div>
  );
}
