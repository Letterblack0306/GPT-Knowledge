---
title: Multi-Agent Systems
category: Agents
sub_category: Multi-Agent
confidence: high
verified: true
last_reviewed: 2026-08-07
---

# Multi-Agent Systems

## 1. Default to one agent

Use multiple agents only when specialization, parallelism, isolation, or independent evaluation produces measurable benefit. Multiple agents add coordination cost, duplicated context, conflicting decisions, and harder debugging.

## 2. Common patterns

### Router

A coordinator selects one specialist based on the task.

### Handoff

One agent transfers control and structured context to another agent.

### Supervisor–worker

A supervisor decomposes work, assigns bounded tasks, and verifies results.

### Parallel workers

Independent subtasks run concurrently and return results for aggregation.

### Evaluator–optimizer

One agent produces a result and another evaluates it against explicit criteria; revision continues within a bounded loop.

### Debate or independent review

Multiple agents form independent conclusions before a controlled synthesis step. Use cautiously because extra opinions do not guarantee correctness.

## 3. Handoff contract

```json
{
  "taskId": "",
  "fromAgent": "",
  "toAgent": "",
  "objective": "",
  "authorizedScope": [],
  "context": {},
  "completedWork": [],
  "evidence": [],
  "openQuestions": [],
  "acceptance": []
}
```

Do not transfer entire raw conversation histories by default.

## 4. Authority

Define who owns:

- task decomposition;
- capability selection;
- approval requests;
- mutations;
- conflict resolution;
- completion claims;
- user communication.

Only one component should own the final task state.

## 5. Shared state

Shared state should be structured, versioned, and concurrency-safe. Agents should not coordinate through unstructured prose alone.

Track:

- task status;
- ownership;
- dependencies;
- locks or leases;
- evidence references;
- revision number;
- cancellation state.

## 6. Parallel execution

Parallelize only independent work. Verify that workers do not mutate overlapping resources or depend on stale snapshots.

Use:

- explicit file or object ownership;
- read/write sets;
- isolated branches or worktrees;
- operation IDs;
- merge or reconciliation steps.

## 7. Conflict handling

When agents disagree:

1. compare evidence, not confidence or verbosity;
2. identify conflicting assumptions;
3. acquire missing evidence;
4. escalate consequential ambiguity;
5. preserve unresolved disagreement in the final report.

## 8. Failure containment

A worker failure should not corrupt the supervisor state or trigger endless delegation. Bound delegation depth, retries, fan-out, and total budget.

## 9. Observability

Trace:

- routing decision;
- handoff payload;
- agent identity;
- delegated scope;
- tool actions;
- returned evidence;
- supervisor acceptance or rejection.

## 10. Anti-patterns

Avoid:

- multiple agents with identical roles;
- agents delegating recursively without limits;
- shared unrestricted tools;
- duplicated mutations;
- consensus without evidence;
- one agent silently rewriting another agent’s result;
- treating role prompts as real capability isolation.
