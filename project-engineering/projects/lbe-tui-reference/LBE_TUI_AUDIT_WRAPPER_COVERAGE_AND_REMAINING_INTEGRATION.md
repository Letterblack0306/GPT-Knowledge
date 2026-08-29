# LBE TUI Contract — Coverage and Remaining Integration

**Classification:** REFERENCE  
**Authority:** NON-CANONICAL  
**Remote UI repository:** `Letterblack0306/LBE_Agents_wall_Intigration`  
**Remote branch:** `main`  
**Remote commit:** `2bbada6dee2473734d5a466e0c862d4568682daa`  
**Local workspace evidence:** `C:\LBE-TUI-Lab` (user-supplied, dirty/unpushed)  
**Verified date:** 2026-08-29

---

## 1. Current truth

The Rust/Ratatui work is an **implemented LBE terminal UI plus an implemented integration contract currently using `MockLbeWrapper` as a temporary pre-integration backend**.

It must not be described as a disposable mock-only prototype.

Intended pre-integration architecture:

```text
Ratatui TUI
    ↓
LbeWrapper
    ↓
MockLbeWrapper
    ↓
typed mock snapshots/events
```

Later live architecture:

```text
Ratatui TUI
    ↓
LbeWrapper
    ↓
Real LBE adapter
    ↓
canonical LBE runtime
```

The visible label remains truthful:

```text
MOCK / NOT CONNECTED · UI CONTRACT PREVIEW
```

That label describes runtime connectivity, not the maturity or intended permanence of the TUI frontend.

### Current local modularization state

User-supplied runtime evidence from `C:\LBE-TUI-Lab` shows the local working tree is dirty and still based on remote head `2bbada6`.

The root `Cargo.toml` points the `lbe` binary at:

```text
src/main.rs
```

The modular files are present and declared, but the active entrypoint currently contains only:

```rust
fn main() {
    println!("placeholder");
}
```

`src/tests.rs` is also a placeholder and contains no `#[test]` declarations.

Current validation evidence:

```text
cargo check = PASS WITH WARNINGS
cargo test  = PASS, 0 tests discovered
```

Therefore the current local modular source split is **not yet feature-readiness proof**. The active TUI event loop and test suite must be restored before modular feature closure continues.

---

## 2. Implemented UI/runtime contract

The typed contract already covers:

```text
runtime/session projection
Lbe Audit / Agent regular / Plan modes
approval IDs and stale-ID rejection
execution / validation / completion separation
tool lifecycle
session continuation with session-ID validation
context compaction
command stdout/stderr lifecycle
checkpoint projection
retry / timeout projection
diagnostics
detached/background command events
runtime attachment / connection state
provider/model catalog projection
provider capabilities
```

These are implementation surfaces intended to survive the later replacement of `MockLbeWrapper` with a real LBE adapter.

---

## 3. Immediate blocker before further feature implementation

Restore the active modular binary wiring:

```text
src/main.rs
→ init_terminal
→ construct MockLbeWrapper
→ construct App from wrapper snapshot
→ draw UI
→ poll/reduce LBE events
→ process key/resize events
→ route requests through LbeWrapper
→ restore terminal
```

Restore the migrated test suite through:

```rust
#[cfg(test)]
mod tests;
```

and require:

```text
cargo check = PASS
cargo test  = PASS with non-zero expected tests
```

before claiming the modularized TUI is functionally restored.

---

## 4. Modular pre-integration closure state

```text
01 Transcript viewport / long output       MISSING
02 Interactive model picker                PARTIAL
03 Checkpoint compare / restore            PARTIAL
04 Session management                      PARTIAL
05 Background / detached processes         PARTIAL
06 Provider configuration                  PARTIAL
07 Tool registry                           PLACEHOLDER
08 Evidence browser                        PLACEHOLDER
09 Receipt browser                         PLACEHOLDER
10 MCP registry                            PLACEHOLDER
11 Terminal compatibility                  MISSING
12 Plain / non-TUI mode                    MISSING
13 Terminal lifecycle acceptance           NOT_PROVEN
14 Responsive/minimum-size acceptance      PARTIAL
15 Session memory and recall               PLANNED
16 Browser-chat bridge                     PLANNED
```

Each module should be implemented and closed independently rather than regenerating the full plan.

---

## 5. Session memory and recall — PLANNED

Goal: allow the agent to recover relevant work from its own prior LBE sessions so the user does not need to repeatedly reconstruct project history.

Planned behavior:

```text
stable session hash
meaningful event/record hashes
session hash-chain head
structured session summary
bounded relevance-based recall
verified/current memory ranked above unverified/stale memory
```

Meaningful records include:

```text
user intent
agent decisions
selected constraints
tool/action execution
validation outcome
completion result
checkpoint
evidence/receipt references
session summary
```

Raw streaming deltas should not become independent durable memories.

The TUI may use a local non-canonical cache during pre-integration, but canonical persistent memory remains owned by the LBE runtime.

---

## 6. Browser-chat bridge — PLANNED

The browser-chat interaction plan is provider-neutral:

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

Browser chat is a reasoning/conversation surface, not execution authority.

Every browser interaction should correlate:

```text
browser_session_id
lbe_session_id
lbe_turn_id
browser_message_id
tool_call_id
evidence_ref
receipt_id
```

Governed tool flow must be:

```text
browser assistant proposes action
→ bridge intercepts request
→ LBE authorization / approval
→ LBE-owned execution
→ validation
→ evidence / receipt
→ structured result returned to browser chat
```

No silent fallback from browser chat to direct governed filesystem/process/tool execution is permitted.

Browser chat should reuse the LBE session-memory layer for bounded recall rather than becoming an independent memory authority.

---

## 7. Provider contract and policy

The UI source defines typed provider/model concepts including:

```text
ProviderId
ProviderConfig
CredentialRef
AuthState
ProviderHealth
ProviderCapabilities
ProviderProjection
ModelRef
ModelDescriptor
ModelRequest
Message
ToolDefinition
ModelEvent
Usage
FinishReason
ProviderError
```

Provider identities represented include OpenAI, Anthropic, Google Gemini, AWS Bedrock, Mistral, OpenAI-compatible, LM Studio and Ollama.

These remain mock contracts; no real provider adapters are proven connected in this UI repository.

---

## 8. Not implemented live

```text
RealLbeWrapper / real LBE adapter
live canonical LBE attachment
live guard/audit calls
live approval authority
live validation
live evidence / receipts
canonical persistence attachment
real provider adapters/auth/health/model discovery
session-memory client integration
browser-chat bridge
installed end-to-end live integration
```

---

## 9. Superseded claims

The following claims must not be used as current truth:

```text
Rust TUI currently connects to installed lbe-guard-audit wrapper
Rust TUI currently reuses live wall deterministic audit authority
Audit mode is currently backed by live LBE guard execution
Current local modular binary is already a fully wired runnable TUI
```

---

## 10. Authority boundary

```text
TUI / browser clients:
- render and navigate;
- collect input;
- select context;
- construct requests;
- project runtime state.

Canonical LBE runtime:
- owns workspace identity;
- owns sessions and canonical persistence;
- owns policy and authorization;
- owns deterministic guards;
- owns consequential execution;
- owns validation;
- owns evidence and receipts;
- owns canonical memory;
- owns completion proof.
```

GPT-K is a reference/projection surface only. The local modular workspace is not remote repository truth until committed and independently verified.
