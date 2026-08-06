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
- `browser-computer-use/` — browser state, target control, accessibility snapshots, action verification.
- `operations/` — observability, retries, budgets, idempotency, deployment and incident handling.
- `references/` — primary papers, specifications, and official engineering guidance.

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

## Completion rule

An agent is not complete because it produced an answer. Completion requires evidence that the requested outcome occurred, or a precise blocker showing why it could not occur.
