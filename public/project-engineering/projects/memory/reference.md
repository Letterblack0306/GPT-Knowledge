# Historical Memory — Current Implementation Reference

Updated: 2026-08-23

## Authority

This document is a GPT-Knowledge projection of the canonical local implementation at `C:\MCP Local\Memory`. Live workspace Git/runtime evidence and the immutable source archive at `C:\MCP Local\Chat_Dataexported\GPT_Data` outrank this document.

## Ownership boundary

- `GPT_Data` — immutable ChatGPT export/source evidence.
- `C:\MCP Local\Memory` — canonical historical/durable-memory implementation.
- BirdEye — separate current workspace/runtime authority.
- GPT-Knowledge — separate reusable project/method/status projection.
- Reasoning agent — owns interpretation, planning, tool selection, reconciliation and conclusions.
- Memory — exposes evidence/memory capabilities and provenance; it does not prescribe a reasoning procedure.

## Current proven implementation

Stages 0 through 12 are proven complete. Current canonical Memory HEAD reported for this projection is `f11fd89` on `master`.

Implemented layers:

1. Discovery and source-format contract.
2. Immutable canonical import model with stable composite message identity.
3. Versioned transaction-safe SQLite canonical storage.
4. Exact retrieval.
5. Semantic retrieval with a separate rebuildable vector index.
6. Hybrid retrieval.
7. Separate durable derived-memory store.
8. Agent-facing `MemoryService` capability API.
9. MCP stdio/in-process server.
10. Global `C:\MCP Local` MCP registration and external-client discovery.
11. Agent-memory authority/provenance contract.
12. Real-corpus scale/failure validation.
13. End-to-end acceptance across cases A-G.

## Agent-facing capabilities

The Memory MCP exposes:

- `recall`
- `search`
- `timeline`
- `conversation`
- `message`
- `related`
- `sources`

The server is registered globally under `C:\MCP Local\config\mcp-registry.json`. External-client discovery, MCP initialization, tool listing and a real historical recall returning canonical provenance have been proven.

## Canonical archive evidence

Current populated store baseline:

- Conversations: **898**
- Canonical messages: **72,691**
- Nodes: **73,589**

Stage-11 real-corpus validation observed the source corpus at approximately 3.7 GB and also proved repeated import, rollback/resume after interruption, duplicate prevention, malformed/missing object handling, semantic rebuild, exact retrieval without the vector index, latency probes, size probes and provenance round-trip.

Observed generated-store sizes during Stage 11:

- `memory.db`: 290,488,320 bytes (~277 MiB)
- `vectors/semantic.db`: 99,651,584 bytes (~95 MiB)

## Authority precedence

Evidence guidance is metadata for the reasoning agent, not a hardcoded reasoning sequence:

`current_runtime > current_workspace > current_session > current_project_docs > historical_evidence > derived_memory > model_inference`

Historical evidence remains preserved even when stale; higher-authority current runtime/workspace evidence may supersede it for present-state claims. Derived memories never have the same authority as canonical historical evidence.

## Historical retrieval and truth-resolution method

Use historical memory to recover prior context, decisions, rejected ideas, corrections, implementation attempts, and provenance. Do **not** use it as a substitute for current repository/runtime truth.

### Why search historical memory

Search Memory when the task depends materially on prior work that may not be present in current project docs or the active chat, including:

- what was previously decided and why;
- what implementation approach was tried before;
- what the user explicitly rejected, corrected, or constrained;
- what was once true but may now be stale or superseded;
- what historical evidence or source hashes support a prior claim;
- which earlier session or conversation contains the detailed rationale behind a current project rule;
- whether an apparently new problem was already investigated.

Do not search history merely to make an answer sound familiar. Search it when recovering prior context can materially improve correctness, avoid repeated failed work, or prevent a rejected/superseded idea from being proposed again.

### Choose the correct historical source first

Historical sources are not interchangeable.

```text
Memory historical sources
├─ imported GPT/ChatGPT archive
│  └─ broad long-term conversation history, including old decisions and disagreements
├─ Cline session history
│  └─ local coding-agent/session history and tool/runtime traces
└─ derived memory
   └─ convenience summaries/derived records; lower authority than canonical historical evidence
```

Routing rules:

1. If the user refers to a past ChatGPT discussion, old decision, disagreement, rejected idea, or broad historical project conversation, search the imported GPT/ChatGPT archive first.
2. If the user refers to a previous Cline run, coding-agent session, tool call, local execution sequence, or recent IDE-agent work, search Cline session history first.
3. If the user asks about the current local workspace, current branch, local diff, installed runtime, or current execution behavior, history is secondary; use BirdEye/current workspace/runtime evidence first.
4. If the source is uncertain, search the smallest likely source first and broaden only if that source does not contain the needed evidence. Do not assume Cline is the entire memory corpus.

### Scope before ranking

Project/workspace identity must constrain retrieval before semantic relevance is treated as meaningful.

Preferred order:

```text
identify project/workspace/session
→ search inside that scope
→ rank relevant evidence
→ fetch bounded context
→ inspect provenance
```

Do not rank a long mixed session as project truth merely because it contains both a project name and generic terms such as `governance`, `agent`, `audit`, or `CEP`. A single historical session may cover several repositories and topics.

When available, preserve and use:

- project ID;
- workspace/repository identity;
- conversation/session ID;
- message/node ID;
- source shard/index;
- source/file SHA256;
- timestamps;
- tool/runtime identifiers.

### Preserve historical evidence; do not promote every statement

Hashing, indexing, and retrieval have different meanings:

```text
HASH      = identify the exact source/evidence
INDEX     = make evidence discoverable
RANK      = estimate contextual relevance
AUTHORITY = identify what kind of evidence it is
TRUTH     = determine whether a claim is valid for the present question
```

A historical statement can be indexed and retrievable while remaining `historical_evidence_non_truth`, stale, rejected, superseded, or disproven.

Never convert:

```text
"this was said before"
```

into:

```text
"this is currently true"
```

without stronger evidence appropriate to the claim.

### Recover disagreement and supersession, not only mentions

When prior disagreement matters, retrieve the surrounding conversational chain rather than a single matching message.

Look for evidence of:

- proposal or claim;
- explicit user rejection/correction;
- assistant revision;
- later implementation or live evidence;
- later superseding decision.

Useful claim-state classifications include:

```text
PROPOSED
ACCEPTED
REJECTED
IMPLEMENTED
PROVEN
DISPROVEN
STALE
SUPERSEDED
HISTORICAL_ONLY
UNKNOWN
```

These are reasoning classifications unless the Memory implementation explicitly stores them. Do not invent a stored truth label that the source does not provide.

### Respect conversation graph structure

The imported ChatGPT archive is graph-shaped, not guaranteed to be a simple row sequence. Regenerated responses, edits, alternate branches, and retries may create multiple children.

Therefore:

- do not assume SQLite `rowid + 1` means "next conversational message";
- use canonical conversation/node relationships and `current_node`/parent-child structure when reconstructing an actual active branch;
- if graph-aware reconstruction is unavailable, present nearby messages as context only and do not claim a strict `before → correction → after` chain.

### Normalize for retrieval only

Typos, transcription variants, spacing, and spelling differences may be normalized to improve search recall, for example `govenence → governance` or `implimented → implemented`.

Normalization must never rewrite canonical historical evidence. Preserve:

```text
original source text
+ normalized search terms/query interpretation
+ source identity/provenance
```

### Current-truth stop condition

Historical retrieval is complete when it has recovered enough evidence to identify the relevant prior context and provenance. If the user's question is about **current** implementation, behavior, authority, branch, configuration, or runtime state, stop treating history as sufficient and verify against the stronger current source.

Typical escalation:

```text
historical candidate
→ resolve current project/workspace
→ inspect current repository/workspace/runtime
→ compare
→ classify as still supported, stale, superseded, or disproven
```

Examples:

- Historical chat says a gate was planned → inspect the current repo before claiming it exists.
- Historical source says branch X was canonical → verify current Git authority before acting.
- Historical architecture doc describes multi-agent ownership → check current architecture/runtime authority before reusing it.
- User previously rejected a proposed mechanism → preserve the rejection so the same idea is not reintroduced without new evidence and an explicit reason.

### Retrieval quality rule

The objective is not "retrieve the most text" or "find the highest keyword score." The objective is:

> retrieve the smallest, best-scoped evidence set that preserves the relevant decision/history and its provenance, while preventing stale, rejected, mixed-project, or lower-authority material from silently becoming current truth.

Prefer a bounded exact/contextual fetch after a good candidate is found rather than repeatedly widening the search corpus.

## Stage-10 correction history

Historical commit `91579c5` incorrectly inserted a `stacklessia` authority and omitted `current_workspace`. Follow-up commit `70553ce` corrected the active model and pinned the exact controlling chain in tests. The historical commit was intentionally not rewritten.

## Stage 11 validation

Commit `82c683a` changed only `tests/test_stage11.py`; no product-source defect was found. Validation reported:

- focused Stage-11 tests: 12 passed;
- full suite: 91 passed;
- full archive import: 898 conversations / 73,589 nodes / 72,691 messages;
- missing references: 2,266 references / 2,230 distinct absent files;
- semantic rebuild: 68,097 documents;
- GPT_Data unchanged.

## Stage 12 end-to-end acceptance — COMPLETE

Stage 12 — End-to-End Acceptance is proven complete by commit `f11fd89`.

Required cases:

- A — historical project recall;
- B — exact evidence descent;
- C — stale-history / no-overwrite;
- D — different valid reasoning paths;
- E — missing memory / no invention;
- F — restart survival;
- G — re-index without canonical identity change.

Final completion must prove the full chain:

`GPT_Data → canonical importer → canonical storage → exact retrieval → semantic/hybrid retrieval → durable memory → Memory MCP → reasoning agent → exact source provenance`

Acceptance result: **7/7 cases passed**; full suite: **98 passed**; working tree clean; `GPT_Data` unchanged; restart and re-index preserved canonical identity; exact provenance descended to the canonical conversation, message node, source shard and source index; reasoning/workflow logic added: **none**.

The complete chain was exercised:

`GPT_Data → canonical importer → canonical storage → exact retrieval → semantic/hybrid retrieval → durable memory → Memory MCP → reasoning agent tool paths → exact source provenance`
