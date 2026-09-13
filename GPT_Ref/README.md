# GPT_Ref maintenance contract

`GPT_Ref/` is a curated **external agent-engineering reference catalogue**. It is not a general knowledge folder, project-status archive, memory store, research dump, or document inbox.

## Allowed contents

Only these maintained catalogue artifacts belong here:

- `GPT_REF.md` — concise human-readable agent-repository reference map.
- `agent-references.json` — machine-readable canonical repository catalogue.
- `README.md` — this scope and maintenance contract.

Any additional file requires an explicit catalogue-format change and corresponding validation update.

## Admission criteria

A repository may be added only when all of the following are true:

1. it is a real, directly inspectable upstream implementation;
2. it provides a durable agent-engineering pattern that is not already better represented by an existing entry;
3. the catalogue can state a specific subsystem or engineering concern for which it is useful;
4. its canonical repository URL is verified;
5. its limitation or adoption boundary can be stated clearly;
6. it is not being added merely because a project report mentioned it.

## Prohibited content

Do not place any of the following in `GPT_Ref/`:

- Brew status reports, plans, checkpoints, audits, or runtime evidence;
- arbitrary GPT-K documents;
- copied upstream source files;
- memory exports or personal context;
- generated research transcripts;
- issue/PR snapshots;
- temporary comparisons;
- provider credentials, local paths, or machine-specific state;
- duplicate reference notes that belong under `ai-agents/studies/`.

## Maintenance workflow

For every catalogue change:

1. verify the upstream repository still exists and is the intended canonical project;
2. update `agent-references.json` first;
3. update `GPT_REF.md` to match the machine catalogue;
4. keep descriptions concise and subsystem-specific;
5. route long-form comparative analysis to `ai-agents/studies/` instead of expanding `GPT_REF.md` indefinitely;
6. run `npm test`, which includes the GPT_Ref catalogue guard;
7. remove or replace stale links rather than preserving obsolete entries for history.

## Authority

`GPT_Ref` is reference-selection guidance only.

For implementation work:

```text
current runtime evidence
  > current target workspace/repository evidence
  > active project contracts
  > GPT_Ref catalogue
  > GPT-K comparative studies
  > historical material
```

The catalogue selects references. It does not override the target project's current source or runtime truth.
