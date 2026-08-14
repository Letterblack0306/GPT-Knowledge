# Governed Repository Change Documentation and Module Health

## Knowledge metadata

- Recorded: 2026-08-14
- Scope: reusable repository-maintenance pattern for long-running projects worked on by GPT/agents and humans
- Canonical use: load before modifying a repository that uses change-documentation gates, agent intent declarations, module registries, maintenance health, or similar governance controls
- Reference implementation: `Letterblack0306/Adobe_AI_Generations-04` demonstrates a strong enforcement pattern through `.ai/intent.json`, local pre-push gates, protected-surface rules, and agent-start documentation. Reuse the principle, not its entire project-specific gate stack.
- Goal: prevent silent architectural drift while keeping maintenance warnings informative rather than bureaucratic blockers

## Core conclusion

Long-running repositories need two separate mechanisms:

```text
1. Change documentation / intent declaration  -> HARD BLOCK
2. Module maintenance registry / health       -> WARNING by default
```

Do not merge these into one generic gate.

The documentation gate exists to ensure every meaningful implementation change leaves durable context: what changed, why, scope, risk, affected runtime/architecture surfaces, and the validation expected.

The module registry exists to keep the repository understandable over time: what modules exist, who/what owns them, where they live, whether they are active, and when they were last reviewed. Staleness should be visible, but age alone must not block legitimate work.

---

## 1. Why this matters

The recurring failure in long projects is not usually lack of coding ability. It is loss of project continuity:

```text
feature added
  -> later agent sees only current code
  -> original reason/constraint is missing
  -> assumptions replace evidence
  -> adjacent behavior is modified
  -> architecture drifts
  -> focused tests pass
  -> repository gradually becomes internally inconsistent
```

A durable change record gives future agents the missing causal context.

A module registry gives future agents a current inventory of the product surface, so modules do not silently disappear from maintenance simply because they are not mentioned in the latest conversation.

This is especially important when multiple GPT/agent sessions work on the same repository over weeks or months.

---

## 2. Mandatory first action in a governed repository

When a repository contains any of the following:

```text
.ai/intent.json
.ai/changes/
governance/module-registry.json
module-registry.json
tools/gates/gate-change-documentation.*
tools/gates/check-module-registry.*
agent governance / change declaration instructions
```

GPT/agents must first determine what the repository's governance contract requires before editing.

Do not treat these files as optional documentation.

The sequence is:

```text
identify repository + branch + current HEAD
  -> read repository agent/governance entrypoint
  -> read current change intent/declaration rules
  -> inspect module registry / health rules
  -> inspect the active feature/module being changed
  -> create/update required change documentation
  -> make bounded implementation changes
  -> update module registry only when module facts changed
  -> run blocking gates + tests
  -> report warning-only maintenance findings separately
```

A repository-specific governance contract outranks this generic guide.

---

## 3. Change documentation gate — blocking

A meaningful source/runtime/configuration change should require a current declaration.

Minimal recommended structure:

```text
.ai/
  intent.json
  changes/
    CHANGE-<date-or-id>-<topic>.md
```

The exact file names are project-specific. The important contract is that the gate can deterministically prove that the current change has documentation.

A useful `intent.json` records at least:

```text
changeType
scope
riskLevel
touchesArchitecture
touchesRuntime
touchesInstaller
touchesRelease
justification
```

A useful durable change record should explain:

```text
objective
active owner/module
files/surfaces changed
why the change is needed
what must remain unchanged
risk / failure modes
validation required
known limitations / deferred work
```

### Blocking rule

If the repository requires a change declaration and the declaration is missing, invalid, or clearly does not describe the current change:

```text
BLOCK commit/push/completion
```

Do not silently create a meaningless placeholder merely to satisfy the gate. The documentation must describe the real implementation scope.

### Why it blocks

The purpose is not paperwork. It creates durable causal evidence for future sessions and prevents a later agent from treating a local implementation detail as accidental or obsolete.

---

## 4. Protected surfaces and break-glass documentation

Some repositories may designate architecture-critical paths such as:

```text
boot/runtime authority
module load registry
contracts/schemas
governance gates
release workflows
security boundaries
```

For those surfaces, a stronger change record may be required before editing.

Typical break-glass record:

```text
exact protected path
reason modification is necessary
impact assessment
compatibility/version implications
validation plan
recovery/rollback plan
```

This is a deterministic governance boundary, not an agent-approval workflow.

The agent may continue reasoning normally, but the repository must reject undocumented mutations to protected authority surfaces.

---

## 5. Module registry — maintenance truth, usually non-blocking

Recommended structure:

```text
governance/module-registry.json
```

Example entry:

```json
{
  "id": "cline-log",
  "owner": "runtime",
  "status": "active",
  "paths": [
    "cline_log_capture.js",
    "main_bootstrap.js"
  ],
  "lastReviewed": "2026-08-14",
  "notes": "Captures latest matching Cline runtime evidence."
}
```

Useful fields may include:

```text
id
name
owner/responsibility
status
paths
entrypoint
runtime dependency
lastReviewed
lastChanged
criticality
notes
```

Do not turn the registry into duplicated architecture documentation. It is an inventory + maintenance-health surface.

---

## 6. Module health classifications

Recommended semantics:

```text
✓ Healthy
⚠ Maintenance caution
✕ Structurally broken
```

### Healthy

Registry entry resolves to expected files/entrypoints and is within the repository's review policy.

### Maintenance caution — non-blocking

Examples:

```text
lastReviewed older than policy threshold
module has no recent validation record
owner/notes incomplete but executable structure remains valid
module has changed since review date
```

This should be surfaced prominently but should not block development merely because time passed.

### Structurally broken — blocking validation

Examples:

```text
required registered module file missing
registry contains duplicate IDs
required entrypoint cannot be resolved
active module references nonexistent owner path
registry JSON/schema invalid
```

These are deterministic integrity failures, not maintenance-age warnings.

---

## 7. Warning-only means warning-only

Do not gradually convert maintenance cautions into hard blockers without an explicit project decision.

Bad pattern:

```text
module not reviewed for 30 days -> all commits fail
```

Better pattern:

```text
module not reviewed for 30 days -> ⚠ visible caution
module file missing              -> ✕ validation failure
change undocumented              -> ✕ hard block
```

This distinction keeps governance useful rather than causing agents to bypass or disable it.

---

## 8. Recommended validation layering

A compact governed repository can use:

```text
npm run check
  -> syntax/static checks
  -> focused tests
  -> change-documentation gate       [BLOCKING]
  -> module-registry structural check [BLOCKING on corruption/missing required modules]
  -> module-maintenance report        [WARNING only]
```

For repositories without npm, use the native project task runner. The architecture matters more than the command name.

Do not claim runtime behavior is proven merely because governance gates pass.

Governance proof and runtime proof remain separate:

```text
governance gates -> change is documented and repository structure is coherent
runtime validation -> feature actually behaves correctly
```

---

## 9. Relationship to runtime and agent authority

This pattern does not make an agent less capable and should not script model reasoning.

Responsibility split:

```text
agent/GPT
  -> understands intent, investigates, designs, implements, updates truthful documentation

repository governance
  -> deterministically requires the documentation and protects critical mutation surfaces

module registry
  -> records current module inventory and maintenance health

runtime/tests
  -> prove actual behavior
```

Do not use a module registry as a keyword router or semantic decision engine.

Do not use the change gate to demand approval for ordinary edits. Its job is durable documentation and integrity, not human-in-the-loop micromanagement.

---

## 10. Reference lesson from Adobe_AI_Generations-04

`Adobe_AI_Generations-04` demonstrates the value of:

- a required agent/governance reading order;
- `.ai/intent.json` as a deterministic change declaration;
- a pre-push chain that fails when required declarations/contracts fail;
- protected paths with stronger break-glass documentation;
- explicit module/load registration and validation.

However, its full gate stack is product-specific and should not be copied mechanically into small repositories.

The reusable minimum is:

```text
change intent + durable change record
module inventory + maintenance health
blocking structural checks
warning-only staleness checks
```

---

## 11. Completion rules for GPT/agents

When working in a governed repository, do not report completion until all applicable items are classified:

```text
change record: present / updated / not required
intent declaration: valid / not required
module registry: updated / unchanged / warning
structural registry validation: pass / fail / not implemented
runtime/tests: exact commands and results
remaining maintenance cautions: listed separately
```

Never say "all good" merely because the documentation gate passes.

Never say a module is broken merely because its review date is old.

Never modify the registry date solely to clear a warning without actually reviewing the module.

---

## 12. Recommended default for new Letterblack repositories

For a new or newly governed repository, start small:

```text
.ai/intent.json
.ai/changes/
governance/module-registry.json
tools/gates/gate-change-documentation.*
tools/gates/check-module-registry.*
```

Then add stronger gates only when the repository has a real failure class that justifies them.

Governance should preserve project memory and architecture, not become a second product that overwhelms the repository.
