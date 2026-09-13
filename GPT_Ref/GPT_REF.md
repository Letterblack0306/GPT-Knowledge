# GPT Reference — Agent Repository Catalogue

> Canonical first-stop catalogue of **real agent repositories and reusable implementation references** for GPT-Knowledge consumers, BirdEye MCP, Brew, Codex, Cline, and other local agents.

This file is intentionally **not** a general GPT-K document index and is not a place for arbitrary project documents.

Its job is simple:

1. identify the strongest real upstream repository for an agent-engineering concern;
2. provide the direct GitHub link;
3. state what that repository is useful for;
4. state what should be adapted rather than recreated;
5. route deeper study to the relevant GPT-K analysis only when needed.

Current target-repository/runtime evidence always outranks this catalogue.

---

## Core agent references

| Repository | Direct GitHub | Best reference for | Use when | Brew / local-agent takeaway |
| --- | --- | --- | --- | --- |
| **OpenAI Codex** | https://github.com/openai/codex | Agent execution runtime, typed lifecycle/events, approvals, sandboxing, tool execution, validation, cancellation | Designing Session/Turn/Item lifecycle, execution authority, approvals, sandbox policy, action/result events, recovery | Adapt the separation between model messages, runtime state, tool execution, approvals, and completion evidence. Do not turn runtime status into assistant prose. |
| **Cline** | https://github.com/cline/cline | Provider/model adapters, model-turn handling, tool-use loop, empty-response semantics, IDE agent execution | Provider integration, model output normalization, tool-call-only turns, retry/failure semantics, model capability handling | Reuse the invariant that genuinely empty model output without tool activity is not successful assistant output. Keep provider semantics centralized. |
| **Hermes Agent** | https://github.com/NousResearch/hermes-agent | Persistent agent loop, messaging gateways, memory, skills, toolsets, MCP, channel continuity | Telegram/Discord/Slack-style channels, skills loading, memory integration, persistent agent behavior, gateway design | One agent core across channels; channels are adapters at the edge. Use progressive skill/tool loading instead of prompt bloat. Do not copy subagent authority if the target architecture is single-agent. |
| **OpenHands** | https://github.com/OpenHands/OpenHands | Autonomous software-engineering runtime, event loop, actions/observations, workspaces, lifecycle state | Agent runtime architecture, action/observation flow, workspace isolation, autonomous SWE tasks, recovery | Adapt explicit action/observation and runtime-state patterns. Keep blocked/waiting/failed/completed states separate from conversational text. |
| **Aider** | https://github.com/Aider-AI/aider | Repository cognition, repo maps, Git-aware editing, selective context expansion | Large-repo navigation, codebase awareness, editing scope, Git/diff workflows, context budgeting | Learn how to understand a repository without loading it all. Keep mapped/known/inspected/editable/changed states distinct. |
| **LobeHub** | https://github.com/lobehub/lobehub | Provider/model registry, model metadata, configuration, knowledge, MCP/integrations | Provider catalogs, model capabilities, integration registries, knowledge sources, readiness/configuration surfaces | Separate configured state from usable/readiness state. Keep provider/model metadata and runtime health explicit. |
| **OpenClaw** | https://github.com/openclaw/openclaw | Gateway/control-plane separation, multi-surface agent access, session continuity | CLI/UI/messaging/control-plane comparisons, transport boundaries, local gateway architecture | Agent/session identity should survive interface changes. UI, CLI, browser, and messaging are clients/transports, not separate reasoning agents. |
| **Agent Zero** | https://github.com/agent0ai/agent-zero | General-purpose agent runtime patterns, tools, extensibility, local agent experimentation | Comparing broader agent-runtime design options, extensible tools, agent environment patterns | Use as a comparative reference, not as a target architecture. Check authority/lifecycle fit before adopting anything. |
| **Gemini CLI** | https://github.com/google-gemini/gemini-cli | CLI agent UX, tool execution, provider-native Gemini behavior, command/session patterns | Gemini-specific CLI/runtime behavior, tool calls, terminal UX, command handling | Useful for Gemini-native behavior and CLI interaction patterns. Do not infer provider-neutral contracts from Gemini-specific implementation alone. |

---

## Fast routing by engineering question

| Question / subsystem | Primary reference | Secondary reference | What to inspect |
| --- | --- | --- | --- |
| Repository awareness / repo map | **Aider** | OpenHands | Repo mapping, selective reads, context budgeting, edit scope |
| Git-aware code editing | **Aider** | Codex | Diffs, edit application, repository state, validation after edits |
| Shell / filesystem execution | **Codex** | OpenHands | Typed execution, sandbox/workspace boundary, observation/result handling |
| Approval / permission lifecycle | **Codex** | OpenHands | Proposal → approval → execution separation |
| Runtime lifecycle / event protocol | **Codex** | OpenHands | Session/turn/item or event identity, model vs runtime events |
| Provider/model abstraction | **Cline** | LobeHub | Provider adapters, model capabilities, normalized response contract |
| Empty model response handling | **Cline** | Codex | Empty response vs tool-only turn, retry/failure behavior |
| Provider/model catalogue | **LobeHub** | Cline | Provider registration, model metadata, readiness, custom endpoints |
| Messaging gateway / Telegram / Slack | **Hermes** | OpenClaw | Channel adapter boundary, same agent core across surfaces |
| CLI/UI/API as one agent | **OpenClaw** | Hermes / Codex | Control plane vs clients, session identity across interfaces |
| Skills / procedural knowledge | **Hermes** | Codex / OpenHands | Progressive disclosure, skill selection, loading only when needed |
| Persistent memory | **Hermes** | OpenHands | Bounded memory, retrieval, persistence, provenance |
| MCP / external integrations | **LobeHub** | Hermes | Integration registry, independent health, provider/tool separation |
| Autonomous SWE loop | **OpenHands** | Codex | History → model → action → execution → observation → continue/finish |
| Workspace abstraction / remote runtime | **OpenHands** | Codex | Workspace identity, environment boundary, execution transport |
| Gemini-native CLI behavior | **Gemini CLI** | Cline | Gemini-specific provider/tool/command implementation |
| Broad alternative agent patterns | **Agent Zero** | OpenHands / Hermes | Compare only after target ownership and lifecycle are defined |

---

## Reference selection rules

### Use upstreams to challenge a design, not to create a second architecture

Before adapting anything from a reference repository, establish in the target system:

- current owner;
- lifecycle;
- authority boundary;
- persistence boundary;
- failure state;
- evidence/validation contract;
- user-visible behavior;
- active reachability.

Then inspect the upstream implementation that best matches the proven gap.

### Do not copy whole frameworks when a narrow pattern is sufficient

Examples:

- Need Telegram/channel convergence → study **Hermes/OpenClaw** gateway boundaries; do not import a second agent runtime.
- Need truthful empty-response handling → study **Cline**; do not create a new provider subsystem.
- Need Session/Turn/Item separation → study **Codex/OpenHands**; do not invent duplicate session authority.
- Need provider/model catalogue → study **LobeHub**; do not create another registry if one already exists.
- Need repository cognition → study **Aider**; do not preload the whole repository into context.

---

## Critical architecture separations

These rules are repeatedly supported across the reference projects and should be preserved in target systems:

1. **Channels are not agents.** CLI, UI, Telegram, browser, API, and IDE surfaces should converge on one reasoning/session runtime.
2. **Memory is not evidence.** Historical context helps retrieval; current source/runtime evidence establishes present truth.
3. **Skills are not tools.** Skills describe procedures; tools perform actions under their own authority.
4. **Provider configuration is not provider readiness.** Saved settings do not prove connectivity or capability.
5. **Model intent is not execution.** Proposed action, tool call, approval, execution, and validation are separate states.
6. **Loop termination is not completion.** Blocked, waiting, failed, and complete must be distinguishable.
7. **Runtime state is not assistant prose.** Errors, approvals, tool results, and lifecycle events should remain typed runtime information.
8. **Repository knowledge is not file authority.** Known/mapped/inspected/editable/changed/validated states should remain distinct.

---

## Brew-specific reference map

For Brew or another single-reasoning-agent runtime:

```text
repository cognition      -> Aider
execution / sandbox       -> Codex
provider/model semantics  -> Cline
channels / skills / memory-> Hermes
provider/catalog/MCP      -> LobeHub
autonomous SWE runtime    -> OpenHands
control-plane separation  -> OpenClaw
Gemini-native behavior    -> Gemini CLI
comparative alternatives  -> Agent Zero
```

The desired synthesis is **not** to combine all of these frameworks. It is to take the smallest proven pattern needed by the existing owner in the target system.

---

## GPT-K deeper studies

Use these only after this catalogue selects the relevant subsystem/reference family:

- `ai-agents/cli-agent-reference-study-map.md`
- `ai-agents/reference-derived-agent-architecture.md`
- `ai-agents/professional-agent-runtime-cli-and-provider-architecture.md`
- `ai-agents/agent-reasoning-transport-boundary.md`
- `ai-agents/studies/aider-repository-cognition.md`
- `ai-agents/studies/codex-execution-validation.md`
- `ai-agents/studies/hermes-memory-skills-agent-loop.md`
- `ai-agents/studies/lobehub-provider-integration-architecture.md`
- `ai-agents/studies/openhands-autonomous-swe-runtime.md`
- `ai-agents/studies/lbe-completion-contract-and-validation-evidence-study.md`

GPT-K studies summarize and compare. **The real upstream repository remains the implementation reference and should be rechecked before copying current details.**

---

## BirdEye retrieval contract

BirdEye should expose this file as the first compact reference catalogue for agent-engineering questions.

Recommended flow:

```text
agent question
  -> BirdEye query GPT_Ref/GPT_REF.md
  -> select relevant upstream repository
  -> fetch only relevant GPT-K study if needed
  -> inspect real upstream source when implementation detail is required
  -> compare against current target workspace/runtime evidence
  -> adapt the smallest proven pattern
```

Do **not** use `GPT_Ref/GPT_REF.md` as a generic project-document index. Project status, Brew reports, memory, plans, and arbitrary documents belong in their own namespaces and should be retrieved separately.

---

## Maintenance rule

Add a repository here only when it provides a durable, useful implementation reference for agent engineering.

For each entry keep:

- canonical GitHub repository URL;
- strongest subsystem(s) it demonstrates;
- when to use it;
- what pattern is safe to adapt;
- important conflict/limitation when relevant.

Remove or replace stale repository links when projects move or become obsolete. Re-verify upstream source before implementation work because repository internals change over time.
