---
title: Layout Systems
category: UI
sub_category: Layout
confidence: high
verified: true
last_reviewed: 2026-08-07
applicable_to:
  - desktop
  - web
  - mobile
  - responsive applications
sources:
  - Material Design 3 canonical layouts
  - Apple Human Interface Guidelines
  - Microsoft Fluent 2
---

# Layout Systems

Layout creates hierarchy, flow, density, and adaptability. A layout should remain understandable when content changes, windows resize, panels collapse, or localization expands text.

## 1. Use a layout scaffold

A scaffold defines stable application regions before individual screens are designed.

Typical regions:

```text
Header / title bar
Primary navigation
Primary content
Supporting content
Bottom panel
Status area
```

Not every product needs every region.

## 2. Primary and supporting content

The primary region owns the user’s current task.

Supporting regions may contain:

- context
- properties
- history
- diagnostics
- previews

Supporting content must not compete visually with the main task.

## 3. Canonical layout patterns

### Single pane

Use when one task dominates and supporting information is minimal.

### List–detail

Use when users browse a collection and inspect or edit one selected item.

```text
List | Detail
```

Examples include files, messages, findings, assets, and configuration records.

### Supporting pane

Use when secondary context remains useful while working in the main area.

```text
Primary content | Supporting pane
```

### Navigation + content

Use when the product has a small number of stable destinations.

### Canvas + properties

Use for creative tools, editors, and visual composition software.

```text
Tools | Canvas | Properties
```

### Content + bottom panel

Use when output, problems, logs, or evidence support the main task.

## 4. Layout selection rule

Choose the simplest pattern that supports the complete workflow.

Do not add panes merely because the framework permits them.

## 5. Resizing behavior

Every resizable region must define:

- minimum size
- maximum practical size
- collapse behavior
- resize cursor
- keyboard adjustment where applicable
- persisted size
- overflow behavior

Dividers must never cover content.

Use the layout engine to reserve space for dividers; do not place them as uncontrolled overlays.

## 6. Responsive adaptation

Responsive design means reorganizing, not merely shrinking.

Possible transitions:

```text
three panes → two panes → one pane
rail + labels → icon rail → menu
persistent properties → drawer → dialog
side-by-side actions → wrapped action row → overflow menu
```

## 7. Density

Professional tools often require high information density.

Density remains usable when:

- spacing follows a consistent scale
- alignment is strict
- controls use predictable heights
- typography establishes hierarchy
- borders are restrained
- groups have clear labels
- secondary text is visually quieter

Do not solve clutter by making everything larger.

## 8. Spacing system

Use a small tokenized spacing scale rather than arbitrary values.

Example conceptual scale:

```text
2  — micro separation
4  — tight internal spacing
8  — standard component spacing
12 — grouped controls
16 — section spacing
24 — major separation
32 — page-level spacing
```

Exact values may change by platform, but relationships should remain consistent.

## 9. Alignment

Prefer shared edges and columns.

Forms should align labels, inputs, help text, validation, and actions consistently.

Misalignment creates visual noise even when individual components are well designed.

## 10. Overflow

Every region needs explicit overflow behavior.

Choose among:

- scroll
- wrap
- truncate with accessible full value
- collapse
- paginate
- virtualize

Do not allow accidental clipping or overlapping.

## 11. Layout state persistence

Persist user-adjusted panel sizes and visibility when those choices are meaningful.

Provide a reset-layout action when layouts are customizable.

## 12. Visual hierarchy test

Blur or squint at the screen and verify that these remain distinguishable:

1. current destination
2. primary content
3. primary action
4. current status
5. supporting information

If every region has equal visual weight, hierarchy has failed.

## 13. Layout review checklist

- primary task has the largest and clearest region
- navigation does not dominate content
- supporting panels can collapse
- dividers cannot overlap content
- minimum window size remains usable
- long text and localization do not break the design
- keyboard focus remains visible after layout changes
- empty panes explain their purpose
- no duplicated scroll containers fight each other
- user layout preferences persist where appropriate
