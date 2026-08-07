# Agent Architecture Patterns from Codex, OpenClaw, Agent Zero, and Hermes

## Scope

This document extracts reusable architectural patterns from four public agent projects:

- `openai/codex`
- `openclaw/openclaw`
- `agent0ai/agent-zero`
- `NousResearch/hermes-agent`

It does not copy any implementation wholesale. It records cross-project principles that can be reused in other agent systems.

## 1. Separate the control plane from execution surfaces

OpenClaw explicitly separates a local Gateway from the Control UI, CLI, TUI, messaging channels, companion apps, and device nodes. This creates one session/tool/event authority with multiple clients.

Reusable principle:

```text
Control plane
  sessions
  tools
  events
  providers
  approvals
  routing

Execution surfaces
  terminal
  browser
  desktop
  messaging
  files
  remote nodes
```

Do not let each UI surface own its own independent agent lifecycle. Clients should connect to one authoritative runtime.

## 2. Keep agent identity independent from interface identity

Codex can appear as a terminal CLI, IDE integration, desktop app, and cloud agent. Hermes exposes CLI and messaging entry points through one gateway. Agent Zero keeps the same agent, projects, memory, and skills while extending onto a host machine through a connector.

Reusable principle:

- the agent/session identity must survive interface changes;
- UI, CLI, browser, and messaging clients are transports, not separate agents;
- session IDs, turn IDs, tool-call IDs, operation IDs, and target IDs must remain explicit.

## 3. Use capability registries rather than assumed tools

Hermes exposes tool configuration, toolsets, MCP integration, provider switching, and multiple terminal backends. OpenClaw separates tools, skills, and plugins. Agent Zero supports built-in tools, plugins, MCP, A2A, host connectors, and project-level configuration.

A tool registry should record at minimum:

```text
id
name
version
source
capability class
availability
health
permission level
approval requirement
input schema
output schema
timeout
reconnect policy
evidence type
```

A tool that is registered but unavailable must report unavailable with a reason. It must never silently remain selectable.

## 4. Treat skills as procedural memory

Codex stores reusable skills in `.codex/skills`. Hermes supports skill browsing, autonomous skill creation, self-improvement during use, and skills compatible with an open skill standard. Agent Zero supports skills pinned to work and plugins that add workflows.

Reusable principle:

- tools perform actions;
- skills define repeatable procedures;
- memory stores facts and prior outcomes;
- profiles define broader behavior;
- plugins add new runtime capabilities.

Do not merge these into one undifferentiated extension system.

## 5. Projects must isolate context and authority

Agent Zero projects isolate workspace files, instructions, memory, secrets, repositories, knowledge, and model presets. Hermes supports context files and cross-session recall. OpenClaw is designed for a single operator but still separates channels, sessions, tools, and gateway configuration.

A project boundary should define:

```text
workspace roots
allowed repositories
instructions
skills
memory namespace
secrets namespace
provider preset
browser targets
approval policy
evidence store
retention policy
```

Project switching must not leak memory, secrets, or active tool state.

## 6. Agent loops need interruption, redirection, and bounded recovery

Hermes supports interrupt-and-redirect, `/stop`, retry, undo, context compression, and bounded platform commands. Agent Zero allows user intervention in the shared desktop. Codex operates interactively in terminal and editor surfaces.

Reusable principle:

Every long-running agent operation needs:

- immediate stop;
- user redirection without spawning a second conflicting loop;
- bounded retry counts;
- explicit waiting states;
- approval-required states;
- resumable checkpoints only when identity and state are proven;
- terminal failure markers that cannot be mistaken for success.

## 7. Memory must be inspectable and purpose-specific

Hermes distinguishes persistent memory, user modeling, session search, summaries, and skill creation. Agent Zero separates projects, memory, skills, and profiles. This suggests a layered memory model:

```text
working context        current turn and immediate plan
session history        recent conversation and tool outcomes
project memory         durable project facts and constraints
user memory            stable user preferences and identity
procedural memory      skills and workflows
evidence memory        immutable receipts and artifacts
```

Memory writes should be attributable, reversible where appropriate, and visible to the user.

## 8. Multi-agent delegation requires isolation

Hermes and Agent Zero both support subordinate agents. The reusable pattern is not “more agents by default”; it is isolated contexts for focused workstreams.

Each subagent should receive:

- a bounded objective;
- explicit tools;
- explicit workspace scope;
- a time or step budget;
- a required return schema;
- no implicit authority to mutate shared state unless granted;
- a parent operation ID for traceability.

## 9. Deployment flexibility must not become configuration ambiguity

Hermes supports local, Docker, SSH, Singularity, Modal, Daytona, and Vercel Sandbox terminal backends. Agent Zero supports Docker and a host-machine bridge. OpenClaw supports local gateways and device nodes. Codex runs locally and also has editor, desktop, and cloud surfaces.

Reusable principle:

- transport and backend are configurable;
- health is runtime-proven;
- endpoints, ports, paths, and providers are not hardcoded;
- configuration precedence is explicit;
- the UI shows which backend is active now, not only what is configured.

## 10. Observability is part of the product

Agent Zero emphasizes transparent internals and visible agent actions. OpenClaw centralizes sessions, tools, and events. Hermes streams tool output and supports session search and insights. Codex exposes a visible terminal-oriented execution model.

A production agent should expose:

```text
current objective
current plan
current state
active tool
active target
approval state
last successful action
last failure reason
retry count
workspace changes
evidence receipts
session and operation identities
```

A green status means a verified capability, not merely a configured value.

## Source-specific strengths

### Codex

- local-first coding workflow;
- terminal, IDE, app, and cloud surfaces;
- repository-scoped skills;
- focused coding-agent interaction model.

### OpenClaw

- gateway-centered control plane;
- many messaging channels;
- device and companion-node architecture;
- provider, tools, skills, and plugin separation;
- strong warning to treat inbound messages as untrusted.

### Agent Zero

- full desktop and browser execution environment;
- project isolation;
- DOM annotation as an instruction surface;
- host-machine connector;
- multi-agent cooperation;
- inspectable prompts, tools, and configuration;
- workspace snapshots and recovery.

### Hermes

- persistent memory and skill learning loop;
- cross-session search and summarization;
- gateway-based messaging continuity;
- scheduled tasks;
- isolated subagents;
- configurable terminal backends;
- broad tool, MCP, provider, and model support.

## Design rule

Do not combine features merely because a reference project has them. Adopt a feature only when its authority boundary, lifecycle, user-facing state, evidence contract, and failure behavior are defined.