# Letterblack BirdEye — Local Evidence and Governed Execution

## Purpose

`Letterblack_BirdEye` is the local evidence and governed-execution layer used alongside GPT-Knowledge and GitHub.

Use the three sources for different kinds of truth:

```text
GPT-Knowledge
  -> reusable methods, prior reasoning, routing, and durable project guidance

GitHub
  -> canonical remote repository, branches, commits, PRs, checks, and reviewed patch truth

Letterblack_BirdEye
  -> current local workspace evidence, indexed local files, revision identity, local diff/status, and policy-governed command execution
```

BirdEye does not replace GPT-Knowledge as the reasoning/method authority and does not replace GitHub as the normal reviewed patch/PR destination.

## Repository and local role

Canonical repository:

- `Letterblack0306/Letterblack_BirdEye`

BirdEye maintains configured local roots through `config.json`. A representative active configuration includes:

- `developments` -> `G:\Developments` (`workspace`)
- `agents-memory-tool-v6` -> `C:\Agents-Memory-Tool-v6-integration` (`workspace`)
- `gpt-knowledge` -> `C:\MCP Local\GPT-Knowledge` (configured as `knowledge`)

Always verify the current local `config.json`; do not assume these paths are unchanged merely because they are documented here.

### Known root-class implementation discrepancy

Current source must be checked before trusting configured `root_class` labels. In the observed BirdEye implementation, `Context.load()` reads each configured root but constructs it with `root_class="workspace"` rather than preserving the configured value. A live `agent.py roots` trace therefore reported `gpt-knowledge` as `workspace` even though `config.json` declares it as `knowledge`.

Treat this as a current implementation discrepancy, not intended architecture. Until fixed and runtime-proven, do not claim that configured trust classes are preserved merely because `config.json` contains them.

## Capability surface

The BirdEye MCP server exposes these relevant tools:

### Local evidence and index tools

- `birdeye_search` — ranked search across the live SQLite workspace index.
- `birdeye_inspect` — inspect one indexed file by virtual path.
- `birdeye_roots` — list configured roots and trust classes.
- `birdeye_status` — inspect SQLite index health.
- `workspace_identity` — read workspace and Git revision identity evidence.
- `revision_status` — read branch/HEAD/upstream/dirty-state evidence bound to the observed revision.

### Governed execution tools

- `workspace_run` — execute one argv-array command inside a verified workspace under BirdEye policy.
- `workspace_run_sequence` — execute ordered governed commands, normally stopping on first failure.
- `workspace_command_history` — retrieve recent execution journal entries.

These capabilities are implemented and dispatched by the MCP server; they are not documentation-only intentions.

## Execution boundary

BirdEye command execution is intentionally governed.

Commands are passed as argv arrays, not free-form shell strings. The workspace is resolved from configured roots, execution occurs with `shell=False`, and policy decides whether the command is allowed.

Current governance permits bounded diagnostics and validation such as:

- Git status/diff/log/show/branch/rev-parse/ls-files/grep/fetch;
- Node version;
- npm test/lint/check/build;
- Python version;
- pytest/unittest.

The governance file also declares mutation-command categories, but the observed policy has `allowed_write_paths: []`, `max_changed_files: 0`, and `max_patch_bytes: 0`. Therefore do not infer writable/mutating BirdEye authority from the presence of a `mutation_commands` list alone; validate the effective policy and actual execution result first.

Current policy explicitly blocks shell wrappers and broad destructive operations such as PowerShell/pwsh/cmd/bash/sh/wsl wrappers, destructive reset/clean/restore patterns, force push, and similar unsafe commands.

Therefore:

> **BirdEye is a governed execution surface, not an unrestricted local shell.**

If an operation is outside BirdEye policy, that does not prove the operation is impossible. It proves BirdEye did not authorize that operation through its current execution boundary. Use another explicitly available and appropriate execution path only when the user/task authorizes it.

## Evidence precedence

For repository/project claims, keep evidence roles separate:

```text
Live runtime proof
  > active local workspace evidence (BirdEye/direct runtime inspection)
  > canonical remote repository evidence (GitHub)
  > project-specific durable guidance
  > general GPT-Knowledge methods
  > model prior knowledge
```

Do not confuse local and remote truth:

- GitHub may be clean while the local workspace is dirty.
- A local file may differ from the active remote branch.
- A passing remote check does not prove the local checkout matches it.
- A BirdEye observation must be bound to the correct configured workspace and current revision.

## Default operating route

For project, repository, agent, CLI, runtime, or debugging work:

```text
1. Read GPT-Knowledge routing/method guidance first when the task is consequential.
2. Verify canonical repository/branch/commit/PR state through GitHub.
3. Use BirdEye when local workspace, revision, diff, file, or governed execution evidence is relevant.
4. Use runtime-specific tooling for behavior that requires live execution or user-visible proof.
5. Keep implementation patches in normal repository-backed review/PR flow unless the user explicitly chooses another workflow.
```

## When BirdEye should be consulted early

Use BirdEye before strong conclusions when any of the following are material:

- the user refers to a local path or current checkout;
- local-vs-remote drift may matter;
- a branch is reported as behind/ahead/dirty;
- an agent claims a file exists, was changed, or was deleted locally;
- current workspace identity or `HEAD` matters;
- tests/build/checks need to be run locally under policy;
- a local file/index search can disambiguate duplicate implementations or stale paths;
- GitHub evidence alone cannot establish current machine state.

## What BirdEye does not prove by itself

BirdEye source presence, index presence, or successful command execution does not automatically prove:

- a UI feature is user-visible and correct;
- a browser/CDP action reached the intended rendered target;
- a service remains running after command completion;
- a remote GitHub branch contains local uncommitted changes;
- an unrestricted operation is authorized merely because another local tool could execute it.

Match the proof to the claim.

## Fallback relationship with broader local execution tools

A broader local execution tool such as the Loop Tool may support operations that BirdEye governance intentionally blocks. Keep the distinction explicit:

```text
BirdEye
  = inspection + indexed evidence + revision identity + governed argv execution

Loop/local execution tool
  = broader interactive/runtime execution according to that tool's own safety and workspace boundary
```

Prefer BirdEye for routine local evidence and allowed diagnostics because it produces workspace-bound governed evidence. Use a broader execution route only when BirdEye policy does not cover the required authorized operation or when interactive runtime behavior must be tested.

## Maintenance rule

Before changing BirdEye architecture, policy, command allowlists, workspace identity rules, MCP schemas, or execution semantics:

1. inspect the current `Letterblack_BirdEye` repository and active local configuration;
2. verify the actual registered MCP tools and policy implementation;
3. distinguish documented behavior from runtime-proven behavior;
4. update this GPT-Knowledge reference when a durable capability or authority boundary materially changes.

Do not let this document become a substitute for current BirdEye source or local runtime evidence.
