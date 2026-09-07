# LBE Persistent Agent Wall — Current Project Mirror

## Authority and routing

- Reconciled projection: 2026-09-07
- Runtime/governance repository: `Letterblack0306/LBE_Presistent_Agent_wall`
- LBE product/integration repository: `Letterblack0306/LBE_Agents_wall_Intigration`
- LBE workspace: `C:\Agents-Memory-Tool-v6-integration`
- Product/integration workspace: `C:\LBE-TUI-Lab`
- Authority: this document is a GPT-Knowledge projection only. Current LBE source, machine governance, workspace/runtime evidence and raw acceptance records remain authoritative.

## Current canonical remote heads

```text
LBE runtime/governance main:
03a90ce22222c0e3ab4fd1c9a9629b3a1f7daa7e

LBE product/integration main:
29a6d32148186401ca764348d68a1bca9b31aee7
```

These are remote-source identity checkpoints only. Current local workspace/runtime evidence still outranks them for unpublished local state.

## Core architecture

```text
Agent/provider reasons.
LBE governs.
Registered capabilities execute.
Evidence and ToolReceipts persist.
Validation decides completion.
The interface projects the result.
```

LBE remains the established authority for workspace/session identity, mode/policy, authorization, governed execution, operation identity, receipts/evidence, persistence, validation and completion.

The active user-facing product is the **LBE CLI/TUI**. It reuses Cline provider/model/reasoning/delegated-agent mechanics while LBE remains the sole runtime/governance authority. The exact current Cline client acquisition/source path is under reconciliation: canonical product-repository `main` does not contain the previously documented `cline/apps/cli` subtree, while newer local evidence reports an npm-installed `cline` launch path. Do not promote either path to canonical until reconciled.

The Rust/Ratatui surface in `C:\LBE-TUI-Lab\src` remains a reference/integration client. It does not recreate LBE runtime or governance authority and is not the primary product UI.

## Truth hierarchy

```text
Design                     = what should happen
Acceptance records         = what happened for a bounded slice
Machine governance         = what is allowed now
Current runtime evidence   = what is true now
```

When these disagree, the disagreement must be classified instead of guessed. Historical proof remains preserved but cannot silently override current runtime truth.

## Current bounded live acceptance

The following paths are reported and validated as PASS:

```text
Audit live provider round trip
Plan / investigation provider turn
Runtime / read-only coding turn
Governed workspace.read
Authorization before execution
Real ToolReceipt/evidence correlation
Provider continuation after tool result
Read-only workspace.patch denial
Malformed/denied provider tool handling
Rust real-wrapper projection
```

The provider/model used for the accepted live paths is:

```text
provider = openai-compatible
model    = qwen/qwen3-vl-8b
```

The proven governed tool flow is:

```text
provider/model
→ LBE persisted session
→ mode-specific runtime
→ provider request
→ LBE authorization
→ registered tool execution
→ ToolReceipt/evidence
→ provider continuation
→ completed turn
→ Rust/Ratatui TUI projection
```

## Read-only mutation denial

A read-only Runtime `workspace.patch` attempt was denied before handler execution.

```text
Authorization = DENY
Result        = DENIED
Error         = AUTHORIZATION_DENIED
Handler       = NOT EXECUTED
Mutation      = NONE
```

This demonstrates that exposing a capability or UI control does not grant authority. LBE policy remains the execution boundary.

## Regression evidence

```text
Full Python suite                    813 passed
Duration                             497.59 seconds
Rust suite                           148 passed
Focused provider/tool/governance      61 passed
Malformed/denied tool checks           6 passed
Python compilation                    PASS
git diff --check                      PASS with line-ending warnings only
```

The earlier full-suite timeout uncertainty is resolved; the full Python suite subsequently completed successfully.

## Backend local recovery status — 2026-09-07

Three-way comparison has narrowed the backend recovery issue.

```text
integration checkout:
C:\Agents-Memory-Tool-v6-integration
local HEAD = 815dfc03e256b5...
relevant canonical files = staged for deletion

validation checkout:
C:\Agents-Memory-Tool-v6-validation
HEAD = a17b0144269b...

canonical GitHub backend main:
03a90ce22222c0e3ab4fd1c9a9629b3a1f7daa7e
```

Four previously suspected validation-only files are byte-identical across integration HEAD, validation HEAD, and canonical origin/main:

```text
docs/acceptance/LBE_PRODUCT_INTEGRATION_MACHINE_CHECK.md
lbe_guard_inspector/cline_reasoning_provider.py
lbe_guard_inspector/coding_reasoning_provider.py
lbe_guard_inspector/first_party_reasoning_provider.py
```

The integration index stages deletion of those four plus at least:

```text
tests/test_first_party_reasoning_provider.py
tools/lbe_product_integration.ps1
```

The latter two also exist on canonical GitHub main.

Current evidence classification:

```text
canonical recovery source                  origin/main
validation unique-source claim             FALSE for the compared files
staged deletion state                      PROVEN LOCALLY
deletion rationale                         UNVERIFIED
deletion accepted by current architecture  NOT PROVEN
safe to commit staged deletions            BLOCKED pending review
```

Do not restore or commit these paths automatically. First determine why they were staged and whether current runtime owners, tests, verifier contracts, or machine governance still require them.

## Runtime impact of staged provider deletion — 2026-09-07

A direct local runtime attempt from `C:\Agents-Memory-Tool-v6-integration` failed during import:

```text
python server.py --port 8766
ModuleNotFoundError:
No module named 'lbe_guard_inspector.coding_reasoning_provider'
```

The failure path is:

```text
server.py
→ reasoning_runtime.py
→ provider_registry.py
→ coding_reasoning_provider.py
```

This proves the staged deletion is not merely cosmetic repository state: the missing provider module currently prevents the backend server from starting in that working tree.

Classification:

```text
staged deletion state                     PROVEN
runtime break caused by missing provider  PROVEN
deletion rationale                        UNVERIFIED
safe to commit deletion                   BLOCKED
temporary runtime restoration             MAY BE USED ONLY WITH INDEX-PRESERVING METHOD
```

Important Git semantics: `git checkout HEAD -- <path>` updates both the working tree and index, so it would **unstage/reject the staged deletion** for those paths. It must not be described as preserving the staged deletion.

If runtime-only restoration is required while preserving the index state for investigation, use an index-preserving worktree-only method and verify the cached deletion still exists afterward. Any such local restoration remains a temporary diagnostic step, not acceptance of the deletion.

## Production CLI acceptance rule — 2026-09-07

The user-facing acceptance target is the real LBE CLI/TUI, not a backend command runner.

```text
PRODUCTION USER PATH
LBE CLI/TUI
→ Cline provider/auth/model selection
→ LBE session/runtime bridge
→ LBE-governed execution
→ ToolReceipt/evidence/continuation
→ same CLI/TUI
```

Developer probes such as `python server.py`, direct internal `node dist/index.js`, raw provider HTTP calls, or hand-editing `reasoning-provider.json` may establish lower-level evidence only. They do not satisfy product acceptance and must not be prescribed as the normal end-user workflow.

The product is not production-ready until the canonical launcher can start the intended CLI from an installed/clean surface, the user can load/select a model through Cline's provider/model experience, and a normal conversation completes through LBE without requiring manual backend startup/configuration steps.

## Current product gates

Do not promote source implementation, focused tests, or historical acceptance into a claim that the current product shell or installed product is accepted.

Current canonical product-verifier state places **structural LBE visual differentiation before interactive TTY acceptance**.

```text
CLINE_LBE_STRUCTURAL_VISUAL_DIFFERENTIATION
    status: FAIL_CURRENT_IMPLEMENTATION
    ↓
INTERACTIVE_CLINE_TTY_ACCEPTANCE
    status: PENDING_AFTER_VISUAL_REWORK
    ↓
parent continuation / deep receipt-provider correlation
    OPEN unless separately proven
    ↓
canonical verifier prove
    OPEN unless current harness result is captured
    ↓
FINAL_INSTALLED_END_TO_END
    LOCKED
```

The structural UI gate requires the active product surface to be more than a renamed/recolored Cline landing page. The accepted target is the minimal LBE runtime shell:

- persistent LBE/workspace/model/mode/git/context hierarchy;
- one conversation/execution timeline;
- bounded three-line active raw process viewport;
- click-to-expand emitted process output;
- completed-process auto-collapse to one line;
- `[I]` composer identity;
- bouncing activity indicator;
- context-usage projection.

A real Windows terminal/TTY run remains required after this source-level visual gate passes.

## Machine-governance note

This GPT-K reconciliation does not invent the current active machine slice. When implementation authorization is needed, inspect the canonical LBE machine gate and current acceptance owner directly. Any older GPT-K gate snapshot must be treated as stale until reconciled against that source.

## Current resume point

```text
LBE runtime authority                    ESTABLISHED / GOVERNED
LBE CLI/TUI product role                 ESTABLISHED
Cline embedded mechanics                 ESTABLISHED
Rust/Ratatui role                        REFERENCE / INTEGRATION
Child lifecycle authority                PROVEN
Minimal LBE visual contract              DOCUMENTED
Current visual structural verifier       FAIL_CURRENT_IMPLEMENTATION
Interactive Cline TTY acceptance         PENDING AFTER VISUAL REWORK
Parent continuation                      OPEN / claim-matched proof required
Deep receipt/provider correlation        OPEN / claim-matched proof required
Canonical verifier prove                 OPEN unless current harness PASS is captured
Final installed end-to-end               LOCKED
Release ready                            NO
```


## Authoritative product verification and packaging workflow

The canonical repository already contains a versioned machine verifier/package harness:

```text
Letterblack0306/LBE_Presistent_Agent_wall
tools/lbe_product_integration.ps1
```

As of backend commit `9853e93fe2697f8538fa50b4bc9a3a4fa1e1386e`, this script remains the single product-integration verifier rather than creating a parallel acceptance harness.

Supported modes:

```text
check
prove
build
package
```

Source policy:

```text
check/prove
    -> may validate the assembled local worktree

build/package
    -> forced to origin/main
    -> cannot package uncommitted local state
```

The verifier now covers the current product boundary:

```text
LBE runtime authority
+ LBE CLI/TUI product identity
+ bundled Cline agent/provider/model/delegated-agent mechanics
+ Rust/Ratatui reference-client boundary
```

Current machine checks include:

- canonical repository/worktree identity;
- LBE product-entry and governed-tool contracts;
- ChildAgentRun lifecycle owner reuse;
- `child_agent create|started|complete|failed|cancel` product seam;
- focused child lifecycle/product-seam test presence;
- Cline -> LBE child spawn admission;
- LBE-governed child proxy-only tool surface;
- native child-tool bypass checks at the LBE integration seam;
- recursive-spawn default-deny markers;
- child started/terminal lifecycle projection;
- LBE-only visible branding contract;
- suppression of premature `/team` exposure;
- Python focused/regression proof;
- Cline focused tests and TypeScript typecheck;
- Rust regression/fmt checks;
- build/package blocking when structural or proof gates fail.

Packaging already emits:

```text
integration-manifest.json
checksums.json
LetterBlack-LBE-2.0.3-win-x64-candidate.zip
```

The package mode now re-opens the produced archive and verifies every recorded file SHA-256 and byte size against `checksums.json`. Machine evidence is written to:

```text
package-verification.json
```

A package-integrity PASS still does not fabricate live installed acceptance. Provider completion, real delegated-child execution, real cancellation, receipt/evidence correlation, parent continuation, and installed interactive behavior remain separate runtime proof requirements.

## Current child-agent integration state

Current project truth no longer treats the ChildAgentRun owner as absent.

```text
ChildAgentRun lifecycle owner                         PROVEN
parent/child lineage and lifecycle events             PROVEN
child_agent product command seam                      IMPLEMENTED / accepted in current architecture
Cline delegated-agent mechanics                       ESTABLISHED reuse seam
LBE-governed child capability boundary                ESTABLISHED design/implementation direction
native Cline child-tool authority                     FORBIDDEN
recursive spawn default                               DENY unless explicitly LBE-authorized

parent continuation from persisted child result       OPEN unless separately proven
deep provider/LBE/operation/receipt correlation       OPEN unless separately proven
installed parent→child→parent acceptance               NOT YET ACCEPTED
```

Do not reopen child lifecycle architecture merely because older history said the owner was absent. That statement was corrected after direct inspection of the existing memory/operational-history owner.

## Stale-state corrections

Do not carry the following historical observations forward as current product blockers without fresh evidence:

- `LIVE RUNTIME EXCLUSIVITY = FAIL` with `mcp-filesystem-server.exe`, Context7 MCP, and Playwright MCP is a 2026-09-01 runtime snapshot from the generic MCP ecosystem audit. It requires a fresh process audit before reuse as a present-state LBE claim.
- The historical backend Git topology `ahead 4 / behind 33` is not a current repository-state claim. Revalidate the local backend worktree before using it.
- A full bundled Cline source tree is not itself evidence of an authority-boundary violation. The relevant invariant is whether Cline can bypass LBE ownership for session/governance/tools/evidence/completion.
- Debug-file clutter and minimal `.gitignore` are hygiene concerns, not active product-acceptance gates unless they directly break build/package/verification.
- `RealLbeWrapper` source implementation and method coverage do not imply live runtime attachment. Treat source presence as IMPLEMENTED and live attachment as separately PROVEN/UNVERIFIED according to current runtime evidence.
- The Rust/Ratatui reference client must not be promoted back to primary product status merely because its wrapper/runtime integration is mature.

## Current client-source reconciliation — 2026-09-07

Fresh canonical GitHub inspection found a material client-source mismatch:

```text
Letterblack0306/LBE_Agents_wall_Intigration main
    cline/ directory                    MISSING
    begin/ directory                    MISSING
    Chat histroy/ directory             MISSING
    run-cline-lbe.ps1                   PRESENT
```

The canonical remote launcher currently defaults to:

```text
cline\apps\cli\dist\cli-windows-x64\bin\cline.exe
```

but the `cline/` subtree is absent from canonical `main`. Therefore the canonical remote cannot currently prove a self-contained bundled Cline CLI surface.

A newer local-workspace report says the local launcher instead resolves an npm-installed `cline` command with `Get-Command cline`. That local behavior is **LOCAL_REPORTED** and differs from canonical GitHub. Until reconciled, the exact client acquisition/entry path is classified:

```text
LBE CLI/TUI product role               CURRENT
Cline embedded mechanics               CURRENT
exact bundled source path              MISALIGNED / NOT PRESENT ON REMOTE
local npm-installed client path        LOCAL_REPORTED
canonical remote launcher              BROKEN_BY_MISSING_DEFAULT_CLIENT_PATH
clean-clone product reconstruction     BLOCKED
```

This does not reopen the product ownership boundary. It does block claims that `C:\LBE-TUI-Lab\cline\apps\cli` currently exists in the canonical product repository or that a clean clone can launch the accepted client without additional reconciliation.

Historical chat-export paths under `Chat histroy/` are not product runtime dependencies. Missing copies should be treated as documentation/provenance cleanup, not as a runtime feature blocker, unless a current canonical document explicitly requires them for acceptance.

## Verification invariant

```text
focused test PASS
    != full product PASS

package hash PASS
    != installed runtime PASS

installed live proof
    + required receipts/evidence
    + completion/cancellation truth
    = only then eligible for product acceptance
```
