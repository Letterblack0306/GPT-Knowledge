# LetterBlack Rust/Ratatui CLI — End-to-End Completion Plan

**Classification:** REFERENCE_NON_CANONICAL  
**Mode:** COMPLETION_MODE  
**Goal:** Finish the native LetterBlack Rust/Ratatui CLI as a usable client over the already-complete LBE backend and reach installed manual-user-test readiness without reopening settled architecture.

## Final Product Contract

```text
LetterBlack Rust/Ratatui CLI
        ↓
LbeWrapper / RealLbeWrapper
        ↓
canonical LBE runtime
        ↓
sessions, providers/models, tools, authorization,
execution, MCP/external capabilities, evidence,
ToolReceipts, persistence/recovery, validation,
completion truth
```

Authority rule:

```text
Provider reasons.
LBE governs.
Registered capabilities execute.
Evidence and ToolReceipts persist.
Validation decides completion.
Rust projects the result.
```

Rust/Ratatui must not become a second provider runtime, agent runtime, authorization owner, tool executor, MCP transport owner, registry authority, persistence owner, evidence owner, receipt owner, validation owner, or completion authority.

## Completion Discipline

This plan replaces broad rediscovery as the active execution direction.

Do not stop for another general architecture review unless current evidence proves one of the following:

1. the next change would create a second authority;
2. user data could be lost or corrupted;
3. the active machine gate forbids the operation;
4. a required canonical LBE owner/contract genuinely does not exist;
5. an irreversible governance decision is ambiguous.

Otherwise resolve the issue and continue.

For every remaining capability:

```text
existing LBE owner?
    YES -> bind/project it through RealLbeWrapper
    NO  -> inspect approved reusable/reference mechanics
             compatible -> adapt/wrap the smallest seam
             unavailable -> implement only the smallest missing client seam
```

Do not recreate backend capabilities already owned by LBE.

## Accepted Baseline — Do Not Reimplement

Treat these as accepted unless newer contradictory canonical evidence appears:

- LBE backend/runtime authority: complete.
- LBE governed authorization/execution/evidence/receipt/completion owners: existing.
- RealLbeWrapper boundary: implemented.
- attach/disconnect/reconnect projection: implemented and tested.
- live read/list/glob/search: bounded proven.
- read-only mutation denial: proven.
- MCP metadata bridge and registry refresh: proven.
- `/mcp` metadata projection: implemented.
- governed Rust patch-approval client flow: implemented and locally tested.

The patch-approval client flow currently guarantees:

- `/patch` retains the proposed patch;
- Enter requests LBE authorization for modify;
- no `workspace.patch` request before authorization;
- ALLOW submits once;
- DENY clears without mutation;
- REQUIRE_APPROVAL / ESCALATE retain pending state;
- foreign/duplicate authorization events cannot release mutation;
- disconnect clears pending mutation state;
- Escape during approval rejects and clears safely.

Real writable mutation acceptance remains a runtime-evidence task, not a reason to redesign this client flow.

## Release-Blocking Completion Sequence

### 1. Real Provider / Agent Continuation

Prove the normal user turn through the existing LBE provider/runtime owner:

```text
user prompt
-> RealLbeWrapper
-> LBE provider/runtime
-> streamed/continued events
-> final LBE completion
-> Rust projection
```

Rust only submits requests and projects authoritative events.

Required user-visible state:

- active provider/model;
- connection/health truth where supplied;
- turn/session identity;
- streamed or continued assistant response;
- terminal completion/failure state;
- no fabricated provider/model/session state.

### 2. Real Tool-Call Continuation

Prove one complete read-only agent-driven tool cycle:

```text
provider tool request
-> LBE authorization
-> registered governed read/search capability
-> execution
-> evidence + ToolReceipt
-> result returned through LBE provider continuation
-> final agent response
```

Do not implement a Rust-owned tool loop.

### 3. Live Writable Patch Acceptance

Use an authorized writable LBE session and prove the already-implemented patch approval flow against real runtime authority:

- ALLOW;
- REQUIRE_APPROVAL / escalation;
- DENY;
- real `workspace.patch`;
- stale-hash protection;
- real ToolReceipt/evidence;
- validation/completion result.

### 4. Structured Evidence / Receipt Projection

Finish only the minimum normal-use views needed to inspect:

- operation/tool identity;
- receipt ID;
- evidence references;
- authorization status;
- execution status;
- failure/denial/escalation;
- validation/completion status;
- originating request/turn correlation.

Rust must project LBE truth and must not create local evidence authority.

### 5. Workspace Diff / Patch Review

Finish basic real diff review required for manual testing:

- proposed/actual file changes;
- file/hunk projection;
- patch authorization state;
- patch operation result;
- receipt/evidence linkage;
- validation result;
- clear failure/denial state.

Advanced diff UX is post-completion.

### 6. Core Session Lifecycle and Persistence

Prove:

```text
startup
-> attach
-> /new or existing session
-> authoritative session ID/state
-> turn lifecycle
-> reconnect
-> stale-state clearing
-> persisted session
-> close/reopen
-> resume
```

No fabricated identity or stale session reuse.

### 7. Provider / Model Surface Completion

Finish only the client projection/configuration seams needed for normal use:

- discovery;
- model list where LBE supplies it;
- selection;
- refresh;
- truthful auth/configuration/health projection;
- fail-closed malformed-response behavior.

LBE remains provider/model authority.

### 8. Live Tool-Registry Projection

Finish authoritative registered-tool/capability visibility:

- registered tools only;
- availability;
- relevant authorization/risk metadata;
- refresh;
- malformed-response rejection;
- no Rust execution authority.

### 9. MCP Real Acceptance Case

Do not redesign or repeat the metadata bridge.

Create or select a legitimate LBE-authorized non-empty installed capability registry using existing LBE registration mechanisms.

Prove:

```text
LBE capability registry
-> capabilities.list
-> RealLbeWrapper
-> McpRegistryUpdated
-> /mcp
```

Then prove one agent-driven external/MCP capability invocation through the existing LBE governed external-capability path:

```text
provider/tool request
-> LBE registered capability
-> LBE authorization
-> LBE adapter/transport
-> result + evidence + ToolReceipt
-> LBE provider continuation
-> Rust lifecycle projection
```

Rust must not implement MCP transport or authorization.

### 10. Windows ConPTY/PTTY Harness

Build or reuse one real Windows terminal harness for installed acceptance.

Redirected stdin is insufficient and must not be retried as terminal proof.

The harness must drive the installed Ratatui binary with a real terminal lifecycle and be reusable.

Minimum automated terminal proof:

- process starts in a real terminal;
- initial UI renders;
- keyboard input works;
- `/new` works;
- provider/model interaction works;
- `/mcp` works;
- one normal user turn works;
- governed read/search works;
- approval interaction works;
- patch/diff state works;
- evidence/receipt state is visible;
- reconnect/resume works where applicable;
- quit exits cleanly.

### 11. Installed End-to-End CLI Acceptance

Run the actual intended installed/debug artifact through the real terminal harness.

Minimum acceptance chain:

```text
launch
-> real LBE attach
-> workspace/session truth
-> provider/model
-> /new or resume
-> user prompt
-> assistant continuation
-> governed read/search tool
-> approval-gated writable patch
-> diff review
-> ToolReceipt/evidence
-> MCP capability visibility/use
-> validation/completion
-> persistence/resume
-> clean quit
```

Do not classify the product as user-test-ready until this path is proven or a genuine external blocker remains after all independent completion work is done.

## Validation Requirements

At each meaningful completion batch, run exact validation for changed behavior.

Final Rust validation:

```text
cargo fmt -- --check
cargo check --quiet
cargo test --quiet
```

Also run:

- exact focused Rust tests for changed functionality;
- relevant LBE backend regression tests for exercised contracts;
- changed-source diff hygiene checks;
- whole-tree `git diff --check` only if unrelated pre-existing worktree changes do not invalidate that claim;
- final ConPTY/PTTY installed acceptance.

Do not invent or reuse stale test counts. Record exact commands and exact observed results.

## Worktree / Commit Discipline

- Work directly on current `main` primary checkout.
- Do not create feature branches, worktrees, or parallel implementation folders.
- Preserve unrelated existing modified/untracked files.
- Do not include unrelated changes in focused completion commits.
- Documentation is supporting evidence, not the implementation task.
- Update GPT-K only at material checkpoints.

## External Reference Role

### Cline

Reference-only for reusable client/runtime mechanics such as:

- session resume;
- provider streaming/continuation patterns;
- tool-call/result continuation;
- approval UX/interception mechanics;
- per-tool transcript rows;
- inline/checkpoint diff behavior;
- MCP interaction UX.

Do not copy Cline branding or make Cline a runtime authority.

### OpenCode

Reference-only for CLI/UX interaction ideas where useful.

Do not let OpenCode replace LBE owners or drive a second runtime architecture.

## Non-Blocking Until After User-Test Readiness

Unless they break normal use, defer:

- headless/CI JSON mode;
- NO_COLOR refinements;
- ASCII/wide-character polish;
- advanced evidence browser UX;
- advanced receipt browser UX;
- background process dashboard;
- subagent/team UX;
- schedules/connectors expansion;
- advanced code-search UI;
- optional visual polish;
- exhaustive non-critical edge-case coverage.

Headless/JSON mode is not a release blocker for the first manually testable installed CLI.

## Stop / Continue Rule

When a required test fails:

```text
identify exact failure
-> determine whether caused by current work
-> fix if in scope
-> rerun
-> continue
```

Do not return to broad architecture discovery when the issue is locally resolvable from existing contracts.

If one required item is externally blocked, record that blocker and continue every independent completion slice.

## Final Completion Definition

The final deliverable is not another architecture review or plan.

The deliverable is:

```text
WORKING INSTALLED LETTERBLACK CLI — READY FOR USER TESTING
```

Required final classifications:

```text
LBE backend authority                  PASS
Rust/LBE integration                   PASS
provider/model flow                    PASS
session lifecycle                      PASS
governed tools                         PASS
authorization/approval                 PASS
provider tool continuation             PASS
receipt/evidence                       PASS
basic diff/patch review                PASS
persistent session resume              PASS
MCP non-empty projection               PASS
governed MCP/external invocation       PASS
installed ConPTY/PTTY lifecycle        PASS
installed core CLI E2E                 PASS
Rust regression                        PASS
LBE regression                         PASS
```

Only after those normal-use requirements are proven should the project leave completion mode and move into broader polish/advanced capability work.
