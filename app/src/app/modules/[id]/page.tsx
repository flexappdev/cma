import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { MODULES, COLOR_MAP } from "@/lib/modules";
import LessonList from "@/components/LessonList";
import * as Icons from "lucide-react";
import { type LucideIcon } from "lucide-react";

function getIcon(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.BookOpen;
}

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return MODULES.map((m) => ({ id: m.id }));
}

export default async function ModulePage({ params }: Props) {
  const { id } = await params;
  const mod = MODULES.find((m) => m.id === id);
  if (!mod) notFound();

  const color = COLOR_MAP[mod.color] ?? "#f59e0b";
  const Icon = getIcon(mod.icon);
  const totalMins = mod.lessons.reduce((acc, l) => acc + parseInt(l.duration, 10), 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[900px] mx-auto px-6 py-3 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Modules
          </Link>
          <div className="h-4 w-px bg-zinc-800" />
          <span className="text-xs font-mono text-zinc-600">Module {mod.module}</span>
          <div className="h-4 w-px bg-zinc-800" />
          <span className="text-xs text-zinc-400 truncate">{mod.title}</span>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-6 py-8">
        {/* Module hero */}
        <div className="flex items-start gap-5 mb-8">
          <div
            className="flex items-center justify-center w-14 h-14 rounded-2xl shrink-0"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="h-7 w-7" style={{ color }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded"
                style={{ backgroundColor: `${color}20`, color }}
              >
                Module {mod.module}
              </span>
            </div>
            <h1 className="text-xl font-bold text-zinc-100 mb-2">{mod.title}</h1>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-[600px]">
              {mod.description}
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-zinc-600">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {totalMins}min total
              </span>
              <span>{mod.lessons.length} lessons</span>
            </div>
          </div>
        </div>

        {/* Lessons */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
            Lessons — click to mark complete
          </p>
          <LessonList module={mod} />
        </section>

        {/* Navigation between modules */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-zinc-800">
          {mod.module > 1 ? (
            <Link
              href={`/modules/${MODULES[mod.module - 2].id}`}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Module {mod.module - 1}
            </Link>
          ) : (
            <span />
          )}
          {mod.module < MODULES.length ? (
            <Link
              href={`/modules/${MODULES[mod.module].id}`}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              Module {mod.module + 1}
              <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
            </Link>
          ) : (
            <Link
              href="/quiz"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium text-white transition-colors"
              style={{ backgroundColor: "var(--app-accent-dark)" }}
            >
              Take the Quiz
              <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
