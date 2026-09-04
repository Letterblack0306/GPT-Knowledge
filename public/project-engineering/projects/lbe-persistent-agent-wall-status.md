# LBE Persistent Agent Wall — Current Project Mirror

## Authority and routing

- Last reconciled: 2026-09-04
- Agent Wall repository: `Letterblack0306/LBE_Presistent_Agent_wall`
- Agent Wall GitHub `main`: `b6eb087095059f94acc65654260459c8f579a147`
- Rust TUI repository: `Letterblack0306/LBE_Agents_wall_Intigration`
- Rust TUI GitHub `main`: `1605f54b744237d6c00b3ed6b5692cbcbc3fca55`
- Authority: GitHub `main` is published implementation authority. Local workspaces are active runtime/development evidence. Google Drive is a downstream one-way filtered snapshot of those local workspaces and is not an implementation authority.

```text
GitHub main -> published implementation authority
Local workspace -> active runtime / dirty-state / uncommitted development evidence
Local workspace -> one-way filtered sync -> Google Drive
Google Drive -> recovery / forensic snapshot evidence only
GPT-Knowledge -> project-state / architecture / methodology projection
```

Historical acceptance records preserve their original evidence. Current passing validation and current GitHub source outrank stale project mirrors.

## 2026-09-04 Drive versus GitHub reconciliation

The shared Drive folder was inspected directly. It contains one-way sync manifests and downstream copies for the canonical Agent Wall and Rust TUI workspaces.

### Agent Wall snapshot

```text
local source: C:\Agents-Memory-Tool-v6-integration
Drive sync destination: D:\GPT_Local\Agents-Memory-Tool-v6-integration
Drive manifest updated: 2026-09-04T06:06:58.599Z
Drive manifest files: 3306
GitHub main: b6eb087095059f94acc65654260459c8f579a147
GitHub tracked blobs: 391
```

The Drive snapshot reflects the local workspace, not a clean GitHub mirror. It contains local evidence/state and generated or untracked material that GitHub intentionally does not publish. It can also lag current GitHub `main` when the local checkout is behind or dirty.

Current GitHub `main` includes the canonical product-integration artifacts:

```text
tools/lbe_product_integration.ps1
docs/acceptance/LBE_PRODUCT_INTEGRATION_MACHINE_CHECK.md
```

These must be read from GitHub `main` when determining published product-integration truth.

### Rust TUI snapshot

```text
local source: C:\LBE-TUI-Lab
Drive sync destination: D:\GPT_Local\LBE-TUI-Lab
Drive manifest updated: 2026-09-03T21:50:00.850Z
Drive manifest files: 6665
GitHub main: 1605f54b744237d6c00b3ed6b5692cbcbc3fca55
GitHub tracked blobs: 58
```

The Drive TUI snapshot contains substantially more material than GitHub, including local/vendor/build/reference content. Example tracked-file size divergence observed between the Drive snapshot and current GitHub main:

```text
src/app.rs      Drive 93748 bytes   GitHub 96539 bytes
src/tests.rs    Drive 172789 bytes  GitHub 174602 bytes
src/wrapper.rs  Drive 205807 bytes  GitHub 211441 bytes
AGENTS.md       Drive 20883 bytes   GitHub 713 bytes
```

This is expected under the one-way model: Drive preserves the local workspace state at sync time; it does not feed changes back into GitHub or the local workspace.

### Drive evidence classification

```text
DRIVE_ACCESS = PROVEN
DRIVE_SYNC_DIRECTION = ONE_WAY_LOCAL_TO_DRIVE
DRIVE_ROLE = RECOVERY / FORENSIC SNAPSHOT
DRIVE_AS_IMPLEMENTATION_AUTHORITY = NO
DRIVE_GITHUB_IDENTITY = NOT_REQUIRED
SAFE_TO_COPY_DRIVE_BLINDLY_TO_GITHUB = NO
```

The backup should preferentially retain unique source/docs/local evidence/session state while excluding reproducible build/dependency/cache noise where the sync configuration permits it.

## Current product-integration state

Canonical machine integration script:

```text
Agent Wall: tools/lbe_product_integration.ps1
modes: check | prove | build | package
```

Current exact source pair:

```text
Agent Wall: b6eb087095059f94acc65654260459c8f579a147
Rust TUI:   1605f54b744237d6c00b3ed6b5692cbcbc3fca55
```

Proven before the latest packaging optimization:

```text
canonical structural check = PASS
cross-repo structural integration = TRUE
Agent focused tests = 58 passed
Rust tests = 204 passed, 0 failed
cargo fmt --check = PASS
canonical prove = PASS
```

The Agent Wall package-stage optimization at `b6eb087...` removes a redundant recursive `node_modules` copy by installing worker dependencies directly into the final package worker directory. Package completion has not yet been proven after this change.

```text
PACKAGE_WORKER_COPY_BOTTLENECK_FIXED = IMPLEMENTED
PACKAGE_RETEST = BLOCKED / UNVERIFIED
RELEASE_READY = FALSE
```

## Local Git execution blocker discovered during package retest

Repeated `git archive` attempts through LoopTool fail before the package script is reached. The concrete error source is a required global Git filter:

```text
filter.utf8nobom.clean  = node "C:/Users/prave/.git-tools/utf8nobom-filter.mjs"
filter.utf8nobom.smudge = node "C:/Users/prave/.git-tools/utf8nobom-filter.mjs"
filter.utf8nobom.required = true
```

Observed failure:

```text
Error: EPIPE: broken pipe, write
C:/Users/prave/.git-tools/utf8nobom-filter.mjs
```

No repository `.gitattributes` entry referencing the filter was found in the bounded diagnostic. Therefore:

```text
LBE_PACKAGE_PIPELINE_FAILURE = NOT PROVEN
GIT_ARCHIVE_PATH = BLOCKED_BY_LOCAL_GLOBAL_FILTER
FAULTING_COMPONENT = utf8nobom-filter.mjs
```

Do not weaken or remove the filter without a bounded diagnosis of its intended scope.

## Rust CLI launch status

Current GitHub Rust README documents:

```text
cargo run --bin lbe
```

The real LBE runtime is the default; `LBE_RUNTIME=mock` is only for deterministic contract preview.

Latest LoopTool attempt:

```text
working directory: C:\LBE-TUI-Lab
command: cargo run --bin lbe
observed: "Compiling lbe-terminal v0.1.0 (C:\LBE-TUI-Lab)"
LoopTool duration: 1.14 seconds
LoopTool classification: timed out
```

This proves compilation started. It does not prove a Rust compile failure and does not prove that the interactive TUI launched.

```text
RUST_CLI_BUILD_START = PROVEN
RUST_CLI_COMPILE_RESULT = UNVERIFIED
INTERACTIVE_TUI_LAUNCH = UNVERIFIED
LOOPTOOL_LONG_RUNNING_INTERACTIVE_PATH = CURRENTLY UNRELIABLE
```

Do not classify the CLI as failed from this result alone.

## Product architecture retained

```text
USER
  -> agent/client reasoning and proposal
  -> mode
  -> LBE authority
  -> ALLOW / DENY / WAIT / approval
  -> governed adapter
  -> authorized operation
  -> ToolReceipt / evidence
  -> validation / completion
  -> persistence / continuation
  -> UI projection
```

- Agent Wall owns workspace/session identity, policy, authorization, governed execution, ToolReceipt/evidence, persistence, recovery, deterministic validation, and completion truth.
- Rust/Ratatui is the active client/projection/control surface.
- Provider/model owns reasoning/proposals.
- The integration/build script is a verifier/builder, never a third runtime authority.
- Product branding remains LBE / LetterBlack only.

## Remaining release gates

Even after a candidate package is created, release readiness remains false until current installed acceptance proves at least:

1. real installed writable `workspace.patch` through the Rust/LBE approval flow;
2. exact-operation approval binding;
3. mutation occurs exactly once;
4. replay is idempotent;
5. payload substitution is rejected;
6. persisted receipts/events are projected truthfully;
7. installed PTY/ConPTY interactive acceptance;
8. restart/resume product acceptance where still required.

## Current single next question

Can the real Rust CLI be built/launched through a terminal path that remains attached long enough for interactive acceptance, without misclassifying LoopTool's short execution cutoff as an LBE or Rust failure?

## Canonical source documents

Read current source before planning or implementation:

```text
Agent Wall:
docs/README.md
docs/CURRENT_STATUS.md
docs/IMPLEMENTATION_PLAN.md
.lbe/governance/implementation-gates.json
docs/acceptance/LBE_PRODUCT_INTEGRATION_MACHINE_CHECK.md
tools/lbe_product_integration.ps1

Rust TUI:
README.md
Docs/00_integration_alignment.md
Docs/STATUS.md
Docs/status.json
Docs/36_p2_p3_client_contract.md
src/main.rs
src/wrapper.rs
```
