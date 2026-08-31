# Local Evidence, Memory, Skills, and LoopTool Routing

## Purpose

This document defines the current Letterblack local-agent evidence configuration and the authority boundaries between BirdEye, Memory, GPT-Knowledge, the MCP Skills gallery, and LoopTool.

It is a routing and interpretation contract. It does not replace live workspace/runtime inspection.

## Canonical ownership

```text
BirdEye
= canonical local filesystem identity, indexing, SHA-256, root status, revision/provenance

Memory
= historical conversations, agent sessions, runtime history, and derived durable memory

GPT-Knowledge
= curated reusable engineering knowledge and project/method projection

Skills MCP
= specialized skill discovery/fetch over the curated skill corpus

LoopTool
= bounded local command execution only
```

These responsibilities are complementary. Do not collapse them into one service and do not let one subsystem silently assume another subsystem's authority.

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

Historical records can answer:

- what happened previously;
- what an agent attempted;
- what error/output was observed;
- what decision or plan existed at that time;
- what prior context may help the current investigation.

Historical records cannot, by themselves, establish:

- what code exists now;
- whether a file still exists now;
- whether the current repository is clean;
- whether tests pass now;
- whether runtime behavior works now;
- whether a prior implementation remains current.

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

## Skills MCP boundary

The curated Skills gallery remains a semantic discovery/fetch system.

Its role is:

```text
agent needs specialized guidance
→ skill-gallery-router
→ skills_hash_status
→ skills_list using narrowest relevant prefix
→ select smallest relevant skill set
→ skills_fetch selected SKILL.md/supporting files
→ retain returned SHA-256 as loaded skill version
```

BirdEye is the canonical local filesystem identity/index owner for registered skill files. Skills MCP retains skill-specific discovery, metadata, trigger, and fetch semantics.

Do not confuse a skill SHA with current workspace truth. A skill hash identifies the exact skill content loaded.

## GPT-Knowledge boundary

GPT-Knowledge owns reusable knowledge and project/method projection.

Use BirdEye root/index/SHA state for local GPT-Knowledge file provenance where available.

GPT-Knowledge may explain the expected architecture and latest recorded project position, but it must not override newer source/runtime evidence.

## LoopTool boundary

LoopTool is a command executor, not an agent, indexer, memory system, search system, or semantic planner.

Use LoopTool only after the reasoning agent has already determined:

- the exact workspace/path;
- the exact bounded command;
- why executing it is necessary;
- what output/result would count as evidence.

Preferred flow:

```text
task
→ retrieve/verify with the appropriate evidence owner
→ select exact target
→ formulate bounded command
→ execute with LoopTool
→ inspect AGENT RESULT
→ validate semantic outcome with the proper authority
```

Do not use LoopTool to:

- locate files or search indexed workspaces → BirdEye;
- recall historical conversations → Memory;
- load specialized guidance → Skills MCP;
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

When a task involves local evidence, ask which owner can actually prove the next fact:

```text
current file/path/content?        → BirdEye
current Git/revision state?       → BirdEye + Git/repository evidence
past conversation/agent activity? → Memory
reusable engineering guidance?    → GPT-Knowledge
specialized procedure/skill?      → Skills MCP
local command execution?          → LoopTool
live user-visible behavior?       → runtime-specific acceptance path
```

Use the smallest relevant owner set and preserve the distinction between current truth, curated knowledge, historical context, and execution evidence.
