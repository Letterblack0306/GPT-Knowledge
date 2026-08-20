# Access Browser Agent — What We Are Building

## Simple plan

Access Browser Agent is a desktop application where a **local agent does the actual reasoning and coding/development work**.

The **browser/provider conversation is the instruction source**. It gives the local agent the user's or provider's natural-language instruction and receives the result back.

The browser/provider side is not another agent. It should not become a second reasoning loop, planner, retry system, or completion authority.

## Main idea

```text
Browser / instruction provider
        ↓
transport
        ↓
Local AgentSessionRuntime / LiveAgentCore
        ↓
reasoning + coding / development
        ↓
controlled tools and capabilities
        ↓
result / evidence
        ↓
transport back to the same conversation
```

The project keeps **one authoritative agent lifecycle**.

Agents reason. Bridges transport. Governance controls authority without becoming another reasoning engine.

## What the project is building

The project builds the capabilities around that single local agent in stages:

1. **Browser capability authority** — establish controlled browser access, health, identity, target discovery, target selection, invalidation, and reconnect behavior.
2. **Read-only browser tools** — give the local agent safe ways to inspect browser state and collect information.
3. **Verified browser actions** — allow browser actions only with the required verification and evidence.
4. **Evidence and artifacts** — connect browser results to the existing evidence/receipt system.
5. **Provider adapters** — connect supported web AI providers as protocol/data adapters, not as separate agents.
6. **Provider-driven conversation loop** — transport provider conversation turns into the existing local agent lifecycle and return the result to the same conversation.
7. **Browser UI** — build the user-facing browser UI only after the runtime contracts are established.

## What stays separate

- The local agent owns reasoning, coding/development decisions, tool selection, adaptation, and completion of its own work.
- Browser/provider transport owns communication, identity, ordering, deduplication, journaling, and delivery.
- Browser access is a capability used by the local agent.
- Governance limits authority and side effects; it does not replace agent reasoning.
- Provider adapters translate provider protocols; they are not additional reasoning agents.

## Important scope rule

This file describes the **project concept and build direction in simple terms**.

It does not replace the detailed implementation plan, transport contract, acceptance records, or current repository/runtime evidence.

For current status, always check the live Access Browser Agent repository and its current project documentation.

The browser UI design is documented separately in GPT-Knowledge and is intentionally not duplicated here.
