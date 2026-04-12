import { LayoutGrid } from "lucide-react";
import ModuleGrid from "@/components/ModuleGrid";
import { MODULES } from "@/lib/modules";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AllModulesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-3 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
          <div className="h-4 w-px bg-zinc-800" />
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-3.5 w-3.5 text-zinc-400" />
            <h1 className="text-sm font-semibold text-zinc-100">All Modules</h1>
          </div>
          <span className="text-xs text-zinc-600">{MODULES.length} modules</span>
        </div>
      </div>
      <div className="px-6 py-6">
        <ModuleGrid />
      </div>
    </div>
  );
}
