# Cline ChatGPT Command Loop Skill — Autonomous Task Packet Routing

Status: **PROVEN IN LIVE BREW USE; CURRENT SKILL LOCATION MUST STILL BE RESOLVED THROUGH BIRDEYE**  
Reviewed: **2026-09-15**

## Purpose

This document records when an agent should retrieve and use the **Cline `chatgpt-command-loop` skill** for autonomous multi-step Brew/project execution.

It is an operational routing reference. It is **not** the skill implementation itself, not a replacement for BirdEye Skills retrieval, and not current workspace/runtime truth.

The intended responsibility is:

```text
user asks to continue/run an autonomous execution lane
  -> BirdEye Skills query
  -> select/fetch the current chatgpt-command-loop skill
  -> resolve current workspace/revision/runtime evidence
  -> provide one complete autonomous task packet
  -> Cline executes read -> act -> report -> re-read cycles
  -> stop only on a proven blocker or completed acceptance lane
```

## Do not confuse this with Letterblack LoopTool

Two different mechanisms exist and must remain distinct.

### Letterblack LoopTool / AGENT COMMAND bridge

`ai-agents/letterblack-loop-tool-chatgpt-command-bridge.md` describes a **bounded command executor**. It transports and executes one explicit command request and returns bounded stdout/stderr evidence. It does not choose the next semantic action.

### Cline `chatgpt-command-loop` skill

The Cline loop skill is a **procedural autonomous execution workflow**. It can consume a complete task packet, inspect current state, execute multiple bounded steps, send results back to the ChatGPT thread, re-read the thread, and continue until its stated stop condition is reached.

Do not redefine the bounded LoopTool transport as the autonomous Cline workflow, and do not treat the Cline workflow as a new Brew reasoning authority.

## When to retrieve this skill

Query BirdEye Skills for the current loop skill when the user asks for behavior equivalent to any of the following:

- `continue the loop`
- `run the loop`
- `use the Cline loop`
- `resume the Cline loop`
- `continue Brew autonomously`
- `run this lane autonomously`
- `run until blocker`
- `continue until a real blocker`
- `execute the whole lane`
- `full task block`
- `full agent command block`
- `resume live acceptance`
- `continue live acceptance`
- `give Cline the complete task`

Do not require the user to know the exact skill filename. Use semantic Skills discovery first.

Recommended retrieval intent:

```text
skills.query:
"Cline ChatGPT command loop autonomous multi-step execution, read thread, execute, send result, re-read, continue until blocker or acceptance"
```

Fetch the selected skill's full `SKILL.md` only when its complete operating contract is required.

## Default response behavior

When the user invokes this loop for Brew or another project and does **not** explicitly ask for only one shell command, provide a **complete autonomous task packet**, not a single command.

The packet should contain, where applicable:

- objective;
- source repository and exact branch/revision scope;
- installed-runtime scope;
- exact files/owners to inspect;
- architecture contract;
- explicit `DO NOT` constraints;
- diagnosis sequence;
- mutation sequence;
- focused validation;
- wider regression validation;
- commit/push boundary;
- canonical install/deploy/restart procedure;
- provider/runtime/live probes;
- live acceptance criteria;
- cleanup requirements;
- stop conditions;
- evidence requirements;
- final report schema.

Do not hardcode stale branch names, runtime paths, PR numbers, provider selections, or file ownership merely because a previous task packet contained them. Resolve current state first.

## Canonical task-packet shape

Use the current selected skill's exact transport format. When the skill accepts the full task block form, the preferred structure is:

```text
=== AGENT COMMAND START ===

OBJECTIVE:
<single bounded lane objective>

SOURCE:
Repo: <current repository>
Branch: <current active/authorized branch>
Revision: <current proven revision when required>

INSTALLED RUNTIME:
<current installed runtime target when relevant>

ARCHITECTURE CONTRACT:
- <authority constraints>
- <reasoning/execution boundary>
- <existing owner that must be preserved>

DO NOT:
- <forbidden mutations>
- <unsafe repository operations>
- <authority boundaries not to weaken>

TASK:
1. <establish current evidence>
2. <trace active owner/path>
3. <diagnose>
4. <make smallest proven correction>
5. <focused validation>
6. <wider validation>
7. <install/deploy/restart if applicable>
8. <live acceptance if applicable>
9. <cleanup>

STOP CONDITIONS:
Stop only when:
- a genuine blocker is proven with exact evidence;
OR
- the requested acceptance lane is complete.

Do not retry a deterministic failure indefinitely.

FINAL REPORT:
SOURCE_HEAD:
SOURCE_TESTS:
INSTALL_OR_DEPLOY:
RUNTIME:
LIVE_ACCEPTANCE:
BLOCKER:
REMAINING_RISK:
SAFE_TO_ADVANCE:

=== AGENT COMMAND END ===
```

Project-specific packets may add fields such as provider test results, browser evidence, memory checks, GitHub Actions, topology checks, or cleanup status when those claims are part of the requested lane.

## Required authority routing before execution

The Cline loop skill does not replace the normal Letterblack evidence hierarchy.

```text
current local workspace / revision / indexed evidence -> BirdEye
prior decisions / conversation history               -> Memory through BirdEye
current procedural skill                             -> Skills through BirdEye
reusable engineering guidance                        -> GPT-Knowledge
remote branch / PR / commit / check truth            -> GitHub
live provider / browser / installed-runtime behavior -> runtime-specific proof
```

Current source/runtime evidence outranks this document and any historical task packet.

## Stop contract

The loop is useful because it can carry a lane through multiple steps without returning after every shell command. That does **not** authorize infinite retries or success-by-persistence.

A correct loop stops when either:

1. **BLOCKED** — a deterministic or external blocker has been reproduced sufficiently to identify the failing boundary and exact evidence; or
2. **ACCEPTED** — the complete requested validation/acceptance contract has passed.

On a deterministic repeated failure, stop after bounded reproduction sufficient to classify it. Preserve evidence needed for debugging and report exactly what remains unproven.

## Evidence requirements

The final report must distinguish:

- source/test pass;
- deployment/install pass;
- runtime startup/health pass;
- provider/tool availability;
- live user-path acceptance;
- blocked/unproven later steps.

Do not claim end-to-end success because the service started, smoke tests passed, or a command exited `0`.

## Live Brew proof — 2026-09-15

A live Brew loop session supplied evidence of the workflow operating as intended.

Observed implementation references in that workspace were:

```text
.cline/skills/chatgpt-command-loop/SKILL.md
.cline/agents/chatgpt-command-loop-relay.md
.cline/skills/chatgpt-command-loop/scripts/cdp_eval.mjs
.cline/skills/chatgpt-command-loop/scripts/cdp_send.mjs
```

These paths are **observed proof from that workspace**, not permanent global paths. Resolve the current selected skill through BirdEye Skills before use.

The observed loop completed these cycles:

1. runtime start + smoke — PASS;
2. live acceptance precheck — PASS;
3. live tool-loop acceptance — BLOCKED on a reproducible provider/model-tool-call failure.

The live blocker was reproduced twice, classified, delivered to the thread, and the loop stopped rather than retrying indefinitely. Later acceptance steps were explicitly left `NOT PROVEN`.

This demonstrates the desired operational contract:

```text
full task packet
  -> autonomous bounded execution
  -> evidence after each lane
  -> genuine blocker classification
  -> result delivered to thread
  -> stop at blocker
  -> later "continue the loop" resumes from fresh thread/current evidence
```

It does **not** prove that the same local path, provider state, Brew branch, or runtime condition remains current later.

## Relationship to Brew architecture

For Brew, the Cline command loop is an **engineering execution workflow around the repository/runtime**, not a second Brew product agent.

Preserve:

- one Brew reasoning agent;
- model-owned semantic reasoning inside Brew;
- runtime-owned policy/execution/evidence;
- canonical Brew source/runtime owners;
- truthful validation and failure states.

The Cline loop may inspect, patch, test, install, restart, and validate Brew under the user's authorized engineering task. It must not introduce a second semantic planner into Brew merely because the engineering workflow itself is autonomous.

## Routing rule for ChatGPT/BirdEye consumers

When the user asks to continue Brew work using the loop:

```text
1. use current conversation if sufficient;
2. retrieve prior Brew context from BirdEye Memory only if needed;
3. query BirdEye Skills for the Cline chatgpt-command-loop skill;
4. fetch the selected current skill contract;
5. resolve current Brew workspace/revision/runtime evidence;
6. generate one complete autonomous task block by default;
7. let the loop run until acceptance or a genuine blocker;
8. evaluate returned evidence before issuing the next packet.
```

If the user explicitly asks for only a single command, honor that request instead of generating the full autonomous packet.
