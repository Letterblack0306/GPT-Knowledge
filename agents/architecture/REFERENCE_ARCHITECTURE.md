---
title: Reference Agent Architecture
category: Agents
sub_category: Architecture
confidence: high
verified: true
last_reviewed: 2026-08-07
---

# Reference Agent Architecture

## Canonical layers

```text
User objective
↓
Task contract
↓
Context builder
↓
Planner / decision policy
↓
Tool registry and capability manifest
↓
Policy, validation, and approval
↓
Execution adapters
↓
Observation and evidence normalization
↓
State, memory, and trace
↓
Completion verifier
```

## 1. Task contract

Normalize every task into:

```json
{
  "goal": "",
  "scope": [],
  "constraints": [],
  "acceptance": [],
  "stopConditions": [],
  "approvalPolicy": {}
}
```

Do not let raw conversational text become unrestricted execution authority.

## 2. Context builder

Build the smallest context that supports the next decision:

- task contract;
- current environment state;
- relevant memory;
- current plan and progress;
- available tools;
- recent evidence;
- active blockers.

Avoid dumping full repositories, logs, histories, or browser DOM into every turn.

## 3. Planner and decision policy

Planning may be:

- implicit for trivial tasks;
- explicit step lists for multi-step work;
- hierarchical for long-running tasks;
- dynamically revised after observations.

Plans are hypotheses, not truth. The runtime must permit revision when evidence contradicts the plan.

## 4. Tool registry

The registry is the authority for executable capability. It should provide:

- tool name and description;
- input schema;
- preconditions;
- risk category;
- approval requirements;
- timeout and retry policy;
- executor binding;
- evidence schema.

The model should see only tools that are actually registered and usable in the current session.

## 5. Policy and approval

Policy decisions belong between intent and execution. They should evaluate:

- authorization;
- scope containment;
- argument validity;
- destructive impact;
- reversibility;
- secret exposure;
- external side effects;
- approval state.

## 6. Execution adapters

Adapters translate validated actions into environment-specific operations:

- filesystem;
- terminal;
- browser;
- APIs;
- Git;
- creative applications;
- MCP servers;
- databases.

Adapters return structured outcomes. They do not decide the agent strategy.

## 7. Observation and evidence

Normalize tool output into bounded records:

```json
{
  "actionId": "",
  "tool": "",
  "status": "completed | failed | blocked | partial",
  "inputs": {},
  "result": {},
  "evidence": [],
  "startedAt": "",
  "completedAt": ""
}
```

## 8. State and lifecycle

Track at minimum:

- session identity;
- task identity;
- current phase;
- active plan;
- executed actions;
- approvals;
- blockers;
- budgets;
- completion state.

State transitions should be explicit and observable.

## 9. Recovery

```text
Failure
→ classify
→ decide retryability
→ revise hypothesis or plan
→ retry within budget
→ verify new evidence
```

Never retry the same failed action indefinitely without a changed hypothesis.

## 10. Completion verifier

Completion compares evidence against acceptance conditions. It must distinguish:

- implemented;
- syntax-valid;
- test-passing;
- integration-verified;
- live-runtime-verified;
- remotely published.

These are different proof levels and must not be collapsed into one claim.
