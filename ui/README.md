# UI Knowledge

Reusable UI design and engineering guidance organized by universal concepts rather than product type.

## Foundations

- [UI/UX Engineering Playbook](UI_UX_ENGINEERING_PLAYBOOK.md)
- [Universal UI Design Principles](principles/UNIVERSAL_UI_DESIGN_PRINCIPLES.md)
- [Information Architecture](architecture/INFORMATION_ARCHITECTURE.md)
- [UI System Architecture](architecture/UI_SYSTEM_ARCHITECTURE.md)
- [Layout Systems](layout/LAYOUT_SYSTEMS.md)
- [Component and State Contracts](components/COMPONENT_AND_STATE_CONTRACTS.md)
- [UI Audit Checklist](checklists/UI_AUDIT_CHECKLIST.md)

## Scope

This knowledge applies across:

- desktop applications
- web applications
- mobile applications
- creative tools
- agent interfaces
- dashboards
- settings and configuration tools
- developer tools

Platform systems such as Fluent, Apple HIG, Material, Primer, Carbon, Atlassian, Polaris, and W3C APG are treated as references. Reusable principles are extracted into universal guidance instead of copying one platform’s visual language.

## Working method

```text
Research authoritative sources
→ extract reusable principle
→ record applicability and confidence
→ apply to a real project
→ validate through runtime behavior
→ update this knowledge with proven findings
```

## Core completion rule

A UI is not complete because it renders. It is complete only when:

1. the user understands what the feature does;
2. every control is connected to a real operation;
3. loading, success, partial, blocked, and failure states are visible;
4. the layout remains usable under resize and realistic content;
5. accessibility and keyboard behavior are verified;
6. runtime evidence proves the workflow works.

## Knowledge boundary

Project-specific code, private paths, secrets, endpoints, and unverified claims stay in their project repositories. Only sanitized and reusable knowledge belongs here while this repository is public.
