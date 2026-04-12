"use client";

import { useState } from "react";
import { BookOpen, Search, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProgress } from "@/lib/progress";

interface AppHeaderProps {
  search: string;
  onSearchChange: (v: string) => void;
  totalCourses: number;
  filteredCount: number;
}

export default function AppHeader({ search, onSearchChange, totalCourses, filteredCount }: AppHeaderProps) {
  const { completed: completedCourses } = useProgress();
  const [focused, setFocused] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold text-foreground leading-none">AMA Courses</div>
            <div className="text-xs text-muted-foreground leading-none mt-0.5">Anthropic Managed Agents</div>
          </div>
        </div>

        {/* Search */}
        <div className={`flex-1 relative max-w-md transition-all ${focused ? "ring-2 ring-primary rounded-md" : ""}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            className="pl-9 border-0 bg-secondary focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Search courses, tags..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {search && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => onSearchChange("")}
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground shrink-0">
          <span>
            <span className="text-foreground font-medium">{filteredCount}</span>
            {filteredCount !== totalCourses && <span className="text-muted-foreground">/{totalCourses}</span>} courses
          </span>
          <span>
            <span className="text-emerald-400 font-medium">{completedCourses.size}</span> completed
          </span>
        </div>

        {/* Docs link */}
        <Button variant="outline" size="sm" className="shrink-0 text-xs" asChild>
          <a href="https://platform.claude.com/docs/en/managed-agents/overview" target="_blank" rel="noopener">
            Docs
          </a>
        </Button>
      </div>
    </header>
  );
}
