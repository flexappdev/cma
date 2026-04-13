"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type AccentColor = "orange" | "blue" | "purple" | "teal" | "pink" | "rose" | "yellow";

export const ACCENT_PRESETS: Record<AccentColor, { main: string; dark: string; light: string; name: string }> = {
  orange: { main: "#f59e0b", dark: "#d97706", light: "#fcd34d", name: "Orange" },
  blue:   { main: "#3b82f6", dark: "#2563eb", light: "#93c5fd", name: "Blue" },
  purple: { main: "#a855f7", dark: "#9333ea", light: "#d8b4fe", name: "Purple" },
  teal:   { main: "#14b8a6", dark: "#0d9488", light: "#5eead4", name: "Teal" },
  pink:   { main: "#ec4899", dark: "#db2777", light: "#f9a8d4", name: "Pink" },
  rose:   { main: "#f43f5e", dark: "#e11d48", light: "#fda4af", name: "Rose" },
  yellow: { main: "#eab308", dark: "#ca8a04", light: "#fef08a", name: "Yellow" },
};

export interface Settings {
  accentColor: AccentColor;
  navCollapsed: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  accentColor: "orange",
  navCollapsed: false,
};

interface SettingsContextValue {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  update: () => {},
});

export function applyAccent(color: AccentColor) {
  const p = ACCENT_PRESETS[color];
  const r = document.documentElement;
  r.style.setProperty("--app-accent", p.main);
  r.style.setProperty("--app-accent-dark", p.dark);
  r.style.setProperty("--app-accent-light", p.light);
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cma-settings");
      const parsed: Settings = saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
      setSettings(parsed);
      applyAccent(parsed.accentColor);
    } catch {
      applyAccent(DEFAULT_SETTINGS.accentColor);
    }
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem("cma-settings", JSON.stringify(next)); } catch { /* noop */ }
      if (patch.accentColor) applyAccent(patch.accentColor);
      return next;
    });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, update }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
