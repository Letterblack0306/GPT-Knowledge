# Professional Agent Runtime, CLI, and Provider Architecture

## Knowledge metadata

- Last reviewed: 2026-08-12
- Scope: provider-neutral professional coding/audit/debug agents, runtime tool access, CLI/TUI interaction, persistent sessions, external-agent integration
- Canonical use: load with `ai-agents/unified-agent-engineering-methods.md` when designing or auditing an interactive agent runtime or professional CLI
- Evidence basis: current OpenAI Codex, Gemini CLI, Cline, Claude Code/agent references, provider API behavior, real agent runtime/tool traces, and validated persistent-runtime work
- Confidence: high for the architectural principles; provider/API implementation details must be revalidated against current primary sources before implementation

## Core conclusion

A professional agent CLI is not a prompt wrapped around a shell, and it is not primarily a dashboard.

The product must be built in this dependency order:

```text
provider-native model behavior
  -> provider-specific adapter
  -> normalized model-event semantics
  -> persistent Session / Turn / Item runtime
  -> capability negotiation
  -> deterministic authorization/governance
  -> governed professional tools
  -> live tool/runtime events
  -> provider continuation
  -> evidence / validation / completion
  -> client/control protocols
  -> CLI/TUI / GUI / IDE / automation / external agents
```

Do not design the visible CLI first and then invent backend states to support it.

---

## 1. Provider transport compatibility is not agent capability compatibility

Provider support must be reasoned about at:

```text
provider + endpoint + selected model
```

not provider name alone.

Different providers expose materially different agent grammars, including:

- text/message streaming;
- reasoning/thinking summaries;
- client-side tool calls;
- server-side tools;
- parallel tool calls;
- partial/streamed tool arguments;
- structured-output guarantees;
- stateful conversation/interaction IDs;
- cancellation semantics;
- usage/accounting events;
- MCP/server-tool semantics;
- provider-specific stop/incomplete/refusal states.

An OpenAI-compatible HTTP endpoint does not prove that the selected model reliably supports tools, parallel calls, reasoning, or streaming.

Use capability negotiation such as:

```text
ProviderModelCapabilities
  protocol_family
  streaming_text
  streaming_reasoning_summary
  reasoning_visibility
  client_tool_calls
  server_tool_calls
  parallel_tool_calls
  streamed_tool_arguments
  strict_tool_schema
  tool_choice_modes
  structured_output
  native_mcp
  server_side_state
  context_window
  max_output
  image_input
  file_input
  cache_controls
  usage_reporting
  cancellation
  provider_request_id
  retryable_error_signals
```

Each capability may be:

```text
supported | unsupported | unknown | conditional
```

A capability description never grants workspace authority.

---

## 2. Normalize semantics, not provider wire formats

Do not expose provider-native wire objects directly to every client.

Provider adapters should emit a normalized LBE/runtime-style event vocabulary while preserving provider-native diagnostic metadata.

Example normalized model events:

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

Preserve diagnostic fields such as:

```text
provider_id
model_id
provider_request_id
provider_event_type
provider_stop_reason
raw_diagnostic_ref
```

Do not manufacture streaming or tool semantics that the provider did not actually supply.

---

## 3. The runtime owns authority; the model owns reasoning

Canonical boundary:

```text
provider proposes/reasons
        ↓
runtime capability resolver
        ↓
deterministic authorization
        ↓
governed tool dispatcher
        ↓
real tool/workspace result
        ↓
evidence + validation
        ↓
provider continuation
```

The model must not receive unrestricted filesystem, shell, Git, browser, or external-service authority merely because it can call tools.

The runtime owns:

- workspace/project identity;
- session/task persistence;
- modes and permission profile;
- capability availability;
- tool execution authority;
- evidence provenance;
- validation truth;
- completion truth;
- checkpoints/resume state.

Provider switching must not implicitly change those authorities.

---

## 4. Professional tools are typed capability families

A useful professional agent needs more than `read`, `write`, and `run command`.

### Workspace/code

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

Semantic capabilities may come from LSP, IDE bridges, parsers, or project tooling. If only textual search exists, report textual search; do not claim semantic references.

### Terminal/process

Distinguish at least:

```text
terminal.exec
```

for bounded non-interactive execution,

```text
terminal.session.start
terminal.session.write
terminal.session.resize
terminal.session.interrupt
terminal.session.terminate
```

for PTY/ConPTY interactive execution, and

```text
terminal.background.start
terminal.background.status
terminal.background.output
terminal.background.stop
```

for long-lived dev servers/watchers/builds.

Professional clients should receive live events:

```text
command.started
command.stdout.delta
command.stderr.delta
command.progress
command.completed | command.failed | command.cancelled
```

The runtime must know shell/environment identity rather than expecting the model to infer PowerShell, cmd, POSIX shell, WSL, container, or remote semantics from path strings.

### Git

Prefer structured high-value capabilities for common operations:

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

Governed mutations may include staging, commits, branch/worktree creation, while push/PR/release/publish remain separately classified external mutations.

Worktree isolation is a strong default for parallel professional agent sessions.

---

## 5. Session / Turn / Item is the reusable interaction substrate

A session is not merely chat history.

It should retain enough state to reconstruct a real working agent:

```text
workspace/repository identity
provider/model + capabilities
mode/permissions
turn history
item/event history
active terminal/background processes
changed-file/Git state
approvals/authorization state
evidence/validation/completion state
context/compaction state
checkpoints
```

Useful lifecycle operations include:

```text
session.create
session.resume
session.fork
session.archive
session.export
session.checkpoint
```

Every tool call needs a durable runtime call ID independent of provider call IDs so that replay, reconnect, approval waits, output streaming, cancellation, restart, and evidence packaging can refer to the same operation.

---

## 6. User-facing CLI/TUI is a live agent runtime surface

The primary surface should project the actual ordered runtime interaction:

```text
user input
agent commentary
active tool invocation
live tool/process output
result/error
agent reaction
edit/diff
validation
final response
```

Do not make the primary experience a telemetry/status dashboard such as:

```text
Step 1 complete
Step 2 working
Provider healthy
Validation 43%
```

Runtime/provider/workspace state can appear as compact chrome or secondary views.

Professional secondary views may include:

```text
/diff
/git
/validation
/processes
/tools
/provider
/context
/evidence
/checkpoints
/mcp
/logs
```

Tool cells are mutable first-class runtime objects: start, receive output/progress, succeed/fail/cancel, then become durable replay records.

---

## 7. The user remains part of the live control loop

The user is not only the producer of the initial prompt.

The runtime should distinguish:

```text
new task
follow-up
active-turn steering
interrupt
cancel
approval response
runtime command
direct user tool action
```

A running turn should remain steerable where safe. New guidance can be applied immediately, queued after the current atomic tool action, or require interruption.

Interrupt and cancel are not equivalent:

- interrupt preserves a continuable task/session;
- cancel terminates the current turn.

Runtime commands such as provider/mode/tools/permissions/checkpoint/compact/cancel must bypass model interpretation when they target deterministic runtime owners.

Every action should preserve provenance such as:

```text
user | agent | runtime | validation | recovery
```

Model-chat `role` fields alone are not sufficient provenance; some provider protocols encode tool results as user-role content.

---

## 8. External agents need cooperative and strict attachment modes

There are two fundamentally different integrations.

### Cooperative attachment

```text
external coding agent
  ├─ native external-agent tools
  └─ LBE/MCP capabilities
```

LBE governs only operations routed through LBE. Do not claim that the entire external agent is governed when it can mutate through native shell/filesystem/browser paths outside LBE.

### Strict attachment

For a stronger governance claim, overlapping external mutation capabilities must be disabled, restricted, sandboxed, or routed through LBE.

Canonical truth:

> LBE can only govern execution paths it owns or independently verifies.

---

## 9. MCP and the agent-control protocol solve different problems

MCP is appropriate for exposing capabilities to other agents.

A rich first-party CLI/TUI/GUI/IDE client also needs a bidirectional control protocol for:

- initialization;
- session create/resume/fork;
- turn start/steer/interrupt/cancel;
- approvals;
- provider/model selection;
- permission/capability state;
- event subscription/replay;
- asynchronous runtime notifications.

The first transport may be stdio with typed/versioned JSONL or JSON-RPC-like framing, but the semantic contract matters more than the transport syntax.

Recommended architecture:

```text
                    professional agent runtime
                              │
             ┌────────────────┼────────────────┐
             │                │                │
     agent-control API      MCP server      IDE bridge
             │                │                │
       TUI/GUI/SDK       external agents   editor-native state
```

All surfaces share one session, capability, permission, tool, evidence, validation, and completion authority.

---

## 10. Broad indexing and narrow authority are compatible

A broad workspace/repository index is useful for open-ended diagnostics:

```text
Why did this agent fail?
Where does this error originate?
Which code path owns this behavior?
```

Do not replace broad indexing with rule-only indexing.

Instead define explicit retrieval modes over one evidence store:

### Diagnostic

Broad semantic/code-pattern discovery when the cause/file/rule is unknown.

### Guard

Exact project identity + rule-declared paths/metadata/evidence requirements. Structural guards should prefer exact deterministic inspection over natural-language semantic retrieval.

### Investigation

Starts from a failure, guard, error, operation, or evidence reference and expands only as necessary.

Keep typed fields separate:

```text
query
reason
rule_id
workspace_id
path_patterns
extensions
retrieval_mode
```

Do not prepend reasoning, plans, or rule explanations to the actual evidence query.

A configured filesystem root is not automatically a project identity. Sibling projects under one root must remain isolated for authoritative guard/workspace conclusions.

Current workspace evidence and live validation outrank indexed/reference memory.

---

## 11. Raw provider/runtime logs and user-facing event streams are different products

Raw logs may preserve provider message roles, private wire formats, token accounting, model IDs, call IDs, and transport diagnostics.

The user-facing/control event stream should normalize them into stable semantic records such as:

```text
human_message
agent_message
tool_call
tool_output
tool_result
tool_error
user_steering
approval
validation
completion
```

Use raw traces for debugging and provenance. Do not make every client understand every provider's native log serialization.

When available, runtime traces are stronger evidence of what the agent actually did than its own final narrative.

---

## 12. Professional product acceptance bar

Do not call an agent runtime professional merely because it can generate a patch and run a command.

The system should progressively prove:

- truthful per-model capability negotiation;
- provider-native streaming/tool continuation;
- persistent Session/Turn/Item state;
- strong workspace/repository identity;
- typed workspace/Git/terminal capabilities;
- live command/tool output;
- active user steering;
- approval/authority continuity;
- replay/resume/fork;
- evidence-bound validation and completion;
- external-agent integration truthfulness;
- worktree/process isolation where concurrent work exists;
- one runtime usable through terminal, IDE, automation, and external-agent clients.

Anti-pattern:

```text
API key + prompt + run command + pretty terminal
```

Target:

> A persistent professional agent runtime whose CLI is a high-fidelity client over real provider events, governed developer tools, repository state, execution state, validation, and durable session history.

---

## 13. Implementation order

Use this order unless live project evidence proves a different dependency:

```text
P0 provider event normalization contract
P1 professional runtime capability contract
P2 provider/model capability negotiation and probes
P3 provider-native streaming/tool-call adapters
P4 normalized Session / Turn / Item persistence
P5 professional workspace/Git/terminal capability foundation
P6 live tool/process execution events
P7 governed provider continuation loop
P8 bidirectional agent-control protocol
P9 replay/resume/fork proof
P10 MCP external-agent surface
P11 transcript projection
P12 professional interactive CLI/TUI
P13 IDE/browser/strict external-agent acceptance as needed
```

Do not start with terminal styling.

Do not discard a previously proven bounded provider/reasoning path merely because the richer interactive path is now needed. Evolve through a separate accepted contract and migration boundary.

## Final rule

**Build the professional agent runtime first; render it second. Normalize provider semantics without erasing provider differences. Expose real capabilities without granting model authority. Keep the user in the live loop. Treat external integrations honestly. Prove professional behavior from runtime evidence, not from a polished CLI.**
