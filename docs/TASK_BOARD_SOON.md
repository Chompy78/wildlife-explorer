# Wildlife Explorer — Task Board

> Written for agentic assistants (Claude Code, GitHub Copilot). Read `AI.md` first, then `AGENTS.md`.
> Each task ends with a **Done when** check.
>
> **Rules for this file** (see `AGENTS.md`):
> 1. Holds only **open / planned** work. When a task is DONE, **move it into `CHANGELOG.md`**.
> 2. Solo project today — no single-writer concern yet.
> 3. Commit straight to `main` — no branch-per-task.
>
> Tasks below are reformatted from `CURRENT_CODE_REVIEW.md`'s "Next detailed review priorities" — not
> newly invented. `CURRENT_CODE_REVIEW.md` itself is left as-is (it's this repo's existing milestone
> baseline record, a different purpose than an open-work tracker).

---

> **Format note (2026-07-28):** split from a single `docs/TASK_BOARD.md` into `TASK_BOARD_NOW.md`/`_SOON.md`/`_NEXT.md`/`_SOMEDAY.md` by the existing four bands — see `decisions/2026/D-2026-07-28-wildlife-explorer-task-board-split.md`. Same rules apply to all four files.

---

# 🟠 SOON — housekeeping, process and QA gaps

Found during a 2026-07-20 project status review — not blocked by the Scope boundary, just not done yet.


## Decide whether to introduce a PR-gated workflow — TODO
Now that CI (`npm run check` via GitHub Actions) is wired up, `DECISIONS.md`'s `D-2026-07-21-branch-model`
"CI gets added" revisit trigger has fired (see `D-2026-07-21-ci-added`) — decide whether to keep
committing straight to `main` or introduce a PR-gated workflow.
**Effort:** low · **Risk:** medium — a process/workflow decision, not a code change; the ambiguity is
real (no single objectively-correct answer) even though nothing here touches gameplay/save-schema.

```text
1. Present tiered options to the user: (A) keep commit-straight-to-main (no PR gate) - matches current
   solo-dev, low-friction practice; CI now catches regressions either way. (B) introduce a PR-gated
   workflow - CI-required checks before merge, meaningful once a second contributor or higher-stakes
   changes become more likely.
2. Get an explicit decision from the user; do not auto-decide.
3. Log the outcome as a DECISIONS.md entry and update AGENTS.md's Branch model section to match.
```
**Done when:** the user has explicitly chosen an option; `AGENTS.md` and `DECISIONS.md` reflect it.

---
