# Shared Skill Retrieval Layer — NO-GO Decision And Conditional Future Gate

Decision date: 2026-08-22
Status: NO-GO (do not implement SQLite/FTS5 skill retrieval at current scale)
Evidence basis: read-only Phase 0 discovery of `C:\MCP Local`, BirdEye index/schema, MCP registry, global skill locations.

## Finding

```text
Shared local-agent canonical skills: 0
Canonical shared roots:              0
Empty global roots:                  C:\Users\prave\.codex\skills, C:\MCP Local\Skills
Existing retrieval:                  BirdEye already provides SHA-256-indexed SQLite file indexing,
                                     trust-tagged ranked search (birdeye_search), and confined reads
                                     (knowledge_read / birdeye_inspect / knowledge_route).
```

Scope correction: `GPT-Knowledge\skills\evidence-driven-engineering` is a
Browser Agent/project-workflow-specific authority. It is NOT part of the shared
local-agent skill system and must not be counted as a canonical skill of the
shared catalog. It remains untouched and excluded from any future shared
skill-index scope:

```text
GPT-Knowledge/skills/evidence-driven-engineering -> CANONICAL for its own project workflow only;
                                                    EXCLUDED from shared local-agent retrieval
Shared local-agent skill catalog                 -> 0 canonical skills across 0 roots
```

A dedicated FTS5 skill projection would duplicate BirdEye with an empty catalog.
The DO-NOT-BUILD condition is satisfied even more strongly than initially recorded:
the shared catalog has no skills at all to retrieve.

## Authority classification (preserved, unchanged)

```text
GPT-Knowledge/skills/evidence-driven-engineering  -> CANONICAL (Browser Agent-specific authority;
                                                     outside shared local-agent scope)
GPT-Knowledge/project-engineering/*.md            -> REFERENCE/SECONDARY (documentation,
                                                     not registered skill material)
Memory                                            -> not a skill authority
BirdEye                                           -> existing workspace/file retrieval layer
Referenced external ChatGPT installed skills      -> UNKNOWN (not present locally)
```

## Reopen conditions (any one triggers re-evaluation)

1. Two or more populated **shared local-agent** skill source roots appear
   (skills installed into `~\.codex\skills` or `C:\MCP Local\Skills`,
   or explicitly registered procedural skills designated for shared agent use).
2. Shared local-agent canonical skill count grows substantially (order of tens)
   making whole-catalog context loading measurably costly.
3. Measurable retrieval latency/noise against BirdEye search on shared skill content.

Gate question on reopen: is there enough **shared local-agent** skill material —
excluding Browser Agent-specific authorities such as the GPT-Knowledge
evidence-driven-engineering skill — to justify a BirdEye skill index?

## If reopened: binding constraints carried forward

- SQLite/FTS5 remains an INDEX/PROJECTION/CACHE only; canonical files stay authoritative.
- Authority class is a ranking constraint; UNKNOWN/LOWER never outranks CANONICAL via relevance.
- Skill identity is separated from source identity; no dedup by name alone.
- Retrieval-only MCP surface (search_skills / get_skill / get_skill_sections /
  list_skill_sources); never execute/install/modify skills through it.
- No physical source paths leaked in results; no full-catalog injection into agent context.
- Deterministic incremental indexing keyed on SHA-256 with parser-version re-index support.

Full phased design (Phases 0–20) is retained in the originating task specification;
this document records only the decision boundary and reopen evidence requirements.

## Implementation references (audited at README level, 2026-08-22)

These are reference material for any reopened build — none is architecture authority,
and the reopen gate above remains CLOSED regardless of their existence.

| Reference | Verified relevance | Evidence level |
|---|---|---|
| `erichare/skillroute` | Strongest shape match: SKILL.md bundle parsing → SQLite catalog → FTS5/BM25 backend for larger libraries → ranked routing with confidence + evidence traces → clarification-instead-of-guess on uncertainty → 3 MCP tools over stdio. Local-first, zero runtime deps, Agent Skills spec validation as CI gate, golden-route evals. | SUPPORTED (README-level audit only) |
| `modelcontextprotocol/experimental-ext-skills` | Skills Over MCP Working Group incubation. SEP-2640 proposes serving skills via the **Resources primitive** (lazy loading), not bespoke tools. Explicitly exploratory — NOT an official MCP specification or recommendation. Relevant to any future decision of tools-vs-resources exposure. | SUPPORTED (README-level; explicitly non-normative) |
| `skills-mcp/skills-mcp` | Simple directory-based skill discovery over MCP; too thin to inform the authority-classified design. | UNVERIFIED beyond listing |
| `IBPA/skill-flow` | Large-scale crawl/index/rerank/eval over tens of thousands of skills; scale far exceeds any plausible local catalog; consult only if the corpus ever reaches that order. | UNVERIFIED beyond listing |
| `ThakiCloud/SkillRet` | Benchmark/evaluation dataset and code — useful for measuring retrieval quality if the gate reopens, not a runtime architecture. | UNVERIFIED beyond listing |
| `JayCheng113/skill-retrieval-mcp` | One implementation reference to audit among several; not automatically the thing to build from. | UNVERIFIED |

### Design deltas these references imply for any future build

1. **Tools vs Resources:** before implementing custom retrieval tools
   (`search_skills` etc.), check SEP-2640 status. If the Resources-based skills
   extension reaches spec, native lazy-loading may supersede a custom tool surface.
2. **Evidence-bearing ranking:** SkillRoute's "confidence + evidence + clarify-on-uncertainty"
   matches Phase 9's match-explanation requirement and is worth auditing for its trace schema.
3. **Spec compliance gate:** SkillRoute validates bundles against the Agent Skills open
   standard at index time — a candidate mechanism for our parser-version/re-index story.
4. **Eval harness:** golden-route evals (SkillRoute) or SkillRet benchmarks satisfy the
   Phase 15/16 measurement requirements without inventing new methodology.
5. **Authority classification remains ours:** no reference implements source-authority
   classes (CANONICAL/SECONDARY/.../UNKNOWN as ranking constraints); that stays a
   local design requirement.