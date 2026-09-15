import React, { useState, useEffect } from 'react';
import { speechService } from '../services/speechService';
import { RefreshCw, CheckCircle2, XCircle, Volume2, Trophy, Zap, Clock } from 'lucide-react';

export default function RandomExerciseTab({ phrases, onUpdateMastery, xp = 0, onAddXP }) {
  const [exerciseType, setExerciseType] = useState('cloze'); // 'cloze' | 'meaning' | 'unscramble' | 'tense'
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userUnscramble, setUserUnscramble] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // High-frequency Real Communication Tenses Dataset (Beyond Simple Tenses)
  const TENSE_DATASET = [
    {
      context: 'Báo cáo công việc vừa mới hoàn thành xong cách đây ít phút',
      sentence: 'I ______ (just / complete) the sales presentation for our client.',
      phrase: 'just complete',
      level: 'B1',
      options: [
        'complete',
        'completed',
        'have just completed',
        'will complete'
      ],
      correctIndex: 2,
      tenseName: 'Hiện tại Hoàn thành (Present Perfect: have/has + V3)',
      explanation: 'Dùng "have just completed" khi vừa mới làm xong một việc và muốn báo cáo ngay kết quả. Đây là thì dùng nhiều bậc nhất trong giao tiếp công việc!'
    },
    {
      context: 'Nói về một thói quen/hành động kéo dài liên tục từ quá khứ đến tận bây giờ',
      sentence: 'She ______ (work) on this software project since 8 AM.',
      phrase: 'work',
      level: 'B2',
      options: [
        'works',
        'worked',
        'has been working',
        'is working'
      ],
      correctIndex: 2,
      tenseName: 'Hiện tại Hoàn thành Tiếp diễn (has/have been + V-ing)',
      explanation: 'Dùng "has been working" khi có từ "since" (từ lúc) để nhấn mạnh quá trình làm việc liên tục từ sáng đến nay vẫn chưa dừng lại.'
    },
    {
      context: 'Mô tả một hành động đang diễn ra trong quá khứ thì có sự cố bất ngờ chen ngang',
      sentence: 'I ______ (write) the project email when the power suddenly went out.',
      phrase: 'write',
      level: 'B2',
      options: [
        'write',
        'wrote',
        'was writing',
        'have written'
      ],
      correctIndex: 2,
      tenseName: 'Quá khứ Tiếp diễn (Past Continuous: was/were + V-ing)',
      explanation: 'Hành động đang làm dở trong quá khứ dùng "was writing", hành động xen vào bất ngờ chia Quá khứ đơn ("went out").'
    },
    {
      context: 'Thông báo một kế hoạch đã lên lịch chắc chắn sẽ diễn ra trong tương lai gần',
      sentence: 'We ______ (meet) the new investors at 3 PM this afternoon.',
      phrase: 'meet',
      level: 'B1',
      options: [
        'meet',
        'met',
        'are meeting',
        'will meet'
      ],
      correctIndex: 2,
      tenseName: 'Hiện tại Tiếp diễn chỉ Tương lai gần (am/is/are + V-ing)',
      explanation: 'Người bản xứ ưu tiên dùng "are meeting" cho kế hoạch đã chốt lịch hẹn cụ thể thay vì chỉ dùng "will meet" đơn thuần.'
    },
    {
      context: 'Dự đoán kết quả hoàn thành vào một thời điểm cụ thể trong tương lai',
      sentence: 'By next December, I ______ (master) C1 English collocations.',
      phrase: 'master',
      level: 'C1',
      options: [
        'master',
        'mastered',
        'will have mastered',
        'will master'
      ],
      correctIndex: 2,
      tenseName: 'Tương lai Hoàn thành (Future Perfect: will have + V3)',
      explanation: 'Khi có cụm "By + mốc tương lai" (Trước thời điểm...), người bản xứ dùng "will have mastered" để nhấn mạnh việc đã gặt hái xong mục tiêu.'
    }
  ];

  // Comprehensive Verb Conjugation Dictionary for Flex Matching
  const VERB_FORMS = {
    pave: ['pave', 'paved', 'paves', 'paving'],
    come: ['come', 'came', 'comes', 'coming'],
    bear: ['bear', 'bore', 'borne', 'bearing', 'bears'],
    call: ['call', 'called', 'calling', 'calls'],
    have: ['have', 'has', 'had', 'having'],
    make: ['make', 'made', 'makes', 'making'],
    run: ['run', 'ran', 'running', 'runs'],
    look: ['look', 'looked', 'looking', 'looks'],
    take: ['take', 'took', 'taken', 'taking', 'takes'],
    shed: ['shed', 'sheds', 'shedding'],
    strike: ['strike', 'struck', 'striking', 'strikes'],
    stem: ['stem', 'stemmed', 'stemming', 'stems'],
    wreak: ['wreak', 'wreaked', 'wreaking', 'wreaks'],
    cut: ['cut', 'cuts', 'cutting'],
    play: ['play', 'played', 'playing', 'plays'],
    keep: ['keep', 'kept', 'keeping', 'keeps'],
    bring: ['bring', 'brought', 'bringing', 'brings'],
    give: ['give', 'gave', 'given', 'giving', 'gives'],
    get: ['get', 'got', 'gotten', 'getting', 'gets'],
    go: ['go', 'went', 'gone', 'going', 'goes'],
    set: ['set', 'sets', 'setting'],
    put: ['put', 'puts', 'putting'],
    turn: ['turn', 'turned', 'turning', 'turns'],
    break: ['break', 'broke', 'broken', 'breaking', 'breaks'],
    catch: ['catch', 'caught', 'catching', 'catches']
  };

  const escapeRegExp = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Smart mask generator: replaces exact or conjugated verb forms of target phrase with '________'
  const maskPhraseInSentence = (sentence, phraseText) => {
    if (!sentence || !phraseText) return { masked: null, matchedText: phraseText };
    const cleanPhrase = phraseText.trim();
    const safePhrase = escapeRegExp(cleanPhrase);

    // 1. Direct exact case-insensitive match
    const exactRegex = new RegExp(`\\b${safePhrase}\\b`, 'gi');
    if (exactRegex.test(sentence)) {
      return {
        masked: sentence.replace(exactRegex, '________'),
        matchedText: cleanPhrase
      };
    }

    // 2. Conjugated verb flex matching
    const words = cleanPhrase.split(/\s+/);
    const firstWordClean = words[0].toLowerCase().replace(/[^a-z']/g, '');
    const restOfPhrase = words.slice(1).join('\\s+');

    const forms = VERB_FORMS[firstWordClean] || [
      firstWordClean,
      firstWordClean + 'd',
      firstWordClean + 'ed',
      firstWordClean + 's',
      firstWordClean + 'ing'
    ];

    const verbPattern = `(${forms.map(escapeRegExp).join('|')})`;
    const fullPattern = restOfPhrase ? `\\b${verbPattern}\\s+${escapeRegExp(restOfPhrase)}\\b` : `\\b${verbPattern}\\b`;
    const flexRegex = new RegExp(fullPattern, 'gi');

    const match = sentence.match(flexRegex);
    if (match && match.length > 0) {
      return {
        masked: sentence.replace(flexRegex, '________'),
        matchedText: match[0]
      };
    }

    // 3. Fallback: try matching last 2 key words of the phrase if multi-word
    if (words.length > 1) {
      const mainPart = words.slice(-2).join('\\s+');
      const subRegex = new RegExp(`\\b${escapeRegExp(mainPart)}\\b`, 'gi');
      if (subRegex.test(sentence)) {
        return {
          masked: sentence.replace(subRegex, '________'),
          matchedText: phraseText
        };
      }
    }

    return { masked: null, matchedText: phraseText };
  };

  const generateQuestion = (typeToUse = exerciseType) => {
    try {
      setIsAnswered(false);
      setSelectedOption(null);
      setUserUnscramble([]);
      setAvailableWords([]);

      if (typeToUse === 'tense') {
        const item = TENSE_DATASET[Math.floor(Math.random() * TENSE_DATASET.length)];
        setCurrentQuestion({
          target: { phrase: item.phrase, level: item.level, meaning: item.context },
          questionText: item.sentence,
          options: item.options,
          correctAnswer: item.options[item.correctIndex],
          tenseName: item.tenseName,
          explanation: item.explanation
        });
        return;
      }

      if (!phrases || phrases.length === 0) {
        const item = TENSE_DATASET[Math.floor(Math.random() * TENSE_DATASET.length)];
        setCurrentQuestion({
          target: { phrase: item.phrase, level: item.level, meaning: item.context },
          questionText: item.sentence,
          options: item.options,
          correctAnswer: item.options[item.correctIndex],
          tenseName: item.tenseName,
          explanation: item.explanation
        });
        return;
      }

      const target = phrases[Math.floor(Math.random() * phrases.length)];
      if (!target || !target.phrase) return;

      if (typeToUse === 'meaning') {
        const wrongChoices = phrases
          .filter(p => p.id !== target.id)
          .map(p => p.meaning)
          .filter(Boolean)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        
        const options = [target.meaning, ...wrongChoices].sort(() => 0.5 - Math.random());

        setCurrentQuestion({
          target,
          questionText: `Nghĩa chuẩn của cụm từ "${target.phrase}" là gì?`,
          options,
          correctAnswer: target.meaning,
          explanation: `Cụm từ "${target.phrase}" (${target.level || 'B1'}) có nghĩa là: ${target.meaning}`
        });
      } else if (typeToUse === 'cloze') {
        let questionSentence = '';
        let matchedVerbForm = target.phrase;

        // Try smart phrase masking in target example
        let maskedResult = null;
        if (target.example) {
          maskedResult = maskPhraseInSentence(target.example, target.phrase);
        }

        if (maskedResult && maskedResult.masked) {
          questionSentence = maskedResult.masked;
          matchedVerbForm = maskedResult.matchedText || target.phrase;
        } else {
          // Smart contextual fallback for spoken phrases / custom idioms without example
          questionSentence = `Điền cụm từ phù hợp với ngữ cảnh: "${target.context || target.meaning}" ➔ ________`;
        }

        const wrongPhrases = phrases
          .filter(p => p.id !== target.id && p.phrase !== target.phrase)
          .map(p => p.phrase)
          .filter(Boolean)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        const options = [target.phrase, ...wrongPhrases].sort(() => 0.5 - Math.random());

        setCurrentQuestion({
          target,
          questionText: questionSentence,
          options,
          correctAnswer: target.phrase,
          explanation: `Cụm từ đúng cần điền là "${target.phrase}" (${target.meaning}). ${target.example ? `Ví dụ: "${target.example}"` : ''}`
        });
      } else if (typeToUse === 'unscramble') {
        const sentence = target.example || `We must keep in mind that safety comes first.`;
        const words = sentence.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').split(/\s+/).filter(Boolean);
        const shuffled = [...words].sort(() => 0.5 - Math.random());

        setAvailableWords(shuffled);
        setUserUnscramble([]);

        setCurrentQuestion({
          target,
          originalSentence: sentence,
          correctAnswer: words.join(' '),
          explanation: `Câu hoàn chỉnh: "${sentence}"`
        });
      }
    } catch (err) {
      console.error("Error generating question:", err);
      const item = TENSE_DATASET[0];
      setCurrentQuestion({
        target: { phrase: item.phrase, level: item.level, meaning: item.context },
        questionText: item.sentence,
        options: item.options,
        correctAnswer: item.options[item.correctIndex],
        tenseName: item.tenseName,
        explanation: item.explanation
      });
    }
  };

  const handleTypeChange = (newType) => {
    if (newType === exerciseType) return;
    setExerciseType(newType);
    generateQuestion(newType);
  };

  useEffect(() => {
    generateQuestion(exerciseType);
  }, [exerciseType, phrases]);

  const handleSelectOption = (optIndex) => {
    if (isAnswered || !currentQuestion || !currentQuestion.options) return;
    const opt = currentQuestion.options[optIndex];
    setSelectedOption(optIndex);
    setIsAnswered(true);

    const correct = opt === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      onAddXP && onAddXP(10);
      onUpdateMastery && currentQuestion.target && currentQuestion.target.id && onUpdateMastery(currentQuestion.target.id, true);
    } else {
      onUpdateMastery && currentQuestion.target && currentQuestion.target.id && onUpdateMastery(currentQuestion.target.id, false);
    }
  };

  const handleWordClick = (word, index) => {
    if (isAnswered) return;
    const updatedUser = [...userUnscramble, word];
    const updatedAvail = availableWords.filter((_, idx) => idx !== index);

    setUserUnscramble(updatedUser);
    setAvailableWords(updatedAvail);
  };

  const handleRemoveUserWord = (word, index) => {
    if (isAnswered) return;
    const updatedUser = userUnscramble.filter((_, idx) => idx !== index);
    const updatedAvail = [...availableWords, word];

    setUserUnscramble(updatedUser);
    setAvailableWords(updatedAvail);
  };

  const handleCheckUnscramble = () => {
    if (isAnswered || !currentQuestion) return;
    setIsAnswered(true);
    const userSentence = userUnscramble.join(' ');
    const correct = userSentence.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    setIsCorrect(correct);

    if (correct) {
      onAddXP && onAddXP(15);
      onUpdateMastery && currentQuestion.target && currentQuestion.target.id && onUpdateMastery(currentQuestion.target.id, true);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="w-full p-6 text-center bg-white rounded-xl border-[1.8px] border-slate-900 shadow-[2px_2px_0px_0px_#18181B] space-y-2.5 mx-2 my-4">
        <p className="text-xs font-bold text-slate-800">Đang khởi tạo câu hỏi luyện tập...</p>
        <button
          onClick={generateQuestion}
          className="px-3 py-1 bg-[#FEF08A] border-[1.5px] border-slate-900 text-slate-900 text-xs font-black rounded-lg shadow-[1.5px_1.5px_0px_0px_#18181B] hover:bg-amber-300"
        >
          Tải lại câu hỏi
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3 pb-4 px-2">
      {/* Top Banner Cartoon - Slender 1.8px Border */}
      <div className="bg-[#FFFDF0] border-[1.8px] border-slate-900 rounded-xl p-3 shadow-[2.5px_2.5px_0px_0px_#18181B] flex items-center justify-between">
        <div>
          <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-white border border-slate-900 text-slate-900">
            Luyện Tập Ngẫu Nhiên
          </span>
          <h2 className="text-sm font-black text-slate-900 mt-1 flex items-center gap-1">
            <Zap className="w-4 h-4 text-slate-900 fill-slate-900" /> Thử Thách Cụm Từ
          </h2>
        </div>

        <div className="flex items-center space-x-1 bg-white border-[1.5px] border-slate-900 px-2 py-1 rounded-lg text-xs font-black shadow-[1.5px_1.5px_0px_0px_#18181B]">
          <Trophy className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>{xp} XP</span>
        </div>
      </div>

      {/* Mode Tabs (4 Modes including Chia thì) */}
      <div className="grid grid-cols-4 gap-1 bg-white p-1 rounded-xl border-[1.8px] border-slate-900 shadow-[2px_2px_0px_0px_#18181B]">
        <button
          onClick={() => handleTypeChange('cloze')}
          className={`py-1 text-[10px] font-black rounded-lg border-[1.5px] border-slate-900 transition-all ${
            exerciseType === 'cloze' ? 'bg-[#FEF08A] text-slate-900 shadow-[1.5px_1.5px_0px_0px_#18181B]' : 'bg-slate-50 border-transparent text-slate-700'
          }`}
        >
          Điền câu
        </button>
        <button
          onClick={() => handleTypeChange('meaning')}
          className={`py-1 text-[10px] font-black rounded-lg border-[1.5px] border-slate-900 transition-all ${
            exerciseType === 'meaning' ? 'bg-[#FEF08A] text-slate-900 shadow-[1.5px_1.5px_0px_0px_#18181B]' : 'bg-slate-50 border-transparent text-slate-700'
          }`}
        >
          Trắc nghiệm
        </button>
        <button
          onClick={() => handleTypeChange('unscramble')}
          className={`py-1 text-[10px] font-black rounded-lg border-[1.5px] border-slate-900 transition-all ${
            exerciseType === 'unscramble' ? 'bg-[#FEF08A] text-slate-900 shadow-[1.5px_1.5px_0px_0px_#18181B]' : 'bg-slate-50 border-transparent text-slate-700'
          }`}
        >
          Xếp từ
        </button>
        <button
          onClick={() => handleTypeChange('tense')}
          className={`py-1 text-[10px] font-black rounded-lg border-[1.5px] border-slate-900 transition-all ${
            exerciseType === 'tense' ? 'bg-[#FEF08A] text-slate-900 shadow-[1.5px_1.5px_0px_0px_#18181B]' : 'bg-slate-50 border-transparent text-slate-700'
          }`}
        >
          Chia thì
        </button>
      </div>

      {/* Main Question Card */}
      <div className="bg-white border-[1.8px] border-slate-900 rounded-xl p-3.5 shadow-[2.5px_2.5px_0px_0px_#18181B] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black px-2 py-0.5 bg-[#FFFDF0] border border-slate-900 text-slate-900 rounded uppercase flex items-center gap-1 flex-wrap">
            {exerciseType === 'tense' && <Clock className="w-3 h-3 text-indigo-700" />}
            {exerciseType === 'tense' 
              ? `⏱️ Luyện Chia Thì Giao Tiếp (${currentQuestion.target?.level || 'B1'})`
              : exerciseType === 'cloze'
              ? `🎯 Thử Thách Điền Câu (${currentQuestion.target?.level || 'B1'})`
              : exerciseType === 'unscramble'
              ? `🧩 Sắp Xếp Câu (${currentQuestion.target?.level || 'B1'})`
              : `📚 Cụm từ: ${currentQuestion.target?.phrase || ''} (${currentQuestion.target?.level || 'B1'})`
            }
            {exerciseType === 'meaning' && currentQuestion.target?.phonetic && (
              <span className="text-[9px] font-bold text-amber-900 bg-amber-100 px-1 py-0.2 rounded border border-amber-300 normal-case shrink-0">
                🗣️ {currentQuestion.target.phonetic}
              </span>
            )}
          </span>
          <button
            onClick={() => speechService.speak((currentQuestion.questionText || '').replace('______', '...'))}
            className="p-1 text-slate-900 bg-white border border-slate-900 rounded-lg shadow-[1px_1px_0px_0px_#18181B]"
            title="Nghe đọc câu"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* MODE 1, 2, 4: MULTIPLE CHOICE (CLOZE / MEANING / TENSE) */}
        {(exerciseType === 'cloze' || exerciseType === 'meaning' || exerciseType === 'tense') && Array.isArray(currentQuestion.options) && (
          <div className="space-y-2.5">
            <div className="bg-[#FFFDF0] p-3 rounded-lg border-[1.5px] border-slate-900 shadow-[1.5px_1.5px_0px_0px_#18181B] space-y-1">
              {exerciseType === 'tense' && (
                <span className="text-[9px] font-black uppercase text-indigo-900 bg-indigo-100 px-1.5 py-0.2 rounded border border-indigo-300 inline-block mb-1">
                  💡 Ngữ cảnh: {currentQuestion.target?.meaning || ''}
                </span>
              )}
              <h3 className="text-xs font-black text-slate-900 leading-relaxed">
                {currentQuestion.questionText}
              </h3>
            </div>

            <div className="space-y-1.5">
              {currentQuestion.options.map((opt, idx) => {
                let btnStyle = 'bg-white border-[1.8px] border-slate-900 text-slate-900 shadow-[1.8px_1.8px_0px_0px_#18181B] hover:bg-slate-50';

                if (selectedOption === idx) {
                  btnStyle = 'bg-[#FEF08A] border-[2px] border-slate-900 text-slate-900 font-black shadow-[2.5px_2.5px_0px_0px_#18181B] scale-[1.01]';
                }

                if (isAnswered) {
                  if (opt === currentQuestion.correctAnswer) {
                    btnStyle = 'bg-emerald-300 border-[2px] border-slate-900 text-slate-900 font-black shadow-[2.5px_2.5px_0px_0px_#18181B]';
                  } else if (selectedOption === idx && opt !== currentQuestion.correctAnswer) {
                    btnStyle = 'bg-rose-300 border-[2px] border-slate-900 text-slate-900 font-bold line-through shadow-[1.5px_1.5px_0px_0px_#18181B]';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-2.5 rounded-xl transition-all text-xs flex items-center justify-between ${btnStyle}`}
                  >
                    <span className="font-bold text-xs leading-snug">{opt}</span>
                    {selectedOption === idx && !isAnswered && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-white border border-slate-900 shrink-0 ml-1">
                        Đã chọn
                      </span>
                    )}
                    {isAnswered && opt === currentQuestion.correctAnswer && (
                      <CheckCircle2 className="w-4.5 h-4.5 text-slate-900 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* MODE 3: SENTENCE UNSCRAMBLE */}
        {exerciseType === 'unscramble' && (
          <div className="space-y-2.5">
            <p className="text-xs text-slate-900 font-extrabold">
              Sắp xếp các từ thành câu đúng chứa cụm từ <strong>"{currentQuestion.target?.phrase || ''}"</strong>:
            </p>

            <div className="min-h-[48px] p-2 rounded-xl border-[1.8px] border-dashed border-slate-900 bg-[#FFFDF0] flex flex-wrap gap-1 items-center">
              {userUnscramble.length === 0 ? (
                <span className="text-[11px] text-slate-500 font-bold italic">Chạm vào các từ bên dưới...</span>
              ) : (
                userUnscramble.map((w, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRemoveUserWord(w, idx)}
                    disabled={isAnswered}
                    className="px-2 py-0.5 bg-[#FEF08A] border border-slate-900 text-slate-900 rounded-md text-xs font-black shadow-[1px_1px_0px_0px_#18181B]"
                  >
                    {w}
                  </button>
                ))
              )}
            </div>

            <div className="flex flex-wrap gap-1 pt-1">
              {availableWords.map((w, idx) => (
                <button
                  key={idx}
                  onClick={() => handleWordClick(w, idx)}
                  disabled={isAnswered}
                  className="px-2 py-1 bg-white border-[1.5px] border-slate-900 text-slate-900 rounded-md text-xs font-black shadow-[1.5px_1.5px_0px_0px_#18181B] hover:bg-slate-100"
                >
                  {w}
                </button>
              ))}
            </div>

            {!isAnswered && (
              <button
                onClick={handleCheckUnscramble}
                disabled={userUnscramble.length === 0}
                className="w-full py-2 bg-[#FEF08A] border-[1.8px] border-slate-900 text-slate-900 font-black text-xs rounded-xl shadow-[2px_2px_0px_0px_#18181B] hover:bg-amber-300 disabled:bg-slate-200 disabled:text-slate-400 disabled:border-slate-400 disabled:shadow-none"
              >
                Kiểm tra kết quả
              </button>
            )}
          </div>
        )}

        {/* Result & Explanation */}
        {isAnswered && (
          <div className={`p-3 rounded-xl border-[1.8px] border-slate-900 space-y-1.5 shadow-[2px_2px_0px_0px_#18181B] ${isCorrect ? 'bg-emerald-200' : 'bg-rose-200'}`}>
            <div className="flex items-center gap-1.5">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4.5 h-4.5 text-slate-900" />
                  <span className="text-xs font-black text-slate-900">Chính xác! (+10 XP)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4.5 h-4.5 text-slate-900" />
                  <span className="text-xs font-black text-slate-900">Chưa chính xác!</span>
                </>
              )}
            </div>

            {currentQuestion.tenseName && (
              <p className="text-[11px] font-black text-indigo-950 bg-white p-1.5 rounded border border-slate-900">
                📌 <strong>Tên Thì:</strong> {currentQuestion.tenseName}
              </p>
            )}

            <p className="text-[11px] font-bold text-slate-900 leading-relaxed">
              💡 <strong>Bí quyết chia thì giao tiếp:</strong> {currentQuestion.explanation}
            </p>

            <button
              onClick={generateQuestion}
              className="w-full mt-1 py-1.5 bg-white border-[1.8px] border-slate-900 text-slate-900 font-black text-xs rounded-lg shadow-[1.8px_1.8px_0px_0px_#18181B] hover:bg-slate-100 flex items-center justify-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Thử câu tiếp theo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
