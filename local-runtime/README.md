# GPT-Knowledge Local Runtime

## Purpose

`gptk_local_agent.py` is the local execution companion owned by the GPT-Knowledge repository.

It connects the deployed LB Workspace to authoritative local project evidence without exposing a general remote shell.

The runtime was derived from the standalone Python browser/terminal loop workflow: attach to Chrome over CDP, observe one intended conversation, execute locally, and return evidence. The GPT-K version adds a second structured action transport and makes browser-tab ownership fail-closed.

## Authority model

```text
Browser AI / user
        |
        v
LB Workspace
        |
        | structured action request
        v
/api/workspace-actions
        |
        | outbound polling from local machine
        v
GPT-K Local Runtime
        |
        +--> governed evidence collectors
        |      git identity/status/diff/history/inventory
        |
        +--> exact configured browser chat
               AGENT COMMAND -> workspace-contained execution -> AGENT RESULT
```

The two transports are separate.

### Structured GPT-K actions

Current capabilities:

- `project.audit`
- `project.verify`
- `project.report-evidence`
- `issue.inspect`

These actions are **read-only evidence capabilities**. The request objective is data, not executable shell text. The runtime resolves each capability to predetermined local collectors and posts the exact `resolved_operations` with the result.

A browser AI must compare:

```text
requested_capability
resolved_capability
resolved_operations
```

A material mismatch is `ACTION_MISMATCH` and must not be treated as satisfying the request.

### Browser AGENT COMMAND transport

The existing direct browser workflow remains available for explicit command execution.

The runtime binds only to the exact configured chat URL. It never falls back to the last open tab.

If the configured chat is not present:

```text
TARGET_CHAT_NOT_PRESENT
```

The runtime waits and rescans. When the exact chat appears:

```text
TARGET_CHAT_BOUND
```

Commands are still rejected when their declared working directory is outside the configured workspace root.

## Local state

Runtime state and logs are machine-local, not committed:

```text
~/.gpt-knowledge/runtime/<project>/state.json
~/.gpt-knowledge/runtime/<project>/runtime.log
```

The first successful launch persists the project, workspace, CDP endpoint, target URL, API endpoint, and polling interval so later launches can reuse them.

## First run

From a local GPT-Knowledge checkout:

```powershell
python local-runtime\gptk_local_agent.py `
  --project access-browser-agent `
  --workspace "G:\Developments\46_Accecc_Browser_Agent\Browser Agent" `
  --target-url "https://chatgpt.com/c/<conversation-id>" `
  --cdp-url "http://127.0.0.1:7430"
```

The runtime starts both:

```text
GPT-K action polling
exact-chat browser watching
```

Use `--actions-only` when browser command transport is not required.

## Environment overrides

Supported variables:

```text
GPTK_PROJECT
GPTK_WORKSPACE
GPTK_TARGET_URL
GPTK_CDP_URL
GPTK_ACTION_API
GPTK_WORKSPACE_SAVE_KEY
GPTK_POLL_SECONDS
```

## Browser requirements

For browser command transport, Chrome must expose a CDP endpoint and the configured exact chat must be open in that CDP browser instance.

Install Playwright when browser transport is used:

```powershell
python -m pip install playwright
playwright install chromium
```

Structured GPT-K actions do not require Playwright; run with `--actions-only` if necessary.

## Safety boundary

The structured action endpoint does **not** provide arbitrary remote terminal access.

Do not add an endpoint such as:

```json
{ "command": "<arbitrary shell>" }
```

New autonomous behavior must be added as an explicit capability with deterministic local resolution and a recorded result contract.

## Result lifecycle

```text
REQUEST_RECORDED
      |
      v
ACTION_RECEIVED
      |
      v
ACTION_RESOLVED
      |
      v
ACTION_RESULT_POSTED
```

Only `ACTION_RESULT_POSTED` plus the persisted result in LB Workspace proves local execution occurred.

## Current limitation

BirdEye is not yet invoked directly by v1. The runtime is intentionally structured so a future capability can call BirdEye locally while keeping BirdEye unreachable from the public web. Git and filesystem evidence remain the current deterministic collectors.
