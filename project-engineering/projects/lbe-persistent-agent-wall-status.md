# LBE Persistent Agent Wall — Current Project Mirror

## Authority and routing

- Last reconciled: 2026-08-21
- Project repository: `Letterblack0306/LBE_Presistent_Agent_wall`
- Canonical ref checked: `main` at `5250efa97a85a2a12978acb86593d086189b0b63`
- Authority: this is a short navigation mirror. Live LBE source, Git state, machine gates,
  acceptance records, and runtime evidence are authoritative.

```text
GPT-Knowledge -> reusable method and architecture/UI reference
LBE repository -> current source, status, plan, machine gate, acceptance evidence
local validation -> test/debug/runtime evidence only
```

## Current project state

```text
R3-R6F: PROVEN_COMPLETE
CLI_NORMAL_PATH_ACCEPTANCE: PROVEN_COMPLETE
R7_INSTALLED_END_TO_END_ACCEPTANCE: PASS
RELEASE_PACKAGE_READINESS_ACCEPTANCE: PASS
PUBLICATION_PRECHECK: PASS

active_phase: PUBLICATION_VERSION_PREPARATION
active_slice: SET_AND_VALIDATE_CANONICAL_VERSION_2_0_3
status: OPEN
target_version: 2.0.3
implementation_allowed: version-preparation scope only
architecture_changes_allowed: false
publish_allowed: false
```

`2.0.3` is the canonical committed project version. It is **not** recorded here as published.
The exact wheel, isolated install/runtime proof, immediate PyPI absence check, observed trusted
publish workflow, and post-publish verification remain required before that claim can be made.

## Product direction retained from GPT-Knowledge

- The provider/agent reasons; LBE owns workspace/session identity, policy, authorization,
  governed execution, receipts, evidence, persistence, validation, and completion truth.
- Policy-covered capability use is automatic within the granted boundary. Ordinary edits and
  commands do not become approval queues.
- CLI is the primary integration surface; a TUI is a projection of the same persisted contract,
  never a second authority.
- The terminal workspace remains a partially verified product gap, not an accepted interactive
  terminal-IDE claim.

## Canonical LBE documents

Read these in the LBE repository before planning or implementation:

```text
.agent/PROJECT_CONTEXT.md
.lbe/governance/implementation-gates.json
docs/acceptance/CURRENT_IMPLEMENTATION_GATE.md
docs/CURRENT_STATUS.md
docs/IMPLEMENTATION_PLAN.md
docs/design/AGENT_AGENCY_LBE_AUTHORITY_SEPARATION.md
docs/reference/CLI_AGENT_REFERENCE_REVIEW_2026-08-21.md
```

Historical acceptance records preserve their original evidence. Do not rewrite them as current
project direction. If this mirror conflicts with the live LBE gate, update this mirror and follow
the live gate.