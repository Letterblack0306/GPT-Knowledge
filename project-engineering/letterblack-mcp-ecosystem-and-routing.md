# Letterblack MCP Ecosystem and Routing

Updated: 2026-09-01

## Purpose

This document defines the current Letterblack local-agent ecosystem, the ownership boundary of each MCP-facing component, and the direction an agent should use when selecting evidence or capabilities.

It is a routing/ownership reference, not runtime truth. Current local source, registered MCP tools, repository state, and live runtime evidence outrank this document.

## Current ecosystem

```text
                              REASONING AGENT
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
              SKILLS          GPT-KNOWLEDGE        BIRDEYE MCP
                 │                  │                  │
          reasoning/workflow   durable project/      local evidence,
             methodology        method projection    indexed state,
                                                    governed execution
                                                       │
                   ┌───────────────────────────────────┼──────────────────────────┐
                   │                                   │                          │
                   ▼                                   ▼                          ▼
              MEMORY OWNER                        EYES INDEX                  GITHUB
       C:\MCP Local\Memory\memory.db       BirdEye-owned projections       remote repo truth
             historical truth               and query databases             PR/commit/checks
                   │
                   ▼
      historical recall / provenance

Runtime / browser / provider behavior proof sits outside the documentation/index layers above.
```

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

The router may be used as guidance. Actual gallery discovery/fetch is performed by BirdEye's consolidated `skills` MCP capability.

Current consolidated operations:

- `skills(operation="status")`
- `skills(operation="query", query=..., prefix=...)`
- `skills(operation="fetch", rel=...)`

Do not use obsolete separate `skills_list`, `skills_fetch`, or `skills_hash_status` assumptions.

### 3. GPT-Knowledge

GPT-Knowledge owns durable project/method/status/reference projection and deterministic project routing.

Use it for:

- project plans/status/reference records;
- reusable engineering guidance;
- architecture/method decisions that have been documented durably;
- project-to-local-path mapping;
- routing to the correct evidence owner.

It does not prove current local workspace state, remote repository state, or live runtime behavior.

BirdEye currently exposes GPT-Knowledge through:

- `knowledge_route`
- `knowledge_read`
- `local_projects`

The normal direction is:

```text
agent
  -> GPT-Knowledge for project/method/routing context
  -> evidence owner appropriate to the claim
```

### 4. BirdEye MCP

BirdEye is the consolidated local evidence/index and governed-execution MCP surface.

Current public capability families include:

- local evidence: `birdeye_search`, `birdeye_inspect`, `birdeye_roots`, `birdeye_status`;
- GPT-Knowledge routing: `knowledge_route`, `knowledge_read`, `local_projects`;
- historical Memory reads: `memory_recall`, `memory_search`, `memory_timeline`, `memory_conversation`, `memory_message`, `memory_related`, `memory_sources`;
- curated Skills: consolidated `skills` tool with `status`, `query`, `fetch`;
- workspace/revision evidence: `workspace_identity`, `revision_status`;
- governed execution: `workspace_run`, `workspace_run_sequence`, `workspace_command_history`;
- EYES retirement/health controls where exposed by the active runtime.

BirdEye does not become the canonical owner of every data source it exposes. It can provide one MCP entry surface while preserving source ownership.

### 5. Memory

Canonical historical-memory owner remains:

```text
C:\MCP Local\Memory\memory.db
```

Use Memory-derived capabilities for past conversations, previous agent sessions, historical decisions, rejected ideas, old runtime/tool evidence, and exact provenance.

BirdEye may expose Memory query/read capabilities through its MCP surface and maintain EYES query projections, but canonical historical content remains owned by the standalone Memory store.

The standalone Memory MCP registration remains valid where clients explicitly require both `birdeye` and `memory` registrations. Consolidated BirdEye access does not imply the canonical Memory owner should be removed.

### 6. EYES

EYES is BirdEye's current durable/query projection system.

Current authority model:

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

Current validated domains include Workspace, Skills, and Memory parity/rebuild/replay support. Query databases are disposable projections and must be recoverable from their canonical owner/data path.

Legacy `state\workspace.db` remains a compatibility path until the explicit retirement gate is activated. Retirement must remain fail-closed until all required checks pass and the retirement marker is deliberately persisted.

### 7. GitHub

GitHub remains canonical remote repository truth for:

- branches and commits;
- pull requests;
- remote file state;
- required checks and workflow results;
- reviewed implementation patches.

Do not use GPT-Knowledge or BirdEye as a substitute for remote repository truth when the claim is specifically about GitHub state.

### 8. Runtime / browser / provider

Live behavior proof outranks documentation and index presence.

Use runtime-specific evidence for claims such as:

- a UI actually rendered correctly;
- a browser action reached the intended target;
- a provider/tool continuation completed;
- a service remains alive;
- an MCP client successfully initialized and called a tool.

## Current MCP connection model

BirdEye supports multiple MCP stdio clients against the same configured state root.

The process-scoped diagnostic marker must not force a second legitimate MCP client to disconnect. Each client may keep its own stdio connection.

Filesystem indexing remains separately singleton-protected by the watcher lease, so allowing concurrent MCP clients does not mean duplicate indexing watchers are allowed.

Direction:

```text
Cline / other MCP client A ─┐
                            ├─> BirdEye MCP stdio sessions
Cline / other MCP client B ─┘          │
                                       └─> one separately leased watcher
```

A client that was already disconnected before a BirdEye fix may need its MCP connections reloaded/restarted; stale client session state is not proof that the repaired server still rejects concurrent connections.

## Capability routing table

| Need | Primary route | Why |
|---|---|---|
| Current local file/index evidence | BirdEye MCP | Current machine-local evidence owner |
| Local branch/HEAD/dirty status | BirdEye `workspace_identity` / `revision_status` | Revision-bound local evidence |
| Governed local command | BirdEye `workspace_run` / `workspace_run_sequence` | Policy-controlled execution |
| Durable project/method/status knowledge | GPT-Knowledge | Durable project projection |
| Find specialist workflow guidance | skill-gallery-router -> BirdEye `skills(query)` | Router selects source; BirdEye performs retrieval |
| Fetch selected skill | BirdEye `skills(fetch)` | Canonical skill retrieval path |
| Past ChatGPT/agent/session evidence | Memory capability | Historical canonical owner/provenance |
| Remote repository/PR/commit/check truth | GitHub | Canonical remote repository owner |
| Live UI/browser/provider behavior | Runtime-specific tools/evidence | Only live execution proves behavior |

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

1. Identify what kind of truth the question needs before selecting an MCP capability.
2. Use Skills for methodology, not source truth.
3. Use GPT-Knowledge for durable routing/project context, not live local state.
4. Use BirdEye for local evidence, indexed retrieval, consolidated Skills access, historical Memory access, and governed commands.
5. Preserve Memory as canonical historical owner even when BirdEye exposes Memory reads or EYES projections.
6. Use GitHub for remote repository truth.
7. Use runtime evidence for behavioral claims.
8. Do not treat one MCP endpoint as ownership of every underlying source.
9. Do not duplicate existing indexing/retrieval capabilities merely because an agent cannot see them; first verify MCP registration and tool exposure.
10. If a tool wrapper only returns routing instructions, continue to the actual underlying MCP capability rather than concluding the capability does not exist.

## Current implementation checkpoint — 2026-09-01

Validated evidence supplied for the current local implementation reports:

- deterministic EYES query rebuild implemented;
- unified EYES health/divergence reporting implemented;
- Workspace and Skills EYES rebuild supported;
- Memory EYES deterministic rebuild/replay parity implemented and validated;
- Memory live rebuild: 68,097 documents, lag 0, `journal_replayable = true`, `rebuildable = true`;
- BirdEye concurrent MCP stdio client handling fixed;
- watcher singleton ownership preserved separately;
- direct BirdEye consolidated Skills query/fetch proven in an agent session;
- `skill-gallery-router` correctly serves as routing guidance, while `birdeye__skills` performs actual retrieval;
- legacy retirement marker remains intentionally inactive until the explicit retirement path is invoked after the complete retirement predicate passes.

These are current project records and should still be rechecked against local source/runtime before making a consequential present-state claim.
