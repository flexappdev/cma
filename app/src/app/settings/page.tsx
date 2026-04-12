"use client";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Settings2 } from "lucide-react";
import { ACCENT_PRESETS, DEFAULT_SETTINGS, useSettings, type AccentColor } from "@/lib/settings";

export default function SettingsPage() {
  const { settings, update } = useSettings();

  const handleReset = () => {
    update(DEFAULT_SETTINGS);
  };

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
            <Settings2 className="h-3.5 w-3.5 text-zinc-400" />
            <h1 className="text-sm font-semibold text-zinc-100">Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-6 py-8 space-y-10">

        {/* Accent color */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Accent Color</p>
          <div className="flex flex-wrap gap-3">
            {(Object.entries(ACCENT_PRESETS) as [AccentColor, typeof ACCENT_PRESETS[AccentColor]][]).map(([key, val]) => (
              <button
                key={key}
                onClick={() => update({ accentColor: key })}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all ${
                  settings.accentColor === key
                    ? "border-zinc-400 bg-zinc-800 text-zinc-100"
                    : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0"
                  style={{ backgroundColor: val.main }}
                />
                {val.name}
                {settings.accentColor === key && (
                  <CheckCircle2 className="h-3 w-3 text-zinc-300" />
                )}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-zinc-500">Preview:</span>
            <button
              className="px-4 py-1.5 rounded-lg text-xs font-medium text-white transition-colors"
              style={{ backgroundColor: "var(--app-accent-dark)" }}
            >
              Action button
            </button>
            <span className="text-xs" style={{ color: "var(--app-accent-light)" }}>
              Accent text
            </span>
          </div>
        </section>

        {/* Navigation */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Navigation</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => update({ navCollapsed: false })}
              className={`px-4 py-2 rounded-lg text-xs border transition-colors ${
                !settings.navCollapsed
                  ? "bg-zinc-700 border-zinc-500 text-zinc-100"
                  : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600"
              }`}
            >
              Full nav (icons + labels)
            </button>
            <button
              onClick={() => update({ navCollapsed: true })}
              className={`px-4 py-2 rounded-lg text-xs border transition-colors ${
                settings.navCollapsed
                  ? "bg-zinc-700 border-zinc-500 text-zinc-100"
                  : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600"
              }`}
            >
              Icons only
            </button>
          </div>
        </section>

        {/* Reset */}
        <section className="pt-4 border-t border-zinc-800">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg text-xs border border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 transition-colors"
          >
            Reset to defaults
          </button>
        </section>

      </div>
    </div>
  );
}
