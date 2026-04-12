"use client";

import { Clock, BookOpen, Star, Users, CheckCircle2 } from "lucide-react";
import { cn, levelColor, categoryColor, formatRating, formatStudents } from "@/lib/utils";
import { useProgress } from "@/lib/progress";
import type { Course } from "@/lib/types";

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

export default function CourseCard({ course, onClick }: CourseCardProps) {
  const { isCompleted: checkCompleted, toggle } = useProgress();
  const isCompleted = checkCompleted(course.id);

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-3 rounded-xl border bg-card p-4 cursor-pointer transition-all duration-200",
        "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5",
        isCompleted && "border-emerald-500/30 bg-emerald-500/5"
      )}
      onClick={onClick}
    >
      {/* Completed badge */}
      {isCompleted && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        </div>
      )}

      {/* Category + Level */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", categoryColor(course.category))}>
          {course.category}
        </span>
        <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize", levelColor(course.level))}>
          {course.level}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
        {course.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">
        {course.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {course.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
            {tag}
          </span>
        ))}
        {course.tags.length > 3 && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
            +{course.tags.length - 3}
          </span>
        )}
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between pt-1 border-t border-border">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {course.lessons}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            {formatRating(course.rating)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {formatStudents(course.students)}
          </span>
        </div>
      </div>

      {/* Complete toggle */}
      <button
        className={cn(
          "absolute bottom-3 right-3 text-xs px-2 py-1 rounded-md border transition-colors opacity-0 group-hover:opacity-100",
          isCompleted
            ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
            : "border-border bg-secondary text-muted-foreground hover:text-foreground"
        )}
        onClick={(e) => {
          e.stopPropagation();
          toggle(course.id);
        }}
      >
        {isCompleted ? "Done" : "Mark done"}
      </button>
    </div>
  );
}
