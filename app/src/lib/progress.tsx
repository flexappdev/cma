"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import React from "react";

const STORAGE_KEY = "cma-lesson-progress";

export function lessonKey(moduleId: string, lessonId: string): string {
  return `${moduleId}::${lessonId}`;
}

// --- Context ---

interface ProgressContextValue {
  completed: Set<string>;
  toggle: (key: string) => void;
  isCompleted: (key: string) => boolean;
  getModuleProgress: (moduleId: string, lessonIds: string[]) => number;
}

const ProgressContext = createContext<ProgressContextValue>({
  completed: new Set(),
  toggle: () => {},
  isCompleted: () => false,
  getModuleProgress: () => 0,
});

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCompleted(new Set(JSON.parse(raw) as string[]));
    } catch { /* noop */ }
  }, []);

  const toggle = useCallback((key: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next))); } catch { /* noop */ }
      return next;
    });
  }, []);

  const isCompleted = useCallback((key: string) => completed.has(key), [completed]);

  const getModuleProgress = useCallback(
    (moduleId: string, lessonIds: string[]) => {
      if (lessonIds.length === 0) return 0;
      const done = lessonIds.filter((id) => completed.has(lessonKey(moduleId, id))).length;
      return Math.round((done / lessonIds.length) * 100);
    },
    [completed]
  );

  return React.createElement(
    ProgressContext.Provider,
    { value: { completed, toggle, isCompleted, getModuleProgress } },
    children
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}
