export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type CourseStatus = "published" | "draft" | "coming-soon";

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: CourseLevel;
  duration: string;
  lessons: number;
  tags: string[];
  status: CourseStatus;
  instructor: string;
  updated: string;
  rating: number;
  students: number;
}

export interface CoursesResponse {
  courses: Course[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: {
    categories: string[];
    levels: string[];
    tags: string[];
  };
}

export interface CourseFilters {
  search: string;
  category: string;
  level: string;
  status: string;
  sort: "title" | "rating" | "students" | "updated" | "lessons";
}
