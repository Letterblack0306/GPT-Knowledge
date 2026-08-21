# GPT-Knowledge execution-channel protocol

## Purpose

Prevent two local executors from consuming the same browser instruction.

Each execution channel has a distinct envelope and owner.

## 1. AGENT COMMAND

```text
=== AGENT COMMAND START ===
WORKING DIRECTORY: <path>
COMMAND: <command>
=== AGENT COMMAND END ===
```

Owner: legacy/conversational LoopTool transport.

The GPT-Knowledge local runtime MUST ignore this envelope.

Use this only when the intended executor is the existing browser/agent LoopTool that already watches AGENT COMMAND messages.

## 2. LOCAL COMMAND

```text
=== LOCAL COMMAND START ===
WORKING DIRECTORY: <path>
COMMAND: <command>
=== LOCAL COMMAND END ===
```

Owner: `local-runtime/gptk_runtime.py` browser transport.

The runtime binds only to the exact configured chat URL. If that chat is absent, it waits. It must never fall back to another open browser tab.

The matching result envelope is:

```text
=== LOCAL RESULT START ===
COMMAND STATUS: PASS|FAIL
COMMAND HASH: <sha256>
COMMAND: <command>
WORKING DIRECTORY: <path>
EXIT CODE: <code>
...
=== LOCAL RESULT END ===
```

LOCAL COMMAND execution remains constrained to the configured authoritative workspace root. A working directory outside that root is rejected.

## 3. GPT-K structured action

Structured actions do not use a command envelope.

Flow:

```text
LB Workspace
→ /api/workspace-actions request
→ GPT-K local runtime
→ predefined capability collector
→ /api/workspace-actions result
→ LB Workspace journal
```

Allowed v1 capabilities:

- `project.audit`
- `project.verify`
- `project.report-evidence`
- `issue.inspect`

The objective field MUST NOT be converted into arbitrary shell text.

Results record at least:

- requested capability
- resolved capability
- resolved operations
- executor identity
- workspace identity
- classification
- evidence

A request is intent, not proof of execution.

## Remote-truth rule

Repository audits must refresh remote-tracking refs before comparing local HEAD with `origin/main` or `origin/master`:

```text
git fetch origin --prune
```

If fetch fails, the runtime must not report `aligned_with_remote=true` or `false` as fresh remote truth. It reports:

```text
remote_fresh = false
aligned_with_remote = null
```

and preserves the fetch error as evidence.

## Coexistence

The channels are intentionally non-overlapping:

```text
AGENT COMMAND  → legacy LoopTool
LOCAL COMMAND  → GPT-K local browser runtime
GPT-K ACTION   → GPT-K structured capability runtime
```

Therefore the existing AGENT COMMAND LoopTool may continue running while the GPT-K runtime is introduced and tested.
