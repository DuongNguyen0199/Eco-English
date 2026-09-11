import React from 'react';
import { CheckCircle2, Circle, Clock, ExternalLink, Sparkles, Database } from 'lucide-react';

export default function TaskCardList({ tasks = [], isMock = true, onToggleTask }) {
  if (tasks.length === 0) {
    return (
      <div className="ios-glass-card rounded-2xl p-5 text-center text-neutral-400 my-2">
        <Sparkles className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
        <p className="text-sm font-medium">Không có công việc nào trong danh sách.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5 my-3">
      {/* Header section with data source tag */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Công việc hôm nay ({tasks.length})
        </span>
        <div className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-neutral-800/80 border border-neutral-700 text-neutral-300">
          <Database className="w-3 h-3 text-purple-400" />
          <span>{isMock ? 'Dữ liệu mẫu' : 'Đã kết nối Notion'}</span>
        </div>
      </div>

      {/* List of Tasks */}
      <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
        {tasks.map((task, index) => {
          const isDone = task.status === 'Done' || task.status === 'Hoàn thành';

          return (
            <div
              key={task.id || index}
              className="ios-glass-card rounded-2xl p-3.5 flex items-center justify-between gap-3 border border-white/5 hover:border-purple-500/30 transition-all duration-200 group"
            >
              {/* Left side: Icon & Title */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={() => onToggleTask && onToggleTask(task.id)}
                  className="text-neutral-400 hover:text-purple-400 transition-colors shrink-0"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                  ) : (
                    <Circle className="w-5 h-5 text-neutral-500 group-hover:text-purple-400" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base shrink-0">{task.icon || '📌'}</span>
                    <h4
                      className={`text-sm font-semibold truncate transition-colors ${
                        isDone ? 'line-through text-neutral-500' : 'text-neutral-100 group-hover:text-purple-200'
                      }`}
                    >
                      {task.title}
                    </h4>
                  </div>

                  {/* Metadata: Duration & Status tag */}
                  <div className="flex items-center gap-2 mt-1">
                    {task.duration && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-800/40">
                        <Clock className="w-3 h-3" />
                        {task.duration}
                      </span>
                    )}

                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        isDone
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                          : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                      }`}
                    >
                      {task.status || 'Cần làm'}
                    </span>
                  </div>
                </div>
              </div>

              {/* External Link to Notion page if available */}
              {task.notionUrl && (
                <a
                  href={task.notionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-colors shrink-0"
                  title="Mở trong Notion"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
