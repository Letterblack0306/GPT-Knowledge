# BirdEye Reference Boundary for LBE TUI Integration — 2026-09-01

## Classification

`REFERENCE_NON_CANONICAL`

This record is workspace-specific reference material for the LBE Rust/Ratatui TUI integration. It does **not** make BirdEye an LBE authority and does **not** replace canonical LBE runtime, governance, authorization, execution, evidence, receipt, persistence, validation, or completion owners.

## Verified BirdEye source

Repository: `Letterblack0306/Letterblack_BirdEye`

Verified commit:

```text
8deeb21044039c8be114b1965630678349497506
feat: evolve BirdEye ecosystem and generated-index boundaries
```

The commit adds generated-artifact ignore boundaries including `*.db`, `*.db-*`, `*.sqlite`, `*.sqlite3`, `*.bak`, `eye_Databa/`, and `archive/`. Existing `state/` remains ignored and `config.json` remains local-only.

## Relevant reference patterns for this LBE workspace

### 1. Client-neutral capability surface

BirdEye documents a shared capability surface intended for multiple clients, including local agents and MCP-connected clients. The useful LBE reference principle is:

```text
one authoritative capability owner
        -> bounded adapters/projections
        -> multiple clients
```

For LBE, this reinforces the existing rule that Rust/Ratatui, browser clients, or other frontends must consume LBE-owned capabilities rather than create competing runtime owners.

### 2. Generated index boundary

BirdEye separates source/configuration truth from generated query/index databases. Generated database artifacts are local and gitignored.

Relevant LBE reference principle:

```text
authoritative source/runtime truth != generated local projection/index state
```

This is a reference for projection and cache boundaries only. It does not imply that LBE should adopt BirdEye storage internals.

### 3. Machine-specific configuration stays local

BirdEye keeps `config.json` as local-only machine configuration. This is relevant to LBE provider paths, registry paths, local runtime endpoints, and other machine-specific settings: local configuration should not silently become repository or product truth.

### 4. Explicit legacy-store retirement

BirdEye adds an explicit retirement path for legacy `state/workspace.db` behavior and prefers the EYES query projection when available. Once retired, the legacy store fails closed rather than silently remaining a competing authority.

Relevant LBE reference principle:

```text
when an owner/storage path is replaced, retire the old authority explicitly;
do not leave two silent competing owners active.
```

This is directly relevant to LBE's prohibition on duplicate session, MCP, execution, authorization, receipt, evidence, persistence, or completion owners.

### 5. Single background owner / lease pattern

BirdEye documents a per-state-root lease preventing competing watcher processes from becoming simultaneous owners of the same generated state.

Relevant LBE reference principle: where background lifecycle ownership exists, use one explicit owner and prevent duplicate hidden owners.

## Test-status warning

Do **not** classify the BirdEye ecosystem change as fully accepted yet.

The current test suite is not green. The reported first failure is:

```text
tests/test_root_registry.py::test_context_loads_v2_policy_fields
```

Current source shows a configuration-isolation regression risk: `agent.Context.load()` can prefer the EYES configuration path while the test monkeypatches `agent.CONFIG_PATH` and expects temporary-test configuration isolation. This failure is unrelated to the `.gitignore` generated-artifact boundary.

Therefore:

```text
BIRDEYE REMOTE COMMIT                         PROVEN
GENERATED-INDEX IGNORE BOUNDARY               PROVEN
EYES READ-ONLY CONFIGURATION LAYER             PROVEN
CLIENT-NEUTRAL CAPABILITY DIRECTION            PROVEN
LEGACY STORAGE RETIREMENT PATH                 PROVEN
SINGLE-WATCHER/LEASE DIRECTION                 PROVEN
FULL BIRDEYE TEST SUITE                        NOT GREEN
FULL ECOSYSTEM ACCEPTANCE                      NOT PROVEN
```

## LBE usage boundary

BirdEye may be consulted as a **reference implementation/pattern source** for:

- client-neutral capability surfaces;
- generated-index and projection boundaries;
- local machine configuration separation;
- explicit migration/retirement of legacy owners;
- single-owner background lifecycle patterns.

BirdEye must **not** be used to justify:

- moving LBE authority into BirdEye;
- creating a second MCP executor or transport in Rust;
- creating a second authorization owner;
- creating a second evidence/receipt/completion owner;
- copying generated BirdEye databases into LBE product state;
- treating BirdEye tests or local indexes as proof of LBE behavior.

## Current LBE relevance

For the active Rust/Ratatui integration work, the applicable interpretation is:

```text
LBE authoritative runtime/capability owner
        -> LbeWrapper / bounded adapter
        -> typed Rust state
        -> metadata/control projection
```

BirdEye is useful because it independently demonstrates the same architectural discipline: one capability owner, multiple clients, generated projections kept separate from authority, and explicit retirement of legacy competing state.

## Authority note

GPT-Knowledge remains a projection/reference system. Canonical LBE source, active machine governance, current workspace/runtime evidence, and acceptance records remain authoritative for implementation and completion claims.
