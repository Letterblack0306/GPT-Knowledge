# Current LBE Runtime + UI Handoff — 2026-09-04

Status: **CURRENT EVIDENCE CHECKPOINT**

## Authority order

1. Current canonical local LBE source/runtime/machine-governance evidence.
2. Current local Rust client evidence.
3. Published GitHub revisions.
4. GPT-K projection/reference.

GPT-K does not override newer local runtime evidence.

## Product boundary

```text
Agent/provider/Cline mechanics
= reasoning, planning, tool proposal, continuation, response composition

LBE
= workspace/session/turn identity
= policy/authorization
= ToolRegistry/governed execution
= ToolReceipt/evidence
= persistence/recovery
= validation/completion truth

Client UI
= request + projection only
```

## Current client decision

UI technology is **not a blocker**.

The selected current client is the existing Rust/Ratatui LetterBlack TUI at:

```text
C:/LBE-TUI-Lab
```

because it is the most complete existing executable client and is already connected to canonical LBE.

HTML cockpit material remains visual/product reference. Copied Cline/OpenTUI remains mechanics/reference only. Neither is mandatory for current completion.

## Proven current runtime/client path

```text
Rust composer
→ UserRequest::SubmitTask
→ WrapperClient
→ RealLbeWrapper
→ lbe_guard_inspector.product_entry turn
→ canonical LBE
→ persisted events
→ Rust projection
```

Proven:

- real LBE workspace/session attachment;
- authoritative provider/model projection;
- workspace receipt/evidence projection;
- interactive SubmitTask emission;
- canonical turn creation;
- canonical persisted event return;
- Rust projection of returned turn state;
- clean quit/terminal restore in a live run;
- 204 Rust tests passed in the reported slice.

Claim-matched proof:

```text
session_id:        tui-fb2fe3a87da24552910a5b2d8fb45c7d
turn_id:           turn-82439b47435248adb81d3d4d58a830fe
session_sequence:  130 -> 136
turn_count:        29 -> 30
persisted events:
  134 user.message
  135 model.turn.started
  136 model.error
```

## Current blocker

```text
ProviderError: [WinError 10061]
No connection could be made because the target machine actively refused it
```

Classification: **PROVIDER_CONNECTIVITY**

Do not modify Rust or Cline merely to solve this error until the configured provider endpoint/listener is verified.

## Next bounded sequence

1. Verify provider base URL/port and actual listener.
2. Obtain one successful direct canonical LBE provider turn.
3. Repeat the same successful turn through the Rust client.
4. Prove governed tool continuation:
   - tool proposal;
   - LBE authorization;
   - DENY => zero execution;
   - ALLOW => exactly once;
   - ToolReceipt/evidence;
   - provider/Cline continuation;
   - Rust projection.
5. Prove quit/restart/resume and installed end-to-end acceptance.

## Publication lag

Published LBE and Rust GitHub repositories may lag current local work. Agents must not infer current implementation status from remote main alone when newer local evidence is available.
