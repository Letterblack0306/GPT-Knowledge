# LBE TUI Contract — Coverage and Remaining Integration

**Classification:** REFERENCE  
**Authority:** NON-CANONICAL  
**Verified against UI repository:** `Letterblack0306/LBE_Agents_wall_Intigration`  
**Verified branch:** `main`  
**Verified commit:** `2bbada6dee2473734d5a466e0c862d4568682daa`  
**Verified date:** 2026-08-29  
**Purpose:** Record the current Rust/Ratatui LBE terminal UI contract and distinguish implemented mock projection from real LBE/runtime/provider integration.

---

## 1. Current truth

The current UI repository is a **UI/TUI contract prototype only**.

Current path:

```text
Ratatui TUI
    ↓
LbeWrapper
    ↓
MockLbeWrapper
    ↓
mock snapshots / mock events
```

The UI visibly identifies this state as:

```text
MOCK / NOT CONNECTED · UI CONTRACT PREVIEW
```

The repository currently contains no `RealLbeWrapper`, no canonical LBE wall attachment, no persistent-agent service connection, no live guard runtime, no live authorization, no canonical evidence/receipts, and no live provider/model integration.

### Superseded statement

The earlier version of this reference stated that an installed `lbe-guard-audit` wrapper was currently connected and covered by the Rust TUI. That statement is **STALE** relative to UI repository `main` at `2bbada6...` and must not be used as current implementation truth.

The canonical LBE wall may expose audit capabilities independently, but the current UI repository is not connected to them.

---

## 2. Implemented UI/runtime contract

### Runtime/session projection — IMPLEMENTED AS MOCK CONTRACT

The current typed projection includes:

```text
runtime_id
runtime_mode
connection state
attached_client_count
session_id
session_state
turn_id
workspace_id
workspace_label
```

Session states include:

```text
Idle
Running
WaitingForApproval
WaitingForInput
Completed
Failed
Aborted
```

These fields are mock/runtime contract surfaces, not proof of a live runtime.

### Modes — IMPLEMENTED

```text
Lbe Audit
Agent regular
Plan
```

`Tab` cycles through the three modes. The active mode is carried through the wrapper/snapshot contract rather than being presentation-only.

### Approval identity — IMPLEMENTED AS MOCK CONTRACT

The mock lifecycle preserves an explicit `approval_id` through proposal → UI → approve/reject. Unknown or stale approval IDs are rejected.

This replaces placeholder approval semantics such as `Approve("any")`.

### Execution / validation / completion separation — IMPLEMENTED AS MOCK CONTRACT

The event model separates:

```text
ExecutionStarted
AgentRequestedCompletion
ExecutionCompleted
ValidationStarted
ValidationCompleted
LbeCompletionAccepted
```

Therefore `execution completed` is not treated as equivalent to validation success or LBE completion acceptance.

### Tool lifecycle — IMPLEMENTED AS MOCK CONTRACT

```text
ToolRequested
ToolStarted
ToolOutputDelta
ToolCompleted
ToolFailed
```

Associated projection includes identifiers, tool name, input summary, risk and optional evidence reference.

Risk classes include:

```text
READ_ONLY
GOVERNED
ELEVATED
```

### Session continuation — IMPLEMENTED AS MOCK CONTRACT

`UserRequest::Continue` exists with active session-ID validation in the mock runtime.

### Additional contract projections — IMPLEMENTED AS MOCK CONTRACT

The current source also includes contract/projection support for:

```text
context compaction
command stdout/stderr lifecycle
checkpoint projection
retry and retry-limit state
timeout / elapsed state
runtime diagnostics
detached/background command projection
runtime attachment/connection states
provider/model catalog projection
provider capability projection
```

These remain local mock representations.

---

## 3. Provider contract and policy

### Typed provider contract — IMPLEMENTED AS MOCK CONTRACT

The UI source defines concepts including:

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

Provider identities represented include:

```text
OpenAI
Anthropic
Google Gemini
AWS Bedrock
Mistral
OpenAI-compatible
LM Studio
Ollama
```

No real provider adapters are present.

### Provider policy — DOCUMENTED

The UI repository README states:

```text
Cline documentation = reference only
Cline authentication = not used
api.cline.bot = not used
future provider path = LBE-owned provider gateway → direct provider connection
```

Provider credentials are intended to remain provider-native and referenced through secure storage rather than exposed in TUI snapshots/events.

---

## 4. Not implemented

### Real LBE integration — NOT IMPLEMENTED

```text
RealLbeWrapper
live LBE_Presistent_Agent_wall attachment
live audit/guard calls
live approval authority
live validation
live evidence
live receipts
canonical persistence
```

### Real direct-provider integration — NOT IMPLEMENTED

```text
OpenAI adapter
Anthropic adapter
Gemini adapter
Bedrock adapter
Mistral adapter
OpenAI-compatible adapter
LM Studio adapter
Ollama adapter
provider credential store
provider-native authentication
provider health probes
live model discovery
provider streaming translation
tool-call translation
usage normalization
reasoning-delta normalization
```

---

## 5. Current architecture

```text
                 LBE_Agents_wall_Intigration
                         UI ONLY
                           │
                           ▼
                     LbeWrapper
                           │
                           ▼
                     MockLbeWrapper
                           │
          ┌────────────────┼────────────────┐
          │                │                │
       sessions         providers        tools
       approvals        models           execution
       context          health           validation
       checkpoints      auth state       completion
          │                │                │
          └────────────────┴────────────────┘
                           │
                    MOCK PROJECTIONS
```

Future integration boundary:

```text
LBE TUI
   ↓
RealLbeWrapper
   ↓
canonical LBE runtime
   ↓
LBE-owned provider gateway
   ↓
direct providers
```

The future path is documented intent only until implemented and validated.

---

## 6. Current classification

```text
UI architecture                         IMPLEMENTED / SOURCE-VERIFIED
Mock runtime contract                   IMPLEMENTED / SOURCE-VERIFIED
Typed provider contract                 IMPLEMENTED AS MOCK CONTRACT
Approval/session lifecycle              IMPLEMENTED AS MOCK CONTRACT
Tool lifecycle                          IMPLEMENTED AS MOCK CONTRACT
Execution/validation separation         IMPLEMENTED AS MOCK CONTRACT
Provider policy                         DOCUMENTED IN UI REPOSITORY
Truthful mock connection labeling       IMPLEMENTED / SOURCE-VERIFIED

Real LBE attachment                     NOT IMPLEMENTED
Real guard/audit connection             NOT IMPLEMENTED
Real provider connections               NOT IMPLEMENTED
Real credentials/auth                   NOT IMPLEMENTED
Real evidence/receipts                  NOT IMPLEMENTED
Canonical persistence                   NOT IMPLEMENTED
Installed end-to-end real integration   NOT PROVEN
```

---

## 7. Authority boundary

This reference must not convert mock projection into runtime truth.

```text
TUI:
- renders;
- navigates;
- requests;
- projects contract state.

Canonical LBE runtime/wall:
- owns workspace identity;
- owns policy and authorization;
- owns deterministic guard execution;
- owns consequential execution;
- owns validation;
- owns evidence and receipts;
- owns persistence;
- owns completion proof.
```

No GPT-K reference or UI mock state may be cited as proof that those live runtime capabilities are connected.
