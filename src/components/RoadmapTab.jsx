import React from 'react';
import { CEFR_LEVELS } from '../data/cefrData';
import { Award, Sparkles } from 'lucide-react';

export default function RoadmapTab({ userLevel, onSelectLevel, phrases }) {
  const getLevelCount = (lvlId) => {
    return phrases.filter(p => p.level === lvlId).length;
  };

  const getMasteredCount = (lvlId) => {
    return phrases.filter(p => p.level === lvlId && (p.masteryLevel || 0) >= 3).length;
  };

  const LEVEL_DESCRIPTIONS = {
    B1: {
      title: 'Intermediate (Trung cấp)',
      desc: 'Hiểu các điểm chính trong công việc, học tập, đời sống. Tự tin diễn đạt ý kiến và kế hoạch cơ bản.',
      topics: ['Phrasal verbs thông dụng', 'Workplace collocations', 'Cấu trúc so sánh']
    },
    B2: {
      title: 'Upper Intermediate (Trung cao cấp)',
      desc: 'Thuyết trình mạch lạc, viết bài luận tranh luận, giao tiếp tự nhiên với người bản xứ trong hầu hết tình huống.',
      topics: ['Business English', 'Idiom phổ biến', 'Collocation phân tích']
    },
    C1: {
      title: 'Advanced (Cao cấp)',
      desc: 'Sử dụng ngôn ngữ linh hoạt cho các mục đích xã hội, học thuật và chuyên môn. Hiểu các hàm ý ẩn sâu.',
      topics: ['Academic writing phrases', 'Idiomatic expressions', 'Báo chí chuyên sâu']
    },
    C2: {
      title: 'Proficient / Native (Thành thạo bản xứ)',
      desc: 'Làm chủ hoàn toàn Tiếng Anh ở mức độ bản xứ. Tự nhiên sử dụng ẩn dụ, tục ngữ và thuật ngữ chuyên gia.',
      topics: ['Native-level idioms', 'Legal phrasing', 'Văn học & học thuật']
    }
  };

  return (
    <div className="w-full space-y-3 pb-4 px-2">
      {/* Notebook Grid Banner - Slender 1.8px Border */}
      <div className="bg-[#FFFDF0] border-[1.8px] border-slate-900 rounded-xl p-3.5 shadow-[2.5px_2.5px_0px_0px_#18181B] text-slate-900">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-white border border-slate-900 text-slate-900">
            LỘ TRÌNH CHUẨN CEFR
          </span>
          <Award className="w-5 h-5 text-slate-900" />
        </div>
        <h2 className="text-base font-black text-slate-900 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-slate-900 fill-slate-900" /> Bản Đồ Phát Triển B1 ➔ C2
        </h2>
        <p className="text-xs font-bold text-slate-800 mt-1">
          Chinh phục từng cấp độ qua bài học ngẫu nhiên và lật thẻ ghi nhớ SRS.
        </p>
      </div>

      {/* Cartoon Roadmap Timeline */}
      <div className="relative pl-3 space-y-4 before:absolute before:left-5 before:top-4 before:bottom-4 before:w-[1.8px] before:bg-slate-900">
        {CEFR_LEVELS.map((lvl, index) => {
          const isCurrentLevel = userLevel === lvl.id;
          const totalInLevel = getLevelCount(lvl.id);
          const masteredInLevel = getMasteredCount(lvl.id);
          const progressPercent = totalInLevel > 0 ? Math.round((masteredInLevel / totalInLevel) * 100) : 0;
          const meta = LEVEL_DESCRIPTIONS[lvl.id];

          return (
            <div key={lvl.id} className="relative flex items-start space-x-2.5">
              {/* Timeline Icon Node */}
              <div
                onClick={() => onSelectLevel(lvl.id)}
                className={`w-6 h-6 rounded-lg border-[1.8px] border-slate-900 flex items-center justify-center cursor-pointer transition-all z-10 shrink-0 text-xs font-black ${
                  isCurrentLevel
                    ? 'bg-[#FFFDF0] text-slate-900 shadow-[1.8px_1.8px_0px_0px_#18181B] scale-110'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {index + 1}
              </div>

              {/* Card content */}
              <div
                onClick={() => onSelectLevel(lvl.id)}
                className={`flex-1 p-3 rounded-xl border-[1.8px] border-slate-900 transition-all cursor-pointer shadow-[2.5px_2.5px_0px_0px_#18181B] ${
                  isCurrentLevel
                    ? 'bg-white ring-1 ring-slate-900'
                    : 'bg-[#FFFDF5] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-[#FAF6ED] border border-slate-900 text-slate-900">
                      {lvl.id}
                    </span>
                    <h3 className="text-xs font-black text-slate-900">{meta.title}</h3>
                  </div>

                  {isCurrentLevel && (
                    <span className="text-[9px] font-black text-slate-900 bg-emerald-200 border border-slate-900 px-1.5 py-0.2 rounded">
                      Đang học
                    </span>
                  )}
                </div>

                <p className="text-[11px] font-bold text-slate-700 leading-relaxed mb-2">
                  {meta.desc}
                </p>

                {/* Progress Bar Cartoon */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black text-slate-900">
                    <span>Đã làm chủ</span>
                    <span>{masteredInLevel} / {totalInLevel} ({progressPercent}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 border border-slate-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#FAF6ED] h-full border-r border-slate-900 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Focus Topics */}
                <div className="mt-2 pt-1.5 border-t border-slate-200 flex flex-wrap gap-1">
                  {meta.topics.map((top, tIdx) => (
                    <span key={tIdx} className="text-[9px] font-bold text-slate-800 bg-white border border-slate-900 px-1.5 py-0.2 rounded shadow-[1px_1px_0px_0px_#18181B]">
                      • {top}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
