import React, { useState } from 'react';
import PhraseVaultTab from './PhraseVaultTab';
import RandomExerciseTab from './RandomExerciseTab';
import LeaderboardTab from './LeaderboardTab';
import SettingsModal from './SettingsModal';
import LeaderboardModal from './LeaderboardModal';
import CurvedBottomNav from './CurvedBottomNav';
import { LEVEL_DESCRIPTIONS } from '../data/cefrData';
import { Layers, Dumbbell, Settings, Flame, BookMarked, Target, Trophy } from 'lucide-react';

export default function SidePanelLayout({
  userLevel,
  onLevelChange,
  phrases,
  streak,
  xp = 0,
  onAddXP,
  onAddPhrase,
  onDeletePhrase,
  onEditPhrase,
  onUpdateMastery,
  onResetData
}) {
  const [activeTab, setActiveTab] = useState('vault'); // Default: 'vault' (Lật thẻ SRS)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  const tabs = [
    { id: 'vault', label: 'Lật thẻ SRS', icon: Layers },
    { id: 'exercise', label: 'Luyện tập', icon: Dumbbell },
    { id: 'leaderboard', label: 'Xếp hạng', icon: Trophy }
  ];

  return (
    <div className="w-full h-screen max-h-screen bg-grid-notebook text-slate-900 font-sans flex flex-col justify-between px-0 mx-0 overflow-hidden relative">
      
      {/* Notebook Grid Header - Slender 1.8px Border */}
      <header className="bg-grid-notebook border-b-[1.8px] border-slate-900 px-3 py-2 shrink-0 z-30 flex items-center justify-between shadow-[0_2px_0_0_#18181B]">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-white border-[1.8px] border-slate-900 flex items-center justify-center shadow-[1.8px_1.8px_0px_0px_#18181B]">
            <BookMarked className="w-4 h-4 text-slate-900" />
          </div>
          <div>
            <h1 className="text-xs font-black tracking-tight text-slate-900 flex items-center gap-1 uppercase">
              Eco English <span className="text-[8px] font-extrabold bg-[#FEF08A] border border-slate-900 text-slate-900 px-1 py-0.2 rounded shadow-[1px_1px_0px_0px_#18181B]">SRS</span>
            </h1>
            <p className="text-[9px] text-slate-800 font-bold">Tập Học Tiếng Anh B1-C2</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <div className="flex items-center space-x-1 bg-white border-[1.8px] border-slate-900 px-2 py-0.5 rounded-lg text-xs font-black shadow-[1.5px_1.5px_0px_0px_#18181B]">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{streak} ngày</span>
          </div>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center space-x-1 border-[1.8px] border-slate-900 px-2 py-0.5 rounded-lg text-xs font-black shadow-[1.5px_1.5px_0px_0px_#18181B] hover:bg-amber-300 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer ${
              activeTab === 'leaderboard' ? 'bg-amber-300 ring-1 ring-slate-900' : 'bg-[#FEF08A]'
            }`}
            title="Chuyển sang Tab Xếp Hạng Bạn Bè"
          >
            <span className="text-amber-600">🏆</span>
            <span>{xp} XP</span>
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1 bg-white border-[1.8px] border-slate-900 rounded-lg shadow-[1.5px_1.5px_0px_0px_#18181B] hover:bg-slate-100 active:translate-x-0.5 active:translate-y-0.5 transition-all"
            title="Cài đặt mục tiêu & Hồ sơ"
          >
            <Settings className="w-3.5 h-3.5 text-slate-900" />
          </button>
        </div>
      </header>

      {/* Continuous Marquee Rivalry Ticker Bar (Dòng chữ chạy liên tục cạnh tranh) */}
      <div className="bg-[#FFFDF0] border-b-[1.8px] border-slate-900 px-2 py-1 shrink-0 z-25 flex items-center overflow-hidden text-[10px] font-black text-slate-900 shadow-[0_1px_0_0_#18181B]">
        <div className="bg-amber-300 text-slate-900 px-1.5 py-0.2 rounded border border-slate-900 text-[8px] font-black uppercase tracking-wider shrink-0 mr-1.5 flex items-center gap-1 shadow-[1px_1px_0px_0px_#18181B]">
          <Flame className="w-2.5 h-2.5 text-amber-600 fill-amber-500" /> THÁCH THỨC
        </div>
        <div className="overflow-hidden w-full relative flex items-center">
          <div className="animate-marquee whitespace-nowrap font-black text-slate-900">
            🔥 Học Viên Robert đang giữ chuỗi {Math.max(streak + 3, 14)} ngày với {Math.max(xp + 200, 1250)} XP. Đừng để bạn ấy vượt qua, cố lên! 💪 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ⚡ Top 2: Emma ({Math.max(xp + 80, 980)} XP) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🎯 Bạn đang có {streak} ngày ({xp} XP) — Tiếp tục cày để lên Top 1 nào! 🚀
          </div>
        </div>
      </div>

      {/* Pinned Goal Line (Dòng chữ ghim mục tiêu làm chủ) */}
      <div className="bg-[#FEF08A] border-b-[1.8px] border-slate-900 px-3 py-1.5 shrink-0 z-20 shadow-[0_1.5px_0_0_#18181B] flex items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="bg-slate-900 text-white text-[8.5px] px-1.5 py-0.5 rounded font-black shrink-0 uppercase tracking-wide flex items-center gap-1">
            <Target className="w-3 h-3 text-amber-300" /> MỤC TIÊU {userLevel}
          </span>
          <span className="text-[10px] font-extrabold text-slate-900 truncate" title={LEVEL_DESCRIPTIONS[userLevel]?.desc}>
            {LEVEL_DESCRIPTIONS[userLevel]?.desc || LEVEL_DESCRIPTIONS['B1'].desc}
          </span>
        </div>
      </div>

      {/* Main Tab Content - Independently Scrollable on Notebook Grid */}
      <main className="flex-1 w-full px-0 py-2.5 overflow-y-auto scroll-smooth">
        {activeTab === 'vault' && (
          <PhraseVaultTab
            phrases={phrases}
            onAddPhrase={onAddPhrase}
            onDeletePhrase={onDeletePhrase}
            onEditPhrase={onEditPhrase}
            onUpdateMastery={onUpdateMastery}
          />
        )}

        {activeTab === 'exercise' && (
          <RandomExerciseTab
            phrases={phrases}
            onUpdateMastery={onUpdateMastery}
            xp={xp}
            onAddXP={onAddXP}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardTab
            currentXp={xp}
            currentStreak={streak}
            userLevel={userLevel}
          />
        )}
      </main>

      {/* Pinned Bottom Navigation Bar with Curved Squared SVG Notch */}
      <CurvedBottomNav
        tabs={tabs}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userLevel={userLevel}
        onLevelChange={onLevelChange}
        phrases={phrases}
        onResetData={onResetData}
        xp={xp}
        streak={streak}
      />

      {/* Supabase Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        currentXp={xp}
        currentStreak={streak}
        userLevel={userLevel}
      />
    </div>
  );
}
