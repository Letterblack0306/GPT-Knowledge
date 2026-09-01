# Letterblack MCP Ecosystem and Routing

Updated: 2026-09-01

## Purpose

This document defines the current Letterblack local-agent ecosystem, ownership boundaries, and the direction an agent should use when selecting evidence or capabilities.

It is a routing/ownership reference, not runtime truth. Current local source, registered MCP tools, repository state, validation receipts, and live runtime evidence outrank this document.

## Current validated MCP topology

```text
Agent clients
  ├── Codex
  ├── Cline standalone
  ├── Cline VS Code extension
  ├── OpenCode
  ├── Gemini
  ├── Antigravity
  └── Claude
        │
        └── BirdEye MCP              <- consolidated client MCP route
              ├── workspace query
              ├── memory query       <- ChatGPT + agent runtime/session history
              └── skills query       <- one consolidated Skills namespace/index
```

The client-facing MCP topology is intentionally consolidated through BirdEye. A client does not register a duplicate direct Memory MCP route or a separate Skills MCP route when following this architecture.

Consolidated access does **not** collapse ownership:

```text
Reasoning Agent   -> interpretation, planning, tool selection, conclusions
BirdEye MCP       -> consolidated local MCP access/evidence surface
Memory            -> canonical historical conversations/messages/provenance
Skills            -> canonical curated reasoning/workflow corpus
GPT-Knowledge     -> durable project/method/status/reference projection and routing
GitHub            -> canonical remote repository/branch/commit/PR/check truth
Runtime/Browser   -> live behavior proof
```

BirdEye can expose Memory, Skills, and GPT-Knowledge capabilities without becoming the canonical owner of those underlying sources.

## Ownership and direction

### 1. Reasoning agent

The agent owns interpretation, task decomposition, tool selection, reconciliation, planning, and conclusions.

Do not move semantic reasoning into MCP transport or indexing layers. The operating rule remains:

> Agents reason; bridges and MCP transports expose bounded capabilities and evidence.

### 2. Skills

Skills are curated reasoning/workflow instructions. They are not repository truth and they are not local execution tools.

The `skill-gallery-router` exists to tell an agent when and where to look for a specialist skill. It does not replace the actual Skills retrieval capability.

Correct path:

```text
task
  -> skill-gallery-router when useful for routing
  -> BirdEye MCP skills(operation="query")
  -> choose returned rel/path
  -> BirdEye MCP skills(operation="fetch") only when full skill content is needed
```

The router is guidance. Actual gallery discovery/fetch is performed by BirdEye's single consolidated `skills` MCP capability.

Current consolidated operations:

- `skills(operation="status")`
- `skills(operation="query", query=..., prefix=...)`
- `skills(operation="fetch", rel=...)`

Do not use obsolete separate `skills_list`, `skills_fetch`, or `skills_hash_status` assumptions. Do not create agent-specific Skills partitions.

### 3. GPT-Knowledge

GPT-Knowledge owns durable project/method/status/reference projection and deterministic project routing.

Use it for:

- project plans/status/reference records;
- reusable engineering guidance;
- architecture/method decisions that have been documented durably;
- project-to-local-path mapping;
- routing to the correct evidence owner.

It does not prove current local workspace state, remote repository state, or live runtime behavior.

BirdEye may expose GPT-Knowledge through capabilities such as `knowledge_route`, `knowledge_read`, and `local_projects`, while GPT-Knowledge remains the durable knowledge owner.

### 4. BirdEye MCP

BirdEye is the consolidated client-facing local MCP surface for the validated MCP Local architecture.

Capability families include:

- local evidence: `birdeye_search`, `birdeye_inspect`, `birdeye_roots`, `birdeye_status`;
- GPT-Knowledge routing/read access;
- historical Memory query/read access;
- curated Skills through one consolidated `skills` tool;
- workspace/revision identity;
- governed local execution;
- EYES projection/health controls where exposed by the active runtime.

BirdEye is the single enabled Letterblack MCP route in the validated client topology. Competing broad filesystem, legacy MCP, direct Memory, and separate Skills routes are absent or disabled according to the validation checkpoint.

### 5. Memory

Canonical historical-memory ownership remains with the Memory system and its canonical historical store.

Memory covers:

- imported ChatGPT history;
- coding-agent/runtime/session history;
- historical decisions and prior implementation evidence;
- exact provenance and source identity.

Clients access that historical capability through BirdEye in the validated consolidated topology.

Important distinction:

```text
client MCP route        = BirdEye
historical data owner   = Memory
```

A direct client -> Memory MCP registration is therefore **not part of the current validated architecture**. Removing the duplicate client route does not remove or transfer Memory ownership.

Memory semantic vectors remain active in the BirdEye-owned derived semantic index. Historical content authority remains with Memory; the derived vector/index layer is retrieval infrastructure.

### 6. EYES

EYES is BirdEye's durable/query projection system.

Authority model:

```text
canonical source/content owner
        ↓
eye_<domain>_data_01.db
canonical generation + durable change ledger
        ↓
replay / deterministic rebuild
        ↓
eye_<domain>_query_01.db
applied_generation
```

Health uses:

```text
lag = canonical_generation - applied_generation
```

Workspace, Memory, and Skills participate in the current query architecture. Query databases are disposable projections and must remain recoverable from their canonical owners/data paths.

Skills retrieval is currently lexical with SHA-256 identity/duplicate suppression. Skills vectors remain optional; their absence is not a failed required architecture condition.

### 7. GitHub

GitHub remains canonical remote repository truth for branches, commits, pull requests, remote file state, required checks, and workflow results.

Do not use GPT-Knowledge or BirdEye as a substitute for remote repository truth when the claim is specifically about GitHub state.

### 8. Runtime / browser / provider

Live behavior proof outranks documentation and index presence for behavioral claims such as rendered UI, browser actions, provider continuation, service liveness, or successful MCP initialization/tool invocation.

## Validated client direction

The 2026-09-01 MCP Local architecture validation reports these required routing properties as PASS:

```text
Codex          -> BirdEye only
Cline          -> BirdEye only
OpenCode       -> BirdEye only
Gemini         -> BirdEye only
Antigravity    -> BirdEye only
Claude         -> BirdEye only

Direct client -> Memory MCP      absent
Separate client -> Skills MCP    absent
Legacy competing MCP routes      absent/disabled
Broad filesystem bypass          disabled
```

Cline standalone and Cline VS Code extension are both validated with BirdEye as the consolidated route and without duplicate direct Memory registration.

## Skills validation direction

The current validation reports:

- exactly one public Skills tool;
- no legacy Skills APIs;
- no agent-specific Skills partitions;
- `query`, `fetch`, and `status` concepts exposed;
- 52 curated `SKILL.md` files;
- SHA-256 identity for every curated skill;
- automatic discovery without requiring a preselected skill name;
- bounded retrieval;
- alternate concept/method discovery;
- Memory owns no Skills MCP surface.

`skill-gallery-router` remains a reasoning/router instruction. It may tell an agent where/how to look; BirdEye `skills(...)` performs actual retrieval.

## Query capabilities

The validated query surface covers:

- exact symbol;
- exact phrase/error/message;
- lexical content/keyword retrieval;
- path and path-prefix lookup;
- root selection;
- Memory semantic retrieval;
- fetch;
- status;
- freshness/SHA verification;
- alternate-method/capability discovery.

Skills semantic vectors are optional. Current Skills retrieval does not depend on them.

## MCP connection model

BirdEye supports legitimate concurrent MCP stdio clients while the filesystem watcher remains separately singleton-owned.

```text
MCP client A ─┐
              ├─> independent BirdEye stdio sessions
MCP client B ─┘
                       │
                       └─> separately singleton-leased watcher
```

A stale client session may still require MCP reload/restart after a server-side connection fix; stale client connection state is not proof that the active server rejects concurrent clients.

## Capability routing table

| Need | Primary route | Canonical owner / reason |
|---|---|---|
| Current local file/index evidence | BirdEye MCP | Current machine-local evidence surface |
| Local branch/HEAD/dirty status | BirdEye workspace/revision capability | Revision-bound local evidence |
| Governed local command | BirdEye governed execution | Policy-controlled execution |
| Durable project/method/status knowledge | GPT-Knowledge, reachable directly or via BirdEye route/read | GPT-Knowledge remains owner |
| Find specialist workflow guidance | skill-gallery-router -> BirdEye `skills(query)` | Skills corpus remains owner; BirdEye retrieves |
| Fetch selected skill | BirdEye `skills(fetch)` | Consolidated retrieval path |
| Past ChatGPT/agent/session evidence | BirdEye Memory query surface | Memory remains historical owner |
| Remote repository/PR/commit/check truth | GitHub | Canonical remote repository owner |
| Live UI/browser/provider behavior | Runtime-specific evidence | Only live execution proves behavior |

## Trust direction

For present-state engineering claims:

```text
live runtime evidence
  > active local workspace evidence
  > canonical GitHub remote evidence
  > durable project-specific GPT-Knowledge
  > curated Skills methodology
  > model inference
```

Historical evidence is authoritative for what happened historically, but it does not automatically outrank stronger current evidence for present-state claims.

## Required agent behavior

1. Identify what kind of truth the question needs before selecting a capability.
2. Use the consolidated BirdEye MCP route for local workspace, Memory, and Skills access in clients following the validated MCP Local architecture.
3. Preserve canonical ownership: BirdEye access does not transfer ownership of Memory, Skills, GPT-Knowledge, GitHub, or runtime evidence.
4. Use Skills for methodology, not source truth.
5. Use GPT-Knowledge for durable routing/project context, not live local state.
6. Use GitHub for remote repository truth.
7. Use runtime evidence for behavioral claims.
8. Do not restore duplicate direct Memory, separate Skills, broad filesystem, or legacy MCP routes merely because an agent fails to discover a capability; first verify BirdEye registration and tool exposure.
9. If a skill router returns routing instructions, continue to BirdEye's actual `skills` capability rather than expecting the router itself to query the corpus.

## Current validation checkpoint — 2026-09-01

Supplied MCP Local architecture validation reports:

- architecture: **PASS**;
- required checks: **52 PASS, 0 FAIL**;
- BirdEye MCP handshake: PASS;
- one live public Skills registration: PASS;
- automatic Skills discovery: PASS;
- bounded Skills retrieval: PASS;
- alternate method discovery: PASS;
- Memory semantic retrieval: PASS;
- Memory incremental vector lifecycle coverage: PASS;
- legacy Memory vector path absent: PASS;
- Skills vectors: optional PLAN, not required;
- all named client configurations checked for consolidated BirdEye routing and absence of duplicate direct Memory routes.

Validation artifacts are recorded locally at:

```text
C:\MCP Local\servers\mcp_local_validation_report.json
C:\MCP Local\servers\mcp_local_validation_report.md
C:\MCP Local\servers\mcp_local_validation.log
```

This checkpoint is durable project evidence, but consequential present-state claims should still be rechecked against current configuration/source/runtime when they may have changed.