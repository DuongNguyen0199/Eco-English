import React, { useState, useEffect } from 'react';
import { X, Key, Database, CheckCircle2, AlertCircle, ExternalLink, Sparkles, RefreshCw, Mic, Music, Volume2, Upload } from 'lucide-react';
import { getSavedNotionConfig, saveNotionConfig, testNotionConnection } from '../services/notionService';
import { speechService } from '../services/speechService';

export default function NotionSettingsModal({ isOpen, onClose, onSaveSuccess }) {
  const [activeTab, setActiveTab] = useState('notion'); // 'notion' | 'voice'

  // Notion state
  const [apiKey, setApiKey] = useState('');
  const [databaseId, setDatabaseId] = useState('');
  const [useMock, setUseMock] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Voice state
  const [speechMode, setSpeechMode] = useState('browser'); // 'browser' | 'mp3' | 'elevenlabs'
  const [elevenLabsKey, setElevenLabsKey] = useState('');
  const [voiceId, setVoiceId] = useState('');
  const [customMp3Url, setCustomMp3Url] = useState('');
  const [mp3FileName, setMp3FileName] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Load Notion config
      const notionConfig = getSavedNotionConfig();
      setApiKey(notionConfig.apiKey);
      setDatabaseId(notionConfig.databaseId);
      setUseMock(notionConfig.useMock);
      setTestResult(null);

      // Load Speech config
      const speechConfig = speechService.getSpeechConfig();
      setSpeechMode(speechConfig.mode);
      setElevenLabsKey(speechConfig.elevenLabsKey);
      setVoiceId(speechConfig.voiceId);
      setCustomMp3Url(speechConfig.customMp3Url);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestNotion = async () => {
    if (!apiKey || !databaseId) {
      setTestResult({ success: false, error: 'Vui lòng nhập đầy đủ Token và Database ID!' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const res = await testNotionConnection(apiKey, databaseId);
    setIsTesting(false);
    setTestResult(res);
  };

  const handleMp3FileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMp3FileName(file.name);
      const url = URL.createObjectURL(file);
      setCustomMp3Url(url);
    }
  };

  const handleTestVoice = () => {
    speechService.saveSpeechConfig(speechMode, elevenLabsKey, voiceId, customMp3Url);
    speechService.speak(
      "Thưa chủ nhân, đây là giọng nói thử nghiệm của trợ lý Emmi!",
      null,
      null,
      (err) => alert('Lỗi phát giọng nói: ' + err)
    );
  };

  const handleSaveAll = () => {
    saveNotionConfig(apiKey, databaseId, useMock);
    speechService.saveSpeechConfig(speechMode, elevenLabsKey, voiceId, customMp3Url);
    if (onSaveSuccess) onSaveSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
      {/* Modal sheet iOS container */}
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-t-[32px] sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Top Header & Close button */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">Cài Đặt Trợ Lý Emmi</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Segmented Control Tabs iOS */}
        <div className="flex rounded-xl bg-neutral-950 p-1 border border-neutral-800">
          <button
            onClick={() => setActiveTab('notion')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'notion' ? 'bg-purple-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Notion API</span>
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'voice' ? 'bg-purple-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Giọng Nói & Voice Clone</span>
          </button>
        </div>

        {/* TAB 1: NOTION SETTINGS */}
        {activeTab === 'notion' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {/* Toggle Mode Option */}
            <div className="ios-glass-card rounded-2xl p-3.5 flex items-center justify-between border border-neutral-800">
              <div>
                <h4 className="text-xs font-bold text-neutral-200">Sử dụng Dữ liệu Mẫu (Mock)</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">Chạy ngay không cần điền Notion Token</p>
              </div>
              <button
                onClick={() => setUseMock(!useMock)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  useMock ? 'bg-purple-600' : 'bg-neutral-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    useMock ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Notion API Key */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                Notion Integration Token (API Key)
              </label>
              <input
                type="password"
                placeholder="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={useMock}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/90 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
              />
            </div>

            {/* Database ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-400" />
                Notion Database ID
              </label>
              <input
                type="text"
                placeholder="Database ID (32 ký tự hex)"
                value={databaseId}
                onChange={(e) => setDatabaseId(e.target.value)}
                disabled={useMock}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/90 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
              />
            </div>

            {/* Test Result */}
            {testResult && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  testResult.success
                    ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                    : 'bg-red-950/80 border border-red-800 text-red-300'
                }`}
              >
                {testResult.success ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Thành công! Kết nối: <strong>{testResult.dbName}</strong></span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Lỗi: {testResult.error}</span>
                  </>
                )}
              </div>
            )}

            {!useMock && (
              <button
                onClick={handleTestNotion}
                disabled={isTesting}
                className="w-full py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-neutral-700"
              >
                {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <span>Kiểm tra kết nối Notion</span>}
              </button>
            )}
          </div>
        )}

        {/* TAB 2: VOICE & VOICE CLONING SETTINGS */}
        {activeTab === 'voice' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {/* Mode selection radio cards */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-300">Lựa chọn Nguồn Giọng Nói:</label>

              {/* Mode 1: Browser Female Voice */}
              <label className={`ios-glass-card p-3 rounded-2xl flex items-start gap-3 border cursor-pointer transition-all ${
                speechMode === 'browser' ? 'border-purple-500 bg-purple-950/20' : 'border-neutral-800'
              }`}>
                <input
                  type="radio"
                  name="speechMode"
                  checked={speechMode === 'browser'}
                  onChange={() => setSpeechMode('browser')}
                  className="mt-0.5 text-purple-600 focus:ring-0"
                />
                <div>
                  <h5 className="text-xs font-bold text-white flex items-center gap-1">
                    <Mic className="w-3.5 h-3.5 text-indigo-400" />
                    Giọng Nữ Tiếng Việt Mặc Định
                  </h5>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Sử dụng giọng nữ đọc Tiếng Việt tự nhiên sẵn có của hệ thống (Hoài My / Google Tiếng Việt).
                  </p>
                </div>
              </label>

              {/* Mode 2: Import Custom MP3 file */}
              <label className={`ios-glass-card p-3 rounded-2xl flex items-start gap-3 border cursor-pointer transition-all ${
                speechMode === 'mp3' ? 'border-purple-500 bg-purple-950/20' : 'border-neutral-800'
              }`}>
                <input
                  type="radio"
                  name="speechMode"
                  checked={speechMode === 'mp3'}
                  onChange={() => setSpeechMode('mp3')}
                  className="mt-0.5 text-purple-600 focus:ring-0"
                />
                <div className="flex-1">
                  <h5 className="text-xs font-bold text-white flex items-center gap-1">
                    <Music className="w-3.5 h-3.5 text-emerald-400" />
                    Import File Giọng Nói MP3 Mẫu
                  </h5>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Phát đoạn âm thanh MP3 giọng nữ mẫu của bạn khi Emmi phản hồi.
                  </p>

                  {speechMode === 'mp3' && (
                    <div className="mt-2.5 space-y-2">
                      <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold cursor-pointer transition-colors shadow-md">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Tải lên file MP3 giọng nữ</span>
                        <input type="file" accept="audio/mp3,audio/wav" onChange={handleMp3FileUpload} className="hidden" />
                      </label>
                      {mp3FileName && <span className="text-[11px] text-emerald-400 block truncate">📁 {mp3FileName}</span>}
                    </div>
                  )}
                </div>
              </label>

              {/* Mode 3: ElevenLabs Voice Cloning AI */}
              <label className={`ios-glass-card p-3 rounded-2xl flex items-start gap-3 border cursor-pointer transition-all ${
                speechMode === 'elevenlabs' ? 'border-purple-500 bg-purple-950/20' : 'border-neutral-800'
              }`}>
                <input
                  type="radio"
                  name="speechMode"
                  checked={speechMode === 'elevenlabs'}
                  onChange={() => setSpeechMode('elevenlabs')}
                  className="mt-0.5 text-purple-600 focus:ring-0"
                />
                <div className="flex-1">
                  <h5 className="text-xs font-bold text-white flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Clone Giọng Bằng ElevenLabs AI API
                  </h5>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Nhân bản chuẩn 100% giọng con gái từ file MP3 mẫu và đọc linh hoạt mọi câu task Notion.
                  </p>

                  {speechMode === 'elevenlabs' && (
                    <div className="mt-2.5 space-y-2">
                      <input
                        type="password"
                        placeholder="ElevenLabs API Key (xi-api-key)"
                        value={elevenLabsKey}
                        onChange={(e) => setElevenLabsKey(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                      />
                      <input
                        type="text"
                        placeholder="Voice ID đã clone từ MP3 (ví dụ: 21m00Tcm4TlvDq8ikWAM)"
                        value={voiceId}
                        onChange={(e) => setVoiceId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  )}
                </div>
              </label>
            </div>

            {/* Test Audio Button */}
            <button
              onClick={handleTestVoice}
              className="w-full py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-purple-300 border border-purple-800/50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Volume2 className="w-4 h-4 text-purple-400" />
              <span>Nghe thử giọng nói đã chọn</span>
            </button>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSaveAll}
            className="flex-1 py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-purple-900/40"
          >
            Lưu cài đặt
          </button>
        </div>
      </div>
    </div>
  );
}
