# Claude Architect Certification Guide

> Master the Anthropic Managed Agents platform. 7 modules, 25 assessment questions, one certification.

**Target audience:** Engineers deploying production AI agents on Anthropic's managed infrastructure.
**Time to complete:** ~8 hours (10 POMs)
**Exam format:** 25 multiple-choice questions + 1 practical implementation task

---

## Module 1 — Foundations & Core Concepts

### What Are Claude Managed Agents?

Claude Managed Agents (launched April 8, 2026) is a **pre-built, configurable agent harness running on Anthropic's managed infrastructure**. It is not a model, not a no-code builder, and not a framework — it is a managed layer that handles the operational complexity of running agents at scale.

The key contrast:

| | Messages API | Managed Agents |
|---|---|---|
| What it is | Direct model call | Pre-built harness on managed infra |
| Best for | Custom loops, fine-grained control | Long-running tasks, async work |
| State management | You build it | Anthropic handles it |
| Sandboxing | You provision | Isolated cloud container |
| Fault tolerance | You rebuild on crash | Stateless harness, auto-resume |

### The Four Building Blocks

Every managed agent system consists of exactly four composable primitives:

```
┌─────────────────────────────────────────────────────────┐
│                  AGENT                                  │
│  model + system prompt + tools + MCP servers            │
│  Defined once, versioned, reused across sessions        │
└─────────────────────────────────────────────────────────┘
                        │ references
┌─────────────────────────────────────────────────────────┐
│                 ENVIRONMENT                             │
│  Cloud container template                               │
│  Pre-installed packages, networking rules, filesystem   │
└─────────────────────────────────────────────────────────┘
                        │ instantiates
┌─────────────────────────────────────────────────────────┐
│                   SESSION                               │
│  Running agent instance                                 │
│  Append-only event log — persists outside the harness   │
└─────────────────────────────────────────────────────────┘
                        │ exchanges
┌─────────────────────────────────────────────────────────┐
│                    EVENTS                               │
│  user.message, agent.message, agent.tool_use,           │
│  session.status_idle, session.thread_created, ...       │
└─────────────────────────────────────────────────────────┘
```

### Decoupled Architecture (Why It's Fast)

Anthropic decoupled three previously coupled components:

1. **Session** — Append-only event log. Lives outside the harness so nothing is lost on harness crash.
2. **Harness** — The agent loop (calls Claude, routes tool calls). **Stateless.** Can crash and resume via `wake(sessionId)`.
3. **Sandbox** — Execution environment for code. Treated as a generic tool interface: `execute(name, input) → string`.

**Performance gains from decoupling:**
- p50 time-to-first-token: **~60% faster**
- p95 time-to-first-token: **>90% faster**

### Module 1 Key Points

- Managed Agents is infrastructure, not a model
- Four primitives: Agent, Environment, Session, Events
- Decoupled design gives crash-resilience and dramatic latency improvements
- Required beta header: `anthropic-beta: managed-agents-2026-04-01`

---

## Module 2 — Core API: Agents, Environments, Sessions, Events

### Required Header

All API requests must include:
```
anthropic-beta: managed-agents-2026-04-01
```
The official SDKs set this automatically.

### 2.1 Creating an Agent

An agent is a **reusable, versioned configuration** — not a running process.

```python
from anthropic import Anthropic
client = Anthropic()

agent = client.beta.agents.create(
    name="Data Analyst",
    model="claude-sonnet-4-6",
    system="""You are an expert data analyst. When given data tasks:
    1. Plan your approach before executing
    2. Validate results before returning
    3. Produce clean, documented outputs""",
    tools=[{"type": "agent_toolset_20260401"}],
)
print(agent.id)    # agt_XXXX
print(agent.version)  # 1
```

**Key agent properties:**
- `id` — permanent identifier
- `version` — increments on every update
- `model` — recommend `claude-sonnet-4-6` for most tasks
- `system` — the most impactful lever for agent behavior

### 2.2 Creating an Environment

Environments are **container templates**. Each session spawns a fresh isolated instance from the template.

```python
environment = client.beta.environments.create(
    name="data-science-env",
    config={
        "type": "cloud",
        "packages": {
            "pip": ["pandas", "numpy", "scikit-learn", "matplotlib"],
        },
        "networking": {"type": "unrestricted"},
    },
)
print(environment.id)  # env_XXXX
```

**Package managers supported:** `apt`, `cargo`, `gem`, `go`, `npm`, `pip`
**Packages are cached** across sessions sharing the same environment — you pay the install cost once.

**Environment lifecycle:**
- `active` → can create new sessions
- `archived` → read-only, existing sessions continue
- `deleted` → only possible if no sessions reference it

### 2.3 Starting a Session

A session **instantiates** your environment and begins the agent harness loop.

```python
session = client.beta.sessions.create(
    agent=agent.id,
    environment_id=environment.id,
    title="Q3 Sales Analysis",
)
print(session.id)  # ses_XXXX
```

Sessions are **isolated** — each gets its own container with a clean filesystem.

### 2.4 Sending Events and Streaming

The event system is SSE (server-sent events). Open the stream **before** sending the first event.

```python
with client.beta.sessions.events.stream(session.id) as stream:
    # Send user message
    client.beta.sessions.events.send(
        session.id,
        events=[{
            "type": "user.message",
            "content": [{"type": "text", "text": "Analyze sales_q3.csv"}],
        }],
    )
    # Process events
    for event in stream:
        match event.type:
            case "agent.message":
                for block in event.content:
                    if hasattr(block, "text"):
                        print(block.text, end="", flush=True)
            case "agent.tool_use":
                print(f"\n[Tool: {event.name}({event.input})]")
            case "agent.tool_result":
                print(f"[Result: {str(event.content)[:100]}]")
            case "session.status_idle":
                print("\n\nSession complete.")
                break
            case "session.status_error":
                print(f"\nError: {event.error}")
                break
```

### Key Event Types

| Event Type | Description |
|------------|-------------|
| `user.message` | Your application sends a message |
| `agent.message` | Claude's text response |
| `agent.tool_use` | Claude is calling a tool |
| `agent.tool_result` | Tool execution result |
| `session.status_idle` | Agent finished, waiting for input |
| `session.status_error` | Agent encountered an error |
| `session.thread_created` | Multi-agent: new thread spawned |
| `session.thread_idle` | Multi-agent: a thread completed |

### Mid-Session Steering

Send additional events during execution to redirect the agent:

```python
# Agent is running — interrupt and redirect
client.beta.sessions.events.send(
    session.id,
    events=[{
        "type": "user.message",
        "content": [{"type": "text", "text": "Focus on Q3 only, skip the Q2 comparison"}],
    }],
)
```

### API Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/v1/agents` | POST | Create agent |
| `/v1/agents/:id` | GET | Retrieve agent |
| `/v1/environments` | POST | Create environment |
| `/v1/environments/:id` | GET | Retrieve environment |
| `/v1/sessions` | POST | Start session |
| `/v1/sessions/:id/events` | POST | Send events |
| `/v1/sessions/:id/stream` | GET | SSE stream |
| `/v1/sessions/:id/threads` | GET | List threads |

### Rate Limits

| Operation | Limit |
|-----------|-------|
| Create endpoints | 60 req/min |
| Read/stream endpoints | 600 req/min |

---

## Module 3 — Built-in Tools (`agent_toolset_20260401`)

### The Toolset

Enabling `{"type": "agent_toolset_20260401"}` gives the agent access to 8 built-in tools:

| Tool | Name | Description |
|------|------|-------------|
| Bash | `bash` | Execute shell commands in the container |
| Read | `read` | Read files from the container filesystem |
| Write | `write` | Write files to the container filesystem |
| Edit | `edit` | Exact string replacement in files |
| Glob | `glob` | File pattern matching (`**/*.py`) |
| Grep | `grep` | Regex content search |
| Web Fetch | `web_fetch` | Fetch content from a URL |
| Web Search | `web_search` | Search the web |

### Disable Specific Tools

```json
{
  "type": "agent_toolset_20260401",
  "configs": [
    {"name": "web_fetch", "enabled": false},
    {"name": "web_search", "enabled": false}
  ]
}
```

### Allowlist Mode (Enable Only Specific Tools)

```json
{
  "type": "agent_toolset_20260401",
  "default_config": {"enabled": false},
  "configs": [
    {"name": "bash", "enabled": true},
    {"name": "read", "enabled": true},
    {"name": "write", "enabled": true}
  ]
}
```

Use allowlist mode for **security-sensitive production deployments**.

### Context Management Beyond the Window

Long-horizon tasks can exceed Claude's context window. The `getEvents()` interface on sessions supports:
- Retrieving sequential event slices
- Rewinding before specific moments
- Harness-side transformations before events reach Claude (for cache optimization)

---

## Module 4 — Custom Tools & MCP Integration

### Defining Custom Tools

Custom tools are **executed by your application**, not by the container. Claude calls them; you implement the logic.

```python
agent = client.beta.agents.create(
    name="Weather Research Agent",
    model="claude-sonnet-4-6",
    system="You research weather patterns and generate reports.",
    tools=[
        {"type": "agent_toolset_20260401"},
        {
            "type": "custom",
            "name": "get_weather",
            "description": """Retrieves current weather data for a given city.
            Returns temperature (Celsius), humidity percentage, wind speed (km/h),
            and a text description of conditions. Use this tool whenever the user
            asks about current weather or recent conditions in any location.""",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City name, optionally with country code (e.g. 'London, UK')"
                    },
                    "units": {
                        "type": "string",
                        "enum": ["metric", "imperial"],
                        "description": "Unit system for temperature and wind speed"
                    }
                },
                "required": ["location"],
            },
        },
    ],
)
```

### Handling Custom Tool Calls in the Stream

```python
with client.beta.sessions.events.stream(session.id) as stream:
    client.beta.sessions.events.send(session.id, events=[...])

    for event in stream:
        if event.type == "agent.tool_use" and event.name == "get_weather":
            # Execute the tool in your application
            result = call_weather_api(event.input["location"])
            # Return result to the agent
            client.beta.sessions.events.send(
                session.id,
                events=[{
                    "type": "tool_result",
                    "tool_use_id": event.id,
                    "content": [{"type": "text", "text": str(result)}],
                }],
            )
```

### Best Practices for Custom Tool Design

1. **Write detailed descriptions** — 3-4+ sentences per tool. This is the single most important factor in tool performance.
2. **Consolidate related operations** — One `pr_manager` tool with an `action` parameter beats separate `create_pr`, `review_pr`, `merge_pr` tools.
3. **Use meaningful namespacing** — `db_query`, `storage_read`, `cache_invalidate`.
4. **Return high-signal responses** — Avoid bloated tool responses that waste context window.
5. **Never expose credentials in tool responses** — Use the secure vault pattern instead.

### MCP (Model Context Protocol) Integration

```python
agent = client.beta.agents.create(
    name="GitHub Agent",
    model="claude-sonnet-4-6",
    system="Manage GitHub repositories and pull requests.",
    tools=[{"type": "agent_toolset_20260401"}],
    mcp_servers=[
        {
            "type": "url",
            "url": "https://mcp.github.com",
            "name": "github",
            "authorization_token": os.environ["GITHUB_MCP_TOKEN"],
        }
    ],
)
```

---

## Module 5 — Multi-Agent Coordination

> **Status:** Research Preview — requires separate access request at https://claude.com/form/claude-managed-agents

### Architecture

```
Your App
   │
   ▼
┌──────────────────────────────────────────────┐
│         Coordinator / Orchestrator           │
│         (Engineering Lead Agent)             │
│                                              │
│  ┌──────────────┐    ┌──────────────────┐   │
│  │ Code Reviewer │    │ Test Writer Agent │   │
│  │ Agent Thread  │    │ Thread           │   │
│  └──────────────┘    └──────────────────┘   │
└──────────────────────────────────────────────┘
```

**Key properties:**
- All agents share the same container and filesystem
- Each agent has its own **thread** with isolated conversation history
- One level of delegation only — subagents cannot call further agents
- Threads are persistent — coordinators can send follow-ups

### Declaring Callable Agents

```python
# First, create the subagents
reviewer = client.beta.agents.create(
    name="Code Reviewer",
    model="claude-sonnet-4-6",
    system="""You are a senior code reviewer. For each PR:
    1. Check for security vulnerabilities
    2. Verify test coverage
    3. Review code style and maintainability
    4. Return a structured review with APPROVE/REQUEST_CHANGES decision""",
    tools=[{
        "type": "agent_toolset_20260401",
        "default_config": {"enabled": False},
        "configs": [{"name": "read", "enabled": True}, {"name": "grep", "enabled": True}],
    }],
)

tester = client.beta.agents.create(
    name="Test Writer",
    model="claude-sonnet-4-6",
    system="You write comprehensive unit and integration tests.",
    tools=[{"type": "agent_toolset_20260401"}],
)

# Then create the orchestrator with callable_agents
orchestrator = client.beta.agents.create(
    name="Engineering Lead",
    model="claude-sonnet-4-6",
    system="""You coordinate engineering work.
    - Delegate code reviews to the Code Reviewer agent
    - Delegate test writing to the Test Writer agent
    - Synthesize their outputs before responding to the user""",
    tools=[{"type": "agent_toolset_20260401"}],
    callable_agents=[
        {"type": "agent", "id": reviewer.id, "version": reviewer.version},
        {"type": "agent", "id": tester.id, "version": tester.version},
    ],
)
```

### Multi-Agent Event Types

| Event Type | Description |
|------------|-------------|
| `session.thread_created` | Coordinator spawned a new thread |
| `session.thread_idle` | An agent thread finished its task |
| `agent.thread_message_sent` | An agent sent a message to another thread |
| `agent.thread_message_received` | An agent received a message from another thread |

### Streaming Multi-Agent Sessions

```python
with client.beta.sessions.events.stream(session.id) as stream:
    # Also stream subagent threads
    threads = client.beta.sessions.threads.list(session.id)

    for event in stream:
        match event.type:
            case "session.thread_created":
                print(f"Spawned thread: {event.thread_id} ({event.agent_name})")
            case "session.thread_idle":
                print(f"Thread done: {event.thread_id}")
            case "agent.message":
                for block in event.content:
                    print(block.text, end="")
            case "session.status_idle":
                break
```

### Best Use Cases for Delegation

| Use Case | Subagent Role | Why Delegate |
|----------|--------------|--------------|
| Code review | Reviewer with read-only tools | Focused system prompt, no write access |
| Test generation | Tester with bash/write | Isolated context, won't touch prod code |
| Web research | Searcher with web tools only | Parallel execution, bounded scope |
| Data validation | Validator with grep/read | Isolated reasoning, auditable decision |

---

## Module 6 — Security & Production Patterns

### Least-Privilege Networking

**Development:**
```python
config = {"type": "cloud", "networking": {"type": "unrestricted"}}
```

**Production:**
```python
config = {
    "type": "cloud",
    "networking": {
        "type": "limited",
        "allowed_hosts": ["api.yourservice.com", "s3.amazonaws.com"],
        "allow_mcp_servers": True,
        "allow_package_managers": False,  # Lock down in production
    },
}
```

### Credential Security: The Vault Pattern

**Never pass credentials through the session/sandbox.** Generated code runs in the sandbox — if credentials are in the conversation, prompt injection attacks can exfiltrate them.

**Pattern 1 — Bundled Authentication:**
```python
# Credentials attach to resources at sandbox init
environment = client.beta.environments.create(
    name="secure-env",
    config={
        "type": "cloud",
        "resources": [{
            "type": "git_repo",
            "url": "https://github.com/org/repo",
            "auth": {"type": "token", "token": os.environ["GITHUB_TOKEN"]},
        }],
        "networking": {"type": "limited", "allowed_hosts": ["github.com"]},
    },
)
```

**Pattern 2 — Secure Vault + Proxy:**
```
Claude → calls get_pr_comments tool
           → your proxy authenticates with stored OAuth token
           → proxy calls GitHub API
           → returns result to Claude (no token in conversation)
```

### Prompt Injection Defense

1. **Use allowlist toolsets** — limit to only the tools the agent needs
2. **Limited networking** — block unexpected outbound requests
3. **Separate credential store** — credentials never pass through the sandbox
4. **Audit session events** — the complete event log is visible in Claude Console
5. **System prompt hardening** — explicitly instruct the agent to ignore instructions in content it reads

### Production Checklist

```
[ ] Use limited networking with explicit allowed_hosts
[ ] Use allowlist toolset (default_config: {enabled: false})
[ ] Store credentials in vault, not in session events
[ ] Set org-level spend limits in Claude Console
[ ] Monitor via Console session traces
[ ] Handle session.status_error events in your stream handler
[ ] Implement exponential backoff for rate limit (429) errors
[ ] Version-pin your agents (use agent.version in callable_agents)
[ ] Archive (not delete) environments when rotating
[ ] Use session title for audit trail identification
```

### Error Handling

```python
import time

def run_session_with_retry(client, session_id, message, max_retries=3):
    for attempt in range(max_retries):
        try:
            with client.beta.sessions.events.stream(session_id) as stream:
                client.beta.sessions.events.send(
                    session_id,
                    events=[{"type": "user.message", "content": [{"type": "text", "text": message}]}],
                )
                for event in stream:
                    if event.type == "agent.message":
                        for block in event.content:
                            yield block.text
                    elif event.type == "session.status_idle":
                        return
                    elif event.type == "session.status_error":
                        raise RuntimeError(f"Agent error: {event.error}")
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
                continue
            raise
```

### Cost Management

| Lever | Impact |
|-------|--------|
| Set org spend limits | Hard cap |
| Use `limited` networking | Prevents runaway web calls |
| Enable only needed tools | Reduces tool-use tokens |
| Detailed system prompt | Fewer retry loops = fewer tokens |
| Session titles | Easier cost attribution |

---

## Module 7 — Certification Assessment

### 25 Certification Questions

**Section A: Foundations (Q1–5)**

**Q1.** Which of the following best describes Claude Managed Agents?
- A) A new Claude model optimized for agentic tasks
- B) A no-code agent builder in the Claude Console
- C) A pre-built agent harness on managed infrastructure
- D) A fine-tuning API for Claude

**Answer: C** — It is infrastructure that runs your agents, not a model or builder.

---

**Q2.** Which beta header is required for all Managed Agents API requests?
- A) `anthropic-beta: agents-2025-01-01`
- B) `anthropic-beta: managed-agents-2026-04-01`
- C) `anthropic-version: managed-2026`
- D) No beta header required

**Answer: B**

---

**Q3.** In the decoupled architecture, what does the "session" represent?
- A) A running container with CPU and RAM allocated
- B) An append-only event log that persists outside the harness
- C) The inference call to Claude
- D) The sandbox execution environment

**Answer: B** — The session is the event log. This is why it survives harness crashes.

---

**Q4.** What is the primary performance benefit of the decoupled harness/sandbox design?
- A) Lower token costs
- B) Unlimited context window
- C) p95 time-to-first-token improved by >90%
- D) No rate limits

**Answer: C**

---

**Q5.** Which of the following is NOT a core primitive in Managed Agents?
- A) Agent
- B) Environment
- C) Session
- D) Model

**Answer: D** — Model is a property of an Agent, not a standalone primitive.

---

**Section B: API & Tools (Q6–12)**

**Q6.** What happens when you create an environment?
- A) A container immediately starts running
- B) A reusable container template is registered; containers spawn per session
- C) A Claude model is reserved exclusively for your organization
- D) Package installation begins immediately

**Answer: B** — Environments are templates. Containers spawn when sessions are created.

---

**Q7.** What is the correct order of operations to run a managed agent?
- A) Session → Environment → Agent → Events
- B) Agent → Session → Environment → Events
- C) Agent → Environment → Session → Events
- D) Environment → Session → Agent → Events

**Answer: C** — Define the agent, create the environment template, start a session, then send events.

---

**Q8.** To use only the `bash`, `read`, and `write` tools (blocking all others), you should:
- A) List only those three tools in `configs`
- B) Set `default_config: {enabled: false}` and list only the three in `configs`
- C) Create three separate agent definitions
- D) Set `networking.type: limited`

**Answer: B** — Allowlist mode requires setting default to disabled, then explicitly enabling desired tools.

---

**Q9.** A custom tool call appears in the stream as `agent.tool_use`. Your application must respond with:
- A) A new `user.message` event
- B) A `tool_result` event containing the `tool_use_id` and result content
- C) A new session creation
- D) No response is needed

**Answer: B**

---

**Q10.** Which package managers are supported in environment configs?
- A) pip, npm, apt only
- B) pip, npm, apt, cargo, gem, go
- C) pip, conda, npm, yarn
- D) All POSIX package managers

**Answer: B**

---

**Q11.** What is the recommended approach when the agent's task will exceed the context window?
- A) Split into multiple separate agent definitions
- B) Increase the `max_tokens` limit on session creation
- C) Use `getEvents()` with sequential event slices and harness-side context engineering
- D) Switch to a model with a larger context window

**Answer: C** — The session as context object pattern handles window overflow.

---

**Q12.** What rate limit applies to the `/v1/sessions` (POST) endpoint?
- A) 600 requests/minute
- B) 6 requests/minute
- C) 60 requests/minute
- D) Unlimited

**Answer: C** — Create endpoints = 60 req/min. Read endpoints = 600 req/min.

---

**Section C: Security (Q13–17)**

**Q13.** What is the "secure vault pattern" in the context of credential management?
- A) Encrypting credentials in the session event log
- B) Storing credentials in environment variables in the container
- C) Storing OAuth tokens in an external vault; having Claude call tools via a proxy that authenticates before external calls
- D) Using Anthropic's built-in credential manager

**Answer: C**

---

**Q14.** Which networking mode should be used in production for security-sensitive deployments?
- A) `unrestricted`
- B) `sandboxed`
- C) `limited` with explicit `allowed_hosts`
- D) `air-gapped`

**Answer: C**

---

**Q15.** Why should credentials never pass through the sandbox environment?
- A) Containers don't support environment variables
- B) Generated code runs in the sandbox; prompt injection could exfiltrate credentials from the conversation
- C) Anthropic's terms of service prohibit it
- D) The sandbox doesn't have network access

**Answer: B** — This is the core security concern for code-executing agents.

---

**Q16.** The "bundled authentication" credential pattern works by:
- A) Asking the user to input credentials during the session
- B) Embedding credentials in the system prompt
- C) Attaching auth tokens to resources at sandbox initialization time
- D) Using the agent's built-in OAuth flow

**Answer: C**

---

**Q17.** To harden an agent against prompt injection from external content it reads, you should:
- A) Disable the `read` tool
- B) Include explicit instructions in the system prompt to ignore instructions found in content
- C) Use a separate model for reading external content
- D) Limit sessions to 10 minutes

**Answer: B** — Multiple defenses in depth; system prompt hardening is the primary control.

---

**Section D: Multi-Agent (Q18–22)**

**Q18.** In multi-agent coordination, what does each agent thread have?
- A) Its own container instance
- B) Its own model version
- C) Its own conversation history and tools, but shared filesystem with other agents
- D) Its own API key

**Answer: C**

---

**Q19.** What is the maximum depth of agent delegation?
- A) Unlimited
- B) 5 levels
- C) 2 levels
- D) 1 level (coordinators can call agents, but those agents cannot call further agents)

**Answer: D**

---

**Q20.** Which event fires when the coordinator spawns a new subagent thread?
- A) `agent.delegate_start`
- B) `session.thread_created`
- C) `agent.spawn`
- D) `session.fork`

**Answer: B**

---

**Q21.** When is multi-agent coordination most beneficial?
- A) When you need the agent to respond in under 1 second
- B) For tasks that benefit from parallel execution with isolated context per subtask
- C) When you want to reduce token costs
- D) For simple question-answering

**Answer: B**

---

**Q22.** Which capability is currently in Research Preview and requires separate access?
- A) Custom tools
- B) MCP server integration
- C) Multi-agent coordination and persistent memory
- D) Limited networking

**Answer: C**

---

**Section E: Architecture & Production (Q23–25)**

**Q23.** An enterprise team with strict data residency requirements for EU-based data should:
- A) Use the `limited` networking mode to keep data in the EU region
- B) Use the `data_residency: eu` flag in environment config
- C) Carefully evaluate whether Managed Agents is appropriate, as execution occurs on Anthropic's cloud only
- D) Configure the session with a VPC peering connection

**Answer: C** — Managed Agents executes on Anthropic's cloud. This is a known limitation.

---

**Q24.** The infrastructure cost for Managed Agents is:
- A) Included in token costs
- B) $0.08 per agent runtime hour, on top of standard token rates
- C) $0.80 per session
- D) Free during beta

**Answer: B**

---

**Q25.** A session's harness crashes mid-execution. What happens?
- A) The session is lost and must be restarted from scratch
- B) The harness calls `wake(sessionId)`, retrieves the session's event log, and resumes from the last persisted event
- C) Anthropic automatically retries the last tool call
- D) The session enters a locked error state

**Answer: B** — The decoupled design makes the harness stateless and crash-resilient.

---

### Practical Implementation Task

**Task:** Build a code review agent that:
1. Creates an agent with a code reviewer persona and read-only toolset (grep + read only)
2. Creates an environment with Python 3.11 and the `ast` package
3. Starts a session, uploads a Python file to the container, and requests a review
4. Streams the review output and extracts: severity level, issues found, recommendation
5. Handles session.status_error gracefully with retry logic

**Evaluation criteria:**
- Correct agent toolset configuration (allowlist mode, read/grep only)
- Secure credential handling (no secrets in session events)
- Correct event loop with proper SSE handling
- Error handling and retry with exponential backoff
- Clean output parsing

---

## Certification Scoring

| Score | Level |
|-------|-------|
| 23–25 + practical pass | **Claude Certified Architect** |
| 20–22 + practical pass | **Claude Certified Developer** |
| 17–19 | **Claude Agent Associate** |
| Below 17 | Review modules and retake |

---

## Resources

| Resource | URL |
|----------|-----|
| Official Docs | https://platform.claude.com/docs/en/managed-agents/overview |
| Quickstart | https://platform.claude.com/docs/en/managed-agents/quickstart |
| Tools Reference | https://platform.claude.com/docs/en/managed-agents/tools |
| Environments | https://platform.claude.com/docs/en/managed-agents/environments |
| Multi-Agent | https://platform.claude.com/docs/en/managed-agents/multi-agent |
| Engineering Deep-Dive | https://www.anthropic.com/engineering/managed-agents |
| Launch Blog | https://claude.com/blog/claude-managed-agents |
| Research Preview Access | https://claude.com/form/claude-managed-agents |

---

*Claude Architect Certification Guide — AMA project — April 2026*
