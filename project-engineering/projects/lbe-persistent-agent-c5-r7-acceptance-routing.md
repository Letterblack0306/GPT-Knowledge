# LBE Persistent Agent — C5/R7 Acceptance Routing

## Knowledge metadata

- Last reviewed: 2026-08-12
- Project repository: `Letterblack0306/LBE_Presistent_Agent_wall`
- Purpose: route future LBE Persistent Agent acceptance work to the project-owned C5/R7 evidence record before new planning or implementation
- Authority: routing/reference only; current project source, current Git state, installed runtime evidence, and project-owned acceptance records remain authoritative

## Mandatory route

For any task involving C5, R7, installed-path acceptance, coding proof, provider-switch proof, resume proof, audit proof, escalation/denial proof, or a claim that the persistent-agent milestone is complete:

1. load `project-engineering/project-feature-implementation-plan.md`;
2. load `ai-agents/unified-agent-engineering-methods.md`;
3. inspect the current `Letterblack0306/LBE_Presistent_Agent_wall` repository and active revision;
4. read the project-owned record:

```text
docs/acceptance/C5_R7_ACCEPTANCE_RECORD.md
```

5. revalidate the relevant installed/runtime evidence before acting;
6. update the project-owned record after every meaningful proof attempt or accepted correction.

Do not reconstruct C5 history from chat memory when the project-owned record is available.

## Current durable state

At the latest recorded Proof A result:

- C5/R7 overall is **not ready**;
- Proof Family A — Coding session — is **PROVEN** through the installed path;
- Families B-E still require their own installed-path evidence;
- successful Proof A includes an executed governed `workspace.replace_text` receipt, receipt-bound source-change evidence, focused validation, Git-status reconciliation, `session validate: READY`, and persisted `completed / VALIDATED_COMPLETION` task state.

This status is a navigation hint only. Revalidate the current project record and repository before relying on it.

## Anti-repeat lessons that are reusable

Future agents must not:

- interpret an acceptance milestone as permission to redesign completed architecture;
- propose a new implementation before checking current branches/PR history for an existing owner;
- treat source/unit tests as installed-path proof;
- treat a successful wheel build as proof required package resources are included;
- treat arbitrary Git dirt or runtime-generated artifacts as task-bound source-change evidence;
- weaken production validation because an unsuitable disposable fixture lacks an applicable test;
- infer provider health from configuration/listing alone;
- infer governed execution from a changed file alone;
- infer feature completion from exit code alone;
- claim the whole C5/R7 milestone because one proof family passed.

## Evidence rule

For acceptance work, claims must be bound to the actual authority/execution chain:

```text
request/session/task identity
  -> registered governed capability
  -> authorization decision
  -> structured execution receipt
  -> current workspace evidence
  -> deterministic validation evidence
  -> persisted terminal state
```

Lower-level evidence cannot justify a higher-level completion claim.

## Documentation rule

Project-specific acceptance chronology, commands, fixture paths, branch heads, failed attempts, exact receipts, and proof-family matrices belong in the project repository's acceptance record.

GPT-Knowledge should retain only:

- routing instructions;
- durable cross-project methods;
- reusable anti-assumption/anti-repeat lessons.

This prevents GPT-Knowledge from becoming a competing project-status database while still ensuring future agents know where to look before acting.
