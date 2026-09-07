# LBE — Lockstep Boundry Engine

## What Is LBE?

**LBE is an agent terminal that owns what it does.**

Not what it says it will do. Not what the AI model thought. What it actually did, why, and whether it was allowed.

---

## The Problem LBE Solves

AI agents are powerful but can become difficult to account for when execution authority, evidence, and persistent state are fragmented. They can:

- Propose actions without a clear policy decision
- Execute mutations without durable proof
- Lose track of what happened across sessions
- Create duplicate authority and conflicting state

**LBE fixes this by owning the boundary between "the agent wants to" and "the system did".**

---

## Product Definition

| Component | Role |
|-----------|------|
| **LBE CLI/TUI** | User-facing product surface |
| **Cline** | Embedded provider/model/reasoning/delegated-agent mechanics |
| **LBE Runtime** | Sole authority for session/workspace truth, policy, authorization, governed execution, receipts/evidence, persistence, validation, and completion |
| **Rust/Ratatui** | Reference/integration client; not the primary product UI |

**Core Principle:** The agent/provider owns cognition. LBE owns capabilities and consequences.

---

## What LBE Provides

1. **Authorization** — Authority-bearing actions are checked against LBE policy
2. **Receipts** — Governed execution returns correlated ToolReceipt records
3. **Evidence** — Persisted evidence supports audit and validation
4. **Persistence** — Sessions, turns, runtime events, and governed state survive restart/resume according to the runtime contract
5. **Governance** — Mutations execute only through LBE-governed capability paths; approval is required only where the active policy explicitly requires it
6. **Validation** — Deterministic validation, not provider prose, establishes completion truth

---

## Authority Flow

```text
USER
  ↓
AGENT / PROVIDER
reasons and proposes
  ↓
LBE
resolves policy + authorization
  ↓
GOVERNED EXECUTION
  ↓
TOOLRECEIPT + EVIDENCE
  ↓
PERSIST / CONTINUE / VALIDATE
```

---

## Product Boundary

```text
LBE CLI/TUI
    = user-facing product

Cline
    = embedded AI/provider/model/reasoning/delegated-agent mechanics

LBE Runtime
    = sole authority for capabilities and consequences

Rust/Ratatui
    = reference/integration client
```

Cline may provide mature agent mechanics, but it must not become a second authority for workspace/session truth, authorization, tool execution, evidence, persistence, validation, or completion.

---

## Summary

| Question | Answer |
|----------|--------|
| What is LBE? | Accountable governed AI agent terminal |
| What does it own? | Capabilities and consequences |
| What does the agent own? | Cognition, reasoning, proposals, and replanning |
| What does the user get? | A truthful record of what was allowed, executed, evidenced, persisted, and completed |
| What is the product surface? | LBE CLI/TUI |
| What is Cline? | Embedded mechanics, not product authority |
| What is Rust/Ratatui? | Reference/integration client |

---

## Brand

```text
LBE
Lockstep Boundry Engine
LETTERBLACK
```

Preserve the intentional spelling **Boundry**.

---

## Ready-To-Use Means Complete Product

When the user asks whether LBE is **ready to use**, that phrase has a strict product meaning.

It does **not** mean:

- a backend server starts;
- one provider call works;
- a session can be created;
- a Rust reference client works;
- a developer can manually run several commands;
- an agent can ask the user which command, service, config file, or test harness to launch next;
- a partial feature set is available behind diagnostics.

**Ready to use means the complete planned LBE product is assembled, aligned, designed, implemented, validated, installed, and usable through one normal product entrypoint.**

The user experience must be:

```text
launch LBE
    ↓
one complete LBE-branded CLI/TUI
    ↓
provider login / provider selection / model selection
    ↓
conversation / planning / audit / coding
    ↓
governed tools / approvals / processes / subagents / MCP / memory
    ↓
evidence / receipts / validation / completion
    ↓
persistent session / restart / resume
```

No separate backend server window, internal package command, manual provider JSON editing, hidden command-runner workflow, or developer-only setup is part of normal production use.

The final CLI/TUI must present the planned LBE interface and product identity, including the LBE visual system, logo/brand, conversation/execution timeline, provider/model state, governed execution state, approvals when policy requires them, evidence/receipt projections, persistence and session state, and the other accepted planned product capabilities.

A product-ready claim is allowed only when there are **no unresolved implementation, integration, design, ownership, packaging, installation, configuration, runtime, or acceptance gaps within the accepted final-product scope**.

If any accepted product capability is still missing, mock-only, reference-only, unbound, manually configured, unvalidated, or dependent on the user running diagnostic commands, the correct answer is:

```text
NOT READY TO USE
```

not "partially ready", "ready except for", or an instruction asking the user what to run next.

## Evidence Rule

This document defines product identity and ownership. It is not runtime acceptance evidence.

Current source, machine governance, runtime evidence, ToolReceipts, acceptance records, and canonical repository state outrank this projection for present-state claims.
