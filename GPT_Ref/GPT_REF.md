# GPT Reference (GPT_Ref)

> Canonical first-stop reference map for GPT-Knowledge consumers, agents, MCP clients, and the Vercel read-only projection.

## Purpose

This document is the shared alignment entry point. Before checking, creating, changing, comparing, or recommending anything that depends on Letterblack project knowledge, consult this reference first.

This file is a **reference router**, not a replacement for the underlying sources. It points to the current source that should be consulted, then the caller should retrieve only the relevant section/snippet needed for the task.

## Startup rule

1. Land on or query `GPT_Ref/GPT_REF.md` first.
2. Resolve the relevant reference below.
3. Read/search only the required source section or bounded snippets.
4. For claims about current repo/runtime state, verify the current workspace/repository/runtime evidence after consulting this map.
5. Do not treat historical memory as stronger authority than current source/runtime evidence.
6. If a reference is missing or stale, update this single document rather than relying on recall.

## Authority order

Use the most current applicable evidence in this order:

1. current runtime evidence
2. current workspace/repository evidence
3. current session evidence
4. current project documentation
5. historical evidence / memory
6. model inference

## Primary GPT-Knowledge references

| Area | Reference | Use |
| --- | --- | --- |
| GPT-K entry | `000_START_HERE.md` | General GPT-K operating guidance and entry point. |
| Knowledge catalog | `INDEX.md` | Human-readable knowledge map. |
| Machine knowledge routing | `knowledge-index.json` | Machine-readable domain/reference routing. |
| Project/workspace mapping | `project-engineering/projects/workspace/local-projects.json` | Resolve known projects to local workspace identities/paths. |
| Agent engineering | `ai-agents/` | Agent architecture, behavior, tools, memory, governance, and execution references. |
| Browser agents | `browser-agents/` | Browser-agent-specific references. |
| Local runtime | `local-runtime/` | Local runtime and execution references. |
| Local models | `local-models/` | Local model/provider references. |
| Project engineering | `project-engineering/` | Project implementation/workspace references. |
| Operations | `ops/` | Operational/release/validation references. |
| Letterblack branding | `letterblack-branding/` | Brand references. |
| Motion design | `motion-design/` | Motion/VFX references. |
| Brew source projection | `repos/brew/` on the Vercel source site | Read-only Brew source projection when included by the build. |

## Shared capability references

### MCP / BirdEye

BirdEye is the local shared capability layer for indexed workspace evidence, GPT-Knowledge, skills, and memory. Consumers should use the shared MCP capability rather than implementing agent-specific copies of the same reference logic.

Reference flow:

```text
agent / client
  -> query GPT_Ref
  -> resolve relevant canonical reference
  -> retrieve bounded source snippets
  -> expand only when required
  -> reason / act using current evidence
```

Current BirdEye MCP access already supports this without a new agent-specific MCP tool:

- Bounded reference query: `birdeye_search` with `roots="gpt-knowledge"` and `path_prefix="GPT_Ref/"`.
- Complete reference read when explicitly needed: `knowledge_read` with `reference="GPT_Ref/GPT_REF.md"`.

The local GPT-Knowledge checkout must contain the current `GPT_Ref/GPT_REF.md` file before BirdEye can index/query it.

### Skills

Use catalog/query discovery first. Once a skill is selected, fetch the complete selected `SKILL.md` when its full operating contract is required. Large supporting references should remain separately retrievable.

### Memory

Memory is historical evidence. Query only the relevant passages/results needed for the current task. Memory does not override current runtime/workspace/source truth.

### Hashing and indexing

- Indexing answers **where the relevant material is**.
- Hashing verifies **content identity/freshness**.
- Retrieval returns **only the bounded evidence needed**.
- The agent remains responsible for reasoning and deciding whether more evidence is necessary.

## Vercel reference surface

Production source site:

`https://gpt-knowledge.vercel.app/`

Direct reference view:

`https://gpt-knowledge.vercel.app/?file=GPT_Ref/GPT_REF.md`

The base GPT-K Vercel page lands on this document by default so users and agents start from the same reference surface.

## Maintenance rule

When a new canonical project reference, shared capability, authority rule, or important source location is introduced:

1. update the underlying canonical source;
2. add or update its pointer here;
3. keep this document compact and navigational;
4. do not duplicate entire project documents here;
5. preserve one stable path: `GPT_Ref/GPT_REF.md`.

## MCP contract

Use the existing shared BirdEye capabilities rather than creating per-agent MCP ownership.

For normal reference lookup:

```text
birdeye_search(
  query=<current task/reference need>,
  roots="gpt-knowledge",
  path_prefix="GPT_Ref/"
)
```

This should return only relevant bounded snippets from the reference document.

When the complete compact reference document is explicitly required:

```text
knowledge_read(
  reference="GPT_Ref/GPT_REF.md"
)
```

All agents should converge on the same stable local path and the same Vercel reference surface.
