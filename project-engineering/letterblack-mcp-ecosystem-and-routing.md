# Letterblack MCP Ecosystem and Routing

Updated: 2026-09-01

## Purpose

This document defines the current Letterblack local-agent ecosystem, ownership boundaries, client routing direction, and the distinction between configuration validity and live runtime validity.

It is a routing/ownership reference, not runtime truth. Current local source, registered MCP tools, live process state, validation receipts, repository state, and runtime evidence outrank this document.

## Intended client topology

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
        └── BirdEye MCP              <- consolidated Letterblack MCP route
              ├── workspace query
              ├── memory query       <- ChatGPT + agent runtime/session history
              └── skills query       <- one consolidated Skills namespace/index
```

The validated configuration model uses BirdEye as the consolidated Letterblack MCP route. Clients should not add duplicate direct Memory or separate Skills MCP routes when following this architecture.

This routing consolidation does not collapse ownership:

```text
Reasoning Agent   -> interpretation, planning, tool selection, conclusions
BirdEye MCP       -> consolidated local MCP access/evidence surface
Memory            -> canonical historical conversations/messages/provenance
Skills            -> canonical curated reasoning/workflow corpus
GPT-Knowledge     -> durable project/method/status/reference projection and routing
GitHub            -> canonical remote repository/branch/commit/PR/check truth
Runtime/Browser   -> live behavior proof
```

BirdEye may expose Memory, Skills, and GPT-Knowledge capabilities without becoming the canonical owner of those sources.

## Current authoritative status — 2026-09-01

The latest supplied verification separates architecture/configuration validity from live runtime exclusivity.

```text
MCP Local structure/configuration: PASS
BirdEye handshake and Skills surface: PASS
Global active-runtime exclusivity: FAIL
Overall production-ready verdict: NOT YET PROVEN
```

Architecture validator:

```text
required checks: 52 PASS
required failures: 0 FAIL
```

Global MCP alignment audit:

```text
status: FAIL
issue: LIVE_COMPETING_PROCESS
active competing processes reported: 3
  - mcp-filesystem-server.exe
  - Context7 MCP
  - Playwright MCP
port 3000: not listening
C:\MCP Local\AGENTS.md: not found
```

The audit text also describes two competing MCP/proxy processes while listing three active competing processes. Preserve that discrepancy as reported; do not invent a reconciliation without the underlying audit/process evidence.

### Correct interpretation

1. The 52/52 architecture result proves the validated structure/configuration checks passed. It does **not** prove global live-process exclusivity.
2. Skills lexical retrieval is acceptable by current design. The validator proves the curated 52-skill corpus, SHA identity checks, one public Skills tool, and lexical retrieval. It does not prove that every agent has no separately loaded skill copy.
3. Absolute and cwd-relative BirdEye paths may resolve to the same server, but path form alone does not prove the same Python executable is used. That requires each client's complete launcher configuration plus live process command-line evidence.
4. Disabled or removed legacy configuration entries do not terminate processes already launched by an earlier client/session. Static cleanup therefore does not prove runtime cleanup.
5. A disabled entry also does not by itself prove it cannot be reactivated or inherited from another configuration layer.
6. The current configuration layer is largely aligned, but live runtime state is not yet aligned.
7. Production readiness must remain unproven until the live competing-process condition is cleared and the global alignment audit passes.

## Ownership and direction

### Reasoning agent

The agent owns interpretation, task decomposition, tool selection, reconciliation, planning, and conclusions.

> Agents reason; bridges and MCP transports expose bounded capabilities and evidence.

### Skills

Skills are curated reasoning/workflow instructions. They are not repository truth and are not local execution tools.

`skill-gallery-router` tells the agent when and where to look. Actual retrieval is performed by BirdEye's consolidated Skills capability:

```text
task
  -> skill-gallery-router when useful
  -> BirdEye MCP skills(operation="query")
  -> select returned rel/path
  -> BirdEye MCP skills(operation="fetch") when full content is needed
```

Current public operations:

- `skills(operation="status")`
- `skills(operation="query", query=..., prefix=...)`
- `skills(operation="fetch", rel=...)`

Do not use obsolete separate `skills_list`, `skills_fetch`, or `skills_hash_status` assumptions. Do not create agent-specific Skills partitions.

Skills retrieval is currently lexical with SHA-256 identity/duplicate suppression. Skills vectors remain optional.

### GPT-Knowledge

GPT-Knowledge owns durable project/method/status/reference projection and deterministic routing guidance. It does not prove current local workspace state, remote repository state, or live runtime behavior.

### BirdEye MCP

BirdEye is the intended consolidated client-facing local MCP surface for:

- local workspace/index evidence;
- GPT-Knowledge route/read access;
- historical Memory query/read access;
- consolidated Skills query/fetch/status;
- workspace/revision identity;
- governed local execution;
- EYES projection/health controls where exposed.

BirdEye configuration alignment does not by itself prove that no competing MCP/proxy processes remain alive.

### Memory

Memory remains the canonical historical data owner for imported ChatGPT history and agent/runtime/session history.

```text
client MCP route       = BirdEye
historical data owner  = Memory
```

A direct client -> Memory MCP registration is not part of the intended consolidated client topology.

Memory semantic vectors are active in the BirdEye-owned derived semantic index. The derived index is retrieval infrastructure, not historical-content ownership.

### EYES

EYES separates durable data/ledger state from disposable query projection state:

```text
canonical source/content owner
        ↓
eye_<domain>_data_01.db
canonical_generation + durable changes ledger
        ↓
replay / deterministic rebuild
        ↓
eye_<domain>_query_01.db
applied_generation
```

```text
lag = canonical_generation - applied_generation
```

Workspace, Memory, and Skills participate according to their ownership boundaries.

### GitHub

GitHub remains canonical remote repository truth for branches, commits, pull requests, remote file state, required checks, and workflow results.

### Runtime / browser / provider

Live behavior proof outranks documentation and static configuration for process liveness, successful MCP initialization/tool invocation, browser behavior, provider behavior, and production-readiness claims.

## Configuration validation vs runtime validation

Keep these two gates separate:

```text
CONFIGURATION / STRUCTURE GATE
  -> registered routes
  -> absent/disabled competing config entries
  -> corpus/index identities
  -> public MCP tool surface
  -> launcher declarations

LIVE RUNTIME GATE
  -> actual running processes
  -> actual process command lines
  -> actual executable identity
  -> inherited/stale client sessions
  -> live ports/listeners
  -> successful MCP handshake/tool behavior
```

Passing the first gate does not imply the second gate passed.

## Current validated configuration properties

The supplied architecture validator reports:

- BirdEye consolidated route configured for Codex, Cline standalone, Cline VS Code extension, OpenCode, Gemini, Antigravity, and Claude;
- duplicate direct Memory routes absent in validated client configurations;
- broad filesystem route disabled in validated configuration;
- one public Skills tool;
- no legacy Skills APIs;
- no agent-specific Skills partitions;
- 52 curated `SKILL.md` files;
- SHA-256 identity for every curated skill;
- automatic Skills discovery;
- bounded retrieval;
- alternate-method discovery;
- Memory semantic retrieval;
- Skills vectors optional.

These are configuration/architecture facts, not proof that stale or previously launched competing processes have terminated.

## Query capabilities

The architecture validator reports PASS for:

- exact symbol;
- exact phrase/error/message;
- lexical content/keyword retrieval;
- path/path-prefix lookup;
- root selection;
- Memory semantic retrieval;
- fetch;
- status;
- freshness/SHA verification;
- alternate-method/capability discovery.

## MCP process and watcher lifecycle

BirdEye may support legitimate concurrent stdio clients while indexing watcher ownership remains separately singleton-protected. That does not authorize unrelated competing MCP/proxy processes and does not make stale processes harmless by definition.

Static configuration changes do not terminate already running processes. Live process state must be checked independently.

## Capability routing table

| Need | Primary route | Canonical owner / proof boundary |
|---|---|---|
| Current local file/index evidence | BirdEye MCP | Current machine-local evidence surface |
| Local branch/HEAD/dirty status | BirdEye workspace/revision capability | Revision-bound local evidence |
| Governed local command | BirdEye governed execution | Policy-controlled execution |
| Durable project/method/status knowledge | GPT-Knowledge | GPT-Knowledge remains owner |
| Find specialist workflow guidance | skill-gallery-router -> BirdEye `skills(query)` | Skills corpus remains owner |
| Fetch selected skill | BirdEye `skills(fetch)` | Consolidated retrieval path |
| Past ChatGPT/agent/session evidence | BirdEye Memory query surface | Memory remains historical owner |
| Remote repository/PR/commit/check truth | GitHub | Canonical remote repository owner |
| Live MCP/process exclusivity | Live process/config audit | Static config is insufficient |
| Live UI/browser/provider behavior | Runtime-specific evidence | Only live execution proves behavior |

## Trust direction

For present-state engineering claims:

```text
live runtime/process evidence
  > active local workspace/configuration evidence
  > canonical GitHub remote evidence
  > durable project-specific GPT-Knowledge
  > curated Skills methodology
  > model inference
```

Historical evidence is authoritative for what happened historically, not automatically for what is true now.

## Required agent behavior

1. Identify whether a claim is about intended topology, static configuration, or live runtime state.
2. Never convert a configuration PASS into a runtime-exclusivity PASS without live process evidence.
3. Use BirdEye as the intended consolidated Letterblack MCP route for workspace, Memory, and Skills access.
4. Preserve canonical ownership even when BirdEye exposes access.
5. Treat lexical Skills retrieval as valid unless a requirement specifically demands semantic Skills vectors.
6. Do not infer executable identity from equivalent-looking path arguments; inspect complete launcher and process command line when that distinction matters.
7. Do not infer that disabled configuration terminated previously launched processes.
8. Use GitHub for remote repository truth.
9. Use runtime evidence for production-ready and live-behavior claims.
10. If configuration and runtime disagree, report both; runtime wins for current-process claims.

## Current validation artifacts

Architecture validation:

```text
C:\MCP Local\servers\mcp_local_validation_report.json
C:\MCP Local\servers\mcp_local_validation_report.md
C:\MCP Local\servers\mcp_local_validation.log
```

Global runtime/config alignment audit:

```text
C:\MCP Local\mcp_alignment_audit.md
C:\MCP Local\mcp_alignment_audit.json
```

Current authoritative summary:

```text
STRUCTURE / CONFIGURATION      PASS
BIRDEYE HANDSHAKE / SKILLS     PASS
LIVE RUNTIME EXCLUSIVITY       FAIL
PRODUCTION READY               NOT YET PROVEN
```
