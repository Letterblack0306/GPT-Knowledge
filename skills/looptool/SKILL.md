---
name: looptool
description: >
  Use Letterblack LoopTool for one bounded local command after the reasoning agent has already
  identified the exact workspace, exact command, and evidence goal. LoopTool executes; it does
  not search, index, remember, plan, or determine truth. Route current local evidence, Skills
  discovery, and Memory retrieval through the common BirdEye MCP surface while preserving each
  domain's authority; route remote repository truth to GitHub before using LoopTool.
---

# LoopTool — Bounded Local Command Execution

## Identity

LoopTool is a bounded command executor, nothing more.

It is not:

- an agent;
- a planner;
- a workspace indexer;
- a filesystem search system;
- a Memory service;
- a skill discovery service;
- repository truth authority;
- semantic completion authority.

## Required routing before execution

Use the proper owner/access surface first:

```text
current local file/index/hash/revision → BirdEye workspace capability
historical ChatGPT/agent/runtime data → BirdEye Memory capability; authority remains Memory
specialized workflow guidance         → BirdEye Skills capability; authority remains Skills
reusable engineering knowledge        → GPT-Knowledge
remote repository/PR/commit truth      → GitHub
bounded local command execution        → LoopTool
```

The retired direct `skills_hash_status` / `skills_list` / `skills_fetch` path is not the intended agent runtime route. Individual agents should consume Skills through the shared BirdEye MCP capability surface rather than construct their own local SkillCatalog or filesystem-first discovery authority.

Historical Memory data may be SHA-indexed and retrieved by BirdEye but remains:

```text
root_class = memory
authority = historical
```

A hash identifies content; it does not promote historical information to current truth.

## When to use LoopTool

Use LoopTool when all of these are true:

- the target workspace/path is already known;
- the exact command has already been decided;
- local execution on the user's machine is required;
- the command can be bounded;
- stdout/stderr/exit code can provide useful evidence;
- the result will be validated semantically after execution.

Typical uses:

- focused tests;
- deterministic diagnostics;
- git/status checks on a known workspace;
- bounded runtime inspection;
- acceptance commands;
- exact build/lint/test invocations.

## Do not use LoopTool for

- finding relevant files or sections → BirdEye search/inspect;
- searching indexed workspace content → BirdEye;
- historical conversation/session recall → BirdEye/Memory capability;
- loading a domain workflow → BirdEye/Skills capability;
- determining current GitHub truth → GitHub/current repository evidence;
- deciding what command to run → reasoning agent;
- claiming semantic success solely from exit code 0.

## Preferred flow

```text
task
→ identify the evidence owner and common capability surface
→ retrieve/verify current facts
→ choose exact target
→ formulate one bounded command
→ execute through LoopTool
→ inspect AGENT RESULT
→ validate actual task outcome
```

## Command envelope

When the browser Loop bridge is the available execution path, emit the exact envelope:

```text
=== AGENT COMMAND START ===
WORKING DIRECTORY: <ABSOLUTE PROJECT PATH>
COMMAND: <POWERSHELL COMMAND>
=== AGENT COMMAND END ===
```

Rules:

- use an absolute working directory;
- never guess the workspace path;
- keep the command bounded;
- do not emit a valid envelope merely as an example while Loop is active;
- wait for the corresponding `AGENT RESULT` before issuing the next dependent action.

## Result interpretation

LoopTool returns execution evidence such as:

```text
COMMAND STATUS
COMMAND HASH
WORKING DIRECTORY
COMMAND
EXIT CODE
STDOUT
STDERR
```

`PASS` means the command process exited successfully. It does not automatically mean the software task is semantically correct.

After every result ask:

```text
What did this command actually prove?
What authority validates the claimed outcome?
```

## Hash boundary

LoopTool's command hash identifies the normalized execution request for deduplication/receipt purposes.

It is not:

- a BirdEye file SHA-256;
- a root snapshot hash;
- a Git commit SHA;
- a Memory record identity;
- a skill-content SHA;
- proof that a workspace did not change.

Do not substitute one hash type for another.

## One-action discipline

Prefer one bounded action, then inspect the returned evidence before choosing a dependent next action.

Independent commands may be batched only when their outcomes do not depend on one another and the execution surface explicitly supports that batching safely.

## Authority rule

LoopTool transports and executes a decision already made by the reasoning agent.

```text
reasoning agent decides
→ LoopTool executes
→ result returns
→ reasoning agent interprets
→ authoritative evidence owner validates
```

LoopTool must never become the semantic planner, workspace search authority, skill authority, Memory authority, or completion judge.
