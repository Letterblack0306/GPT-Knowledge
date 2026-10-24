# Brew third five enhancements — session recovery evidence integrity

Date: 2026-10-12. Canonical development workspace D:\Developement\_Brew_V02\Brew_Rebuild, main@3e87b4528622bbd3bd0885d5446c1765f1ed355c, dirty. User explicitly requested five further implementation changes, using failure-to-correct-action evidence and preserving pre-existing changes.

## Evidence-based selection and implemented features
Active owner: brew/runtime/agents/agent-session-journal.mjs, directly consumed by AgentSessionManager for restart recovery and Telegram runtime for timeline/status.

1. **Fail-closed durable session corruption detection.** JSON parse and schema failures in sessions.json now surface SESSION_JOURNAL_CORRUPT or SESSION_JOURNAL_INVALID rather than appearing as an empty new session. Missing file remains legitimately empty.
2. **Protected atomic session persistence.** Save validates keyed sessions, checks existing journal before overwriting, uses uniquely named exclusive-write temporary files and atomic rename, and removes leftover temp files after errors.
3. **Corrupt timeline detection and preservation.** Timeline reads now identify malformed JSON and records with line-specific SESSION_TIMELINE_CORRUPT/INVALID errors; append refuses to overwrite or compact a corrupted timeline.
4. **Bounded timeline retrieval.** Reader clamps untrusted or extreme requested limits and preserves session-key filtering. This avoids unbounded returned history.
5. **Atomic bounded timeline compaction.** When the 5,000-entry history cap is exceeded, rewrite retains the latest 5,000 serialized events via unique temporary file and rename rather than direct potentially partial overwrite.

Tests: added scripts/agent-session-journal-integrity.test.mjs with 4 focused tests; prior scripts/agent-session-recovery.test.mjs 2 tests remain passing. Targeted 4/4 PASS receipt bird-20261012-072417-9e8ad469; combined recovery 6/6 PASS receipt bird-20261012-072429-300dbe08. npm test exit 0 after scoped git diff check, receipt bird-20261012-072451-18c8a433.

Real installed data preflight: existing sessions.json valid (2 records), timeline.jsonl valid (3369 records), runtime /health ok:true, receipt bird-20261012-072544-4a0f4adf. Canonical Brew service stopped receipt bird-20261012-072608-21c05c92. Hash-verified backups saved under C:\Users\prave\.Brew\reports\agent-session-backup-20261012-0726, receipt bird-20261012-072628-32106b3d.

Deployment: canonical release-installer to C:\Users\prave\.Brew with --skip-build --skip-smoke, exit 0 and postflight PASS, receipt bird-20261012-072648-33e6fc5c. Restarted with Brew CLI, orchestrator PID 16188, receipt bird-20261012-072711-9e8052cb. Installed journal file SHA256 equals development source; /health ok:true, Telegram child PID 49632; installed journal status ok:true with 2 sessions, 3369 events, no errors, receipt bird-20261012-072738-80e2a401.

Classification: IMPLEMENTED, TESTED, INSTALLED_SOURCE_MATCHED, RUNNING_RUNTIME_HEALTHY, INSTALLED_DATA_READ_PROVEN. Not claimed: full kill-during-write resilience under simulated power loss, post-restart user-visible Telegram messages, or live model inference. No commit/pull/rebase/unrelated worktree cleanup.
