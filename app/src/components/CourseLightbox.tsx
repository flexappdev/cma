"use client";

import { Clock, BookOpen, Star, Users, Calendar, CheckCircle2, ExternalLink, Tag } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn, levelColor, categoryColor, formatRating, formatStudents } from "@/lib/utils";
import { useProgress } from "@/lib/progress";
import type { Course } from "@/lib/types";

interface CourseLightboxProps {
  course: Course | null;
  onClose: () => void;
}

export default function CourseLightbox({ course, onClose }: CourseLightboxProps) {
  const { isCompleted: checkCompleted, toggle } = useProgress();

  if (!course) return null;

  const isCompleted = checkCompleted(course.id);

  return (
    <Dialog open={!!course} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          {/* Category + Level */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", categoryColor(course.category))}>
              {course.category}
            </span>
            <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize", levelColor(course.level))}>
              {course.level}
            </span>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                Completed
              </span>
            )}
          </div>
          <DialogTitle className="text-xl leading-snug">{course.title}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed mt-2">
            {course.description}
          </DialogDescription>
        </DialogHeader>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
          {[
            { icon: Clock, label: "Duration", value: course.duration },
            { icon: BookOpen, label: "Lessons", value: course.lessons.toString() },
            { icon: Star, label: "Rating", value: formatRating(course.rating), iconClass: "text-amber-400 fill-amber-400" },
            { icon: Users, label: "Students", value: formatStudents(course.students) },
          ].map(({ icon: Icon, label, value, iconClass }) => (
            <div key={label} className="flex flex-col items-center justify-center gap-1 rounded-lg border border-border bg-secondary p-3">
              <Icon className={cn("h-4 w-4 text-muted-foreground", iconClass)} />
              <span className="text-sm font-semibold text-foreground">{value}</span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Tag className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tags</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {course.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground border border-border">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-3">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Updated {course.updated}
          </span>
          <span>by {course.instructor}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <Button
            className="flex-1"
            variant={isCompleted ? "secondary" : "default"}
            onClick={() => toggle(course.id)}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Mark Incomplete
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Mark Complete
              </>
            )}
          </Button>
          <Button variant="outline" asChild>
            <a
              href={`https://platform.claude.com/docs/en/managed-agents/overview`}
              target="_blank"
              rel="noopener"
            >
              <ExternalLink className="h-4 w-4" />
              Docs
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
