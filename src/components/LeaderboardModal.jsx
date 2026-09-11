import React, { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabaseService';
import { Trophy, Flame, User, X, RefreshCw, Sparkles, Check } from 'lucide-react';

const AVATAR_OPTIONS = ['🎓', '🦊', '⚡', '👑', '🔥', '🚀', '🦉', '⭐', '🐯', '💎'];

export default function LeaderboardModal({ isOpen, onClose, currentXp, currentStreak, userLevel }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState('Học Viên Eco');
  const [selectedAvatar, setSelectedAvatar] = useState('🎓');
  const [isSaved, setIsSaved] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadProfileAndLeaderboard();
    }
  }, [isOpen]);

  async function loadProfileAndLeaderboard() {
    setLoading(true);
    const userId = await supabaseService.getUserId();
    setCurrentUserId(userId);

    const { nickname: savedName, avatar: savedAvatar } = await supabaseService.getUserProfile();
    setNickname(savedName);
    setSelectedAvatar(savedAvatar);

    // Sync current progress first
    await supabaseService.syncUserProgress({ xp: currentXp, streak: currentStreak, userLevel });

    // Fetch updated leaderboard
    const data = await supabaseService.getLeaderboard();
    setLeaderboard(data);
    setLoading(false);
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    await supabaseService.setUserProfile(nickname.trim(), selectedAvatar);
    await supabaseService.syncUserProgress({ xp: currentXp, streak: currentStreak, userLevel });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);

    // Refresh leaderboard
    const data = await supabaseService.getLeaderboard();
    setLeaderboard(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in">
      <div className="bg-grid-notebook border-[2px] border-slate-900 rounded-2xl w-full max-w-sm max-h-[90vh] flex flex-col shadow-[4px_4px_0px_0px_#18181B] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#FEF08A] border-b-[1.8px] border-slate-900 px-4 py-3 flex items-center justify-between shadow-[0_1.5px_0_0_#18181B]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-white border-[1.8px] border-slate-900 flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_#18181B]">
              <Trophy className="w-4 h-4 text-amber-600 fill-amber-500" />
            </div>
            <div>
              <h2 className="text-xs font-black uppercase text-slate-900 tracking-wider">Bảng Xếp Hạng Bạn Bè</h2>
              <p className="text-[9.5px] text-slate-800 font-extrabold">Đồng bộ Supabase Realtime ☁️</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 bg-white border-[1.5px] border-slate-900 rounded-lg shadow-[1px_1px_0px_0px_#18181B] hover:bg-slate-100"
          >
            <X className="w-4 h-4 text-slate-900" />
          </button>
        </div>

        <div className="p-3.5 space-y-3.5 overflow-y-auto flex-1">
          
          {/* Profile Setup Box */}
          <form onSubmit={handleSaveProfile} className="bg-white p-3 rounded-xl border-[1.8px] border-slate-900 shadow-[2px_2px_0px_0px_#18181B] space-y-2">
            <h3 className="text-[11px] font-black text-slate-900 flex items-center gap-1 uppercase">
              <User className="w-3.5 h-3.5 text-indigo-600" /> Hồ Sơ Thi Đấu Của Bạn
            </h3>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Nhập biệt danh của bạn..."
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border-[1.5px] border-slate-900 font-bold focus:outline-none focus:bg-[#FFFDF0]"
                />
                <span className="absolute left-2.5 top-1.5 text-sm">{selectedAvatar}</span>
              </div>

              <button
                type="submit"
                className="px-3 py-1.5 bg-[#FEF08A] border-[1.5px] border-slate-900 text-slate-900 rounded-lg text-xs font-black shadow-[1.5px_1.5px_0px_0px_#18181B] hover:bg-amber-300 shrink-0 flex items-center gap-1"
              >
                {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Sparkles className="w-3.5 h-3.5 text-amber-700" />}
                {isSaved ? 'Đã Lưu' : 'Cập nhật'}
              </button>
            </div>

            {/* Avatar Picker */}
            <div className="flex items-center space-x-1 pt-1 overflow-x-auto pb-1">
              <span className="text-[10px] font-bold text-slate-500 shrink-0">Avatar:</span>
              {AVATAR_OPTIONS.map(av => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`w-6 h-6 rounded flex items-center justify-center text-xs border transition-all ${
                    selectedAvatar === av ? 'bg-[#FEF08A] border-slate-900 shadow-[1px_1px_0px_0px_#18181B] scale-110' : 'bg-slate-50 border-transparent hover:bg-slate-100'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </form>

          {/* Leaderboard List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-black text-slate-900 uppercase flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Top Học Viên Tích Cực
              </span>
              <button
                onClick={loadProfileAndLeaderboard}
                className="text-[9.5px] font-extrabold text-slate-800 bg-white border border-slate-900 px-1.5 py-0.5 rounded shadow-[1px_1px_0px_0px_#18181B] flex items-center gap-1 hover:bg-slate-100"
              >
                <RefreshCw className={`w-2.5 h-2.5 ${loading ? 'animate-spin' : ''}`} /> Tải lại
              </button>
            </div>

            {loading ? (
              <div className="p-6 text-center bg-white rounded-xl border-[1.8px] border-slate-900 space-y-2">
                <div className="w-5 h-5 border-2 border-slate-900 border-t-amber-400 rounded-full animate-spin mx-auto"></div>
                <p className="text-xs font-bold text-slate-600">Đang tải bảng xếp hạng từ Cloud...</p>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="p-6 text-center bg-white rounded-xl border-[1.8px] border-slate-900 space-y-1">
                <p className="text-xs font-bold text-slate-800">Chưa có ai tham gia bảng xếp hạng.</p>
                <p className="text-[10px] text-slate-500">Hãy nhấn "Cập nhật" ở trên để là người đầu tiên ghi danh!</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {leaderboard.map((item, idx) => {
                  const isCurrent = item.id === currentUserId;
                  const rankBadge = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;

                  return (
                    <div
                      key={item.id || idx}
                      className={`p-2 rounded-xl border-[1.5px] border-slate-900 flex items-center justify-between transition-all ${
                        isCurrent
                          ? 'bg-[#FEF08A] shadow-[2px_2px_0px_0px_#18181B] ring-1 ring-slate-900'
                          : 'bg-white shadow-[1.5px_1.5px_0px_0px_#18181B]'
                      }`}
                    >
                      <div className="flex items-center space-x-2 overflow-hidden">
                        <span className="w-6 text-center font-black text-xs shrink-0">{rankBadge}</span>
                        <span className="text-sm shrink-0">{item.avatar || '🎓'}</span>
                        <div className="overflow-hidden">
                          <p className="text-xs font-black text-slate-900 truncate">
                            {item.display_name || 'Học Viên Eco'}
                            {isCurrent && <span className="ml-1 text-[8.5px] bg-slate-900 text-white px-1 py-0.2 rounded uppercase font-extrabold">Bạn</span>}
                          </p>
                          <p className="text-[9px] text-slate-600 font-bold flex items-center gap-1">
                            <span>{item.user_level || 'B1'}</span> • <span>🔥 {item.streak || 1} ngày</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md shadow-[1px_1px_0px_0px_#18181B]">
                          🏆 {item.xp || 0} XP
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
