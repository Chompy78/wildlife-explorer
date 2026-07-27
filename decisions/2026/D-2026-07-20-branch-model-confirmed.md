# D-2026-07-20-branch-model-confirmed · commit-straight-to-main stands, even for harness-pinned sessions

Date: 2026-07-20
Status: Resolved

- **Context:** `D-2026-07-20-web-session-branch-override` left open whether a harness-pinned working
  branch (as this session had) should become a standing exception to `D-2026-07-21-branch-model`'s
  commit-straight-to-`main` policy, and logged it as `docs/TASK_BOARD.md`'s "Reconcile branch-model
  conflict" item. Asked directly, the user answered: commit straight to `main`.
- **Options:** (1) keep commit-straight-to-`main` as the only policy; a pinned branch is a session-level
  implementation detail, not a repo convention change — merge/fast-forward it into `main` before
  finishing. (2) Formalize branch-per-session as a parallel accepted pattern, with no PR requirement.
  (3) Introduce a real PR-gated workflow now.
- **Decision:** option 1. Confirmed directly by the user.
- **Why:** no new fact changed since `D-2026-07-21-branch-model`'s original reasoning (no CI, no second
  contributor, no PR-worthy automated gate yet) — a session being externally pinned to a branch doesn't
  itself justify a process change; it's an environment detail this session's own workflow already showed
  how to absorb (push to the pinned branch, verify, then fast-forward-merge into `main` before
  finishing — exactly what happened with commits `afee9e5`/`c02dfd2`).
- **Consequence:** `AGENTS.md`'s branch-model section now explicitly covers the pinned-branch case.
  `docs/TASK_BOARD.md`'s "Reconcile branch-model conflict" item is graduated to `CHANGELOG.md`.
- **See also:** `D-2026-07-21-branch-model` (the policy being reaffirmed); `D-2026-07-20-web-session-
  branch-override` (the open question this resolves).
- **Status:** Resolved. Active going forward as part of `D-2026-07-21-branch-model`.
