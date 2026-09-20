# Exact Agent Feature → Upstream Implementation Reference Chain

## Knowledge metadata

- Last verified: 2026-09-20
- Purpose: make agent-feature reference selection deterministic enough that an implementation agent cannot silently route a feature to the wrong upstream repository, package, file, or owner symbol.
- Authority: this document is reference-selection evidence only. Current target repository/runtime evidence remains authoritative for target ownership and implementation status.
- Verification method: upstream repositories were opened directly and current default branches, repository structure, implementation paths, and owner symbols were inspected. GPT-K summaries were not treated as implementation truth.
- Rule: use the **primary exact owner** first. A secondary reference is only a cross-check and must not replace the primary owner without a new direct-source review.

## Verified upstream snapshots

| Reference | Branch | Verified head | Role in this chain |
|---|---|---|---|
| OpenAI Codex | `main` | `5c5308fc9a9ee789049d646ef11e5400384b9c6f` | typed session/turn/item lifecycle, approval protocol |
| Cline | `main` | `9a2512bb9835869d74774da99708a7f9d80b0fe8` | provider normalization, agent runtime, team/session host |
| Hermes Agent | `main` | `3dae1f7335371ca4b015cdf5336db41868485153` | persistent turn loop, gateway/channel continuity, memory |
| OpenHands Agent Canvas | `main` | `a07364828c8f202e7745c6bce3dcef3915ae7ac1` | control-center/frontend only; **not** canonical runtime owner |
| OpenHands software-agent-sdk | `main` | `bd5fff06c2fe79d6e0e5d192bbf22339482f2805` | canonical OpenHands agent/tool/conversation/workspace implementation |
| Aider | `main` | `5dc9490bb35f9729ef2c95d00a19ccd30c26339c` | repo map, Git-aware scope, deterministic edit application |
| LobeHub | `canary` | `6503fb8c48b0f6b27ec9a5b1db35bb032cc0fd68` | provider/model catalogue and runtime mapping, tool discovery |
| OpenClaw | `main` | `f983013cce605a233a3934cef3719d83e41cccf5` | gateway/control plane, cross-surface session identity, terminal receipts |
| Agent Zero | `main` | `b1cbd1f960a1a5c4482b324dcff4742aa67b7a51` | project-scoped extensibility, skills, subordinate-agent comparison |
| Gemini CLI | `main` | `cfbcaa8df13ea4610bb379b377b56d62980c0032` | browser agent, centralized scheduler/policy/confirmation, local-agent executor |
| DeepSeek Harness | `master` | `ddefc45fbc7f8e46dd73185e68295696d1297887` | explicit harness seams, agent loop, ordered tool scheduling, browser/computer capability registration, subagent lifecycle |

## Canonical feature chains

| Feature / engineering question | PRIMARY exact implementation owner | Exact owner symbol(s) | What this proves | Secondary cross-check only |
|---|---|---|---|---|
| **Agent turn / ReAct loop state machine** | `deepseek-ai/deepseek-harness/packages/core/agent-loop/src/agent.ts` | `ReactLoopAgent`, `Phase`, `cancel()`, `status` | A session-bound driver can make idle/maintenance/running phases, inbox wakeup, cancellation, session log and step boundaries explicit. | Hermes `agent/conversation_loop.py::run_conversation`; Cline `sdk/packages/agents/src/agent-runtime.ts` |
| **Typed session → turn → item lifecycle** | `openai/codex/codex-rs/core/src/session/session.rs` + `codex-rs/protocol/src/items.rs` | `Session`, `TurnItem`, `AgentMessageItem`, `CommandExecutionItem`, `McpToolCallItem` | Runtime/session state and model-authored content are separate typed entities; tool calls, reasoning, commands and messages are not collapsed into prose. | OpenHands conversation/event model |
| **Central tool execution scheduler/status machine** | `google-gemini/gemini-cli/packages/core/src/scheduler/scheduler.ts` | `Scheduler`, `SchedulerStateManager`, `CoreToolCallStatus`, `ToolExecutor` | Validation, policy, confirmation, execution, cancellation and final tool-call status can be coordinated in one runtime owner. | DeepSeek `executeToolCalls` |
| **Parallel/exclusive tool scheduling with model-order results** | `deepseek-ai/deepseek-harness/packages/core/agent-loop/src/tool-calls.ts` | `executeToolCalls()`, `PlannedCall`, `Slot`, `GroupOutcome` | Parallel dispatch can coexist with deterministic model-order result commitment; abort handling can record skipped calls without faking successful results. | Gemini Scheduler |
| **Approval request protocol / typed approval identity** | `openai/codex/codex-rs/protocol/src/approvals.rs` | `ExecApprovalRequestEvent`, `GuardianAssessmentEvent`, `ExecApprovalKind`, `NetworkApprovalContext` | Approval is a first-class runtime event tied to call/turn/item identity, not a text prompt pretending to be execution state. | Gemini confirmation |
| **Policy decision before execution** | `google-gemini/gemini-cli/packages/core/src/scheduler/policy.ts` | `checkPolicy()`, `getPolicyDenialError()`, `PolicyDecision` | ALLOW / ASK_USER / denial decisions can be centralized before tool dispatch and can fail closed in non-interactive contexts. | Codex approval protocol |
| **Interactive confirmation lifecycle** | `google-gemini/gemini-cli/packages/core/src/scheduler/confirmation.ts` | `resolveConfirmation()`, `awaitConfirmation()`, `ConfirmationResult`, `ResolutionResult` | Confirmation wait, cancellation, correlation identity, modified input and final confirmation outcome are separate from tool execution. | Codex approvals |
| **Browser-specialized agent definition** | `google-gemini/gemini-cli/packages/core/src/agents/browser/browserAgentDefinition.ts` | `BROWSER_AGENT_NAME`, `BrowserAgentDefinition()`, `BrowserTaskResultSchema`, `buildBrowserSystemPrompt()` | A browser agent is a specialized agent loop with a defined task/result contract, not merely a browser tool attached to generic chat. | DeepSeek browser-use capability seam |
| **Browser runtime construction / dynamic tool discovery** | `google-gemini/gemini-cli/packages/core/src/agents/browser/browserAgentFactory.ts` | `createBrowserAgentDefinition()` | Browser tools can be discovered at invocation time, attached to a browser-specific registry, and kept out of the main agent registry. | DeepSeek capability registry |
| **Browser invocation lifecycle / cleanup / activity projection** | `google-gemini/gemini-cli/packages/core/src/agents/browser/browserAgentInvocation.ts` | `BrowserAgentInvocation.execute()` | Browser connection setup, isolated tool wrapping, agent execution, progress projection and cleanup can be one explicit invocation lifecycle. | OpenClaw browser/gateway integration |
| **Browser process/session/CDP ownership** | `google-gemini/gemini-cli/packages/core/src/agents/browser/browserManager.ts` | `BrowserManager`, `BrowserManager.getInstance()`, `DomainNotAllowedError` | Browser session modes (`persistent`, `isolated`, `existing`), profile identity, parallel limits, CDP/MCP connection and domain policy have one owner. | DeepSeek `BrowserUseRegistry` / `ComputerUseRegistry` |
| **Browser MCP tool isolation** | `google-gemini/gemini-cli/packages/core/src/agents/browser/mcpToolWrapper.ts` | `McpToolInvocation`, `createMcpDeclarativeTools()` | Browser MCP tools can remain browser-agent-local, support confirmation, block uploads, and dispatch through one BrowserManager without contaminating the parent registry. | LobeHub execution-target/tool engine |
| **Browser capability provider seam** | `deepseek-ai/deepseek-harness/packages/browser-use/browser-use/src/index.ts` | `BrowserUseRegistry.register()` | Browser-use capability can have one explicit provider registration owner with deterministic registration/release semantics. | Gemini BrowserManager |
| **Computer-use capability provider seam** | `deepseek-ai/deepseek-harness/packages/computer-use/computer-use/src/index.ts` | `ComputerUseRegistry.register()` | Computer-use and browser-use can remain separate capabilities even when surfaced through one agent product. | Gemini browser agent |
| **Cross-surface run owner identity** | `openclaw/openclaw/src/gateway/chat-run-owner.ts` | `resolveChatRunOwnerAgentId()`, `chatRunBelongsToAgent()` | A run belongs to a stable agent/session owner independent of whichever UI/channel is observing it. | Hermes gateway session source |
| **Inbound channel → session envelope** | `openclaw/openclaw/src/channels/session-envelope.ts` | `resolveInboundSessionEnvelopeContext()` | Channel ingress resolves into an existing session store/session key instead of creating interface-local reasoning state. | Hermes `gateway/session.py::SessionSource` |
| **Session lifecycle / identity mutations** | `openclaw/openclaw/src/sessions/session-lifecycle-events.ts` | `SessionLifecycleEvent`, `SessionIdentityMutation`, `emitSessionLifecycleEvent()` | Session identity changes and lifecycle notifications are explicit events, independently observable by clients. | Codex session events |
| **Messaging gateway source and channel continuity** | `NousResearch/hermes-agent/gateway/session.py` | `SessionSource`, `SessionContext` | Platform/chat/thread/profile origin can be recorded as session routing metadata while preserving one core session. | OpenClaw channel/session envelope |
| **Gateway executes the same agent turn across channels** | `NousResearch/hermes-agent/gateway/run_turn.py` | gateway turn runner path beginning at agent-turn execution | Transport/platform adapters can feed the same agent turn runtime while keeping machinery display events and channel delivery separate. | OpenClaw gateway |
| **Provider adapter registry / provider-neutral handler creation** | `cline/cline/sdk/packages/llms/src/providers.ts` | `ProviderConfig`, `createHandler()`, `normalizeProviderId()`, factory registry exports | Provider-specific behavior can be centralized behind one handler contract instead of scattered through UI/runtime code. | LobeHub runtime map |
| **Provider-neutral tool-call/result wire shape** | `cline/cline/sdk/packages/shared/src/llms/messages.ts` | `ToolUseContent`, `ToolResultContent`, `ThinkingContent`, `Message` | Tool calls/results and provider-specific reasoning metadata can be normalized before the host/runtime consumes them. | OpenHands Action/Observation |
| **Agent runtime around normalized providers** | `cline/cline/sdk/packages/agents/src/agent-runtime.ts` | agent runtime types and runtime loop in `agent-runtime.ts` | Retry, model/tool events, completion policy, provider errors and runtime hooks can live above provider handlers. | Gemini LocalAgentExecutor |
| **Host/session owns runtime construction** | `cline/cline/sdk/packages/core/src/runtime/config/agent-runtime-config-builder.ts` | `CreateAgentRuntimeConfigInput`, `createAgentRuntimeConfig()` | Session ID, agent ID, conversation ID, model adapter, tools, plugins, hooks, initial messages and completion policy are resolved by the host/session owner before the stateless agent loop runs. | Codex Session |
| **Provider/model catalogue metadata** | `lobehub/lobehub/packages/model-bank/src/modelProviders/index.ts` | provider card registry assembled from concrete provider modules | Provider catalogue and model metadata can be maintained separately from runtime execution adapters. | Cline provider registry |
| **Provider runtime adapter mapping** | `lobehub/lobehub/packages/model-runtime/src/runtimeMap.ts` | runtime map of provider ID → provider runtime implementation | A provider being listed/configured is distinct from the runtime implementation that can actually execute it. | Cline `createHandler()` |
| **Tool discovery and execution-target resolution** | `lobehub/lobehub/apps/server/src/services/aiAgent/pipeline/toolDiscovery.ts` | `resolveExecutionPlan`, `resolveToolMode`, server tool-discovery pipeline | Tool availability can depend on model capability, connector permissions and execution target/device facts, rather than registration alone. | Gemini scheduler/tool registry |
| **Server-side tool registry construction** | `lobehub/lobehub/apps/server/src/modules/Mecha/AgentToolsEngine/index.ts` | `createServerToolsEngine()`, `createServerAgentToolsEngine()` | Built-ins/plugins/manifests can be assembled under model capability checks and device walls. | Gemini browser isolated registry |
| **Action / observation contract** | `OpenHands/software-agent-sdk/openhands-sdk/openhands/sdk/tool/schema.py` | `Action`, `Observation`, `Schema` | Proposed/executed action inputs and resulting observations/errors are separate typed objects and can translate to MCP schemas. | Codex TurnItem |
| **Conversation lifecycle states** | `OpenHands/software-agent-sdk/openhands-sdk/openhands/sdk/conversation/state.py` | `ConversationExecutionStatus`, `ConversationState` | `IDLE`, `RUNNING`, `PAUSED`, `WAITING_FOR_CONFIRMATION`, `FINISHED`, `ERROR`, `STUCK`, `DELETING` are distinct runtime states; idle is explicitly not terminal. | DeepSeek ReactLoopAgent phase |
| **Workspace abstraction / workspace is not process cwd** | `OpenHands/software-agent-sdk/openhands-sdk/openhands/sdk/workspace/base.py` + `conversation/state.py` | `BaseWorkspace`, `ConversationState.workspace` | Command/file/Git operations belong to an explicit workspace object; conversation state explicitly says workspace is not the process working directory. | Cline workspace services |
| **Local workspace implementation** | `OpenHands/software-agent-sdk/openhands-sdk/openhands/sdk/workspace/local.py` | `LocalWorkspace.execute_command()`, file transfer methods | A local execution adapter can implement the workspace contract while preserving the higher-level conversation/workspace boundary. | Codex sandbox/workspace |
| **Security risk → confirmation policy** | `OpenHands/software-agent-sdk/openhands-sdk/openhands/sdk/security/confirmation_policy.py` | `ConfirmationPolicyBase`, `AlwaysConfirm`, `NeverConfirm`, `ConfirmRisky` | Security analysis and user-confirmation policy can be composed independently from the tool implementation. | Gemini policy/confirmation |
| **Repository map / selective repo cognition** | `Aider-AI/aider/aider/repomap.py` | `RepoMap`, `get_repo_map()`, `get_ranked_tags_map()` | Large repositories can be ranked/mapped under a token budget rather than fully loaded. | OpenHands workspace |
| **Git repository identity / one-repo scope** | `Aider-AI/aider/aider/repo.py` | `GitRepo` | Repository root and Git state can be established before edits; cross-repository input is explicitly rejected in this abstraction. | OpenHands workspace Git methods |
| **Deterministic edit application / dry run** | `Aider-AI/aider/aider/coders/editblock_coder.py` | `EditBlockCoder.apply_edits()`, `apply_edits_dry_run()` | Model edit intent can be parsed and deterministically applied/validated separately from reasoning text. | Codex patch execution |
| **Persistent agent turn orchestration** | `NousResearch/hermes-agent/agent/conversation_loop.py` | `run_conversation()` and extracted turn phase helpers | One turn can include retries, compression, response normalization, tool rounds, finalization and recovery without the gateway becoming the reasoning owner. | DeepSeek ReactLoopAgent |
| **Tool-call persistence before side effect** | `NousResearch/hermes-agent/agent/turn_tool_round.py` | `run_tool_round()`, `ToolRoundVerdict` | Tool-call intent can be persisted before executing side effects, with distinct continue/break/return outcomes. | Codex typed tool items |
| **Tool observe → commit → project path** | `NousResearch/hermes-agent/agent/tool_executor.py` | sequential/concurrent executor path described by module contract | Tool dispatch can converge on one result pipeline so wire/result persistence does not vary by concurrency path. | DeepSeek tool scheduler |
| **Persistent memory exposure / bounded memory tools** | `NousResearch/hermes-agent/agent/memory_manager.py` | memory provider/tool exposure gates | Memory-provider tools can be exposed only when the relevant memory toolset is enabled; memory capability is not assumed from provider configuration. | DeepSeek skill/provider registry |
| **Skill registry / provider ownership / precedence** | `deepseek-ai/deepseek-harness/packages/skill/skill/src/index.ts` | skill registry service, `SkillSummary`, `SkillCandidate`, `SkillDefinition`, `SkillInvocationPolicy` | Skills can retain provider, source, invocation policy, precedence and resource-base metadata instead of becoming anonymous prompt blobs. | Hermes skill loading |
| **Project-scoped skills and agent variants** | `agent0ai/agent-zero/helpers/skills.py` | `get_skill_roots()`, `Skill`, `ActiveSkillEntry` | Skills can resolve from global, project, agent and plugin scopes. | DeepSeek Skill registry |
| **Project boundary / project metadata** | `agent0ai/agent-zero/helpers/projects.py` | project metadata constants and project creation/clone functions | Project instructions, knowledge, skills, MCP config and agent variants can share one explicit project boundary. | OpenHands workspace |
| **Subagent parent/child identity** | `deepseek-ai/deepseek-harness/packages/subagent/subagent/src/lifecycle.ts` + `control.ts` | subagent lifecycle/control functions and parent/child session IDs | Subagents can be explicit child sessions with ownership, interruption, continuation and catalog state instead of invisible recursive calls. | Cline team sessions |
| **Team child sessions / continuation** | `cline/cline/sdk/packages/core/src/session/team/index.ts` | `TeamChildSessionManager`, `buildTeamRunContinuationPrompt`, `trackTeamRunState`, `waitForTeamRunUpdates` | Working agent teams/subagents are a supported feature when their session ownership and continuation lifecycle are explicit. They are not categorically forbidden. | DeepSeek subagent lifecycle |
| **Comparative subordinate-agent implementation** | `agent0ai/agent-zero/tools/call_subordinate.py` | subordinate registration, parent context identity, slot handling | A subordinate can have explicit parent/context/slot identity; useful as a comparison, not as default authority design. | DeepSeek/Cline team owners |
| **Explicit model completion signal** | `google-gemini/gemini-cli/packages/core/src/tools/complete-task.ts` | `CompleteTaskTool`, `CompleteTaskInvocation.execute()` | A model loop can require a specific validated completion tool instead of equating silence/loop exit with completion. | Cline completion policy |
| **Runtime task-completed emission** | `cline/cline/sdk/ARCHITECTURE.md` + `sdk/packages/core/src/runtime/host/local-runtime-host.ts` | host logic that observes successful `submit_and_exit` and emits at most one `task.completed` | Completion is a host/runtime event derived from a concrete completion condition, not merely assistant prose. | Gemini CompleteTaskTool |
| **Terminal execution receipt / execution evidence identity** | `openclaw/openclaw/src/agents/agent-run-terminal-receipt.ts` | `AgentRunTerminalReceipt`, `normalizeAgentRunTerminalReceipt()` | A final runtime receipt can bind `runId`, `sessionId`, `turnId`, requested/effective model, successful tools and external delivery state. | Codex typed execution events |
| **Cancellation / interruption** | `deepseek-ai/deepseek-harness/packages/core/agent-loop/src/agent.ts` | `ReactLoopAgent.cancel()`, phase `AbortController` | Cancellation can be a runtime transition with explicit signal ownership and inbox handling. | OpenHands `InterruptEvent`; Codex session single-running-task contract |
| **Context compaction belongs to runtime/session preparation** | `cline/cline/sdk/packages/core/src/runtime/host/local-runtime-host.ts` and `sdk/packages/core/src/extensions/context/compaction` | compaction-aware `prepareTurn` pipeline | Context compaction is runtime/session preparation and should not be mistaken for memory or provider truth. | Hermes conversation loop compression |
| **Tracing / reconstruction of agent state** | `lobehub/lobehub/packages/agent-tracing/src/index.ts` | `reconstructMessages`, `reconstructActivatedStepTools`, `reconstructToolsetBaseline`, rendering/analyzer exports | Runtime traces can reconstruct messages/toolset state separately from the live reasoning authority. | OpenClaw terminal receipts |

## Browser-agent synthesis for Access Browser Agent / Brew

For a browser-tied agent, the chain should be applied in this order:

```text
Browser specialized agent contract
  -> Gemini CLI BrowserAgentDefinition

Browser session / CDP / profile lifecycle
  -> Gemini CLI BrowserManager

Browser tool discovery + browser-only registry
  -> Gemini CLI createBrowserAgentDefinition + McpToolInvocation

Browser capability provider seam
  -> DeepSeek Harness BrowserUseRegistry / ComputerUseRegistry

Agent turn lifecycle
  -> existing Brew owner first
  -> challenge with DeepSeek ReactLoopAgent / Cline AgentRuntime
  -> never replace a working Brew owner merely because an upstream has another loop

Tool state + policy + confirmation
  -> Gemini Scheduler / checkPolicy / resolveConfirmation
  -> typed approval cross-check with Codex approvals.rs

Cross-surface session identity
  -> OpenClaw chat-run owner + session envelope
  -> channel continuity cross-check with Hermes SessionSource

Provider/model adapters
  -> Cline createHandler / ProviderConfig
  -> catalogue/readiness/runtime separation cross-check with LobeHub

Workspace + action observation
  -> OpenHands software-agent-sdk BaseWorkspace + Action/Observation
  -> repository cognition before edits via Aider RepoMap

Skills/memory
  -> DeepSeek Skill registry for explicit provider/source/invocation metadata
  -> Hermes for persistent memory/toolset exposure

Teams/subagents
  -> preserve existing working Brew features
  -> Cline TeamChildSessionManager and DeepSeek subagent lifecycle are the primary design references
  -> Agent Zero subordinate implementation is comparative only

Completion
  -> explicit model completion signal: Gemini CompleteTaskTool
  -> host/runtime completion event: Cline task.completed
  -> execution receipt/evidence identity: OpenClaw AgentRunTerminalReceipt
  -> final acceptance still belongs to the target system's own acceptance/evidence authority
```

## Non-substitution rules

1. **Do not use an upstream summary as implementation evidence.** Re-open the exact file/symbol above before copying behavior if the upstream head changed.
2. **Do not replace a working target feature because another upstream has a different authority model.** Upstreams challenge the target design; they do not automatically own it.
3. **Subagents/teams are allowed when they are working target features.** Preserve them and improve lifecycle/identity/isolation using Cline/DeepSeek references instead of deleting them to satisfy an outdated single-agent simplification.
4. **Browser tool access is not the browser agent.** Gemini's chain demonstrates the distinction: agent definition → browser manager → dynamically discovered isolated browser tools → invocation lifecycle.
5. **Configured provider is not usable provider.** Cline owns provider handler normalization; LobeHub separately demonstrates catalogue/runtime mapping.
6. **Loop stop is not task completion.** Use explicit completion signals/events and evidence receipts.
7. **Channel/UI/browser surfaces are not independent reasoning authorities.** OpenClaw/Hermes show how to preserve session/run ownership across surfaces.
8. **Memory/skills/history are not current target truth.** Current target source/runtime evidence remains authoritative.

## Required re-verification trigger

If any upstream default-branch head differs from the verified snapshot above, mark symbol-level claims **STALE-UNTIL-RECHECKED** before implementation. Re-open the named path and confirm the named symbol still owns the behavior.

## GPT-K routing consequence

- `GPT_Ref/GPT_REF.md` remains the compact catalogue.
- This file is the deterministic symbol-level resolver after a feature category has been selected.
- OpenHands runtime questions must route through `OpenHands/software-agent-sdk`, not stop at the current Agent Canvas frontend repository.
- Browser-agent questions must route first to Gemini CLI browser-agent implementation and DeepSeek Harness browser/computer capability seams.
- Team/subagent questions must route first to Cline team session ownership and DeepSeek subagent lifecycle; Agent Zero is comparative.
