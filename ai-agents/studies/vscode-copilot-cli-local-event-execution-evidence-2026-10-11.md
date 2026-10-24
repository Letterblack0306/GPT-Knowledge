# VS Code Copilot CLI Agent — Observed Local Event and Execution Reference

## Knowledge metadata

- Observed: 2026-10-11 (Asia/Dubai)
- Classification: **local live-observation reference**, not an upstream capability guarantee
- Scope: VS Code Agent Host, Copilot CLI session events, Browser Agent workspace, and evidence interpretation
- Confidence: **PROVEN** for inspected file schemas and recorded event counts; **INCONCLUSIVE** for hidden model reasoning, full edit attribution, and installed-product acceptance
- Current-state rule: re-inspect runtime and source before using this as a claim of present health

## Observed machine sources

- Browser Agent workspace: `D:\Developement\_Brwoser_agent\Browser_Agent`
- VS Code agent host database: `C:\Users\prave\AppData\Roaming\Code\User\globalStorage\agent-host.db`
- VS Code workspace storage: `C:\Users\prave\AppData\Roaming\Code\User\workspaceStorage\5404c95994a5db2f583d6cdb5525d955`
- VS Code diagnostic log group: `C:\Users\prave\AppData\Roaming\Code\logs\20261011T193554`
- Copilot CLI session journals: `C:\Users\prave\.copilot\session-state\<session-id>\events.jsonl`

Paths above are observed local-machine evidence references, **not** portable configuration defaults.

## Source distinction

1. **Agent-host logs** (e.g., `agenthost.log`) show Git comparisons, changeset generation, state envelopes, temporary index checkpointing, and file-watch activity. These are host operations; **not** proof of model tool execution or commit/push.
2. **Agent-host SQLite** (`agent-host.db`) has `sessions`, `sessions_v2`, `metadata`, `session_chat_catalogs`, and `session_chats`. Inspection initially found 10 sessions/10 v2/32 metadata/10 catalogs/0 chat rows; a later inspection found 13 v2 sessions, confirming this is changing live state. The `sessions_v2` schema includes `session_generation`, `source_revision`, `payload_version`, `payload_hash`, `verified`, and `modified_time`. Verification metadata does not itself prove successful execution.
3. **Chat editing sessions** contain `state.json` with `initialFileContents`, `timeline`, `recentSnapshot`; checkpoints carry request IDs and epochs. Two inspected editing-session directories had an initial checkpoint followed by a request checkpoint and a stop checkpoint. This offers a request-to-edit correlation route, not a complete causal proof.
4. **Copilot CLI `events.jsonl` is the primary observed trace** for executed tools. Event kinds inspected include `user.message`, `assistant.message`, `assistant.turn_start/end`, `tool.execution_start/complete`, `permission.requested/completed`, `skill.invoked`, `hook.start/end`, model changes, and subagent events. Tool start exposes `toolCallId`, `toolName`, `arguments`, `turnId`, `model`; completions expose matching tool ID, success, result/error and telemetry. Review sensitive command arguments locally; do not automatically copy credentials or raw message data into a knowledge document.

## Bounded event counts from October 11 inspection

| Observed session directory | Tool starts/completions | Successful / failed completions | Tool mix |
|---|---:|---:|---|
| `dc1a3146-bb1f-4018-a1f4-1980cc9d9245` | 46 / 46 | 40 / 6 | `view` 26, `birdeye-workspace_run` 6, `rg` 5, `skill` 4, `ask_user` 3, `powershell` 2, `glob` 1 |
| `0fd1fe24-d9e0-4b4e-8f41-1a810fc4bb6d` | 93 / 93 | 92 / 1 | `view` 50, `rg` 33, `glob` 5, `skill` 2, BirdEye revision/run 1 each, PowerShell 1 |

Session A had six `permission.completed` events with `approved` decision and invoked `workspace-tools`, `desktop-commander-overview`, and `skill-creator`. Session B invoked `awesome-architecture-audit` and `devils-audit-masterbulletpoints`. Exact event counts are *snapshots*, not durable health metrics; some summaries reflect in-progress sessions.

An additional older observed journal (`f747a6c7-0ccd-44b2-8a1d-a36b8183d1ab`) contained 714 tool starts, 714 completions, 449 turn starts and ends, 18 user messages, and 2 subagent start/completion pairs. This shows trace support for delegation events, **not** proof of delegation quality.

## Observed host-level action sequence

On October 11 at approximately 20:03 Dubai time, the VS Code agent host logged Git diffs for Browser Agent source files; changeset/state emission; comparison against worktree baseline; approximately 70 changed paths staged into a **temporary Git index**; `git write-tree`; and subsequent file-watch events. A temporary index/tree is a checkpoint representation, not evidence of a repository commit or push.

## How to study the agent correctly

Use the evidence chain:

`user request -> visible assistant plan or statement -> tool.execution_start(arguments/toolCallId) -> permission decision -> tool.execution_complete(result/error) -> file/runtime effect -> validation -> assistant report`

Join tool events by `toolCallId`, order events by timestamp, and correlate edits with editing-session request IDs, checkpoint epochs, worktree diff, and authoritative BirdEye/LBE receipts. Tool success means that **one tool returned success**; it does not demonstrate the requested runtime behavior. Failed calls followed by subsequent calls indicate continued work, but do not themselves establish the rationale or effectiveness of recovery.

Separate **intention**, **execution**, and **observable runtime effect**. Classify findings as PROVEN, DISPROVEN, INCONCLUSIVE, BLOCKED_CONFIGURATION, STALE_TEST_OR_FIXTURE, or TEST_HARNESS_FAILURE as appropriate. Never label UI, agent autonomy, or completion PROVEN without effect-level evidence.

The journal contains `assistant.message` records with `content`, `reasoningOpaque`, `encryptedContent`, and `reasoningBlocks` fields; the presence of opaque/encrypted fields does **not** authorize conclusions about private internal reasoning. Summarize visible planning statements and behavioral evidence instead.

## Browser Agent lesson from the same investigation

The existing Browser Agent already implements a conversation loop across `conversation-worker.js`, `workflow-runtime.js`, `agent-session-runtime.js`, `AgentExecutive.js`, `governed-terminal.js`, `birdeye-browser-relay-transport.js`, and `browser-transport-journal.js`. Merely saving a ChatGPT conversation URL or posting a message is **not** proof that the worker started, consumed its reply, used local tools, or returned results. Confirm an active persisted worker, provider readiness, exact real-profile target identity, execution receipt, visible effect, and same-thread reply before calling the end-to-end loop working.

## Reuse guidance

These observations are reference data for **event-sourced agent auditability**, permission handling, skills, tool chronology, checkpointing, failure-recovery investigation, and runtime-evidence contracts. Do not clone the VS Code host or give it authority over BirdEye/LBE. Live project evidence takes precedence over this historical study.
