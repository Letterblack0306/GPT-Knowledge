# GPT-Knowledge ChatGPT App / MCP Capability Map

## Status

Canonical capability map for packaging GPT-Knowledge as the first App inside the proposed `Letterblack Engineering` plugin.

Verified against current GPT-Knowledge `main` and current OpenAI Apps/MCP guidance on 2026-08-21.

This document is an implementation-boundary map, not runtime authority.

## Governing method

Use `project-engineering/evidence-driven-engineering-plugin-contract.md` as the orchestration contract.

The App exposes data/actions. The `evidence-driven-engineering` Skill decides when to use them.

## Current repository shape

GPT-Knowledge is currently a static Vercel workspace plus serverless API routes.

`package.json` contains only the static build script. `scripts/build-vercel-static.mjs` publishes the workspace UI and only project files explicitly referenced by the workspace registry.

Current API routes:

- `api/workspace-actions.js`
- `api/workspace-text.js`
- `api/save-workspace-state.js`
- `api/workspace-config.js`

No MCP server or `/mcp` endpoint is currently present in the repository.

## Existing capabilities

### 1. Project action request/result bridge

Owner: `api/workspace-actions.js`

Classification: `EXISTING + PROVEN_SOURCE`

Existing behavior:

- supports projects `lbe`, `access-browser-agent`, `brew`, `looptool`;
- supports bounded capabilities `project.audit`, `project.verify`, `project.report-evidence`, `issue.inspect`;
- GET returns recent or pending action state;
- POST `operation=request` writes a durable request under `project-engineering/projects/workspace-actions/<project>/requests/`;
- POST `operation=result` writes the corresponding durable result;
- result schema already carries classification, executor identity, workspace identity, resolved operations, evidence, timestamps and errors;
- execution policy is explicitly `read-only-evidence` for requests.

Plugin implication:

Do not build a second request queue. MCP tools for bounded verification should adapt to this existing contract or a versioned successor.

Candidate MCP mapping:

- `request_project_verification(...)` -> existing `operation=request`
- `get_project_action_status(...)` -> existing GET recent/pending
- future local bridge continues resolving the request and posting `operation=result`

### 2. Project notes/documents content store

Owner: `api/workspace-text.js`

Classification: `EXISTING + PROVEN_SOURCE`

Existing behavior:

- GET lists project notes/documents or reads one named file;
- POST writes `.md`, `.txt` or `.json` content to GitHub main;
- project and kind allowlists are enforced;
- file names and payload size are bounded;
- JSON payloads are validated;
- writes return Git commit and file SHA.

Candidate MCP mapping:

- `list_project_content(project, kind)`
- `read_project_content(project, kind, name)`
- later governed `write_project_content(...)`

The first ChatGPT App version should expose read operations before general content mutation.

### 3. Workspace annotation persistence

Owner: `api/save-workspace-state.js`

Classification: `EXISTING + PROVEN_SOURCE`

Existing behavior:

- saves sanitized workspace UI annotations to `project-engineering/projects/workspace-state/<project>.json`;
- persists done state, pin, notes, phase notes and references;
- writes directly to GitHub main.

Plugin implication:

This is UI/workspace state, not project truth. It should not be used as the canonical `record_project_evidence` implementation.

### 4. Static browser projection

Owners:

- `package.json`
- `scripts/build-vercel-static.mjs`
- `project-engineering/projects/workspace/`

Classification: `EXISTING + PROVEN_SOURCE_AND_DEPLOYED`

Existing behavior:

- Vercel serves the project workspace UI;
- project plan/status/reference files are selectively projected from repository source;
- the production deployment is therefore a projection of GitHub-backed project knowledge, not a separate source of truth.

Plugin implication:

The App should return structured data directly. The existing browser workspace remains a useful human projection and can later be linked/rendered from a widget, but MCP should not scrape the browser UI.

## Missing App/MCP capabilities

### A. MCP transport endpoint

Classification: `MISSING — IMPLEMENTATION REQUIRED`

Evidence:

- repository search shows no MCP implementation;
- current package has no MCP SDK dependency;
- no `/mcp` route exists.

Required addition:

A minimal remote MCP server reachable by ChatGPT, preferably as a new serverless route or a small dedicated service that reuses existing GPT-Knowledge owners.

Do not rewrite the existing static workspace or API routes merely to add MCP.

### B. Canonical read tools for current project status/plan

Classification: `MISSING AS MCP TOOL; UNDERLYING DATA EXISTING + PROVEN`

Underlying truth already exists in project plan/status files and workspace registry.

Required MCP tools:

- `project_status(project)`
- `project_plan(project)`

These should read repository/project projection data directly and return concise structured content.

### C. Knowledge routing/read tools

Classification: `MISSING AS MCP TOOL; UNDERLYING KNOWLEDGE EXISTING + PROVEN`

Existing owners:

- `000_START_HERE.md`
- `knowledge-index.json`
- `INDEX.md`
- project/domain knowledge files

Required tool surface should be minimal.

Preferred first version:

- `search(query, project?)`
- `fetch(id_or_path)`

This follows the connector-like search/fetch pattern and avoids inventing too many overlapping read tools.

`project_status` and `project_plan` may remain explicit because they are high-value deterministic project operations.

### D. Governed project-evidence recording

Classification: `PARTIAL OWNER EXISTS; MCP CONTRACT MISSING`

Existing relevant owner:

`workspace-actions.js` already supports `project.report-evidence` requests/results and durable evidence fields.

Missing behavior:

A canonical mutation that validates source revision, classification and evidence references before updating project `status.json` / `plan.json`.

Do not map ChatGPT directly to arbitrary GitHub file writes for this job.

Target contract:

`record_project_evidence(project, source_revision, classification, observable, evidence_refs, command_hash?, receipt_ids?, active_gate_change?, next_question?)`

The backend must validate the project and evidence invariants and should use the existing action/result architecture or a versioned successor.

### E. BirdEye/local runtime tools

Classification: `NOT PART OF FIRST GPT-KNOWLEDGE APP`

BirdEye and LoopTool/Access remain separate authoritative capabilities.

The first GPT-Knowledge App should expose durable knowledge and bounded request orchestration. Local execution should continue through the existing action bridge until a governed local MCP/tunnel integration is separately proven.

## Security / exposure boundary

### Existing internal write authorization

Classification: `EXISTING BUT NOT SUITABLE AS REMOTE MCP AUTHORITY`

Current workspace APIs use `x-workspace-save-key`; `workspace-config.js` provides a repository-level fallback value.

This must not be treated as the authentication/authorization boundary for a remotely exposed ChatGPT MCP App.

Required pre-exposure hardening:

1. remove reliance on repository-level fallback credentials for externally reachable write paths;
2. move write authorization to deployment secrets and/or the supported ChatGPT App authentication model;
3. separate read-only MCP tools from mutating tools;
4. annotate mutating tools accurately;
5. preserve project/capability allowlists and server-side validation;
6. never return GitHub App private credentials or deployment secrets to the model/widget.

This is a remote-exposure hardening requirement, not evidence that the current internal workspace is defective.

## Recommended first App archetype

`tool-only` for V1.

Reason:

- the existing browser workspace already provides a human UI;
- the immediate value is convenient ChatGPT access to project state, routing and bounded action requests;
- a widget would add complexity before the MCP data/action contract is proven.

Escalate later to a small `react-widget` or decoupled widget only if project-map visualization inside ChatGPT materially improves the workflow.

## V1 MCP tool surface

Keep the first tool surface intentionally small.

### Read-only

1. `project_status`
   - input: `project`
   - returns active gate, source revision, classification, current evidence and next question.

2. `project_plan`
   - input: `project`
   - returns active node and bounded project-map data.

3. `search`
   - input: query plus optional project/domain scope
   - returns compact knowledge hits with stable IDs/paths.

4. `fetch`
   - input: stable ID/path from search or known canonical path
   - returns the requested knowledge content or bounded section.

5. `project_action_status`
   - input: project plus optional state (`recent` or `pending`)
   - adapts existing workspace-actions GET.

### Governed request

6. `request_project_verification`
   - input: project, bounded capability, objective, scope
   - adapts existing workspace-actions request contract;
   - does not itself claim that local execution occurred.

Do not expose arbitrary shell execution in V1.

## Deferred tools

- `record_project_evidence` — after evidence-validation/write policy is implemented and tested.
- `write_project_content` — only if direct content editing from ChatGPT is justified.
- BirdEye `workspace_identity`, `revision_status`, `evidence_search`, `evidence_inspect` — separate integration.
- LoopTool/Access `run_validation_profile`, `run_bounded_acceptance`, recovery mutation — separate governed local integration.

## Tool annotations intent

V1 read tools:

- read-only: true
- destructive: false
- open-world: false where all reads stay inside GPT-Knowledge/GitHub-backed project data

`request_project_verification`:

- read-only: false because it creates a durable request record;
- destructive: false;
- idempotence: false unless a caller-supplied idempotency key is later added;
- open-world: false for the request write itself.

## Current classification table

| Capability | Classification |
|---|---|
| Static GPT-K browser workspace | `EXISTING + PROVEN` |
| Project plan/status source files | `EXISTING + PROVEN` |
| Workspace action request/result queue | `EXISTING + PROVEN` |
| Project notes/documents read/write API | `EXISTING + PROVEN` |
| Workspace annotation persistence | `EXISTING + PROVEN` |
| Remote MCP endpoint | `MISSING — IMPLEMENTATION REQUIRED` |
| `project_status` MCP tool | `MISSING AS TOOL; DATA EXISTS` |
| `project_plan` MCP tool | `MISSING AS TOOL; DATA EXISTS` |
| `search` / `fetch` MCP tools | `MISSING AS TOOLS; KNOWLEDGE EXISTS` |
| bounded project verification request tool | `MISSING AS MCP TOOL; BACKEND CONTRACT EXISTS` |
| validated `record_project_evidence` mutation | `PARTIAL OWNER EXISTS; IMPLEMENTATION REQUIRED` |
| secure remote MCP write authorization | `HARDENING REQUIRED BEFORE MUTATING MCP EXPOSURE` |
| BirdEye/local runtime integration | `DEFERRED / SEPARATE OWNER` |

## Implementation sequence

Do not scaffold the entire plugin at once.

### Gate 1 — remote read-only MCP

Question:

Can a minimal MCP endpoint expose `project_status`, `project_plan`, `search`, and `fetch` by reusing current GPT-Knowledge data owners without changing project truth semantics?

Falsifier:

If the implementation requires duplicating project state, maintaining a second index, or scraping the browser UI, the architecture is wrong.

### Gate 2 — bounded request adapter

Add `project_action_status` and `request_project_verification` on top of `workspace-actions.js`.

Falsifier:

If the MCP layer starts executing local commands itself rather than writing/reading the existing governed request/result contract, ownership has drifted.

### Gate 3 — evidence write policy

Design and prove `record_project_evidence` with explicit evidence/revision validation.

Do not expose general-purpose file mutation as a substitute.

### Gate 4 — optional widget

Only after the tool contract is stable.

## Current position

```text
PLUGIN METHOD CONTRACT
= PROVEN / RECORDED

GPT-KNOWLEDGE EXISTING BACKEND
= MAPPED

REMOTE MCP ENDPOINT
= MISSING — IMPLEMENTATION REQUIRED

FIRST IMPLEMENTATION GATE
= READ-ONLY MCP ADAPTER OVER EXISTING GPT-KNOWLEDGE OWNERS

PRODUCT REWRITE
= NOT AUTHORIZED

LOCAL BIRDEYE / LOOPTOOL MCP EXPOSURE
= DEFERRED
```

## OpenAI alignment

Current OpenAI guidance supports MCP tools as external integrations and recommends explicit, server-validated tool contracts. The Apps SDK build workflow also recommends planning tools before code, using one job per tool, accurate read/write/destructive annotations, and using the standard `search` / `fetch` pattern for connector-like knowledge/data apps.

Re-fetch current Apps SDK deployment/auth/submission documentation immediately before implementation because those contracts can change independently of this capability map.
