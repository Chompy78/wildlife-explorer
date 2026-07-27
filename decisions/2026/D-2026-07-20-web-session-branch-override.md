# D-2026-07-20-web-session-branch-override · followed the session's branch pin over the repo's straight-to-main convention

Date: 2026-07-20
Status: Resolved

- **Context:** a Claude Code on the web session was given explicit harness-level instructions to develop
  on a dedicated branch (`claude/project-status-review-26absr`) and push there. This conflicts with
  `D-2026-07-21-branch-model` (commit straight to `main`, no branches/PRs), which was itself logged only
  hours earlier in the same day, on `main`, by a different (local) session.
- **Options:** (1) follow the branch pin, push this session's work to the feature branch, and leave
  reconciling the two conventions for later. (2) Ignore the branch pin and push straight to `main` per
  the existing `D-2026-07-21-branch-model` decision. (3) Immediately rewrite `AGENTS.md`'s branch-model
  decision to accommodate branch-per-session work, resolving the conflict now.
- **Decision:** option 1. Pushed this session's commits to the pinned branch, and added a
  `docs/TASK_BOARD.md` item ("Reconcile branch-model conflict") rather than resolving the tension itself.
- **Why:** a session-level branch pin is a more specific, more recently-given instruction than a general
  repo convention, and an agent unilaterally overriding it to satisfy `AGENTS.md` risks doing the wrong
  thing quietly. The reverse — rewriting `AGENTS.md`'s branch-model decision on the spot (option 3) — was
  rejected for the same reason: whether Claude Code on the web sessions being branch-pinned is a one-off
  or a standing environment policy is exactly the kind of fact only the project owner can confirm, so
  the conflict is surfaced as a task rather than pre-resolved.
- **Consequence:** as of this decision, `docs/TASK_BOARD.md`'s expansion (21 new items, see
  `CHANGELOG.md`) lived on `claude/project-status-review-26absr` until it was fast-forward-merged into
  `main` the same session (commits `afee9e5`/`c02dfd2`).
- **See also:** `D-2026-07-21-branch-model` (the decision this conflicted with); `D-2026-07-20-branch-
  model-confirmed` (the resolution).
- **Status:** Resolved by `D-2026-07-20-branch-model-confirmed`.
