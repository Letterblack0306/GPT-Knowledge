# Cline Selected Reasoning-Agent Source — 2026-09-02

**Classification:** REFERENCE_NON_CANONICAL / CURRENT PROJECT-TRUTH CHECKPOINT  
**Purpose:** Record the current LBE product decision that Cline is the selected reasoning-agent source while preserving LBE as the sole canonical authority for governed consequences and completion truth.

## Current selection

The current LBE project state reported from the authoritative local workspace records Cline as the selected reasoning-agent source.

```text
Cline Agent / AgentRuntime / ClineCore
    = reasoning, planning, tool proposals,
      continuation, response composition

LBE
    = identity, workspace boundary, policy,
      authorization, governed execution,
      ToolReceipts, evidence, persistence,
      validation, completion truth
```

This selection does **not** make Cline a second LBE authority.

## Governance evidence reported from the LBE workspace

The selection was recorded in:

```text
C:\Agents-Memory-Tool-v6-integration\.lbe\governance\implementation-gates.json
C:\Agents-Memory-Tool-v6-integration\docs\acceptance\CURRENT_IMPLEMENTATION_GATE.md
C:\Agents-Memory-Tool-v6-integration\docs\governance\PROJECT_INTENT_LEDGER.md
C:\Agents-Memory-Tool-v6-integration\docs\IMPLEMENTATION_PLAN.md
C:\Agents-Memory-Tool-v6-integration\.agent\evidence\CURRENT_TASK.md
```

Reported validation for this selection-only governance change:

```text
machine gate JSON                    PASS
focused governance/UI tests         PASS — 34
 git diff --check                    PASS
previous completed full regression  PASS — 840
runtime/product implementation       NOT CHANGED IN THIS STEP
unrelated dirty work                 PRESERVED / UNSTAGED
```

Because this checkpoint is written from the reported local authoritative workspace state, exact live/product implementation claims still require current source/runtime evidence from that workspace.

## Reasoning-agent ownership

Cline may own the cognitive/runtime mechanics needed for the selected reasoning-agent role, including where actually integrated:

- understanding user intent;
- reasoning and planning;
- provider-driven agent-loop continuation;
- tool proposal generation;
- consumption of governed tool results;
- replanning after evidence/results;
- response composition;
- cancellation/abort/ordering mechanics where adapted.

ClineCore/AgentRuntime mechanics may be reused for stateful runtime assembly, provider interaction, session mechanics, tools, approval callbacks, persistence, MCP, and related agent-loop facilities only when they are adapted so that LBE remains the canonical owner of authority-bearing consequences.

## LBE ownership remains unchanged

LBE remains authoritative for:

- workspace/project/session/turn identity;
- provider/model truth where exposed as canonical product state;
- mode, policy and authorization;
- ToolRegistry and registered capability truth;
- governed filesystem/process/tool/MCP execution;
- operation identity and duplicate-side-effect protection;
- ToolReceipt creation and correlation;
- evidence provenance;
- canonical persistence/recovery truth;
- deterministic validation;
- accepted completion truth.

Provider/Cline completion prose is not itself accepted LBE completion truth.

## Mandatory adaptation boundary

Native Cline authority-bearing execution paths must not bypass LBE.

The product execution path must be equivalent to:

```text
user request
    ↓
Cline reasoning agent
    ↓ proposes capability/tool action
LBE registered capability boundary
    ↓
LBE authorization
    ↓
LBE GovernedToolOrchestrator / approved adapter
    ↓
workspace / process / MCP / external capability
    ↓
LBE ToolReceipt + evidence
    ↓
Cline continuation consumes governed result
    ↓
LBE validation / completion truth
    ↓
product UI projection
```

Therefore direct native Cline shell, filesystem/editor/patch, MCP, session authority, receipt/evidence authority, or completion authority must be disabled, omitted, intercepted, or adapted through LBE before product execution.

## OpenCode relationship

OpenCode remains an approved reusable mechanics/reference source behind LBE-owned adapters, but it is **not the selected reasoning-agent implementation in this checkpoint** unless newer canonical evidence changes that decision.

```text
Cline      = SELECTED reasoning-agent source
OpenCode   = APPROVED reuse/reference source
LBE        = CANONICAL governance/runtime authority
```

## What this checkpoint does not prove

This selection step does not by itself prove:

- installed authenticated provider execution;
- a complete live Cline → LBE tool proposal/authorization/execution cycle;
- live writable mutation;
- MCP DENY = zero execution;
- MCP ALLOW = exactly one execution;
- receipt/evidence persistence/order across the full live path;
- session restart/recovery/resume;
- final interactive product acceptance.

Those remain claim-matched runtime acceptance gates.

## Supersession rule

This checkpoint supersedes older GPT-K wording that classifies Cline only as a generic reference source.

Use instead:

```text
Cline = selected reasoning-agent source for LBE.
LBE = sole authority for governed capabilities, consequences,
evidence, persistence, validation and completion.
```

Older statements such as:

```text
Cline = provider/session/tool/approval/MCP/diff mechanics reference only
```

are now **STALE / SUPERSEDED** where they imply Cline is not the selected reasoning-agent source.

## Current classification

```text
Cline selected reasoning-agent source        REPORTED CURRENT / GOVERNANCE VALIDATED
Cline second LBE authority                   PROHIBITED
LBE authority boundary                       PRESERVED
OpenCode selected agent                      NO — REFERENCE/REUSE SOURCE
runtime implementation changed in selection  NO
live product determinism                     NOT YET PROVEN
```
