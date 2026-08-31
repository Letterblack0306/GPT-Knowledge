# Local Evidence, Memory, Skills, and LoopTool Routing

## Purpose

This document defines the current Letterblack local-agent evidence configuration and the authority boundaries between BirdEye, Memory, GPT-Knowledge, Skills, and LoopTool.

It is a routing and interpretation contract. It does not replace live workspace/runtime inspection.

## Canonical ownership

```text
BirdEye
= shared MCP access surface for indexed workspace, Skills, and Memory capabilities;
  canonical local filesystem identity, indexing, SHA-256, root status, revision/provenance

Memory
= historical conversations, agent sessions, runtime history, and derived durable memory

Skills
= curated specialized skill content and workflow guidance

GPT-Knowledge
= curated reusable engineering knowledge and project/method projection

LoopTool
= bounded local command execution only
```

These responsibilities are complementary. BirdEye may expose shared discovery/retrieval for a domain without becoming the semantic owner of that domain.

## Current common MCP direction

The current architecture removes agent-specific skill filesystem/catalog authority from runtime construction and routes agents toward a common BirdEye MCP capability surface.

Target flow:

```text
reasoning agent
→ common MCP capability discovery
→ BirdEye
   ├─ workspace capability
   ├─ skills capability
   └─ memory capability
→ bounded discovery/retrieval
→ agent consumes returned evidence/guidance
```

Ownership remains distinct:

```text
BirdEye = access/index/retrieval surface
Skills  = curated skill-content domain
Memory  = historical/durable-memory domain
Agent   = consumer/reasoning owner
```

Do not infer runtime completion from this architecture record alone. Until current source/tests/runtime prove the common capability surface end to end, classify it as implementation in progress rather than PROVEN runtime behavior.

## BirdEye unified root model

Every local path BirdEye is responsible for must be represented by an explicit root record with an explicit indexing/hash policy.

An active indexed root follows this invariant:

```text
registered root
→ explicit enabled/index policy
→ explicit SHA-256 policy
→ indexed file inventory
→ persisted root/run status
→ queryable through BirdEye
```

For all enabled indexed roots, including historical Memory roots:

```text
new file
→ index immediately
→ calculate SHA-256 immediately
→ hash_status = hashed

unchanged file
→ reuse size + mtime + existing SHA
→ no rehash

changed file
→ re-read
→ calculate new SHA-256
→ update index

deleted file
→ remove during reconciliation
```

Hashing identifies exact content. Hashing does not determine semantic authority.

## Indexed-content search evolution

The older reference pattern used SQLite metadata/SHA for candidate lookup and then reopened candidate physical files to search current content.

The BirdEye MCP implementation is being extended beyond that pattern with:

- cached searchable content in the SQLite file index;
- root and `path_prefix` filtering;
- indexed-only normal content matching;
- optional `verify_freshness` checks;
- targeted refresh of changed or uncached files;
- explicit `content_status` and `version_status` reporting.

Target behavior:

```text
normal query
→ indexed/cached content search
→ no recursive filesystem rescan
→ no physical file read merely to perform normal content matching

explicit freshness/inspect
→ targeted filesystem check/read
→ refresh SHA/content when changed or uncached
```

Do not classify this target as fully PROVEN until focused tests and live MCP behavior confirm it, including migration/backfill of pre-content-cache rows.

## Historical Memory roots

Historical agent/runtime data is indexed and SHA-identified by BirdEye but remains Memory-domain evidence.

Historical roots use:

```text
root_class = memory
authority = historical
```

The classification controls interpretation, not hashing.

Known historical categories include:

- ChatGPT conversation/history sources imported into Memory;
- Cline sessions;
- Codex sessions;
- Claude sessions;
- Gemini history;
- Antigravity runtime history;
- BirdEye execution history;
- other verified agent/runtime logs added later.

A provider/agent path must not be invented. Register it only after a real local path has been verified.

### Historical authority rule

Historical records can answer what happened previously, what an agent attempted, what output/error was observed, what decision or plan existed at that time, and what prior context may help the current investigation.

Historical records cannot by themselves establish current code, current file existence, current repository cleanliness, current test results, current runtime behavior, or whether an old implementation remains authoritative.

Current truth must be reverified against the current workspace/repository/runtime authority.

## Authority order

For project/software-engineering claims use:

```text
user instruction
→ live/runtime evidence
→ current workspace/source evidence
→ canonical repository/revision evidence
→ BirdEye current root/index/revision evidence
→ project-specific current records
→ GPT-Knowledge curated/project projection
→ Memory historical/session evidence
→ official external documentation
→ model prior knowledge
```

Memory is intentionally below current source/runtime evidence because it preserves the past.

## Skills through BirdEye

The retired direct `skills_hash_status` / `skills_list` / `skills_fetch` workflow is not the current intended agent path.

The current routing target is:

```text
agent needs specialized guidance
→ discover Skills capability through common BirdEye MCP surface
→ narrow with BirdEye root/status/search/inspect capability
→ select the smallest relevant skill content
→ consume returned indexed content + SHA/version metadata
```

BirdEye owns filesystem/index/retrieval mechanics for registered skill files. Skills remains the semantic content/curation domain.

An individual application or agent must not recreate a local SkillCatalog, skill filesystem scanner, skill SHA cache, or independent discovery authority merely because it consumes skills.

A skill SHA identifies the exact skill content version; it does not establish current workspace/runtime truth.

## Memory through BirdEye

Agents should discover and retrieve historical Memory evidence through the common BirdEye MCP surface when that capability is exposed, while preserving Memory authority semantics.

```text
BirdEye retrieval
≠ Memory truth promotion
```

Historical records remain historical even when discovered, indexed, hashed, and returned through BirdEye.

## GPT-Knowledge boundary

GPT-Knowledge owns reusable knowledge and project/method projection.

Use BirdEye root/index/SHA state for local GPT-Knowledge file provenance where available.

GPT-Knowledge may explain the expected architecture and latest recorded project position, but it must not override newer source/runtime evidence.

## LoopTool boundary

LoopTool is a command executor, not an agent, indexer, memory system, search system, or semantic planner.

Use LoopTool only after the reasoning agent has already determined the exact workspace/path, exact bounded command, why execution is necessary, and what output/result would count as evidence.

Preferred flow:

```text
task
→ retrieve/verify with the appropriate evidence owner through the common evidence surface where available
→ select exact target
→ formulate bounded command
→ execute with LoopTool
→ inspect AGENT RESULT
→ validate semantic outcome with the proper authority
```

Do not use LoopTool to:

- locate files or search indexed workspaces → BirdEye;
- recall historical conversations → BirdEye/Memory capability while preserving Memory authority;
- load specialized guidance → BirdEye/Skills capability while preserving Skills authority;
- determine remote repository truth → GitHub/repository authority;
- decide what command should be run → reasoning agent.

LoopTool's command SHA is execution deduplication/receipt identity. It is not a workspace-integrity hash and it is not a substitute for BirdEye file SHA-256 or Git revision identity.

## Hash taxonomy

Keep hash meaning explicit:

| Hash | Meaning |
|---|---|
| `file_sha256` | exact content hash for one BirdEye-indexed file |
| `root_snapshot_sha256` | deterministic identity of a completed root snapshot when implemented/exposed |
| `config_sha256` | canonical root/index policy identity |
| `git_head_sha` | committed repository revision |
| `diff_state_sha256` | working-tree/diff evidence identity |
| `command_hash` | normalized LoopTool/BirdEye command request identity |
| `execution_evidence_sha256` | complete governed execution receipt identity |
| `memory_record_sha256` | semantic/durable Memory record identity |
| skill SHA-256 | exact loaded curated skill content identity |

Do not compare unlike hash types as if they represented the same thing.

## Decision rule for agents

When a task involves local evidence, ask which owner can actually prove the next fact and which common capability surface exposes it:

```text
current file/path/content?        → BirdEye workspace capability
current Git/revision state?       → BirdEye + Git/repository evidence
past conversation/agent activity? → BirdEye Memory capability; authority remains Memory/historical
reusable engineering guidance?    → GPT-Knowledge
specialized procedure/skill?      → BirdEye Skills capability; authority remains Skills
local command execution?          → LoopTool
live user-visible behavior?       → runtime-specific acceptance path
```

Use the smallest relevant owner set and preserve the distinction between access surface, semantic ownership, current truth, curated knowledge, historical context, and execution evidence.
