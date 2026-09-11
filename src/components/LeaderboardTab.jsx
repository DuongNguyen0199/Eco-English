import React, { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabaseService';
import { Trophy, Flame, RefreshCw, User, Sparkles, Award } from 'lucide-react';

export default function LeaderboardTab({ currentXp, currentStreak, userLevel }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [userProfile, setUserProfile] = useState({ nickname: 'Học Viên Eco', avatar: '🎓' });

  useEffect(() => {
    loadLeaderboardData();
  }, [currentXp, currentStreak, userLevel]);

  async function loadLeaderboardData() {
    setLoading(true);
    const userId = await supabaseService.getUserId();
    setCurrentUserId(userId);

    const profile = await supabaseService.getUserProfile();
    setUserProfile(profile);

    // Sync progress to cloud first
    await supabaseService.syncUserProgress({ xp: currentXp, streak: currentStreak, userLevel });

    // Fetch updated leaderboard
    const data = await supabaseService.getLeaderboard();
    setLeaderboard(data);
    setLoading(false);
  }

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  // Find user rank
  const myRankIndex = leaderboard.findIndex(item => item.id === currentUserId);
  const myRank = myRankIndex >= 0 ? myRankIndex + 1 : '-';

  return (
    <div className="w-full space-y-3 pb-4 px-2">
      
      {/* Cartoon Top Header Banner */}
      <div className="bg-[#FFFDF0] border-[1.8px] border-slate-900 rounded-xl p-3 shadow-[2.5px_2.5px_0px_0px_#18181B] flex items-center justify-between">
        <div>
          <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-white border border-slate-900 text-slate-900">
            Bảng Xếp Hạng Đột Phá
          </span>
          <h2 className="text-sm font-black text-slate-900 mt-1 flex items-center gap-1">
            <Trophy className="w-4 h-4 text-amber-500 fill-amber-500" /> Bảng Vàng Học Viên
          </h2>
        </div>

        <button
          onClick={loadLeaderboardData}
          className="flex items-center space-x-1 bg-white border-[1.5px] border-slate-900 px-2 py-1 rounded-lg text-xs font-black shadow-[1.5px_1.5px_0px_0px_#18181B] hover:bg-slate-100 active:translate-y-0.5"
          title="Làm mới bảng xếp hạng"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-900 ${loading ? 'animate-spin' : ''}`} />
          <span>Tải lại</span>
        </button>
      </div>

      {/* Top 3 Podium Winners Box */}
      {leaderboard.length >= 1 && (
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          {/* Top 2 */}
          <div className="bg-white border-[1.5px] border-slate-900 rounded-xl p-2 text-center shadow-[1.5px_1.5px_0px_0px_#18181B] flex flex-col items-center justify-end min-h-[110px]">
            <span className="text-xl">{top2 ? top2.avatar : '🥈'}</span>
            <span className="text-[9px] font-black text-slate-900 truncate max-w-full mt-0.5">
              {top2 ? top2.display_name : 'Trống'}
            </span>
            <span className="text-[8.5px] font-bold text-slate-600">🥈 Hạng 2</span>
            <span className="text-[9.5px] font-extrabold text-amber-900 bg-amber-100 border border-amber-300 px-1 py-0.2 rounded mt-1">
              🏆 {top2 ? top2.xp : 0} XP
            </span>
          </div>

          {/* Top 1 */}
          <div className="bg-[#FEF08A] border-[1.8px] border-slate-900 rounded-xl p-2 text-center shadow-[2.5px_2.5px_0px_0px_#18181B] flex flex-col items-center justify-end min-h-[125px] ring-2 ring-amber-400">
            <div className="text-2xl animate-bounce">{top1 ? top1.avatar : '🥇'}</div>
            <span className="text-[10px] font-black text-slate-900 truncate max-w-full mt-0.5 uppercase">
              {top1 ? top1.display_name : 'Trống'}
            </span>
            <span className="text-[9px] font-black text-amber-900 flex items-center gap-0.5">
              👑 Quán Quân
            </span>
            <span className="text-[10px] font-black text-slate-900 bg-white border border-slate-900 px-1.5 py-0.2 rounded shadow-[1px_1px_0px_0px_#18181B] mt-1">
              🏆 {top1 ? top1.xp : 0} XP
            </span>
          </div>

          {/* Top 3 */}
          <div className="bg-white border-[1.5px] border-slate-900 rounded-xl p-2 text-center shadow-[1.5px_1.5px_0px_0px_#18181B] flex flex-col items-center justify-end min-h-[110px]">
            <span className="text-xl">{top3 ? top3.avatar : '🥉'}</span>
            <span className="text-[9px] font-black text-slate-900 truncate max-w-full mt-0.5">
              {top3 ? top3.display_name : 'Trống'}
            </span>
            <span className="text-[8.5px] font-bold text-slate-600">🥉 Hạng 3</span>
            <span className="text-[9.5px] font-extrabold text-amber-900 bg-amber-100 border border-amber-300 px-1 py-0.2 rounded mt-1">
              🏆 {top3 ? top3.xp : 0} XP
            </span>
          </div>
        </div>
      )}

      {/* Main Leaderboard Ranked List */}
      <div className="bg-white border-[1.8px] border-slate-900 rounded-xl p-3 shadow-[2.5px_2.5px_0px_0px_#18181B] space-y-2">
        <div className="flex items-center justify-between pb-1.5 border-b-[1.5px] border-slate-900 text-[10px] font-black uppercase text-slate-700">
          <span>Hạng / Học Viên</span>
          <span>Chuỗi & Điểm XP</span>
        </div>

        {loading ? (
          <div className="p-6 text-center space-y-2">
            <div className="w-5 h-5 border-2 border-slate-900 border-t-amber-400 rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-600">Đang đồng bộ thứ hạng từ Cloud...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="p-6 text-center space-y-1">
            <p className="text-xs font-bold text-slate-800">Chưa có ai tham gia bảng xếp hạng.</p>
            <p className="text-[10px] text-slate-500">Hãy vào Cài Đặt để cập nhật Tên hiển thị!</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {leaderboard.map((item, idx) => {
              const isMe = item.id === currentUserId;
              const rankText = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;

              return (
                <div
                  key={item.id || idx}
                  className={`p-2 rounded-lg border-[1.5px] border-slate-900 flex items-center justify-between transition-all ${
                    isMe
                      ? 'bg-[#FEF08A] shadow-[2px_2px_0px_0px_#18181B] ring-1 ring-slate-900'
                      : 'bg-[#FFFDF5] hover:bg-slate-50 shadow-[1px_1px_0px_0px_#18181B]'
                  }`}
                >
                  <div className="flex items-center space-x-2 overflow-hidden">
                    <span className="w-6 text-center font-black text-xs shrink-0">{rankText}</span>
                    <span className="text-base shrink-0">{item.avatar || '🎓'}</span>
                    <div className="overflow-hidden">
                      <p className="text-xs font-black text-slate-900 truncate flex items-center gap-1">
                        {item.display_name || 'Học Viên Eco'}
                        {isMe && (
                          <span className="text-[8px] bg-slate-900 text-white px-1 py-0.2 rounded uppercase font-black">
                            Bạn
                          </span>
                        )}
                      </p>
                      <p className="text-[9px] text-slate-700 font-bold flex items-center gap-1.5">
                        <span>Trình độ {item.user_level || 'B1'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <div className="flex items-center space-x-0.5 bg-white border border-slate-900 px-1.5 py-0.5 rounded text-[10px] font-black">
                      <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{item.streak || 1}d</span>
                    </div>

                    <div className="flex items-center space-x-0.5 bg-[#FEF08A] border border-slate-900 px-1.5 py-0.5 rounded text-[10px] font-black shadow-[1px_1px_0px_0px_#18181B]">
                      <span>🏆</span>
                      <span>{item.xp || 0}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Your Pinned Rank Footer */}
      <div className="bg-[#FEF08A] border-[1.8px] border-slate-900 rounded-xl p-2.5 shadow-[2.5px_2.5px_0px_0px_#18181B] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{userProfile.avatar}</span>
          <div>
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-700 block">Vị Trí Hiện Tại Của Bạn</span>
            <h4 className="text-xs font-black text-slate-900">
              Hạng #{myRank} • {userProfile.nickname}
            </h4>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <span className="bg-white border border-slate-900 px-2 py-0.5 rounded text-xs font-black shadow-[1px_1px_0px_0px_#18181B]">
            🔥 {currentStreak} ngày
          </span>
          <span className="bg-white border border-slate-900 px-2 py-0.5 rounded text-xs font-black shadow-[1px_1px_0px_0px_#18181B]">
            🏆 {currentXp} XP
          </span>
        </div>
      </div>
    </div>
  );
}
