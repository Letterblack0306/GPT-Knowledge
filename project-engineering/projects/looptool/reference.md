# LoopTool — Operating Reference

## Purpose

LoopTool is the Letterblack deterministic local execution/evidence bridge used for testing, debugging, inspection, validation, reproduction and bounded command execution through the Workspace Launcher Loop.

It does **not** replace reasoning. The reasoning agent decides what evidence is needed; LoopTool carries one selected local action and returns evidence.

Implementation repository: `Letterblack0306/tools`

Recorded remote repository identity for this projection:

- default branch: `master`
- recorded HEAD: `ddf1c09873599efe5f4976f7dc6456a65474b9b6`

Do not assume this document and runtime implementation remain synchronized. Reinspect current source/runtime before implementation-specific claims.

## Current proven runtime checkpoint

LoopTool is not represented here only as a documented concept. A bounded live execution proof is preserved at:

`runtime-proof-2026-08-23.md`

That checkpoint proved this chain by execution:

```text
LoopTool command transport
-> BirdEye local project resolution
-> GPT-Knowledge local-project mapping
-> Memory hashed Cline-session index
-> bounded historical session retrieval
-> matched historical messages
-> session-file SHA256 provenance
-> LoopTool AGENT RESULT + COMMAND HASH
```

Primary execution identity:

```text
COMMAND HASH: FB0CF8F7A9E965E6A2BDE50BAD2AE9FFFB0E93BC53AADEA4A1A824A30C1B7F1A
```

Historical evidence identity from that proof:

```text
SESSION ID: 1787404643663_0sdnz
SESSION MESSAGES SHA256: c0ce4e77a4dac3dc8a76873aff989825ed2df7ce3978a1a8006f6498a703eced
```

The proof is bounded: it considered 50 recent sessions, did not inspect current Access Browser Agent source truth, and did not establish first-class `execution_record_id` / `execution_record_sha256` persistence for every LoopTool run.

**Use rule:** when deciding whether LoopTool is a real usable execution/evidence bridge, read the runtime proof rather than relying on this description alone. When current health matters, run a fresh bounded LoopTool probe because a dated proof does not prove future runtime state.

## When to use

Use LoopTool when deterministic local evidence is required, including:

- repository/workspace inspection;
- reproducing a local failure;
- focused tests;
- debugging with real runtime evidence;
- validating a fix;
- checking branch/revision/runtime identity locally;
- bounded command execution;
- collecting stdout, stderr, exit code and other execution evidence;
- explicit user requests to use LoopTool / Workspace Launcher Loop / AGENT COMMAND.

## When not to use

Do not activate LoopTool for:

- general coding questions without local execution requirements;
- architecture discussion without repository/runtime inspection;
- documentation-only review;
- theoretical explanation;
- code suggestions where no deterministic local evidence is required;
- blind retry/fix loops;
- broad destructive cleanup as a substitute for diagnosis;
- "run everything" audits;
- duplicating the same BirdEye action without an explicit cross-validation reason.

## Mandatory operating order

```text
USER OBJECTIVE
-> read current GPT-Knowledge/000_START_HERE.md
-> consult knowledge-index.json
-> load project-engineering/chatgpt-installed-skill-routing.md when Skills are available
-> load only task-relevant GPT-Knowledge methods / installed Skills
-> establish repository / project / branch / revision / workspace / runtime identity
-> define one question + authoritative observable + falsifier + acceptance condition
-> only then issue one bounded LoopTool execution action
-> receive AGENT RESULT
-> classify evidence only at the layer actually observed
-> continue to live runtime/UI acceptance when the claim requires it
```

For project or feature implementation, extension, migration, replacement, planning or unfamiliar-project work, load `project-engineering/project-feature-implementation-plan.md` before implementation-oriented LoopTool commands.

For agent/LLM/browser-agent/runtime/autonomy work, route through `ai-agents/unified-agent-engineering-methods.md`.

For repeated failures, questionable end-to-end claims, stale fixtures/harnesses or destructive recovery ideas, route through `ai-agents/repeated-audit-failures-and-corrective-method.md`.

## Authority separation

```text
GPT-Knowledge
  = reusable engineering method, routing and prior reasoning

Installed Skills
  = task-specific investigation / proof / governance procedures

GitHub
  = live remote repository, branch, commit, PR and check truth

Active local workspace
  = actual files and revision currently being operated on

BirdEye / governed local evidence layer
  = governed local workspace/revision/search/inspect/run evidence when selected

LoopTool
  = deterministic local command transport plus returned execution evidence

Memory
  = historical Cline-session index/fetch owner used by the proven recall composition

Live runtime / rendered UI
  = behavioral and user-visible acceptance truth
```

Never collapse these authorities. Knowledge is not runtime proof. A Skill is not execution authority. A successful command does not prove behavior outside the observable it actually measured.

## Canonical command envelope

```text
=== AGENT COMMAND START ===
WORKING DIRECTORY: <ABSOLUTE PROJECT PATH>
COMMAND: <POWERSHELL COMMAND>
=== AGENT COMMAND END ===
```

The working directory is part of the execution contract. Do not send a consequential command to an assumed workspace.

## Expected result envelope

The documented bridge returns evidence shaped like:

```text
=== AGENT RESULT START ===
COMMAND STATUS: <PASS|FAIL|...>
COMMAND HASH: <SHA-256>
WORKING DIRECTORY: <ABSOLUTE PROJECT PATH>
COMMAND: <COMMAND>
EXIT CODE: <CODE>
...
=== AGENT RESULT END ===
```

Returned stdout/stderr/runtime evidence should be evaluated directly. Do not infer missing evidence.

## Evidence rules

- Command emitted ≠ command executed.
- Exit code `0` ≠ feature acceptance.
- Focused test pass ≠ end-to-end proof.
- Repository source proof ≠ runtime behavior proof.
- Runtime behavior proof ≠ rendered user-visible acceptance unless the rendered observable was actually checked.
- Historical recall evidence ≠ current workspace truth.
- A dated proof ≠ proof of current health without revalidation.
- A timeout can be product failure, dependency/configuration block, transport failure or stale harness assumption; classify before changing code.
- Workspace and revision identity must be known before local evidence is treated as authoritative.

## BirdEye and Memory boundary

Use BirdEye when the routed workflow selects it as the governed local evidence layer and its workspace/revision/search/inspect/run capabilities fit the investigation. Use Memory for historical Cline-session indexing/fetch when historical evidence is required. Use LoopTool when explicitly requested, when selected as the direct local execution bridge, or when one bounded command must compose those existing owners.

Do not duplicate authority: LoopTool does not become the project-mapping or historical-memory owner merely because it can invoke those owners through a bounded command.

## Deferred recallable execution-record requirement

The stronger reusable requirement is documented at:

`../workspace/TOOL_RECALLABLE_EXECUTION_RECORDS_REQUIREMENT.md`

Current proof does **not** establish that every LoopTool execution already persists `execution_record_id` and `execution_record_sha256`. Treat that requirement as deferred until separately implemented and proven.

## Implementation-specific verification

Before claiming current parser, readiness, duplicate-suppression, approval, timeout/cancellation, session, result-return or UI behavior, inspect the current `Letterblack0306/tools` source/runtime. The operating contract and implementation can drift.
