# CLI Agent Reference Study Map — Aider, Codex, Hermes, LobeHub, OpenHands

## Knowledge metadata

- Last reviewed: 2026-08-10
- Purpose: route agent-development questions to the reference project that best exposes the relevant subsystem
- Confidence: high at architectural level; individual upstream implementations evolve and must be rechecked before copying details

## Core assignment

```text
Aider      -> repository cognition + Git-aware editing
Codex      -> execution + approvals + sandbox + validation plumbing
Hermes     -> persistent loop + memory + skills + toolsets + delegation
LobeHub    -> providers + models + configuration + knowledge + integrations
OpenHands  -> autonomous SWE runtime + event loop + workspace abstraction
```

These are complementary references, not competing full-system templates.

For completion-contract and validation-gate questions, also use the dedicated LBE evidence study before proposing implementation changes:

- `ai-agents/studies/lbe-completion-contract-and-validation-evidence-study.md`

That study combines current LBE source verification with primary live references such as GitHub required status checks and durable execution systems. It is specifically intended to prevent a CLI, provider, or model from becoming a second completion/evidence authority.

## Study matrix

| Concern | Primary reference | Secondary reference | What to extract |
|---|---|---|---|
| Whole-repository awareness | Aider | OpenHands | repo map, selective expansion, context budgeting |
| File-edit reliability | Aider | Codex | deterministic edit contracts, diffs, rollback |
| Shell/file execution | Codex | OpenHands | typed action execution, sandbox/workspace boundaries |
| Approval state | Codex | OpenHands | explicit request/decision/execution separation |
| Runtime validation | Codex | OpenHands | evidence chain after actions run |
| Persistent memory | Hermes | OpenHands | bounded durable memory, searchable history |
| Skills/procedures | Hermes | OpenHands | progressive disclosure and procedural knowledge |
| Subagents/delegation | Hermes | OpenHands | bounded objectives and isolated authority |
| Provider catalog | LobeHub | Hermes | provider adapters, readiness, custom endpoints |
| Model catalog/capabilities | LobeHub | OpenHands | provider/model separation, normalized capabilities |
| Knowledge bases | LobeHub | Hermes | source lifecycle, retrieval provenance, agent attachment |
| MCP/tools/integrations | LobeHub | Hermes/OpenHands | dynamic capability registry and independent health |
| Autonomous SWE loop | OpenHands | Codex | event history, actions, observations, lifecycle state |
| Local/remote workspace | OpenHands | Codex/Hermes | execution abstraction and environment identity |
| Completion contract / validation gate | LBE completion evidence study | GitHub required checks / durable runtimes | requirement ownership, trusted producers, persisted proof, thin final gate |

## Combined reference architecture

```text
                         USER / CHANNELS
                               |
                               v
                     normalized session ingress
                               |
                               v
+---------------------------------------------------------------+
|                        AGENT CONTROL PLANE                     |
| session identity | task state | plan | approvals | completion |
+---------------------------------------------------------------+
       |                    |                     |
       |                    |                     |
       v                    v                     v
 repository cognition   context system       integration plane
     (Aider)            (Hermes/OH)             (LobeHub)
       |                    |                     |
 repo map               skills                  providers
 symbol graph           memory                  models
 selective reads        project rules           knowledge
 editable scope         retrieval                MCP/tools
       |                    |                     |
       +--------------------+---------------------+
                               |
                               v
                     reasoning / action step
                               |
                               v
                     policy + approval gate
                         (Codex/OpenHands)
                               |
                               v
                       workspace/tool runtime
                         (OpenHands/Codex)
                               |
                               v
                         observations/events
                               |
                               v
                       validation + evidence
                               |
                         complete / continue
```

## Non-negotiable separations

### 1. Repository knowledge is not file authority

A file can be known through the repo map without being fully read or writable. Keep `known`, `mapped`, `inspected`, `editable`, `changed`, and `validated` states distinct.

### 2. Provider configuration is not provider readiness

A saved endpoint/key/model selection is configuration. Readiness requires adapter availability plus connection/capability validation.

### 3. Model intent is not execution

An assistant message proposing a command is not a tool call. A tool call is not approval. Approval is not execution. Execution is not validation.

### 4. Memory is not evidence

Memory can help recover facts and procedures, but live repository/runtime evidence overrides stale memory. Evidence receipts should not be silently rewritten as memory summaries.

### 5. Skills are not tools

Skills describe how to work; tools perform actions. A skill may reference several tools but cannot create authority those tools do not have.

### 6. Channels are not agents

CLI, web UI, desktop, Slack/Telegram-like messaging, APIs, and IDEs are ingress/egress surfaces around an agent/session runtime. They should not fork independent behavioral truth.

### 7. Loop termination is not completion

The agent can stop because it is blocked, waiting, out of budget, or thinks it is done. Completion requires a separate evidence-aware predicate.

### 8. Validation requirement is not validation producer

The task's required proof must be resolved by the authoritative runtime/task policy before execution evidence is interpreted. A producer reports a bounded result; it does not get to widen the task contract. The final gate evaluates the contract against accepted producer-bound evidence.

## Recommended implementation contracts

### Repository contract

```text
workspaceId
repoId
revision
knownPaths
symbolMapRevision
inspectedPaths
editablePaths
preexistingChanges
agentChanges
```

### Provider/model contract

```text
providerId
adapterId
endpointRef
credentialRef
enabled
health
lastValidatedAt
modelId
capabilities
modelAvailability
```

### Operation contract

```text
sessionId
turnId
operationId
toolCallId
environmentId
targetId
requestedAction
approvalState
executionState
observationRef
validationRefs
```

### Completion contract

```text
sessionId
taskId
workspaceId
requirements[]
requirementId
evidenceKind
resolvedByPolicyRef
createdAt
```

The completion contract should be durable and immutable for the task once established unless an explicit governed task/policy transition creates a new contract version.

### Knowledge/memory contract

```text
sourceId
scope
kind
provenance
retrievalState
lastUpdatedAt
retentionPolicy
confidence
```

## Study order for building or auditing an agent

1. **Aider:** determine how the system discovers repository structure before editing.
2. **Codex:** determine how proposed actions cross policy, approval, sandbox, and execution boundaries.
3. **Hermes:** determine what survives turns/sessions and how procedures/tools are loaded without prompt bloat.
4. **LobeHub:** determine how providers, models, knowledge, tools, and external integrations are registered and validated.
5. **OpenHands:** determine how all runtime actions become event-driven software-engineering work over explicit workspaces.
6. For completion/validation architecture, read `lbe-completion-contract-and-validation-evidence-study.md` and recheck its external primary references plus current target-repository source.
7. Synthesize only the patterns that solve a proven requirement in the target project.

## Related studies

- `ai-agents/studies/aider-repository-cognition.md`
- `ai-agents/studies/codex-execution-validation.md`
- `ai-agents/studies/hermes-memory-skills-agent-loop.md`
- `ai-agents/studies/lobehub-provider-integration-architecture.md`
- `ai-agents/studies/openhands-autonomous-swe-runtime.md`
- `ai-agents/studies/lbe-completion-contract-and-validation-evidence-study.md`
- `ai-agents/reference-derived-agent-architecture.md`

## Rule

Do not copy a feature because it exists upstream. First define the target system's ownership, lifecycle, authority, evidence, failure state, and user-visible contract; then use the relevant reference implementation to challenge and improve that design.
