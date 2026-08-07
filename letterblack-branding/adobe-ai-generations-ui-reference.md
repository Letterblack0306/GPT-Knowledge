# Adobe AI Generations UI Reference — Letterblack Style and Icon Source

## Knowledge metadata

- Last reviewed: 2026-08-07
- Reference repository: `Letterblack0306/Adobe_AI_Generations-04`
- Scope: reusable Letterblack UI patterns, CSS token architecture, icon registry conventions, provider icon assets
- Purpose: supplement the canonical Letterblack branding guide with proven source locations from an existing Letterblack product
- Important: this is a reference catalogue. The canonical brand rules live in `letterblack-branding/industrial-dark-ui-system.md`.

## 1. UI architecture discovered

The reference repository has a structured CSS system under `src/css/` with separate areas for:

```text
base/
capsules/
components/
layout/
modules/
tokens/
utilities/
```

This structure is useful as a reference because it separates global foundations, semantic tokens, components, product/module surfaces, layout, and utilities rather than placing the entire UI in one stylesheet.

### Reusable principle

```text
brand tokens
  -> semantic tokens
  -> base/layout primitives
  -> reusable components
  -> module-specific styling
  -> utilities only for small cross-cutting behavior
```

Do not copy module CSS into a shared design system simply because it already exists in the reference product.

## 2. Color-token architecture

The reference repository's `src/css/tokens/_colors.css` uses multiple layers:

1. raw values;
2. constants;
3. semantic aliases;
4. interaction/status variants;
5. compatibility aliases.

The inspected default values include dark base/surface/elevated layers, a red primary accent, green success, yellow warning, red error, and blue informational state.

This reinforces the Letterblack Industrial Dark model, but the canonical branding values remain the ones in `industrial-dark-ui-system.md` unless a product-specific theme deliberately overrides them.

### Recommended pattern

```css
:root {
  /* brand foundation */
  --lb-bg-primary: #0b0b0c;
  --lb-bg-secondary: #141416;
  --lb-bg-tertiary: #1c1c1f;
  --lb-border: #2a2a2d;
  --lb-accent-red: #ff3b3b;

  /* semantic contract */
  --bg-base: var(--lb-bg-primary);
  --bg-surface: var(--lb-bg-secondary);
  --bg-elevated: var(--lb-bg-tertiary);
  --border-default: var(--lb-border);
  --accent-primary: var(--lb-accent-red);
}
```

Product/theme bridges may alter raw values, but components should consume semantic tokens where possible.

## 3. Icon system discovered

The main centralized registry is:

- `src/js/ui/icons-gallery.js`

The source stores SVG strings behind semantic icon keys and exposes helpers such as icon retrieval/creation. The inspected gallery uses line-oriented SVGs with `currentColor` and typical `24x24` view boxes, which aligns well with Letterblack's compact technical UI.

Observed semantic groups include examples such as:

```text
Navigation / UI
  star
  code
  settings
  menu
  close / x
  chevronDown
  chevronUp
  maximize
  minimize

Actions
  loader
  play
  edit
  copy
  delete / trash
  template / layout
  save
  eye
  download
  add / plus
  plug
  camera
  search
  window
```

The actual registry is larger; inspect the live source before assuming a key exists.

## 4. Icon-loader and naming discipline

The repository also has:

- `src/js/ui/icon-loader.js`
- `docs/audits/icon-mapping-audit.md`

The audit records important risks:

- aliases can duplicate canonical visual mappings;
- runtime `data-icon` names can depend on alias resolution;
- aggressive name normalization can make malformed/noncanonical names appear valid;
- inline SVG cleanup and injected icons can interact in unexpected ways.

### Letterblack design-system rule

Prefer a canonical registry contract:

```text
iconKey
semanticMeaning
svgSource
category
canonical = true
aliases = explicitly documented only
status = active | deprecated
```

For UI templates, use canonical keys. Aliases exist only for controlled compatibility migrations, not as normal authoring choices.

## 5. Icon validation rule

A production UI should validate icon bindings rather than silently drawing nothing or normalizing arbitrary strings.

Recommended validation:

```text
scan static icon references
scan runtime-known icon keys
compare with canonical registry
report missing keys
report deprecated aliases
report duplicate semantic mappings
```

Unknown icon keys should fail visibly in development/audit workflows.

## 6. Standalone icon assets

The inspected `src/assets/icons/` directory contains standalone SVG assets including:

- `chevron-down.svg`
- `lightbulb.svg`
- a `providers/` subdirectory

The provider directory currently contains:

```text
claude.svg
gemini.svg
groq.svg
openai.svg
runway.svg
```

These assets are provider/service identity marks and should be treated differently from normal monochrome UI control icons.

### Provider-logo rule

- preserve recognizable provider identity;
- do not recolor provider marks arbitrarily unless the provider's brand usage permits it;
- keep provider logos in their own registry/category;
- do not mix provider identity marks with generic action/status icons.

## 7. Recommended Letterblack icon catalogue structure

```text
icons/
  controls/
    navigation
    actions
    editor
    files
    terminal
    browser
    status
    agent
    tools
  brand/
    letterblack
    product slugs
  providers/
    provider identities
  media/
    image
    video
    audio
```

A machine-readable catalogue should record at minimum:

```json
{
  "key": "settings",
  "category": "controls/navigation",
  "type": "line-svg",
  "viewBox": "0 0 24 24",
  "inheritsColor": true,
  "canonical": true,
  "aliases": []
}
```

## 8. Useful UI source areas in Adobe_AI_Generations-04

### Foundations

- `src/css/tokens/_colors.css`
- `src/css/tokens/_spacing.css`
- `src/css/base/`
- `src/css/layout/`

### Reusable components

- `src/css/components/`
- `src/ui/components/core/button.js`
- `src/ui/components/core/notice.js`
- `src/ui/components/core/section.js`
- `src/ui/components/tools/tool-button.js`
- `src/ui/components/tools/toolbar.js`
- `src/ui/components/tools/tab-bar.js`

### Product surfaces

- `src/css/capsules/`
- `src/css/modules/`
- `src/ui/screens/chat-screen.js`
- `src/ui/blueprint-preview.html`
- `src/js/modules/brand-book/brand-book-ui.js`

### Icon system

- `src/js/ui/icons-gallery.js`
- `src/js/ui/icon-loader.js`
- `src/assets/icons/`
- `docs/audits/icon-mapping-audit.md`

## 9. Extraction rules for future agents

When using this repository to inform a new Letterblack UI:

1. Start with the canonical branding guide.
2. Inspect the target product's real requirements and platform constraints.
3. Use `Adobe_AI_Generations-04` only as a pattern/reference library.
4. Extract concepts and assets selectively; do not clone whole screens or CSS modules by default.
5. Prefer the centralized token and icon concepts over product-specific selectors.
6. Validate any copied icon against the live registry and audit notes.
7. Keep status semantics truthful; do not inherit legacy aliases that conflate colors or states.
8. If the reference implementation conflicts with the canonical Letterblack branding guide, the canonical guide wins unless a product-specific design document explicitly overrides it.
