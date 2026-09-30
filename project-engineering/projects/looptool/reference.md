# LoopTool — Operating Reference

## Purpose

LoopTool is the Letterblack deterministic local execution/evidence bridge used for testing, debugging, inspection, validation, reproduction and bounded command execution through the Workspace Launcher Loop.

It does **not** replace reasoning. The reasoning agent decides what evidence is needed; LoopTool carries one selected local action and returns evidence.

Implementation repository: `Letterblack0306/tools`

Recorded remote repository identity for this projection:

- default branch: `master`
- recorded HEAD: `ddf1c09873599efe5f4976f7dc6456a65474b9b6`

Do not assume this document and runtime implementation remain synchronized. Reinspect current source/runtime before implementation-specific claims.

## Current proven runtime checkpoints

### Historical recall checkpoint — 2026-08-23

A bounded live execution proof is preserved at:

`runtime-proof-2026-08-23.md`

That checkpoint proved this chain by execution:

```text
LoopTool command transport
-> BirdEye local project resolution
-> GPT-Knowledge local-project mapping
-> Memory hashed Cline-session index
-> bounded historical session retrieval
-> matched historical messages
-> session-file SHA256 provenance
-> LoopTool AGENT RESULT + COMMAND HASH
```

Primary execution identity:

```text
COMMAND HASH: FB0CF8F7A9E965E6A2BDE50BAD2AE9FFFB0E93BC53AADEA4A1A824A30C1B7F1A
```

Historical evidence identity from that proof:

```text
SESSION ID: 1787404643663_0sdnz
SESSION MESSAGES SHA256: c0ce4e77a4dac3dc8a76873aff989825ed2df7ce3978a1a8006f6498a703eced
```

The proof is bounded: it considered 50 recent sessions, did not inspect current Access Browser Agent source truth, and did not establish first-class `execution_record_id` / `execution_record_sha256` persistence for every LoopTool run.

### BirdEye MCP local-truth checkpoint — 2026-08-25

Fresh LoopTool execution proved the current local BirdEye MCP path and its authority boundary.

Observed local repository identity:

```text
WORKSPACE: C:\MCP Local\Letterblack_BirdEye
BRANCH: main
LOCAL HEAD: 6a14d4846f036c0cbf34c9bba5e93421706901ac
ORIGIN/MAIN: 6a14d4846f036c0cbf34c9bba5e93421706901ac
AHEAD/BEHIND: 0/0
LOCAL EXCEPTION: ?? config.json.bak-preskills
```

Observed MCP roots:

```text
access-browser-agent -> G:\Developments\46_Accecc_Browser_Agent\Browser Agent [workspace]
gpt-knowledge        -> C:\MCP Local\GPT-Knowledge [knowledge]
memory               -> C:\MCP Local\Memory [workspace]
```

Observed BirdEye index status after adding and tracing the Memory root:

```text
DATABASE: C:\MCP Local\Letterblack_BirdEye\state\workspace.db
FILE COUNT: 82456
HASHED COUNT: 82316
TOTAL: 3.84 GB
MEMORY TRACE FILES SEEN: 571
MEMORY TRACE HASHED: 46
MEMORY TRACE CACHED: 519
MEMORY TRACE LARGE: 6
MEMORY TRACE UNREADABLE: 0
```

Observed project-resolution authority:

```text
source: GPT-Knowledge:project-engineering/projects/workspace/local-projects.json
authority: current_workspace_mapping
```

The current local project resolver proved machine-local existence for the mapped `memory`, `looptool`, `access-browser-agent`, `brew`, and other recorded project paths.

Important interpretation:

```text
BirdEye workspace trace/search/index success = current workspace/file evidence
BirdEye search returning no historical Cline-session match = not a BirdEye failure
Memory MCP = owner for GPT/ChatGPT archive and Cline historical-session retrieval
```

A combined multi-step LoopTool command must not mark BirdEye acceptance as failed merely because a downstream historical-memory lookup returns no match. Classify each authority-layer result independently.

Current bookkeeping anomaly observed in BirdEye status:

```text
last_run.status = root_completed:memory
last_run.completed_at = null
last_run.error = null
```

The trace itself printed `Trace completed successfully`; therefore indexing completion is proven for the observed run, while the null completion timestamp is an inconsistent status field that should be inspected separately rather than treated as indexing failure.

**Use rule:** when current health matters, run a fresh bounded LoopTool probe because a dated proof does not prove future runtime state.

## Local-truth workflow: when, why and how

### Use BirdEye through LoopTool when

Use BirdEye when the question is about current machine-local workspace evidence, including:

- whether a configured project path exists on this machine;
- current repository/workspace identity;
- current Git revision/status evidence;
- whether a file is present in a governed workspace;
- indexed workspace search;
- local file inspection;
- current BirdEye root/index health;
- workspace-scoped command execution when BirdEye policy permits it;
- SHA/integrity evidence for workspace files;
- reconciling GPT-Knowledge project mapping against actual local paths.

Why: BirdEye is the governed current-workspace/local-evidence layer. It is stronger than historical documentation for present-state filesystem/repository claims.

Typical route:

```text
user asks current-local question
-> LoopTool bounded command transport
-> BirdEye MCP diagnostic/tool
-> current local observable
-> classify only what was actually observed
```

Useful BirdEye MCP tools currently exposed include:

```text
local_projects
birdeye_roots
birdeye_status
birdeye_search
birdeye_inspect
workspace_identity
revision_status
workspace_run
workspace_run_sequence
workspace_command_history
```

Diagnostic-harness shape:

```text
py -3 mcp_server.py <tool> --args '<JSON object>'
```

Examples:

```text
py -3 mcp_server.py local_projects --args '{"project":"memory"}'
py -3 mcp_server.py birdeye_roots --args '{}'
py -3 mcp_server.py birdeye_status --args '{}'
py -3 mcp_server.py birdeye_search --args '{"query":"term","roots":"memory","max_results":25}'
```

BirdEye's index is populated through its supported trace command:

```text
py -3 agent.py trace
```

Use a fresh trace when the configured root set changes. Do not assume adding a root to config means it has already been indexed.

### Use Memory MCP when

Use Memory MCP when the question is historical rather than current-workspace truth, including:

- past ChatGPT discussions;
- old decisions or disagreements;
- prior rejected/superseded approaches;
- Cline coding-agent sessions;
- historical tool/runtime traces;
- prior session/source provenance;
- historical conversation/message SHA identity.

Why: Memory owns canonical historical retrieval and provenance. BirdEye may index the Memory **workspace files**, but that does not make BirdEye the owner of the historical corpus stored/retrieved through Memory.

### Use GitHub when

Use GitHub for live remote repository truth:

- current remote branch/commit;
- PR/issue state;
- remote source files;
- checks and remote history.

Why: BirdEye local state and GitHub remote state can diverge. Neither should silently substitute for the other.

### Use GPT-Knowledge when

Use GPT-Knowledge for:

- project IDs and machine-local mapping metadata;
- reusable engineering methods;
- current projected plans/status/reference records;
- routing to the correct owner/tool.

Why: GPT-Knowledge describes and routes authority; it is not itself proof that the local runtime or workspace is currently healthy.

## Historical plan, decision, disagreement and truth retrieval

LoopTool can be used as the bounded local execution path that composes the existing GPT-Knowledge, BirdEye and Memory owners when the task requires recovering prior work. This is not a second memory implementation inside LoopTool.

Use this route when the user asks questions such as:

- what plan or architecture was used before;
- what decision was previously accepted and why;
- what approach was rejected or corrected;
- what an earlier agent tried and what happened;
- what historical evidence exists for a project;
- whether an old statement was later superseded, disproven or made stale;
- what prior implementation/gate/governance mechanism is worth re-checking now.

The intended route is:

```text
user asks about prior plan / decision / disagreement / implementation
-> identify exact project, workspace, repository, feature or subject first
-> use GPT-Knowledge project mapping / routing where applicable
-> choose the historical source that actually owns the evidence
   -> imported GPT/ChatGPT archive for broad conversation history
   -> Cline session history for Cline/tool/runtime-session history
   -> Memory exact/semantic/hybrid retrieval for canonical historical retrieval
-> retrieve the smallest relevant context with source identity/provenance
-> preserve disagreement, correction, rejection and supersession context
-> classify the historical evidence as historical/non-truth until reconciled
-> when the claim concerns current code/config/runtime, verify through GitHub, BirdEye/current workspace or live runtime
-> only then state the current truth
```

### Why this matters

Historical sources contain both useful decisions and statements that were later rejected, corrected, disproven or superseded. Retrieval is therefore not truth promotion.

Keep these operations distinct:

```text
HASH       = identify the exact historical source
INDEX      = make evidence discoverable
RETRIEVE   = find context relevant to the scoped question
RANK       = prioritize likely relevant evidence
AUTHORITY  = identify the evidence class/source
RECONCILE  = compare historical evidence with stronger/current evidence
TRUTH      = conclusion justified by the highest relevant authority
```

A historical statement can remain searchable and provenance-bound even when it is stale or wrong. Do not delete or hide rejected history merely because it is no longer current; preserve it so future agents can understand why a direction changed.

### Scope before ranking

Do not search every historical message and then treat the highest keyword score as the answer. First establish the strongest available identity anchors:

- project ID;
- actual repository/workspace;
- feature/subsystem;
- session/tool/runtime when known;
- time window when material.

Then retrieve/rank inside that scope. Mixed-project sessions can otherwise create convincing false positives.

### Conversation graph and chronology

Imported ChatGPT history is graph-shaped and may contain branches, regenerated responses or edited paths. SQLite row adjacency is not guaranteed conversation chronology.

When disagreement or correction history matters, prefer canonical conversation/node relationships and the active branch rather than assuming `rowid + 1` means the next turn.

### Search normalization

Obvious spelling/transcription variants may be normalized for retrieval only, for example `govenence -> governance` or similar query expansion. Never rewrite the canonical historical text. The original message, IDs and source provenance remain the evidence.

### Historical evidence stop condition

History can answer questions such as "what did we decide?", "what did we reject?", "what did we try?", and "why did the direction change?".

History alone must not answer present-state questions such as:

- what branch is current;
- whether a gate is still wired;
- whether a file currently exists;
- whether a runtime is healthy now;
- whether an old plan is still authoritative.

For those claims, historical retrieval supplies context/candidates and current GitHub/BirdEye/workspace/runtime evidence resolves truth.

Canonical Memory authority guidance is in `../memory/reference.md`.

## When to use

Use LoopTool when deterministic local evidence is required, including:

- repository/workspace inspection;
- reproducing a local failure;
- focused tests;
- debugging with real runtime evidence;
- validating a fix;
- checking branch/revision/runtime identity locally;
- bounded command execution;
- collecting stdout, stderr, exit code and other execution evidence;
- recovering prior plans/decisions/disagreements by composing Memory/BirdEye/GPT-Knowledge through a bounded command;
- explicit user requests to use LoopTool / Workspace Launcher Loop / AGENT COMMAND.

## When not to use

Do not activate LoopTool for:

- general coding questions without local execution requirements;
- architecture discussion without repository/runtime inspection;
- documentation-only review;
- theoretical explanation;
- code suggestions where no deterministic local evidence is required;
- blind retry/fix loops;
- broad destructive cleanup as a substitute for diagnosis;
- "run everything" audits;
- duplicating the same BirdEye action without an explicit cross-validation reason.

## Mandatory operating order

```text
USER OBJECTIVE
-> read current GPT-Knowledge/000_START_HERE.md
-> consult knowledge-index.json
-> load project-engineering/chatgpt-installed-skill-routing.md when Skills are available
-> load only task-relevant GPT-Knowledge methods / installed Skills
-> establish repository / project / branch / revision / workspace / runtime identity
-> if prior-work context matters: retrieve scoped historical evidence before reinventing the plan
-> define one question + authoritative observable + falsifier + acceptance condition
-> only then issue one bounded LoopTool execution action
-> receive AGENT RESULT
-> classify evidence only at the layer actually observed
-> reconcile historical evidence against current truth when present-state claims are involved
-> continue to live runtime/UI acceptance when the claim requires it
```

For project or feature implementation, extension, migration, replacement, planning or unfamiliar-project work, load `project-engineering/project-feature-implementation-plan.md` before implementation-oriented LoopTool commands.

For agent/LLM/browser-agent/runtime/autonomy work, route through `ai-agents/unified-agent-engineering-methods.md`.

For repeated failures, questionable end-to-end claims, stale fixtures/harnesses or destructive recovery ideas, route through `ai-agents/repeated-audit-failures-and-corrective-method.md`.

## Authority separation

```text
GPT-Knowledge
  = reusable engineering method, routing and prior reasoning

Installed Skills
  = task-specific investigation / proof / governance procedures

GitHub
  = live remote repository, branch, commit, PR and check truth

Active local workspace
  = actual files and revision currently being operated on

BirdEye / governed local evidence layer
  = governed local workspace/revision/search/inspect/run evidence when selected

LoopTool
  = deterministic local command transport plus returned execution evidence

Memory
  = canonical historical/durable-memory owner; imported GPT archive and Cline sessions remain historical evidence sources with provenance

Live runtime / rendered UI
  = behavioral and user-visible acceptance truth
```

Never collapse these authorities. Knowledge is not runtime proof. A Skill is not execution authority. A successful command does not prove behavior outside the observable it actually measured. Historical evidence is not automatically current truth.

## Canonical command envelope

```text
=== AGENT COMMAND START ===
WORKING DIRECTORY: <ABSOLUTE PROJECT PATH>
COMMAND: <POWERSHELL COMMAND>
=== AGENT COMMAND END ===
```

The working directory is part of the execution contract. Do not send a consequential command to an assumed workspace.

## Expected result envelope

The documented bridge returns evidence shaped like:

```text
=== AGENT RESULT START ===
COMMAND STATUS: <PASS|FAIL|...>
COMMAND HASH: <SHA-256>
WORKING DIRECTORY: <ABSOLUTE PROJECT PATH>
COMMAND: <COMMAND>
EXIT CODE: <CODE>
...
=== AGENT RESULT END ===
```

Returned stdout/stderr/runtime evidence should be evaluated directly. Do not infer missing evidence.

## Evidence rules

- Command emitted ≠ command executed.
- Exit code `0` ≠ feature acceptance.
- Focused test pass ≠ end-to-end proof.
- Repository source proof ≠ runtime behavior proof.
- Runtime behavior proof ≠ rendered user-visible acceptance unless the rendered observable was actually checked.
- Historical recall evidence ≠ current workspace truth.
- Historical retrieval rank ≠ authority.
- A rejected or superseded historical statement remains useful evidence of what changed, but must not silently reappear as current guidance.
- A dated proof ≠ proof of current health without revalidation.
- A timeout can be product failure, dependency/configuration block, transport failure or stale harness assumption; classify before changing code.
- Workspace and revision identity must be known before local evidence is treated as authoritative.
- A multi-step LoopTool command can contain mixed outcomes; do not convert a downstream `NO_MATCH` from a different authority into failure of an earlier successful BirdEye workspace check.

## BirdEye and Memory boundary

Use BirdEye when the routed workflow selects it as the governed local evidence layer and its workspace/revision/search/inspect/run capabilities fit the investigation. BirdEye can index the `C:\MCP Local\Memory` workspace for current file/workspace evidence, but it does not become the historical-memory owner by doing so.

Use Memory for canonical historical retrieval and provenance across imported GPT history and Cline-session evidence. A historical Cline session ID returning no match from `birdeye_search` is not evidence that Memory lacks the session and is not a BirdEye failure; query the Memory MCP historical source instead.

Use LoopTool when explicitly requested, when selected as the direct local execution bridge, or when one bounded command must compose those existing owners.

Do not duplicate authority: LoopTool does not become the project-mapping or historical-memory owner merely because it can invoke those owners through a bounded command.

## Deferred recallable execution-record requirement

The stronger reusable requirement is documented at:

`../workspace/TOOL_RECALLABLE_EXECUTION_RECORDS_REQUIREMENT.md`

Current proof does **not** establish that every LoopTool execution already persists `execution_record_id` and `execution_record_sha256`. Treat that requirement as deferred until separately implemented and proven.

## Implementation-specific verification

Before claiming current parser, readiness, duplicate-suppression, approval, timeout/cancellation, session, result-return or UI behavior, inspect the current `Letterblack0306/tools` source/runtime. The operating contract and implementation can drift.

## Current LBE installer audit checkpoint — 2026-09-29

A supplied LoopTool/agent result attempted a bounded compatibility repair in `C:\Agents-Memory-Tool-v6-integration` and failed closed before mutation:

```text
COMMAND HASH: A32EE84FF801402D286D031D91852BE8610CAE4BF9DBAF818A67BF74A376A8ED
STATUS: FAIL
EXIT CODE: 1
REASON: Exact ArgumentList compatibility owner not found; refusing broad edit
```

GitHub current source was then used as the remote truth. `tools/lbe_product_integration.ps1` currently owns `Invoke-Native` using the PowerShell call operator and splatted arguments, so the attempted `$psi.ArgumentList` compatibility target is obsolete. The command therefore demonstrated the desired fail-closed behavior against a stale target; it did not prove a product defect in that function and did not prove a source mutation.

The actual current installer contract is separately proven on remote `main`: `install.ps1` remains the old `python -m py_compile` validation stub, while `tests/test_product_launcher_contract.py` requires delegation to `tools/lbe_product_integration.ps1 -Mode package` and rejects the old stub.

Remote checkpoint: `Letterblack0306/LBE_Presistent_Agent_wall@4f1449a41c69e7cb5354cc76cb2ed8460512121a`.

Interpretation rule for future LoopTool use: **do not reconstruct or revive an obsolete implementation owner merely because an agent result names it. Reconcile the exact current source owner first, then issue the smallest repair.** Installed product and PTY/ConPTY acceptance remain separate runtime gates.


## RealityScan bounded-command path checkpoint — 2026-09-30

A user-supplied LoopTool/agent result attempted to inspect the current RealityScan aligned project from:

```text
WORKING DIRECTORY: D:\2026\SAM_GINIE\jpg MODEL\capture_Reality
COMMAND HASH: 48AF5AE9A11795E97766FAAD0AF0D4DE13E7D6E7EDACDF627646A758C2A83816
STATUS: FAIL
EXIT CODE: 1
```

The failure was caused by the executed target path:

```text
D:\2026\SAM_GINIE\jpg MODEL\capture_Reality_3D_mode 2l_aligned.rsproj
```

which omitted the directory separator between `capture_Reality` and `_3D_mode 2l_aligned.rsproj`.

Classification:

```text
COMMAND_EXECUTION = PROVEN
PROJECT_FILE_ABSENCE = NOT PROVEN
ROOT_CAUSE = MALFORMED_TARGET_PATH
SOURCE_MUTATION = NONE
NEXT ACTION = resolve the file relative to the proven working directory, then inspect
```

Do not reinterpret this failure as evidence that the RealityScan project file is absent. Prefer working-directory-relative path construction for filenames beginning with punctuation/underscore or containing spaces:

```powershell
$root = (Get-Location).Path
$p = Join-Path -Path $root -ChildPath '_3D_mode 2l_aligned.rsproj'
```

Before failing on an expected filename, enumerate `*.rsproj` in the established working directory and report the exact candidates. This separates a stale/mistyped filename from an actually missing artifact.

GitHub current-source cross-check on 2026-09-30: `Letterblack0306/Letterblack_BirdEye` current `loop_mcp_server.py` exposes governed `workspace_run` and `workspace_run_sequence`, and their tool descriptions explicitly state that browser debugging/CDP is not required. Canonical merge evidence: `0401f69a7ee7dbb5037e2bb0fc5b12bcd5bd2cc7` ("feat(loop): expose governed local command execution").

Interpretation rule: if the ChatGPT runtime does not surface these MCP actions, classify that as a **tool-exposure/runtime integration gap**, not as absence of LoopTool capability in canonical BirdEye source. Continue using the authorized AGENT COMMAND relay when that is the available execution path.


## RealityScan aligned-project existence checkpoint — 2026-09-30

A fresh user-supplied LoopTool result succeeded against the bounded working directory:

```text
WORKING DIRECTORY: D:\2026\SAM_GINIE\jpg MODEL\capture_Reality
COMMAND HASH: 6BE9AA155EC1BC49430873EF0D601FEEC52E7517CE2976F14AD4A3A6C93586A2
STATUS: PASS
EXIT CODE: 0
DURATION: 1.29s
```

The command enumerated the local RealityScan project candidates and proved that the aligned project exists:

```text
_3D_mode 2l_aligned.rsproj
Length: 121045
LastWriteTime: 2026-09-30 07:55:16 local
Full path rooted under:
D:\2026\SAM_GINIE\jpg MODEL\capture_Reality
```

The same project contains source image records beginning with `..\DSC00152.jpg` and component records backed by sidecar SFM files. The observed excerpt included component records such as:

```text
Component 5 (23) -> sfm209.dat
Component 6 (23) -> sfm210.dat
Component 7 (23) -> sfm211.dat
Component 8 (19) -> sfm212.dat
Component 0 (24) -> sfm213.dat
Component 1 (24) -> sfm214.dat
Component 2 (24) -> sfm215.dat
Component 3 (24) -> sfm216.dat
Component 4 (24) -> sfm217.dat
Component 5 (24) -> sfm218.dat
```

Interpretation boundary:

```text
ALIGNED_PROJECT_EXISTS = PROVEN
PROJECT_READABLE = PROVEN
COMPONENT_RECORDS_EXIST = PROVEN
CURRENT_COMPONENT_MEMBERSHIP_BY_IMAGE = NOT YET PROVEN
LATEST/CURRENT COMPONENT SET FROM XML EXCERPT ALONE = NOT YET PROVEN
ALL_COMPONENTS_MERGED = DISPROVEN by the live RealityScan UI evidence supplied in the task context
```

Do not infer image-to-component membership from component names/counts alone. The `.rsproj` component nodes reference `sfm*.dat` sidecars; the next bounded diagnostic should identify the latest/current component records and inspect their SFM sidecars (or an authoritative RealityScan export/UI report) to map actual camera membership before adding cross-component control points.

GitHub current-source revalidation on 2026-09-30: `Letterblack0306/Letterblack_BirdEye@main` `loop_mcp_server.py` blob `5efdb230c116aabce0577b3ec17fe49e8ccbd0eb` still exposes `workspace_run` and `workspace_run_sequence`, with no-CDP execution stated in the tool contract.


## RealityScan current-generation/SFM membership checkpoint — 2026-09-30

Fresh LoopTool evidence:

```text
COMMAND HASH: 72231EF5371F14D7AC2D6A8178CBCEF93DBAE8ADA454D4C694E60C2DDBC06BC3
STATUS: PASS
EXIT CODE: 0
DURATION: 1.28s
WORKING DIRECTORY: D:\2026\SAM_GINIE\jpg MODEL\capture_Reality
```

Observed project facts from `_3D_mode 2l_aligned.rsproj`:

```text
TOTAL_COMPONENT_RECORDS = 258
```

The tail of project order shows repeated component-name generations. The final observed XML records are:

```text
Component 0 (28) -> sfm498.dat
Component 1 (28) -> sfm499.dat
Component 2 (28) -> sfm500.dat
Component 3 (28) -> sfm501.dat
Component 4 (28) -> sfm502.dat
Component 5 (28) -> sfm503.dat
Component 6 (28) -> sfm504.dat
Component 7 (28) -> sfm505.dat
Component 8 (24) -> sfm506.dat
```

All nine sidecars exist and share the aligned project's observed timestamp `2026-09-30 07:55:16`. This supports treating XML indexes 249-257 / SFM 498-506 as the final observed component records in project order, not every historical component record in the file.

Important correction: the parenthesized numbers in names such as `Component 0 (28)` are **not proven camera counts**. RealityCapture/RealityScan history demonstrates that repeated alignment can produce names such as `Component 0 (1)`, `Component 0 (2)` as renamed/suffixed component generations. Therefore the previous probe field named `CameraCount`, which was derived only by regex from the component name, was a parser assumption and must not be used as camera-count evidence.

A bounded ASCII/UTF-16 filename probe over the newest SFM sidecars found no `DSC#####.jpg` strings.

Classification:

```text
PROJECT COMPONENT HISTORY EXISTS = PROVEN
FINAL OBSERVED COMPONENT RECORD SET = PROVEN FROM XML ORDER
FINAL OBSERVED COMPONENT RECORD COUNT = 9
PARENTHESIZED NAME SUFFIX == CAMERA COUNT = DISPROVEN / BAD INFERENCE
ACTUAL CAMERA COUNT PER COMPONENT = NOT YET PROVEN
SFM SIDECARS EXIST = PROVEN
DSC FILENAME MEMBERSHIP EXTRACTABLE BY SIMPLE STRING PROBE = DISPROVEN
IMAGE-TO-COMPONENT MEMBERSHIP = NOT YET PROVEN
ALL COMPONENTS UNIFIED = DISPROVEN
```

Do not keep reverse-engineering RealityScan SFM binaries by heuristic string scans once the bounded probe fails. The next authoritative observable should come from RealityScan itself: select each current component and inspect/export its registered inputs/cameras, or use an official RealityScan report/export/CLI surface if available. The goal is a component -> image membership map that can support verified cross-component bridge-point selection.

GitHub source revalidation on 2026-09-30: `Letterblack0306/Letterblack_BirdEye@main` `loop_mcp_server.py` blob `5efdb230c116aabce0577b3ec17fe49e8ccbd0eb` still exposes governed `workspace_run` and `workspace_run_sequence`; their current descriptions state that browser debugging/CDP is not required.


### RealityScan authoritative membership route — source-verified 2026-09-30

Official current RealityScan documentation confirms these supported CLI surfaces:

```text
selectComponent <componentName>
exportLatestComponents <folderName>
exportSelectedComponentDir <folderName>
exportSelectedComponentFile <fileName>
exportRegistration <fileName> [params.xml]
```

Current RealityScan documentation also states that Registration export can produce an Image List (`.imagelist`) containing the enabled or selected images. Therefore, once a current component is selected, component-to-image membership should be obtained through a supported RealityScan registration/image-list export path rather than by heuristic parsing of `sfm*.dat` binaries.

Use this as the preferred next diagnostic owner for camera membership.


## RealityScan executable-resolution checkpoint — 2026-09-30

Fresh user-supplied LoopTool evidence:

```text
COMMAND HASH: CA315C6FB80055B96D60EAA1A2F4D5DFE1A3418A76D1BC6FD1764F14074EECAE
STATUS: FAIL
EXIT CODE: 1
WORKING DIRECTORY: D:\2026\SAM_GINIE\jpg MODEL\capture_Reality
ERROR: REALITYSCAN_EXE_NOT_FOUND
```

The command only checked these executable-resolution routes:

```text
C:\Program Files\Epic Games\RealityScan\RealityScan.exe
C:\Program Files\Capturing Reality\RealityCapture\RealityCapture.exe
Get-Command RealityScan.exe
```

Classification:

```text
COMMAND_EXECUTION = PROVEN
PROJECT_FILE_CHECK = PASSED BEFORE EXECUTABLE RESOLUTION
REALITYSCAN_NOT_INSTALLED = NOT PROVEN
REALITYSCAN_EXECUTABLE_PATH = UNRESOLVED
EXPORT_LATEST_COMPONENTS = NOT EXECUTED
COMPONENT_EXPORT_RESULT = UNTESTED
SOURCE MUTATION = NONE
```

Do not promote `REALITYSCAN_EXE_NOT_FOUND` into product absence. Earlier runtime evidence in the same task showed an active `RealityScan` process being foregrounded for UI inspection; therefore the next bounded owner is the current process executable path and Windows registration/shortcut metadata, not more guessed installation paths.

Preferred bounded resolution order:

```text
Get-Process RealityScan / RealityCapture -> Path / MainModule.FileName
Win32_Process ExecutablePath for matching process names
App Paths registry
Uninstall registry DisplayIcon / InstallLocation
Start Menu shortcut targets
only then a bounded filesystem search under likely vendor/program roots
```

GitHub current-source revalidation on 2026-09-30: `Letterblack0306/Letterblack_BirdEye@main` `loop_mcp_server.py` blob `5efdb230c116aabce0577b3ec17fe49e8ccbd0eb` still exposes governed `workspace_run` and `workspace_run_sequence`, with no-CDP execution stated in the tool contract.


## RealityScan executable-path/runtime-project checkpoint — 2026-09-30

Fresh user-supplied LoopTool evidence:

```text
COMMAND HASH: 81A87A18BF9150CF7919E5C69714B441AF24E971678DFCB7BFADC9A891D9B4FC
STATUS: PASS
EXIT CODE: 0
WORKING DIRECTORY: D:\2026\SAM_GINIE\jpg MODEL\capture_Reality
```

Current running process evidence:

```text
ProcessName: RealityScan
PID: 32924
ExecutablePath: C:\Program Files\Epic Games\RealityScan_2.2\RealityScan.exe
MainWindowTitle: _3D_mode 2l_aligned* saved to D:\2026\SAM_GINIE\jpg MODEL\capture_Reality - RealityScan
```

CIM independently reported the same executable path and showed that the process was originally launched with:

```text
D:\2026\SAM_GINIE\jpg MODEL\capture_Reality\_3D_mode 2l_copy.rsproj
```

Interpretation boundary:

```text
REALITYSCAN_PROCESS_RUNNING = PROVEN
REALITYSCAN_EXECUTABLE_PATH = PROVEN
EXECUTABLE = C:\Program Files\Epic Games\RealityScan_2.2\RealityScan.exe
CURRENT WINDOW TITLE REFERENCES ALIGNED PROJECT = PROVEN
CURRENT WINDOW HAS UNSAVED CHANGES MARKER (*) = PROVEN
PROCESS STARTUP COMMANDLINE PROJECT = _3D_mode 2l_copy.rsproj
CURRENT OPEN DOCUMENT == STARTUP COMMANDLINE PROJECT = NOT ASSUMED
EXPORT_LATEST_COMPONENTS = NOT YET EXECUTED
```

Important rule: process command-line arguments describe how the existing process was launched; they do not prove which project is currently active after in-application open/save-as operations. For bounded CLI work, pass the intended project explicitly and use the proven executable path rather than relying on the already-running GUI process state.

GitHub current-source revalidation on 2026-09-30: `Letterblack0306/Letterblack_BirdEye@main` `loop_mcp_server.py` blob `5efdb230c116aabce0577b3ec17fe49e8ccbd0eb` still exposes governed `workspace_run` and `workspace_run_sequence`, with no-CDP execution stated in the tool contract.


## RealityScan export harness/argument-quoting checkpoint — 2026-09-30

Fresh user-supplied LoopTool evidence:

```text
COMMAND HASH: A49C19B54353DC714FB60406DD7092E85459A42D288EAE12D82EBA4BE2787D77
COMMAND STATUS: FAIL
WRAPPER EXIT CODE: 1
REALITYSCAN PROCESS EXIT CODE: 0
PROCESS ID: 34136
DURATION: 212.41s
RSALIGN_COUNT: 0
FINAL WRAPPER ERROR: NO_RSALIGN_COMPONENTS_EXPORTED
```

The wrapper used:

```powershell
Start-Process -FilePath $exe -ArgumentList @(
  '-load',
  $project,
  '-setMinComponentSize',
  '1',
  '-exportLatestComponents',
  $audit,
  '-quit'
) -PassThru -Wait
```

Both `$project` and `$audit` contain spaces in their absolute paths.

Microsoft PowerShell documentation states that `Start-Process -ArgumentList` joins an array into one space-separated string and that the outer quotes of individual PowerShell strings are not retained. Argument values containing spaces must therefore include escaped double quotes; Microsoft recommends using one ArgumentList string containing the necessary quote characters.

RealityScan's current CLI documentation confirms that `exportLatestComponents folderName` exports components created by the last alignment as `.rsalign` files and that `setMinComponentSize size` controls the minimum component size for that export.

Therefore this run does **not** prove that RealityScan correctly received the intended project and output-folder arguments.

Classification:

```text
REALITYSCAN_EXECUTABLE_LAUNCHED = PROVEN
REALITYSCAN_CHILD_EXIT_CODE_0 = PROVEN
EXPECTED_EXPORT_FILES_PRESENT = DISPROVEN FOR THIS INVOCATION
REALITYSCAN_EXPORT COMMAND CORRECTLY ARGUMENTED = NOT PROVEN
START_PROCESS ARGUMENT TRANSPORT = TEST_HARNESS_FAILURE / MALFORMED FOR SPACE-CONTAINING VALUES
REALITYSCAN exportLatestComponents DEFECT = NOT PROVEN
SAVED PROJECT HAS NO LATEST COMPONENTS = NOT PROVEN
SOURCE/PROJECT MUTATION = NONE PROVEN BY THIS WRAPPER
```

Next action: repeat the same bounded export with explicit quoting preserved in a single `ArgumentList` string (or another argv-safe launcher), print that exact argument string, and inspect the output directory. Do not diagnose RealityScan or the project until the corrected invocation is observed.
