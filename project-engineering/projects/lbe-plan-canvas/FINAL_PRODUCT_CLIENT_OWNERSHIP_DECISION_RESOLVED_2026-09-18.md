# LBE Final Product Client Ownership — Decision Resolved — 2026-09-18

## Resolution

The earlier A/B client-selection fork is superseded.

Current canonical source-owner truth is:

```text
PRODUCT / USER ENTRYPOINT = lbe
VISIBLE PRODUCT IDENTITY  = LBE
EMBEDDED CLIENT/MECHANICS = Cline
RUNTIME AUTHORITY         = LBE
RUST/RATATUI              = reference/integration only
HTML/React                = visual/reference only
```

This is not a new technology-selection decision. It is the current canonical product composition already recorded by later backend source-owner commits.

## Decision provenance

### Earlier product-owner direction

`LBE-INTENT-CLINE-SURFACE-DIRECTION-001` (accepted 2026-08-26) rejected Python/Textual as the final product UI technology and selected reuse of Cline CLI/SDK mechanics under LBE authority.

Its historical migration note did not authorize a copied independent Cline product surface.

### UI technology scope correction

`LBE-INTENT-UI-TECHNOLOGY-SCOPE-CORRECTION-001` (accepted 2026-09-02) correctly removed the earlier HTML-only technology lock and left frontend technology open pending a later explicit transition.

### Reasoning-agent selection

`LBE-INTENT-CLINE-REASONING-AGENT-SELECTION-001` (accepted 2026-09-02) selected the official Cline repository for reasoning/planning/tool-proposal/continuation mechanics under the LBE boundary.

### Later canonical product composition

Later canonical backend commits on 2026-09-17 supersede the older ambiguous product-surface wording:

```text
2e9f9c76ce9303f714bf60cea37296fe54183e1f
Clarify lbe product entrypoint and embedded Cline mechanics

6eee8a53009bbe30c80b04fc7fc3a51423cc0e89
Align product entrypoint with embedded Cline mechanics

429735183e0a4f08e1ef5859ce8871f19d5fef00
Align gate projection with lbe product entrypoint

7499463ad1748e118f3631e18e8bd3b8bfd07053
Register lbe as product entrypoint and Cline as embedded mechanics
```

Those commits establish:

- product identity and user entrypoint = `lbe`;
- LBE remains sole runtime/governance authority;
- Cline source/client mechanics are internal embedded dependencies;
- Rust/Ratatui remains reference/integration only.

Therefore absence of the local Cline tree does not authorize Rust promotion.

## Important intent correction

`LBE-INTENT-FINAL-PRODUCT-SOURCE-RECONCILIATION-001` is **not** a client-selection intent.

Its declared scope is preservation/reconciliation of provider/runtime deltas such as:

- `cli.py`;
- `cline_reasoning_provider.py`;
- `provider_turn_runtime.py`;
- provider/runtime tests;
- `pyproject.toml`.

It must not be misused as authority to select Rust versus Cline.

The machine slice named `FINAL_PRODUCT_SOURCE_RECONCILIATION` is broader than the text of that one ledger intent. Client-source repair must remain consistent with the already-recorded product composition and existing owner/index records.

## Cline source provenance

Current backend integration tooling pins Cline reference source to:

```text
repository = cline/cline
commit     = 952df213ee654633fb3f7abda23a1c1b24e92d7f
```

The integration repository currently has no tracked `cline/` tree. Local `C:\LBE-TUI-Lab\cline\` was removed without a proven owner authorization; `CLEANUP_PLAN.md` only proposed deletion and required an owner decision.

Classification:

`LOCAL_CLINE_TREE_DELETION = UNAUTHORIZED_OR_AT_LEAST_UNPROVEN_AS_AUTHORIZED`

This does not mean an old independent Cline product should be restored blindly. The required repair is to re-establish the **embedded Cline mechanics/client dependency** required by the current LBE product composition.

## Current source contradiction

```text
CANONICAL BACKEND PRODUCT COMPOSITION
  lbe -> embedded Cline client/mechanics -> LBE authority

CURRENT INTEGRATION/LOCAL SOURCE
  no Cline client tree
  Rust lbe.exe remains executable but reference-only
```

Classification:

`SOURCE_DEPENDENCY_MISSING_FOR_SELECTED_PRODUCT_COMPOSITION`

The contradiction is now a source-recovery/composition problem, not an unresolved product-selection problem.

## Required next seam

Do not ask the product owner to choose Cline versus Rust again.

Next work must determine the smallest reproducible way to re-establish the selected embedded Cline mechanics from the pinned upstream source while preserving LBE authority and avoiding a second product/runtime owner.

Required evidence before implementation:

1. exact Cline files/modules required by the current product composition;
2. whether they should be vendored, bootstrapped, packaged, or generated during product install/build;
3. current integration owner for that dependency;
4. no native Cline session/tool/persistence authority enabled;
5. structural LBE shell remains the visible product;
6. Rust remains reference-only unless a future explicit owner decision supersedes current records.

## No-action boundary

Until the dependency-recovery seam is identified:

- do not promote Rust;
- do not redesign the product;
- do not restore arbitrary historical Cline workspace state;
- do not copy an entire uncontrolled Cline checkout into canonical source;
- do not change launcher mode/permissions;
- do not claim final product acceptance.
