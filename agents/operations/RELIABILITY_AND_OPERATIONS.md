---
title: Agent Reliability and Operations
category: Agents
sub_category: Operations
confidence: high
verified: true
last_reviewed: 2026-08-07
---

# Agent Reliability and Operations

## 1. Reliability boundaries

An agent runtime should define hard limits for:

- total runtime;
- model turns;
- tool calls;
- retries;
- concurrent operations;
- token and monetary cost;
- output size;
- browser tabs or subprocesses;
- memory retention.

Budgets should stop execution cleanly and report what remains incomplete.

## 2. State machine

Use explicit phases rather than scattered booleans:

```text
IDLE
→ PREPARING
→ DECIDING
→ WAITING_FOR_APPROVAL
→ EXECUTING
→ OBSERVING
→ RECOVERING
→ VERIFYING
→ COMPLETED | BLOCKED | FAILED | CANCELLED
```

Every transition should carry a reason and stable task/session identity.

## 3. Cancellation

Cancellation must propagate to:

- active model requests;
- subprocesses;
- network requests;
- browser operations;
- queued work;
- pending retries;
- state persistence.

The UI should not claim “stopped” until the runtime has acknowledged cancellation or reported a timeout in stopping.

## 4. Retry policy

Define retryability by failure class. Use bounded exponential backoff for transient network or service failures where appropriate. Do not retry:

- policy denials;
- invalid arguments without repair;
- user rejection;
- destructive actions with uncertain completion;
- authentication failure without changed credentials;
- deterministic precondition failure.

## 5. Idempotency

Every external side effect should have an idempotency strategy:

- operation IDs;
- expected-current-state checks;
- deduplication store;
- transactional write;
- create-versus-update distinction;
- confirmation lookup after uncertain response.

## 6. Persistence

Persist enough state to diagnose and safely resume, but do not resume blindly. On restart:

1. load prior state;
2. classify whether the task was active, completed, or interrupted;
3. re-observe mutable environment state;
4. reconcile uncertain actions;
5. require fresh approval where authority expired;
6. continue only when safe.

## 7. Health

Separate:

- configured;
- registered;
- reachable;
- authenticated;
- healthy;
- currently selected;
- actively executing.

One green status should not collapse all of these states.

## 8. Provider fallback

Fallback must preserve:

- task identity;
- normalized context;
- tool manifest;
- policy constraints;
- evidence history;
- provider-specific limits.

Record which provider produced each decision. Do not treat fallback as proof of equivalent behavior.

## 9. Incident evidence

Capture bounded records for:

- last successful phase;
- active tool and arguments;
- recent state transitions;
- provider and capability health;
- cancellation state;
- exception category and stack location;
- recovery attempts;
- unresolved external side effects.

## 10. Production readiness

Before production use, prove:

- clean startup and shutdown;
- bounded retries;
- real cancellation;
- state recovery;
- capability loss handling;
- approval enforcement;
- scope containment;
- secret redaction;
- trace correlation;
- failure-safe final reporting.
