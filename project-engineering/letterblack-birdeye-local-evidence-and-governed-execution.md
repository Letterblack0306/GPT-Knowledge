# Letterblack BirdEye — Local Evidence, MCP Routing, EYES, and Governed Execution

Updated: 2026-09-01

## Purpose

`Letterblack_BirdEye` is the intended consolidated client-facing local MCP evidence/index and governed-execution surface used alongside GPT-Knowledge, Memory, Skills, GitHub, and live runtime evidence.

Use `project-engineering/letterblack-mcp-ecosystem-and-routing.md` for the complete ecosystem map and ownership direction.

BirdEye is an access/evidence surface. It does not automatically become the canonical owner of every source it exposes.

## Intended client topology

```text
Codex ─────────┐
Cline ─────────┤
OpenCode ──────┤
Gemini ────────┼──> BirdEye MCP
Antigravity ───┤       ├── workspace query
Claude ────────┘       ├── memory query
                        └── skills query
```

The MCP Local architecture validator reports this consolidated topology as structurally/configurationally valid.

## Current authoritative validation status — 2026-09-01

```text
Workspace architecture validator: PASS
Required checks:                 52 PASS
Required failures:               0 FAIL
BirdEye handshake/Skills:        PASS
Global MCP alignment audit:      FAIL
Global active-runtime exclusivity: FAIL
Overall production-ready:        NOT YET PROVEN
```

The latest live audit reports three active competing processes:

```text
mcp-filesystem-server.exe
Context7 MCP
Playwright MCP
```

The audit classification is `LIVE_COMPETING_PROCESS`. The supplied text also says two competing MCP/proxy processes while listing three active competing processes; preserve that discrepancy until the underlying audit/process evidence resolves it.

Additional supplied runtime facts:

```text
Port 3000: not listening
C:\MCP Local\AGENTS.md: not found
```

Therefore the correct current distinction is:

```text
BirdEye/MCP Local intended topology      PASS
Static architecture/config checks       PASS
Live global runtime exclusivity         FAIL
Production readiness                    NOT YET PROVEN
```

## What the 52/52 validation proves

It proves the required architecture/configuration checks represented by the validator passed, including the consolidated BirdEye route, Skills corpus/tool properties, and Memory retrieval architecture.

It does not prove:

- every agent has no separately loaded skill copy;
- every client launcher resolves to the same Python executable merely because BirdEye path arguments look equivalent;
- disabled/removed legacy entries cannot be inherited or reactivated from another configuration layer;
- a disabled/removed entry terminated a process already launched by an earlier client/session;
- live global MCP process exclusivity;
- production readiness.

## Ownership boundary

```text
GPT-Knowledge
  -> durable project/method/status/reference projection and routing

Memory
  -> canonical historical conversations/messages/provenance

Skills
  -> curated reasoning/workflow instructions

BirdEye MCP
  -> intended consolidated client MCP entry point
  -> current local evidence/index access
  -> GPT-Knowledge routing/read access
  -> Memory query/read access
  -> consolidated Skills query/fetch/status
  -> workspace/revision identity
  -> governed local commands
  -> EYES projection/query health controls

GitHub
  -> canonical remote repository/branch/commit/PR/check truth

Runtime/process evidence
  -> current service/process/launcher/executable truth
```

## Skills

BirdEye exposes one consolidated public `skills` tool:

- `skills(operation="status")`
- `skills(operation="query", query=..., prefix=...)`
- `skills(operation="fetch", rel=...)`

`skill-gallery-router` remains routing guidance only. Actual Skills retrieval is performed by BirdEye.

The architecture validator reports:

- one public Skills tool: PASS;
- no legacy Skills APIs: PASS;
- no agent-specific Skills partitions: PASS;
- shared curated corpus: 52 `SKILL.md` files;
- SHA-256 identity for every skill;
- automatic discovery: PASS;
- bounded retrieval: PASS;
- alternate-method discovery: PASS;
- Memory owns no Skills MCP surface: PASS.

Skills vectors remain optional. Current lexical retrieval with SHA identity/duplicate suppression is acceptable by design.

This does not prove an individual agent/client has no separate copied or preloaded skill content outside the validated BirdEye corpus path.

## Memory

Memory remains the canonical historical-content owner. Clients following the consolidated architecture access historical Memory capabilities through BirdEye.

Memory semantic vectors are active in the BirdEye-owned derived semantic index. The derived vector/index layer is retrieval infrastructure rather than content ownership.

## EYES

BirdEye's EYES contract separates durable data/ledger state from disposable query projection state:

```text
canonical source/content owner
        ↓
eye_<domain>_data_01.db
canonical_generation + durable changes ledger
        ↓
replay / deterministic rebuild
        ↓
eye_<domain>_query_01.db
applied_generation
```

```text
lag = canonical_generation - applied_generation
```

Workspace, Memory, and Skills participate according to their ownership boundaries.

## Launcher/executable identity rule

Absolute and cwd-relative BirdEye script paths may be equivalent, but equivalent script-path resolution does not prove equivalent Python runtime identity.

When exact launcher identity matters, verify both:

```text
client's complete configured command + args + cwd
live process executable + full command line
```

Do not infer Python executable identity from `mcp_server.py` path form alone.

## Configuration versus live runtime

A disabled or removed MCP entry may be ignored by the next client launch while a process started earlier continues running.

Therefore:

```text
CONFIG CLEANUP != PROCESS TERMINATION
```

Static configuration must be audited separately from live processes. A runtime-exclusive production-ready claim requires live process evidence, not only configuration inspection.

## MCP process and watcher lifecycle

Legitimate concurrent BirdEye stdio clients and singleton watcher ownership are separate concerns from unrelated competing MCP/proxy processes.

```text
BirdEye client A ─┐
                  ├─> BirdEye stdio connections
BirdEye client B ─┘
                           │
                           └─> separately singleton-leased BirdEye watcher
```

This model does not make non-BirdEye competing MCP/proxy processes acceptable or absent. Current live audit status remains FAIL until the global alignment audit passes.

## Query capabilities

The architecture validator reports PASS for:

- exact symbol;
- exact phrase/error/message;
- lexical content/keyword search;
- path/path-prefix search;
- root selection;
- Memory semantic retrieval;
- fetch;
- status;
- freshness/SHA verification;
- alternate-method/capability discovery.

## Evidence precedence

For present-state MCP/process claims:

```text
live process/runtime evidence
  > active launcher/configuration evidence
  > local source/index evidence
  > canonical GitHub remote evidence
  > durable GPT-Knowledge
  > model inference
```

A configuration PASS must not overwrite a contradictory live-runtime FAIL.

## Current local validation artifacts

Architecture validation:

```text
C:\MCP Local\servers\mcp_local_validation_report.md
C:\MCP Local\servers\mcp_local_validation_report.json
C:\MCP Local\servers\mcp_local_validation.log
```

Global alignment/runtime audit:

```text
C:\MCP Local\mcp_alignment_audit.md
C:\MCP Local\mcp_alignment_audit.json
```

## Maintenance rule

Before making a consequential present-state claim about BirdEye/MCP Local:

1. distinguish intended topology, static configuration, and live runtime state;
2. inspect live process state when exclusivity or production readiness is claimed;
3. inspect complete launcher configuration plus live command line when executable identity matters;
4. do not infer that disabled configuration killed an existing process;
5. preserve canonical ownership for Memory, Skills, GPT-Knowledge, GitHub, and runtime evidence;
6. treat the current production-ready status as **NOT YET PROVEN** while the global alignment audit remains FAIL;
7. update this reference and `letterblack-mcp-ecosystem-and-routing.md` when validated status changes.

## BirdEye local bridge and ChatGPT connector lifecycle recovery — 2026-10-14

**Classification:** local lifecycle recovery PROVEN; ChatGPT-originated acceptance UNVERIFIED.

### Verified runtime facts

- The existing loopback bridge at `127.0.0.1:8765` was restored after its integrity gate rejected a stale `server_sha256` pin. The installed `mini_local_mcp.py` changed on 2026-10-11 while `bridge_config.json` still contained the prior 2026-10-06 hash. The deployed server included configured `read_image`; the configuration pin was reconciled to deployed SHA-256 `3ebb530def56d45daa81d0b9d757a0dd65afb5551869cf3574126544d1b7579b`.
- `BirdEye Local Bridge` is now the sole Scheduled Task lifecycle owner, running as `Letterblack` at logon with `IgnoreNew` multiple-instance policy and bounded task restart. Its maintainer now terminates only the exact configured `local_bridge.py` child before launch, preventing orphaned Python listeners after a task stop/restart.
- A controlled bridge task restart passed authenticated `/health`, Streamable HTTP tool discovery, `write_text -> file_hash -> run_process -> result` smoke, and exact-one-bridge-process verification. Receipt: `bird-20261014-111334-a5f31e17`.
- `BirdEye Connector Tunnel` is now the sole Scheduled Task lifecycle owner for the existing `local-mini` tunnel profile. It runs exactly one `tunnel-client.exe` on `127.0.0.1:8767`; `/healthz` is live and `/readyz` is ready.
- A controlled connector task restart passed exact-one-process verification and a successful required control-plane poll. Receipt: `bird-20261014-111132-e92084b7`.
- Final live snapshot: one bridge process (PID 14804), one tunnel process (PID 28296), authenticated bridge health, ready tunnel, and successful control-plane poll. Receipt: `bird-20261014-111425-ba69306d`.
- The existing private Tailscale Serve configuration was not changed. The connector profile intentionally targets both BirdEye HTTP (`127.0.0.1:8766/mcp`) and the authenticated local bridge (`127.0.0.1:8765/mcp`); this is target configuration, not competing lifecycle ownership.

### Remaining acceptance blocker

A real ChatGPT UI/connector-originated MCP request invoking `workspace_run` has not yet been observed. Local bridge smoke, tunnel readiness, and a successful control-plane poll do not prove that ChatGPT selected this connector, issued the request, delivered the result, or surfaced BirdEye's execution receipt. Completion of remote-connector acceptance requires that end-to-end ChatGPT action and its correlated effect/receipt.