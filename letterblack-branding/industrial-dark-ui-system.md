# Letterblack Branding Guide — Industrial Dark UI System

## Knowledge metadata

- Last reviewed: 2026-08-07
- Brand: Letterblack
- Scope: product UI, agent consoles, engineering dashboards, creative tooling, desktop/web workbenches
- Source basis: user-provided Industrial Dark specification plus LetterBlack UI screen/schema document
- Reference implementation inspected: `Letterblack0306/Adobe_AI_Generations-04`
- Confidence: high for stated brand direction; implementation-specific details from the reference repository must be revalidated before reuse

## Core visual DNA

Letterblack product UI uses an **Industrial Dark** visual system: a compact technical interface that combines a high-end developer IDE with mission-control instrumentation.

The system should feel:

- dark and operational;
- compact rather than spacious;
- precise rather than decorative;
- state-aware rather than purely visual;
- premium through restraint, alignment, typography, and thin structural lines;
- visually alive through controlled red, green, and motion signals rather than large gradients or heavy effects.

## 1. Palette

### Canonical Letterblack tokens

```css
:root {
  --lb-bg-primary: #0b0b0c;
  --lb-bg-secondary: #141416;
  --lb-bg-tertiary: #1c1c1f;
  --lb-accent-red: #ff3b3b;
  --lb-accent-red-muted: rgba(255, 59, 59, 0.15);
  --lb-border: #2a2a2d;
  --lb-text-main: #e1e1e6;
  --lb-text-muted: #8e8e93;
  --lb-glass: rgba(20, 20, 22, 0.8);

  --topbar-h: 40px;
  --statusbar-h: 22px;
  --sidebar-left-w: 240px;
  --sidebar-right-w: 320px;
  --radius-panel: 6px;
}
```

### Semantic color logic

| Meaning | Color role |
|---|---|
| Brand / active execution / critical signal | Letterblack red |
| Healthy / listening / verified-running | green |
| Queued / warning / waiting | amber |
| Inactive / metadata / unavailable | muted gray |
| Main readable information | near-white |

Red is a **signal color**, not a background default. Large red surfaces weaken its meaning.

### Elevation

Prefer differences in surface tone and `1px` borders over heavy shadows.

```text
#0b0b0c  base
#141416  primary surface
#1c1c1f  raised/interactive surface
#2a2a2d  structural border
```

Glass treatment is secondary, not universal. Use it for floating or logically separated panels where the transparency reinforces layering.

## 2. Typography and density

### General UI

- Primary family: Inter or system sans equivalent.
- Technical/raw output: JetBrains Mono, Fira Code, Cascadia Code, or equivalent monospace.
- Normal working scale: approximately `9px–12px` for labels and compact metadata; larger values are reserved for primary titles or content requiring readability.
- Section labels, Explorer labels, and technical group headings use **uppercase** and controlled letter spacing.
- Main information: `#e1e1e6`.
- Secondary metadata: `#8e8e93`.

Typography should communicate hierarchy without large vertical whitespace.

## 3. Structural language

### Panels

- Surfaces are rectangular and tool-like.
- Separations are usually `1px` lines.
- Rounded corners are restrained, normally `4–6px` and used on interactive controls, chips, and cards rather than every container.
- Avoid inflated card stacks with excessive padding.

### Glass panels

```css
.glass-panel {
  background: var(--lb-glass);
  backdrop-filter: blur(12px);
  border: 1px solid var(--lb-border);
}
```

Use glass only when it improves logical separation or layered context.

### Progress

- Prefer thin linear indicators: approximately `1–4px`.
- Live execution may pulse or animate smoothly.
- Progress must represent real execution state; decorative motion must not imply work is happening.

## 4. Interaction micro-behavior

### Hover

- Slight background elevation toward `#1c1c1f`, or
- border transition toward the red accent.

Avoid large transforms, floating-card effects, and playful bounce behavior in operational surfaces.

### Live indicators

Use a very small live dot for streams/listening/activity. Glow is appropriate for verified live/healthy states, especially green.

### Identity slugs

Major Letterblack systems or modules may use a compact two- or three-character slug such as `LBE` as a persistent identity anchor. Slugs should be visually compact and recognizable rather than decorative logos competing with the workspace.

## 5. Cockpit layout philosophy

Letterblack tools should prioritize one-view operational reachability.

```text
TOP BAR
-------------------------------------------------
LEFT CONTEXT |     PRIMARY ACTION     | RIGHT STATE
             |        / FEEDBACK      |
-------------------------------------------------
BOTTOM DOCK / TERMINAL / LOGS / VALIDATION
STATUS BAR
```

Recommended dimensions:

- top bar: `40px`;
- status bar: `22px`;
- left sidebar: `220–260px`, canonical starting width `240px`;
- right sidebar: `320–360px`, canonical starting width around `320–340px`;
- tabs: `28px`;
- standard controls: `28px`;
- panel radius: `6px`;
- card padding: `10–12px`.

The center belongs to the current action and its feedback. Sidebars carry navigation, project context, settings, agents, tools, and health.

## 6. Orientation and breadcrumbing

Complex tools must keep the user oriented.

Show functional paths such as:

```text
workspace / core / module
project / agent / operation
provider / model / endpoint
```

Breadcrumbs represent real hierarchy or active scope. Do not fabricate hierarchy to fill visual space.

## 7. Core component patterns

### Top bar

- Letterblack identity;
- active project/workspace;
- current mode;
- compact system health;
- notifications/settings.

### Left sidebar

- project/workspace switcher;
- explorer;
- sessions/views/navigation.

### Center workspace

- chat or editor;
- execution cards;
- live output;
- code/diff/browser/media preview depending on context.

### Right sidebar

- active agent and subagents;
- current task;
- routing/tools;
- memory/context;
- health summary.

### Bottom dock

- terminal;
- logs;
- event stream;
- errors;
- validation results.

## 8. Status and execution cards

```css
.execution-card {
  background: var(--lb-bg-secondary);
  border: 1px solid var(--lb-border);
  border-radius: var(--radius-panel);
  padding: 12px;
  margin-bottom: 12px;
  transition: border-color 0.2s;
}

.execution-card:hover {
  border-color: var(--lb-accent-red-muted);
}

.status-chip {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--lb-accent-red-muted);
  color: var(--lb-accent-red);
}
```

Do not use red status chips for every state. State color must reflect semantic meaning.

## 9. Terminal and technical output

```css
code, kbd, .font-mono {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
}

.terminal-line {
  display: flex;
  gap: 12px;
  padding: 2px 0;
  line-height: 1.4;
}

.terminal-time { color: var(--lb-text-muted); min-width: 80px; }
.terminal-stdout { color: var(--lb-text-main); }
.terminal-stderr { color: var(--lb-accent-red); }
.terminal-success { color: #4ade80; }
```

Terminal styling must preserve raw technical readability and must not hide stderr, warnings, or failure evidence.

## 10. Navigation

```css
.nav-item {
  padding: 6px 12px;
  font-size: 13px;
  color: var(--lb-text-muted);
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-item:hover {
  background: var(--lb-bg-tertiary);
  color: var(--lb-text-main);
}

.nav-item.active {
  color: var(--lb-text-main);
  background: var(--lb-accent-red-muted);
}
```

Active state must remain distinguishable from hover state.

## 11. Canonical screen family

Letterblack operational products should be able to express these screen types without changing the visual system:

1. Main Workspace / AI Operating Dashboard
2. Project Dashboard
3. Chat + Agent Console
4. Execution Timeline / Job Monitor
5. Debug Lab
6. Memory Panel
7. Tools / Connectors
8. API / Model Routing Settings
9. Audit Ledger
10. Settings / Appearance / Workspace

The screen schema supplied with this guide establishes a component vocabulary including chat threads, execution streams, agent trees, terminal panels, provider/model lists, audit tables, browser previews, memory views, health indicators, and permission scopes.

## 12. State-truth rule

The UI is an operational instrument, not a decorative simulation.

Non-negotiable rules:

```text
UI state must come from real runtime state.
UI must not invent execution.
Errors remain visible.
Agent/tool/provider health must be evidence-backed.
Queued, waiting, blocked, executing and complete are distinct states.
Configured does not mean connected.
Connected does not mean healthy.
Healthy does not mean the current operation succeeded.
```

## 13. Icon language

Letterblack uses compact SVG icons rather than emoji for operational UI.

Preferred characteristics:

- simple geometry;
- `24x24` viewBox-compatible source shapes when possible;
- `currentColor` for normal monochrome controls;
- approximately `2px` stroke for standard line icons;
- icon color inherited from state/text rather than baked into every SVG;
- typical rendered size around `14–18px` in compact toolbars.

Icons are semantic controls, not decoration. One canonical key should map to one visual meaning.

See `letterblack-branding/adobe-ai-generations-ui-reference.md` for the inspected icon registry and reference asset catalogue.

## 14. Brand summary for design agents

**High-end developer IDE meets mission control.** Keep the interface dark, dense, thin-lined, and evidence-aware. Red identifies Letterblack and active execution; green communicates proven health/live state. Prefer precise structure over decorative effects, and keep action, context, runtime state, and validation visible within one operational cockpit.
