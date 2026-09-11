import React, { useState } from 'react';
import { DAILY_LESSONS, CEFR_LEVELS, INITIAL_PHRASES } from '../data/cefrData';
import { speechService } from '../services/speechService';
import { Volume2, CheckCircle2, Award, ArrowRight, Flame, Sparkles, BookOpen, HelpCircle } from 'lucide-react';

export default function DailyLessonTab({ userLevel, onLevelChange, phrases, onFinishLesson, streak }) {
  const levelLessons = DAILY_LESSONS[userLevel] || DAILY_LESSONS['B1'];
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const currentLesson = levelLessons[selectedDayIndex % levelLessons.length];

  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const focusPhraseObj = phrases.find(p => p.id === currentLesson.focusPhraseId) || 
                         INITIAL_PHRASES.find(p => p.id === currentLesson.focusPhraseId) ||
                         INITIAL_PHRASES[0];

  const handleOptionSelect = (quizId, optionIndex) => {
    if (submitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [quizId]: optionIndex
    }));
  };

  const handleCheckQuiz = () => {
    setSubmitted(true);
    let allCorrect = true;
    currentLesson.quiz.forEach(q => {
      if (userAnswers[q.id || q.question] !== q.correctIndex) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      onFinishLesson && onFinishLesson();
    }
  };

  const handleSpeakStory = () => {
    if (isSpeaking) {
      speechService.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speechService.speak(
        currentLesson.storySnippet.replace(/\*\*/g, ''),
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
    }
  };

  const currentLevelObj = CEFR_LEVELS.find(l => l.id === userLevel) || CEFR_LEVELS[0];

  return (
    <div className="w-full space-y-3 pb-4 px-2">
      {/* Cartoon Notebook Banner Level */}
      <div className="bg-[#FFFDF0] border-[1.8px] border-slate-900 rounded-xl p-3.5 shadow-[2.5px_2.5px_0px_0px_#18181B] text-slate-900">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider bg-[#FEF08A] border-[1.5px] border-slate-900 px-2 py-0.5 rounded-md shadow-[1px_1px_0px_0px_#18181B]">
            BÀI HỌC CẤP ĐỘ {userLevel}
          </span>
          <span className="text-[10px] font-extrabold bg-slate-900 text-white px-2 py-0.5 rounded-md">
            Lộ trình B1➔C2
          </span>
        </div>

        <h2 className="text-base font-black text-slate-900 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-slate-900 fill-slate-900" />
          {currentLesson.title}
        </h2>
        <p className="text-xs font-bold text-slate-800 mt-1 line-clamp-2">
          📌 {currentLesson.grammarNote}
        </p>
      </div>

      {/* Select Level Cartoon Buttons - Highlighted when Selected */}
      <div className="bg-white border-[1.8px] border-slate-900 p-2 rounded-xl shadow-[2px_2px_0px_0px_#18181B] flex items-center justify-between">
        <span className="text-xs font-black text-slate-900 pl-1 uppercase">Cấp độ:</span>
        <div className="flex space-x-1">
          {CEFR_LEVELS.map(lvl => (
            <button
              key={lvl.id}
              onClick={() => {
                onLevelChange(lvl.id);
                setSubmitted(false);
                setUserAnswers({});
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all border-[1.8px] border-slate-900 ${
                userLevel === lvl.id
                  ? 'bg-[#FEF08A] text-slate-900 shadow-[2px_2px_0px_0px_#18181B] scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_0px_#18181B]'
              }`}
            >
              {lvl.id}
            </button>
          ))}
        </div>
      </div>

      {/* Main Focus Phrase Card */}
      {focusPhraseObj && (
        <div className="bg-[#FFFDF5] border-[1.8px] border-slate-900 rounded-xl p-3.5 shadow-[2.5px_2.5px_0px_0px_#18181B] space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#FEF08A] border border-slate-900 text-slate-900">
                {focusPhraseObj.type}
              </span>
              <h3 className="text-base font-black text-slate-900 mt-1 flex items-center gap-1.5">
                {focusPhraseObj.phrase}
                <button
                  onClick={() => speechService.speak(focusPhraseObj.phrase)}
                  className="p-1 text-slate-900 bg-white border border-slate-900 rounded-lg shadow-[1px_1px_0px_0px_#18181B] hover:bg-slate-100"
                  title="Nghe phát âm"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </h3>
            </div>

            <span className="text-xs font-black text-slate-900 bg-white border-[1.8px] border-slate-900 px-2 py-0.5 rounded-lg shadow-[1.5px_1.5px_0px_0px_#18181B]">
              {focusPhraseObj.level}
            </span>
          </div>

          <p className="text-xs font-extrabold text-indigo-950">
            👉 Nghĩa: {focusPhraseObj.meaning}
          </p>

          <div className="bg-white border-[1.5px] border-slate-900 p-2.5 rounded-lg shadow-[1.5px_1.5px_0px_0px_#18181B]">
            <p className="text-xs font-bold text-slate-800 italic">
              "{focusPhraseObj.example}"
            </p>
            <p className="text-[11px] font-semibold text-slate-600 mt-1">
              📌 {focusPhraseObj.vietnameseTranslation}
            </p>
          </div>
        </div>
      )}

      {/* Story Context Snippet */}
      <div className="bg-white border-[1.8px] border-slate-900 rounded-xl p-3.5 shadow-[2.5px_2.5px_0px_0px_#18181B] space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1">
            <BookOpen className="w-4 h-4 text-slate-900" /> Ngữ cảnh thực tế
          </h4>
          <button
            onClick={handleSpeakStory}
            className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-lg border-[1.8px] border-slate-900 font-bold transition-all ${
              isSpeaking
                ? 'bg-amber-300 text-slate-900 shadow-[1.5px_1.5px_0px_0px_#18181B]'
                : 'bg-[#FEF08A] text-slate-900 shadow-[1.8px_1.8px_0px_0px_#18181B]'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isSpeaking ? 'Đang đọc...' : 'Phát âm'}</span>
          </button>
        </div>
        <p className="text-xs font-bold text-slate-900 leading-relaxed bg-[#FFFDF0] p-3 rounded-lg border-[1.5px] border-slate-900 shadow-[1.5px_1.5px_0px_0px_#18181B]">
          {currentLesson.storySnippet}
        </p>
      </div>

      {/* Daily Quiz Section - Clear Pastel Yellow Selection Color */}
      <div className="bg-white border-[1.8px] border-slate-900 rounded-xl p-3.5 shadow-[2.5px_2.5px_0px_0px_#18181B] space-y-3">
        <div className="flex items-center justify-between border-b-[1.8px] border-slate-900 pb-2">
          <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase">
            <HelpCircle className="w-4 h-4 text-slate-900" />
            Bài tập kiểm tra ngày ({currentLesson.quiz.length} câu)
          </h3>
          {submitted && (
            <span className="text-[10px] font-black bg-emerald-200 border border-slate-900 text-slate-900 px-1.5 py-0.5 rounded shadow-[1px_1px_0px_0px_#18181B]">
              Đã nộp bài
            </span>
          )}
        </div>

        {currentLesson.quiz.map((q, idx) => {
          const qId = q.id || q.question;
          const selectedOpt = userAnswers[qId];

          return (
            <div key={idx} className="space-y-2 text-xs">
              <p className="font-extrabold text-slate-900">
                Câu {idx + 1}: {q.question}
              </p>

              <div className="space-y-1.5">
                {q.options.map((opt, oIdx) => {
                  // Default unselected state
                  let btnStyle = 'bg-white border-[1.8px] border-slate-900 text-slate-900 shadow-[1.5px_1.5px_0px_0px_#18181B] hover:bg-slate-50';

                  // User selected option before nộp bài -> Clear Pastel Yellow Highlight!
                  if (selectedOpt === oIdx) {
                    btnStyle = 'bg-[#FEF08A] border-[2px] border-slate-900 text-slate-900 font-black shadow-[2.5px_2.5px_0px_0px_#18181B] scale-[1.01]';
                  }

                  // After submitting
                  if (submitted) {
                    if (oIdx === q.correctIndex) {
                      btnStyle = 'bg-emerald-300 border-[2px] border-slate-900 text-slate-900 font-black shadow-[2.5px_2.5px_0px_0px_#18181B]';
                    } else if (selectedOpt === oIdx && oIdx !== q.correctIndex) {
                      btnStyle = 'bg-rose-300 border-[2px] border-slate-900 text-slate-900 font-bold line-through shadow-[1.5px_1.5px_0px_0px_#18181B]';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleOptionSelect(qId, oIdx)}
                      disabled={submitted}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span className="font-bold text-xs">{opt}</span>
                      {selectedOpt === oIdx && !submitted && (
                        <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-white border border-slate-900 shadow-[1px_1px_0px_0px_#18181B]">
                          Đã chọn
                        </span>
                      )}
                      {submitted && oIdx === q.correctIndex && (
                        <CheckCircle2 className="w-4.5 h-4.5 text-slate-900 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="p-2 rounded-lg bg-[#FFFDF0] border-[1.5px] border-slate-900 text-[11px] font-bold text-slate-900 shadow-[1.5px_1.5px_0px_0px_#18181B]">
                  💡 <strong>Giải thích:</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}

        {!submitted ? (
          <button
            onClick={handleCheckQuiz}
            disabled={Object.keys(userAnswers).length < currentLesson.quiz.length}
            className={`w-full py-2.5 rounded-xl border-[1.8px] border-slate-900 text-xs font-black transition-all shadow-[2px_2px_0px_0px_#18181B] ${
              Object.keys(userAnswers).length === currentLesson.quiz.length
                ? 'bg-[#FEF08A] text-slate-900 hover:bg-amber-300 active:translate-x-0.5 active:translate-y-0.5 shadow-[2.5px_2.5px_0px_0px_#18181B]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border-slate-400 shadow-none'
            }`}
          >
            NỘP BÀI & KIỂM TRA
          </button>
        ) : (
          <div className="bg-emerald-200 border-[1.8px] border-slate-900 rounded-xl p-3 text-center space-y-2 shadow-[2.5px_2.5px_0px_0px_#18181B]">
            <Award className="w-7 h-7 text-slate-900 mx-auto" />
            <p className="text-xs font-black text-slate-900 uppercase">
              Xuất sắc! Bạn đã hoàn thành bài học hôm nay. Streak +1! 🎉
            </p>
            <button
              onClick={() => {
                setSelectedDayIndex(prev => prev + 1);
                setSubmitted(false);
                setUserAnswers({});
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border-[1.8px] border-slate-900 text-slate-900 font-black text-xs rounded-lg shadow-[1.8px_1.8px_0px_0px_#18181B] hover:bg-slate-100"
            >
              Bài tiếp theo <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
