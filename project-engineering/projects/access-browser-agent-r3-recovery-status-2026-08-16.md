# Access Browser Agent R3 — Recovery / R4 Current Status

**Status date:** 2026-08-16

## Purpose

This is the current evidence checkpoint for the Access Browser Agent R3 recovery work. It is a project-status record, not a design proposal. Do not infer progress beyond the proven evidence below.

## Canonical source / revision

- Repository: `Letterblack0306/Accecc_Browser_Agent`
- Canonical worktree: `G:\Developments\46_Accecc_Browser_Agent\Browser Agent_R3_CANONICAL`
- Active PR: `#18` — `refactor: make Browser Loop a natural agent conversation`
- Branch: `refactor/browser-conversation-turn-transport-20260816`
- Exact canonical revision used by the live recovery harness: `5b8747bfad20f85cccf65630493beb7d4d6543b7`
- Selected governed workspace inside the app: `G:\Developments\46_Accecc_Browser_Agent\Browser Agent`
- Selected recovery conversation: `https://chatgpt.com/c/6a7dd21e-47dc-83ed-a7a5-51e66d7bfed9`

Do not conflate the canonical source worktree with the selected governed workspace.

## Required engineering method

Use the evidence-first loop:

`map flow -> identify active owner/source of truth -> exact question -> authoritative observable -> falsifier -> bounded test -> classify -> patch only proven owner -> focused regression -> wider regression -> live/runtime proof when required`

Allowed classifications include:

- `PROVEN`
- `DISPROVEN`
- `INCONCLUSIVE`
- `BLOCKED_CONFIGURATION`
- `STALE_TEST_OR_FIXTURE`
- `TEST_HARNESS_FAILURE`
- `RECOVERY_REQUIRED`
- `SOURCE_DEFECT`
- `STALE_RUNTIME_INSTANCE`
- `ACCEPTANCE_NOT_RUN`
- `ACCEPTANCE_NOT_REACHED`

Never patch from a historical payload assertion alone.

## Recovery architecture already proven

The durable transport journal uses append-only instruction records plus separate `instruction_reconciliation` receipts. Historical ambiguous states are discovered at the full `{workspaceRoot, conversationId}` scope before newer execution.

The live automated acceptance path is:

`real Start -> scope-level recovery card -> real renderer recovery action -> controlled reason overlay -> Continue -> preload/IPC -> BrowserSessionAuthority -> append-only journal reconciliation receipt`

The committed harness is:

- `scripts/live-recovery-reconciliation-acceptance.js`
- npm command: `npm run acceptance:live-recovery-reconcile`

The harness also proves no accidental new instruction execution by comparing `browser_relay.instruction_received` before and after reconciliation.

## Completed governance / source fixes

The following project change intents were closed as completed on PR #18:

- `2026-08-16-scope-level-recovery-discovery`
- `2026-08-16-recovery-renderer-input`

Scope-level recovery discovery is live-proven. The controlled renderer input / IPC / journal reconciliation path is live-proven.

## Reconciliations proven through the live UI path

The following historical ambiguous records have durable reconciliation receipts and `INSTRUCTION_RECEIVED_BEFORE=0`, `INSTRUCTION_RECEIVED_AFTER=0`, ending in `AUTOMATED_LIVE_RECOVERY_RECONCILIATION_PASS`:

1. `8fc520a791a265c159c61164866b42d963d7665d749230467e0070316e33bbfd` -> `quarantined`
   - receipt: `07a8664172e23ae34cfbd46e13caa75ccf36cb093f157b3fff64db3334f6dd92`
2. `025c7d62854eb99bd09dda9567a82553546a89eac096b78d1da4176a4444829b` -> `quarantined`
   - receipt: `f75fc11b5cbd54982df9ff8dcd7d4f8787cb248ce5117a07471bf5b8990a4d95`
3. `c596278b1b52975d216c81da7840cda69b204e16b4d3c1f712bba073c524c415` -> `quarantined`
   - receipt: `af5970d77db74c92a43dc841bf174e507fa5f37f9f116bdcf679c75d59b6585c`
4. `171d9e963e469f37b64a6421817da7f5a4d4dfd9b930f52c04a1cd10a026f744` -> `quarantined`
   - receipt: `50f5fe0286a6725beeb653145366dcd3898d4b653a5d2ef8f2baf117bfd2c4b4`
5. `b82fe9aceaf3dbccafa41001a9fc4994bc48afdd69a8b822ac97e72fc4966067` -> `quarantined`
   - receipt: `918e543f906a0a813225bf6c9ca1dd77b37828910d072968e4eb3c76c20a9747`
6. `0eb97c2d264cd924830d2a7afe72755ce89ac76a73f0bd408624e7e09bd093b7` -> `quarantined`
   - receipt: `a3ebdb2f1919ad63f9602bddcca098bdd65f51beb447bd03281b6b198400001e`
7. `438551ad635c874295e050776a8e369eb590c4e8c13080c8a00767756e444aa4` -> `quarantined`
   - receipt: `31ef709ee21ed584e43c62b416075a79160dc6fd064a4a6b83c12f017d552794`

All of these were reconciled conservatively because local/result/delivery evidence existed while rendered delivery remained unverified.

## Last proven recovery backlog state

**Last proven unresolved count: `16`.**

The deterministic next unresolved record was proven as:

- key: `66cab61040df39bdf1118ecfcfe9d719857538b66d5a9d1f550a5839c53f1660`
- instruction: `turn-ab2913318dc1a88a`
- state: `delivery_unverified`
- terminalState: `completed`
- result record: `873203b01d139c37ed8954f99cfde222a5c638257a8eee9a568f3069e30dedd3`
- result queued: yes
- delivering: yes
- delivery attempts: `1`
- evidence level: `SUBMISSION_ACCEPTED`
- rendered result verification: absent

Recovery classification from the durable transport evidence:

`RECOVERY_REQUIRED -> quarantined`

However, **the live reconciliation of this key is not yet proven**. Do not decrement the backlog to 15 until a durable reconciliation receipt and `AUTOMATED_LIVE_RECOVERY_RECONCILIATION_PASS` are observed.

## Current runtime / Loop Tool observation

The latest observed Loop Tool/runtime output showed:

- connected to a ChatGPT tab titled `UI and Agent Simplification`
- `LOOP_STARTED`
- subsequent checks reported `BROWSER_CHECK_SKIPPED loop_owns_connection`
- `CHECK_ONCE_SKIPPED loop_owns_connection`

Classification:

- `PROVEN`: an active loop owned the browser connection at that moment.
- `INCONCLUSIVE`: the intended journal-query command result was not observed in that output.
- The tab-title difference is not by itself proof of wrong targeting; exact conversation identity must be established by the acceptance/runtime observable rather than title inference.

## Separate terminal-state mismatch evidence

Several historical payloads record a semantic mismatch:

- semantic state: `WAITING_FOR_DEPENDENCY`
- outer runtime result: `STATUS: COMPLETE` / `NEXT STATE: completed`

This mismatch is historical evidence worth investigating later.

What is **not** proven from those payloads alone:

- that `BrowserInstructionRelay.js` is the exact faulty owner;
- that `resultEnvelope` is the exact faulty branch.

No source patch is justified from the historical assertion alone. A later bounded source/runtime investigation must identify the authoritative mapper and falsifier before code changes.

## Known future record

Historical key `518544ce6cc4a05761396a4f2aeb2219685f50e0ccb992578728cbdbda647721` is known from prior evidence to have remained in `executing` with zero provider completions, zero tool executions, zero terminal executions, zero result/delivery evidence, local agent stopped, pending true, processed false.

When — and only when — deterministic journal ordering reaches this key, the previously supported disposition is `abandoned`, with the reason that runtime evidence proves no local execution committed and replay must be prohibited.

Do not jump ahead to this key.

## Immediate continuation rule

1. Finish or stop any active Loop instance that currently owns the browser connection if it prevents the acceptance harness from acquiring the required path.
2. Run the existing committed live recovery harness for key `66cab61040df39bdf1118ecfcfe9d719857538b66d5a9d1f550a5839c53f1660` with disposition `quarantined`.
3. Require:
   - exact recovery card key;
   - durable append-only reconciliation receipt;
   - `priorState = delivery_unverified`;
   - `disposition = quarantined`;
   - `INSTRUCTION_RECEIVED_BEFORE=0`;
   - `INSTRUCTION_RECEIVED_AFTER=0`;
   - `AUTOMATED_LIVE_RECOVERY_RECONCILIATION_PASS`.
4. Re-query `listUnresolvedRecoveries(...)` and classify only the next deterministic record.
5. Continue one record at a time. Do not batch-quarantine based only on state labels.
6. Do not start R4 until the recovery backlog no longer blocks normal Start.

## R4 target after recovery backlog is clear

Question:

Will the reasoning agent autonomously use the dedicated read-only `browserConversationRead` capability when the Browser Loop instruction deliberately omits required context?

Pass requires:

1. a real `browserConversationRead` tool call;
2. result contains the protected exact-chat marker;
3. final local result derives from that marker;
4. zero terminal/workspace mutation/general-browser substitution.

Correct marker without reader diagnostic is `INCONCLUSIVE` because context leakage remains possible.

## Status sentence

**R3 recovery architecture and automated reconciliation path are live-proven; seven historical ambiguous records are proven reconciled without replay; the last proven backlog is 16 with `66cab...` next and not yet proven reconciled; R4 remains blocked until durable recovery is cleared.**
