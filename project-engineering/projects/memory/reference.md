# Historical Memory — Current Implementation Reference

Updated: 2026-08-22

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
