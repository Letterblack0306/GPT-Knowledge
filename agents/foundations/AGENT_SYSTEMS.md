---
title: Agent Systems Foundations
category: Agents
sub_category: Foundations
confidence: high
verified: true
last_reviewed: 2026-08-07
---

# Agent Systems Foundations

## 1. Workflow versus agent

### Workflow

A workflow follows a path substantially defined by code:

```text
Input → fixed routing → fixed sequence → output
```

Use workflows when the task is predictable, policy-sensitive, repeatable, and easy to encode explicitly.

### Agent

An agent allows the model to choose actions or paths based on observed state:

```text
Goal → model decision → tool action → observation → next model decision
```

Use agents when the correct path cannot be fully known in advance and intermediate observations materially change what should happen next.

## 2. Agentic complexity ladder

Prefer the lowest level that solves the problem:

1. direct model response;
2. model plus retrieval;
3. model plus one tool call;
4. deterministic multi-step workflow;
5. model-routed workflow;
6. single autonomous agent;
7. multi-agent system.

Each level adds possible capability but also latency, cost, failure modes, observability needs, and security exposure.

## 3. Core loop

```text
Perceive
→ Reason about current state
→ Select or revise plan
→ Act through a validated tool
→ Observe structured evidence
→ Decide whether to continue
```

This is compatible with ReAct-style interleaving of reasoning and action, but production systems should expose concise decisions and evidence rather than private internal chain-of-thought.

## 4. Goal contract

Every task should establish:

- objective;
- authorized scope;
- constraints;
- available capabilities;
- acceptance conditions;
- stop conditions;
- approval policy;
- evidence requirements.

A vague goal creates uncontrolled interpretation. A useful goal gives the agent freedom in method while fixing the desired outcome and boundaries.

## 5. Stop conditions

The loop must stop when any of these becomes true:

- acceptance conditions are proven;
- a genuine dependency is unavailable;
- user approval is required;
- policy blocks the next action;
- the user stops the task;
- the retry, time, command, or cost budget is exhausted;
- repeated state proves no useful progress.

## 6. Clarification versus action

Agents should not ask questions automatically whenever information is missing. They should classify missing information:

- discoverable through available tools → inspect;
- safely inferable and reversible → proceed with stated assumption;
- consequential and ambiguous → ask;
- unauthorized or inaccessible → block precisely.

## 7. Evidence-first completion

A final message is a report, not proof. Evidence comes from observed state:

- command result;
- file content or diff;
- browser snapshot;
- API response;
- test output;
- runtime status;
- artifact existence;
- remote repository state.

Only claim what the evidence actually establishes.
