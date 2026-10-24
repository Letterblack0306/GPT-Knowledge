# Brew terminal UI media evidence integration — 2026-10-12

Source Brew: D:\Developement\_Brew_V02\Brew_Rebuild, main@3e87b4528622bbd3bd0885d5446c1765f1ed355c, dirty. Installed Brew: C:\Users\prave\.Brew\workspace.

## Confirmed pre-existing gap
brew/tui/index.mjs was a placeholder interactive menu. Status, Setup, Providers, Memory and Sessions selections only printed command help instructions instead of executing. Its CLI entry point is brew/cli/main.mjs --tui via CommandContext. Existing chat service routes turns to canonical /query. Existing personal agent tool service uses the existing governed tool-executor and capability registry for media.delivery_check and media.formats.

## Implemented
- Replaced placeholder TUI menu in existing brew/tui/index.mjs with actual actions:
  1. Chat with Brew via context.services.chat.send with stable tui session ID.
  2. Validate a media deliverable via context.services.personal.agent.execute(media.delivery_check), prompting for path, media kind, brief, independent source and measurable specs JSON. Invalid JSON fails before execution. Shows stage PASS/FAIL/PENDING/BLOCKED, artifact hash, technical status, and exact incomplete-delivery state.
  3. Discover real installed export/input formats via governed media.formats with bounded output; explicitly avoids treating advertised encoder/muxer support as tested successful export.
  4. Runtime status via existing context.services.runtime.status.
- Providers, Memory, Sessions and Setup retain existing CLI management links; no shadow UI authority, no independent render engine, no publication bypass.
- Preserved noninteractive TUI_UNAVAILABLE behavior.
- Added scripts/tui-media-evidence.test.mjs with six focused tests for real dispatch contracts, false completion, invalid JSON, chat session, advertised formats and TTY control. All six passed, receipt bird-20261012-143331-eebfe329.

## Verification
- First full check showed one unrelated Telegram reset acknowledgment failure; focused Telegram suite 8/8 PASS (bird-20261012-143611-e8bb67c5). Full check repeated unmodified and all 670/670 tests PASS (bird-20261012-143630-55ce3b37). The intermittent failure is not proven permanently repaired.
- npm run verify:readiness gates PASS, receipt bird-20261012-143841-a9837830.
- Verified zero active operations; canonical Brew stop receipt bird-20261012-143935-7053c288.
- Canonical release-installer installed source and dependencies, postflight PASS; receipt bird-20261012-143953-7a564cf8.
- Restarted installed orchestrator PID 29208 with identity match, receipt bird-20261012-144020-cab047da.
- Installed TUI file SHA-256 equals development source, installed runtime /health ok:true.
- Scripted terminal interaction imported actual installed CommandContext and runTuiApp, used **real** FFmpeg-generated MP4, actual installed media.delivery_check tool, actual media.formats, actual runtime status. Verified 07_decode PASS, 08_review PENDING, TECHNICALLY_VALIDATED_REVIEW_PENDING, Delivery complete: NOT VERIFIED, live muxer list, live runtime status. Receipt bird-20261012-144122-e79c2cd3.
- Removed one obsolete release-proof, retained newest release-proof-1791815994640.json, final /health and source SHA and workspace index PASS, receipt bird-20261012-144156-9162735e.

## Evidence boundaries
- PROVEN: TUI source action integration, unit TUI menu, installed-source parity, real installed media tool execution through TUI and accurate stage display, real runtime status, actual export discovery.
- NOT PROVEN: physical keyboard/interactive PTY UX on an actual terminal host; asynchronous progress live updates or creative approval UI; TUI automatic invocation of media QC for every output; media generation/editing itself; rights clearance, brand/creative human approval, publish receipts.
- In current media.delivery_check tool, no stage independently clears rights/creative approval; it never asserts readyToPublish merely from technical success. The TUI truthfully displays these states.
- No git commit/merge/rebase or removal of user source changes. No duplicate owner.

