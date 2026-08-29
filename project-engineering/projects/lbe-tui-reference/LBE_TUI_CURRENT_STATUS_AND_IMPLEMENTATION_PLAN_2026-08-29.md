# LBE TUI — Current Status and Implementation Plan

**Classification:** REFERENCE / NON-CANONICAL  
**Date:** 2026-08-29  
**Remote source repository:** `Letterblack0306/LBE_Agents_wall_Intigration`  
**Remote source head:** `2bbada6dee2473734d5a466e0c862d4568682daa`  
**Local workspace evidence:** `C:\LBE-TUI-Lab` (user-supplied runtime evidence; dirty/unpushed)

## 1. Correct implementation interpretation

The Rust/Ratatui work is an **implemented UI frontend plus an implemented integration contract using a temporary mock backend for pre-integration validation**.

It is not a disposable mock-only prototype.

Intended staging:

```text
CURRENT PRE-INTEGRATION DESIGN

Ratatui TUI
    ↓
LbeWrapper
    ↓
MockLbeWrapper
    ↓
typed mock snapshots/events

LATER LIVE INTEGRATION

Ratatui TUI
    ↓
LbeWrapper
    ↓
Real LBE adapter
    ↓
Canonical LBE runtime
```

The visible label `MOCK / NOT CONNECTED · UI CONTRACT PREVIEW` truthfully describes current runtime connectivity; it does not mean the UI implementation itself is disposable.

## 2. Current local workspace status

User-supplied command evidence from `C:\LBE-TUI-Lab` on 2026-08-29 showed:

```text
branch                main tracking origin/main
HEAD                  2bbada6
working tree          dirty
Cargo binary          src/main.rs
cargo check           PASS WITH WARNINGS
cargo test            PASS, 0 tests discovered
```

Current `src/main.rs` is:

```rust
mod types;
mod events;
mod requests;
mod wrapper;
mod app;
mod ui;
mod tests;

fn main() {
    println!("placeholder");
}
```

Current `src/tests.rs` is only:

```text
// Placeholder - will be extracted in Phase 3
```

Therefore:

```text
modular source split                 IMPLEMENTED
module declarations                  IMPLEMENTED
active production TUI entrypoint     MISSING / PLACEHOLDER
active event-loop wiring             MISSING
active test-suite migration          MISSING
cargo check                          PASSING PLACEHOLDER CRATE
cargo test                           PASSING WITH ZERO TESTS
feature-readiness conclusion         BLOCKED
```

Do not treat current `cargo check` or `cargo test` as proof that the original TUI behavior survived modularization until the entrypoint and tests are restored.

## 3. Immediate repair before feature modules

### 3.1 Restore active TUI entrypoint

`src/main.rs` must again own or call the real runtime loop:

```text
init_terminal
→ construct MockLbeWrapper
→ construct App from wrapper snapshot
→ draw UI
→ poll wrapper events
→ reduce events into App
→ poll keyboard/resize events
→ submit App requests through LbeWrapper
→ honor app/wrapper wake times
→ restore terminal
```

Relevant `ui.rs` functions/types should be exported `pub(crate)` as needed:

```text
AppTerminal
init_terminal
restore_terminal
draw
```

Relevant `App` APIs should be callable from the entrypoint:

```text
with_snapshot or equivalent constructor
should_quit accessor
handle_key
reduce_lbe_event
next_wake
```

Relevant wrapper APIs remain behind:

```text
LbeWrapper
MockLbeWrapper
snapshot
submit
poll_event
next_wake
```

### 3.2 Restore active tests

Use:

```rust
#[cfg(test)]
mod tests;
```

and migrate the trusted existing TUI tests into `src/tests.rs`.

Closure evidence for this repair requires:

```text
cargo check = PASS
cargo test = PASS with non-zero tests discovered
```

Feature modules 01–16 should not be treated as closed while the active binary is still a placeholder.

## 4. Modular pre-integration closure plan

| Module | Area | Current status |
|---|---|---|
| 01 | Transcript viewport / long output | MISSING |
| 02 | Interactive model picker | PARTIAL |
| 03 | Checkpoint compare / restore | PARTIAL |
| 04 | Session management | PARTIAL |
| 05 | Background / detached processes | PARTIAL |
| 06 | Provider configuration | PARTIAL |
| 07 | Tool registry | PLACEHOLDER |
| 08 | Evidence browser | PLACEHOLDER |
| 09 | Receipt browser | PLACEHOLDER |
| 10 | MCP registry | PLACEHOLDER |
| 11 | Terminal compatibility | MISSING |
| 12 | Plain / non-TUI mode | MISSING |
| 13 | Terminal lifecycle acceptance | NOT_PROVEN |
| 14 | Responsive/minimum-size acceptance | PARTIAL |
| 15 | Session memory and recall | PLANNED |
| 16 | Browser-chat bridge | PLANNED |

Each module is independently actionable. Update only the affected module plus aggregate status when implementing it.

## 5. Module 15 — Session memory and recall

### Goal

Allow the agent to recover **relevant work from its own prior LBE sessions** so the user does not need to restate project context repeatedly.

This is not equivalent to dumping all historical chat into the model context.

### Planned contract

Suggested source surface:

```text
src/memory.rs
MemoryProjection
SessionMemoryRef
MemoryRecord
MemoryRecordType
MemoryTruth
MemoryEventIdentity
```

Suggested requests:

```text
RecallSessionMemory { query, limit }
RecallSession { session_id }
CreateMemoryCheckpoint
```

Suggested events:

```text
SessionMemoryIndexed
MemoryRecallStarted
MemoryRecallResult
MemoryRecallEmpty
MemoryCheckpointCreated
```

Suggested TUI surface:

```text
/memory
/memory session
/memory recent
/memory checkpoints
@memory:<id>
@session:<id-or-hash>
```

### What should become memory

Persist meaningful boundaries rather than raw streaming deltas:

```text
user intent
agent decision
selected constraints
executed tool/action
validation result
completion result
checkpoint
receipt/evidence references
compact session summary
```

Do not create separate durable memory records for each token/text delta.

### Hashing / provenance

Use stable identities at several levels:

```text
session hash      = identity for one LBE session
event hash        = identity for one meaningful event
record hash       = identity for one persisted memory record
session head hash = hash-chain integrity across ordered records
```

A hash chain may use:

```text
record_1_hash = SHA256(record_1)
record_2_hash = SHA256(record_1_hash + record_2)
...
session_head_hash = final record hash
```

This is stronger than treating a command hash alone as memory.

### Retrieval behavior

Before a turn where prior context could materially help:

```text
identify workspace/session
→ formulate bounded recall query
→ retrieve same-project/session-lineage relevant records
→ rank verified/current records above unverified/stale records
→ inject only highest-value records
→ continue reasoning
```

Do not load every stored session.

### Authority boundary

During pre-integration, any TUI-local memory/cache must be explicitly non-canonical.

Production architecture:

```text
TUI
 ↓
LbeWrapper memory request
 ↓
Canonical LBE memory owner
 ↓
persistent session/turn/event/memory store
```

The TUI may request and render memory. It must not silently become the canonical persistence authority.

## 6. Module 16 — Browser-chat interaction bridge

### Goal

Support multiple browser-based AI chat surfaces while preserving LBE as the authority boundary.

Use a provider-neutral abstraction rather than hard-coding one chat product.

### Target architecture

```text
Browser Chat
    ↓
BrowserChatAdapter
    ↓
LBE bridge protocol
    ↓
LbeWrapper
    ↓
Canonical LBE runtime
```

Return path:

```text
Canonical LBE runtime
    ↓
structured event/result
    ↓
BrowserChatAdapter
    ↓
Browser Chat
```

### Suggested source contract

```text
src/browser_chat.rs
BrowserChatProvider
BrowserChatSession
BrowserChatMessage
BrowserChatEvent
BrowserChatError
BrowserChatAdapter
```

Possible adapter implementations later:

```text
ChatGPTBrowserAdapter
ClaudeBrowserAdapter
GeminiBrowserAdapter
other supported browser-chat adapters
```

### Required correlation

Every browser interaction should map through LBE identity:

```text
browser_session_id
↔ lbe_session_id
↔ lbe_turn_id
↔ browser_message_id
↔ tool_call_id
↔ evidence_ref / receipt_id
```

This allows browser conversations to reconnect to the correct LBE session and memory without treating raw browser history as canonical truth.

### Tool boundary

Required flow:

```text
browser assistant proposes governed tool/action
→ BrowserChatAdapter detects request
→ LBE request
→ authorization / approval
→ LBE-owned execution
→ validation
→ evidence / receipt
→ structured result returned to browser chat
→ browser assistant continues
```

Forbidden fallback:

```text
browser assistant → direct governed filesystem/process/tool execution
```

The bridge must fail closed if LBE authority is unavailable.

### TUI surface

Suggested command:

```text
/browser
/browser attach
/browser detach
/browser status
/browser sessions
```

Suggested projection:

```text
provider
connection state
browser session ID
mapped LBE session ID
turn ID
memory linkage
last receipt/evidence
reconnect status
```

### Memory integration

Browser chat should use Module 15 rather than its own independent memory authority:

```text
browser message
→ mapped LBE session
→ bounded relevant memory recall
→ selected context attached to browser turn
→ resulting actions/events stored back under LBE session identity
```

This enables requests such as `continue the TUI work` without requiring the user to reconstruct the previous browser-chat session manually.

## 7. Final target architecture

```text
                       Browser Chat
                            │
                            ▼
                   BrowserChatAdapter
                            │
                            ▼
Ratatui TUI ───────────► LbeWrapper
                            │
                            ▼
                     Canonical LBE
                    /      |       \
               Memory    Tools    Evidence
                 |         |          |
              Sessions   Receipts   Validation
```

The client surfaces own presentation, navigation, context selection and request construction.

Canonical LBE owns workspace identity, sessions, authorization, guards, execution, validation, evidence, receipts, persistent memory and completion truth.

## 8. Closure sequence

Minimum sequence from the current workspace state:

```text
0. Restore active src/main.rs TUI/event-loop wiring
1. Restore active non-zero test suite
2. cargo check PASS
3. cargo test PASS with expected tests
4. Work modular UI gaps 01–14 independently
5. Implement Module 15 memory client/recall contract
6. Implement Module 16 browser-chat bridge contract
7. Attach RealLbeWrapper to canonical LBE runtime
8. Replace mock/local authority projections with live runtime-owned state
9. Run installed end-to-end acceptance
```

Do not skip steps 0–3 merely because the placeholder crate currently compiles.
