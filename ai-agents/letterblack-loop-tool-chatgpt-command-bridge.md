# Letterblack Loop Tool — ChatGPT Command Bridge

## Purpose

This document defines the **Letterblack Loop Tool** used by the Workspace Launcher in `Letterblack0306/tools`. It is not a general-purpose autonomous agent and it is not the unrelated public projects also named "Loop".

Its job is narrow and deterministic:

1. connect to the Chrome instance already started for a project through Chrome DevTools Protocol (CDP),
2. watch the active ChatGPT conversation for a correctly formatted assistant command block,
3. execute that command locally inside the allowed project workspace,
4. capture stdout, stderr, exit code, command hash, and working directory,
5. insert an `AGENT RESULT` envelope back into the ChatGPT composer,
6. continue watching for the next command while suppressing duplicate execution.

## Canonical implementation

Current implementation source:

- repository: `Letterblack0306/tools`
- runtime file: `browser_loop.py`
- launcher/runtime owner: `main.js`
- expected launch arguments: `browser_loop.py --port <CDP_PORT> --cwd <PROJECT_ROOT>`

Always inspect the current repository implementation before assuming this document still matches runtime behavior.

## How the Loop Tool is accessed

The normal user path is through the Workspace Launcher UI:

1. Add/select a project row.
2. Set the project folder.
3. Start **Browser** for that row. If the port field is empty, the current runtime can allocate an available CDP port.
4. Open the ChatGPT conversation in that managed/reused Chrome instance.
5. Start **Loop** for the project row.
6. Once the loop reports `LOOP_READY`, ChatGPT can request a local action by emitting the exact command envelope described below.

The Loop process connects to:

```text
http://127.0.0.1:<CDP_PORT>
```

and is scoped to the project root passed through `--cwd`.

## Exact command format ChatGPT must emit

The detector is based on an explicit envelope. Use this format exactly:

```text
=== AGENT COMMAND START ===
WORKING DIRECTORY: G:\Developments\38_Brew_Creative_Agent
COMMAND: git status --short --branch
=== AGENT COMMAND END ===
```

The fields are:

- `WORKING DIRECTORY:` absolute directory in which the command must execute.
- `COMMAND:` the PowerShell command on Windows, or shell command on supported non-Windows environments.

The command may span multiple lines because the current parser captures everything between `COMMAND:` and `=== AGENT COMMAND END ===`.

## Detection contract

The current runtime searches the **latest assistant message** in ChatGPT and looks for this structure:

```text
=== AGENT COMMAND START ===
WORKING DIRECTORY: <absolute path>
COMMAND: <command>
=== AGENT COMMAND END ===
```

Important rules:

- The command block must be in an **assistant message**, not merely described in prose.
- `AGENT COMMAND START` and `AGENT COMMAND END` are the action delimiters.
- Both `WORKING DIRECTORY:` and `COMMAND:` are required.
- Do not rename these labels.
- Do not substitute JSON, Markdown metadata, XML, tool-call syntax, or a normal fenced code block for this envelope.
- A Markdown code fence may visually contain the envelope, but the envelope text itself must remain intact because detection is text/regex based.
- Do not emit the envelope as an example when Loop is active unless execution is actually intended. A valid block is executable intent.

The implementation is case-insensitive and tolerant of whitespace around the markers, but agents should still emit the canonical form above rather than relying on parser tolerance.

## Workspace safety boundary

The Loop Tool does **not** accept arbitrary working directories outside the project root used to launch that Loop instance.

If Loop was launched with:

```text
--cwd G:\Developments\38_Brew_Creative_Agent
```

then this is valid:

```text
WORKING DIRECTORY: G:\Developments\38_Brew_Creative_Agent
```

and a descendant such as this is also valid:

```text
WORKING DIRECTORY: G:\Developments\38_Brew_Creative_Agent\brew
```

but an unrelated path is rejected and returned to ChatGPT as a failed result.

Therefore the agent must use the project row's actual workspace path. Never guess a path.

## What happens after detection

For a valid command block the runtime:

1. extracts the command and requested working directory,
2. resolves the working directory,
3. verifies it is inside the configured project root,
4. computes a SHA-256 command hash from the resolved working directory plus command,
5. suppresses immediate duplicate execution of the same command/hash,
6. executes the command,
7. captures stdout and stderr,
8. waits for ChatGPT to become idle,
9. writes the result envelope into the ChatGPT composer and sends it.

The current command timeout is **300 seconds**.

## Result format returned to ChatGPT

Loop returns evidence in this shape:

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

`COMMAND STATUS` is `PASS` when the exit code is `0`; otherwise it is `FAIL`.

The result is runtime evidence. ChatGPT should read the returned status/output before issuing the next action. It must not assume a command succeeded merely because it emitted an `AGENT COMMAND` block.

## Correct agent interaction pattern

Use one bounded action, wait for its result, inspect the evidence, then decide the next action.

Example first turn:

```text
=== AGENT COMMAND START ===
WORKING DIRECTORY: G:\Developments\38_Brew_Creative_Agent
COMMAND: git status --short --branch
=== AGENT COMMAND END ===
```

After Loop sends the corresponding `AGENT RESULT`, the agent may issue the next required command.

Do **not** repeatedly emit the same command hoping for another execution. The runtime intentionally suppresses duplicate command hashes.

## Commands versus explanations

When Loop is active, distinguish executable instructions from human-readable discussion.

Executable:

```text
=== AGENT COMMAND START ===
WORKING DIRECTORY: C:\Project
COMMAND: npm test
=== AGENT COMMAND END ===
```

Non-executable explanation:

```text
I would next run the project's test suite after confirming the workspace state.
```

If execution is intended, use the command envelope. If execution is not intended, do not reproduce a complete valid command envelope.

## PowerShell behavior

`browser_loop.py` currently executes Windows commands using:

```text
powershell.exe -NoProfile -Command <COMMAND>
```

Therefore commands must be valid PowerShell syntax on Windows.

Examples:

```text
COMMAND: git status --short --branch
```

```text
COMMAND: Get-ChildItem -Force
```

```text
COMMAND: npm test
```

For multiple PowerShell operations, use normal PowerShell composition and explicit failure handling where correctness depends on previous commands succeeding.

## Startup evidence

A correctly attached loop reports:

```text
LOOP_READY CDP=<port> CWD=<project-root>
```

If this evidence is absent, do not assume the bridge is listening.

A missing Python Playwright dependency reports `LOOP_DEPENDENCY_MISSING` and identifies the Python executable/install command. Treat that as a runtime blocker, not as an agent-command formatting failure.

## Important limitations

The current implementation:

- watches ChatGPT pages in the connected Chrome instance,
- selects the latest matching ChatGPT page,
- reads the latest assistant message,
- executes local shell commands only after a valid command envelope is detected,
- prevents the requested working directory from escaping the configured project root,
- suppresses immediate duplicate command hashes,
- truncates very large stdout/stderr before returning it to ChatGPT,
- does not turn ordinary assistant prose into commands,
- does not infer intent from natural-language phrases such as "run tests".

The envelope is the protocol boundary.

## Agent rule

When a task explicitly says to use the **Letterblack Loop Tool**, **Workspace Launcher Loop**, **ChatGPT local command loop**, **AGENT COMMAND bridge**, or asks for the format that makes the local loop take action:

1. inspect this document,
2. verify the current `Letterblack0306/tools/browser_loop.py` implementation when repository access is available,
3. identify the real active project root,
4. emit only the exact `AGENT COMMAND` envelope when local execution is intended,
5. wait for and inspect the `AGENT RESULT` before claiming success or choosing the next command.

Do not confuse this protocol with MCP tool calls, normal ChatGPT tool calls, terminal markdown, Cline tool calls, or other projects named Loop.

## Canonical minimal template

```text
=== AGENT COMMAND START ===
WORKING DIRECTORY: <ABSOLUTE PROJECT PATH>
COMMAND: <POWERSHELL COMMAND>
=== AGENT COMMAND END ===
```

That is the minimum action format the current Loop detector expects.