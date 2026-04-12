"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Brain } from "lucide-react";
import { QUIZ_QUESTIONS, MODULES, COLOR_MAP } from "@/lib/modules";
import QuizCard from "@/components/QuizCard";

export default function QuizPage() {
  const [filterModule, setFilterModule] = useState<number | null>(null);

  const filtered = filterModule
    ? QUIZ_QUESTIONS.filter((q) => q.module === filterModule)
    : QUIZ_QUESTIONS;

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
            <Brain className="h-3.5 w-3.5 text-zinc-400" />
            <h1 className="text-sm font-semibold text-zinc-100">Quiz</h1>
          </div>
          <span className="text-xs text-zinc-600">{QUIZ_QUESTIONS.length} questions</span>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-6 py-8">
        {/* Module filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilterModule(null)}
            className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
              filterModule === null
                ? "bg-zinc-700 border-zinc-500 text-zinc-100"
                : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
            }`}
          >
            All ({QUIZ_QUESTIONS.length})
          </button>
          {MODULES.slice(0, 6).map((mod) => {
            const count = QUIZ_QUESTIONS.filter((q) => q.module === mod.module).length;
            const color = COLOR_MAP[mod.color] ?? "#f59e0b";
            return (
              <button
                key={mod.module}
                onClick={() => setFilterModule(mod.module)}
                className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                  filterModule === mod.module
                    ? "bg-zinc-700 border-zinc-500 text-zinc-100"
                    : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                }`}
              >
                <span style={{ color: filterModule === mod.module ? undefined : color }}>
                  M{mod.module}
                </span>
                {" "}({count})
              </button>
            );
          })}
        </div>

        {/* Questions */}
        <div className="space-y-2">
          {filtered.map((q) => {
            const mod = MODULES.find((m) => m.module === q.module);
            const color = mod ? (COLOR_MAP[mod.color] ?? "#f59e0b") : "#f59e0b";
            return <QuizCard key={q.id} question={q} moduleColor={color} />;
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-zinc-600 text-sm">
            No questions found.
          </div>
        )}
      </div>
    </div>
  );
}
