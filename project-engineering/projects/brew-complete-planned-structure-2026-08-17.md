# Brew Complete Planned Structure — 2026-08-17

## Knowledge metadata

- Last reviewed: 2026-08-17
- Project repository: `Letterblack0306/brew`
- Active Brew PR at time of recording: `#442`
- Brew branch at time of recording: `agent/canonical-runtime-operation-authority-20260812`
- Brew source head before the matching project architecture document was added: `169bc635cf11d2b773610697aebd63b625fd4e2e`
- Matching Brew project document: `docs/architecture/COMPLETE_BREW_PLANNED_STRUCTURE_2026-08-17.md`
- Purpose: project-specific cross-session target architecture and dependency map for Brew
- Authority: **reference/planning only**; current Brew source, exact Git revision, live runtime evidence, and project-owned architecture/status/checkpoint documents remain higher authority

## Why this record exists

Brew now has enough proven runtime and provider behavior to define a complete target structure without treating an old roadmap or a polished architecture diagram as implementation truth.

This record preserves the intended end-state and implementation dependency order across sessions while enforcing the GPT-Knowledge rule:

```text
planned architecture
  != current implementation
  != runtime proof
  != release acceptance
```

Future work must revalidate Brew source/runtime before acting on any path, phase, owner, or status recorded here.

## Canonical project invariant

Brew is **one persistent reasoning agent**.

```text
User
  -> one reasoning model
  -> one persistent Brew runtime
  -> truthful capabilities
  -> deterministic authorization / policy
  -> governed execution
  -> evidence and state
  -> provider continuation
  -> response
```

The model owns semantic interpretation, planning, adaptation, tool selection, evidence judgment, clarification, and final response.

The runtime owns provider access, session/operation state, capability exposure, deterministic tool execution, events, persistence, recovery, evidence, and client/control surfaces.

Policy owns workspace containment, secrets, approvals, consequential actions, and hard authorization boundaries.

Reject deterministic semantic replacement architectures such as intent-classifier -> planner -> capability-router -> worker/supervisor pipelines.

## Complete target runtime composition

```text
                                      USER
                                       │
            ┌──────────────────────────┼──────────────────────────┐
            │                          │                          │
            ▼                          ▼                          ▼
        Web / UI                    CLI/TUI                   Channels
                                                               │
                                                      Telegram / API /
                                                      IDE / Automation
            │                          │                          │
            └──────────────────────────┼──────────────────────────┘
                                       │
                                       ▼
                         ┌──────────────────────────┐
                         │  INGRESS / CONTROL API   │
                         │ messages / turns         │
                         │ runtime commands         │
                         │ approvals                │
                         │ provider/model selection │
                         │ event subscribe/replay   │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │ ONE BREW REASONING AGENT │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                    ┌──────────────────────────────────┐
                    │ CANONICAL PROFESSIONAL RUNTIME   │
                    └──────────────────────────────────┘
                                      │
             ┌────────────────────────┼───────────────────────┐
             │                        │                       │
             ▼                        ▼                       ▼
       Session Runtime          Provider Runtime       Capability Runtime
       Session/Turn/Item        registry/auth          discovery/registry
       operation lifecycle      model discovery        availability
       checkpoints              capability truth      tool schemas
       resume/fork              normalized events     dynamic tools
       cancellation             usage/errors          environment truth
             │                        │                       │
             └────────────────────────┼───────────────────────┘
                                      │
                                      ▼
                         AUTHORIZATION / POLICY
                                      │
                                      ▼
                         GOVERNED TOOL EXECUTION
                                      │
           ┌──────────────────────────┼─────────────────────────┐
           │                          │                         │
           ▼                          ▼                         ▼
        Workspace                   Git                    Terminal
           │                          │                         │
           └──────────────┬───────────┴──────────────┬──────────┘
                          ▼                          ▼
                       Browser                 APIs / MCP /
                                               integrations
                          │                          │
                          └────────────┬─────────────┘
                                       ▼
                           EXECUTION EVENT STREAM
                                       │
                                       ▼
                         EVIDENCE / OPERATION JOURNAL
                                       │
                                       ▼
                             PROVIDER CONTINUATION
                                       │
                                       ▼
                              BREW FINAL RESPONSE
```

## Planned subsystem boundaries

### Runtime entry and ingress

Canonical product startup remains `package.json -> brew/agent/orchestrator-server.mjs -> brew/runtime/server/gateway-server.mjs` unless later live evidence proves an explicit migration.

All conversational clients should converge on the same canonical query/turn owner. Compatibility routes and channel adapters remain transport surfaces, never independent reasoning authorities.

Deterministic control operations such as provider/model selection, cancel/interrupt/steer, approvals, session resume/fork/checkpoint, and event subscribe/replay may bypass semantic model interpretation because those operations target runtime-owned state.

### Session / Turn / Item

The planned durable interaction substrate is:

```text
Session
  sessionId
  workspace/project identity
  provider/model + capability snapshot
  permission profile
  context/history refs
  active processes
  checkpoints
  evidence/completion state
  Turns[]
    turnId                 only after one canonical owner is proven
    operationId
    jobId
    lifecycle timestamps/status
    Items[]
      user_message
      agent_message
      model_event
      tool_call
      tool_result
      command_output
      approval
      intervention
      validation
      completion
```

Do not invent a universal `turnId` merely because an event schema contains the field. Establish one active lifecycle authority first.

### Operation identity

One execution trajectory should preserve:

```text
sessionId
turnId                     once canonical
operationId
jobId
workspaceId
repository/revision
providerId
modelId
providerRequestId
runtimeToolCallId
providerToolCallId
receiptId
```

Provider IDs remain backend metadata. Brew runtime IDs remain durable across retry, approval, continuation, replay, and recovery.

### Provider runtime

Provider-neutral structure:

```text
registry
manager
authentication
model discovery
model selection
health/readiness
provider+model capability negotiation
normalized model events
provider adapters
```

Provider/model readiness must distinguish `configured -> authenticated -> reachable -> model discovered -> compatible -> ready`.

Capability state is `supported | unsupported | conditional | unknown` until stronger evidence exists.

### Normalized model events

Target semantic vocabulary includes:

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
model.turn.completed
model.turn.incomplete
model.turn.refused
model.error
```

Durable event correlation should be able to retain session/turn/operation/job/provider/model/provider-request/tool-call identities without making provider-native payload formats a client contract.

### Capability registry

Brew sees truthfully available capabilities rather than predefined intent categories.

Target families:

```text
workspace.*
git.*
terminal.*
browser.*
memory.*
project.*
provider.*
api.*
network.*
artifact.*
validation.*
integration.*
```

Dynamic tool creation remains part of the intended one-agent architecture and must eventually be proven through create -> validate -> register -> rediscover -> restart -> reuse.

### Professional workspace and Git

Workspace capability target:

```text
workspace.read
workspace.search
workspace.glob
workspace.inspect
workspace.diff
workspace.patch
workspace.symbols
workspace.definition
workspace.references
workspace.diagnostics
```

Git target:

```text
git.status
git.diff
git.log
git.show
git.branch
git.remote
git.blame
git.worktree.list
```

Local governed mutations may be structured capabilities; push/PR/release/publish/history rewrite remain separately classified consequential actions.

### Terminal/process runtime

Distinguish:

```text
terminal.exec

terminal.session.start/write/resize/interrupt/terminate

terminal.background.start/status/output/stop
```

with live `command.started`, stdout/stderr deltas, progress, completed/failed/cancelled events.

### Browser

Browser remains a governed capability family. Runtime owns connection/session/target identity, action execution, browser/profile authority, navigation safety, and evidence. The reasoning agent decides what browser action is useful.

### Memory/context

Separate personal memory, session memory, project/workspace context, cross-session retrieval, artifacts, and provider-context projection.

Canonical install/state target remains under `%USERPROFILE%\.Brew` with source/workspace, mutable state, secrets, reports, and archive separated. The current active state resolver remains implementation authority.

### Evidence/operation journal

Target trajectory:

```text
operation.started
capability.requested
authorization.decision
execution.started
execution.output
execution.receipt
validation.result
checkpoint
recovery.classification
operation.terminal
```

The runtime validates evidence identity/integrity and same-operation membership. It must not become a prose-intent/completion classifier.

### Validation/completion

`agent stopped != task complete`.

Target separation:

```text
execution evidence
-> trusted validation producers
-> validation records
-> completion predicate
-> final task state
```

Composition acceptance is separately required whenever multiple accepted components must cooperate through a real entry point.

### Recovery

Crash/restart target is durable session/operation/checkpoint reload, workspace/revision revalidation, side-effect classification, and exactly-once protection where required. Unknown execution state fails closed rather than replaying a consequential mutation blindly.

### User steering and control protocol

Distinguish new task, follow-up, active-turn steering, interrupt, cancel, approval response, runtime command, and direct user tool action.

First-party UI/CLI/Telegram/automation clients should eventually share one bidirectional agent-control contract for session, turn, provider/model, approvals, capabilities, events, and checkpoints. MCP remains an external capability protocol rather than Brew's entire first-party control plane.

## Logical source-organization target

This is **not** a folder-move mandate. It describes expected ownership domains:

```text
brew/
├── agent/                 reasoning-facing prompt/context/memory entry
├── runner/                canonical turn/continuation/evidence bridge
├── runtime/
│   ├── sessions/          Session/Turn/Item/checkpoints/lifecycle
│   ├── operations/        journal/idempotency/recovery/cancellation
│   ├── providers/         registry/capabilities/events/adapters
│   ├── capabilities/      registry/discovery/health/dynamic tools
│   ├── tools/             workspace/git/terminal/browser/network/integrations
│   ├── policy/            authorization/approvals/workspace/secrets
│   ├── events/            normalized model/execution/replay events
│   ├── server/            gateway/control API/routes
│   ├── state/             state resolver/persistence boundaries
│   └── channels/          telegram/api/automation adapters
├── capabilities/          source-defined built-in/agent-created capabilities
├── memory/
├── projects/
├── observability/
├── continuity/
└── server/                bounded compatibility ingress where still proven necessary
```

Extend/consolidate active ownership before creating a new authority. Do not refactor purely to make current folders visually match this target.

## Current evidence position

The corresponding Brew runtime-status record remains `project-engineering/projects/brew-runtime-status-2026-08-17.md`.

At this architecture checkpoint:

| Area | Evidence state |
| --- | --- |
| One reasoning-agent model | ACTIVE PROJECT CONTRACT |
| LM Studio provider selection through Brew | RUNTIME_PROVEN |
| `qwen/qwen3-vl-8b` selection through Brew | RUNTIME_PROVEN |
| Brew -> LM Studio connectivity | RUNTIME_PROVEN |
| Canonical provider-backed `/query` text response | RUNTIME_PROVEN for observed interaction |
| Provider/model/session attribution in model events | RUNTIME_PROVEN |
| Operation correlation in observed model events | RUNTIME_DISPROVEN |
| Exact operation-correlation loss boundary | NOT YET PROVEN |
| Proven correlation patch owner | NOT YET PROVEN |
| Durable canonical `turnId` semantics | UNVERIFIED |
| Live provider tool call -> host execution -> continuation | NOT YET PROVEN |
| Interactive/background terminal runtime | INCOMPLETE |
| Exactly-once crash/restart recovery | NOT YET PROVEN |
| Dynamic tool lifecycle E2E | NOT YET PROVEN |
| Browser E2E | NOT YET PROVEN |
| Telegram live delivery E2E | NOT YET PROVEN |
| Installed runtime acceptance | NOT YET PROVEN |
| Current-head full CI/release acceptance | NOT YET PROVEN |

## Planned implementation sequence

```text
P0   prove exact operation-correlation loss boundary
P1   repair and runtime-prove operation correlation
P2   establish one canonical Session / Turn / Item lifecycle
P3   finish provider/model capability negotiation and active consumption
P4   prove one real provider-native tool-call turn
P5   prove governed host tool execution
P6   prove tool-result -> provider continuation
P7   prove full operation event/evidence trajectory
P8   prove cancellation + error attribution
P9   prove crash/restart/resume + exactly-once behavior
P10  establish typed professional workspace + Git capabilities
P11  establish PTY/background processes + live output events
P12  prove active user steering / interrupt / cancel
P13  prove dynamic tool create/register/restart/reuse lifecycle
P14  prove browser real E2E
P15  prove Telegram real E2E
P16  establish bidirectional agent-control API
P17  prove persistent session replay/resume/fork
P18  build high-fidelity CLI/TUI client over the runtime
P19  prove UI composition acceptance
P20  prove installed-runtime acceptance
P21  prove full CI / release acceptance
P22  remove/reconcile remaining legacy and duplicate authorities
```

Phase labels are planning notation, not evidence. Advance only after the active gate has claim-matched source/composition/runtime proof.

## Universal phase gate

Every slice should close through:

```text
SOURCE       active owner confirmed
CONTRACT     behavior/failure contract defined
FOCUSED      bounded regression/contract proof
COMPOSITION  real producers and consumers connect
RUNTIME      actual active behavior observed when required
REGRESSION   neighboring behavior remains valid
GITHUB       exact validated revision + limitations recorded
```

Never infer a higher validation layer from a lower one.

## Immediate engineering boundary

The next action remains investigation rather than architectural refactoring:

```text
prove where operationId is first lost
-> identify earliest wrong active state
-> inspect that producer/consumer boundary
-> patch only the proven owner
-> rerun canonical LM Studio /query
-> prove expected operation correlation in model lifecycle events
-> record source + runtime + regression evidence
-> only then advance to live provider tool-call acceptance
```

## Final target definition

> Brew is one persistent, provider-neutral reasoning agent operating over a durable professional runtime. The model chooses what to do; the runtime exposes truthful capabilities, preserves sessions and operations, governs side effects, executes tools, streams real events, records evidence, survives interruption/restart, and projects the same agent through UI, CLI, Telegram, IDE, browser, automation, and external-agent integrations.

## Update rule

Update this record only when the target architecture, phase dependency order, or major ownership boundary changes. Current branch/head/runtime evidence belongs in the Brew project and the dedicated Brew runtime-status record, not in this architecture reference.