# Codex Study — Execution, Validation, Approvals, and Runtime Control

## Knowledge metadata

- Source project: `openai/codex`
- Primary sources: Codex repository, Rust CLI/app-server documentation, configuration schema, approval/sandbox documentation
- Last reviewed: 2026-08-07
- Confidence: high for documented runtime contracts
- Applies to: coding-agent execution loops, shell/file execution, approvals, sandboxing, session identity, validation

## Why Codex is important

Codex is a strong reference for separating model reasoning from controlled execution. The reusable value is not a particular prompt; it is the runtime contract around proposed actions, execution environments, approval state, and observable results.

## Execution architecture

The Rust codebase separates core business logic from surfaces such as interactive TUI and non-interactive execution. The important pattern is:

```text
user instruction
  -> thread / turn
  -> model decision
  -> typed action item
  -> policy + sandbox evaluation
  -> optional approval request
  -> execution
  -> observation/result item
  -> next model step or completion
```

Execution should therefore be represented as stateful typed events rather than inferred from assistant prose.

## Approval contract

The app-server approval flow associates requests with explicit `threadId`, `turnId`, and item identity. A client receives the proposed command or modification context and returns an explicit decision.

Reusable principle:

```text
proposal != permission != execution != success
```

Store these separately:

- requested action;
- target/environment;
- reason for escalation;
- approval decision;
- decision scope/persistence;
- execution result;
- validation evidence.

An agent must not convert "approval granted" into "action succeeded."

## Sandbox as a capability boundary

Codex exposes distinct sandbox policies, including read-only, workspace-write, and unrestricted modes. The reusable lesson is that sandbox mode is a runtime capability declaration, not a personality setting.

A tool request should be evaluated against:

```text
requested filesystem access
requested network access
current workspace roots
current sandbox mode
current approval policy
existing policy amendments
execution environment identity
```

When a required operation is denied by the current boundary, the runtime should produce a structured blocked/escalation state rather than teaching the model to disguise the operation.

## Session and turn identity

Approval requests and execution items are scoped to active conversation identity. This prevents an approval from one turn or session being accidentally applied to another operation.

Minimum execution identity:

```text
session/thread id
turn id
operation/item id
tool call id
environment id
target id
```

Persisted or resumable sessions must restore these relationships rather than merely restoring chat text.

## Headless execution

`codex exec` demonstrates an important second interface: an agent can be run non-interactively until it decides it is complete. Headless operation increases the need for machine-readable completion, exit state, structured events, and bounded authority because no interactive user is guaranteed to catch ambiguous intermediate states.

## Validation model

Codex is useful as an execution reference, but no execution event alone establishes product correctness. A production coding agent should separate:

```text
source proof       intended files/diff exist
command proof      command exited as recorded
test proof         relevant validation passed
runtime proof      changed behavior is reachable
user-visible proof expected outcome is observable
```

Validation selection should be driven by the changed subsystem. A generic test command is not automatically sufficient.

## Adopt

- typed action/observation lifecycle;
- explicit thread/turn/operation identity;
- approval as a protocol rather than a conversational convention;
- sandbox capability boundaries;
- structured escalation reasons;
- interactive and headless surfaces using the same core runtime;
- execution result separated from behavioral validation.

## Do not copy blindly

- a specific sandbox policy as the universal default;
- approval UX independent of the target product's threat model;
- shell-command success as final completion evidence;
- resumability without proving restored workspace and environment identity.

## Design takeaway

The execution layer should be an auditable state machine. The model proposes actions; policy determines authority; tools execute; observations return evidence; validation determines whether the task is actually complete.

## Sources

- https://github.com/openai/codex
- https://github.com/openai/codex/blob/main/codex-rs/README.md
- https://github.com/openai/codex/blob/main/codex-rs/app-server/README.md
- https://github.com/openai/codex/blob/main/codex-rs/core/config.schema.json
