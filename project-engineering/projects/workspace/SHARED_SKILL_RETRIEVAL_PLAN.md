# Shared Skill Retrieval Layer — Implementation Plan

## Objective

Create one shared, local skill-discovery/retrieval capability that can be used by all agents in the system.

The system must:

- discover skills from existing authoritative sources;
- classify source authority;
- index skills for fast deterministic retrieval;
- retrieve only relevant skills/sections;
- expose retrieval through the existing local MCP;
- leave the existing local agent as the only reasoning authority.

SQLite is an index/projection/cache, not the canonical skill store. Canonical skill files remain authoritative.

## Architecture

```text
Authoritative skill sources
        ↓
Source discovery
        ↓
Authority classification
        ↓
Skill parsing
        ↓
SQLite projection + FTS5
        ↓
Shared Skill Retrieval MCP
        ↓
Local AgentSessionRuntime / LiveAgentCore
        ↓
existing reasoning + existing tools
```

Roles:

- Skill source = procedural authority
- BirdEye = workspace/file discovery and current-file evidence where applicable
- SQLite = disposable retrieval projection
- MCP = retrieval interface
- Local agent = reasoning and decision authority

Do not create a second reasoning system.

## Phase 0 — Go / No-Go Discovery

Before changing code, discover the real current skill landscape.

Inspect:

- global skills;
- project-local skills;
- repository-local skills;
- MCP-provided procedural skills;
- GPT-Knowledge skill/procedural sources;
- existing skill catalogs/manifests;
- existing skill parsing/indexing/search implementations;
- existing SQLite indexes related to skills or memory;
- BirdEye workspace/file discovery capabilities.

Do not assume the number of skills. Do not assume every `SKILL.md` is canonical.

Return:

```text
SKILL_SOURCE
SOURCE_KIND
SOURCE_LOCATION
PROJECT_SCOPE
SKILL_COUNT
FORMAT
CURRENT_INDEX
CURRENT_SEARCH
OWNER
AUTHORITY
```

Build only when:

- skills exist across at least two meaningful source roots;
- current discovery is duplicated, slow, noisy, or context-heavy;
- authority can be classified;
- existing BirdEye/search is insufficient for skill-aware retrieval.

If all useful skills are already in one small canonical source and existing retrieval is sufficiently precise and fast, do not build a parallel index. If GO is not proven, stop after discovery.

## Phase 1 — Source Authority Model

Every discovered source receives exactly one authority class:

```text
CANONICAL
SECONDARY
REFERENCE
GENERATED
DUPLICATE
LEGACY
UNKNOWN
```

Definitions:

- CANONICAL = authoritative procedural source
- SECONDARY = usable derivative/reference source
- REFERENCE = useful documentation but not itself authoritative skill content
- GENERATED = produced from another authority
- DUPLICATE = content duplicated from another source
- LEGACY = retained historical material
- UNKNOWN = unresolved authority

UNKNOWN and lower-authority sources must never outrank CANONICAL solely because of FTS relevance.

Preserve source identity separately from skill identity. Do not deduplicate skills merely because names match.

## Phase 2 — Discovery / BirdEye Integration

Determine whether BirdEye can provide the general filesystem/workspace discovery needed.

Preferred design:

```text
BirdEye
→ discover current files / workspace facts

Skill layer
→ identify skill sources
→ parse skill semantics
→ classify authority
→ hash and index
```

Do not create multiple overlapping generic filesystem crawlers unless BirdEye is proven insufficient. The new component specializes in skill semantics.

## Phase 3 — Canonical Skill Identity

Define stable source and skill identities.

Example source fields:

```text
source_id
source_kind
source_owner
canonical_root
project_scope
authority_class
retrieval_priority
enabled
last_scan_at
```

Example skill fields:

```text
skill_id
canonical_key
source_id
name
description
version
capability_scope
content_sha256
updated_at
status
```

Example chunk fields:

```text
skill_id
section_id
heading
ordinal
content
content_sha256
```

Example tag fields:

```text
skill_id
tag
```

Retain physical paths internally for indexing and invalidation; do not expose them through MCP results unless explicitly required for provenance.

## Phase 4 — SQLite Projection

Create a disposable local SQLite database.

SQLite must be reconstructible entirely from canonical sources.

Required properties:

- deleting the database does not delete skills;
- indexing is deterministic;
- source hashes determine updates;
- unchanged skills are not rewritten unnecessarily.

Use SQLite FTS5 for initial retrieval.

Do not introduce embeddings or a separate vector service yet.

## Phase 5 — Incremental Indexing

Index flow:

```text
discover source
→ resolve canonical skill
→ read source
→ SHA-256
→ compare indexed hash
→ parse if changed
→ update changed records
→ remove deleted records
→ preserve unchanged records
```

Track:

- last scan;
- last indexed;
- source hash;
- content hash;
- parser version.

If parsing rules change, provide a deterministic re-index mechanism.

## Phase 6 — Skill Parser

Parse only actual procedural skill content.

A document qualifies as a skill only when:

- explicitly registered as a skill; or
- the source authority explicitly classifies it as procedural skill material.

Do not infer that a document is a skill merely because it contains instructions.

Capture:

- name;
- description;
- sections;
- headings;
- tags;
- capability scope;
- project scope;
- source authority;
- revision/hash.

## Phase 7 — Retrieval Engine

Initial retrieval is deterministic:

```text
query
+ project
+ capability
+ tags
+ authority
+ FTS5
```

Ranking order:

1. eligibility / authority;
2. project scope;
3. FTS relevance;
4. capability match;
5. explicit tags;
6. freshness.

Authority is a constraint, not merely another score.

Do not load complete skill catalogs into agent context.

## Phase 8 — MCP Interface

Expose retrieval-only MCP operations:

```text
search_skills
get_skill
get_skill_sections
list_skill_sources
```

Optional later:

```text
get_skill_metadata
```

Do not expose:

```text
run_skill
execute_skill
reason_about_skill
install_skill
modify_skill
```

The MCP retrieves procedural knowledge only.

## Phase 9 — Search Result Contract

Search returns concise metadata first.

Example:

```json
{
  "skill_id": "agent-runtime-proof",
  "name": "Agent Runtime Proof",
  "scope": "global",
  "capability": ["runtime-validation"],
  "authority": "CANONICAL",
  "score": 0.91,
  "matched": [
    "runtime validation",
    "installed acceptance",
    "provider"
  ]
}
```

The result should explain why it matched. Do not return opaque similarity numbers without match context. Do not return entire skill bodies in search results.

## Phase 10 — Section Loading

After the agent selects a skill:

```text
search
→ candidate metadata
→ selected skill
→ selected/relevant sections
→ agent context
```

Do not load all sections automatically.

Support selection by section IDs or headings and preserve source section order.

## Phase 11 — Agent Integration

Existing reasoning remains unchanged.

```text
agent objective
→ skill search
→ candidate selection
→ relevant skill sections
→ Local AgentSessionRuntime
→ LiveAgentCore
→ normal reasoning
→ governed capabilities
```

The skill system provides context only. It does not plan independently, reason independently, execute tools, or become a second agent.

## Phase 12 — Project / Capability Scoping

Support:

- global skills;
- project skills;
- capability-specific skills.

Examples include Access Browser Agent, LBE, LoopTool, and other discovered projects, but projects must not be hard-coded into the retrieval engine. Use registry metadata.

## Phase 13 — GPT-Knowledge Integration

GPT-Knowledge may be used as a source.

Do not copy all GPT-Knowledge documents into the skill index.

Differentiate:

```text
actual procedural skill
vs
project documentation
vs
historical/reference material
```

Only explicitly qualified procedural material becomes a skill.

GPT-Knowledge remains its own authority system. The skill index remains a retrieval projection.

## Phase 14 — Validation

Unit tests must cover:

- source discovery;
- authority classification;
- duplicate handling;
- SHA-256 calculation;
- changed-source detection;
- deleted-source detection;
- incremental update;
- parser correctness;
- FTS retrieval;
- project filtering;
- capability filtering;
- authority ranking;
- section retrieval.

MCP tests must cover:

- search_skills;
- get_skill;
- get_skill_sections;
- list_skill_sources;
- invalid skill rejection;
- unknown source handling.

Negative tests must cover:

- UNKNOWN outranking CANONICAL;
- duplicate skills collapsing incorrectly;
- legacy skill appearing as canonical;
- generated copy replacing source authority;
- physical path leakage;
- arbitrary skill execution;
- full catalog injection.

## Phase 15 — Performance Measurements

Measure with real executions:

- total canonical skills;
- total indexed skills;
- database size;
- initial index time;
- incremental index time;
- average search latency;
- section retrieval latency;
- cache hit rate.

Do not claim SQLite is faster than existing search until measured.

## Phase 16 — Multi-Project Acceptance

Run real retrieval tasks against at least:

- Access Browser Agent;
- LBE;
- LoopTool;
- another discovered project if available.

For each:

```text
request
→ search
→ select candidates
→ load relevant skill sections
→ agent continues normally
```

Verify:

- project-specific skills outrank unrelated skills;
- global skills remain available;
- canonical sources outrank secondary/generated/legacy material;
- only selected content enters context.

## Phase 17 — Source Change Acceptance

Change one canonical skill, run incremental indexing, and prove:

- SHA changes;
- only that skill is reindexed;
- unchanged skills remain untouched;
- retrieval reflects new content.

Then delete one canonical skill, run incremental indexing, and prove it disappears from retrieval while source provenance/history remains observable where applicable.

## Phase 18 — Failure / Recovery

Handle:

- missing source;
- unreadable source;
- malformed skill;
- duplicate source;
- unknown authority;
- stale index;
- SQLite corruption.

Recovery model:

```text
canonical source
→ rebuild index
```

Do not lose canonical content when SQLite is damaged.

## Phase 19 — Future Extensions

Do not implement initially:

- embeddings;
- semantic vector database;
- LLM skill router;
- automatic skill orchestration;
- skill dependency DAG;
- skill execution;
- skill recommendation agent;
- cross-agent memory blending.

These remain future options after deterministic retrieval is proven insufficient.

## Phase 20 — Final Acceptance

Acceptance requires:

1. canonical skill sources identified;
2. authority classifications proven;
3. SQLite is a disposable projection;
4. FTS retrieval works;
5. project/capability filtering works;
6. canonical authority constrains ranking;
7. incremental indexing works;
8. section-level loading works;
9. MCP exposes retrieval only;
10. local agent remains reasoning authority;
11. multiple projects successfully retrieve relevant skills;
12. no physical paths or credentials leak;
13. no skill execution occurs through retrieval MCP;
14. measured retrieval performance is recorded.

## Repository / Local Layout Context

Current local root:

```text
C:\MCP Local\
├── GPT-Knowledge
├── Letterblack_BirdEye
├── Memory
├── Skills
├── servers
├── config
├── state
├── workspace
├── Chat_Dataexported
└── startup-loader.ps1
```

The intended shared skill source area is:

```text
C:\MCP Local\Skills\
```

This directory is a candidate canonical source root, subject to Phase 0 authority discovery. Do not assume all content under it is canonical until classified.

Relevant existing authorities:

- GPT-Knowledge = documented/project/UI truth
- Letterblack_BirdEye = workspace discovery/audit/evidence
- Memory = historical/durable memory
- Skills = intended shared skill source area, pending authority audit
- Chat_Dataexported = source archive
- servers = local service binaries/scripts
- state/workspace = runtime state

Keep these authorities independent.

## Final Status Format

```text
SKILL_RETRIEVAL_STATUS:
GO / NO-GO

SOURCES:
<exact source list>

AUTHORITY_MAP:
<source → authority>

CANONICAL_SKILL_COUNT:
<count>

SQLITE_PROJECTION:
<path/schema/status>

FTS:
<status>

MCP_TOOLS:
<tools>

RETRIEVAL_LATENCY:
<measured results>

INCREMENTAL_INDEX:
<PASS/FAIL>

MULTI_PROJECT_ACCEPTANCE:
<PASS/FAIL>

BIRDEYE_REUSE:
<what was reused / why not>

AGENT_INTEGRATION:
<PASS/FAIL>

OPEN_GATES:
<evidence-backed only>

DO_NOT_CLAIM:
<any capability not actually demonstrated>
```

## Protected Boundaries

Do not modify the existing GPT-Knowledge UI/BirdEye system unless the skill retrieval work demonstrably requires an integration point.

Do not disturb the Phase 9 closure.

Do not touch unrelated untracked files such as `section_09.md`.

Do not create a second reasoning system.

Do not make SQLite the canonical skill store.

Do not build embeddings or autonomous skill orchestration in the initial implementation.
