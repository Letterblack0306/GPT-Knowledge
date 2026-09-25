# Canonical Agent -> LBE Execution Path

Status: **CURRENT PRODUCT HANDOFF — FOLLOW THE FIRST UNPROVEN SEAM**

## Current authority and product identity

- Product: **LBE**
- Normal user entrypoint: **`lbe`**
- Final user surface: one LBE-branded coding IDE CLI/TUI.
- Runtime authority: LBE Agent Wall.
- Validation runtime: `C:\Agents-Memory-Tool-v6-validation`.
- Evidence workspace: `C:\Agents-Memory-Tool-v6-integration`; preserve it and inspect it read-only.
- Rust/Ratatui is the canonical visible LBE terminal implementation selected by the product owner on 2026-09-18.
- Existing LBE HTML/React work is retained as visual/interaction reference and reuse input; simulated browser state is never runtime truth.
- Cline is embedded/reused headlessly for reasoning, provider/model interaction, tool proposals, continuation and response composition. It is not the visible product UI and is not an independent session, policy, execution, receipt, evidence or completion authority.
- The old Textual preview/fabrication path and copied/rebranded Cline UI paths are not accepted final product paths.

The machine gate remains authoritative. Do not rewrite it to make documentation pass. Current gate: `INSTALLED_PTY_CONPTY_AND_FINAL_PRODUCT_ACCEPTANCE`; active slice: `LBE_OWNED_RUST_TUI_PRODUCT_SURFACE`; status: **OPEN**.

## Ownership boundary

| Area | Sole owner |
|---|---|
| Cognition, investigation, planning, interpretation, replanning, tool proposals | Agent/provider, using embedded Cline mechanics |
| Workspace/session/revision identity, mode and policy | LBE |
| Capability registration, authorization and approval | LBE |
| Tool execution and operation identity | LBE governed adapters/orchestrator |
| ToolReceipt and evidence persistence/provenance | LBE |
| Provider continuation transport | Cline mechanics behind LBE authority |
| Persistence, recovery, validation and completion truth | LBE |
| Requests, controls and timeline/UI projection | LBE product client |
| Procedures | Skills |
| Historical context | Memory/history with provenance only; never current truth by itself |

Hard rule: the agent/provider may propose; LBE decides and executes. No direct filesystem, shell, MCP, session, receipt, evidence or completion bypass may be introduced.

## Required end-to-end flow

Follow this flow for every user request:

```text
user request
 -> select normal coding, audit, investigation or plan mode
 -> load applicable instructions and skills
 -> recall memory/history with provenance and mark it HISTORICAL
 -> resolve workspace, repository, branch/revision and session identity
 -> formulate the evidence question and required observable
 -> agent/provider reasons and produces a bounded plan/proposal
 -> propose a registered capability/tool
 -> LBE applies mode, policy, authorization, target and approval rules
 -> ALLOW / DENY / WAIT is persisted for the operation
 -> governed LBE adapter executes with operation/correlation identity
 -> provider receives the governed result and may continue
 -> LBE persists ToolReceipt and Evidence from the real operation
 -> validation evaluates the required observable
 -> persistence/recovery records the durable session and event state
 -> completion authority returns COMPLETE, BLOCKED, FAILED or UNVERIFIED
 -> LBE UI projects the real session/timeline/tool/receipt/evidence/validation state
 -> user receives the coding or audit result
```

Mode is operational, not an LLM personality. Normal coding is task-proportional. Audit is strict and evidence-directed: random file inspection, unsupported “looks good” claims and normal-mode proof are not sufficient. Audit must identify the claim, source, observable, falsifier and acceptance condition.

## State and evidence vocabulary

Every claim must be classified explicitly:

- CURRENT: supported by current source, gate, runtime or repository evidence.
- HISTORICAL: prior decision or prior run; context only.
- IMPLEMENTED: source exists, but behavior is not yet proven.
- PROVEN: current claim-matched evidence exists at the owning layer.
- DOCUMENTED: stated in an authoritative current document.
- UNVERIFIED: no claim-matched proof yet.
- STALE: contradicted or superseded by newer authority.
- BLOCKED: a concrete dependency prevents the required proof.
- SUPERSEDED: retained history that no longer controls execution.

Do not promote IMPLEMENTED, DOCUMENTED or historical PASS to PROVEN without current matching evidence.

## Current first missing live seam

`LBE_OWNED_RUST_TUI_PRODUCT_SURFACE`.

The next agent must reconcile the production-reachable `lbe` path so it launches the selected Rust/Ratatui LBE client, uses one authoritative LBE session/runtime, invokes Cline only as headless reasoning/provider mechanics, and projects real provider/model/event/context state. Any preview state or fabricated receipt/evidence value reachable from normal launch is a FAIL for final-product acceptance.

Do not reopen LBE Core owners. Reuse existing session, provider, authorization, ToolRegistry, governed execution, receipt, evidence, persistence, validation and completion owners.

## Required proof sequence

1. Establish current source, machine gate and local evidence without mutating the local evidence workspace.
2. Map the single `lbe` entrypoint and all production-reachable call edges.
3. Remove or isolate only production-reachable synthetic/preview state; do not alter tests/demo fixtures without need.
4. Bind provider/model discovery and embedded Cline continuation to the authoritative LBE session.
5. Prove read/search, approval, exactly-once mutation and registered process execution through LBE.
6. Prove displayed receipts/evidence equal persisted records by correlation/session/turn identity.
7. Prove validation and completion come from LBE.
8. Exercise the installed artifact in a real Windows TTY/ConPTY: launch, input, submit, Ctrl+C, quit, terminal restoration and no orphan process.
9. Exit, relaunch and resume the same persisted session with workspace, mode, provider/model, receipts, evidence and history.
10. Report each slice using source owner, files read/changed, reused owners, tests, runtime proof, installed proof, status and one next blocker.

Final acceptance is BLOCKED unless the complete installed chain is exercised. Source presence, imports, unit tests, build success, screenshots, provider configuration presence or an old PASS checkpoint do not close it.

## Historical material

Google Drive/chat history and older client notes may explain rationale and previous decisions. They must not override current GitHub main, current machine governance, current source, current runtime evidence or current local validation evidence. If a connected memory/MCP retrieval fails, report the failure and continue from authoritative repository/runtime evidence.

## 2026-09-25 audit reconciliation

Newer September 24 audit-session evidence was compared against this canonical path.

Result: **architecture aligned; acceptance remains open**.

- **Rust timeline / Workstream C:** authoritative session/turn/operation/receipt/evidence data reaches the Rust client, but conversational runtime state is still largely flattened into transcript strings. The permitted implementation is presentation-only typed timeline projection from existing events; no Rust-local authority may be introduced.
- **Provider/model binding / Workstream D:** the reproduced failure was persisted session model versus stale ProviderConfig model. The existing `bind_provider_config_to_session` composition seam is the correct owner. A narrow follow-up imported the helper and updated stale focused tests; a direct smoke check passed, but pytest was unavailable in that audit interpreter, so the candidate is not promoted to runtime-proven.
- **Receipts/exactly-once / Workstream E:** isolated receipt, continuation, replay and evidence mechanisms exist, but durable operation fingerprint + ToolReceipt/evidence correlation across installed continuation and process restart remains unproven. Reuse existing persistence/history owners; do not create a second receipt or dispatch authority.
- **Legacy Textual / Workstream G:** `lbe_guard_inspector/textual_tui.py` remains historical/diagnostic and is not canonical-`lbe` reachable. Synthetic preview receipt/evidence text is not runtime proof. The clean-install verifier was corrected to inspect the actual module path without importing Textual.

This reconciliation supersedes any GPT-K projection that says final installed acceptance is currently PASS/CLOSED without newer claim-matched installed evidence. Historical PASS records remain history; they do not override the open proof sequence above.

## 2026-09-25 late runtime-proof continuation

Classification: **ARCHITECTURE PRESERVED / RUNTIME CHAIN ADVANCED / INSTALLED ACCEPTANCE OPEN**

The current local LBE evidence narrows the remaining work without changing the canonical authority model.

### Newly proven current behavior

At local workspace `C:/Agents-Memory-Tool-v6-integration`:

- `1286b6a` persists operational history for single-shot governed turns. Completed and failed turns now leave an operational turn, reasoning item, and requested/completed-or-failed events correlated with provider/model, runtime operation, guard/result identity, and evidence references before return/raise.
- `4908ff1` makes provider config loading BOM-tolerant (`utf-8-sig`) and preserves real provider error detail through the OpenAI-compatible adapter/governed-coding path.
- A bounded OpenRouter coding request passed provider admission; the earlier 131072-token request defect is no longer the active provider blocker.
- The effective **requested output bound** is observable in turn metadata and may be explicitly overridden.
- Seven governed tools were projected with LBE verdict/risk metadata while direct native mutation tools remained unexposed.
- A real coding completion contract was created and evaluated. The observed `VALIDATION_FAILED` result was truthful, not a validator defect.

### Provider/model capability is not LBE-authored context capacity

Keep these distinct:

```text
provider/model context window + provider/model max output
= discovered/configured capability facts

LBE default/max requested output
= outbound request policy

per-turn requested output
= concrete request parameter
```

LBE may reject an outbound request that exceeds its own request policy, but it must not invent the provider/model context window.

Use distinct failure causes for model capability/configuration, LBE request policy, context-fit, provider quota, and credentials.

### Earliest current defect

The live read-only coding probe produced a legitimate governed `workspace.read` tool request and a real completion contract. The contract failed correctly because:

- `source_change`: no governed mutation occurred;
- `focused_test`: the evidence producer invoked hardcoded `python`, which resolves to Python 3.10 without pytest on this machine;
- `git_status`: no governed source change existed.

Therefore:

```text
VALIDATOR = NOT DEFECTIVE
NEXT OWNER = shared >=3.11 interpreter resolver for focused-test evidence production
```

Reuse the existing interpreter-resolution owner used by the launcher/runtime. Do not move interpreter selection into validation semantics.

### Remaining proof order

```text
shared validation interpreter
-> real bounded governed source mutation
-> persisted governed_operations + ToolReceipt/evidence + passing completion contract
-> crash-seam exactly-once/restart replay
-> changed-payload rejection
-> installed artifact provenance
-> real Rust/Ratatui PTY/ConPTY acceptance
-> release readiness
```

The crash-seam requirement is explicit: if a side effect succeeds and its governed operation is durable but the process dies before completion finalization, restart/replay must not execute the side effect twice.

Historical R3-R7 PASS remains preserved as historical accepted baseline. These newer proofs do not rewrite that history and do not yet establish current installed-product PASS.
