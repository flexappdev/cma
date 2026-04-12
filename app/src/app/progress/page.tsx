"use client";
import Link from "next/link";
import { ArrowLeft, Trophy, CheckCircle2 } from "lucide-react";
import { MODULES, COLOR_MAP } from "@/lib/modules";
import { useProgress, lessonKey } from "@/lib/progress";
import * as Icons from "lucide-react";
import { type LucideIcon } from "lucide-react";

function getIcon(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.BookOpen;
}

export default function ProgressPage() {
  const { getModuleProgress, isCompleted } = useProgress();

  const overallLessons = MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const overallDone = MODULES.reduce((acc, m) => {
    return acc + m.lessons.filter((l) => isCompleted(lessonKey(m.id, l.id))).length;
  }, 0);
  const overallPct = overallLessons === 0 ? 0 : Math.round((overallDone / overallLessons) * 100);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[900px] mx-auto px-6 py-3 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Modules
          </Link>
          <div className="h-4 w-px bg-zinc-800" />
          <div className="flex items-center gap-2">
            <Trophy className="h-3.5 w-3.5 text-zinc-400" />
            <h1 className="text-sm font-semibold text-zinc-100">Progress</h1>
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-6 py-8 space-y-8">
        {/* Overall */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Overall Progress</p>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-zinc-300">
                {overallDone} of {overallLessons} lessons completed
              </span>
              <span
                className="text-2xl font-bold"
                style={{ color: "var(--app-accent)" }}
              >
                {overallPct}%
              </span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{ width: `${overallPct}%`, backgroundColor: "var(--app-accent)" }}
              />
            </div>
            {overallPct === 100 && (
              <div className="flex items-center gap-2 mt-3 text-green-400 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                All lessons complete! Ready for the final assessment.
              </div>
            )}
          </div>
        </section>

        {/* Per-module */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">By Module</p>
          <div className="space-y-3">
            {MODULES.map((mod) => {
              const lessonIds = mod.lessons.map((l) => l.id);
              const pct = getModuleProgress(mod.id, lessonIds);
              const done = mod.lessons.filter((l) => isCompleted(lessonKey(mod.id, l.id))).length;
              const color = COLOR_MAP[mod.color] ?? "#f59e0b";
              const Icon = getIcon(mod.icon);

              return (
                <Link
                  key={mod.id}
                  href={`/modules/${mod.id}`}
                  className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 hover:border-zinc-600 transition-colors"
                >
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Icon className="h-4 w-4" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-1">
                      <p className="text-sm text-zinc-200 truncate">{mod.title}</p>
                      <span className="text-xs text-zinc-500 ml-2 shrink-0">
                        {done}/{mod.lessons.length}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1">
                      <div
                        className="h-1 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                  {pct === 100 && (
                    <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
