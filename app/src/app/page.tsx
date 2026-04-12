import { BookOpen, GraduationCap } from "lucide-react";
import ModuleGrid from "@/components/ModuleGrid";
import { MODULES } from "@/lib/modules";

export default function HomePage() {
  const totalLessons = MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalMins = MODULES.reduce((acc, m) => {
    return acc + m.lessons.reduce((a, l) => a + parseInt(l.duration, 10), 0);
  }, 0);
  const totalHours = Math.round(totalMins / 60);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
        <div className="px-6 py-5">
          <div className="flex items-center gap-3 mb-1">
            <BookOpen className="h-5 w-5" style={{ color: "var(--app-accent)" }} />
            <h1 className="text-lg font-bold text-zinc-100">
              Anthropic Managed Agents
            </h1>
          </div>
          <p className="text-sm text-zinc-500 ml-8">
            Complete learning curriculum — {MODULES.length} modules, {totalLessons} lessons, ~{totalHours}h total
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-b border-zinc-800/50 bg-zinc-950/40">
        <div className="px-6 py-3 flex items-center gap-6">
          {[
            { label: "Modules", value: String(MODULES.length) },
            { label: "Lessons", value: String(totalLessons) },
            { label: "Study time", value: `~${totalHours}h` },
            { label: "Certification", value: "25 Qs" },
          ].map((s) => (
            <div key={s.label} className="flex items-baseline gap-1.5">
              <span className="text-sm font-semibold text-zinc-200">{s.value}</span>
              <span className="text-xs text-zinc-600">{s.label}</span>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-1.5 text-xs text-zinc-600">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>AMA Certification</span>
          </div>
        </div>
      </div>

      {/* Module grid */}
      <div className="px-6 py-6">
        <ModuleGrid />
      </div>
    </div>
  );
}
