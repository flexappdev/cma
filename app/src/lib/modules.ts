export interface Lesson {
  id: string;
  title: string;
  duration: string;
}

export interface Module {
  id: string;
  title: string;
  module: number;
  color: string;
  icon: string;
  description: string;
  lessons: Lesson[];
}

export const COLOR_MAP: Record<string, string> = {
  blue:   "#3b82f6",
  orange: "#f59e0b",
  purple: "#a855f7",
  teal:   "#14b8a6",
  pink:   "#ec4899",
  rose:   "#f43f5e",
  yellow: "#eab308",
};

export const MODULES: Module[] = [
  {
    id: "foundations",
    title: "Foundations & Core Concepts",
    module: 1,
    color: "blue",
    icon: "Layers",
    description: "What Managed Agents are, how they differ from the Messages API, and the four core primitives: Agent, Environment, Session, Event.",
    lessons: [
      { id: "what-are-managed-agents", title: "What Are Managed Agents?", duration: "15min" },
      { id: "messages-vs-managed", title: "Messages API vs Managed Agents", duration: "20min" },
      { id: "four-primitives", title: "The Four Primitives", duration: "25min" },
      { id: "architecture-overview", title: "Architecture Overview", duration: "20min" },
      { id: "beta-header", title: "Beta Header & SDK Setup", duration: "10min" },
    ],
  },
  {
    id: "core-api",
    title: "Core API: Agents, Environments, Sessions, Events",
    module: 2,
    color: "orange",
    icon: "Cpu",
    description: "Create and configure agents, provision environments, start sessions, and exchange events using the Python and TypeScript SDKs.",
    lessons: [
      { id: "create-agent", title: "Creating an Agent", duration: "20min" },
      { id: "environments", title: "Environments & Containers", duration: "25min" },
      { id: "sessions", title: "Starting & Managing Sessions", duration: "20min" },
      { id: "events", title: "Sending & Streaming Events", duration: "25min" },
      { id: "rate-limits", title: "Rate Limits & Quotas", duration: "10min" },
    ],
  },
  {
    id: "built-in-tools",
    title: "Built-in Tools",
    module: 3,
    color: "purple",
    icon: "Wrench",
    description: "The agent_toolset_20260401 bundle: bash, read, write, edit, glob, grep, web_fetch, web_search — and how to enable/disable individual tools.",
    lessons: [
      { id: "toolset-overview", title: "agent_toolset_20260401 Overview", duration: "15min" },
      { id: "filesystem-tools", title: "Filesystem Tools (read/write/edit/glob/grep)", duration: "20min" },
      { id: "web-tools", title: "Web Tools (fetch/search)", duration: "15min" },
      { id: "bash-tool", title: "Bash Tool", duration: "15min" },
      { id: "tool-config", title: "Enabling & Disabling Tools", duration: "10min" },
    ],
  },
  {
    id: "custom-tools-mcp",
    title: "Custom Tools & MCP Integration",
    module: 4,
    color: "teal",
    icon: "Plug",
    description: "Add your own tools via JSON Schema definitions and connect MCP servers to managed agents.",
    lessons: [
      { id: "custom-tool-schema", title: "Custom Tool JSON Schema", duration: "20min" },
      { id: "tool-result-format", title: "Tool Result Format", duration: "15min" },
      { id: "mcp-with-agents", title: "MCP Servers with Managed Agents", duration: "25min" },
      { id: "tool-error-handling", title: "Tool Error Handling", duration: "15min" },
    ],
  },
  {
    id: "multi-agent",
    title: "Multi-Agent Coordination",
    module: 5,
    color: "pink",
    icon: "Network",
    description: "Orchestrator/worker patterns, callable_agents config, shared filesystem, thread isolation, and the one-level delegation constraint.",
    lessons: [
      { id: "orchestrator-worker", title: "Orchestrator/Worker Pattern", duration: "20min" },
      { id: "callable-agents", title: "callable_agents Config", duration: "20min" },
      { id: "shared-filesystem", title: "Shared Filesystem & Thread Isolation", duration: "15min" },
      { id: "delegation-limits", title: "Delegation Constraints", duration: "10min" },
      { id: "multi-agent-example", title: "Full Multi-Agent Example", duration: "30min" },
    ],
  },
  {
    id: "security-production",
    title: "Security & Production Patterns",
    module: 6,
    color: "rose",
    icon: "Shield",
    description: "Credential isolation, networking modes, fault tolerance, stateless harness design, performance characteristics, and cost management.",
    lessons: [
      { id: "credential-isolation", title: "Credential Isolation", duration: "15min" },
      { id: "networking-modes", title: "Networking Modes", duration: "15min" },
      { id: "fault-tolerance", title: "Fault Tolerance & Auto-Resume", duration: "20min" },
      { id: "stateless-harness", title: "Stateless Harness Design", duration: "20min" },
      { id: "cost-management", title: "Pricing & Cost Management", duration: "15min" },
    ],
  },
  {
    id: "assessment",
    title: "Certification Assessment",
    module: 7,
    color: "yellow",
    icon: "GraduationCap",
    description: "25-question assessment covering all 6 modules. Pass to earn your Anthropic Managed Agents certification.",
    lessons: [
      { id: "module-1-review", title: "Module 1–2 Review", duration: "20min" },
      { id: "module-3-review", title: "Module 3–4 Review", duration: "20min" },
      { id: "module-5-review", title: "Module 5–6 Review", duration: "20min" },
      { id: "final-assessment", title: "Final Assessment (25 Qs)", duration: "45min" },
    ],
  },
];

export interface QuizQuestion {
  id: number;
  module: number;
  question: string;
  answer: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Module 1
  { id: 1,  module: 1, question: "What are the four core primitives of Managed Agents?", answer: "Agent, Environment, Session, Event" },
  { id: 2,  module: 1, question: "What beta header is required for all Managed Agents API requests?", answer: "anthropic-beta: managed-agents-2026-04-01" },
  { id: 3,  module: 1, question: "When should you use Managed Agents instead of the Messages API?", answer: "Long-running async tasks, when you need managed infrastructure, sandboxing, and fault tolerance" },
  // Module 2
  { id: 4,  module: 2, question: "What is a Session in Managed Agents?", answer: "A running agent instance with an append-only event log" },
  { id: 5,  module: 2, question: "What is the rate limit for create endpoints?", answer: "60 req/min" },
  { id: 6,  module: 2, question: "What SDK method starts a session?", answer: "client.beta.sessions.create()" },
  // Module 3
  { id: 7,  module: 3, question: "Name 4 built-in tools in agent_toolset_20260401", answer: "bash, read, write, edit, glob, grep, web_fetch, web_search (any 4)" },
  { id: 8,  module: 3, question: "How do you disable the web_search tool?", answer: "Set enabled: false in the tool configs array" },
  // Module 4
  { id: 9,  module: 4, question: "What format must custom tool schemas use?", answer: "JSON Schema" },
  { id: 10, module: 4, question: "How do you connect an MCP server to a managed agent?", answer: "Pass it in the mcp_servers array when creating the agent" },
  // Module 5
  { id: 11, module: 5, question: "What is the maximum delegation depth in multi-agent coordination?", answer: "One level — coordinators cannot call further coordinators" },
  { id: 12, module: 5, question: "Do sub-agents share the container filesystem?", answer: "Yes — all agents in a session share the same container filesystem" },
  { id: 13, module: 5, question: "What config key lists agents an orchestrator can call?", answer: "callable_agents" },
  // Module 6
  { id: 14, module: 6, question: "What is the infrastructure cost rate for Managed Agents?", answer: "$0.08 per agent runtime hour" },
  { id: 15, module: 6, question: "Why is the Managed Agents harness described as stateless?", answer: "The session is an append-only event log outside the harness — the harness can crash and resume from the last event" },
];

export const RESOURCES = [
  {
    title: "Managed Agents API Reference",
    url: "https://docs.anthropic.com/en/api/managed-agents",
    description: "Complete API reference for creating agents, environments, sessions, and events.",
    tag: "docs",
  },
  {
    title: "Python SDK — anthropic",
    url: "https://github.com/anthropics/anthropic-sdk-python",
    description: "Official Python SDK with beta.sessions, beta.agents support.",
    tag: "sdk",
  },
  {
    title: "TypeScript SDK — @anthropic-ai/sdk",
    url: "https://github.com/anthropics/anthropic-sdk-typescript",
    description: "Official TypeScript/Node SDK with Managed Agents support.",
    tag: "sdk",
  },
  {
    title: "Model Context Protocol (MCP)",
    url: "https://modelcontextprotocol.io",
    description: "Open protocol for connecting external tools and data sources to AI agents.",
    tag: "protocol",
  },
  {
    title: "Anthropic Cookbook — Agents",
    url: "https://github.com/anthropics/anthropic-cookbook",
    description: "Code examples and recipes for building production agent workflows.",
    tag: "examples",
  },
  {
    title: "Claude Model Overview",
    url: "https://docs.anthropic.com/en/docs/about-claude/models",
    description: "Latest Claude model IDs and capabilities for use in managed agent configs.",
    tag: "docs",
  },
];
