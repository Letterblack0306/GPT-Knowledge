# LBE Persistent Agent — Acceptance and Implementation Routing

## Authority

- Last reconciled: 2026-08-21
- Project repository: `Letterblack0306/LBE_Presistent_Agent_wall`
- This page routes work; it does not create acceptance state or authorize a slice.

Use this order before LBE work:

```text
1. .agent/PROJECT_CONTEXT.md
2. .lbe/governance/implementation-gates.json
3. the machine-declared active plan
4. docs/acceptance/CURRENT_IMPLEMENTATION_GATE.md
5. docs/CURRENT_STATUS.md and docs/IMPLEMENTATION_PLAN.md
6. current source, Git, tests, and runtime evidence
7. GPT-Knowledge references only where relevant
```

## Current route

```text
R7_INSTALLED_END_TO_END_ACCEPTANCE: PASS
active phase: PUBLICATION_VERSION_PREPARATION
active slice: SET_AND_VALIDATE_CANONICAL_VERSION_2_0_3
publication: locked pending exact-version validation
architecture changes: not allowed by the active gate
```

The historical installed coding-composition failure is repaired evidence, not the current state.
Do not route work as `R7 FAIL`, do not reopen accepted R6C/R6E owners, and do not claim the
terminal workspace or PyPI publication is complete.

## Product-direction check for a future authorized terminal slice

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