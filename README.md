# AMA — Anthropic Managed Agents

> **Agent · App · Certification** — A complete reference implementation and learning system for Claude Managed Agents (public beta, April 2026).

## Components

| Component | Path | Description |
|-----------|------|-------------|
| **Agent** | `/ama` (Claude Code skill) | Claude Code skill for building and operating managed agents |
| **App** | `/app` → `localhost:24202` | Next.js courses gallery — browse, filter, and track learning resources |
| **Guide** | [`/docs/claude-architect-certification.md`](./docs/claude-architect-certification.md) | 7-module Claude Architect Certification guide |

---

## What Are Claude Managed Agents?

Launched **April 8, 2026**, Claude Managed Agents is Anthropic's **pre-built agent harness on managed infrastructure**. It sits between your application and Claude, handling the operational complexity of running agents at scale.

```
Your App
   │
   ▼
┌─────────────────────────────────────────┐
│         Managed Agents API              │
│  ┌────────┐  ┌──────────┐  ┌────────┐  │
│  │ Agent  │  │ Session  │  │Environ-│  │
│  │(config)│  │(event    │  │ment    │  │
│  │        │  │ log)     │  │(sandbox│  │
│  └────────┘  └──────────┘  └────────┘  │
└─────────────────────────────────────────┘
   │
   ▼
 Claude (sonnet-4-6 / opus-4-6)
```

### Messages API vs Managed Agents

| | Messages API | Managed Agents |
|---|---|---|
| **What it is** | Direct model prompting | Pre-built agent harness on managed infra |
| **Best for** | Custom loops, fine-grained control | Long-running tasks, async work |
| **State mgmt** | You handle it | Anthropic handles it |
| **Sandboxing** | You provision | Managed container |
| **Fault tolerance** | You rebuild | Stateless harness, auto-resume |

---

## Four Core Concepts

```
AGENT        — model + system prompt + tools + MCP servers (defined once, reused)
ENVIRONMENT  — cloud container template (packages, networking, filesystem)
SESSION      — running agent instance; an append-only event log
EVENTS       — messages between your app and the agent (user turns, tool results)
```

---

## Quick Start

### CLI

```bash
# Install the Anthropic CLI
VERSION=1.0.0
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m | sed -e 's/x86_64/amd64/' -e 's/aarch64/arm64/')
curl -fsSL "https://github.com/anthropics/anthropic-cli/releases/download/v${VERSION}/ant_${VERSION}_${OS}_${ARCH}.tar.gz" \
  | sudo tar -xz -C /usr/local/bin ant

# macOS
brew install anthropics/tap/ant
```

### Python SDK (Minimal Example)

```python
from anthropic import Anthropic
client = Anthropic()

# 1. Define the agent (model + prompt + tools)
agent = client.beta.agents.create(
    name="Coding Assistant",
    model="claude-sonnet-4-6",
    system="You are a helpful coding assistant.",
    tools=[{"type": "agent_toolset_20260401"}],
)

# 2. Create an isolated container environment
environment = client.beta.environments.create(
    name="quickstart-env",
    config={"type": "cloud", "networking": {"type": "unrestricted"}},
)

# 3. Start a session (spins up a container)
session = client.beta.sessions.create(
    agent=agent.id,
    environment_id=environment.id,
    title="My first session",
)

# 4. Send a message and stream the response
with client.beta.sessions.events.stream(session.id) as stream:
    client.beta.sessions.events.send(
        session.id,
        events=[{
            "type": "user.message",
            "content": [{"type": "text", "text": "Write a hello world script in Python"}],
        }],
    )
    for event in stream:
        match event.type:
            case "agent.message":
                for block in event.content:
                    print(block.text, end="")
            case "agent.tool_use":
                print(f"\n[Tool: {event.name}]")
            case "session.status_idle":
                print("\n\nDone.")
                break
```

---

## API Cheatsheet

All requests require the beta header:
```
anthropic-beta: managed-agents-2026-04-01
```

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/v1/agents` | POST | Create agent |
| `/v1/environments` | POST | Create environment |
| `/v1/sessions` | POST | Start session |
| `/v1/sessions/:id/events` | POST | Send user event |
| `/v1/sessions/:id/stream` | GET | SSE stream |
| `/v1/sessions/:id/threads` | GET | List threads (multi-agent) |

### Rate Limits

| Operation | Limit |
|-----------|-------|
| Create endpoints | 60 req/min |
| Read endpoints | 600 req/min |

---

## Built-in Tools (`agent_toolset_20260401`)

| Tool | Description |
|------|-------------|
| `bash` | Execute shell commands |
| `read` | Read files from container |
| `write` | Write files to container |
| `edit` | String replacement in files |
| `glob` | File pattern matching |
| `grep` | Regex text search |
| `web_fetch` | Fetch a URL |
| `web_search` | Web search |

Disable individual tools:
```json
{
  "type": "agent_toolset_20260401",
  "configs": [{"name": "web_search", "enabled": false}]
}
```

---

## Multi-Agent Coordination (Research Preview)

```python
orchestrator = client.beta.agents.create(
    name="Engineering Lead",
    model="claude-sonnet-4-6",
    system="Coordinate work. Delegate code review to the reviewer agent.",
    tools=[{"type": "agent_toolset_20260401"}],
    callable_agents=[
        {"type": "agent", "id": reviewer.id, "version": reviewer.version},
        {"type": "agent", "id": tester.id, "version": tester.version},
    ],
)
```

Key constraints:
- All agents share the same container filesystem
- Each runs in its own thread with isolated conversation history
- One level of delegation only (coordinators cannot call further coordinators)

---

## Pricing

| Cost | Rate |
|------|------|
| Token costs | Standard Claude API rates |
| Infrastructure | **$0.08 / agent runtime hour** |
| Typical 4–6h session | ~$1.50–$3.50 total |

---

## Architecture: Why It's Fast

The harness, session, and sandbox are **decoupled**:
- Session = append-only event log (lives outside the harness)
- Harness = stateless loop (can crash and resume from last event)
- Sandbox = generic tool interface (isolated from credentials)

Performance gains vs. coupled architecture:
- **p50 time-to-first-token**: ~60% faster
- **p95 time-to-first-token**: >90% faster

---

## Pros & Cons

### Pros
- Eliminates months of infrastructure work (sandboxing, state mgmt, error recovery)
- Built-in observability via Claude Console
- Fault-tolerant: crashes resume automatically from last event
- Multi-language SDKs: Python, TypeScript, Java, Go, C#, Ruby, PHP
- Enterprise adopters deployed across departments in ~1 week

### Cons
- Claude-only — no AWS Bedrock or Google Vertex support
- No on-premise deployment; execution is Anthropic-cloud-only
- Multi-agent coordination and self-evaluation are research preview only
- One level of agent delegation maximum

---

## App — Courses Gallery

```bash
cd app
npm install
npm run dev
# → http://localhost:24202
```

Browse, filter, and track your Managed Agents learning path. Courses are indexed in `courses.json`.

---

## Certification Guide

See [`/docs/claude-architect-certification.md`](./docs/claude-architect-certification.md) — a 7-module certification guide covering:

1. Foundations & Core Concepts
2. Core API (Agents, Environments, Sessions, Events)
3. Built-in Tools
4. Custom Tools & MCP Integration
5. Multi-Agent Coordination
6. Security & Production Patterns
7. Certification Assessment (25 questions)

---

## Links

| Resource | URL |
|----------|-----|
| Docs overview | https://platform.claude.com/docs/en/managed-agents/overview |
| Quickstart | https://platform.claude.com/docs/en/managed-agents/quickstart |
| Tools reference | https://platform.claude.com/docs/en/managed-agents/tools |
| Environments | https://platform.claude.com/docs/en/managed-agents/environments |
| Multi-agent | https://platform.claude.com/docs/en/managed-agents/multi-agent |
| Engineering deep-dive | https://www.anthropic.com/engineering/managed-agents |
| Launch blog | https://claude.com/blog/claude-managed-agents |
| Research preview access | https://claude.com/form/claude-managed-agents |
| CLI releases | https://github.com/anthropics/anthropic-cli/releases |
