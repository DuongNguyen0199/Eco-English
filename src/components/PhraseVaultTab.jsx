import React, { useState, useEffect } from 'react';
import { CEFR_LEVELS, autoClassifyCEFR, autoGeneratePhonetic } from '../data/cefrData';
import { speechService } from '../services/speechService';
import { aiService } from '../services/aiService';
import { Plus, Search, Volume2, Trash2, Tag, BookMarked, Layers, Shuffle, Sparkles, Target, Pencil, X, Check, Wand2, AlertCircle } from 'lucide-react';

export default function PhraseVaultTab({ phrases, onAddPhrase, onDeletePhrase, onEditPhrase, onUpdateMastery }) {
  const [activeSubTab, setActiveSubTab] = useState('flashcard'); // Default: SRS Flashcard Mode
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('ALL');

  // Flashcard State
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledPhrases, setShuffledPhrases] = useState([]);
  const [flashcardReviewMode, setFlashcardReviewMode] = useState('unmastered'); // 'unmastered' (Chưa nhớ) | 'mastered' (Đã nhớ kỹ) | 'all' (Ôn lại toàn bộ)

  // Edit Phrase Modal State
  const [editingPhrase, setEditingPhrase] = useState(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [duplicateError, setDuplicateError] = useState('');
  const [editDuplicateError, setEditDuplicateError] = useState('');

  const handleAutoGenerateExample = async (targetPhrase, targetMeaning, targetContext = '', isEditMode = false) => {
    if (!targetPhrase || !targetPhrase.trim()) return;
    setIsGeneratingAI(true);
    try {
      const { example, translation } = await aiService.generateExampleAndTranslation(targetPhrase, targetMeaning, targetContext);
      if (isEditMode) {
        setEditingPhrase(prev => prev ? ({
          ...prev,
          example: example || prev.example,
          vietnameseTranslation: translation || prev.vietnameseTranslation
        }) : null);
      } else {
        setNewPhrase(prev => ({
          ...prev,
          example: example || prev.example,
          vietnameseTranslation: translation || prev.vietnameseTranslation
        }));
      }
    } catch (err) {
      console.error("AI Example generation error:", err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // New Phrase Form State
  const [newPhrase, setNewPhrase] = useState({
    phrase: '',
    phonetic: '',
    meaning: '',
    context: '',
    level: 'B1',
    type: 'Collocation',
    example: '',
    vietnameseTranslation: '',
    tags: ''
  });

  const [autoLevelDetected, setAutoLevelDetected] = useState('B1');
  const [autoPhoneticDetected, setAutoPhoneticDetected] = useState('');

  const filteredPhrases = phrases.filter(p => {
    const matchesSearch = p.phrase.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.phonetic && p.phonetic.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          p.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.context && p.context.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (p.tags && p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesLevel = filterLevel === 'ALL' || p.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  // Filter unmastered (< 5/5) and mastered (>= 5/5) phrases
  const unmasteredPhrases = filteredPhrases.filter(p => (p.masteryLevel || 0) < 5);
  const masteredPhrases = filteredPhrases.filter(p => (p.masteryLevel || 0) >= 5);

  let targetFlashcardPool = filteredPhrases;
  if (flashcardReviewMode === 'unmastered') {
    targetFlashcardPool = unmasteredPhrases;
  } else if (flashcardReviewMode === 'mastered') {
    targetFlashcardPool = masteredPhrases;
  }

  // Randomize / Shuffle Cards on Load or Filter / Mode Change
  useEffect(() => {
    setShuffledPhrases([...targetFlashcardPool].sort(() => 0.5 - Math.random()));
    setFlashcardIndex(0);
    setIsFlipped(false);
  }, [phrases, filterLevel, searchTerm, flashcardReviewMode]);

  const handleShuffle = () => {
    setShuffledPhrases([...targetFlashcardPool].sort(() => 0.5 - Math.random()));
    setFlashcardIndex(0);
    setIsFlipped(false);
  };

  const handlePhraseTextChange = (e) => {
    const text = e.target.value;
    const suggestedLevel = autoClassifyCEFR(text, newPhrase.type);
    const suggestedPhonetic = autoGeneratePhonetic(text, phrases);

    setAutoLevelDetected(suggestedLevel);
    setAutoPhoneticDetected(suggestedPhonetic);

    const cleanText = text.trim().toLowerCase();
    if (cleanText && phrases.some(p => p.phrase && p.phrase.trim().toLowerCase() === cleanText)) {
      setDuplicateError(`Cụm từ "${text.trim()}" đã tồn tại trong thư viện!`);
    } else {
      setDuplicateError('');
    }

    setNewPhrase(prev => ({
      ...prev,
      phrase: text,
      phonetic: suggestedPhonetic,
      level: suggestedLevel
    }));
  };

  const handlePhraseTypeChange = (e) => {
    const typeVal = e.target.value;
    const suggested = autoClassifyCEFR(newPhrase.phrase, typeVal);
    setAutoLevelDetected(suggested);
    setNewPhrase(prev => ({
      ...prev,
      type: typeVal,
      level: suggested
    }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newPhrase.phrase.trim() || !newPhrase.meaning.trim()) return;

    const cleanText = newPhrase.phrase.trim().toLowerCase();
    if (phrases.some(p => p.phrase && p.phrase.trim().toLowerCase() === cleanText)) {
      setDuplicateError(`Cụm từ "${newPhrase.phrase.trim()}" đã tồn tại trong thư viện!`);
      return;
    }

    onAddPhrase({
      ...newPhrase,
      tags: newPhrase.tags ? newPhrase.tags.split(',').map(t => t.trim()) : ['Custom']
    });

    setNewPhrase({
      phrase: '',
      phonetic: '',
      meaning: '',
      context: '',
      level: 'B1',
      type: 'Collocation',
      example: '',
      vietnameseTranslation: '',
      tags: ''
    });
    setDuplicateError('');
    setActiveSubTab('flashcard');
  };

  const handleOpenEdit = (item) => {
    setEditDuplicateError('');
    setEditingPhrase({
      id: item.id,
      phrase: item.phrase || '',
      phonetic: item.phonetic || '',
      meaning: item.meaning || '',
      context: item.context || '',
      level: item.level || 'B1',
      type: item.type || 'Collocation',
      example: item.example || '',
      vietnameseTranslation: item.vietnameseTranslation || '',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || '')
    });
  };

  const handleEditPhraseTextChange = (text) => {
    const cleanText = text.trim().toLowerCase();
    if (cleanText && editingPhrase && phrases.some(p => p.id !== editingPhrase.id && p.phrase && p.phrase.trim().toLowerCase() === cleanText)) {
      setEditDuplicateError(`Cụm từ "${text.trim()}" đã trùng với một cụm từ khác trong thư viện!`);
    } else {
      setEditDuplicateError('');
    }
    setEditingPhrase(prev => prev ? { ...prev, phrase: text } : null);
  };

  const handleSaveEditSubmit = (e) => {
    e.preventDefault();
    if (!editingPhrase || !editingPhrase.phrase.trim() || !editingPhrase.meaning.trim()) return;

    const cleanText = editingPhrase.phrase.trim().toLowerCase();
    if (phrases.some(p => p.id !== editingPhrase.id && p.phrase && p.phrase.trim().toLowerCase() === cleanText)) {
      setEditDuplicateError(`Cụm từ "${editingPhrase.phrase.trim()}" đã trùng với một cụm từ khác trong thư viện!`);
      return;
    }

    onEditPhrase && onEditPhrase(editingPhrase.id, {
      ...editingPhrase,
      tags: typeof editingPhrase.tags === 'string'
        ? editingPhrase.tags.split(',').map(t => t.trim()).filter(Boolean)
        : editingPhrase.tags
    });

    setEditingPhrase(null);
    setEditDuplicateError('');
  };

  const currentCards = shuffledPhrases.length > 0 ? shuffledPhrases : targetFlashcardPool;
  const currentFlashcard = currentCards.length > 0 ? currentCards[flashcardIndex % currentCards.length] : null;

  const handleNextFlashcard = (isCorrect) => {
    if (currentFlashcard) {
      onUpdateMastery(currentFlashcard.id, isCorrect);
    }
    setIsFlipped(false);
    setFlashcardIndex(prev => prev + 1);
  };

  return (
    <div className="w-full space-y-3 pb-4 px-2 relative">
      {/* Cartoon Top Header & Sub-Tab Switcher - Slender 1.8px Border & Clear Selection Color */}
      <div className="flex items-center justify-between bg-white p-2 rounded-xl border-[1.8px] border-slate-900 shadow-[2px_2px_0px_0px_#18181B]">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveSubTab('list')}
            className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 border-[1.8px] border-slate-900 transition-all ${
              activeSubTab === 'list'
                ? 'bg-[#FEF08A] text-slate-900 shadow-[2px_2px_0px_0px_#18181B]'
                : 'bg-white text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_0px_#18181B]'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" /> Thư viện ({phrases.length})
          </button>
          <button
            onClick={() => {
              setActiveSubTab('flashcard');
              setIsFlipped(false);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 border-[1.8px] border-slate-900 transition-all ${
              activeSubTab === 'flashcard'
                ? 'bg-[#FEF08A] text-slate-900 shadow-[2px_2px_0px_0px_#18181B]'
                : 'bg-white text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_0px_#18181B]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Lật Thẻ SRS
          </button>
        </div>

        <button
          onClick={() => setActiveSubTab(activeSubTab === 'add' ? 'list' : 'add')}
          className="px-2.5 py-1 bg-emerald-300 border-[1.8px] border-slate-900 text-slate-900 rounded-lg text-xs font-black flex items-center gap-1 shadow-[2px_2px_0px_0px_#18181B] hover:bg-emerald-400 transition-all"
        >
          <Plus className="w-4 h-4" /> Thêm Cụm Từ
        </button>
      </div>

      {/* SUB-TAB 1: ADD PHRASE FORM */}
      {activeSubTab === 'add' && (
        <form onSubmit={handleAddSubmit} className="bg-white p-3.5 rounded-xl border-[1.8px] border-slate-900 shadow-[2.5px_2.5px_0px_0px_#18181B] space-y-2.5">
          <h3 className="text-xs font-black text-slate-900 uppercase flex items-center gap-1">
            <Plus className="w-4 h-4 text-emerald-600" /> Thêm Cụm từ Hay mới
          </h3>

          <div>
            <label className="block text-[11px] font-black text-slate-900 mb-0.5">Cụm từ tiếng Anh (*)</label>
            <input
              type="text"
              required
              placeholder="e.g. come up with, double-edged sword"
              value={newPhrase.phrase}
              onChange={handlePhraseTextChange}
              className={`w-full px-2.5 py-1.5 text-xs rounded-lg border-[1.5px] font-bold focus:outline-none focus:bg-[#FFFDF0] ${
                duplicateError ? 'border-rose-500 bg-rose-50' : 'border-slate-900'
              }`}
            />
            {duplicateError && (
              <div className="flex items-center gap-1.5 p-2 bg-rose-100 border border-rose-500 text-rose-900 text-[11px] font-extrabold rounded-lg mt-1 shadow-[1px_1px_0px_0px_#18181B]">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{duplicateError}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-900 mb-0.5 flex items-center justify-between">
              <span>🗣️ Phát âm tiếng Việt / Bồi (Phonetic)</span>
              {newPhrase.phrase && (
                <button
                  type="button"
                  onClick={() => setNewPhrase({ ...newPhrase, phonetic: autoGeneratePhonetic(newPhrase.phrase, phrases) })}
                  className="text-[9px] font-extrabold text-amber-900 bg-amber-100 border border-amber-400 px-1.5 py-0.2 rounded flex items-center gap-0.5 hover:bg-amber-200"
                  title="Tự động sinh phát âm bồi cho câu này"
                >
                  <Wand2 className="w-2.5 h-2.5 text-amber-700" /> Tự động Gen
                </button>
              )}
            </label>
            <input
              type="text"
              placeholder="e.g. Ai-m ha-ving Se-kần-thót-s, Kâm ấp wít"
              value={newPhrase.phonetic}
              onChange={e => setNewPhrase({ ...newPhrase, phonetic: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border-[1.5px] border-slate-900 font-bold focus:outline-none focus:bg-[#FFFDF0]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-900 mb-0.5">Bối cảnh sử dụng cụm từ (Context)</label>
            <input
              type="text"
              placeholder="e.g. Dùng khi bắt đầu do dự điều mình định làm..."
              value={newPhrase.context}
              onChange={e => setNewPhrase({ ...newPhrase, context: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border-[1.5px] border-slate-900 font-bold focus:outline-none focus:bg-[#FFFDF0]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-black text-slate-900 mb-0.5 flex items-center justify-between">
                <span>Trình độ CEFR</span>
                {newPhrase.phrase && (
                  <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-100 border border-emerald-400 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5 text-emerald-600 fill-emerald-600" /> Auto: {autoLevelDetected}
                  </span>
                )}
              </label>
              <select
                value={newPhrase.level}
                onChange={e => setNewPhrase({ ...newPhrase, level: e.target.value })}
                className="w-full px-2 py-1.5 text-xs rounded-lg border-[1.5px] border-slate-900 font-bold focus:outline-none focus:bg-[#FFFDF0]"
              >
                {CEFR_LEVELS.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-900 mb-0.5">Loại cụm từ</label>
              <select
                value={newPhrase.type}
                onChange={handlePhraseTypeChange}
                className="w-full px-2 py-1.5 text-xs rounded-lg border-[1.5px] border-slate-900 font-bold focus:outline-none focus:bg-[#FFFDF0]"
              >
                <option value="Collocation">🔗 Collocation (Cụm từ ghép cố định)</option>
                <option value="Phrasal Verb">🏃 Phrasal Verb (Cụm động từ + giới từ)</option>
                <option value="Idiom">💡 Idiom (Thành ngữ / Khẩu ngữ)</option>
                <option value="Academic Phrase">🎓 Academic Phrase (Cụm từ học thuật / IELTS)</option>
                <option value="Prepositional Phrase">📜 Prepositional Phrase (Cụm giới từ)</option>
              </select>
            </div>
          </div>

          {/* Quick Guide Box for Phrase Types */}
          <div className="bg-[#FFFDF0] p-2 rounded-lg border border-slate-900 text-[10px] space-y-1 font-semibold text-slate-800">
            <p className="font-extrabold text-slate-900 text-[10.5px] flex items-center gap-1 border-b border-slate-300 pb-0.5">
              <span>💡 Cách phân biệt "Loại cụm từ":</span>
            </p>
            <div className="space-y-0.5 text-[9.5px] leading-tight">
              <p>• <strong>🔗 Collocation:</strong> Các từ hay đi cặp với nhau (VD: <em>make a decision</em>, <em>take into account</em>).</p>
              <p>• <strong>🏃 Phrasal Verb:</strong> Động từ đi kèm giới từ (VD: <em>come up with</em>, <em>look forward to</em>, <em>run out of</em>).</p>
              <p>• <strong>💡 Idiom:</strong> Thành ngữ / Khẩu ngữ giao tiếp (VD: <em>having second thoughts</em>, <em>a double-edged sword</em>).</p>
              <p>• <strong>🎓 Academic Phrase:</strong> Cụm từ học thuật bài viết/thuyết trình (VD: <em>shed light on</em>, <em>stem from</em>).</p>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-900 mb-0.5">Giải nghĩa tiếng Việt (*)</label>
            <input
              type="text"
              required
              placeholder="e.g. Nảy ra ý tưởng, con dao hai lưỡi"
              value={newPhrase.meaning}
              onChange={e => setNewPhrase({ ...newPhrase, meaning: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border-[1.5px] border-slate-900 font-bold focus:outline-none focus:bg-[#FFFDF0]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-900 mb-0.5 flex items-center justify-between">
              <span>Ví dụ minh họa (Tiếng Anh)</span>
              {newPhrase.phrase && (
                <button
                  type="button"
                  onClick={() => handleAutoGenerateExample(newPhrase.phrase, newPhrase.meaning, newPhrase.context, false)}
                  disabled={isGeneratingAI}
                  className="text-[9px] font-extrabold text-indigo-950 bg-indigo-100 border border-indigo-400 px-1.5 py-0.2 rounded flex items-center gap-1 hover:bg-indigo-200 transition-all disabled:opacity-60"
                  title="Nhờ AI tự động tạo 1 câu ví dụ tiếng Anh đơn giản và dịch tiếng Việt"
                >
                  <Sparkles className={`w-2.5 h-2.5 text-indigo-700 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                  {isGeneratingAI ? 'Đang gen AI...' : '🪄 AI Gen Ví Dụ & Dịch'}
                </button>
              )}
            </label>
            <textarea
              rows={2}
              placeholder="e.g. She came up with a great solution."
              value={newPhrase.example}
              onChange={e => setNewPhrase({ ...newPhrase, example: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border-[1.5px] border-slate-900 font-bold focus:outline-none focus:bg-[#FFFDF0]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-900 mb-0.5">Dịch câu ví dụ</label>
            <input
              type="text"
              placeholder="Cô ấy đã nghĩ ra một giải pháp tuyệt vời."
              value={newPhrase.vietnameseTranslation}
              onChange={e => setNewPhrase({ ...newPhrase, vietnameseTranslation: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border-[1.5px] border-slate-900 font-bold focus:outline-none focus:bg-[#FFFDF0]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-900 mb-0.5">Thẻ / Tag (phân cách bằng dấu phẩy)</label>
            <input
              type="text"
              placeholder="Work, Writing, IELTS, Daily"
              value={newPhrase.tags}
              onChange={e => setNewPhrase({ ...newPhrase, tags: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border-[1.5px] border-slate-900 font-bold focus:outline-none focus:bg-[#FFFDF0]"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveSubTab('flashcard')}
              className="px-3 py-1 rounded-lg text-xs font-black text-slate-700 bg-slate-100 border-[1.5px] border-slate-900"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-1 bg-[#FEF08A] border-[1.8px] border-slate-900 text-slate-900 rounded-lg text-xs font-black shadow-[1.8px_1.8px_0px_0px_#18181B] hover:bg-amber-300"
            >
              Lưu Cụm Từ
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 2: FLASHCARD SRS CARTOON MEMO CARD */}
      {activeSubTab === 'flashcard' && (
        <div className="space-y-3">
          {/* SRS Mode Switcher Bar (Dropdown selector) */}
          <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-xl border-[1.8px] border-slate-900 shadow-[2px_2px_0px_0px_#18181B]">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="text-[10px] font-black text-slate-800 shrink-0">Lật thẻ:</span>
              <select
                value={flashcardReviewMode}
                onChange={(e) => {
                  setFlashcardReviewMode(e.target.value);
                  setFlashcardIndex(0);
                  setIsFlipped(false);
                }}
                className="bg-[#FEF08A] border-[1.5px] border-slate-900 px-2 py-0.5 rounded-lg text-xs font-black text-slate-900 focus:outline-none shadow-[1.5px_1.5px_0px_0px_#18181B] cursor-pointer truncate"
              >
                <option value="unmastered">🎯 Cụm từ chưa nhớ ({unmasteredPhrases.length})</option>
                <option value="mastered">✅ Cụm từ đã nhớ kỹ ({masteredPhrases.length})</option>
                <option value="all">📚 Ôn lại toàn bộ ({filteredPhrases.length})</option>
              </select>
            </div>

            <button
              onClick={handleShuffle}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border-[1.5px] border-slate-900 text-[10px] font-black shadow-[1.5px_1.5px_0px_0px_#18181B] hover:bg-slate-100 active:translate-y-0.5 shrink-0"
              title="Xáo trộn ngẫu nhiên danh sách thẻ"
            >
              <Shuffle className="w-3 h-3 text-slate-900" />
              Tráo thẻ
            </button>
          </div>

          {currentCards.length === 0 ? (
            <div className="text-center p-6 bg-white rounded-xl border-[1.8px] border-slate-900 shadow-[2px_2px_0px_0px_#18181B] space-y-2.5">
              <p className="text-xs font-extrabold text-slate-800">
                {flashcardReviewMode === 'unmastered' && (
                  <>🎉 Tuyệt vời! Bạn không còn cụm từ nào ở trạng thái chưa nhớ (tất cả đều đã đạt 5/5)!</>
                )}
                {flashcardReviewMode === 'mastered' && (
                  <>📌 Chưa có cụm từ nào đạt mức Đã nhớ kỹ (5/5). Hãy tiếp tục lật thẻ ở mục Chưa nhớ để tích lũy đủ 5 lần!</>
                )}
                {flashcardReviewMode === 'all' && (
                  <>Không tìm thấy cụm từ nào theo bộ lọc.</>
                )}
              </p>
              {flashcardReviewMode === 'unmastered' && masteredPhrases.length > 0 && (
                <button
                  onClick={() => setFlashcardReviewMode('mastered')}
                  className="px-3 py-1.5 bg-[#FEF08A] border-[1.5px] border-slate-900 text-slate-900 text-xs font-black rounded-lg shadow-[1.5px_1.5px_0px_0px_#18181B] hover:bg-amber-300"
                >
                  ✅ Xem các cụm từ đã nhớ kỹ ({masteredPhrases.length} cụm)
                </button>
              )}
              {flashcardReviewMode === 'mastered' && unmasteredPhrases.length > 0 && (
                <button
                  onClick={() => setFlashcardReviewMode('unmastered')}
                  className="px-3 py-1.5 bg-[#FEF08A] border-[1.5px] border-slate-900 text-slate-900 text-xs font-black rounded-lg shadow-[1.5px_1.5px_0px_0px_#18181B] hover:bg-amber-300"
                >
                  🎯 Quay lại Cụm từ chưa nhớ ({unmasteredPhrases.length} cụm)
                </button>
              )}
            </div>
          ) : (
            <div className="bg-[#FFFDF5] rounded-xl p-4 border-[1.8px] border-slate-900 shadow-[2.5px_2.5px_0px_0px_#18181B] text-center space-y-3 relative">
              <div className="flex items-center justify-between text-xs font-black text-slate-900">
                <span className="bg-[#FEF08A] border border-slate-900 px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#18181B]">
                  Thẻ {currentCards.length > 0 ? (flashcardIndex % currentCards.length) + 1 : 0} / {currentCards.length}
                </span>
                <div className="flex items-center gap-1">
                  {(currentFlashcard?.masteryLevel || 0) >= 5 ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-100 border border-emerald-500 text-emerald-800 text-[9.5px] font-black">
                      ✅ Đã thuộc (5/5)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-500 text-amber-900 text-[9.5px] font-black">
                      ⏳ Đang học ({currentFlashcard?.masteryLevel || 0}/5)
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-900 uppercase font-black">
                    {currentFlashcard?.level || 'B1'}
                  </span>
                </div>
              </div>

              {/* Cartoon Flashcard Area */}
              <div 
                onClick={() => setIsFlipped(!isFlipped)} 
                className="cursor-pointer py-6 px-3 rounded-xl bg-white border-[1.5px] border-slate-900 shadow-[2px_2px_0px_0px_#18181B] hover:bg-[#FFFDF0] transition-all space-y-3"
              >
                {!isFlipped ? (
                  <div className="space-y-2">
                    {/* Display Context Badge prominently on Front */}
                    {currentFlashcard.context && (
                      <div className="inline-flex items-center gap-1 bg-[#FEF08A] border border-slate-900 px-2.5 py-0.5 rounded-md shadow-[1px_1px_0px_0px_#18181B] text-[10px] font-black text-slate-900">
                        <Target className="w-3 h-3 text-slate-900" /> Bối cảnh: {currentFlashcard.context}
                      </div>
                    )}
                    <span className="block text-[9px] uppercase font-black text-slate-500 tracking-wider">Mặt Trước (Tiếng Anh)</span>
                    <h3 className="text-lg font-black text-slate-900 flex items-center justify-center gap-1.5">
                      {currentFlashcard.phrase}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speechService.speak(currentFlashcard.phrase);
                        }}
                        className="p-1 text-slate-900 bg-[#FEF08A] border border-slate-900 rounded-lg shadow-[1px_1px_0px_0px_#18181B]"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </h3>

                    {/* Display Phonetic Transliteration on Front */}
                    {currentFlashcard.phonetic && (
                      <div className="inline-block bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-950 shadow-[1px_1px_0px_0px_#18181B]">
                        🗣️ Phát âm: <span className="font-extrabold text-amber-900">{currentFlashcard.phonetic}</span>
                      </div>
                    )}

                    <p className="text-xs font-bold text-slate-600">({currentFlashcard.type})</p>
                    <p className="text-[10px] text-slate-900 font-black mt-2 underline">Chạm để xem đáp án ➔</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Display Context & Phonetic Badges on Back */}
                    <div className="flex flex-wrap items-center justify-center gap-1">
                      {currentFlashcard.context && (
                        <div className="inline-flex items-center gap-1 bg-[#FFFDF0] border border-slate-900 px-2 py-0.5 rounded-md shadow-[1px_1px_0px_0px_#18181B] text-[10px] font-black text-slate-900">
                          📌 Bối cảnh: {currentFlashcard.context}
                        </div>
                      )}
                      {currentFlashcard.phonetic && (
                        <div className="inline-flex items-center gap-1 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md shadow-[1px_1px_0px_0px_#18181B] text-[10px] font-black text-amber-950">
                          🗣️ {currentFlashcard.phonetic}
                        </div>
                      )}
                    </div>
                    <span className="block text-[9px] uppercase font-black text-emerald-700 tracking-wider">Mặt Sau (Nghĩa Tiếng Việt)</span>
                    <h3 className="text-base font-black text-slate-900">
                      {currentFlashcard.meaning}
                    </h3>
                    {currentFlashcard.example && (
                      <p className="text-xs font-bold text-slate-800 italic bg-[#FFFDF0] p-2 rounded-lg border border-slate-900">
                        "{currentFlashcard.example}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action SRS Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleNextFlashcard(false)}
                  className="py-2 bg-rose-200 border-[1.5px] border-slate-900 text-slate-900 font-black text-xs rounded-lg shadow-[1.5px_1.5px_0px_0px_#18181B] hover:bg-rose-300 transition-all"
                >
                  ❌ Cần ôn lại
                </button>
                <button
                  onClick={() => handleNextFlashcard(true)}
                  className="py-2 bg-emerald-200 border-[1.5px] border-slate-900 text-slate-900 font-black text-xs rounded-lg shadow-[1.5px_1.5px_0px_0px_#18181B] hover:bg-emerald-300 transition-all"
                >
                  ✅ Đã nhớ kỹ
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: PHRASE LIST & SEARCH */}
      {activeSubTab === 'list' && (
        <div className="space-y-2.5">
          {/* Search & Filter Inputs */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-700 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Tìm cụm từ, nghĩa, tag..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-xs rounded-lg border-[1.5px] border-slate-900 bg-white font-bold text-slate-900 focus:outline-none focus:bg-[#FFFDF0]"
              />
            </div>

            <select
              value={filterLevel}
              onChange={e => setFilterLevel(e.target.value)}
              className="px-2 py-1.5 text-xs font-black rounded-lg border-[1.5px] border-slate-900 bg-[#FEF08A] focus:outline-none text-slate-900 shadow-[1.5px_1.5px_0px_0px_#18181B]"
            >
              <option value="ALL">Tất cả Level</option>
              <option value="B1">Level B1</option>
              <option value="B2">Level B2</option>
              <option value="C1">Level C1</option>
              <option value="C2">Level C2</option>
            </select>
          </div>

          {/* List of Phrases */}
          <div className="space-y-2">
            {filteredPhrases.length === 0 ? (
              <div className="text-center p-6 bg-white rounded-xl border-[1.8px] border-slate-900 shadow-[2px_2px_0px_0px_#18181B]">
                <p className="text-xs font-bold text-slate-700">Không tìm thấy cụm từ nào phù hợp.</p>
              </div>
            ) : (
              filteredPhrases.map((item) => (
                <div key={item.id} className="bg-white p-3 rounded-xl border-[1.8px] border-slate-900 shadow-[2px_2px_0px_0px_#18181B] space-y-1.5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#FEF08A] border border-slate-900 text-slate-900">
                        {item.level}
                      </span>
                      <h4 className="text-xs font-black text-slate-900 flex items-center gap-1 flex-wrap">
                        <span>{item.phrase}</span>
                        {item.phonetic && (
                          <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-300">
                            🗣️ {item.phonetic}
                          </span>
                        )}
                        <button
                          onClick={() => speechService.speak(item.phrase)}
                          className="p-0.5 text-slate-900 bg-slate-100 border border-slate-900 rounded hover:bg-slate-200"
                          title="Nghe phát âm"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      </h4>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1 text-slate-900 bg-amber-100 border border-slate-900 rounded hover:bg-amber-200 transition-colors shadow-[1px_1px_0px_0px_#18181B]"
                        title="Chỉnh sửa cụm từ này"
                      >
                        <Pencil className="w-3.5 h-3.5 text-slate-900" />
                      </button>
                      <button
                        onClick={() => onDeletePhrase(item.id)}
                        className="p-1 text-slate-900 bg-rose-100 border border-slate-900 rounded hover:bg-rose-200 transition-colors shadow-[1px_1px_0px_0px_#18181B]"
                        title="Xóa cụm từ này"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-slate-900" />
                      </button>
                    </div>
                  </div>

                  {/* Render Usage Context Badge in Phrase Library */}
                  {item.context && (
                    <div className="inline-flex items-center gap-1 bg-[#FEF08A] border border-slate-900 px-2 py-0.5 rounded-md shadow-[1px_1px_0px_0px_#18181B] text-[10px] font-black text-slate-900">
                      <Target className="w-3 h-3 text-slate-900" /> Bối cảnh: {item.context}
                    </div>
                  )}

                  <p className="text-xs font-extrabold text-slate-900">
                    💡 {item.meaning}
                  </p>

                  {item.example && (
                    <p className="text-[11px] font-semibold text-slate-800 italic bg-[#FFFDF0] p-1.5 rounded border border-slate-900">
                      "{item.example}"
                    </p>
                  )}

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {item.tags.map((t, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 text-[9px] font-black text-slate-900 bg-slate-100 border border-slate-900 px-1.5 py-0.2 rounded-md">
                          <Tag className="w-2.5 h-2.5" /> {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* EDIT PHRASE MODAL */}
      {editingPhrase && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-3">
          <div className="bg-[#FFFDF5] rounded-2xl max-w-xs w-full p-4 border-[1.8px] border-slate-900 shadow-[3.5px_3.5px_0px_0px_#18181B] space-y-3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-[1.8px] border-slate-900 pb-2">
              <h3 className="text-xs font-black text-slate-900 uppercase flex items-center gap-1.5">
                <Pencil className="w-4 h-4 text-slate-900" /> Chỉnh Sửa Cụm Từ
              </h3>
              <button
                onClick={() => setEditingPhrase(null)}
                className="p-1 bg-white border border-slate-900 rounded-lg shadow-[1px_1px_0px_0px_#18181B] text-slate-900 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSubmit} className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-black text-slate-900 mb-0.5">Cụm từ tiếng Anh (*)</label>
                <input
                  type="text"
                  required
                  value={editingPhrase.phrase}
                  onChange={e => handleEditPhraseTextChange(e.target.value)}
                  className={`w-full px-2.5 py-1.5 text-xs rounded-lg border-[1.5px] font-bold focus:outline-none focus:bg-[#FFFDF0] ${
                    editDuplicateError ? 'border-rose-500 bg-rose-50' : 'border-slate-900'
                  }`}
                />
                {editDuplicateError && (
                  <div className="flex items-center gap-1.5 p-2 bg-rose-100 border border-rose-500 text-rose-900 text-[11px] font-extrabold rounded-lg mt-1 shadow-[1px_1px_0px_0px_#18181B]">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{editDuplicateError}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-900 mb-0.5 flex items-center justify-between">
                  <span>🗣️ Phát âm tiếng Việt / Bồi (Phonetic)</span>
                  {editingPhrase.phrase && (
                    <button
                      type="button"
                      onClick={() => setEditingPhrase({ ...editingPhrase, phonetic: autoGeneratePhonetic(editingPhrase.phrase, phrases) })}
                      className="text-[9px] font-extrabold text-amber-900 bg-amber-100 border border-amber-400 px-1.5 py-0.2 rounded flex items-center gap-0.5 hover:bg-amber-200"
                      title="Tự động sinh phát âm bồi cho câu này"
                    >
                      <Wand2 className="w-2.5 h-2.5 text-amber-700" /> Tự động Gen
                    </button>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ai-m ha-ving Se-kần-thót-s"
                  value={editingPhrase.phonetic || ''}
                  onChange={e => setEditingPhrase({ ...editingPhrase, phonetic: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border-[1.5px] border-slate-900 font-bold focus:outline-none focus:bg-[#FFFDF0]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-900 mb-0.5">Bối cảnh sử dụng (Context)</label>
                <input
                  type="text"
                  placeholder="e.g. Dùng khi bắt đầu do dự điều mình định làm..."
                  value={editingPhrase.context}
                  onChange={e => setEditingPhrase({ ...editingPhrase, context: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border-[1.5px] border-slate-900 font-bold focus:outline-none focus:bg-[#FFFDF0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-black text-slate-900 mb-0.5">Trình độ CEFR</label>
                  <select
                    value={editingPhrase.level}
                    onChange={e => setEditingPhrase({ ...editingPhrase, level: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border-[1.5px] border-slate-900 font-bold focus:outline-none focus:bg-[#FFFDF0]"
                  >
                    {CEFR_LEVELS.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-900 mb-0.5">Loại cụm từ</label>
                  <select
                    value={editingPhrase.type}
                    onChange={e => setEditingPhrase({ ...editingPhrase, type: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border-[1.5px] border-slate-900 font-bold focus:outline-none focus:bg-[#FFFDF0]"
                  >
                    <option value="Collocation">🔗 Collocation (Cụm từ ghép cố định)</option>
                    <option value="Phrasal Verb">🏃 Phrasal Verb (Cụm động từ + giới từ)</option>
                    <option value="Idiom">💡 Idiom (Thành ngữ / Khẩu ngữ)</option>
                    <option value="Academic Phrase">🎓 Academic Phrase (Cụm từ học thuật / IELTS)</option>
                    <option value="Prepositional Phrase">📜 Prepositional Phrase (Cụm giới từ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-900 mb-0.5">Giải nghĩa tiếng Việt (*)</label>
                <input
                  type="text"
                  required
                  value={editingPhrase.meaning}
                  onChange={e => setEditingPhrase({ ...editingPhrase, meaning: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border-[1.5px] border-slate-900 font-bold focus:outline-none focus:bg-[#FFFDF0]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-900 mb-0.5 flex items-center justify-between">
                  <span>Ví dụ minh họa (Tiếng Anh)</span>
                  {editingPhrase.phrase && (
                    <button
                      type="button"
                      onClick={() => handleAutoGenerateExample(editingPhrase.phrase, editingPhrase.meaning, editingPhrase.context, true)}
                      disabled={isGeneratingAI}
                      className="text-[9px] font-extrabold text-indigo-950 bg-indigo-100 border border-indigo-400 px-1.5 py-0.2 rounded flex items-center gap-1 hover:bg-indigo-200 transition-all disabled:opacity-60"
                      title="Nhờ AI tự động tạo 1 câu ví dụ tiếng Anh đơn giản và dịch tiếng Việt"
                    >
                      <Sparkles className={`w-2.5 h-2.5 text-indigo-700 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                      {isGeneratingAI ? 'Đang gen AI...' : '🪄 AI Gen Ví Dụ & Dịch'}
                    </button>
                  )}
                </label>
                <textarea
                  rows={2}
                  value={editingPhrase.example}
                  onChange={e => setEditingPhrase({ ...editingPhrase, example: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border-[1.5px] border-slate-900 font-bold focus:outline-none focus:bg-[#FFFDF0]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-900 mb-0.5">Dịch câu ví dụ</label>
                <input
                  type="text"
                  value={editingPhrase.vietnameseTranslation}
                  onChange={e => setEditingPhrase({ ...editingPhrase, vietnameseTranslation: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border-[1.5px] border-slate-900 font-bold focus:outline-none focus:bg-[#FFFDF0]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-900 mb-0.5">Thẻ / Tag (phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={editingPhrase.tags}
                  onChange={e => setEditingPhrase({ ...editingPhrase, tags: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border-[1.5px] border-slate-900 font-bold focus:outline-none focus:bg-[#FFFDF0]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t-[1.5px] border-slate-900">
                <button
                  type="button"
                  onClick={() => setEditingPhrase(null)}
                  className="px-3 py-1 rounded-lg text-xs font-black text-slate-700 bg-slate-100 border-[1.5px] border-slate-900"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-[#FEF08A] border-[1.8px] border-slate-900 text-slate-900 rounded-lg text-xs font-black shadow-[1.8px_1.8px_0px_0px_#18181B] hover:bg-amber-300 flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5 text-slate-900" /> Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
