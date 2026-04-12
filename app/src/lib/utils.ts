import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function levelColor(level: string): string {
  switch (level) {
    case "beginner":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "intermediate":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "advanced":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    default:
      return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
  }
}

export function categoryColor(category: string): string {
  const colors: Record<string, string> = {
    "AI Engineering": "bg-violet-500/20 text-violet-400 border-violet-500/30",
    "Tools": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    "Architecture": "bg-pink-500/20 text-pink-400 border-pink-500/30",
    "Security": "bg-red-500/20 text-red-400 border-red-500/30",
    "Infrastructure": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    "Cost Management": "bg-lime-500/20 text-lime-400 border-lime-500/30",
    "Enterprise": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    "Certification": "bg-amber-500/20 text-amber-400 border-amber-500/30",
    "DevOps": "bg-teal-500/20 text-teal-400 border-teal-500/30",
    "Developer Tools": "bg-sky-500/20 text-sky-400 border-sky-500/30",
  };
  return colors[category] ?? "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function formatStudents(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}
