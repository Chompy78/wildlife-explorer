# D-2026-07-30-pr-gate-still-deferred — keep commit-straight-to-`main`, revisit later

Date: 2026-07-30
Status: Active

- **Context:** `D-2026-07-21-branch-model`'s revisit trigger ("CI gets added") had already fired -
  `D-2026-07-21-ci-added` wired `npm run check` into GitHub Actions - which put the "decide whether to
  introduce a PR-gated workflow" task on `docs/TASK_BOARD_SOON.md`, explicitly requiring the user's own
  call rather than an auto-decision.
- **Options presented:** (A) keep commit-straight-to-`main` - matches current solo-dev, low-friction
  practice; CI now catches regressions either way, so the safety net exists without the workflow
  overhead. (B) introduce a PR-gated workflow now - CI-required checks before merge, more meaningful once
  a second contributor or higher-stakes changes become more likely.
- **Decision:** A, explicitly chosen by the user ("don't introduce pr gated workflow for a while yet") -
  not a permanent close, a deferral.
- **Why:** the user's own reasoning - not ready for the overhead yet. No new circumstance (second
  contributor, external stakes) has actually arrived since `D-2026-07-21-branch-model` was written; CI
  existing was the trigger to *ask*, not a reason the answer must flip to B.
- **Consequence:** `AGENTS.md`'s Branch model section stays as-is (commit straight to `main`, no PR gate)
  - amended with a note that this was reconsidered on 2026-07-30 and explicitly reaffirmed, not merely
  never revisited. Graduates "Decide whether to introduce a PR-gated workflow" off
  `docs/TASK_BOARD_SOON.md`.
- **See also:** `D-2026-07-21-branch-model` (the original policy and its revisit trigger),
  `D-2026-07-21-ci-added` (the event that fired the trigger).
- **Status:** Active. **Revisit trigger:** unchanged from `D-2026-07-21-branch-model` - a second
  contributor joins, or a change feels too risky for a direct `main` push. Ask again rather than
  assuming "no" is permanent.
