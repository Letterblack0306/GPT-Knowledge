# Access Browser Agent — BirdEye-First Proven Engineering Workflow

Date: 2026-08-21

## Purpose

This document preserves the proven local-evidence workflow for Access Browser Agent so future sessions do not invent duplicate execution, indexing, or planning mechanisms.

The rule is:

> Inspect existing GPT-Knowledge method + BirdEye/MCP/index/trigger/validation implementation first. Reuse proven infrastructure. Only plan additions for a capability that current evidence proves is missing.

## Authority order

```text
user instruction
→ fresh local/runtime evidence
→ active local workspace
→ authoritative project repository / main
→ project-specific GPT-Knowledge projection
→ reusable GPT-Knowledge methods
→ official external documentation
→ model prior
```

GPT-Knowledge is a projection and routing layer. It must never replace current source, current local state, or runtime evidence.

## Existing BirdEye capabilities — proven from current source

### EXISTING + PROVEN — Native MCP evidence surface

BirdEye `mcp_server.py` exposes:

```text
knowledge_route
knowledge_read
birdeye_search
birdeye_inspect
birdeye_roots
birdeye_status
workspace_identity
revision_status
```

Use these for project discovery, GPT-K method routing, indexed search, file inspection, index health, exact workspace identity, HEAD identity, and staged/unstaged/untracked/upstream revision evidence.

The MCP surface is read-only by design. `root_class` / `source_class` preserve the distinction between live workspace evidence, GPT-Knowledge methodology, and reference material.

### EXISTING + PROVEN — Continuous incremental indexing

BirdEye `birdeye_watcher.py` already watches configured roots for:

```text
created
modified
deleted
moved
```

Every accepted event routes to the existing `agent.index_file_event()` path and updates the shared SQLite `state/workspace.db` index.

Do not build a second watcher, second index, or duplicate change-detection system.

### EXISTING + PROVEN — Local request/validation bridge

BirdEye `bridge/birdeye_request_bridge.py` already supports bounded local evidence requests through:

```text
GitHub request JSON
→ local outbound BirdEye poller
→ workspace/request validation
→ Git/index/validation evidence
→ redaction
→ GitHub response JSON
```

Supported operations are:

```text
workspace_status
workspace_diagnosis
git_compare
run_validation_profile
refresh_index
```

The bridge can execute locally configured validation profiles and returns deterministic evidence including:

```text
argv
exitCode
stdout
stderr
elapsedSeconds
```

It stops on the first failing command and produces bounded `PASS`, `FAIL`, or `REVIEW` verdicts.

### EXISTING + PROVEN — Configured validation instead of arbitrary remote shell

Validation commands come from local BirdEye configuration, not request-provided shell text.

Existing security properties include:

```text
outbound HTTPS only
configured workspace IDs only
no request-provided shell command
validation commands defined in local config
mutation requests rejected
expired requests rejected
idempotent response handling
bounded/redacted output
```

This validation-profile mechanism remains available for deterministic configured validation where already proven and appropriate.

### EXISTING + PROVEN — GitHub polling bridge

Current remote BirdEye source proves an outbound polling loop. The example configuration uses `pollSeconds: 45` and the bridge repeatedly performs `poll_once()` then sleeps for the configured interval.

### EXISTING BUT NOT YET VERIFIED LIVE — webhook / external trigger

A webhook/trigger may exist in the active local installation or another integration layer, but the current BirdEye remote `main` inspected on 2026-08-21 does not prove a webhook receiver.

Before depending on webhook behavior, locate and verify the actual running implementation/configuration.

Do not infer webhook authority from the watcher or polling bridge.

## Proven engineering workflow

```text
GPT-Knowledge
    ↓
route current gate / method
    ↓
BirdEye MCP / existing source inspection
    ↓
workspace identity + revision status + indexed evidence
    ↓
GitHub main
verify authoritative remote SHA + exact diff
    ↓
choose execution surface by change size and purpose
    ↓
GitHub for implementation / large or multi-file source changes
LoopTool for local pull / focused tests / debugging / inspection / small local changes
    ↓
classify only the tested gate
    ↓
GPT-Knowledge
persist source_head, classification, gate, observable, falsifier
    ↓
Vercel / live GPT-K surface
verify projection reached production when applicable
    ↓
only then next engineering mutation
```

## Default responsibility matrix

| Responsibility | Primary owner | Rule |
| --- | --- | --- |
| Engineering method / current gate | GPT-Knowledge | Route/read before source mutation |
| Live workspace search/index | BirdEye MCP + watcher | Reuse shared SQLite index |
| Local Git identity/status | BirdEye `workspace_identity` / `revision_status` or focused local evidence | Prefer exact observed HEAD evidence |
| Large implementation / multi-file source changes | GitHub `main` | Implement and commit through GitHub; record exact SHA and diff |
| Large file edits / durable repository changes | GitHub `main` | Prefer repository-native mutation rather than local ad-hoc editing |
| Local pull / synchronization | LoopTool | Pull the exact GitHub `main` commit before local proof |
| Focused tests / debugging / inspection | LoopTool | Use bounded local commands and preserve command hash/evidence |
| Small local debugging changes | LoopTool | Allowed when narrowly scoped to diagnosis/test iteration; do not let local drift become hidden authority |
| Existing configured validation | BirdEye validation profile | Reuse when it already provides the required deterministic proof |
| Persistent project projection | GPT-Knowledge project files | Update only after evidence changes truth |
| Deployed projection | Vercel/live GPT-K website | Verify production commit and visible project state |

## GitHub / LoopTool execution boundary

Use the following standing rule for Access Browser Agent engineering work.

### GitHub — implementation authority

Use GitHub for:

```text
large file changes
multi-file implementation
new production behavior
substantial refactors
persistent source changes that should become repository authority
commits that other local sessions/machines must consume
```

Expected flow:

```text
inspect/prove owner
→ implement on GitHub main
→ record commit SHA + exact diff
→ LoopTool pulls exact main commit locally
→ LoopTool runs focused validation/debugging
```

Do not perform a substantial implementation locally first and then treat the unpushed workspace as authority.

### LoopTool — local execution and bounded iteration

Use LoopTool for:

```text
git pull --ff-only origin main
local HEAD/status verification
focused smoke/regression execution
syntax checks
debugging commands
bounded source inspection
small diagnostic/test changes
small local fixes when the purpose is test/debug iteration
```

If a small LoopTool change becomes the accepted product fix, it must be reconciled back to GitHub `main` before it is treated as durable project truth.

LoopTool must not create random branches, worktrees, duplicate roots, or competing source authority.

### BirdEye — evidence and routing infrastructure

BirdEye remains the preferred evidence/index/routing layer where its capability is proven. It does not replace GitHub for source implementation or LoopTool for local pull/debug/test execution.

Do not duplicate the same test through BirdEye and LoopTool unless a specific falsifier requires both surfaces.

## Mandatory pre-plan proof categories

Before proposing engineering work, classify relevant capabilities as:

```text
EXISTING + PROVEN
EXISTING BUT NOT YET VERIFIED LIVE
MISSING — IMPLEMENTATION REQUIRED
```

A plan may only add implementation under `MISSING — IMPLEMENTATION REQUIRED`.

Do not turn an unverified live capability into a missing capability until its active installation/configuration has been checked.

## Access-specific P1.2 application

Current Access source authority at the time this gate was opened:

```text
Repository: Letterblack0306/access-browser-agent
Branch: main
HEAD: 741d20815858ccf829c283709d504f6e0bd0f6e1
```

P1 Bounded Page Settlement was subsequently implemented on GitHub and locally proven at:

```text
0048d0dceb062fbabb06423dfa419a6050a4713e
```

The durable lesson from P1.2 is the execution sequence now codified above:

```text
GitHub implementation
→ LoopTool pull
→ LoopTool focused regression
→ GPT-Knowledge classification
→ live website verification
```

Do not reopen P1.2 without contradictory evidence.

## Synchronization rule

Before any next product mutation, report and reconcile:

```text
Access remote main SHA
Access local HEAD + dirty/untracked state
BirdEye workspace/index identity when applicable
focused validation state
GPT-K source_head + active gate
Vercel production deployment SHA
live GPT-K project state
```

Any required mismatch means synchronization comes before new implementation.

## One-step rule

After each evidence result:

1. classify only the tested gate;
2. update GPT-Knowledge if project truth changed;
3. verify live projection when applicable;
4. select exactly one bounded next step.

Do not broaden from the active gate into browser isolation, AX/screenshot perception, terminal-state UI, recovery, or other pending gates without closing the active gate first.
