# Access Browser Agent — R4 Validation Record

Date: 2026-08-17

## Purpose

Capture reusable engineering knowledge from the Browser Agent R4 validation cycle.

## Authority Separation

- GitHub: canonical source for repository state, patches, branches, and commits.
- LoopTool: local execution, debugging, runtime evidence, and test reproduction only.
- GPT-Knowledge: reusable methods, validation patterns, and lessons learned.

## Validation Outcome

Bounded R4 acceptance: PROVEN LOCALLY.

Verified evidence:

- Canonical local checkout identity recorded.
- Branch: `refactor/browser-conversation-turn-transport-20260816`.
- Commit: `f46ed1cf1175c587debcb35cde8c43775cd90321`.
- Invalid token `$.FullName` removed.
- Runtime smoke checks passed.
- Browser tool evaluations passed 6/6.
- Workspace guard and sync checks passed.

## Failure Classification Lesson

A failing validation command must distinguish between:

- repository defect
- test harness defect
- environment/configuration issue
- stale fixture or expectation

The R4 failure was classified as `TEST_HARNESS_FAILURE` because the failing token wrapper was incorrect.

## Required Future Workflow

1. Establish GitHub repository identity first.
2. Use local runtime tools only for execution evidence.
3. Record exact commit, branch, command, output, and classification.
4. Do not convert local evidence into GitHub proof without remote verification.
5. Preserve evidence boundaries in long-running projects.
