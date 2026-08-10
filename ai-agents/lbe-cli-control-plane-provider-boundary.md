# LBE CLI Control Plane and Replaceable Provider Boundary

## Purpose

Record the architectural reason LBE should remain a stable workspace/governance runtime while the language model remains replaceable and user-selectable.

This document is a design reference for future LBE Persistent Agent, CLI-agent, provider, governance, and runtime work. It is not a substitute for inspecting the current implementation in `Letterblack0306/LBE_Presistent_Agent_wall` or LBE Core.

## Decision

Use one LBE runtime/control plane with explicit execution modes and provider adapters.

Do not build separate permanent "coding LLM", "audit LLM", or "rule-learning LLM" authorities.

```text
LBE workspace/governance runtime
        |
        +-- CLI  primary automation/agent surface
        +-- API  integration surface
        +-- TUI  optional operator/debug surface
        |
        v
Persistent session contract
        |
        +-- mode
        +-- workspace identity
        +-- active guard/profile
        +-- tool permissions
        +-- evidence policy
        +-- validation/completion requirements
        |
        v
Provider adapter
        |
        +-- OpenAI-compatible APIs
        +-- Claude/provider APIs
        +-- LM Studio
        +-- Ollama
        +-- future compatible providers
```

## Stable versus replaceable responsibilities

### Stable LBE/workspace side

LBE owns the durable contract:

- target workspace identity and scope;
- session/task lifecycle;
- approved rules, guards, and workspace profile;
- evidence classification and provenance;
- tool/capability authorization;
- deterministic validation requirements;
- completion proof;
- verified persistent memory/checkpoints;
- governance decisions.

### Replaceable provider side

The selected LLM may:

- interpret user intent;
- reason over supplied context;
- form temporary hypotheses;
- choose among exposed tools and retrieval paths;
- generate plans, explanations, patches, or proposals when the active mode allows them.

Changing the model must not implicitly change workspace authority.

```text
provider changes
!=
workspace policy changes
```

A user should be able to change the provider for a session without rebuilding LBE rules or losing project governance state.

## Modes are contracts, not personalities

### Coding mode

Coding mode grants the runtime the capabilities allowed by the active workspace/session policy. Typical operations include inspection, controlled edits, tests, build commands, deterministic validation, and application of existing approved rules.

### Audit / inspect mode

Audit mode is evidence-focused and read-only. It may retrieve reference knowledge, inspect current workspace state, run deterministic guards, and return evidence-bound findings. It does not repair the workspace.

### Investigation mode

Investigation mode expands from an unknown failure, runtime error, failed guard, or evidence reference. It can trace code paths and relevant evidence but does not gain write authority merely because a diagnosis has been formed.

## Authorization and approval

Do not equate governance with asking the user before every action.

The correct hierarchy is:

```text
user grants policy/settings authority
        ↓
LBE evaluates requested operation
        ↓
authorized by active policy?
    yes → execute within that authority
    no  → request approval / stop / report conflict
```

If a user has already enabled automatic application of existing approved rules and controlled workspace edits, the coding runtime should not repeatedly ask for permission for each matching action.

Repeated confirmation is appropriate when an action exceeds the existing grant, for example:

- scope expands outside the approved workspace or task;
- a new tool/capability class is required;
- a destructive operation is not covered by policy;
- a persistent rule/profile is being created or widened without delegated policy-change authority;
- the new request conflicts with protected intent or another governing constraint.

### Existing rules versus new policy

Keep these operations distinct:

```text
apply existing approved rule
        ≠
create or widen persistent rule
```

Auto-application settings can authorize the first. The second changes policy and therefore follows whatever authority model the user configured for policy changes. If that class was not delegated, approval is required.

## Why not depend on the model learning rules

An LLM can forget instructions after compaction, interpret them differently across providers, or change behavior after a model update. Persistent workspace behavior therefore cannot depend on passive model learning.

Instead:

```text
verified rule / guard / profile
        ↓
LBE retrieves applicable contract
        ↓
contract injected into active session
        ↓
capabilities enforced by runtime
        ↓
current workspace evidence + validation prove result
```

The model reasons inside the contract; it does not become the contract.

## Why provider-neutral architecture matters

1. **Provider churn is normal.** Models, costs, context windows, tool formats, and local runtimes change faster than project governance.
2. **Workspace constraints should survive provider switching.** A change from LM Studio to Ollama or a hosted API must not remove project rules.
3. **One behavioral authority is easier to validate.** Multiple role-specific models create divergent assumptions and duplicated policy logic.
4. **Provider capability belongs in adapters.** Tool-call formatting, endpoint discovery, context limits, and authentication are provider concerns, not workspace truth.
5. **Persistent sessions need a stable host.** Session state, checkpoints, evidence, permissions, and completion proof must survive model replacement.

## CLI and TUI relationship

The CLI should be the primary reusable control surface for agents, scripts, and automation.

A TUI can remain useful as an optional operator console for:

- current session state;
- provider selection;
- evidence inspection;
- guard/verdict review;
- policy/profile visibility;
- runtime diagnostics.

The TUI should consume the same runtime/session contract rather than implement a second authority path.

## Session-oriented contract

Prefer a persistent session abstraction over unrelated one-shot commands.

Conceptual form:

```text
lbe session create
  workspace=<project>
  mode=<coding|audit|investigation>
  provider=<provider>
  profile=<policy>

lbe session continue
lbe session inspect
lbe session evidence
lbe session validate
lbe session status
```

Exact command syntax is not canonical. The important requirement is explicit session state for:

- workspace;
- provider/model;
- mode;
- permissions;
- guard/profile;
- evidence policy;
- validation policy;
- lifecycle/checkpoint state.

## Knowledge routing guidance

Load this reference when the task concerns:

- LBE CLI architecture;
- provider switching inside LBE;
- coding versus audit modes;
- whether a TUI should own agent behavior;
- approval versus pre-authorized policy;
- reusable CLI control planes for coding agents;
- preventing model/provider changes from altering workspace governance.

For implementation work, first inspect the current LBE Persistent Agent repository and current LBE Core interfaces. This document records the intended boundary; live source remains authoritative for current implementation state.

## Invariant

```text
Provider reasons.
LBE runtime orchestrates.
Guards detect.
Workspace evidence supplies current facts.
LBE governance authorizes.
Validation proves.
User-configured policy decides when another confirmation is required.
```
