import React, { useState, useEffect } from 'react';
import { CEFR_LEVELS, LEVEL_DESCRIPTIONS } from '../data/cefrData';
import { supabaseService } from '../services/supabaseService';
import { storageService } from '../services/storageService';
import { Settings, RefreshCcw, Download, X, Target, User, Sparkles, AlertCircle, CheckCircle2, Copy, Check, Users } from 'lucide-react';

const AVATAR_OPTIONS = ['🎓', '🦊', '⚡', '👑', '🔥', '🚀', '🦉', '⭐', '🐯', '💎'];

export default function SettingsModal({ isOpen, onClose, userLevel, onLevelChange, phrases, onResetData, xp = 0, streak = 1, onSyncCommunity }) {
  const [nickname, setNickname] = useState('Học Viên Eco');
  const [selectedAvatar, setSelectedAvatar] = useState('🎓');
  const [learnSpace, setLearnSpace] = useState('PUBLIC');
  const [userId, setUserId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadProfileData();
    }
  }, [isOpen]);

  async function loadProfileData() {
    setErrorMsg('');
    setSuccessMsg('');

    const uid = await supabaseService.getUserId();
    setUserId(uid);

    const { nickname: savedName, avatar: savedAvatar } = await supabaseService.getUserProfile();
    setNickname(savedName);
    setSelectedAvatar(savedAvatar);

    const space = await storageService.getLearnSpace();
    setLearnSpace(space || 'PUBLIC');
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!nickname.trim()) {
      setErrorMsg('Tên hiển thị không được để trống!');
      return;
    }

    const cleanName = nickname.trim();
    setIsSaving(true);

    // Check if display name is already taken by another user in Supabase
    const isTaken = await supabaseService.isDisplayNameTaken(cleanName, userId);

    if (isTaken) {
      setIsSaving(false);
      setErrorMsg(`❌ Tên hiển thị "${cleanName}" đã được người khác sử dụng, vui lòng chọn tên khác!`);
      return;
    }

    // Save profile & Learn Space locally and sync to Cloud
    await supabaseService.setUserProfile(cleanName, selectedAvatar);
    const cleanSpace = await storageService.setLearnSpace(learnSpace);
    setLearnSpace(cleanSpace);

    await supabaseService.syncUserProgress({ xp, streak, userLevel });
    await supabaseService.syncPhrasesVault(phrases);

    if (onSyncCommunity) {
      await onSyncCommunity();
    }

    setIsSaving(false);
    setSuccessMsg('✅ Cập nhật Hồ sơ & Không gian học tập thành công!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleCopyUserId = () => {
    if (userId) {
      navigator.clipboard.writeText(userId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(phrases, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `eco_english_phrases_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!isOpen) return null;

  const currentGoal = LEVEL_DESCRIPTIONS[userLevel] || LEVEL_DESCRIPTIONS['B1'];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-3">
      <div className="bg-[#FFFDF5] rounded-2xl max-w-sm w-full p-4 border-[1.8px] border-slate-900 shadow-[3.5px_3.5px_0px_0px_#18181B] space-y-3.5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-[1.8px] border-slate-900 pb-2">
          <h3 className="text-xs font-black text-slate-900 uppercase flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-slate-900" /> Cài Đặt Hồ Sơ & Mục Tiêu
          </h3>
          <button
            onClick={onClose}
            className="p-1 bg-white border border-slate-900 rounded-lg shadow-[1px_1px_0px_0px_#18181B] text-slate-900 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. DISPLAY NAME & USER ID SETUP */}
        <form onSubmit={handleSaveProfile} className="bg-white p-3 rounded-xl border-[1.8px] border-slate-900 shadow-[2px_2px_0px_0px_#18181B] space-y-2">
          <label className="block text-xs font-black text-slate-900 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-indigo-600" /> Tên hiển thị (Nickname)
            </span>
            <span className="text-[9px] font-bold text-slate-500">Đồng bộ Bảng Xếp Hạng</span>
          </label>

          <div className="relative flex items-center">
            <input
              type="text"
              required
              placeholder="Nhập tên hiển thị duy nhất..."
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border-[1.5px] border-slate-900 font-bold focus:outline-none focus:bg-[#FFFDF0]"
            />
            <span className="absolute left-2.5 text-sm">{selectedAvatar}</span>
          </div>

          {/* Avatar Picker */}
          <div className="flex items-center space-x-1 pt-1 overflow-x-auto">
            <span className="text-[10px] font-bold text-slate-500 shrink-0">Avatar:</span>
            {AVATAR_OPTIONS.map(av => (
              <button
                key={av}
                type="button"
                onClick={() => setSelectedAvatar(av)}
                className={`w-5 h-5 rounded flex items-center justify-center text-xs border transition-all ${
                  selectedAvatar === av ? 'bg-[#FEF08A] border-slate-900 shadow-[1px_1px_0px_0px_#18181B] scale-110' : 'bg-slate-50 border-transparent hover:bg-slate-100'
                }`}
              >
                {av}
              </button>
            ))}
          </div>

          {/* Learn Space (Group / Community Code) Field */}
          <div className="pt-1 space-y-1 border-t border-slate-200">
            <label className="block text-xs font-black text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-600" /> Mã Không Gian Học Tập (Learn Space)
              </span>
              <span className="text-[9px] font-bold text-indigo-900 bg-indigo-100 border border-indigo-300 px-1.5 py-0.2 rounded">
                Dùng chung cụm từ nhóm
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. ECO2026, LOP_B1 (Mặc định: PUBLIC)"
              value={learnSpace}
              onChange={(e) => setLearnSpace(e.target.value.toUpperCase())}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border-[1.5px] border-slate-900 font-extrabold uppercase tracking-wider focus:outline-none focus:bg-[#FFFDF0]"
            />
            <p className="text-[9.5px] text-slate-600 font-semibold leading-tight">
              💡 <strong>Mẹo:</strong> Nhập cùng mã với bạn bè (VD: <em>ECO2026</em>) để dùng chung cụm từ nhóm. Để <em>PUBLIC</em> để dùng chung với toàn bộ cộng đồng!
            </p>
          </div>

          {/* Auto-generated User ID Display Box */}
          <div className="bg-[#FFFDF0] p-2 rounded-lg border border-slate-900 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-black uppercase text-slate-500 block">User ID (Mã định danh tự động):</span>
              <span className="text-[10.5px] font-extrabold text-slate-900 font-mono select-all">{userId || 'Đang khởi tạo...'}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyUserId}
              className="p-1 bg-white border border-slate-900 rounded shadow-[1px_1px_0px_0px_#18181B] hover:bg-slate-100 text-[9px] font-black flex items-center gap-0.5"
              title="Sao chép User ID"
            >
              {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-900" />}
              {copiedId ? 'Copped' : 'Copy'}
            </button>
          </div>

          {/* Alert Error / Success Messages */}
          {errorMsg && (
            <div className="p-2 bg-rose-50 border border-rose-400 rounded-lg text-[10.5px] font-extrabold text-rose-900 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2 bg-emerald-50 border border-emerald-400 rounded-lg text-[10.5px] font-extrabold text-emerald-900 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-1.5 bg-[#FEF08A] border-[1.8px] border-slate-900 text-slate-900 rounded-lg text-xs font-black shadow-[1.5px_1.5px_0px_0px_#18181B] hover:bg-amber-300 flex items-center justify-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            {isSaving ? 'Đang kiểm tra...' : 'Lưu Tên Hiển Thị'}
          </button>
        </form>

        {/* 2. LEVEL SETTING */}
        <div className="space-y-2">
          <label className="block text-xs font-black text-slate-900">Trình độ CEFR Mục Tiêu</label>
          <div className="grid grid-cols-2 gap-1.5">
            {CEFR_LEVELS.map(l => (
              <button
                key={l.id}
                onClick={() => onLevelChange(l.id)}
                className={`p-2 rounded-xl text-xs font-black text-left border-[1.8px] border-slate-900 transition-all ${
                  userLevel === l.id
                    ? 'bg-[#FEF08A] text-slate-900 shadow-[1.8px_1.8px_0px_0px_#18181B] scale-[1.02]'
                    : 'bg-white text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div>{l.name}</div>
              </button>
            ))}
          </div>

          {/* Goal Description Box */}
          <div className="bg-[#FFFDF0] p-2.5 rounded-xl border-[1.5px] border-slate-900 shadow-[1.5px_1.5px_0px_0px_#18181B] space-y-1">
            <div className="text-[10px] font-black text-slate-900 uppercase flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-slate-900" /> Mục tiêu làm chủ {userLevel}:
            </div>
            <p className="text-[11px] font-bold text-slate-800 leading-relaxed">
              "{currentGoal.desc}"
            </p>
          </div>
        </div>

        {/* 3. BACKUP & EXPORT DATA */}
        <div className="space-y-1.5 pt-2 border-t-[1.8px] border-slate-900">
          <label className="block text-xs font-black text-slate-900">Sao Lưu Dữ Liệu</label>
          <button
            onClick={handleExport}
            className="w-full py-1.5 px-3 bg-white border-[1.8px] border-slate-900 text-slate-900 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-[1.8px_1.8px_0px_0px_#18181B] hover:bg-slate-100"
          >
            <Download className="w-3.5 h-3.5" /> Xuất dữ liệu JSON
          </button>
        </div>

        {/* 4. RESET DATA */}
        <div className="pt-2 border-t-[1.8px] border-slate-900">
          <button
            onClick={() => {
              if (window.confirm("Bạn có chắc chắn muốn đặt lại dữ liệu từ vựng mẫu?")) {
                onResetData();
                onClose();
              }
            }}
            className="w-full py-1.5 bg-rose-100 border-[1.8px] border-slate-900 text-slate-900 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-[1.8px_1.8px_0px_0px_#18181B] hover:bg-rose-200"
          >
            <RefreshCcw className="w-3.5 h-3.5" /> Đặt lại từ vựng mẫu
          </button>
        </div>
      </div>
    </div>
  );
}
