# LBE provider extensibility — cross-project reference (2026-10-09)

Status: PLANNED / NOT IMPLEMENTED. Source: live LBE checkout at main 4254ca6 (2026-10-09). Canonical implementation plan: `C:\Agents-Memory-Tool-v6-integration\docs\design\PROVIDER_EXTENSIBILITY_REFERENCE_PLAN.md` (workspace; not a substitute for current evidence).

## Verified gap
- Python: `lbe_guard_inspector/provider_registry.py` offers extensible string `provider_id` bound to `engine_id` via `register_binding`.
- Rust: `apps/lbe-terminal/src/types.rs` defines a fixed 17-variant `ProviderId` enum. TUI cannot represent arbitrary registry entries without source changes.
- CLI and TUI include provider-specific parsing/routing. Provider presence alone does not prove credential readiness, model reachability or agent-tool execution.

## Reference set
- OpenCode: https://github.com/opencode-ai/opencode ; https://opencode.ai/docs/providers ; https://opencode.ai/docs/models
- ClinePass: https://docs.cline.bot/getting-started/clinepass
- Cline free models: https://docs.cline.bot/getting-started/free-models
- Config: https://docs.cline.bot/getting-started/config
- TUI/ACP: https://docs.cline.bot/usage/tui ; https://docs.cline.bot/usage/acp
- Tools/rules/skills/plugins/MCP/hooks/scheduling: https://docs.cline.bot/tools-reference/all-cline-tools ; https://docs.cline.bot/customization/cline-rules ; https://docs.cline.bot/customization/skills ; https://docs.cline.bot/customization/plugins ; https://docs.cline.bot/mcp/mcp-overview ; https://docs.cline.bot/customization/hooks ; https://docs.cline.bot/cli/scheduling

References are inputs to inspect precisely, not proof of implementation or licenses for speculative wrappers.

## Plan routing
1. Source map: registry, adapters, profiles, engine and TUI/CLI catalog, identity compatibility.
2. Dynamic provider identity in Rust, preserving persisted IDs and generic labels.
3. Independent configuration/auth/reachability/model/capability states and supported dynamic catalog sources.
4. Working provider selection and all-provider validation in TUI.
5. Model-controlled tool selection -> governed effect -> receipt -> model consumes observation -> completion through real provider.
6. Compare a local and remote (when available) live configuration, restart/recovery, and ConPTY release acceptance.

All implementation work belongs in LBE, not GPT-K. Do not claim installed readiness from passing tests. Classify evidence PROVEN / DISPROVEN / INCONCLUSIVE / BLOCKED_CONFIGURATION / STALE_TEST_OR_FIXTURE / TEST_HARNESS_FAILURE.

## Repository caution
GPT-K local checkout was behind origin/main 37 commits and held preexisting unrelated modifications when this file was authored. This new standalone document should be reconciled against current remote history before any merge/push; do not overwrite the modified LBE status or routing files.
