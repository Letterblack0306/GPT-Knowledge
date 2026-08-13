# Reusing Cline Runtime Layers Inside a Governed Agent Infrastructure

## Knowledge metadata

- Last reviewed: 2026-08-13
- Scope: reusing Cline SDK/runtime layers inside a provider-neutral governed professional agent runtime
- Canonical use: read with `professional-agent-runtime-cli-and-provider-architecture.md` and `unified-agent-engineering-methods.md`
- Evidence basis: current `cline/cline` SDK architecture and Apache-2.0 repository license, plus the established LBE runtime/governance architecture
- Confidence: high for the integration boundary; exact Cline package APIs and event shapes must be revalidated against the pinned version before implementation

## Core conclusion

A governed agent runtime does not need to reimplement every provider transport, streaming grammar, tool-call continuation loop, retry mechanism, and context-management path if a mature embeddable engine already provides those functions.

Cline is a viable reusable lower-layer engine because its current SDK is explicitly packaged for embedding and exposes layered packages including:

```text
@cline/llms
@cline/agents
@cline/core
@cline/shared
@cline/sdk
```

The correct reuse model is **selective composition**, not wholesale replacement of the governed runtime.

Canonical boundary:

```text
                       governed runtime
      workspace/session identity + policy + authority
                           |
                 capability projection
                           |
                provider/agent adapter
                           |
          +----------------+----------------+
          |                                 |
   Cline lower layers                 native adapter
 @cline/llms / agents                      path
          |
 provider-native streaming
 tool-call grammar
 continuation mechanics
 retry/context/provider handling
```

The governed runtime remains the authority for execution.

---

## 1. Preferred reuse order

Evaluate Cline packages from the lowest useful layer upward.

### First choice: `@cline/llms`

Use when the project needs mature provider support, native streaming, provider-specific request/response handling, usage accounting, retry/error handling, and model integration without importing Cline's own session or tool authority.

This is the lowest-risk reuse boundary.

### Second choice: `@cline/agents`

Use only when its agent loop can be adapted so that proposed tool calls are routed into the governed runtime rather than executed through an independent authority path.

Desired flow:

```text
Cline provider/agent event
        -> normalized governed-runtime model event
        -> capability/projection check
        -> deterministic authorization
        -> governed tool dispatcher
        -> evidence-bearing tool result
        -> Cline/provider continuation input
```

### Selective choice: `@cline/shared`

Reuse stable types/helpers/event utilities only when they reduce duplication without leaking Cline-specific UI/session semantics into the governed public contract.

### Avoid wholesale adoption: `@cline/core` / full `@cline/sdk`

Current ClineCore includes session persistence, built-in tools, workspace/config discovery, SQLite state, RPC, and execution-host behavior. Those responsibilities overlap a mature governed runtime's own authoritative owners.

Do not create dual authority for:

```text
workspace identity
session persistence
permissions
runtime policy
tool execution
checkpoints
evidence
validation
completion
```

`ClineCore` may still be useful as comparative evidence or for isolated integrations, but it should not silently become the governed runtime owner.

---

## 2. Authority boundary

Cline/model layers may own or assist with:

```text
provider transport
provider authentication plumbing
native response streaming
provider-specific tool-call syntax
partial tool arguments where actually supplied
provider continuation serialization
provider retry/error normalization
context/token management
usage reporting
```

The governed runtime must continue to own:

```text
workspace/project identity
session authority
mode and permission state
capability availability
provider projection policy
deterministic authorization
governed tool execution
operation identity/idempotency
evidence provenance
validation truth
completion truth
checkpoint/recovery policy
client/control protocol semantics
```

A provider or embedded agent engine must never gain workspace authority merely because it supports tools.

---

## 3. Event normalization remains mandatory

Do not expose Cline-native event objects directly as the product's durable event contract.

Use an adapter:

```text
Cline event
   -> provider/runtime adapter
   -> normalized model event
   -> Session / Turn / Item event substrate
   -> client projection
```

The existing normalized vocabulary remains the product contract, for example:

```text
model.turn.started
model.message.delta
model.message.completed
model.reasoning_summary.delta
model.reasoning_summary.completed
model.tool_call.started
model.tool_call.arguments.delta
model.tool_call.completed
model.usage.updated
model.turn.requires_tool
model.turn.requires_continuation
model.turn.completed
model.turn.incomplete
model.turn.refused
model.cancelled
model.error
```

Cline-specific IDs and raw diagnostic details may be retained as provider/backend metadata, but clients must not depend on them directly.

---

## 4. Tool execution rule

The most important acceptance condition is that Cline does not become a second tool dispatcher.

Correct:

```text
model proposes tool call
        -> LBE/governed capability projection
        -> deterministic authorization
        -> existing governed tool dispatcher
        -> runtime events/evidence
        -> provider continuation
```

Incorrect:

```text
model proposes tool call
        -> Cline built-in shell/editor executes directly
        -> governed runtime observes afterward
```

The second design cannot honestly claim deterministic governance of the operation unless the external mutation path is independently blocked or verified.

---

## 5. Session and persistence rule

If the host runtime already has authoritative persistent Session / Turn / Item state, Cline conversation/session persistence must not become a competing source of truth.

Allowed patterns:

```text
Cline stateless/provider state
    -> attached to host session as backend metadata
```

or

```text
Cline continuation state
    -> opaque provider/backend reference persisted by host session owner
```

Avoid two independent task histories that can disagree about:

```text
active turn
completed tools
workspace state
cancelled operations
resume eligibility
completion status
```

---

## 6. CLI/TUI implication

Reusing Cline underneath does **not** imply reusing Cline's visible CLI/TUI.

The product UI should remain a projection of the governed runtime's normalized ordered interaction:

```text
user input
agent commentary
live tool invocation
stdout/stderr/progress
result/denial/error
agent reaction
edit/diff
validation
final response
```

Architecture:

```text
LBE / governed TUI
        |
agent-control + event API
        |
Session / Turn / Item runtime
        |
normalized model events
        |
Cline adapter (@cline/llms / optional @cline/agents)
```

This preserves product identity while reusing mature backend plumbing.

---

## 7. Implementation decision gate

Before independently building provider-native adapters, run this evaluation:

```text
1. Pin the exact Cline package/version to inspect.
2. Map its stream/tool/usage/error events to the normalized provider contract.
3. Prove tool calls can be intercepted before mutation.
4. Prove tool results can be supplied back for provider continuation.
5. Prove cancellation and terminal attribution can be preserved truthfully.
6. Prove host workspace/session/policy owners remain authoritative.
7. Compare dependency/runtime cost against native adapters.
```

Decision:

```text
if @cline/llms satisfies provider transport needs cleanly:
    reuse it

if @cline/agents also permits host-governed tool execution cleanly:
    reuse it for the continuation loop

if either layer requires surrendering authority or fabricating semantics:
    drop to the lower layer or retain native implementation
```

Do not fork or vendor large Cline subsystems unless a pinned-package adapter cannot satisfy the required boundary.

---

## 8. Licensing and provenance

The current `cline/cline` repository is Apache License 2.0. Reuse and modification are permitted subject to the license's notice, attribution, and redistribution requirements.

For production use:

- pin package versions;
- retain required license/NOTICE material;
- record which Cline packages are runtime dependencies;
- keep an explicit adapter boundary so replacement remains possible;
- do not use Cline trademarks as product identity merely because its code is reused.

---

## 9. Relationship to the professional runtime roadmap

This guidance **changes implementation strategy, not the dependency architecture**.

The roadmap remains:

```text
P0 normalized provider semantics
P1 runtime capability contract
P2 truthful provider/model capability negotiation
P3 provider-native streaming/tool-call path
P4 persistent Session / Turn / Item state
P5 governed professional capabilities
P6 live execution events
P7 governed provider continuation
P8+ control/client surfaces
```

For P3 and P7, the default implementation question is now:

> Can a pinned Cline lower layer provide the mature provider/agent mechanics while the governed runtime retains all authority?

Only implement parallel provider plumbing from scratch where the answer is no or where a native implementation is materially simpler and better proven.

## Final rule

**Reuse mature agent-engine plumbing where it is separable. Never outsource governance authority merely to save implementation effort. Keep the runtime contract and TUI product-owned, normalize third-party events at the boundary, and make the embedded engine replaceable.**
