# D-2026-07-21-branch-model · commit straight to `main`, no feature branches or PRs, for now

Date: 2026-07-21
Status: Active

- **Context:** PACT's ported skills (`run-task`, `sweep-tasks`) assume a branch-per-task, PR-reviewed
  workflow. This repo has one branch (`main`), no CI configured, and no second contributor.
- **Options:** (A1) commit straight to `main`. (A2) introduce branches/PRs now.
- **Decision:** A1, explicitly logged as revisit-when, not permanent.
- **Why:** same core reasoning as `chompy78/family-hub`'s identical decision — no automated gate a PR
  would wait on yet, no second reviewer, no concurrent contributors. **Worth naming explicitly what's
  different here:** unlike family-hub, this repo already has `npm run check` — a real, working
  typecheck+test+build+encoding gate. Wiring that into GitHub Actions CI on every push/PR would be a
  small, low-risk lift, not a redesign. That makes this repo's path to A2 shorter than family-hub's —
  worth revisiting sooner if development picks up, not just on the same generic triggers.
- **Consequence:** `run-task`/`sweep-tasks` skip worktree/branch/PR steps, commit+push straight to
  `main`, use `npm run check` as the verification command. **Revisit trigger:** CI gets added (smaller
  lift here than most repos, given `npm run check` already exists), a second contributor joins, or a
  change (e.g. a save-schema migration, a Canon-sensitive gameplay change) feels too risky for a direct
  `main` push.
- **Status:** Active. **Revisit trigger:** any of the above becoming true.
