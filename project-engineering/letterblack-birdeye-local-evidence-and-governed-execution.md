# Letterblack BirdEye — Local Evidence, MCP Routing, EYES, and Governed Execution

Updated: 2026-09-01

## Purpose

`Letterblack_BirdEye` is the consolidated client-facing local MCP evidence/index and governed-execution surface used alongside GPT-Knowledge, Memory, Skills, GitHub, and live runtime evidence.

Use `project-engineering/letterblack-mcp-ecosystem-and-routing.md` for the complete ecosystem map and ownership direction.

BirdEye is an access/evidence surface. It does not automatically become the canonical owner of every source it exposes.

## Current validated client topology

```text
Codex ─────────┐
Cline ─────────┤
OpenCode ──────┤
Gemini ────────┼──> BirdEye MCP
Antigravity ───┤       ├── workspace query
Claude ────────┘       ├── memory query
                        └── skills query
```

The validated MCP Local architecture keeps BirdEye as the consolidated enabled Letterblack MCP route for these clients.

Required route properties validated on 2026-09-01:

- direct client Memory MCP route: absent;
- separate client Skills MCP route: absent;
- broad user-directory filesystem route: disabled;
- legacy/competing MCP routes: absent or disabled;
- Cline standalone and Cline VS Code extension both route through BirdEye;
- client-controlled on-demand BirdEye startup is enabled where applicable.

This is a routing boundary, not an ownership transfer.

## Current ownership boundary

```text
GPT-Knowledge
  -> durable project/method/status/reference projection and routing

Memory
  -> canonical historical conversations/messages/provenance

Skills
  -> curated reasoning/workflow instructions

BirdEye MCP
  -> consolidated client MCP entry point
  -> current local evidence/index access
  -> GPT-Knowledge routing/read access
  -> Memory query/read access
  -> consolidated Skills query/fetch/status
  -> workspace/revision identity
  -> governed local commands
  -> EYES projection/query health controls

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

BirdEye may expose GPT-Knowledge route/read capabilities while GPT-Knowledge remains the durable knowledge owner.

### Historical Memory access

BirdEye exposes Memory-facing historical query/read capabilities for past ChatGPT and agent runtime/session evidence.

Canonical historical content remains owned by Memory even when accessed through BirdEye.

The current validated client route is:

```text
client -> BirdEye MCP -> Memory capability/data owner
```

A duplicate direct client -> Memory MCP registration is not part of the validated architecture.

### Curated Skills

BirdEye exposes exactly one consolidated public `skills` tool:

- `skills(operation="status")`
- `skills(operation="query", query=..., prefix=...)`
- `skills(operation="fetch", rel=...)`

`skill-gallery-router` is routing guidance for the agent. It tells the agent when and where to look; it is not the actual gallery retrieval engine.

Correct direction:

```text
skill-gallery-router (when useful)
  -> BirdEye skills(query)
  -> select returned rel
  -> BirdEye skills(fetch) only when full content is needed
```

Current architecture validation also reports:

- one public Skills tool: PASS;
- no legacy Skills APIs: PASS;
- no agent-specific Skills partitions: PASS;
- shared curated corpus: 52 `SKILL.md` files;
- canonical SHA-256 identity for every skill;
- automatic discovery without supplying a skill name: PASS;
- bounded retrieval: PASS;
- alternate method discovery: PASS;
- Memory owns no Skills MCP surface: PASS.

Skills vectors remain optional. Current Skills retrieval is lexical with SHA identity/duplicate suppression and does not require a vector implementation to satisfy the architecture gate.

### Workspace/revision evidence

BirdEye owns the consolidated local route for current workspace/index/revision evidence.

### Governed execution

BirdEye execution remains policy-bound. A rejected command proves that BirdEye did not authorize that invocation through its configured governance; it does not prove the operation is universally impossible.

## EYES and derived retrieval state

BirdEye's EYES contract separates durable data/ledger state from disposable query projection state.

```text
canonical source/content owner
        ↓
eye_<domain>_data_01.db
  canonical_generation
  durable changes ledger
        ↓
replay / deterministic rebuild
        ↓
eye_<domain>_query_01.db
  applied_generation

lag = canonical_generation - applied_generation
```

Workspace, Memory, and Skills are represented through the current local query architecture according to their ownership boundaries.

Memory semantic vectors are active in the BirdEye-owned derived semantic index. Canonical historical content remains owned by Memory. The derived vector/index layer is retrieval infrastructure, not historical truth ownership.

Skills vectors remain optional.

## Query capabilities

The 2026-09-01 validation reports the following query capabilities as PASS:

- exact symbol;
- exact phrase/error/message;
- lexical content/keyword search;
- path/path-prefix search;
- root selection;
- Memory semantic retrieval;
- fetch;
- status;
- freshness/SHA verification;
- alternate-method/capability discovery.

## MCP process and watcher lifecycle

BirdEye supports legitimate concurrent MCP stdio clients while preventing duplicate indexing watchers.

```text
MCP client A ─┐
              ├─> independent BirdEye stdio connections
MCP client B ─┘
                       │
                       └─> separately singleton-leased filesystem watcher
```

The watcher remains singleton-owned separately. A stale client session may require MCP connection reload/restart after a server-side repair.

## Current architecture validation checkpoint — 2026-09-01

Supplied MCP Local validation reports:

```text
Current architecture: PASS
Required checks:      52 PASS
Required failures:    0 FAIL
```

Key runtime/configuration proof includes:

- BirdEye MCP handshake: PASS;
- live Skills registration: exactly one public Skills tool;
- automatic Skills discovery: PASS;
- bounded Skills retrieval: PASS;
- alternate method discovery: PASS;
- Memory semantic retrieval: PASS;
- Memory incremental vector lifecycle coverage: PASS;
- legacy Memory vector path absent: PASS;
- all named client configurations checked for consolidated BirdEye routing and absence of duplicate direct Memory routes.

Local validation artifacts:

```text
C:\MCP Local\servers\mcp_local_validation_report.json
C:\MCP Local\servers\mcp_local_validation_report.md
C:\MCP Local\servers\mcp_local_validation.log
```

## Evidence precedence

For present-state engineering claims:

```text
live runtime proof
  > active local workspace/configuration evidence
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

1. inspect current local BirdEye configuration/source/runtime when available;
2. verify the actually registered MCP tool surface;
3. distinguish source implementation, focused tests, MCP protocol proof, and live client behavior;
4. preserve canonical owners for Memory, Skills content, GPT-Knowledge, GitHub, and runtime evidence;
5. do not reintroduce duplicate direct Memory, separate Skills, broad filesystem, or legacy MCP routes without new evidence that the validated topology has intentionally changed;
6. update this reference and `letterblack-mcp-ecosystem-and-routing.md` when a durable ownership/routing boundary changes.