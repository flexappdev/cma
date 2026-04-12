"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { type QuizQuestion } from "@/lib/modules";

interface Props {
  question: QuizQuestion;
  moduleColor?: string;
}

export default function QuizCard({ question, moduleColor = "#f59e0b" }: Props) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setRevealed((v) => !v)}
        className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-zinc-800/50 transition-colors"
      >
        <span
          className="text-xs font-mono font-bold mt-0.5 shrink-0 w-6"
          style={{ color: moduleColor }}
        >
          Q{question.id}
        </span>
        <span className="flex-1 text-sm text-zinc-200 leading-snug">{question.question}</span>
        {revealed ? (
          <ChevronUp className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
        ) : (
          <ChevronDown className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
        )}
      </button>

      {revealed && (
        <div
          className="px-5 pb-4 pt-0 border-t border-zinc-800"
          style={{ borderColor: `${moduleColor}30` }}
        >
          <p className="text-sm text-zinc-300 leading-relaxed pt-3">{question.answer}</p>
        </div>
      )}
    </div>
  );
}
