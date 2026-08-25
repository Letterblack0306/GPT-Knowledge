# LoopTool — Historical Recall, Evidence Retrieval, and Workspace-Scope Findings

Updated: 2026-08-26

## Purpose

This reference records the proven/observed LoopTool historical-recall workflow and the latest workspace-scope finding relevant to bounded maintenance execution.

Authority rule: this document is a GPT-Knowledge projection/reference. Current implementation source, current local workspace/runtime evidence, returned LoopTool evidence, GitHub repository truth, BirdEye/current workspace evidence, and live runtime behavior outrank it.

## Historical recall architecture

The recall workflow composes three distinct surfaces:

- **Cline sessions** (`~/.cline/data/sessions/`) — full user/assistant session transcripts with incremental SHA-256 indexing.
- **Memory Archive** (`C:\MCP Local\Memory\memory.db`) — imported ChatGPT/GPT-Knowledge conversations and durable project knowledge, queried through SQLite/full-text retrieval.
- **LoopTool** — deterministic execution transport that runs bounded commands and returns an `AGENT RESULT` evidence envelope.

These surfaces support bounded retrieval of prior plans, decisions, disagreements, corrections, and execution evidence without promoting historical material directly to current truth.

## Canonical LoopTool command envelope

```text
=== AGENT COMMAND START ===
WORKING DIRECTORY: <absolute project path>
COMMAND: <PowerShell command>
=== AGENT COMMAND END ===
```

The working directory is part of the execution contract. Consequential execution should establish the exact repository/workspace identity before the command is issued.

## Historical evidence retrieval

Typical bounded retrieval can:

- search the Memory archive for project/topic terms;
- list/fetch Cline sessions through the existing Memory/Cline session index;
- retrieve surrounding context rather than isolated snippets;
- preserve session IDs, SQLite row IDs, command hashes, and SHA-256 provenance;
- retrieve disagreement/correction chains instead of hiding superseded statements.

### Interpretation boundary

Retrieved historical material is classified as `historical_evidence_non_truth` unless reconciled against current authoritative evidence.

Do not:

- treat a single historical snippet as current truth;
- infer chronology from SQLite row adjacency when conversation branches matter;
- trust a command hash as proof of an outcome;
- promote old plans/decisions without checking current repository/workspace/runtime evidence.

Do:

- inspect bounded surrounding context;
- preserve session/row/hash provenance;
- compare historical claims with current GitHub/BirdEye/workspace/runtime state before calling them canonical.

## Proven/recorded recall capabilities

```text
Memory archive SQLite       = PROVEN in prior bounded runtime proof
Cline session hashing       = PROVEN in prior bounded runtime proof
LoopTool command transport  = PROVEN
Bounded context retrieval   = PROVEN
Non-truth boundary          = PROVEN / required
Execution record SHA        = NOT YET PROVEN IMPLEMENTED
```

The stronger first-class execution-record requirement remains separate; a `COMMAND HASH` identifies the normalized command, not the complete execution result.

## 2026-08-26 workspace-scope finding — LBE cleanup

### Classification

```text
CANONICAL LBE workspace.delete owner = PROVEN IN LBE REPOSITORY
CURRENT EXPOSED FILESYSTEM ADAPTER SCOPE = LOCAL RUNTIME EVIDENCE / REVALIDATE WHEN USED
NEW DELETE CAPABILITY REQUIRED = NO
GENERATED DIRECTORY CLEANUP = PENDING GOVERNED EXECUTION
```

Canonical LBE source contains the existing governed `workspace.delete` capability under:

`C:\Agents-Memory-Tool-v6-integration\lbe_guard_inspector\runtime\tool_orchestration.py`

The bounded workspace verification reported that the currently exposed filesystem deletion MCP adapter is scoped only to:

`C:\Users\prave`

Therefore that adapter was not used to delete generated directories inside the canonical LBE workspace because doing so would cross its configured scope.

Generated directories left present by that verification:

- `C:\Agents-Memory-Tool-v6-integration\__pycache__`
- `C:\Agents-Memory-Tool-v6-integration\.pytest_cache`
- `C:\Agents-Memory-Tool-v6-integration\build`
- `C:\Agents-Memory-Tool-v6-integration\lbe_guard_inspector.egg-info`

The same verification reported:

```text
LBE IMPLEMENTATION GATE = PASS
HEAD = origin/main = a03c841fb8fe2a3646c03ecd7ae7e491906ea6bf
ahead/behind = 0/0
```

Protected local surfaces remained untouched:

- pre-existing `.agent/` / `.cline/` deletions;
- untracked `lbe-tui/` reference material.

### Operational lesson

A locally exposed filesystem adapter being unable to reach a workspace does **not** imply that LBE lacks a governed deletion owner. Tool exposure/scope and canonical capability ownership are separate facts.

When cleanup is required, use the already-authorized/registered LBE execution path that owns `workspace.delete`; do not broaden an unrelated filesystem adapter merely to reach the target path.

This finding does not authorize deletion by itself. Current intent/gate/workspace authority still governs whether cleanup should execute.

## Evidence discipline for LoopTool UI

The LoopTool view should distinguish:

```text
historical_evidence_non_truth
current_session_evidence_non_truth
current_workspace_mapping
canonical / proven current evidence
```

A successful LoopTool command proves only the layer it observed. Repository truth, local workspace truth, runtime behavior, and UI behavior remain separate acceptance surfaces.
