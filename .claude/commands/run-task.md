---
description: Do the work for a task-board task picked by /pick-task — edit, verify, commit, push straight to main
argument-hint: <task title or short description>
---

# Wildlife Explorer — work the task-board task

`$ARGUMENTS` identifies the task to work. This command does the actual work directly on `main` — no
worktree, no branch, no PR (see `AGENTS.md`'s *Branch model*).

## Step 1 — sync before starting

```
git pull
```

## Step 2 — do the work

Be efficient: read each file once, search instead of reading whole files when you can. **Before
touching game state or save schema, read `saveMigration.ts`/`saveDefaults.ts` (or wherever this repo's
migration logic actually lives — confirm the path, don't assume) to understand the existing migration
pattern** — this codebase already has a real versioned-save-schema convention (currently at version 5),
follow it rather than improvising a new one. Add a line to `CHANGELOG.md` and remove the task's entry
from `docs/TASK_BOARD.md` in the **same commit**. If the change involved a non-obvious *why*, write a
decision record to `decisions/2026/D-<YYYY-MM-DD>-<slug>.md` and add its one-line index entry to
`DECISIONS.md`.

If the task turns out bigger or more ambiguous than expected, stop and flag it — leave the task-board
entry alone.

## Step 3 — verify

```
npm run check
```

This runs typecheck, tests, production build, and the encoding audit — all four must pass, not just the
build. **For anything touching gameplay, also manually verify against `AI.md`'s Canon and Scope
boundary** — `npm run check` proves the code works, not that it respects Canon (no combat/collecting/
harming animals) or stays within the current milestone's Scope boundary.

## Step 4 — commit and push

```
git add <the exact files this task touched — never -A or .>
git commit -m "<type(scope): summary>"
git pull --rebase
git push
```

---

$ARGUMENTS
