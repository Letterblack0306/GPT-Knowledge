# BirdEye MCP desktop interaction and adaptive visual delivery
Updated: 2026-10-15
Status: Implemented in local source; fresh stdio MCP image-response smoke test passed. Existing long-running clients may require reconnection; no sustained multi-client visual test certified.

## Authority and ownership
BirdEye is a shared machine-level MCP capability gateway, independent of Cline, ChatGPT, Codex, or Claude. BirdEye's current workspace_run reports authority `birdeye-mcp-user` and provides execution receipts. No separate LBE dependency is required for desktop capture/input. Windows provides the process identity/SID. Do not confuse client registration with ownership of BirdEye.

## Existing capabilities
The local BirdEye server at `C:\MCP Local\Letterblack_BirdEye\mcp_server.py` registers `desktop_action`: capture, cursor, move, click, and type. The supporting modules are `desktop_surface.py` (Windows input and capture) and `desktop_adaptive.py` (per-client image-state comparison). Requests execute through BirdEye's existing workspace command execution path and generate execution receipts.

## Adaptive capture contract
`desktop_action(action="capture", client_id="stable-client-id", reference_id="prior-frame-sha256", max_width=1280, force_full=false)`
- First frame, missing reference, large difference, mismatched dimensions, or `force_full=true`: deliver a full PNG frame.
- Pixel-identical acknowledged reference: `delivery="unchanged"`, no image bytes.
- Localized visual change under 40% of the image area: `delivery="region"`, crop plus absolute coordinates in the *resized image* and frame ID.
- Frame ID: SHA-256 of RGB decoded pixel data and dimensions/mode; different from the compressed PNG SHA.
- Per-client frame cache keyed by client ID; bounded to 32 images and one-hour eligibility window. Clients must return their last received frame ID; BirdEye does not infer delivery acknowledgement.
- Image payloads are returned as MCP image-content blocks, with a text metadata block and a command-execution receipt.
- Temporary full-frame capture file is checked against its SHA and deleted after use.
- Coordinates for mouse actions use desktop virtual-screen coordinates, which are distinct from resized screenshot coordinates. Agents must correctly scale/translate crop coordinates before acting.

## Observed validation
A fresh local stdio MCP session advertised `desktop_action` and returned text + PNG image. Synthetic regression passed full / unchanged / region / cross-client isolation / missing reference / forced refresh. Windows live capture and UI move/click/type passed in an isolated test window with receipt evidence. One real successive capture changed enough to trigger a full-frame fallback, as designed.

## Limits, next acceptance
This does not establish that all existing clients have reloaded the new tool catalog; reconnect as needed. Sustained transport reliability, concurrent real visual sessions, and full visual action-feedback acceptance remain unverified. Avoid reporting those as PASS. Preserve the current dirty Git workspace. Do not pull, rebase, clean, or commit without authorization.

## Engineering guidance
Reuse BirdEye, do not create a competing MCP desktop service. Prefer no-image unchanged responses, limited-area crops, and automatic full-frame recovery; retain client-scoped frame-state and verifiable receipts. Do not add LBE integration as an unnecessary layer.
