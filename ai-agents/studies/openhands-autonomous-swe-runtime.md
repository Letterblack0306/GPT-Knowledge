# OpenHands Study — Autonomous Software-Engineering Runtime

## Knowledge metadata

- Source project: `OpenHands/OpenHands` and OpenHands Software Agent SDK documentation
- Primary sources: official SDK architecture, agent loop, skills/context, settings, and agent-server documentation
- Last reviewed: 2026-08-07
- Confidence: high for documented SDK architecture
- Applies to: autonomous SWE agents, event-driven loops, workspace abstraction, tools, security analysis, remote execution, skills/context

## Why OpenHands is important

OpenHands is a strong reference for turning software-engineering work into an explicit runtime rather than an opaque prompt loop. Its current SDK documents a stateless, event-driven reasoning/action design with typed actions and observations, workspace abstraction, context management, security analysis, and remote agent-server execution.

## Reasoning-action loop

The documented agent loop is single-step and event-driven:

```text
event history
  -> pending confirmation check
  -> optional context condensation
  -> LLM query
  -> parse response
     -> message event
     -> action event(s)
  -> confirmation/security gate
  -> tool execution
  -> observation event(s)
  -> append to history
  -> next step
```

A key design property is that each step is atomic and the agent itself is intended to be stateless between steps. Durable truth lives in conversation/event state, not hidden mutable controller variables.

## Typed actions and observations

Tool invocation is represented as action events and results as observation events. This creates an auditable boundary between model intent and environment evidence.

Reusable rule:

```text
model text is not an action
an action request is not execution
execution is not validation
```

Typed events should preserve tool name, arguments, target/workspace identity, status, error details, timestamps, and linkage to the originating turn.

## Conversation as lifecycle authority

A production agent should keep conversation status explicit, for example:

```text
RUNNING
WAITING_FOR_CONFIRMATION
PAUSED
FAILED
FINISHED
```

The exact enum can differ, but waiting or blocked work must not be represented as ordinary conversational text. State should be machine-readable and resumable.

## Workspace abstraction

OpenHands separates the agent from where commands and file operations execute. Local, containerized, or remote workspaces can expose the same conceptual tools.

```text
agent
  -> typed tool contract
  -> workspace abstraction
     -> local
     -> container
     -> remote agent server
```

This allows execution placement to change without rewriting the reasoning loop.

Workspace identity must include enough evidence to prevent stale or wrong-target execution: root/path, repository identity when applicable, environment/session ID, and capability/health state.

## Agent server

The agent-server architecture exposes conversations, events, files, shell, desktop, and related execution services over authenticated APIs/WebSockets. This supports distributed or multi-user execution while preserving the same agent/runtime model.

Reusable principle: remote execution should be a transport change, not a change in semantic authority. Authentication, per-user/session isolation, health checks, and workspace identity must remain explicit.

## Security analysis and confirmation

OpenHands places security validation before execution and supports confirmation-required actions. This reinforces a layered gate:

```text
proposed action
  -> security/risk analysis
  -> policy/confirmation decision
  -> execution
  -> observation
```

Security classification should not be delegated solely to model prose. The runtime owns the gate.

## Context and skills

OpenHands distinguishes always-loaded repository context from triggered or progressively disclosed skills. It can load repository instruction files such as `AGENTS.md` and use AgentSkills-style `SKILL.md` packages.

This yields three useful context tiers:

```text
permanent repo context     small, always applicable rules
triggered context          loaded when task terms match
progressive skills         descriptions visible; full skill loaded on demand
```

Large procedures should not be permanently injected into every turn when progressive disclosure is possible.

## Structured agent configuration

OpenHands exposes serializable settings for model, tools, and optional subsystems. Treating configuration as validated data allows agents to be recreated consistently instead of relying on scattered imperative setup.

Recommended configurable identities:

```text
agent profile id
model/provider reference
toolset ids
workspace policy
context/skill set
condenser/context strategy
security/confirmation policy
```

## Completion

An autonomous SWE runtime needs a completion contract above the reasoning loop. "No more tool calls" is not sufficient.

Recommended completion check:

1. requested change is represented in source/diff;
2. relevant validations were selected for the changed subsystem;
3. validation commands/results are recorded;
4. required runtime behavior is exercised when feasible;
5. unresolved failures or skipped proof are surfaced explicitly;
6. final response references evidence rather than inferred success.

## Adopt

- stateless single-step agent logic over persistent event history;
- typed action/observation events;
- explicit conversation lifecycle state;
- workspace abstraction;
- remote agent server as execution transport;
- security and confirmation before tools run;
- progressive context/skills;
- serializable validated agent settings.

## Do not copy blindly

- a particular event schema without matching target tool semantics;
- remote execution complexity when local execution is sufficient;
- full desktop capability for tasks that only require files/shell;
- automatic completion based only on loop termination.

## Design takeaway

An autonomous software-engineering agent is best modeled as an event-driven runtime: history is the source of state, the model proposes typed actions, policy controls execution, workspaces provide tools, observations return evidence, and an explicit validation layer determines completion.

## Sources

- https://docs.openhands.dev/sdk/arch/agent
- https://docs.openhands.dev/sdk/arch/overview
- https://docs.openhands.dev/sdk/arch/sdk
- https://docs.openhands.dev/sdk/guides/skill
- https://docs.openhands.dev/sdk/guides/agent-settings
- https://github.com/OpenHands/OpenHands
