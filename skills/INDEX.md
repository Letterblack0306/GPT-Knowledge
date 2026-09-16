# Registered Skills

This file is the exact-path registry for GPT-Knowledge skills. BirdEye/skill-gallery retrieval may use its own corpus index, but every repository-local registered skill must remain addressable here.

- `skills/evidence-driven-engineering/SKILL.md`
- `skills/looptool/SKILL.md`
- `skills/memory-assisted-decision-support/SKILL.md`

`npm test` runs `scripts/validate-routing-integrity.mjs`; adding a new `skills/<name>/SKILL.md` without registering its exact path here or another documented routing surface must fail the routing-integrity gate.
