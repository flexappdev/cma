"use client";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { type Module } from "@/lib/modules";
import { useProgress, lessonKey } from "@/lib/progress";

interface Props {
  module: Module;
}

export default function LessonList({ module }: Props) {
  const { isCompleted, toggle } = useProgress();

  return (
    <div className="space-y-1">
      {module.lessons.map((lesson, idx) => {
        const key = lessonKey(module.id, lesson.id);
        const done = isCompleted(key);
        return (
          <button
            key={lesson.id}
            onClick={() => toggle(key)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
              done
                ? "bg-zinc-800/50 border border-zinc-700/50"
                : "bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50"
            }`}
          >
            <span className="text-[10px] font-mono text-zinc-600 w-4 shrink-0">{idx + 1}</span>
            {done ? (
              <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-zinc-700 shrink-0" />
            )}
            <span className={`flex-1 text-sm ${done ? "text-zinc-400 line-through" : "text-zinc-200"}`}>
              {lesson.title}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-zinc-600 shrink-0">
              <Clock className="h-3 w-3" />
              {lesson.duration}
            </span>
          </button>
        );
      })}
    </div>
  );
}
