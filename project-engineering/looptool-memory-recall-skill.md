---
name: looptool-memory-recall
description: >
  Use LoopTool with the global Memory MCP when historical conversation evidence,
  prior project decisions, earlier implementation state, or exact provenance is
  needed alongside current workspace/runtime evidence.
---

# LoopTool Memory Recall Skill

## Purpose

Use LoopTool for deterministic local execution evidence and Memory MCP for historical recall. Historical memory is evidence, not current truth and not a workflow engine.

## Trigger

Use this skill when the task materially depends on:

- prior conversations or project decisions;
- earlier implementation or debugging history;
- historical disagreement/correction chains;
- exact source provenance for a recalled claim;
- comparing historical state with current repository/runtime evidence;
- deterministic local validation through LoopTool.

Do not activate historical recall for ordinary questions where current evidence is sufficient.

## Available Memory MCP capabilities

The global Memory MCP exposes:

- `recall`
- `search`
- `timeline`
- `conversation`
- `message`
- `related`
- `sources`

Use these capabilities through the MCP boundary. Do not dump or preload the full historical archive into agent context.

## Authority precedence

When evidence conflicts, use this exact precedence:

1. `current_runtime`
2. `current_workspace` — current workspace / repository authority
3. `current_session`
4. `current_project_docs`
5. `historical_evidence`
6. `derived_memory`
7. `model_inference`

Historical evidence may be stale. Never overwrite newer runtime or repository evidence with historical conversation state.

## Recall behavior

The agent decides when and how to query Memory. Memory must not impose deterministic reasoning or orchestration steps.

For broad historical recall, begin with `recall` or `search`. When a historical claim materially affects the answer or action, descend to exact evidence with `conversation`, `message`, and/or `sources`. Use `timeline` when chronology or supersession matters. Use `related` only as supporting discovery, not as proof by itself.

If retrieval returns no supporting evidence, report the absence. Do not fabricate memory.

## LoopTool execution boundary

Use LoopTool when current local execution evidence is required: repository inspection, debugging, tests, runtime validation, or governed command execution.

Standard execution envelope:

```text
=== AGENT COMMAND START ===
WORKING DIRECTORY: <absolute project path>
COMMAND: <command>
=== AGENT COMMAND END ===
```

Treat returned execution evidence according to what it proves. A command hash identifies a command/request; it does not by itself prove the outcome.

## Evidence reconciliation

For project/repository questions, use this sequence conceptually, not as a mandatory workflow engine:

`CURRENT STATE → VERIFIED EVIDENCE → ACTUAL GAP → MINIMAL NEXT STEP`

Historical Memory can explain why a decision was made or recover prior context, but current repository/runtime evidence determines current implementation truth.

Classify conclusions as appropriate:

- `PROVEN` — directly verified by current source/runtime evidence.
- `IMPLEMENTED` — present in source but live behavior not proven.
- `DOCUMENTED` — stated by documentation only.
- `INFERRED` — logical conclusion from verified evidence.
- `UNVERIFIED` — insufficient evidence.
- `STALE` — contradicted by current evidence.
- `BLOCKED` — cannot currently be tested or confirmed.

## Provenance requirement

When historical evidence materially supports a conclusion, preserve enough provenance to descend back to the canonical source, such as conversation ID, message/node ID, source shard, and Memory provenance fields returned by the MCP capability.

Do not treat an isolated historical snippet as authoritative. Inspect surrounding context or chronology when acceptance, rejection, correction, or supersession matters.

## Boundaries

Do not:

- make Memory lookup mandatory before every task;
- treat historical conversations as current repository truth;
- add reasoning/workflow control to the Memory layer;
- modify historical source data as part of recall;
- infer a missing memory when retrieval returns nothing;
- bypass current workspace/runtime verification when the question is about current implementation state.

Do:

- use Memory selectively when prior context materially helps;
- preserve provenance;
- verify consequential historical claims against current evidence;
- use LoopTool for deterministic local execution evidence when required;
- keep retrieval bounded to the evidence needed for the task.

## Expected agent behavior

Example request:

> Recall what we previously decided about GPT-Knowledge and verify whether it is still true in the current workspace.

Expected behavior:

1. Query Memory for the relevant historical decision.
2. Descend to exact source provenance when the claim matters.
3. Inspect current workspace/runtime evidence with LoopTool or the appropriate authoritative tool.
4. Report conflicts explicitly; current evidence outranks history.
5. Recommend a change only if an actual gap is established.

## Integration contract

The intended architecture is:

```text
Reasoning agent
    |
    +-- current workspace / repository / runtime tools
    |
    +-- LoopTool deterministic execution evidence
    |
    +-- Memory MCP
           |
           +-- historical evidence
           +-- durable derived memory
           +-- exact provenance descent
```

MCP provides access. This skill provides the epistemic and usage contract. The archive remains external and queryable rather than being injected wholesale into every prompt.
