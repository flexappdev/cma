import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { RESOURCES } from "@/lib/modules";

const TAG_COLORS: Record<string, string> = {
  docs:     "bg-blue-900/50 text-blue-300",
  sdk:      "bg-purple-900/50 text-purple-300",
  protocol: "bg-teal-900/50 text-teal-300",
  examples: "bg-orange-900/50 text-orange-300",
};

export default function ResourcesPage() {
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
            <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
            <h1 className="text-sm font-semibold text-zinc-100">Resources</h1>
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-6 py-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
          Official Documentation & SDKs
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {RESOURCES.map((r) => (
            <a
              key={r.url}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-600 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                  {r.title}
                </p>
                <ExternalLink className="h-3.5 w-3.5 text-zinc-600 shrink-0 mt-0.5 ml-2" />
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed mb-3">{r.description}</p>
              <span
                className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono ${
                  TAG_COLORS[r.tag] ?? "bg-zinc-800 text-zinc-400"
                }`}
              >
                {r.tag}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
