# LBE Terminal Identity

Status: CURRENT BRAND IDENTITY  
Updated: 2026-09-07  
Surface: LBE CLI / TUI  
Product identity: **LBE — Lockstep Boundry Engine**

## Canonical active-shell identity

The active terminal product uses the compact identity:

```text
LBE
Lockstep Boundry Engine
LETTERBLACK
```

In the normal interactive shell, `LBE` alone is sufficient in the persistent header.

Do not require a large ASCII/block logo in the active product shell.

## Identity rules

- Product name is exactly **Lockstep Boundry Engine**.
- Preserve the intentional spelling `Boundry`.
- Visible product identity is LBE / LetterBlack.
- Cline names may remain in internal source/package/module identifiers but must not become the user-facing product brand.
- Rust/Ratatui is reference/integration only and must not redefine the active product identity.
- Branding does not prove runtime behavior or UI acceptance.
- Generated logos/mockups are design references, not runtime evidence.

## Visual rule

The active shell should be restrained and typography-led:

```text
LBE · workspace · model · mode
```

with runtime metadata visually subordinate to conversation, active execution and the composer.

The final structural UI contract is maintained in:

```text
project-engineering/projects/lbe-plan-canvas/LBE_TERMINAL_TUI_UI_PLAN.md
```
