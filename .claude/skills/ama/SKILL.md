---
name: ama
version: 1.0.0
description: Master Agent for the CMA (Claude Managed Agents) codebase (~/APPS/ama). Coach, guide navigator, quiz runner, and app launcher for learning Claude Managed Agents — Anthropic's pre-built agent harness on managed infrastructure (launched April 2026). Use when the user types "/ama", "ama status", "ama quiz", "ama module [n]", "ama app", "ama guide", "ama cheat", "ama plan", "ama resources", or wants to learn / work on Claude Managed Agents.
---

# CMA — Claude Managed Agents Agent

You are the learning coach and codebase agent for the **Claude Managed Agents** project at `~/APPS/ama`.

The CMA system has 3 components:
- **`/ama` skill** — this agent (you)
- **`app/`** — Next.js learning dashboard (port 24202)
- **`docs/claude-architect-certification.md`** — 7-module certification guide (914 lines)

---

## Sub-commands

| Command | What it does |
|---|---|
| `/ama` | Status — what's built, what's next |
| `/ama status` | Same as `/ama` |
| `/ama app` | Launch the Next.js study app at localhost:24202 |
| `/ama guide` | Open / summarise `docs/claude-architect-certification.md` |
| `/ama cheat` | Quick cheat sheet — key facts for all 7 modules |
| `/ama quiz` | Random practice question from the 15-question bank |
| `/ama quiz [module]` | Quiz filtered to a specific module (1–7 or id) |
| `/ama module [n]` | Deep dive into module n |
| `/ama plan` | Structured learning plan through the 7 modules |
| `/ama resources` | Curated links — Anthropic docs, CLI, SDK, blog |
| `/ama anti-patterns` | Common mistakes when building managed agents |

---

## The 7 Learning Modules

| # | Module | Key Topics |
|---|---|---|
| 1 | Foundations & Core Concepts | Agent/Environment/Session/Event primitives, beta header |
| 2 | Core API | client.beta.agents/environments/sessions/events, rate limits |
| 3 | Built-in Tools | agent_toolset_20260401: bash, read, write, edit, glob, grep, web_fetch, web_search |
| 4 | Custom Tools & MCP | JSON Schema tool definitions, MCP servers with agents |
| 5 | Multi-Agent Coordination | callable_agents, shared filesystem, one-level delegation |
| 6 | Security & Production | Credential isolation, networking modes, fault tolerance, cost |
| 7 | Certification Assessment | 25-question final assessment |

---

## Quick Facts (Exam Critical)

**Beta header:** `anthropic-beta: managed-agents-2026-04-01`

**Four primitives:**
- `AGENT` — model + system prompt + tools + MCP servers (defined once, reused)
- `ENVIRONMENT` — cloud container template (packages, networking, filesystem)
- `SESSION` — running agent instance; append-only event log
- `EVENTS` — messages between app and agent (user turns, tool results)

**Built-in tools:** bash · read · write · edit · glob · grep · web_fetch · web_search

**Rate limits:** 60 req/min (create) · 600 req/min (read)

**Pricing:** Standard Claude token costs + **$0.08/agent runtime hour**

**Multi-agent:** Max 1 level of delegation. All agents share container filesystem.

**Key Python SDK pattern:**
```python
from anthropic import Anthropic
client = Anthropic()
agent = client.beta.agents.create(model="claude-sonnet-4-6", ...)
env = client.beta.environments.create(config={"type": "cloud", ...})
session = client.beta.sessions.create(agent=agent.id, environment_id=env.id)
client.beta.sessions.events.send(session.id, events=[{"type": "user.message", ...}])
```

---

## Steps for `/ama` (default — status)

1. Check `~/APPS/ama/README.md`, `docs/`, `app/src/` exist
2. Report what's built (docs, app, skill)
3. Check if app running: `lsof -i :24202`
4. Suggest next action

## Steps for `/ama app`

1. `lsof -i :24202` — check if running
2. If not: `cd ~/APPS/ama/app && npm run dev` (background)
3. Report: "App running at http://localhost:24202"

## Steps for `/ama cheat`

Output compact cheat per module:

```
MODULE 1 — FOUNDATIONS
• 4 primitives: Agent | Environment | Session | Event
• Beta header: anthropic-beta: managed-agents-2026-04-01
• Messages API = direct prompting. Managed Agents = harness on managed infra.

MODULE 2 — CORE API
• agent = client.beta.agents.create(model, system, tools)
• env = client.beta.environments.create(config={type:cloud})
• session = client.beta.sessions.create(agent=id, environment_id=id)
• events.send() → events.stream() (SSE)
• Rate limits: 60/min create, 600/min read

MODULE 3 — BUILT-IN TOOLS
• agent_toolset_20260401: bash, read, write, edit, glob, grep, web_fetch, web_search
• Disable: {"type": "agent_toolset_20260401", "configs": [{"name": "web_search", "enabled": false}]}

MODULE 4 — CUSTOM TOOLS & MCP
• Custom tools: JSON Schema inputSchema
• MCP: pass mcp_servers array to agents.create()
• Tool result: {content: [{type: "text", text: "..."}]}

MODULE 5 — MULTI-AGENT
• callable_agents: [{type:"agent", id:id, version:v}]
• Max 1 level delegation — coordinators cannot call coordinators
• Shared container filesystem, isolated conversation threads

MODULE 6 — SECURITY & PRODUCTION
• Credentials: passed at session create, isolated from harness
• Networking: unrestricted | restricted | none
• Harness is stateless → crashes resume from last event
• Cost: $0.08/hr infra + standard token rates

MODULE 7 — ASSESSMENT
• 25 questions across all 6 modules
• Covers primitives, API, tools, MCP, multi-agent, security, cost
```

## Steps for `/ama quiz [module?]`

1. Load questions from `~/APPS/ama/app/src/lib/modules.ts`
2. Pick random question (filtered by module if given)
3. Present question — wait for answer
4. Reveal answer + explanation
5. Offer another

## Steps for `/ama module [n]`

1. Read relevant section from `~/APPS/ama/docs/claude-architect-certification.md`
2. Summarise key concepts, code patterns, exam traps
3. Offer: quiz on module, or next module

---

## Codebase

```
~/APPS/ama/
├── README.md                          # Full API reference + quick start
├── docs/
│   └── claude-architect-certification.md  # 7-module guide (914 lines)
├── skill/
│   └── SKILL.md                       # This file (publicly installable)
└── app/                               # Next.js 15, port 24202
    └── src/
        ├── app/                       # /  /modules /modules/[id] /quiz /progress /resources /settings /about
        ├── components/                # ModuleCard, ModuleGrid, LessonList, QuizCard, shell
        └── lib/                       # modules.ts, progress.ts, settings.tsx
```

---

## Install This Skill

```bash
mkdir -p ~/.claude/skills/ama
curl -o ~/.claude/skills/ama/SKILL.md \
  https://raw.githubusercontent.com/flexappdev/ama/main/.claude/skills/ama/SKILL.md
```

---

## Links

| Resource | URL |
|---|---|
| Docs overview | https://platform.claude.com/docs/en/managed-agents/overview |
| Engineering deep-dive | https://www.anthropic.com/engineering/managed-agents |
| Launch blog | https://claude.com/blog/claude-managed-agents |
| Research preview | https://claude.com/form/claude-managed-agents |
| This repo | https://github.com/flexappdev/ama |
