# D-2026-07-26-code-command-marker — renamed `.claude/commands/` files to carry a `-code-` marker

- **Context:** This repo's `.claude/commands/` family is git/PR-driven engineering work (`npm run check`,
  direct commits, task-board discipline). A separate, lighter "-chat-" Claude.ai Skills family exists
  elsewhere for project-tracking with no git/PR workflow. `chompy78/PACT`, then `chompy78/homelife`,
  already solved the disambiguation by inserting a `-code-` marker into their command filenames; this
  repo hadn't yet applied the same convention.
- **Options:** (A1) mechanically insert `-code-` after each file's leading verb, keeping the current name
  shape everywhere, including `cold-plan-review.md` → `cold-code-plan-review.md`. (A2) same mechanical
  insertion for the six verb-led files, but a deliberate rewrite for `cold-plan-review.md` — which has no
  leading verb — to `make-code-cold-plan-review.md`, matching the exact fix PACT/homelife already made for
  the equivalent filename in their repos.
- **Decision:** A2.
- **Why:** `add-task.md`, `close-session.md`, `log-lesson.md`, `pick-task.md`, `run-task.md`,
  `sweep-tasks.md` are all already verb-first, so inserting `-code-` right after the verb
  (`add-code-task.md`, `close-code-session.md`, `log-code-lesson.md`, `pick-code-task.md`,
  `run-code-task.md`, `sweep-code-tasks.md`) reads naturally and needed no other change. `cold-plan-
  review.md` is the one file that breaks this repo's own verb-first pattern, and a straight insertion
  (`cold-code-plan-review.md`) reads ambiguously ("cold code-plan review?"). PACT/homelife hit the
  identical shape (`plan-for-review.md`) and settled on `make-code-cold-plan-review.md` — a leading verb
  plus the marker, with the artifact name (`cold-plan-review`, "a plan written for a cold reviewer with no
  shared context") kept intact as a unit. This repo's file was already most of the way to that name, so
  adopting it directly both applies the marker and fixes the one filename that didn't already fit the
  house style.
- **Consequence:** All 7 files renamed via `git mv` (history preserved). Cross-references between command
  files updated: `run-code-task.md`'s frontmatter description, `pick-code-task.md`'s hand-off step,
  `log-code-lesson.md`'s `/close-session` mention, and `sweep-code-tasks.md`'s three
  `/pick-task`/`/run-task`/`/add-task` mentions all now point at the new names. No other repo file
  referenced the old names — `AGENTS.md`, `CLAUDE.md`, `README.md`, `docs/TASK_BOARD.md`, `AI.md`,
  `.claude/settings.json` and its hooks were grepped clean at the time of the rename. `CHANGELOG.md`,
  `DECISIONS.md`, and dated `docs/sessions/*.md`/`docs/sweep-log.md` entries keep the old names — those
  are historical record of what ran at the time, not retroactively rewritten. This rename landed on a
  harness-pinned working branch shortly before an unrelated concurrent session split
  `docs/TASK_BOARD.md`/`DECISIONS.md` into per-band/per-decision files
  (`D-2026-07-28-wildlife-explorer-task-board-split`) — merged cleanly via git's rename detection, with
  this decision's own record migrated into the new `decisions/2026/D-*.md` shape as part of that merge.
- **See also:** none in this repo yet — the precedent lives in `chompy78/PACT`'s and `chompy78/homelife`'s
  equivalent decision logs.
- **Status:** Active.
