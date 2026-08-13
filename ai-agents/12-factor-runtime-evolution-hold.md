# 12-Factor Runtime Evolution Hold

## Status

**REFERENCE / DESIGN ONLY — DO NOT IMPLEMENT IN A LIVE PROJECT WITHOUT PROJECT-SPECIFIC RUNTIME PROOF AND EXPLICIT USER CONFIRMATION.**

Last reviewed: 2026-08-13.

This note records a reusable interpretation of `humanlayer/12-factor-agents` for existing agent products.

It is not a mandate to rewrite an existing loop merely because a reducer/event-driven design appears architecturally cleaner.

---

## Core interpretation

A reliable agent product can keep one persistent agent identity while separating:

```text
reasoning
execution
persistence
context construction
provider/model selection
```

A useful target pattern is:

```text
user-facing agent/session
        -> durable event/state store
        -> context builder
        -> reasoning model
        -> structured next action
        -> deterministic execution/reducer
        -> structured result/evidence
        -> durable state
        -> next reasoning episode
```

The model chooses the semantic next action. Deterministic software executes, persists, suspends, resumes, validates mechanical contracts, and records evidence.

Do not move semantic task interpretation, tool choice, or solution strategy into a hard-coded state machine merely to make the runtime deterministic.

---

## One agent, multiple inference backends

Provider/model diversity does not require multiple agent identities.

Conceptually:

```text
authoritative session/event history
        -> bounded context projection
        -> model router
              +-- remote / long-context model
              +-- local / focused model
```

The session store remains authoritative. Provider context windows are temporary reasoning surfaces.

Possible routing dimensions include context size, capability, latency, cost, privacy, availability, and task scope. These are design inputs, not universal hard-coded rules.

---

## Project adoption gate

For an existing agent project, do not implement this pattern until the current runtime path has first been proven.

Minimum proof should include:

```text
real instruction
-> current reasoning loop
-> real tool selection
-> real tool execution
-> structured result
-> same-session continuation
-> recoverable failure path
-> truthful completion/blocker
-> evidence attached to runtime state
```

Static checks, smoke tests, model discovery, login/auth success, or a standalone text completion do not establish that the active agent loop is working end to end.

If the current loop has not been proven, keep the 12-factor/reducer/model-router design documented only.

After runtime proof is available, propose the smallest architecture-consistent migration step and proceed only after explicit user/project approval.

---

## Final rule

**First prove the active loop. Then compare the proven failure/complexity against the proposed reducer/event-driven architecture. Do not replace an unproven runtime with another unproven runtime merely because the second design is theoretically stronger.**
