# LBE Terminal — Sci-Fi Minimal Agent Cockpit

**Updated:** 2026-09-20  
**Implementation repository:** `Letterblack0306/LBE_Presistent_Agent_wall`

## Product direction

The canonical LBE terminal should behave as an **agent cockpit**, not a terminal clone of a desktop IDE.

Persistent semantics:

- one dominant prompt / chronological work surface;
- visible `BUILD / PLAN / AUDIT` mode;
- engine + provider/model + context state;
- workspace/Git state;
- explicit authorization gate;
- tools, receipts, evidence and validation remain visible when relevant;
- compact/narrow layouts collapse secondary chrome rather than hiding authority state;
- plain and JSON headless surfaces remain available independently of the fullscreen TUI.

The sci-fi direction is implemented through hierarchy, restrained semantic accents, compact geometry and state transitions. Decorative HUD effects must not carry authority or completion meaning.

## Implemented canonical source changes

Current implementation chain on 2026-09-20:

```text
75c4cff7  tui: adopt accessible sci-fi semantic palette
7891f9c3  tui: implement minimal agent cockpit and reduced-motion semantics
62dc8ecc  cli: add plain ascii and reduced-motion terminal modes
6b9b8731  headless: add chronological plain-text event projection
f0e4f886  headless: ignore presentation flags when collecting prompt
f77e4267  tests: cover sci-fi terminal accessibility modes
2a9fc071  cli: add no-color accessibility mode
6025a1c4  tests: cover no-color accessibility flag
7d679ca4  fix: retain welcome height for compact activity rendering
33641699  tui: add explicit authorization action gate
f32b71fd  tests: cover compact cockpit and authorization gate
```

## Semantic palette

The terminal uses a "Void Signal" semantic palette:

```text
background       #070A0F
main text         #DCE7F5
system/info       #59E1FF
agent/active      #B7A0FF
success           #6FE7B0
warning/approval  #FFD166
error/deny        #FF7A90
metadata          #8A9AAF
```

Meaning is duplicated with labels/symbols so color is not the only carrier.

## Working surface

Large logo artwork is restricted to launch/identity presentation. The working canvas uses a compact `AGENT COCKPIT` surface and gives transcript/tool/diff/authorization state the vertical space.

The footer projects:

```text
BUILD|PLAN|AUDIT
reasoning engine
provider/model
context %
branch
changed files
LBE boundary state
permission/runtime/evidence policy
```

## Authorization action gate

When LBE reports approval-required state, the TUI now gives the authorization state precedence over ordinary panels and displays:

- capability;
- exact projected tool when available;
- projected input/scope when available;
- risk;
- operation ID;
- approval ID;
- runtime rationale;
- `[Enter] allow once`;
- `[Esc] deny`.

It explicitly states that the screen does not grant session-wide permission. LBE remains the authorization owner.

## Accessibility / low-bandwidth modes

Canonical Rust CLI now supports:

```text
--plain
--json
--ascii
--no-color
--no-animation
```

`--plain` emits chronological state/tool/auth/completion lines in headless mode.
`--json` preserves machine-readable event output.
`--ascii` avoids Unicode-dependent glyphs.
`--no-color` keeps textual/symbol semantics while disabling color.
`--no-animation` keeps the cursor visible and reduces periodic repaint cadence.

The fullscreen TUI already has a 60x18 compact mode and avoids requiring the wide navigation rail until sufficient width is available.

## OTP boundary

The researched OTP recommendations are retained as **design requirements, not current implementation claims**.

Do not add a standalone OTP verifier to the terminal. If a provider/authentication backend exposes an OTP/TOTP challenge, the TUI should use one paste-friendly field, never log or place the code in model context, and display expiry/retry state from the authoritative authentication backend. Rate limiting, expiry and one-time acceptance belong to that backend, not the TUI.

## Evidence status

- Source changes above: **IMPLEMENTED in canonical GitHub**.
- Tests covering the new UI contracts: **ADDED**.
- GitHub Actions currently reports job failures before workflow steps are exposed/executed across this and preceding commits, so full regression/runtime acceptance is **UNVERIFIED** from CI.
- No claim is made that OTP is implemented.
