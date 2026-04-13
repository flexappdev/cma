import Link from "next/link";
import { ArrowLeft, Info, Layers, Cpu, Wrench, Plug, Network, Shield, GraduationCap } from "lucide-react";
import { MODULES } from "@/lib/modules";

const PRIMITIVES = [
  { name: "Agent",       desc: "A configured Claude instance with tools, system prompt, and environment." },
  { name: "Environment", desc: "An isolated container (compute + filesystem) provisioned for an agent." },
  { name: "Session",     desc: "A running agent instance with an append-only event log." },
  { name: "Event",       desc: "A unit of interaction — user input, assistant output, tool call, or result." },
];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Layers, Cpu, Wrench, Plug, Network, Shield, GraduationCap,
};

export default function AboutPage() {
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
            <Info className="h-3.5 w-3.5 text-zinc-400" />
            <h1 className="text-sm font-semibold text-zinc-100">About CMA</h1>
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-6 py-8 space-y-10">

        {/* What is AMA */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">What is CMA?</p>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <p className="text-sm text-zinc-300 leading-relaxed">
              <strong className="text-zinc-100">Claude Managed Agents</strong> is a platform layer on top of the Claude API
              that handles long-running, autonomous agent tasks. Instead of managing your own event loops, sandboxed
              containers, and fault-tolerance logic, CMA provides a fully managed infrastructure where you define an agent
              once and let Anthropic handle the rest.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed mt-3">
              This study app covers the CMA curriculum in 7 modules — from core primitives to multi-agent coordination
              and production security patterns — culminating in a 25-question certification assessment.
            </p>
          </div>
        </section>

        {/* Four Primitives */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">The Four Primitives</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRIMITIVES.map((p) => (
              <div key={p.name} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <p
                  className="text-sm font-semibold mb-1"
                  style={{ color: "var(--app-accent)" }}
                >
                  {p.name}
                </p>
                <p className="text-xs text-zinc-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Modules overview */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Curriculum</p>
          <div className="space-y-2">
            {MODULES.map((mod) => {
              const Icon = ICON_MAP[mod.icon] ?? Layers;
              return (
                <Link
                  key={mod.id}
                  href={`/modules/${mod.id}`}
                  className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 hover:border-zinc-600 transition-colors"
                >
                  <span className="text-[10px] font-mono text-zinc-600 w-4 shrink-0">{mod.module}</span>
                  <Icon className="h-4 w-4 text-zinc-500 shrink-0" />
                  <span className="text-sm text-zinc-300">{mod.title}</span>
                  <span className="ml-auto text-[11px] text-zinc-600">{mod.lessons.length} lessons</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Beta header */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Beta Header</p>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500 mb-2">All AMA API calls require this header:</p>
            <code className="block text-xs font-mono text-orange-300 bg-zinc-950 rounded px-3 py-2">
              anthropic-beta: managed-agents-2026-04-01
            </code>
          </div>
        </section>

      </div>
    </div>
  );
}
