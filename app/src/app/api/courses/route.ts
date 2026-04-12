import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import type { Course } from "@/lib/types";

function loadCourses(): Course[] {
  const file = join(process.cwd(), "courses.json");
  const data = JSON.parse(readFileSync(file, "utf-8"));
  return data.courses as Course[];
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase() ?? "";
  const category = searchParams.get("category") ?? "";
  const level = searchParams.get("level") ?? "";
  const status = searchParams.get("status") ?? "";
  const sort = searchParams.get("sort") ?? "title";
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "12", 10);

  let courses = loadCourses();

  // Build filter lists from full dataset
  const allCategories = Array.from(new Set(courses.map((c) => c.category))).sort();
  const allLevels = ["beginner", "intermediate", "advanced"];
  const allTags = Array.from(new Set(courses.flatMap((c) => c.tags))).sort();

  // Apply filters
  if (search) {
    courses = courses.filter(
      (c) =>
        c.title.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search) ||
        c.tags.some((t) => t.includes(search))
    );
  }
  if (category) courses = courses.filter((c) => c.category === category);
  if (level) courses = courses.filter((c) => c.level === level);
  if (status) courses = courses.filter((c) => c.status === status);

  // Sort
  courses.sort((a, b) => {
    switch (sort) {
      case "rating":
        return b.rating - a.rating;
      case "students":
        return b.students - a.students;
      case "updated":
        return b.updated.localeCompare(a.updated);
      case "lessons":
        return b.lessons - a.lessons;
      default:
        return a.title.localeCompare(b.title);
    }
  });

  const total = courses.length;
  const pages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginated = courses.slice(offset, offset + limit);

  return NextResponse.json({
    courses: paginated,
    pagination: { page, limit, total, pages },
    filters: { categories: allCategories, levels: allLevels, tags: allTags },
  });
}
