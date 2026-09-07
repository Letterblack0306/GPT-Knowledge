# LBE Cross-Workspace Product Contract

Status: CURRENT GPT-K ROUTING / OWNERSHIP CONTRACT  
Updated: 2026-09-07

## Purpose

Define the relationship between the two canonical LBE repositories and prevent separate-repository identity from being misclassified as a conflict.

## Canonical repositories

| Workspace | GitHub repository | Role |
|---|---|---|
| `C:\Agents-Memory-Tool-v6-integration` | `Letterblack0306/LBE_Presistent_Agent_wall` | LBE runtime/governance authority |
| `C:\LBE-TUI-Lab` | `Letterblack0306/LBE_Agents_wall_Intigration` | LBE product/client/integration workspace |

These repositories are intentionally separate. Different repository names are **not** a repository-identity mismatch.

The architectural boundary is:

```text
LBE CLI/TUI product/client workspace
        ↓
bounded client/runtime adapter
        ↓
LBE runtime/governance workspace
```

## Locked ownership

```text
LBE CLI/TUI
    = user-facing product

Cline
    = embedded provider/model/auth/reasoning/delegated-agent mechanics

LBE runtime
    = sole owner of:
      workspace/session truth
      policy/authorization
      ToolRegistry/governed execution
      operation identity
      ToolReceipts/evidence
      persistence/recovery
      deterministic validation
      completion truth

Rust/Ratatui
    = reference/integration client
```

## Current backend workspace recovery state

Three-way local/canonical comparison now establishes the recovery state more precisely.

```text
C:\Agents-Memory-Tool-v6-integration
    remote: Letterblack0306/LBE_Presistent_Agent_wall
    local HEAD: 815dfc03e256b5...
    relevant deletions: STAGED IN INDEX, not committed

C:\Agents-Memory-Tool-v6-validation
    remote: Letterblack0306/LBE_Presistent_Agent_wall
    HEAD: a17b0144269bcb...

canonical GitHub main:
    03a90ce22222c0e3ab4fd1c9a9629b3a1f7daa7e
```

For these four files:

```text
docs/acceptance/LBE_PRODUCT_INTEGRATION_MACHINE_CHECK.md
lbe_guard_inspector/cline_reasoning_provider.py
lbe_guard_inspector/coding_reasoning_provider.py
lbe_guard_inspector/first_party_reasoning_provider.py
```

the content is reported **byte-for-byte identical** in:

```text
integration HEAD 815dfc03...
validation HEAD a17b014...
origin/main 03a90ce...
```

The integration index stages their deletion:

```text
D  docs/acceptance/LBE_PRODUCT_INTEGRATION_MACHINE_CHECK.md
D  lbe_guard_inspector/cline_reasoning_provider.py
D  lbe_guard_inspector/coding_reasoning_provider.py
D  lbe_guard_inspector/first_party_reasoning_provider.py
```

Additional canonical files are also reported staged for deletion locally:

```text
D  tests/test_first_party_reasoning_provider.py
D  tools/lbe_product_integration.ps1
```

Both additional paths are present on current canonical GitHub main.

### Classification

```text
origin/main                         = canonical recovery source
validation                         = not the unique source of these files
copy validation -> integration     = not required
integration staged deletions       = explicit staged local state
deletion rationale/acceptance      = UNVERIFIED
restore/delete decision            = BLOCKED pending review of why they were staged
```

A staged deletion proves that the index contains a deletion candidate. It does **not** by itself prove the deletion is architecturally intended, accepted by governance, or safe to commit.

Recovery rule:

```text
preserve current integration index/worktree
→ inspect provenance/reason for staged deletions
→ compare against current machine gate and active owner docs
→ if deletion is not accepted, restore from canonical origin/main
→ if deletion is accepted, prove replacement ownership and affected tests/verifier behavior
→ only then decide validation-checkout disposition
```

Do not copy from validation merely to restore canonical content, and do not delete validation solely because these files are recoverable elsewhere; first rule out genuinely unique local/runtime/config evidence.

## Production CLI user path

The final product must be exercised through the real **LBE CLI/TUI product path**, not through backend command-runner probes.

Normal production use is:

```text
user launches LBE CLI/TUI
    ↓
embedded Cline CLI/provider/model experience
    ↓
Cline provider authentication / provider selection / model selection
    ↓
bounded LBE adapter/session bridge
    ↓
LBE authorization / governed tools / receipts / evidence / persistence / validation / completion
    ↓
results projected back in the same CLI/TUI
```

The following are **diagnostic/developer surfaces only** and must not be treated as the production user workflow:

```text
python server.py --port ...
node dist/index.js from an internal package directory
manual reasoning-provider.json endpoint editing
direct backend tool/authorization commands
isolated provider HTTP probes
```

These may diagnose lower-level seams, but production readiness requires the real CLI to own the user interaction and Cline to own provider/model loading internally while LBE retains consequence authority.

A production-ready acceptance claim therefore requires at minimum:

```text
1. canonical LBE CLI launcher resolves without manual source-path surgery
2. Cline provider/auth/model selection is available from the CLI experience
3. selected model is bound into the LBE session through the bounded adapter
4. a normal conversational turn executes through LBE
5. governed tool proposals route through LBE authorization
6. receipts/evidence/continuation project back in the CLI
7. quit/restart/resume works from the installed product
8. no manual server.py or internal node command is required for normal use
```

Manual `reasoning-provider.json` editing is not an accepted production UX requirement. If retained internally, it is implementation/configuration plumbing only and must be populated or derived by the product/runtime integration rather than by the end user during normal CLI use.

## Single-output production contract

The final product has one normal user-facing output surface: the complete LBE CLI/TUI.

Internal backend processes, adapters, provider workers, registries, verifiers, and diagnostic CLIs may exist as implementation details, but they must not fragment the normal user workflow into multiple terminals or require the user to understand internal ownership boundaries.

The production contract is:

```text
ONE ENTRYPOINT
    → ONE LBE CLI/TUI
    → ONE coherent session
    → provider/model selection inside the product
    → all governed agent behavior inside the product
    → one visible chronology of conversation, execution, approvals, evidence and completion
```

Agent/developer behavior must not convert an incomplete product into an interactive troubleshooting dialogue with the user. If implementation is incomplete, the engineering agent should inspect evidence, implement the missing accepted scope, validate it, and continue until blocked by a genuine external dependency or explicit governance restriction.

"Ready to use" is therefore a final acceptance verdict, not a request for the user to choose diagnostic commands.

## Client acquisition / entrypoint status

Current canonical GitHub inspection found:

```text
Letterblack0306/LBE_Agents_wall_Intigration main

cline/         MISSING
begin/         MISSING
run-cline-lbe.ps1  PRESENT
```

The canonical remote launcher currently defaults to a vendored path under:

```text
cline\apps\cli\dist\cli-windows-x64\bin\cline.exe
```

which is absent on canonical main.

A newer local-workspace report states that the local launcher resolves an npm-installed `cline` via `Get-Command cline`. Until the local behavior is reconciled to canonical GitHub, classify the exact client acquisition path as:

```text
PRODUCT ROLE                  CURRENT
CLIENT SOURCE/ACQUISITION     MISALIGNED
CANONICAL CLEAN-CLONE LAUNCH  BLOCKED
LOCAL NPM CLIENT PATH         LOCAL_REPORTED
```

Do not change the locked product boundary merely because the acquisition path is unresolved.

## Product-surface evidence separation

Cross-workspace feature inventories must distinguish three surfaces:

```text
A. LBE backend Python CLI/runtime controls
B. Rust/Ratatui reference/integration client
C. current LBE CLI/TUI product surface using Cline mechanics
```

Backend command availability or Rust `UserRequest`/panel coverage does **not** by itself prove the current LBE CLI/TUI exposes or has live-accepted the same user-facing feature.

Use claim-specific columns:

```text
backend owner/runtime      -> PROVEN / IMPLEMENTED / UNVERIFIED
Rust reference client      -> IMPLEMENTED / PROVEN only for its own claim
current LBE CLI/TUI        -> separately PROVEN or UNVERIFIED
```

This prevents a large Rust feature inventory from being misreported as accepted Cline-based product capability.

## Backend gate vs client gate mapping

Backend acceptance gates and client roadmap gates are not required to share names. They are different layers.

Current mapping:

```text
BACKEND / RUNTIME AUTHORITY
PARENT_CONTINUATION_AND_DEEP_CORRELATION
    -> proves backend/runtime child-result continuation and correlation

CLIENT / PRODUCT SURFACE
CLIENT_ACQUISITION_AND_ENTRYPOINT_RECONCILIATION
    -> establish reproducible LBE CLI client
CLINE_LBE_STRUCTURAL_VISUAL_DIFFERENTIATION
    -> establish final LBE product shell
INTERACTIVE_CLINE_TTY_ACCEPTANCE
    -> prove real terminal interaction/render
FINAL_INSTALLED_END_TO_END
    -> prove complete installed product
```

Historical Rust roadmap labels such as `P0..P10`, `TUI_P2_P3_GOVERNED_EXECUTION_INTEGRATION`, or `ACTIVE — RUST/RATATUI CLIENT` are **client-history/reference planning**, not the current product gate sequence.

## RealLbeWrapper interpretation

`RealLbeWrapper` belongs to the Rust/Ratatui reference/integration path.

Therefore:

```text
backend installed/runtime acceptance PASS
!=
RealLbeWrapper live integration PASS
```

There is no contradiction when the LBE runtime is accepted while the Rust reference client's live adapter remains unproven. They are separate claims.

Source implementation of `RealLbeWrapper` is classified independently from live attachment:

```text
wrapper source implementation    IMPLEMENTED
live runtime attachment          PROVEN only with claim-matched runtime evidence
```

## Installed runtime relationship

An installed runtime such as `C:\LBE_RUNTIME_PY312` must not be treated as current merely because the directory exists.

Required relationship evidence:

```text
source revision
    ↓
build/package provenance
    ↓
installed artifact/version
    ↓
launcher/config selection
    ↓
runtime proof
```

If current source/config does not bind that installation explicitly, classify it as an installed artifact whose relationship to the active source must be revalidated.

## Historical chat files

Missing `Chat histroy/*.json` references are provenance/documentation issues, not product runtime blockers unless an active gate or tool depends on them.

## Evidence vocabulary

Cross-workspace reporting should use the shared evidence classes:

```text
PROVEN
IMPLEMENTED
DOCUMENTED
INFERRED
UNVERIFIED
STALE
BLOCKED
```

Subsystem-native verdicts such as `PASS`, `FAIL`, `DENY`, `ALLOW`, `INSUFFICIENT_EVIDENCE`, or machine-gate states should be preserved as raw verdicts, then mapped to one of the shared evidence classes when comparing across workspaces.

Examples:

```text
machine gate PASS            -> PROVEN for that bounded gate
source present, no runtime   -> IMPLEMENTED
old roadmap entry            -> STALE when superseded
missing required runtime     -> BLOCKED or UNVERIFIED depending on causality
```

## Cleanup rule

Workspace cleanup is separate from product acceptance.

Do not delete `begin/`, `dist/`, `cline/`, logs, test outputs, runtime state, or other artifacts merely because a cleanup plan names them.

Before deletion:

1. prove the item is non-authoritative and unused;
2. distinguish tracked, untracked, generated, and runtime-state files;
3. preserve unrelated user work;
4. update `.gitignore` only for genuinely generated/non-source artifacts;
5. never treat cleanup completion as product acceptance.

## Version compatibility contract

Until an explicit machine-readable compatibility schema exists, the client/runtime compatibility contract is:

```text
client revision
+ launcher/client acquisition identity
+ LBE runtime revision
+ command/schema compatibility
+ runtime acceptance evidence
= compatible assembled product
```

A future compatibility manifest may formalize these fields, but GPT-K must not invent supported version ranges without source/runtime evidence.

## Authority rule

This document is a GPT-K projection. Current source, machine governance, runtime evidence, acceptance checkpoints, and canonical GitHub repository state outrank it for present-state claims.
