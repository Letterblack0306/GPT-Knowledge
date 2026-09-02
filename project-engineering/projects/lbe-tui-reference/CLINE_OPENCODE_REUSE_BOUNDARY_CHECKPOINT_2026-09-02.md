# Cline + OpenCode Reuse Boundary Checkpoint — 2026-09-02

**Classification:** REFERENCE_NON_CANONICAL / CURRENT CORRECTION  
**Purpose:** Correct the older GPT-K wording that treated OpenCode as CLI/UX-only and record the current LBE reuse boundary for Cline and OpenCode without creating a second runtime authority.

## Evidence basis

Current LBE acceptance/gate documentation records that the active TUI P2/P3 integration must reuse existing LBE owners and compatible external mechanics rather than recreate generic systems.

The current LBE gate explicitly records:

- Cline is an accepted `ADAPT` source for provider streaming, agent-loop continuation, tool proposal/result, and abort mechanics.
- OpenCode is an additional reuse source at pinned revision `dc4449df0d52199704ea4989a5a993ebbc605612`.
- OpenCode terminal, provider, session, permission, tool, MCP, and extension mechanics are valid reuse inputs.
- Cline/OpenCode mechanics must be connected through bounded LBE-owned adapters/projections.
- direct external filesystem, shell, process, editor, patch, provider, MCP, plugin, session, or completion authority outside LBE remains prohibited.

Therefore the older GPT-K statement:

```text
OpenCode = CLI/UX ideas only
```

is **STALE / SUPERSEDED**.

## Correct architecture boundary

```text
Cline / OpenCode reusable mechanics
(provider / session / streaming / continuation /
permission / tool / MCP / terminal / extension mechanics,
only where explicitly adapted)
        ↓
LBE-owned bounded adapter(s)
        ↓
LBE provider registry + turn/runtime owners
        ↓
LBE session / policy / authorization
LBE ToolRegistry / GovernedToolOrchestrator
LBE ToolReceipt / evidence
LBE persistence / validation / completion
        ↓
LbeWrapper / RealLbeWrapper
        ↓
Rust/Ratatui projection and interaction
```

## Ownership rule

Cline and OpenCode are reuse/mechanics sources. They are not canonical LBE authorities.

### LBE remains authoritative for

- workspace/session/turn identity;
- provider/model registration and selection truth;
- authorization and policy;
- governed tool/process/file/MCP execution;
- operation identity and idempotency;
- ToolReceipts and canonical evidence correlation;
- persistence and recovery;
- validation and accepted completion truth.

### Rust remains responsible only for

- typed request/event adaptation;
- user interaction and navigation;
- projection of LBE-owned state and lifecycle.

### Cline/OpenCode may supply reusable mechanics for

- provider transports and streaming where explicitly integrated;
- provider/agent continuation mechanics;
- terminal interaction mechanics;
- session mechanics;
- permission UX/mechanics;
- tool proposal/result mechanics;
- MCP mechanics;
- extension/plugin patterns;
- cancellation/abort/ordering mechanics;
- other compatible generic mechanics after source-backed reuse review.

They must not bypass LBE authority.

## Evidence classification

```text
Cline as LBE reuse source                         PROVEN BY CURRENT LBE GATE
OpenCode as LBE reuse source                      PROVEN BY CURRENT LBE GATE
OpenCode provider mechanics as valid reuse input  PROVEN BY CURRENT LBE GATE
OpenCode becoming provider/runtime authority      PROHIBITED
Rust direct provider/runtime authority             PROHIBITED
Exact live use of each OpenCode mechanic           REQUIRES CURRENT SOURCE/RUNTIME PROOF
Installed end-to-end acceptance                    STILL OPEN
```

This distinction is important: approval as a reuse source does not by itself prove that every OpenCode mechanic has already been integrated or live-tested. Current source/runtime evidence remains required for implementation-specific claims.

## Supersession rule

For future project reasoning, this checkpoint supersedes any older GPT-K wording that says:

```text
OpenCode = CLI/UX ideas only
```

Use instead:

```text
Cline + OpenCode = approved reusable mechanics sources behind bounded LBE-owned adapters.
LBE remains the only canonical authority.
```

## Current unresolved truth boundary

The remaining project boundary is primarily installed/live acceptance, not whether Cline/OpenCode are permitted reuse sources. Required live proof still includes the relevant provider execution, governed tool continuation, receipts/evidence, persistence, authorization ordering, and installed Rust/TUI projection for the path being claimed.
