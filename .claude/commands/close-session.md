---
description: Wrap-up that WRITES the session's CHANGELOG/DECISIONS/session-note, graduates finished tasks, then stages/commits/pushes once you approve
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(git status *), Bash(git log *), Bash(git diff *), Bash(git add *), Bash(git commit *), Bash(git push *), Bash(git pull *)
---

# Wildlife Explorer — close off this session

You wrap up this session in three parts: **(1) log** the session's work, **(2) verify** the check-gate/
tree state (report only), and **(3) propose a commit, then stage/commit/push it yourself once you name
that letter**. No worktree/branch/PR steps — this repo commits straight to `main`.

**Before writing anything**, run `git status` / `git diff` and classify every touched path.

## Part 1 — Log the session's work

**1. `CHANGELOG.md`** — add the one-line entry (or entries), newest on top. Always required.

**2. `DECISIONS.md`** — only if a change involved a non-obvious *why*. Write the full
`Context → Options → Decision → Why → Status` record to `decisions/2026/D-<YYYY-MM-DD>-<slug>.md`, then
add a one-line index entry (Status/Summary/Record) to `DECISIONS.md` itself — never write full decision
detail directly into `DECISIONS.md`. If not warranted, say why.

**3. `docs/sessions/<name>.md`** — **match this repo's existing verbose, narrative style** (see
`docs/sessions/WILDLIFE_EXPLORER_SESSION_LOG_2026-07-20.md` for the pattern), not a terse PACT-style
note. Write one if the plan changed mid-session, a root cause differed from what was assumed, or the
session covered real discussion worth preserving. **If a note for this session already exists, re-read
it against everything that's happened since — don't just confirm it exists.**

**4. Task-board graduation** — remove finished entries from the relevant `docs/TASK_BOARD_NOW.md`/`_SOON.md`/`_NEXT.md`/`_SOMEDAY.md` file, confirm the matching
`CHANGELOG.md` line exists.

## Part 2 — Verify (report only)

**5. Check gate.** If everything touched is docs-only, skip and report so. Otherwise confirm `npm run
check` was run this session and passed (typecheck + tests + build + encoding audit — all four). If you
can't confirm it, say so.

**6. Canon/Scope-boundary check.** For anything gameplay-touching, confirm it was manually checked
against `AI.md`'s Canon and Scope boundary this session — `npm run check` doesn't cover this.

**7. Working tree state.** `git status` — confirm nothing from this session is uncommitted.

**8. Cross-project hints.** A lesson general to AI-assisted coding, not specific to this game? Draft a
candidate (one-line trigger + rule) for the private `chompy78/ai-lessons-learned` repo (shared across
projects, including PACT and family-hub, where this convention originated) — clone/pull if not present
locally, read `INDEX.md` first. **Draft only — never write without approval.**

## Part 3 — Propose the commit, then run it once approved

- List the exact files that belong to this session's work. **Never `git add -A`/`.`** — name each file.
- Draft the commit message, Conventional-Commits style.
- Ask which follow-up letters to run. Once approved: re-check `git status` on the named files, `git add
  <named files>`, `git commit`, `git pull --rebase` then `git push`. If push is rejected, pull/rebase and
  retry — don't force-push.

## Output format

Punch list grouped by the numbers above. Tiered lettering for decisions, Recommended/Not-recommended
tags on follow-ups, defaulting to Recommended.

End with a one-line verdict.

---

$ARGUMENTS
