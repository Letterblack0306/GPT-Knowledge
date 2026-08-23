# Tool Recallable Execution Records Requirement

Status: **DEFERRED REQUIREMENT — NOT IMPLEMENTED BY THIS DOCUMENT**

Purpose: define a reusable requirement for any local execution tool that must make its command executions durably recallable in later sessions without depending on the original chat context.

## Scope

This requirement applies to LoopTool first and may be reused for other governed local tools when explicitly adopted for that tool.

GPT-Knowledge is the durable specification and routing layer for this requirement. It is **not** the execution-record store and must not become a second runtime, memory, or evidence authority.

## Required behavior

```text
command
→ execute
→ build execution record
→ persist execution record
→ hash execution record
→ index/register execution record
→ return result envelope with recall identity
```

Every execution covered by this requirement must create a durable execution record. A chat transcript alone is insufficient.

## Mandatory persisted fields

```text
project_id
session_id
command
command_hash
working_directory
status
exit_code
started_at
finished_at
execution_record_id
execution_record_sha256
```

## Optional persisted fields

```text
stdout
stderr
stdout_hash
stderr_hash
related_commit
related_project_state
```

Large stdout/stderr may be stored by reference rather than duplicated inline, provided the referenced content is durably retrievable and integrity-checkable.

## Identity rule

```text
COMMAND HASH
= identity of the normalized requested command

EXECUTION RECORD SHA256
= identity of the specific observed execution record
```

The same normalized command may be executed more than once and produce different results. Therefore command hash alone is not sufficient to identify an observed run.

Recall of a specific execution must resolve through `execution_record_id` and/or `execution_record_sha256`.

## Required result-envelope extension

A tool adopting this requirement should return an evidence envelope equivalent to:

```text
=== AGENT RESULT START ===
COMMAND STATUS: <PASS|FAIL|...>
COMMAND HASH: <sha256>
EXECUTION RECORD ID: <stable-record-id>
EXECUTION RECORD SHA256: <sha256>
COMMAND: <exact command>
WORKING DIRECTORY: <absolute path>
EXIT CODE: <code>
DURATION SECONDS: <duration>

STDOUT:
...

STDERR:
...
=== AGENT RESULT END ===
```

Existing tool-specific envelope fields may remain, but the execution-record identity must be available to the caller when this requirement is implemented.

## Recall contract

A conforming implementation must support both exact and semantic recall.

### Exact recall

```text
execution_record_id
or
execution_record_sha256
→ retrieve the exact persisted execution record
→ verify integrity
→ return command + observed result + provenance
```

### Semantic recall

Example:

```text
"find the LoopTool command where we validated the installed TUI"
```

Expected flow:

```text
semantic/index search
→ candidate execution records
→ select relevant record
→ verify execution_record_sha256
→ fetch bounded exact record
```

Semantic retrieval must not require loading complete historical transcripts into model context.

## Architecture constraints

Do not create a second memory system inside an execution tool only to satisfy this requirement.

Prefer:

```text
local execution tool
→ execution record
→ existing durable hash/index/evidence layer
→ session/project recall
```

Where an existing session, evidence, or memory index already exists, the execution record should integrate with that owner rather than duplicating it.

GPT-Knowledge documents:

- what the tool is;
- which project ID resolves to it;
- which local workspace mapping applies;
- which recall contract it adopts;
- where the authoritative execution records are retrieved from.

GPT-Knowledge does not replace the local execution-record database/index.

## Authority and truth classification

Until runtime evidence proves otherwise:

```text
this document                         = DOCUMENTED REQUIREMENT
execution-record implementation      = UNVERIFIED / NOT IMPLEMENTED
individual execution records         = runtime evidence only when actually persisted and retrieved
command hashes                        = command identity, not proof of a specific observed outcome
execution_record_sha256               = specific-record integrity identity when implemented
```

Do not report this requirement as implemented merely because this document exists.

## Adoption procedure for another tool

When the user asks to apply this requirement to another tool:

1. resolve the tool/project from GPT-Knowledge;
2. resolve its current local workspace through the project mapping when available;
3. inspect the tool's existing execution, evidence, session, and indexing owners;
4. reuse the existing owner where possible;
5. identify the smallest source surface that can create/persist execution records;
6. add exact and semantic retrieval without duplicating memory authority;
7. validate with fresh runtime evidence;
8. update GPT-Knowledge with the proven implementation status and retrieval route.

Do not infer that every tool must implement this automatically. Adoption is explicit per tool/project.

## Acceptance criteria

Implementation for a particular tool is complete only when all applicable criteria are proven:

1. Every covered execution creates a persisted execution record.
2. Every record has an `execution_record_id`.
3. Every record has an `execution_record_sha256`.
4. The returned execution result exposes both identities.
5. A fresh session can retrieve the exact prior command and result by record ID or SHA.
6. Semantic search can locate prior execution records without loading whole transcripts.
7. Re-running the same normalized command preserves the same `command_hash` while creating a distinct execution record for the new observed run.
8. Persisted output/provenance can be integrity-checked.
9. Existing execution behavior remains unchanged except for durable recording/indexing unless a separately authorized change is required.
10. GPT-Knowledge records the proven retrieval route and implementation status after validation.

## Initial adoption target

Initial intended target:

```text
project_id: looptool
local mapping source: project-engineering/projects/workspace/local-projects.json
```

The currently documented local mapping resolves `looptool` to the machine-local LoopTool workspace. The path remains environment-specific and must be validated on the execution machine before use.

## Future invocation intent

This document exists so a future request such as:

```text
"Apply the recallable execution-record requirement to LoopTool."
```

or:

```text
"Check whether <tool> already implements the GPT-Knowledge recallable execution-record requirement."
```

can be resolved from GPT-Knowledge without re-deriving the requirement from chat history.
