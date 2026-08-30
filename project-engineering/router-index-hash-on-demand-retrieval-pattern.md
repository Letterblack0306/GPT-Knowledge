# Router + Index + Hash + On-Demand Retrieval Pattern

Status: REUSABLE DESIGN PATTERN
Scope: cross-feature retrieval systems where a large corpus should not be injected into agent context by default.

## Purpose

Use a small visible router as the stable entrypoint, keep the larger knowledge/capability corpus behind an MCP or equivalent retrieval boundary, use an index/catalog to locate candidate content, use hashes to identify exact content/version, and load only the selected material on demand.

This pattern is reusable beyond Skills. It may apply to memory records, documentation libraries, tool catalogs, workflow templates, prompts, reference assets, test/evidence records, or other large structured corpora when live evidence shows the same retrieval problem.

It is a pattern, not an automatic requirement. Do not apply it to another feature until the current implementation and actual retrieval gap have been verified.

## Core structure

```text
ONE SMALL VISIBLE ROUTER
        ↓
DISCOVERY / INDEX / CATALOG
        ↓
FILTER TO TASK-RELEVANT CANDIDATES
        ↓
HASH / VERSION IDENTITY
        ↓
FETCH SELECTED CONTENT ONLY
        ↓
AGENT USES THE CONTENT
```

For the current MCP skill-gallery implementation, the intended flow is:

```text
skill-gallery-router
        ↓
skills_hash_status
        ↓
skills_list
        ↓
skills_fetch
        ↓
verify returned SHA-256 / freshness
        ↓
load only the selected skill or required sections
```

## Responsibility split

### Router

- remains small and directly discoverable;
- teaches the agent how to reach the larger gallery/corpus;
- does not duplicate the gallery itself;
- selects the retrieval workflow, not the final domain answer;
- should not require the user to repeatedly explain how the gallery is accessed.

### Index / catalog

- answers **where / what is relevant?**;
- maps stable IDs, categories, paths, metadata, authority/provenance, and searchable fields;
- narrows a large corpus to a bounded candidate set;
- is a projection/cache when canonical files remain the authority;
- must be reconstructible from canonical content when designed as a disposable index.

### Hash

- answers **which exact content/version is this?**;
- supports change detection, deduplication, freshness checks, and provenance;
- does not by itself provide semantic discovery or location;
- must not be confused with an index.

### Fetch / load

- retrieves only the selected content;
- avoids full-corpus prompt injection;
- should preserve stable identity and hash/version metadata when provenance matters;
- should support bounded or section-level loading where useful.

## Identity model

Prefer an explicit identity tuple such as:

```text
stable_id
category / authority class
source identity
source path or logical locator
content SHA-256
parser/schema version when relevant
```

Do not deduplicate solely by display name. Two sources may expose similarly named material with different content or authority.

## Authority rule

The index and hash do not become authority merely because they are efficient.

```text
canonical source/content
    > index projection/cache
    > retrieval ranking
```

A hash proves identity/equality of bytes under the chosen hashing boundary; it does not prove correctness, authority, relevance, or runtime behavior.

## Reuse gate for other features

Before applying this pattern elsewhere, use:

```text
CURRENT STATE
  -> verify the real implementation/runtime
  -> prove corpus size or retrieval/context problem
  -> identify canonical owner
  -> identify existing discovery/index capability
  -> identify existing content identity/hash capability
  -> identify exact missing retrieval boundary
  -> apply only the smallest missing part
```

If the target feature already has a suitable catalog/index, do not create a parallel one. If it already has stable content hashes, reuse them. If whole-corpus loading is not measurably costly or noisy, do not add retrieval complexity without evidence.

## Good reuse candidates

This pattern can be considered for:

- Skill galleries;
- historical memory retrieval;
- GPT-Knowledge document routing;
- large documentation/reference stores;
- tool/capability registries;
- workflow/template libraries;
- test and validation evidence stores;
- media/reference asset catalogs.

These are candidates only. Each requires implementation evidence before adoption.

## Anti-patterns

Do not:

- expose the entire corpus just because it exists;
- treat SHA-256 as a semantic search mechanism;
- create a second crawler/index when an existing evidence/index layer already owns discovery;
- treat an index as canonical source truth;
- use hash equality as proof of feature correctness;
- create many directly visible router skills when one stable router can reach the gallery;
- hide provenance or authority during ranking;
- silently load unrelated content into agent context.

## Current skills evidence boundary

Current evidence shows skill source inventory records stable skill IDs, source paths, and SHA-256 values, while the skill retrieval design separates canonical curated files from an index/projection/cache and defines incremental indexing keyed on content SHA-256. Current runtime/log evidence also records `skills_hash_status`, `skills_list`, and `skills_fetch` as the intended bounded MCP retrieval surface.

That supports this pattern for the current Skills work. It does not automatically prove that every other GPT-K feature currently implements the same pattern.

## Compact reusable rule

```text
Router = entrypoint
Index  = find/location/relevance
Hash   = exact identity/change detection
Fetch  = load selected content
Source = authority
```

Prefer:

```text
small visible entrypoint
  -> bounded indexed discovery
  -> hash/version verification
  -> selective fetch
  -> agent reasoning
```

over full-corpus injection.
