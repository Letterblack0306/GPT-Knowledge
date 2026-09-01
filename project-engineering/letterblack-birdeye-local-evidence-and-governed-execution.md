# Letterblack BirdEye — Local Evidence, MCP Routing, EYES, and Governed Execution

Updated: 2026-09-01

## Purpose

`Letterblack_BirdEye` is the consolidated local evidence/index and governed-execution MCP surface used alongside GPT-Knowledge, Memory, Skills, GitHub, and live runtime evidence.

Use `project-engineering/letterblack-mcp-ecosystem-and-routing.md` for the complete ecosystem map and ownership direction.

BirdEye is an access/evidence surface. It does not automatically become the canonical owner of every source it exposes.

## Current ownership boundary

```text
GPT-Knowledge
  -> durable project/method/status/reference projection and routing

Memory
  -> canonical historical conversations/messages/provenance

Skills
  -> curated reasoning/workflow instructions

BirdEye MCP
  -> current local evidence/index access
  -> GPT-Knowledge routing/read access
  -> Memory query/read access
  -> consolidated Skills query/fetch/status
  -> workspace/revision identity
  -> governed local commands
  -> EYES projection health/retirement controls

GitHub
  -> canonical remote repository/branch/commit/PR/check truth

Runtime/browser/provider
  -> live behavior proof
```

## Current BirdEye MCP capability families

### Local evidence

- `birdeye_search`
- `birdeye_inspect`
- `birdeye_roots`
- `birdeye_status`

### GPT-Knowledge

- `knowledge_route`
- `knowledge_read`
- `local_projects`

### Historical Memory access

- `memory_recall`
- `memory_search`
- `memory_timeline`
- `memory_conversation`
- `memory_message`
- `memory_related`
- `memory_sources`

Canonical historical Memory remains owned by `C:\MCP Local\Memory\memory.db` even when accessed through BirdEye.

### Curated Skills

BirdEye exposes one consolidated `skills` tool:

- `skills(operation="status")`
- `skills(operation="query", query=..., prefix=...)`
- `skills(operation="fetch", rel=...)`

`skill-gallery-router` is routing guidance for the agent. It tells the agent when/where to look; it is not the actual gallery retrieval engine.

Correct direction:

```text
skill-gallery-router (when useful)
  -> BirdEye skills(query)
  -> select returned rel
  -> BirdEye skills(fetch) only when full content is needed
```

A proven session successfully queried the real BirdEye Skills index and fetched `curated/design/frontend-design/SKILL.md`. Therefore do not conclude that the gallery is unavailable merely because a router wrapper returns only its instructions.

### Workspace/revision evidence

- `workspace_identity`
- `revision_status`

### Governed execution

- `workspace_run`
- `workspace_run_sequence`
- `workspace_command_history`

BirdEye execution remains policy-bound. A rejected command proves that BirdEye did not authorize that invocation through its configured governance; it does not prove the operation is universally impossible.

## EYES projection system

BirdEye's current EYES contract separates durable data/ledger state from disposable query projection state.

```text
canonical source/content owner
        ↓
eye_<domain>_data_01.db
  canonical_generation
  durable changes ledger
        ↓
project_pending_changes() / deterministic rebuild
        ↓
eye_<domain>_query_01.db
  applied_generation

lag = canonical_generation - applied_generation
```

Current validated behavior reported for the local implementation:

- deterministic Workspace query rebuild: PASS;
- deterministic Skills query rebuild: PASS;
- Memory EYES rebuild/replay parity: PASS;
- Memory live rebuild: 68,097 documents;
- Memory `journal_replayable = true`;
- Memory `rebuildable = true`;
- Memory generation lag: 0;
- replay idempotency: targeted proof PASS;
- repeated rebuild deterministic output: PASS;
- unified EYES health/divergence reporting: implemented.

The query databases are projections. They must be recoverable from their canonical data/source owners and must not become a second source of truth.

## Legacy compatibility and retirement

Legacy `state\workspace.db` remains a compatibility path until retirement is explicitly activated.

Current required compatibility state after Memory parity validation:

```text
state\eyes_legacy_retired.json   intentionally absent until activation
legacy_storage_retired()         false until activation
state\workspace.db               compatibility path active
```

The retirement operation is fail-closed: it reports the retirement gate and must refuse activation until every required predicate passes. The marker is persisted only after successful activation.

Do not infer retirement merely because replay/rebuild parity now passes.

## MCP process and watcher lifecycle

BirdEye must support legitimate concurrent MCP stdio clients while preventing duplicate indexing watchers.

Current corrected model:

```text
MCP client A ─┐
              ├─> independent BirdEye stdio connections
MCP client B ─┘
                       │
                       └─> separately singleton-leased filesystem watcher
```

The process-scoped diagnostic marker must not force a second legitimate client to disconnect. The watcher lease remains separate and singleton-owned.

Validation reported after the fix:

- Python compilation: PASS;
- focused Skills tests: 7 passed;
- concurrent stdio smoke test while another BirdEye process held the diagnostic marker:
  - initialize: PASS;
  - `skills(operation="status")`: PASS;
  - MCP `isError`: false;
  - shutdown: PASS.

A client session that already cached the previous disconnected state may require MCP connection reload/restart. That stale client state is not proof that the repaired server still rejects concurrent clients.

## Current direction for agents

Use BirdEye according to the claim being established:

| Need | BirdEye route |
|---|---|
| Current local indexed evidence | `birdeye_search` / `birdeye_inspect` |
| Index/EYES health | `birdeye_status` and active EYES health surface |
| Workspace/HEAD/dirty identity | `workspace_identity` / `revision_status` |
| Project mapping | `local_projects` |
| GPT-Knowledge route/read | `knowledge_route` / `knowledge_read` |
| Historical recall | `memory_*` tools, preserving Memory ownership |
| Curated skill discovery | `skills(query)` |
| Curated skill fetch | `skills(fetch)` |
| Governed local execution | `workspace_run` / `workspace_run_sequence` |
| Execution journal | `workspace_command_history` |

## Evidence precedence

For present-state engineering claims:

```text
live runtime proof
  > active local workspace evidence
  > canonical GitHub remote evidence
  > project-specific durable GPT-Knowledge
  > curated Skills methodology
  > model inference
```

Historical Memory is authoritative for what happened historically, not automatically for what is true now.

## What BirdEye does not prove by itself

BirdEye source/index/tool presence does not automatically prove:

- a UI rendered correctly;
- a browser action reached the intended rendered target;
- a provider completed a real continuation;
- a remote branch contains local uncommitted changes;
- an MCP client reloaded stale connection state;
- a capability is user-visible merely because its schema exists.

Match proof to the claim.

## Maintenance rule

Before making a consequential present-state claim about BirdEye:

1. inspect current local BirdEye source/runtime when available;
2. verify the actually registered MCP tool surface;
3. distinguish source implementation, focused tests, MCP protocol proof, and live client behavior;
4. preserve canonical owners for Memory, Skills content, GPT-Knowledge, GitHub, and runtime evidence;
5. update this reference and `letterblack-mcp-ecosystem-and-routing.md` when a durable ownership/routing boundary changes.
