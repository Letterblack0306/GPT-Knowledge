# LBE Persistent Agent — C5/R7 Acceptance Routing

## Knowledge metadata

- Last reviewed: 2026-08-17
- Project repository: `Letterblack0306/LBE_Presistent_Agent_wall`
- Purpose: route future LBE Persistent Agent end-to-end acceptance and repair work to current project-owned evidence before planning or completion claims
- Authority: routing/reference only; current project source, Git state, installed/runtime evidence, machine gates, and project-owned acceptance records remain authoritative

## Mandatory route

For any task involving C5/R7, installed-path acceptance, coding proof, provider switching, resume/rehydration, audit proof, escalation/denial proof, composition repair, release readiness, or a claim that the persistent-agent milestone is complete:

1. load `project-engineering/project-feature-implementation-plan.md`;
2. load `ai-agents/unified-agent-engineering-methods.md`;
3. for repeated end-to-end/audit mistakes, load `ai-agents/repeated-audit-failures-and-corrective-method.md`;
4. inspect the current `Letterblack0306/LBE_Presistent_Agent_wall` repository and exact revision;
5. read project-owned current authority first:

```text
docs/CURRENT_STATUS.md
docs/IMPLEMENTATION_PLAN.md
docs/acceptance/CURRENT_IMPLEMENTATION_GATE.md
.lbe/governance/implementation-gates.json
```

6. inventory `docs/acceptance/` for the exact checkpoint/gate that owns the capability being claimed;
7. revalidate the relevant installed/runtime evidence;
8. use GitHub for project documentation/patch changes and LoopTool only for local test/debug/runtime proof;
9. never reconstruct project acceptance chronology from chat memory or this GPT-Knowledge page.

## Current routing correction — R7 is failed, not pending

The project now has an explicit R7 gate/checkpoint and runtime falsifier. Do not route future work as though R7 is merely the next unstarted proof family.

Current project-owned state:

```text
R3-R6F: PROVEN_COMPLETE
CLI: PROVEN_COMPLETE
R7: FAIL — INSTALLED NORMAL-PATH CODING COMPOSITION GAP
repair investigation: NOT YET ACTIVATED
release/package readiness: BLOCKED_BY_R7
publish: BLOCKED
```

The current machine gate forbids implementation and architecture changes until a separate repair slice is activated.

## Decisive R7 boundary

The project proved that installed `lbe code` reaches a read-only reasoning/inspection contract rather than the required governed coding execution path.

Observed:

```text
installed lbe code
 -> SessionMemoryRuntimeBridge
 -> GovernedAgentGateway
 -> LBERequestController
 -> provider approved_tools=[workspace.read]
 -> read_only response
 -> no governed coding ToolReceipt
```

Required acceptance composition:

```text
installed lbe code
 -> persistent session/runtime identity
 -> provider reasoning/tool proposal
 -> existing R6C authorization
 -> existing R6E GovernedToolOrchestrator
 -> ToolReceipt
 -> existing receipt-backed provider continuation
 -> persistent task/completion authority
```

This is an integration/composition failure at the installed normal path. It does not justify rewriting accepted R6C/R6E/completion owners.

## Immediate route for all next LBE work

Do **not** continue later R7 proof families and do **not** patch the runtime directly from the failed acceptance result.

First activate, when explicitly authorized, a bounded investigation-only repair gate whose question is:

> What existing active-owner seam should connect installed `lbe code` / `GovernedAgentGateway` reasoning to the accepted R6C/R6E governed tool execution and receipt-continuation path, and what is the smallest correction that restores that composition without creating parallel authority?

Mandatory investigation sequence:

```text
lock exact project revision and reproduction
 -> trace CLI/gateway/reasoning producer path
 -> trace all ToolRequest producers and consumers
 -> trace all GovernedToolOrchestrator constructors and consumers
 -> trace ToolReceipt persistence/correlation/continuation
 -> trace provider tool-call and provider-turn runtimes
 -> identify earliest missing/incorrect state
 -> scan for active alternate/legacy coding path
 -> state one repair hypothesis and falsifier
 -> define focused + installed-runtime validation
 -> only then authorize the smallest implementation
```

## Composition-acceptance lesson

Constituent PASS evidence does not establish composed runtime behavior.

Keep these claims separate:

```text
component exists
component is unit/contract validated
component is accepted in isolation
entry point reaches component
entry point composes component with neighboring authorities
installed/user path completes through the full chain
```

A higher-level release claim requires proof at the corresponding composed boundary.

Examples:

```text
R6E ToolReceipt tests PASS
  != installed lbe code produces a ToolReceipt

CLI session persistence PASS
  != installed coding execution reaches governed tools

provider response PASS
  != provider request was authorized/executed

successful command exit
  != requested product behavior succeeded
```

If a composed acceptance test disproves reachability, repair the earliest proven composition owner rather than reopening every lower-layer component.

## R7 proof families after repair observable 3 passes

Only after installed governed coding execution and receipt correlation are restored may R7 continue:

### A — governed coding

A controlled repository path must prove provider request/proposal -> LBE authorization -> registered governed execution -> `ToolReceipt` -> provider continuation -> required validation -> persisted validated completion.

### B — provider switch

The same persistent session/workspace policy must continue under another provider/model without moving authority out of LBE.

### C — resume after workspace change

Checkpoint, external workspace change, resume, stale-source invalidation, current workspace reinspection, and preserved active constraints must be proven.

### D — audit mode

Read-only current-workspace inspection, reference-pattern use only as lower-authority guidance, deterministic guards/validation, and no mutation must be proven.

### E — escalation/denial

Out-of-authority operation requests must remain blocked/denied until actual authority changes; provider reasoning cannot self-upgrade permissions.

### F — completion/release integrity

Receipt/provider correlation, evidence-owned completion, fresh-process terminal-state persistence, secret/state exclusion, installed regression, and clean release inputs must be proven before release readiness.

These are proof targets, not presumed implementation gaps.

## Evidence rule

Acceptance claims must bind to the real authority/execution chain:

```text
request/session/task identity
-> provider tool request/proposal
-> registered governed capability
-> authorization decision
-> structured ToolReceipt
-> receipt-backed continuation
-> current workspace evidence
-> deterministic validation evidence
-> persisted terminal state
```

Lower-level evidence cannot justify a higher-level completion claim.

## Anti-repeat lessons

Future agents must not:

- use a lower-layer acceptance as proof that an installed entry point composes it;
- reopen accepted R6C/R6E simply because the installed route does not reach them;
- add a second dispatcher or authorization layer to solve a wiring/composition defect;
- continue later R7 checks after a mandatory earlier observable fails;
- treat source/unit tests as installed-path evidence;
- infer governed execution from model output rather than receipts/handler evidence;
- treat an exit code or wrapper PASS as semantic product PASS;
- turn harness syntax/encoding/transport failures into product defects;
- weaken validation to make a fixture pass;
- claim R7 from a subset of proof families;
- unlock implementation or release progression without the current project machine/human gate.

## Documentation rule

Project-specific chronology, exact commands, fixture paths, revision heads, receipt IDs, failure attempts, and proof matrices belong in the project repository.

GPT-Knowledge retains:

- routing to the current project authority;
- durable architecture interpretation only when revalidated;
- reusable evidence/composition rules;
- anti-assumption lessons.

This page must never outrank or compete with the project's live gate, source, or runtime evidence.
