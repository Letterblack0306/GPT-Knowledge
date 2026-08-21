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

This validation-profile mechanism is the preferred local behavioral-proof path when the required test already exists in a configured profile or can be minimally added to one.

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
BirdEye MCP
    ↓
workspace identity + revision status + indexed source inspection
    ↓
BirdEye watcher/shared SQLite index
(already keeps indexed state current)
    ↓
GitHub main
verify authoritative remote SHA + exact diff
    ↓
BirdEye validation profile
when local behavioral proof is required
    ↓
exitCode + stdout + stderr + bounded verdict
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
| Local Git identity/status | BirdEye `workspace_identity` / `revision_status` | Prefer exact observed HEAD evidence |
| Local configured behavioral validation | BirdEye request bridge validation profile | Use deterministic configured commands |
| Authoritative committed source | GitHub `main` | Record SHA and diff |
| Persistent project projection | GPT-Knowledge project files | Update only after evidence changes truth |
| Deployed projection | Vercel/live GPT-K website | Verify production commit and visible project state |
| LoopTool | Fallback / explicit LoopTool or relay test | Not default local evidence path |

## LoopTool boundary

Do not request a LoopTool run merely because local validation is needed.

Use LoopTool only when one of these is true:

```text
BirdEye cannot perform the required configured validation
OR
the task explicitly tests LoopTool itself
OR
the task explicitly tests a Browser/chat transport path owned by LoopTool
```

Do not duplicate evidence by running the same test through BirdEye and LoopTool without a specific falsifier that requires both.

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

Current Access source authority:

```text
Repository: Letterblack0306/access-browser-agent
Branch: main
HEAD: 741d20815858ccf829c283709d504f6e0bd0f6e1
```

Current gate:

```text
P1 Bounded Page Settlement
classification: SOURCE_FLOW_MAPPED_REGRESSION_NOT_YET_ADDED
source owner: src/browser/browser-tool-runtime.js
test owner: test/browser-tool-runtime-smoke.js
```

Before deciding how P1.2 validation executes, prove the active BirdEye installation/configuration for the exact Access workspace:

```text
1. Which configured BirdEye workspace root maps the active Access workspace?
2. Which validation profiles exist for that exact workspace?
3. Does an existing profile already run test/browser-tool-runtime-smoke.js or an equivalent project check that includes it?
4. Which request bridge runtime branch/path is active?
5. Is the active bridge using polling only, webhook/trigger, or both?
6. Does the watcher include the exact active Access workspace root?
```

Then choose only one of these outcomes:

```text
A. REUSE EXISTING PROFILE
   if current BirdEye configuration already provides the required focused proof.

B. MINIMALLY EXTEND EXISTING PROFILE
   if BirdEye is present and correct but the focused settlement regression is not yet included.

C. MISSING CAPABILITY
   only if evidence proves the active BirdEye installation cannot provide the required bounded local proof.
```

Do not design a new execution channel before this check.

## Synchronization rule

Before any next product mutation, report and reconcile:

```text
Access remote main SHA
Access local HEAD + dirty/untracked state
BirdEye workspace/index identity
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

Do not broaden from settlement into browser isolation, AX/screenshot perception, terminal-state UI, recovery, or other pending gates without closing the active gate first.
