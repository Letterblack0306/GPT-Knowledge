# LBE Persistent Agent — Acceptance and Implementation Routing

## Authority

- Last reconciled: 2026-09-05
- Project repository: `Letterblack0306/LBE_Presistent_Agent_wall`
- This page routes work; it does not create acceptance state or authorize a slice.

Use this order before LBE work:

```text
1. docs/README.md
2. .agent/PROJECT_CONTEXT.md
3. .lbe/governance/implementation-gates.json
4. the machine-declared active plan
5. docs/acceptance/CURRENT_IMPLEMENTATION_GATE.md
6. docs/CURRENT_STATUS.md and docs/IMPLEMENTATION_PLAN.md
7. current source, Git, tests, and runtime evidence
8. GPT-Knowledge references only where relevant
```

## Current route

```text
R7_INSTALLED_END_TO_END_ACCEPTANCE: PASS
active phase: TERMINAL_WORKSPACE_PRODUCT_IMPLEMENTATION
active slice: VISIBLE_TRUTHFUL_TERMINAL_WORKSPACE_FOUNDATION
terminal-workspace foundation: OPEN
publication preparation: PAUSED (target 2.0.3 retained)
publish: locked
architecture changes: allowed only in the active foundation scope
```

The historical installed coding-composition failure is repaired evidence, not the current state.
Do not route work as `R7 FAIL`, do not reopen accepted R6C/R6E owners, and do not claim the
terminal workspace or PyPI publication is complete.

## Product-direction check

```text
reasoning agent chooses among registered capabilities
 -> LBE resolves policy and authorization
 -> LBE executes through existing governed owner
 -> ToolReceipt/evidence persist
 -> agent may replan from observed results
 -> deterministic validation determines completion
 -> CLI/TUI projects the same persisted facts
```

Policy-covered work is automatic within its granted boundary. A blocked result renders inline;
it is not converted into an ordinary approval workflow. Separate high-risk authorization exists
only when explicitly defined by the product and policy.

## Documentation rule

Keep exact project chronology, gate state, commands, hashes, and acceptance evidence in the LBE
repository. GPT-Knowledge retains only this routing pointer plus reusable architecture and UI
references. When current state changes, update the LBE canonical documents first, then this
mirror and plan-canvas navigation records.

## Product verifier route

For current LBE CLI/TUI integration, do not create a parallel ad-hoc acceptance harness before checking the canonical product verifier:

```text
Letterblack0306/LBE_Presistent_Agent_wall
tools/lbe_product_integration.ps1
```

Current modes:

```text
check
prove
build
package
```

Use:

```text
check/prove
    -> current assembled local worktree when validating in-development slices

build/package
    -> origin/main only
    -> structural checks + proof suite must PASS
    -> package archive is re-opened and SHA-256/size verified
```

The verifier now includes the current LBE CLI/Cline delegated-agent boundary and visible LBE branding contract. Missing live runtime prerequisites remain BLOCKED/UNPROVEN; they are not converted to PASS.

Current product-role routing:

```text
LBE CLI/TUI = active user-facing product
Cline       = embedded provider/model/reasoning/delegated-agent mechanics
LBE runtime = session/governance/tool/evidence/completion authority
Rust        = reference/integration client
```

When the local implementation is ahead of canonical GitHub, use worktree proof only for that assembled state. Do not call it package/release proof until the required source is reconciled to `origin/main` and the package mode passes.
