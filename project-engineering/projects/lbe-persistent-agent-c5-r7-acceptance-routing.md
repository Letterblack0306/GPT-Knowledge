# LBE Persistent Agent — C5/R7 Acceptance Routing

## Knowledge metadata

- Last reviewed: 2026-08-16
- Project repository: `Letterblack0306/LBE_Presistent_Agent_wall`
- Purpose: route future LBE Persistent Agent end-to-end acceptance work to current project-owned evidence before planning or completion claims
- Authority: routing/reference only; current project source, Git state, installed/runtime evidence, machine gates, and project-owned acceptance records remain authoritative

## Mandatory route

For any task involving C5/R7, installed-path acceptance, coding proof, provider switching, resume/rehydration, audit proof, escalation/denial proof, or a claim that the persistent-agent milestone is complete:

1. load `project-engineering/project-feature-implementation-plan.md`;
2. load `ai-agents/unified-agent-engineering-methods.md`;
3. inspect the current `Letterblack0306/LBE_Presistent_Agent_wall` repository and exact revision;
4. read the project-owned current records that actually exist on that revision, starting with:

```text
docs/CURRENT_STATUS.md
docs/IMPLEMENTATION_PLAN.md
docs/acceptance/CURRENT_IMPLEMENTATION_GATE.md
.lbe/governance/implementation-gates.json
```

5. inventory `docs/acceptance/` for the exact checkpoint/gate that owns the capability being claimed;
6. revalidate the relevant installed/runtime evidence;
7. update or create a project-owned acceptance record only through an explicitly authorized bounded documentation/acceptance slice.

Do not reconstruct project acceptance chronology from chat memory or this GPT-Knowledge page.

## Important route correction

An earlier version of this routing page required:

```text
docs/acceptance/C5_R7_ACCEPTANCE_RECORD.md
```

That file was not present on project `main` when rechecked on 2026-08-16.

Therefore:

```text
missing historical route != permission to invent the record
```

Until the project explicitly creates a canonical R7/C5 acceptance record, use the live acceptance directory, current implementation gate, current source/runtime evidence, and the reconciled canonical roadmap.

If a dedicated R7 acceptance record is needed, its creation must be part of a bounded, machine/human-gated acceptance-documentation slice and must be populated from current evidence rather than reconstructed assumptions.

## Current durable milestone

The LBE Cline provider-continuation slice has been accepted as PASS in the project-owned records.

Durable architecture:

```text
Python/LBE authoritative runtime
-> bounded Node worker
-> pinned Cline AgentRuntime
-> tool proposal
-> existing LBE authorization + GovernedToolOrchestrator
-> ToolReceipt
-> same Cline continuation
```

Accepted proof includes:

- provider-backed local continuation;
- governed tool continuation;
- denied/escalated paths with no handler execution;
- governed execution failure returned as tool failure;
- truthful failed-runtime mapping;
- in-flight cancellation ending as `aborted`;
- focused continuation and orchestrator regression suites passing;
- zero high/critical dependency vulnerabilities.

This does **not** establish overall R7/product readiness.

## Immediate routing rule before R7 work

The current project roadmap/status documents are not fully reconciled with live accepted implementation.

Before selecting an R7 proof family or implementing another runtime feature, perform the project-owned documentation/remaining-gap reconciliation described in `docs/CURRENT_STATUS.md`.

Required outcome:

```text
current implementation inventory
-> roadmap milestone classification
-> stale-doc reconciliation
-> first genuinely missing capability
-> one explicit new gate
```

No R7 family should be declared active merely because it appears next in an older roadmap.

## R7 proof families to evaluate after reconciliation

The canonical implementation plan describes these end-to-end proof families:

### A — governed coding

A real/controlled repository path must prove bounded inspection/edit execution, receipt-backed evidence, required validation, and persisted validated completion.

### B — provider switch

The same persistent session/workspace policy must continue under another provider/model without moving authority out of LBE.

### C — resume after workspace change

Checkpoint, external workspace change, resume, stale-source invalidation, current workspace reinspection, and preserved active constraints must be proven.

### D — audit mode

Read-only current-workspace inspection, reference-pattern use only as lower-authority guidance, deterministic guards/validation, and no mutation must be proven.

### E — escalation/denial

Out-of-authority operation requests must remain blocked/denied until actual authority changes; provider reasoning cannot self-upgrade permissions.

These are proof targets, not presumed current gaps. Reconcile live implementation first.

## Evidence rule

Acceptance claims must bind to the real authority/execution chain:

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

Examples:

- configured provider != provider health;
- provider response != governed execution;
- changed file != receipt-bound authorized change;
- successful tool call != validated task completion;
- focused unit suite != installed-path product proof;
- one successful proof family != overall R7 completion.

## Anti-repeat lessons

Future agents must not:

- use a missing acceptance file as evidence that the proof never happened or as permission to reconstruct it from memory;
- treat a completed continuation seam as overall coding-agent readiness;
- redesign accepted architecture when the task is acceptance proof;
- treat source/unit tests as installed-path evidence;
- infer provider behavior from configuration/listing alone when a real runtime probe is required;
- infer governed execution from model output rather than receipts/handler evidence;
- weaken validation to make a disposable fixture pass;
- claim R7 from a subset of proof families;
- unlock the next phase without an explicit current machine/human gate.

## Documentation rule

Project-specific chronology, exact commands, fixture paths, revision heads, receipt IDs, failure attempts, and proof-family matrices belong in the project repository.

GPT-Knowledge retains only:

- routing;
- durable cross-project methodology;
- reusable evidence rules;
- anti-assumption lessons.

This prevents GPT-Knowledge from becoming a competing project-status database.