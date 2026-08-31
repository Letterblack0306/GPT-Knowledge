# Letterblack Loop Tool — ChatGPT Command Bridge

## Purpose

This document defines the **Letterblack Loop Tool** used by the Workspace Launcher in `Letterblack0306/tools`.

LoopTool is a **bounded command executor, not an agent**. It does not own workspace indexing, historical memory, skill discovery, repository truth, or semantic completion decisions.

Its narrow job is:

1. connect to the Chrome instance already started for a project through Chrome DevTools Protocol (CDP),
2. watch the active ChatGPT conversation for a correctly formatted assistant command block,
3. execute that exact command locally inside the allowed project workspace,
4. capture stdout, stderr, exit code, command hash, and working directory,
5. insert an `AGENT RESULT` envelope back into the ChatGPT composer,
6. continue watching while suppressing duplicate execution.

## Unified Letterblack evidence routing

Use the correct owner before LoopTool:

```text
current local file/index/hash/revision → BirdEye
historical ChatGPT/agent/runtime data → Memory
reusable engineering guidance        → GPT-Knowledge
specialized skill/workflow guidance  → Skills MCP
remote repository/PR/commit truth    → GitHub
bounded local command execution      → LoopTool
```

Historical data may be indexed and SHA-256 identified by BirdEye while still remaining:

```text
root_class = memory
authority = historical
```

That classification controls interpretation, not hashing. A historical file having a SHA-256 does not make the old conversation or runtime record current truth.

For all enabled BirdEye-indexed roots, including historical Memory roots, the current intended indexing behavior is:

```text
new file     → index + SHA-256 immediately
unchanged    → reuse size + mtime + existing SHA; no rehash
changed      → re-read + calculate new SHA-256
removed      → reconcile/delete indexed row
```

LoopTool does not implement or own that indexing flow.

## Canonical implementation

Current implementation source:

- repository: `Letterblack0306/tools`
- runtime file: `browser_loop.py`
- launcher/runtime owner: `main.js`
- expected launch arguments: `browser_loop.py --port <CDP_PORT> --cwd <PROJECT_ROOT>`

Always inspect the current repository implementation before assuming this document still matches runtime behavior.

## How LoopTool is accessed

The normal user path is through the Workspace Launcher UI:

1. Add/select a project row.
2. Set the project folder.
3. Start **Browser** for that row. If the port field is empty, the runtime may allocate an available CDP port.
4. Open the ChatGPT conversation in that managed/reused Chrome instance.
5. Start **Loop** for the project row.
6. Once the loop reports `LOOP_READY`, ChatGPT may request one bounded local action using the command envelope below.

The Loop process connects to:

```text
http://127.0.0.1:<CDP_PORT>
```

and is scoped to the project root passed through `--cwd`.

## Exact command format

```text
=== AGENT COMMAND START ===
WORKING DIRECTORY: G:\Developments\38_Brew_Creative_Agent
COMMAND: git status --short --branch
=== AGENT COMMAND END ===
```

Fields:

- `WORKING DIRECTORY:` absolute directory in which the command must execute.
- `COMMAND:` PowerShell command on Windows, or the supported shell command on another supported host.

The command may span multiple lines because the parser captures everything between `COMMAND:` and `=== AGENT COMMAND END ===`.

## Detection contract

The runtime searches the latest assistant message and looks for:

```text
=== AGENT COMMAND START ===
WORKING DIRECTORY: <absolute path>
COMMAND: <command>
=== AGENT COMMAND END ===
```

Rules:

- the command block must be in an assistant message;
- both delimiters are required;
- both `WORKING DIRECTORY:` and `COMMAND:` are required;
- do not rename the labels;
- do not substitute JSON/XML/tool-call syntax for the envelope;
- do not emit a complete valid envelope merely as documentation while Loop is active unless execution is intended.

## Workspace safety boundary

LoopTool does not accept an arbitrary working directory outside the project root used to launch that Loop instance.

If launched with:

```text
--cwd G:\Developments\38_Brew_Creative_Agent
```

then the root itself and descendants are valid; unrelated paths must be rejected.

The reasoning agent must establish the real workspace path before emitting the command. LoopTool must not be used as a discovery mechanism for an unknown workspace.

## What happens after detection

For a valid command block the runtime:

1. extracts the command and requested working directory,
2. resolves the working directory,
3. verifies it is inside the configured project root,
4. computes a SHA-256 command hash from the resolved working directory plus command,
5. suppresses duplicate execution of the same request/hash according to runtime policy,
6. executes the command,
7. captures stdout and stderr,
8. waits for ChatGPT to become idle,
9. writes the result envelope into the ChatGPT composer and sends it.

The command hash is **execution-request identity/deduplication**, not workspace integrity.

It must not be confused with:

- BirdEye `file_sha256`;
- a root snapshot hash;
- Git `HEAD` SHA;
- Memory record SHA;
- Skills MCP content SHA.

## Result format returned to ChatGPT

```text
=== AGENT RESULT START ===
COMMAND STATUS: PASS
COMMAND HASH: <SHA-256 HASH>
WORKING DIRECTORY: G:\Developments\38_Brew_Creative_Agent
COMMAND: git status --short --branch
EXIT CODE: 0
STDOUT:
<actual stdout>
STDERR:
<actual stderr when present>
=== AGENT RESULT END ===
```

`COMMAND STATUS: PASS` means the process exited successfully according to the LoopTool execution contract. It does **not** automatically prove semantic task completion.

The reasoning agent must inspect the returned result and validate the claimed outcome using the proper authority.

## Correct agent interaction pattern

Preferred flow:

```text
task
→ identify the correct evidence owner
→ retrieve/verify current facts
→ choose exact workspace/target
→ formulate one bounded command
→ execute through LoopTool
→ inspect AGENT RESULT
→ validate semantic outcome
→ choose next action only if still required
```

Typical owner routing:

```text
find/search local files          → BirdEye
current local SHA/revision       → BirdEye
past conversation/runtime        → Memory
specialized skill                → Skills MCP
remote repo state                → GitHub
execute known local command      → LoopTool
live user-visible behavior       → runtime-specific acceptance
```

## Commands versus explanations

Executable:

```text
=== AGENT COMMAND START ===
WORKING DIRECTORY: C:\Project
COMMAND: npm test
=== AGENT COMMAND END ===
```

Non-executable explanation:

```text
I would next run the project's focused test suite after confirming the workspace state.
```

If execution is intended, use the command envelope. If not, do not reproduce a complete executable envelope while Loop is active.

## PowerShell behavior

`browser_loop.py` currently executes Windows commands using PowerShell. Commands must therefore be valid PowerShell syntax on Windows.

Examples:

```text
COMMAND: git status --short --branch
COMMAND: Get-ChildItem -Force
COMMAND: npm test
```

For dependent multiple operations, use explicit PowerShell failure handling where correctness depends on an earlier command succeeding.

## Startup evidence

A correctly attached loop reports:

```text
LOOP_READY CDP=<port> CWD=<project-root>
```

If this evidence is absent, do not assume the bridge is listening.

A missing Python Playwright dependency is a runtime blocker, not a command-envelope formatting failure.

## Important limitations

LoopTool:

- watches ChatGPT pages in the connected Chrome instance;
- reads a valid assistant command envelope;
- executes local shell commands only after a valid envelope is detected;
- constrains execution to the configured workspace boundary;
- suppresses duplicate command requests according to its hash/dedup state;
- returns bounded stdout/stderr evidence;
- does not infer actions from ordinary assistant prose;
- does not search/index the workspace;
- does not recall Memory;
- does not load Skills;
- does not determine repository truth;
- does not decide semantic completion.

The envelope is the transport/execution protocol boundary.

## Agent rule

When a task explicitly says to use **Letterblack LoopTool**, **Workspace Launcher Loop**, **ChatGPT local command loop**, or the **AGENT COMMAND bridge**:

1. establish current facts with the appropriate evidence owner;
2. identify the real active project root;
3. determine one exact bounded command;
4. emit the exact command envelope only when execution is intended;
5. wait for and inspect the returned `AGENT RESULT`;
6. validate the result semantically before claiming success.

Do not confuse LoopTool with MCP tool calls, BirdEye indexing/search, Memory retrieval, Skills MCP, normal terminal markdown, Cline tool calls, or other projects named Loop.

## Canonical minimal template

```text
=== AGENT COMMAND START ===
WORKING DIRECTORY: <ABSOLUTE PROJECT PATH>
COMMAND: <POWERSHELL COMMAND>
=== AGENT COMMAND END ===
```
