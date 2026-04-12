"use client";

import { useState, useEffect, useCallback } from "react";
import { Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/CourseCard";
import CourseLightbox from "@/components/CourseLightbox";
import type { Course, CoursesResponse, CourseFilters } from "@/lib/types";

const GRID_COLS = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

interface CourseGalleryProps {
  search: string;
  onTotalChange: (total: number, filtered: number) => void;
}

const defaultFilters: CourseFilters = {
  search: "",
  category: "",
  level: "",
  status: "",
  sort: "title",
};

export default function CourseGallery({ search, onTotalChange }: CourseGalleryProps) {
  const [data, setData] = useState<CoursesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CourseFilters>(defaultFilters);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Course | null>(null);

  const fetchCourses = useCallback(async (f: CourseFilters, p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (f.search) params.set("search", f.search);
      if (f.category) params.set("category", f.category);
      if (f.level) params.set("level", f.level);
      if (f.status) params.set("status", f.status);
      if (f.sort) params.set("sort", f.sort);
      params.set("page", p.toString());
      params.set("limit", "12");

      const res = await fetch(`/api/courses?${params}`);
      const json: CoursesResponse = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync external search prop into filters
  useEffect(() => {
    setFilters((prev) => ({ ...prev, search }));
    setPage(1);
  }, [search]);

  // Fetch on filter/page change
  useEffect(() => {
    fetchCourses(filters, page);
  }, [filters, page, fetchCourses]);

  // Report totals to parent
  useEffect(() => {
    if (data) {
      onTotalChange(data.pagination.total, data.pagination.total);
    }
  }, [data, onTotalChange]);

  const updateFilter = (key: keyof CourseFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ ...defaultFilters, search });
    setPage(1);
  };

  const hasActiveFilters = filters.category || filters.level || filters.status || filters.sort !== "title";
  const gridClass = GRID_COLS[3];

  return (
    <div className="flex flex-col gap-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground shrink-0" />

        <Select value={filters.category || "all"} onValueChange={(v) => updateFilter("category", v === "all" ? "" : v)}>
          <SelectTrigger className="h-8 w-40 text-xs bg-secondary border-0">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {data?.filters.categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.level || "all"} onValueChange={(v) => updateFilter("level", v === "all" ? "" : v)}>
          <SelectTrigger className="h-8 w-36 text-xs bg-secondary border-0">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.sort} onValueChange={(v) => updateFilter("sort", v)}>
          <SelectTrigger className="h-8 w-36 text-xs bg-secondary border-0">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title A–Z</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem>
            <SelectItem value="students">Most Popular</SelectItem>
            <SelectItem value="updated">Recently Updated</SelectItem>
            <SelectItem value="lessons">Most Lessons</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground" onClick={clearFilters}>
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}

        {data && (
          <span className="ml-auto text-xs text-muted-foreground">
            {data.pagination.total} courses
          </span>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className={`grid gap-4 ${gridClass}`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-16 w-full" />
              <div className="flex gap-1">
                {[1, 2, 3].map((j) => <Skeleton key={j} className="h-5 w-16 rounded-md" />)}
              </div>
              <Skeleton className="h-px w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : data?.courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <p className="text-lg font-medium">No courses found</p>
          <p className="text-sm mt-1">Try adjusting your filters or search</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className={`grid gap-4 ${gridClass}`}>
          {data?.courses.map((course) => (
            <CourseCard key={course.id} course={course} onClick={() => setSelected(course)} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {data.pagination.pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.pagination.pages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Lightbox */}
      <CourseLightbox course={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
