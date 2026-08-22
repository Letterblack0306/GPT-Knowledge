# Shared Skill Retrieval Layer — Implementation Plan

## Scope clarification

This plan covers the shared local-agent skill corpus, not Browser Agent-specific skills.

The canonical Browser Agent skill:

```text
C:\MCP Local\GPT-Knowledge\skills\evidence-driven-engineering\SKILL.md
```

remains authoritative for that project workflow and is explicitly excluded from shared local-agent retrieval. It must not be copied, moved, rewritten, reclassified, or made a dependency of this system.

The shared local-agent collection is centered on:

```text
C:\MCP Local\Skills\
```

subject to source discovery and curation.

## Objective

Create one shared local skill-discovery/retrieval capability usable by all local agents.

The system must:

- discover skills from authoritative or intentionally curated sources;
- classify source authority;
- retrieve only relevant skills/sections;
- use deterministic retrieval first;
- expose retrieval through the existing local MCP;
- leave the existing local agent as the only reasoning authority.

SQLite is a disposable index/projection/cache, not the canonical skill store. Canonical/curated skill files remain authoritative.

## Architecture

```text
Authoritative / curated skill sources
        ↓
Source discovery
        ↓
Authority classification
        ↓
Skill parsing
        ↓
SQLite projection + FTS5   [only after GO gate]
        ↓
Skill Retrieval MCP
        ↓
Local AgentSessionRuntime / LiveAgentCore
        ↓
existing reasoning + governed capabilities
```

Roles:

- Skill source = procedural authority
- BirdEye = existing workspace/file discovery and current-file evidence substrate
- Skill layer = skill-specific parsing, classification, hashing, and retrieval semantics
- SQLite = disposable retrieval projection
- MCP = retrieval interface
- Local agent = reasoning and decision authority

Do not create a second reasoning system.

## Phase 0 — GO / NO-GO Discovery

Before implementation, inspect the real shared skill landscape:

- global skills;
- project/local skills;
- repository-local skills;
- MCP-provided procedural skills;
- shared local skill sources;
- external candidate repositories selected for collection;
- existing skill catalogs/manifests;
- existing skill search/index infrastructure;
- existing SQLite indexes;
- BirdEye discovery/search/read capabilities.

Do not assume every `SKILL.md` is canonical.

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

The SQLite build gate is OPEN only when:

- a meaningful shared/curated corpus exists;
- authority can be classified;
- deterministic retrieval is justified by actual scale/noise/latency or scope needs;
- BirdEye's existing general search is insufficient for skill-aware retrieval.

If the shared corpus remains small and BirdEye is sufficient, do not build a parallel index.

## Phase 1 — Source Authority Model

Every source gets one authority class:

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
- REFERENCE = useful material but not authoritative skill content
- GENERATED = produced from another authority
- DUPLICATE = materially duplicated content
- LEGACY = retained historical material
- UNKNOWN = unresolved authority

Authority constrains ranking. UNKNOWN/lower-authority content must not outrank CANONICAL solely through FTS relevance.

Preserve source identity separately from skill identity. Do not deduplicate by name alone.

## Phase 2 — BirdEye Reuse

Prefer:

```text
BirdEye
→ current workspace/file discovery
→ current file facts / hashes

Skill layer
→ identify actual skills
→ parse skill semantics
→ classify authority
→ hash/index
```

Do not add another generic filesystem crawler unless BirdEye is proven insufficient.

## Phase 3 — Shared Skill Collection / Curation

Shared root:

```text
C:\MCP Local\Skills\
```

Use audited external repositories as source/reference material, not architecture authority.

Known candidate references:

- `anthropics/skills`
- `cline/skills`
- `lobehub/skills`
- `erichare/skillroute`
- `JayCheng113/skill-retrieval-mcp`
- MCP experimental Skills/Resources work

Collection model:

```text
external source
→ audit repository structure
→ identify real skills
→ preserve upstream provenance
→ classify authority
→ C:\MCP Local\Skills\sources\
→ curate selected skills into C:\MCP Local\Skills\curated\
```

Do not import repositories wholesale without inspection.

For each imported source preserve:

- repository;
- commit SHA/ref;
- original skill path;
- source URL;
- import timestamp;
- SHA-256.

Default imported upstream material to `REFERENCE` until deliberately curated.

Do not turn arbitrary READMEs, project plans, examples, benchmarks, changelogs, blog posts, or implementation source into skills.

## Phase 4 — Canonical Skill Identity

Use stable source and skill identities.

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

Example chunks:

```text
skill_id
section_id
heading
ordinal
content
content_sha256
```

Example tags:

```text
skill_id
tag
```

Keep physical paths internally for provenance/invalidation. Do not expose machine paths through MCP results unless explicitly required.

## Phase 5 — SQLite Projection (Conditional)

Only after the GO gate is proven:

- create a disposable local SQLite database;
- make it fully reconstructible from canonical/curated sources;
- use SQLite FTS5 for the initial retrieval layer;
- keep the source corpus independent from the database.

Required invariants:

- deleting SQLite does not delete skills;
- indexing is deterministic;
- source hashes determine changes;
- unchanged skills are not rewritten unnecessarily.

Do not introduce embeddings or a vector service initially.

## Phase 6 — Incremental Indexing

```text
discover source
→ resolve canonical/curated skill
→ read source
→ SHA-256
→ compare index
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

Provide deterministic re-indexing when parser rules change.

## Phase 7 — Skill Parser

Only actual procedural skill content qualifies.

Qualification requires:

- explicit skill registration; or
- explicit source authority classification as procedural skill material.

Do not infer skill status from the presence of instructions alone.

Capture:

- name;
- description;
- sections/headings;
- tags;
- capability scope;
- project scope;
- authority;
- revision/hash.

## Phase 8 — Deterministic Retrieval

Initial retrieval:

```text
query
+ project
+ capability
+ tags
+ authority
+ FTS5
```

Ranking:

1. eligibility / authority;
2. project scope;
3. FTS relevance;
4. capability match;
5. explicit tags;
6. freshness.

Authority is a constraint, not just a score.

Do not inject the full catalog into agent context.

## Phase 9 — MCP Interface

Initial retrieval surface:

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

Do NOT expose:

```text
run_skill
execute_skill
reason_about_skill
install_skill
modify_skill
```

The MCP retrieves procedural knowledge only.

Before permanently fixing the MCP surface, check current Skills/Resources standards or proposals and preserve the option for a standard resource/lazy-loading implementation where appropriate. Experimental proposals are references, not authority.

## Phase 10 — Search Result Contract

Search returns concise metadata first and explains why it matched.

Example:

```json
{
  "skill_id": "agent-runtime-proof",
  "name": "Agent Runtime Proof",
  "scope": "global",
  "capability": ["runtime-validation"],
  "authority": "CANONICAL",
  "score": 0.91,
  "matched": ["runtime validation", "installed acceptance", "provider"]
}
```

Do not return opaque scores without match evidence or entire skill bodies in search results.

## Phase 11 — Section Loading

```text
search
→ candidate metadata
→ selected skill
→ selected sections
→ existing agent context
```

Load only the selected/relevant sections and preserve their order.

## Phase 12 — Agent Integration

Existing reasoning remains unchanged:

```text
agent objective
→ skill search
→ candidate selection
→ relevant sections
→ Local AgentSessionRuntime
→ LiveAgentCore
→ normal reasoning
→ governed capabilities
```

Skill retrieval provides context only. It does not become a planner, reasoner, executor, or second agent.

## Phase 13 — Project / Capability Scoping

Support:

- global skills;
- project skills;
- capability-specific skills.

Examples can include Access Browser Agent, LBE, LoopTool, and other discovered projects, but the retrieval engine must use registry metadata rather than hard-coded project names.

## Phase 14 — GPT-Knowledge Boundary

GPT-Knowledge may be a reference/source for explicitly qualified shared procedural material, but the Browser Agent-specific `evidence-driven-engineering` skill remains excluded from the shared local-agent corpus.

Do not copy all GPT-Knowledge documents into the skill index.

Differentiate:

```text
actual procedural skill
vs
project documentation
vs
historical/reference material
```

GPT-Knowledge remains its own authority system. The shared skill index remains a retrieval projection.

## Phase 15 — Validation

Unit tests:

- source discovery;
- authority classification;
- duplicate handling;
- SHA-256 calculation;
- change detection;
- deletion detection;
- incremental update;
- parser correctness;
- FTS retrieval;
- project filtering;
- capability filtering;
- authority ranking;
- section retrieval.

MCP tests:

- search_skills;
- get_skill;
- get_skill_sections;
- list_skill_sources;
- invalid skill rejection;
- unknown source handling.

Negative tests:

- UNKNOWN outranking CANONICAL;
- incorrect duplicate collapse;
- legacy material appearing canonical;
- generated copy replacing authority;
- physical path leakage;
- arbitrary skill execution;
- full catalog injection.

## Phase 16 — Performance Measurements

Measure with real executions:

- canonical/curated skill count;
- indexed skill count;
- database size;
- initial index time;
- incremental index time;
- average search latency;
- section retrieval latency;
- cache hit rate.

Do not claim SQLite is faster until measured.

## Phase 17 — Multi-Project Acceptance

Use real tasks against at least:

- Access Browser Agent;
- LBE;
- LoopTool;
- one additional discovered project if available.

For each:

```text
request
→ search
→ candidate selection
→ relevant section loading
→ existing agent reasoning
```

Prove:

- relevant project skills outrank unrelated skills;
- global skills remain available;
- CANONICAL outranks SECONDARY/GENERATED/LEGACY;
- only selected content enters context.

## Phase 18 — Source Change Acceptance

Change one canonical/curated skill and prove:

- SHA changes;
- only the affected skill reindexes;
- unchanged skills remain unchanged;
- retrieval reflects the new content.

Delete one canonical/curated skill and prove it disappears from retrieval while provenance/history remains observable where applicable.

## Phase 19 — Failure / Recovery

Handle:

- missing source;
- unreadable source;
- malformed skill;
- duplicate source;
- unknown authority;
- stale index;
- SQLite corruption.

Recovery:

```text
canonical/curated source
→ rebuild index
```

SQLite corruption must never destroy the source corpus.

## Phase 20 — Future Extensions

Do not initially build:

- embeddings;
- semantic vector database;
- LLM skill router;
- automatic skill orchestration;
- skill dependency DAG;
- skill execution;
- skill recommendation agent;
- cross-agent memory blending.

These remain future options only after deterministic retrieval is proven insufficient.

## Phase 21 — Final Acceptance

Accept only when:

1. shared canonical/curated skill sources are identified;
2. authority classifications are proven;
3. Browser Agent-specific skill remains excluded from shared retrieval;
4. SQLite is a disposable projection;
5. FTS retrieval works;
6. project/capability filtering works;
7. authority constrains ranking;
8. incremental indexing works;
9. section-level loading works;
10. MCP exposes retrieval only;
11. local agent remains the reasoning authority;
12. multiple projects successfully retrieve relevant skills;
13. no physical paths or credentials leak;
14. no skill execution occurs through retrieval MCP;
15. retrieval performance is measured.

## Local Layout Context

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

Roles:

- GPT-Knowledge = documented/project/UI truth
- Letterblack_BirdEye = workspace discovery/audit/evidence
- Memory = historical/durable memory
- Skills = shared skill source/curation area
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

CURATED_SKILL_COUNT:
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

Do not modify the existing GPT-Knowledge UI/BirdEye system unless skill retrieval demonstrably requires an integration point.

Do not disturb Phase 9 closure.

Do not touch unrelated untracked files such as `section_09.md`.

Do not create a second reasoning system.

Do not make SQLite the canonical skill store.

Do not build embeddings or autonomous skill orchestration in the initial implementation.
