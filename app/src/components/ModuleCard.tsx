"use client";
import Link from "next/link";
import { Clock, CheckCircle2 } from "lucide-react";
import { type Module, COLOR_MAP } from "@/lib/modules";
import { useProgress } from "@/lib/progress";
import { lessonKey } from "@/lib/progress";
import * as Icons from "lucide-react";
import { type LucideIcon } from "lucide-react";

function getIcon(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.BookOpen;
}

function totalDuration(lessons: Module["lessons"]): string {
  const mins = lessons.reduce((acc, l) => {
    return acc + parseInt(l.duration, 10);
  }, 0);
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }
  return `${mins}min`;
}

interface Props {
  module: Module;
}

export default function ModuleCard({ module }: Props) {
  const { getModuleProgress } = useProgress();
  const lessonIds = module.lessons.map((l) => l.id);
  const pct = getModuleProgress(module.id, lessonIds);
  const color = COLOR_MAP[module.color] ?? "#f59e0b";
  const Icon = getIcon(module.icon);

  return (
    <Link
      href={`/modules/${module.id}`}
      className="group block bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-all hover:bg-zinc-900/80"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <span className="text-[10px] font-mono text-zinc-600 mt-1">
          Module {module.module}
        </span>
      </div>

      <h3 className="text-sm font-semibold text-zinc-100 mb-2 group-hover:text-white transition-colors leading-snug">
        {module.title}
      </h3>
      <p className="text-xs text-zinc-500 leading-relaxed mb-4 line-clamp-3">
        {module.description}
      </p>

      <div className="flex items-center justify-between text-[11px] text-zinc-600 mb-3">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {totalDuration(module.lessons)}
        </span>
        <span>{module.lessons.length} lessons</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-zinc-800 rounded-full h-1 overflow-hidden">
        <div
          className="h-1 rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {pct > 0 && (
        <div className="flex items-center gap-1 mt-1.5">
          {pct === 100 ? (
            <CheckCircle2 className="h-3 w-3 text-green-400" />
          ) : null}
          <span className="text-[10px] text-zinc-600">
            {pct === 100 ? "Complete" : `${pct}% complete`}
          </span>
        </div>
      )}
    </Link>
  );
}
