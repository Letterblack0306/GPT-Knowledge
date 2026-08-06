---
title: AI Agents Knowledge Index
category: Agents
confidence: high
verified: true
last_reviewed: 2026-08-07
---

# AI Agents Knowledge

This area stores reusable knowledge about AI agents independent of any single framework, model provider, application type, or repository.

## Sections

- `foundations/` — definitions, workflows versus agents, reasoning–action loops, autonomy boundaries.
- `architecture/` — orchestration, state, planning, execution, evidence, recovery, lifecycle.
- `tools/` — schemas, registries, preconditions, tool selection, MCP, approvals, evidence.
- `context-memory/` — context construction, working memory, durable memory, retrieval, staleness.
- `safety/` — authorization, containment, guardrails, approval, auditability, human control.
- `evaluation/` — behavioral tests, task success, trace analysis, reliability, regression.
- `multi-agent/` — delegation, routing, handoffs, specialist agents, conflict and convergence.
- `browser-computer-use/` — browser access modes, CDP targets and sessions, extension relays, semantic and visual interaction, target protection, browser-agent UI, and live runtime proof.
- `operations/` — observability, retries, budgets, idempotency, deployment and incident handling.
- `references/` — primary papers, specifications, and official engineering guidance.

## Browser-access knowledge

- `browser-computer-use/BROWSER_AND_COMPUTER_USE_AGENTS.md` — full browser-agent architecture, target ownership, observation, action, verification, safety, recovery, and UI requirements.
- `browser-computer-use/BROWSER_ACCESS_MODES.md` — deciding between application APIs, managed automation, CDP, extension relays, visual computer use, and hybrid access.
- `browser-computer-use/CDP_TARGET_AND_SESSION_ARCHITECTURE.md` — browser endpoints, target discovery, attached sessions, protocol compatibility, navigation proof, and shutdown.
- `browser-computer-use/EXTENSION_RELAY_SECURITY.md` — pairing, tab authorization, message validation, content-script trust, permission minimization, and lifecycle handling.

## Core definition

An AI agent is a system in which a model can select and sequence actions against an environment in pursuit of a goal, using observations to update subsequent decisions.

A fixed workflow is not automatically an agent. In a workflow, code determines the path. In an agent, the model dynamically determines at least part of the path.

## Core rule

Do not add autonomy because it sounds advanced. Add it only when model-directed decisions measurably improve task completion beyond a simpler prompt or deterministic workflow.

## Canonical execution loop

```text
Goal
→ Perceive state
→ Decide or plan
→ Validate action
→ Execute tool
→ Observe result
→ Update state
→ Continue, recover, ask, or stop
```

## Browser-agent invariant

```text
No browser action without:
explicit authority
+ deterministic target
+ fresh observation
+ validated action
+ bounded execution
+ post-action evidence
```

## Completion rule

An agent is not complete because it produced an answer. Completion requires evidence that the requested outcome occurred, or a precise blocker showing why it could not occur.
