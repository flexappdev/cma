"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen, LayoutGrid, Brain, Trophy, ExternalLink, Info, Settings2,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { useSettings } from "@/lib/settings";

const NAV_ITEMS = [
  { href: "/",          icon: BookOpen,     label: "Modules" },
  { href: "/modules",   icon: LayoutGrid,   label: "All Modules" },
  { href: "/quiz",      icon: Brain,        label: "Quiz" },
  { href: "/progress",  icon: Trophy,       label: "Progress" },
  { href: "/resources", icon: ExternalLink, label: "Resources" },
  { href: "/about",     icon: Info,         label: "About" },
  { href: "/settings",  icon: Settings2,    label: "Settings" },
];

export default function LeftSidebar() {
  const { settings, update } = useSettings();
  const pathname = usePathname();
  const collapsed = settings.navCollapsed;

  return (
    <div
      className={`fixed left-0 top-0 bottom-12 z-[90] flex flex-col border-r border-zinc-800 bg-zinc-950/95 backdrop-blur-sm transition-[width] duration-200 ${
        collapsed ? "w-[52px]" : "w-[180px]"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 py-4 border-b border-zinc-800 shrink-0">
        <BookOpen className="h-5 w-5 shrink-0" style={{ color: "var(--app-accent)" }} />
        {!collapsed && (
          <span className="text-sm font-semibold text-zinc-100 truncate">AMA</span>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-2.5 px-3 py-2 mx-1 rounded-lg text-xs transition-colors ${
                active
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-zinc-800 px-2 py-2 shrink-0">
        <button
          onClick={() => update({ navCollapsed: !collapsed })}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="w-full flex items-center justify-center p-1.5 rounded-lg text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
