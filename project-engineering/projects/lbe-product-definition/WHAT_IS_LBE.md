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

## Evidence Rule

This document defines product identity and ownership. It is not runtime acceptance evidence.

Current source, machine governance, runtime evidence, ToolReceipts, acceptance records, and canonical repository state outrank this projection for present-state claims.
