# Brew Media Content Creation: Eight Stage Evidence Acceptance (2026-10-12)

Target: source D:\Developement\_Brew_V02\Brew_Rebuild, main 3e87b4528622bbd3bd0885d5446c1765f1ed355c (dirty); installed C:\Users\prave\.Brew\workspace.

## Governance count verification
There is no single fixed universal seven- or eight-gate rule in Brew's active governance contracts. Brew's validation rules are lane-specific; the source-tree-promotion section has seven checks but they do not define a universal creative production count. This work uses an eight-stage media-specific deliverable contract without creating a new policy authority, reasoning agent, or shadow ledger.

## Code implemented
- Existing owner brew/runtime/media/media-tools.mjs now contains read-only media.delivery_check. It verifies actual audio, video, image files via FFprobe and full FFmpeg decoding, records exact SHA-256, checks requested dimensions/codec/duration/sample rate and reports PASS/FAIL/PENDING for eight production acceptance stages. All checks respect Brew's existing file-path read policy.
- Existing registry brew/capabilities/capability-registry.mjs exposes media.delivery_check as a tool with no side effects.
- Existing media.formats now advertises FFmpeg output muxers and encoders as well as input demuxers/decoders. Current machine advertised 182 muxers and 239 encoders. Advertised support does not prove actual successful encode.
- scripts/media-delivery-gates.test.mjs now covers real MP4, WAV, PNG output, mismatched resolution, corrupt files, missing technical specifications, source self-reference and media output formats. Test fixtures are cleaned up.

## Eight independently classified stages
1. Brief present and media type identified. Presence PASS is not proof of creative adequacy.
2. Distinct source file existence and SHA-256. File identity PASS is not proof of actual production lineage.
3. Usage rights, licenses, and brand permission: PENDING until independent evidence.
4. Encoded output container and streams inspected through FFprobe: PASS or FAIL.
5. Nonempty rendered artifact and SHA-256: PASS or FAIL.
6. Technical target comparisons (width, height, codec, sample rate, duration): PASS, FAIL, or PENDING if no targets.
7. Whole-file FFmpeg decode: PASS or FAIL.
8. Creative quality, factual review, accessibility and final delivery approval: PENDING until independent review.

The tool's top-level ok:true means an audit ran, not that the content passed. Technical results are in technicalPassed. It never returns complete:true or readyToPublish:true without verified approvals; current state reports them false.

## Verified execution and receipts
- Eight targeted media cases PASS: bird-20261012-140215-4dfd14ad.
- Full repository npm run check 664/664 PASS: bird-20261012-140240-92bbe8ef.
- Governance/readiness PASS: bird-20261012-140415-781dc356.
- Stop / install / start: bird-20261012-140454-51dbf13d, bird-20261012-140510-1e3ba3f6, bird-20261012-140538-8b12eb36.
- Installed source hashes matched both patched files; live /health ok PID 56804; media.delivery_check available and read-only: bird-20261012-140607-f0b0d848.
- Installed Brew CLI media.delivery_check against real rendered 160x90 MPEG-4 MP4: stage04, 05, 06, 07 PASS; duration 1 sec, codec mpeg4, full decode exit 0, sha256 fec091ad513b865cbab38ad0fb61ee0977d56aebb714209db7b27f8f943d79f0. Final classification TECHNICALLY_VALIDATED_REVIEW_PENDING, complete:false, readyToPublish:false. Other stages pending as appropriate. Receipt bird-20261012-140918-b14200b6.
- Removed obsolete release proof duplicate, retained newest; cleaned unused test import and retested 8/8: bird-20261012-141006-c50dd031.

## Still pending — do not claim expert creative generation complete
- Production orchestration and actual creation/edit/render iterations for user briefs across image, video, motion, audio, design; genuine Adobe render proof, real supported export presets.
- Automatic gate invocation for every media-producing action and trusted per-operation stage receipts bound to workspace, user approval, revision, asset digest and delivery target.
- Human/authorized creative review and rights clearance (never infer from filename, hash or model assertion); final platform publication receipt and user-visible status.
- Content quality checks for black frames, loudness, accessibility/captions, aspect/color/HDR, brand suitability and references must be verified as needed, not marked PASS without inspections.

Classification: IMPLEMENTED, TESTED, INSTALLED, LIVE_TOOL_EXECUTED for media metadata acceptance and output format discovery. END_TO_END_CREATIVE_PRODUCTION_AND_APPROVAL still pending.

