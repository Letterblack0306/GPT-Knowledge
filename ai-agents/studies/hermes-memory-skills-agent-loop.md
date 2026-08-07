# Hermes Agent Study — Agent Loop, Memory, Skills, and Persistent Operation

## Knowledge metadata

- Source project: `NousResearch/hermes-agent`
- Primary sources: official Hermes documentation and repository feature/reference docs
- Last reviewed: 2026-08-07
- Confidence: high for documented behavior
- Applies to: persistent agents, skills, memory, toolsets, delegation, context discovery, messaging continuity

## Why Hermes is important

Hermes is a strong reference for an agent that is more than a one-shot coding command. Its reusable patterns concern persistent identity, bounded memory, progressive skill loading, broad tool registration, project context discovery, checkpoints, delegation, and multiple interaction surfaces.

## Agent capability composition

Hermes organizes capabilities into toolsets rather than assuming every tool is always available.

```text
agent runtime
  -> enabled toolsets
     -> web
     -> terminal/files
     -> browser
     -> memory
     -> skills
     -> delegation
     -> messaging
     -> scheduled work
     -> MCP-provided tools
```

Reusable principle: tool existence, enablement, credential readiness, platform support, and runtime health are separate facts.

## Skills as procedural memory

Hermes treats skills as on-demand knowledge documents. Short descriptions can remain available while full instructions are loaded only when a task requires them.

```text
skill registry
  -> name + description available cheaply
  -> task matches / agent selects skill
  -> load full SKILL.md
  -> use linked scripts/references if required
```

This progressive-disclosure pattern allows a large skill library without placing all procedures into every model request.

A production agent should distinguish:

```text
tool       executable capability
skill      reusable procedure for using capabilities
memory     durable facts/outcomes
context    task/project information
plugin     runtime extension/provider
```

## Persistent memory

Hermes' built-in memory separates agent/environment memory from user-profile memory and keeps both intentionally bounded. External memory providers can augment the built-in layer.

The reusable lesson is not the exact file sizes; it is bounded, purpose-specific persistence.

Recommended memory classes:

```text
working context       current operation
session history       conversation + tool events
project memory        durable project facts
user preferences      stable interaction constraints
procedural memory     skills
retrievable history   searchable prior sessions
immutable evidence    receipts/artifacts
```

Memory should not become an unbounded transcript dump. Writes should have a reason, source, scope, and replacement/retention behavior.

## Project context discovery

Hermes discovers project instruction files such as `.hermes.md`, `AGENTS.md`, `CLAUDE.md`, `SOUL.md`, and `.cursorrules`.

Reusable discovery sequence:

```text
enter workspace
  -> identify context/instruction files
  -> identify applicable scope
  -> load only applicable instructions
  -> record precedence
  -> inspect live repository/runtime
```

Instruction files guide behavior but do not prove implementation state.

## Checkpoints and recovery

Hermes snapshots the working directory before file changes so the user can roll back. This complements Git but addresses the broader principle that autonomous mutation needs a known pre-change state and recovery path.

A recovery system should record:

- operation identity;
- workspace identity;
- snapshot/checkpoint identity;
- files affected;
- restore status;
- whether external side effects are reversible.

## Delegation

Hermes supports isolated delegated work. The reusable pattern is bounded subagent authority rather than uncontrolled parallelism.

Each delegated task should receive:

```text
objective
context slice
allowed tools
workspace scope
step/time budget
return schema
parent operation id
mutation permission
```

The parent must integrate and validate returned work; delegation is not proof of completion.

## Messaging and persistent surfaces

Hermes exposes CLI plus a messaging gateway and other surfaces while retaining one underlying agent capability model. Interaction transport should not redefine agent identity.

```text
CLI / messaging / desktop / API
        -> normalized session ingress
        -> agent runtime
        -> normalized response/events
        -> channel adapter
```

## Adopt

- progressive-disclosure skills;
- bounded purpose-specific memory;
- context-file discovery;
- toolsets with runtime enablement/health;
- checkpoints before mutation;
- isolated subagents;
- one agent runtime across multiple transports;
- MCP as a dynamic tool source rather than hardcoded agent knowledge.

## Do not copy blindly

- exact memory size limits;
- every built-in toolset;
- autonomous skill creation without review/versioning requirements;
- multi-agent delegation where a single agent is sufficient;
- platform-specific messaging assumptions.

## Design takeaway

Persistent agent quality comes from disciplined separation of tools, skills, memory, context, sessions, and evidence. Persistence should increase continuity without allowing stale state to become invisible authority.

## Sources

- https://hermes-agent.nousresearch.com/docs/
- https://hermes-agent.nousresearch.com/docs/user-guide/features/overview/
- https://hermes-agent.nousresearch.com/docs/user-guide/features/tools/
- https://hermes-agent.nousresearch.com/docs/user-guide/features/memory/
- https://hermes-agent.nousresearch.com/docs/user-guide/features/memory-providers/
- https://github.com/NousResearch/hermes-agent
