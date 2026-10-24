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


## Recovery/composition seam correction — 2026-09-18

Further inspection of the canonical integration owner proves that an npm-only bounded `cline/` adapter is not sufficient to close the product-composition gate.

`tools/lbe_product_integration.ps1` currently has two incompatible assumptions:

### Structural/product proof expects bundled Cline CLI/TUI

The contract loader requires or inspects:

- `cline/apps/cli/src/runtime/lbe-tool-adapter.ts`;
- `cline/apps/cli/src/runtime/run-agent.ts`;
- `cline/apps/cli/src/runtime/lbe-tool-adapter.test.ts`;
- `cline/apps/cli/src/tui/interactive-welcome.ts`;
- `cline/apps/cli/src/tui/keyboard-map.ts`;
- `cline/apps/cli/src/tui/views/onboarding/screens.tsx`;
- `cline/apps/cli/src/tui/components/status-bar.tsx`;
- `cline/apps/cli/src/tui/root.tsx`;
- `cline/apps/cli/src/tui/components/lbe-identity.tsx`;
- `cline/apps/cli/src/tui/views/home-view.tsx`;
- `cline/apps/cli/src/tui/views/chat-view.tsx`;
- `cline/apps/cli/src/tui/components/input-bar.tsx`;
- `cline/apps/cli/src/tui/components/chat-message-list.tsx`;
- `cline/apps/cli/src/tui/components/letterblack-loader.tsx`.

The verifier explicitly records:

```text
cline.embedded_surface.present
Bundled Cline CLI mechanics are the active LBE CLI/TUI implementation surface;
absence blocks current product proof.
```

Its proof path also requires:

```text
cline/apps/cli
npx vitest ...
npm run typecheck
```

Therefore `@cline/agents@0.0.75` plus five reference runtime files cannot satisfy the current Cline UI/product contract.

### Build/package still installs Rust as the client

The same canonical integration script currently performs:

```text
cargo build --release --locked
target/release/lbe.exe
-> package client/lbe.exe
-> installer copies lbe.exe to install root
-> generated lbe-launch.ps1 executes installed lbe.exe
```

The generated launcher explicitly fails if the installed Rust client is absent.

Classification:

`CANONICAL_INTEGRATION_OWNER_INTERNAL_CONTRADICTION`

The verifier says Cline CLI/TUI is the active product surface while the build/package path still makes Rust the installed product client.

### Consequence

The next seam is not merely recovering `@cline/agents` or adding a bounded `cline/` directory.

The current integration owner must first be reconciled so that:

```text
contract/proof target
=
build/package target
=
installed launcher target
=
accepted product surface
```

under the already-settled product composition:

```text
product = LBE
entrypoint = lbe
Cline = embedded reasoning/provider/client mechanics
LBE = authority
Rust = reference/integration only
```

Do not implement the npm-only Option A as the product repair. It would provide runtime-agent mechanics but not the required Cline TUI source, and the package would still install Rust.

### First concrete implementation owner

`C:\Agents-Memory-Tool-v6-integration\tools\lbe_product_integration.ps1`

Required next evidence:

1. determine the intended build/package source for the embedded Cline CLI/TUI;
2. determine the minimal reproducible upstream Cline source set required to build that client;
3. replace the current Rust installed-client packaging path only after the Cline/LBE client package path is proven;
4. remove the system-`cline` fallback from normal product composition;
5. preserve Rust build/tests only as reference/regression evidence;
6. prove contract checks, Cline typecheck/tests, product build/package, installed `lbe` launch and real TTY acceptance against the same client revision.


## Explicit product-owner supersession — later on 2026-09-18

The product owner subsequently made a new explicit frontend/product-surface decision after reviewing the amount of existing LBE-owned TUI and HTML work:

```text
PRODUCT / BRAND               = LBE / LetterBlack
VISIBLE TERMINAL UI           = LBE-owned Rust/Ratatui
HTML / REACT                  = preserve as LBE visual/interaction contract + reuse source
CLINE                          = headless reasoning/provider/model/tool-proposal/continuation mechanics only
LBE RUNTIME                   = sole authority
```

This **supersedes this document's earlier conclusion that Rust must remain reference-only and that a bundled Cline CLI/TUI source tree is required as the visible product surface**.

It does **not** supersede:

- Cline as the selected reasoning-agent/provider mechanics source;
- governed `cline_worker` / `@cline/agents` mechanics behind LBE;
- LBE ownership of identity, policy, authorization, execution, ToolReceipt/evidence, persistence/recovery, validation, and completion;
- the locked LBE visual/interaction contract;
- installed TTY/ConPTY and end-to-end acceptance requirements.

Current action is therefore not to restore a copied Cline UI. It is to canonicalize the existing Rust/Ratatui client, reuse the useful LBE HTML/React design work without simulated state, and reconcile build/package/launcher owners so the installed `lbe` command uses that Rust client with headless Cline mechanics behind LBE.
