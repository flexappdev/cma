"use client";
import Link from "next/link";
import { Settings2, BookOpen } from "lucide-react";
import { useSettings } from "@/lib/settings";

export default function AppFooter() {
  const { settings } = useSettings();
  const leftOffset = settings.navCollapsed ? 52 : 180;

  return (
    <div
      className="fixed bottom-0 right-0 z-[100] border-t border-zinc-800 bg-zinc-950/90 backdrop-blur-sm transition-[left] duration-200"
      style={{ left: `${leftOffset}px` }}
    >
      <div className="max-w-[1800px] mx-auto px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--app-accent)" }} />
          <span className="text-xs font-semibold" style={{ color: "var(--app-accent)" }}>
            AMA Study App
          </span>
          <span className="text-xs text-zinc-600">— Anthropic Managed Agents</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <Settings2 className="h-3.5 w-3.5" />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
