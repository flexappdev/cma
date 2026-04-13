# CMA — Claude Managed Agents

Claude Code instructions for the `~/APPS/cma` codebase.

## What This Repo Is

A complete reference implementation and learning system for **Claude Managed Agents** (public beta, April 2026):

| Component | Path | Purpose |
|-----------|------|---------|
| **Skill** | `.claude/skills/cma/SKILL.md` | Claude Code `/cma` skill — exam coach, quiz runner, app launcher |
| **App** | `app/` | Next.js 15 courses gallery (port 24202) |
| **Guide** | `docs/claude-architect-certification.md` | 7-module Claude Architect Certification guide |
| **Data** | `app/courses.json` | 12 seeded courses (filterable, searchable) |

## Key Facts

- App port: **24202**
- Start app: `cd app && npm run dev`
- TypeScript: strict mode, ES2017 target, `@/*` → `./src/*` aliases
- UI stack: Next.js 15 App Router, Tailwind CSS, shadcn/ui, Radix UI, Lucide icons
- Dark theme: zinc/slate palette, orange primary accent

## Architecture

```
app/src/
├── app/
│   ├── page.tsx              # Home — ModuleGrid (from lib/modules.ts)
│   ├── api/courses/route.ts  # Reads courses.json, returns paginated+filtered results
│   └── globals.css
├── components/
│   ├── AppHeader.tsx         # Search bar + stats
│   ├── AppFooter.tsx         # Fixed bottom bar
│   ├── LeftSidebar.tsx       # Collapsible nav (uses settings.navCollapsed)
│   ├── ShellWrapper.tsx      # Layout shell (Sidebar + main + Footer)
│   ├── ModuleGrid.tsx        # Course module grid
│   ├── ModuleCard.tsx        # Individual module card with progress ring
│   ├── LessonList.tsx        # Expandable lesson list inside a module
│   ├── CourseGallery.tsx     # Filterable course gallery (uses /api/courses)
│   ├── CourseCard.tsx        # Course card with completion toggle
│   ├── CourseLightbox.tsx    # Course detail modal
│   └── QuizCard.tsx          # Quiz question component
└── lib/
    ├── modules.ts            # All 7 modules with lessons (source of truth for the app)
    ├── types.ts              # Course, CourseFilters, CoursesResponse types
    ├── settings.tsx          # SettingsProvider + useSettings (accentColor, navCollapsed)
    ├── progress.tsx          # ProgressProvider + useProgress (localStorage completion tracking)
    └── utils.ts              # cn(), levelColor(), categoryColor(), formatRating(), formatStudents()
```

## Development

```bash
# Start app
cd app && npm run dev

# Type check
cd app && npx tsc --noEmit

# Build
cd app && npm run build
```

## Adding Courses

Edit `app/courses.json` — add an object to the `courses` array with:
```json
{
  "id": "unique-id",
  "slug": "url-friendly-slug",
  "title": "Course Title",
  "description": "...",
  "category": "AI Engineering|Tools|Architecture|Security|...",
  "level": "beginner|intermediate|advanced",
  "duration": "2h",
  "lessons": 8,
  "tags": ["tag1", "tag2"],
  "status": "published|draft|coming-soon",
  "instructor": "Name",
  "updated": "2026-04-12",
  "rating": 4.8,
  "students": 100
}
```

## Installing the Skill

```bash
mkdir -p ~/.claude/skills/cma
curl -o ~/.claude/skills/cma/SKILL.md \
  https://raw.githubusercontent.com/flexappdev/cma/main/.claude/skills/cma/SKILL.md
```

Then use `/cma` in any Claude Code session.

## Links

- Official docs: https://platform.claude.com/docs/en/managed-agents/overview
- Engineering blog: https://www.anthropic.com/engineering/managed-agents
- Launch post: https://claude.com/blog/claude-managed-agents
