# Letterblack BirdEye — Local Evidence, MCP Routing, EYES, and Governed Execution

Updated: 2026-09-29

## 2026-09-29 BirdEye Loop governed-execution runtime reconciliation

Current runtime evidence and canonical GitHub source establish a narrower, newer execution topology than the older browser-relay-only description.

### Proven execution surface

A live `loop_mcp_server.py --stdio` MCP `initialize` + `tools/list` probe returned both:

~~~text
workspace_run
workspace_run_sequence
~~~

Their published descriptions explicitly state that governed local argv execution does **not** require browser debugging or CDP.

Canonical GitHub `main` independently confirms that `loop_mcp_server.py` owns these exposed tools and dispatches them through the existing BirdEye execution/evidence path:

~~~text
workspace_run          -> RunRequest.from_mapping(...) -> run_command(..., CONFIG_PATH)
workspace_run_sequence -> RunSequenceRequest.from_mapping(...) -> run_sequence(..., CONFIG_PATH)
~~~

The command contract is argv-array based. Prefer it over free-form PowerShell/shell wrappers when the task can be expressed directly.

### Important server-surface distinction

`mcp_server.py` on GitHub `main` currently defines `_WORKSPACE_RUN_SCHEMA` and `_WORKSPACE_RUN_SEQUENCE_SCHEMA`, but does not include them in its base `_TOOL_DEFINITIONS` or `_TOOL_REGISTRY`. Therefore:

~~~text
mcp_server.py --stdio       = base BirdEye surface; workspace_run is not currently advertised there
loop_mcp_server.py --stdio  = enhanced BirdEye + Loop surface; workspace_run and workspace_run_sequence are advertised and dispatched
~~~

Do not collapse these into one claim. The no-CDP execution capability is proven for the enhanced Loop MCP surface.

### 2026-09-29 RealityCapture discovery audit

The first LoopTool PowerShell probe against:

~~~text
D:\2026\SAM_GINIE\jpg MODEL
~~~

failed before image enumeration or RealityCapture detection because the relayed command contained `$.Extension` instead of PowerShell's automatic-variable form `$_.Extension`. That result is classified as `TEST_HARNESS_FAILURE`; it did not falsify the folder, image set, or RealityCapture installation.

A corrected follow-up probe then completed successfully and observed:

~~~text
ImageCount        = 224
FirstImage        = DSC00152.jpg
LastImage         = DSC00384.jpg
Folder            = D:\2026\SAM_GINIE\jpg MODEL
RealityCaptureExe = null
~~~

Interpretation:

- the 224-image local source set and folder are runtime-observed;
- `RealityCaptureExe = null` proves only that `Get-Command RealityCapture.exe` and the one explicitly tested legacy install path did not resolve an executable;
- it does **not** prove RealityCapture is absent.

A second bounded discovery probe then inspected three uninstall-registry roots plus the same three known install-path candidates and observed:

~~~text
RegistryMatches  = []
KnownPathMatches = null
~~~

This narrows the result but still does not prove absence. The correct status is:

~~~text
image source set             RUNTIME_PROVEN
RealityCapture executable    UNRESOLVED_EXECUTABLE_LOCATION
RealityCapture not installed NOT PROVEN
~~~

The user's installation claim is now corroborated by current machine launcher metadata.

A third bounded discovery probe inspected Windows App Paths, Epic Games Launcher manifests, Start Menu registrations, and Start Menu shortcuts. It returned three Epic manifests:

~~~text
RealityScan 2.2
  InstallLocation = C:\Program Files\Epic Games\RealityScan_2.2
  LaunchExecutable = RealityScan.exe

RealityScan 2.0.1
  InstallLocation = C:\Program Files\Epic Games\RealityScan_2.0
  LaunchExecutable = RealityScan.exe

RealityCapture 1.5.1
  InstallLocation = C:\Program Files\Epic Games\RealityCapture_1.5
  LaunchExecutable = AppProxy.exe
~~~

No Windows App Paths, StartApps, or Start Menu shortcut matches were returned.

Classification:

~~~text
RealityScan 2.2 Epic installation metadata      RUNTIME_PROVEN
RealityScan 2.0.1 Epic installation metadata    RUNTIME_PROVEN
RealityCapture 1.5.1 Epic installation metadata RUNTIME_PROVEN
RealityCapture direct executable path           NOT YET PROVEN
RealityCapture launch proxy path                 INFERRED from manifest; verify file existence before launch
~~~

Do not rewrite `LaunchExecutable=AppProxy.exe` into `RealityCapture.exe`. The Epic manifest proves the launcher metadata, not that `AppProxy.exe` exists at the composed path or that it supports RealityCapture CLI flags.

A fourth bounded probe then inspected the three launcher-reported install roots and file-version metadata.

Observed:

~~~text
C:\Program Files\Epic Games\RealityScan_2.2
  root exists = true
  RealityScan.exe exists = true
  FileVersion = 2.2.0.119430.RS
  ProductName = RealityScan
  ProductVersion = 2.2.0.119430
  RSNode.exe exists = true
  RegisterApplication.exe exists = true

C:\Program Files\Epic Games\RealityScan_2.0
  root exists = false

C:\Program Files\Epic Games\RealityCapture_1.5
  root exists = false
~~~

Classification:

~~~text
RealityScan 2.2 installed executable       RUNTIME_PROVEN
RealityScan 2.2 product/version metadata   RUNTIME_PROVEN
RealityScan 2.0 Epic manifest              RUNTIME_PROVEN launcher metadata
RealityScan 2.0 current install root       DISPROVEN
RealityCapture 1.5 Epic manifest           RUNTIME_PROVEN launcher metadata
RealityCapture 1.5 current install root    DISPROVEN
RealityCapture AppProxy.exe current file   DISPROVEN at manifest-reported root
~~~

The launcher records for RealityScan 2.0.1 and RealityCapture 1.5.1 are therefore stale/orphaned with respect to their manifest-reported install roots. Current machine evidence identifies RealityScan 2.2, not RealityCapture 1.5.1, as the live installed photogrammetry application.

Do not promote `RealityScan.exe exists` into CLI compatibility or successful reconstruction. The next bounded observable is a non-destructive RealityScan version/help invocation through an authorized execution path, followed by a minimal project/import operation only if the CLI contract is confirmed.


### Governed-execution policy boundary

GitHub `main` for `workspace_bridge.py` shows that `workspace_run` is intentionally policy-restricted. It allows selected Git, npm, Node workspace-script, and Python module commands; arbitrary executables are rejected as `command not allowlisted`, shell wrappers are forbidden, and absolute/path-escaping arguments are rejected.

Therefore the enhanced no-CDP BirdEye Loop surface is **not equivalent to unrestricted local process execution**. In particular, current source does not authorize launching an external `RealityCapture.exe` directly through `workspace_run`.

Use the evidence/index layer to locate the executable and a currently authorized execution path for discovery. If RealityCapture itself must be launched, either use an already-authorized external bridge/LoopTool route or deliberately extend BirdEye governance with a bounded RealityCapture capability; do not bypass the command policy.


## 2026-09-27 live census and ownership/provenance update

Newer live BirdEye evidence supersedes the older September 1 runtime snapshot for the specific capabilities below. Older process-exclusivity observations remain historical unless freshly revalidated.

Current supplied BirdEye status:

~~~text
Unified EYES generation lag = 0
workspace projection        = current
memory projection           = current
skills projection           = current
query projector             = live
canonical EYES database     = operational
~~~

The LBE workspace root resolves explicitly as:

~~~text
workspace identity = agents-memory-tool-v6-integration
root               = C:\Agents-Memory-Tool-v6-integration
indexed files      = 874
hashed files       = 826
~~~

### Repository Census V1

BirdEye now has an external, deterministic repository-census layer derived from its inventory pattern. Generated audit artifacts remain outside the product repository under BirdEye-owned state.

Accepted census profile reported against the launcher checkpoint:

~~~text
FILES DISCOVERED        529
FILES CLASSIFIED        529
SOURCE FILES            227
SOURCE FILES PARSED     227
PARSE FAILURES          0
IMPORTS EXAMINED        1643
LOCAL RESOLVED          672
EXTERNAL                971
UNRESOLVED IMPORTS      0
UNEXPLAINED FAILURES    0
CENSUS / COVERAGE       PROVEN / COMPLETE
~~~

OPEN STATIC FINDINGS = 0 is bounded to Census V1 import/classification rules. It does not prove the absence of ownership, architecture, runtime, governance, or behavioral defects.

### Ownership / Provenance V1.5

BirdEye also records ownership provenance separately from symbol presence. The initial scan reported:

~~~text
ownership records             455
OWNER_PROVEN                    4
OWNER_CANDIDATE               189
BLOCKED_HISTORY_REQUIRED        3
COMPATIBILITY_WRAPPER           3
MULTIPLE_OWNER_CANDIDATES      28
OWNER_FROM_OTHER_BRANCH       228
unexplained scan failures       0
~~~

Interpretation rule:

~~~text
scan coverage complete != ownership resolution complete
same basename/symbol    != same authority
branch-only copy        != live authority
duplicate symbol        != duplicate effect owner
~~~

Cross-branch/worktree/history evidence is retained as provenance and blocker input. Canonical ownership is established by tracing the live entrypoint/caller/consumer/effect path, not by filename, Git author, branch presence, or PROJECT_INDEX registration alone.

BirdEye now separates:

~~~text
symbol ownership
effect ownership
persistence ownership
entrypoint ownership
compatibility role
authorized mutation target
~~~

This supports the LBE OWNER_AUTHORITY_BLOCKER: BirdEye supplies evidence and conflict classifications; LBE governance decides whether a mutation is authorized.

Protected checkpoint state reported after the first ownership reconciliation:

~~~text
CKPT-LAUNCHER-CLEAN-INSTALL-1d89882      PROTECTED
CKPT-BRD-OWNERSHIP-RECONCILIATION-001    PROTECTED at LBE HEAD 1dd5a50
~~~

Future scans should be incremental: compare hashes and dependency/ownership edges, reopen only affected findings/checkpoints, and avoid re-auditing already protected slices without contradictory evidence.

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
