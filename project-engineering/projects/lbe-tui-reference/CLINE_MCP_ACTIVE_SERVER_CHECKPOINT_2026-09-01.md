# Cline MCP Active Server Checkpoint — 2026-09-01

## Classification

`REFERENCE_NON_CANONICAL`

This record captures the current validated Cline MCP host configuration relevant to the LetterBlack/LBE workspace. It is an environment/reference checkpoint, not canonical LBE runtime truth.

## Active server set

```text
context7    enabled
playwright  enabled
shadcn      enabled
memory      enabled
birdeye     enabled
filesystem  intentionally disabled
```

## Validation

- `context7`: enabled and command resolves.
- `playwright`: enabled and command resolves.
- `shadcn`: enabled and command resolves.
- `memory`: enabled; PowerShell server script and configured working directory exist.
- `birdeye`: enabled; configured Python executable, working directory, and `mcp_server.py` exist.
- `mark3labs_filesystem`: intentionally disabled.

The disabled `mark3labs_filesystem` registration points to an executable that is not currently present. This is harmless while `disabled: true`; enabling it would fail to start unless the executable is restored. The broad filesystem MCP is not the governed local evidence path for this workspace; BirdEye remains the intended local evidence/inspection route.

## Operational note

MCP configuration correctness does not revive an already-dead stdio process. After configuration changes, or after a prior `Transport closed` condition, the Cline/MCP host must reload or restart the MCP session so the server process is recreated from the current configuration.

## Hardening note

Current `npx` registrations using `@latest` are operationally valid but are not deterministic across future package releases. Pinning explicit package versions for Context7, Playwright MCP, and shadcn MCP is a recommended hardening step, not a current blocker.

## LBE boundary

This configuration must not be interpreted as moving authority into Cline or any MCP server. For the LBE product:

- LBE remains runtime/governance/authorization/execution/evidence/receipt/persistence/completion authority;
- BirdEye is the governed local evidence/index MCP reference path;
- Memory remains the historical-memory owner even when exposed through an MCP client;
- Context7, Playwright, and shadcn are external capabilities/reference services and do not become LBE owners;
- the intentionally disabled broad filesystem server should not be used as a substitute for BirdEye workspace evidence.

## Current classification

```text
CLINE MCP CONFIGURATION STRUCTURE      VALIDATED
CONTEXT7                               ENABLED / COMMAND RESOLVES
PLAYWRIGHT                             ENABLED / COMMAND RESOLVES
SHADCN                                 ENABLED / COMMAND RESOLVES
MEMORY                                 ENABLED / LOCAL PATHS EXIST
BIRDEYE                                ENABLED / LOCAL PATHS EXIST
MARK3LABS FILESYSTEM                   INTENTIONALLY DISABLED
MISSING FILESYSTEM EXECUTABLE IMPACT   NONE WHILE DISABLED
STALE MCP PROCESS RECOVERY             RELOAD/RESTART CLIENT SESSION REQUIRED
PACKAGE VERSION PINNING                RECOMMENDED HARDENING, NOT BLOCKER
```
