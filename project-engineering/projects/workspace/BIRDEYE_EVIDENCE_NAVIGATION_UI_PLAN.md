# BirdEye Evidence Navigation UI Plan

Status: SOURCE_IMPLEMENTED_ACCEPTANCE_OPEN
Authority: GPT-Knowledge UI implementation plan; repository snapshots and live/runtime evidence remain authoritative.
Active slice: EVIDENCE_GRAPH_AND_NODE_INSPECTOR_BROWSER_ACCEPTANCE
Last updated: 2026-08-22

## Objective

Turn the existing BirdEye read-only panel into an evidence-navigation surface without creating a second audit engine or inventing missing project facts.

The UI must help a user move through:

```text
project
→ documented plan/status
→ observed repository identity
→ observed changed paths
→ projected runtime evidence
```

Every displayed relationship must carry one of:

```text
PROVEN
DOCUMENTED
INFERRED
UNKNOWN
```

`INFERRED` is permitted only when the projection explicitly supplies an inferred relationship. The UI must never infer relationships from naming similarity.

## Governing UI rules

- Render-only: no commands, repository writes, plan writes, execution or webhook behavior.
- Truth first: unavailable projection fields render as unavailable or `UNKNOWN`.
- Repository/runtime evidence remains stronger than GPT-Knowledge projection.
- Compact industrial-dark presentation; technical identifiers use monospace.
- Keyboard-focusable graph nodes with visible focus state.
- No dependency graph, reachability, test coverage or historical analysis claims until BirdEye projects those facts.
- Source and generated public UI copies must remain byte-identical.
- Rendered/live acceptance is separate from source and browser-test proof.

## Phase 1 — Current projection navigation

Status: SOURCE_IMPLEMENTED_ACCEPTANCE_OPEN

### Slice 1A — File audit truth boundary

Status: SOURCE_IMPLEMENTED; LIVE_UNVERIFIED

- Show whether a per-file index is projected.
- Render current/analyzed hashes and invalidations only when supplied.
- Otherwise show `NOT PROJECTED`.

### Slice 1B — Evidence graph

Status: SOURCE_IMPLEMENTED; BROWSER_ACCEPTANCE_UNVERIFIED

Build a compact clickable graph from existing fields only:

- project attribution;
- documented plan/status;
- observed repository/Git state;
- changed paths reported by Git;
- projected runtime evidence.

Each edge must display its evidence classification.

### Slice 1C — Node inspector

Status: SOURCE_IMPLEMENTED; BROWSER_ACCEPTANCE_UNVERIFIED

Selecting a graph node shows its exact source, observation time, evidence level and available details.

For changed-file nodes, show:

- path;
- Git classification;
- content/analysis hashes only when `fileIndex` supplies them;
- dependency and invalidation counts only when supplied.

## Phase 2 — Additional BirdEye projection contracts

Status: PLANNED_NOT_IMPLEMENTED

These features require new evidence from BirdEye and must not be simulated in the UI:

- dependency/call graph;
- active/orphaned/duplicate-owner/legacy reachability;
- file-to-test relationships and invalidated tests;
- previous-versus-current analysis history;
- agent execution receipts/evidence history;
- extracted-versus-inferred relationship provenance.

## Phase 3 — Audit and decision navigation

Status: PLANNED_NOT_IMPLEMENTED

After Phase 2 contracts are proven:

- change-impact view;
- evidence-gap ordered audit queue;
- authority breadcrumb;
- canonical-versus-derived state indicator;
- bounded governed action routing.

The UI may route an explicitly selected action only after a separate governed owner and authorization contract exist.

## Acceptance

Phase 1 is accepted only when:

1. existing Access Browser Agent, LBE and LoopTool projections still render;
2. every project renders project/plan/repository/runtime nodes;
3. every graph relationship has a visible classification;
4. selecting a node updates the inspector;
5. absent file-index/dependency evidence remains explicitly unavailable;
6. no POST/PUT/PATCH/DELETE occurs;
7. zero JavaScript exceptions occur;
8. source and public UI copies are byte-identical;
9. live deployed browser acceptance is recorded separately.

## Next single question

Does the focused real-Chrome integration test pass for Access Browser Agent, LBE and LoopTool at GPT-Knowledge HEAD c1da3289, with graph-node selection, zero mutations and zero JavaScript exceptions?
