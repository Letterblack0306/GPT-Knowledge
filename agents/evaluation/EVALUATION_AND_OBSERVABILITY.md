---
title: Agent Evaluation and Observability
category: Agents
sub_category: Evaluation
confidence: high
verified: true
last_reviewed: 2026-08-07
---

# Agent Evaluation and Observability

## 1. Evaluate outcomes, not style

A fluent response does not prove an agent succeeded. Evaluation should measure whether the intended state change occurred within the required constraints.

## 2. Evaluation layers

### Unit evaluation

Test isolated components:

- schema validation;
- tool registration;
- policy decisions;
- state reducers;
- memory retrieval;
- failure classification;
- completion checks.

### Integration evaluation

Test component contracts:

- planner to tool registry;
- approval to execution;
- tool result to evidence store;
- browser target selection;
- memory persistence and reload;
- provider fallback;
- cancellation propagation.

### Scenario evaluation

Run representative tasks end to end, including ambiguity, partial failure, stale context, unavailable tools, and hostile or misleading input.

### Live-runtime proof

Validate against the real environment when mocks cannot establish the claim.

## 3. Metrics

Useful metrics include:

- task success rate;
- acceptance-condition pass rate;
- invalid tool-call rate;
- recovery success rate;
- unnecessary-action count;
- human-intervention rate;
- approval precision;
- repeated-action rate;
- latency;
- model and tool cost;
- evidence completeness;
- policy violation rate.

Do not optimize one metric while ignoring safety or correctness.

## 4. Trace model

A trace should connect:

```text
Task
→ plan or decision
→ action
→ policy and approval
→ tool inputs
→ tool result
→ evidence
→ state transition
→ recovery
→ completion claim
```

Use stable IDs so related events can be reconstructed without relying on log order alone.

## 5. Behavioral regression suite

Create cases for:

- correct tool selection;
- refusing unavailable capability claims;
- asking only when ambiguity is consequential;
- preserving scope;
- avoiding repeated failed actions;
- stopping after verified completion;
- not stopping after a plan-only response;
- recovering after changed evidence;
- distinguishing local from remote proof;
- resisting instructions embedded in untrusted content.

## 6. Deterministic fixtures

Use deterministic fixtures for contracts and edge cases. Store expected normalized actions and evidence, not brittle full natural-language responses.

## 7. Model variability

Evaluate multiple runs where model nondeterminism matters. Report distributions and failure classes instead of one successful example.

## 8. Failure taxonomy

Separate failures such as:

- model decision error;
- invalid arguments;
- unavailable capability;
- policy block;
- approval denial;
- environment failure;
- timeout;
- stale state;
- evidence failure;
- completion-verification failure.

This prevents unrelated problems from being “fixed” through prompt changes.

## 9. Observability UI

Primary UI should show:

- current objective;
- current phase;
- active action;
- waiting approval or blocker;
- concise result;
- completion state.

Detailed traces, raw logs, token data, and diagnostic payloads belong in a secondary diagnostics surface.

## 10. Claim boundary

Report proof levels explicitly:

```text
Implemented
Syntax checked
Unit tested
Integration tested
Live runtime verified
Remote state verified
```

Never convert a lower proof level into a broader completion claim.
