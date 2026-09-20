import React, { useState } from 'react';
import { BookMarked, User, Users, Sparkles, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';

const AVATAR_OPTIONS = ['🎓', '🦊', '⚡', '👑', '🔥', '🚀', '🦉', '⭐', '🐯', '💎'];

export default function LoginModal({ isOpen, onLoginSuccess }) {
  const [nickname, setNickname] = useState('');
  const [learnSpace, setLearnSpace] = useState('PUBLIC');
  const [selectedAvatar, setSelectedAvatar] = useState('🎓');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!nickname.trim()) {
      setErrorMsg('Vui lòng nhập Tên hiển thị!');
      return;
    }

    if (!learnSpace.trim()) {
      setErrorMsg('Vui lòng nhập Mã Không Gian Học Tập (hoặc để PUBLIC)!');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await supabaseService.loginOrRegisterAccount(
        nickname.trim(),
        learnSpace.trim(),
        selectedAvatar
      );

      if (res.isError) {
        setErrorMsg(res.message);
        setIsSubmitting(false);
        return;
      }

      setSuccessMsg(res.message);
      setTimeout(() => {
        setIsSubmitting(false);
        onLoginSuccess && onLoginSuccess(res);
      }, 1000);
    } catch (err) {
      console.error('Login submit error:', err);
      setErrorMsg('Đã có lỗi xảy ra khi đăng nhập. Vui lòng thử lại!');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-50 flex items-center justify-center p-3">
      <div className="bg-[#FFFDF5] rounded-2xl max-w-sm w-full p-4 border-[1.8px] border-slate-900 shadow-[4px_4px_0px_0px_#18181B] space-y-3.5 max-h-[92vh] overflow-y-auto animate-fadeIn">
        
        {/* Top Header Logo */}
        <div className="text-center space-y-1 border-b-[1.8px] border-slate-900 pb-3">
          <div className="w-10 h-10 rounded-xl bg-[#FEF08A] border-[1.8px] border-slate-900 flex items-center justify-center mx-auto shadow-[2px_2px_0px_0px_#18181B]">
            <BookMarked className="w-5 h-5 text-slate-900" />
          </div>
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center justify-center gap-1">
            Eco English <span className="text-[9px] bg-emerald-300 border border-slate-900 px-1.5 py-0.2 rounded shadow-[1px_1px_0px_0px_#18181B]">ONBOARDING</span>
          </h2>
          <p className="text-[10.5px] font-bold text-slate-600">
            Đăng nhập Tên & Mã Không gian để bắt đầu học và đồng bộ từ vựng
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          
          {/* 1. Display Name Input */}
          <div className="space-y-1">
            <label className="block text-xs font-black text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-600" /> Tên hiển thị (Nickname) (*)
              </span>
              <span className="text-[9px] font-bold text-slate-500">Duy nhất</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                required
                placeholder="Nhập tên của bạn (e.g. Robert, Hoàng Nam)..."
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border-[1.5px] border-slate-900 font-bold focus:outline-none focus:bg-[#FFFDF0]"
              />
              <span className="absolute left-2.5 text-sm">{selectedAvatar}</span>
            </div>
          </div>

          {/* Avatar Picker */}
          <div className="flex items-center space-x-1 overflow-x-auto pt-0.5">
            <span className="text-[10px] font-bold text-slate-500 shrink-0">Avatar:</span>
            {AVATAR_OPTIONS.map(av => (
              <button
                key={av}
                type="button"
                onClick={() => setSelectedAvatar(av)}
                className={`w-5 h-5 rounded flex items-center justify-center text-xs border transition-all ${
                  selectedAvatar === av ? 'bg-[#FEF08A] border-slate-900 shadow-[1px_1px_0px_0px_#18181B] scale-110' : 'bg-white border-slate-300 hover:bg-slate-100'
                }`}
              >
                {av}
              </button>
            ))}
          </div>

          {/* 2. Learn Space Code Input */}
          <div className="space-y-1">
            <label className="block text-xs font-black text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-amber-600" /> Mã Không Gian Học Tập (Learn Space) (*)
              </span>
              <span className="text-[9px] font-bold text-indigo-900 bg-indigo-100 border border-indigo-300 px-1.5 py-0.2 rounded">
                Dùng chung nhóm
              </span>
            </label>
            <input
              type="text"
              required
              placeholder="Nhập mã Learn Space (e.g. ECO2026 hoặc PUBLIC)..."
              value={learnSpace}
              onChange={(e) => setLearnSpace(e.target.value.toUpperCase())}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border-[1.5px] border-slate-900 font-extrabold uppercase tracking-wider focus:outline-none focus:bg-[#FFFDF0]"
            />
          </div>

          {/* Help Tip Box */}
          <div className="bg-[#FFFDF0] p-2.5 rounded-xl border border-slate-900 text-[10px] text-slate-800 space-y-1 font-medium leading-tight shadow-[1px_1px_0px_0px_#18181B]">
            <p className="font-black text-slate-900 flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-600" /> Khôi phục tài khoản cũ trên máy khác:
            </p>
            <p>
              Nếu bạn đã từng cài extension trên thiết bị khác, hãy <strong>nhập lại đúng Tên hiển thị + Mã Learn Space</strong> để khôi phục toàn bộ XP, Streak và Thư viện cụm từ cũ!
            </p>
          </div>

          {/* Error / Success Alerts */}
          {errorMsg && (
            <div className="p-2 bg-rose-50 border border-rose-400 rounded-lg text-[10.5px] font-extrabold text-rose-950 flex items-center gap-1 shadow-[1px_1px_0px_0px_#18181B]">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2 bg-emerald-50 border border-emerald-400 rounded-lg text-[10.5px] font-extrabold text-emerald-950 flex items-center gap-1 shadow-[1px_1px_0px_0px_#18181B]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-[#FEF08A] border-[1.8px] border-slate-900 text-slate-900 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#18181B] hover:bg-amber-300 flex items-center justify-center gap-1.5 transition-all disabled:opacity-60"
          >
            <Sparkles className="w-4 h-4 text-amber-700" />
            {isSubmitting ? 'Đang kiểm tra tài khoản...' : '🚀 Đăng Nhập / Bắt Đầu Học'}
          </button>
        </form>
      </div>
    </div>
  );
}
