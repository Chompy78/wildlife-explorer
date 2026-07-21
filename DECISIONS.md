# Wildlife Explorer — Decisions (why it's built this way)

> Authoritative record of decisions **still in force**. One entry per decision:
> **Context → Options → Decision → Why → Status.** Newest at the TOP.
> `CHANGELOG.md` records *what* changed; this records *why*.

## Index

- **D-2026-07-21-browser-test-tooling** — Decided against adopting Playwright as a committed
  devDependency/CI-gated tool for now; vitest + `@testing-library/react` component tests remain this
  repo's practice for "browser-level" behavior (proven sufficient for Forest travel/Continue
  restoration). Playwright stays available for ad hoc, uncommitted manual QA — see full entry.
- **D-2026-07-21-ci-added** — Added `npm run check` as a GitHub Actions workflow on push/PR. This fires
  `D-2026-07-21-branch-model`'s explicit "CI gets added" revisit trigger for the no-PR-gate policy — left
  the branch-model decision itself unchanged (that's the user's call), flagged for a follow-up decision.
- **D-2026-07-20-branch-model-confirmed** — User explicitly confirmed commit-straight-to-`main` remains
  the standing policy, including for harness-pinned sessions: fast-forward-merge the pinned branch into
  `main` before finishing rather than introducing a PR gate. Resolves `D-2026-07-20-web-session-branch-
  override`'s open question — see full entry.
- **D-2026-07-20-web-session-branch-override** — A Claude Code on the web session was pinned by its
  harness instructions to a dedicated branch, conflicting with `D-2026-07-21-branch-model`'s
  straight-to-`main` convention. Followed the session-level pin rather than resolving the conflict
  unilaterally; logged it as a `docs/TASK_BOARD.md` task instead — see full entry. **Resolved** by
  `D-2026-07-20-branch-model-confirmed`.
- **D-2026-07-21-scaffold-port** — Ported PACT's task-board/decisions/skill scaffold, additive-merge
  style: kept `AI.md` as the real entry point, added `AGENTS.md` as a process-layer supplement rather
  than a competing/duplicate governance file. Decision: additive, not build-fresh — see full entry.
- **D-2026-07-21-branch-model** — Chose commit-straight-to-`main`, no feature branches/PRs, for now.
  Same as `chompy78/family-hub`, but this repo is one small step from being ready to reverse it (a real
  `npm run check` gate already exists) — see full entry for the explicit revisit trigger.

## D-2026-07-21-browser-test-tooling · vitest + testing-library stays the practice, Playwright stays uncommitted
- **Context:** `docs/TASK_BOARD.md`'s "Browser-level travel and Continue restoration tests" NOW item
  didn't specify what tool runs those tests, and left it explicitly open ("or expanded unit-level, if
  that's this repo's actual practice"). That item is now done - `src/App.test.tsx` covers Forest travel
  and Continue restoration via vitest + `@testing-library/react` (jsdom), not a real browser. Separately,
  this same sweep used ad hoc Playwright (available in the agent sandbox, not a repo devDependency) for
  manual visual/keyboard QA on Forest Arrival/Fern Trail, and it caught two real bugs jsdom couldn't have
  (a translucent Journal-modal CSS bug, and confirming a dev-mode-only focus bug reproduced in a real
  browser but not in jsdom).
- **Options:** (A1) keep vitest + `@testing-library/react` as the only committed test tool; treat
  Playwright as an uncommitted, ad hoc manual-QA aid for future sessions, not wired into `npm run
  check`/CI. (A2) adopt Playwright as a real devDependency with a `test:e2e` script, run separately from
  `npm run check` (browser download makes it unsuitable to fold into the same gate). (A3) adopt
  Playwright and fold it directly into `npm run check`/CI.
- **Decision:** A1.
- **Why:** the concrete gap this task existed to close (no test proved Continue restores the right
  play area) is already closed by jsdom-level tests, which run fast and need no browser binaries -
  matching this repo's stated preference from the task's own wording. Playwright caught real bugs this
  session, but as a human-in-the-loop visual/keyboard review aid, not because the automated suite needed
  it; committing it now (A2/A3) would add a browser-binary-download dependency and ongoing spec
  maintenance for a solo, early-stage project with no current visual-regression suite and no second
  contributor to share that maintenance - the same reasoning `D-2026-07-21-branch-model` applies to
  branches/PRs. Revisit if visual regressions start slipping through jsdom-only coverage, or a real
  design system with visual snapshots becomes worth having.
- **Consequence:** no new devDependency, no new npm script. `npm run check` (typecheck + vitest + build +
  encoding audit) remains the single verification command per `AI.md`. A future session doing
  visual/responsive/keyboard review may still reach for Playwright ad hoc (as this sweep did for the
  Forest layout and accessibility review tasks) without it being a standing project dependency.
- **See also:** `D-2026-07-21-branch-model` (same no-second-contributor reasoning, applied to CI/PRs).
- **Status:** Active. Revisit trigger: visual regressions slip past jsdom-only coverage, or a second
  contributor wants a real E2E suite.

## D-2026-07-21-ci-added · wired npm run check into GitHub Actions
- **Context:** `D-2026-07-21-branch-model` named "CI gets added" as an explicit revisit trigger for the
  commit-straight-to-`main`, no-PR-gate policy, and `docs/TASK_BOARD.md` carried a low-effort/low-risk
  task to add it, since `npm run check` already exists as a real, working gate. Picked up during an
  unattended `/sweep-tasks` run over the task board.
- **Options:** (A1) add the CI workflow only, leave the branch-model policy untouched and surface the
  now-fired revisit trigger for the user to decide on separately. (A2) add CI and unilaterally switch to
  a PR-gated workflow in the same change, reasoning the trigger firing implies the switch should happen
  automatically.
- **Decision:** A1.
- **Why:** whether a fired revisit trigger should actually change the standing policy is exactly the
  kind of judgment call `AGENTS.md`'s communication conventions reserve for the user, not something an
  unattended sweep should decide on its own — especially for a process/workflow change this consequential
  (it would mean no more direct-to-`main` commits going forward). Adding the workflow file itself is pure
  addition (doesn't change how `main` currently gets committed to) and squarely low-risk; switching the
  policy is not.
- **Consequence:** `.github/workflows/check.yml` runs `npm ci && npm run check` on push to `main` and on
  pull requests. `docs/TASK_BOARD.md`'s "Wire npm run check into CI" item is graduated to `CHANGELOG.md`.
  The branch-model policy in `AGENTS.md`/`D-2026-07-21-branch-model` is unchanged pending the user's call.
- **See also:** `D-2026-07-21-branch-model` (the policy whose revisit trigger this fires).
- **Status:** Active. Follow-up (not yet decided): whether to now introduce a PR-gated workflow.

## D-2026-07-20-branch-model-confirmed · commit-straight-to-main stands, even for harness-pinned sessions
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

## D-2026-07-20-web-session-branch-override · followed the session's branch pin over the repo's straight-to-main convention
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

## D-2026-07-21-scaffold-port · port PACT's scaffold additively, keep AI.md as the real entry point
- **Context:** the user wanted the same `AGENTS.md`/task-board/`DECISIONS.md`/`CHANGELOG.md`/
  `docs/sessions/`/`.claude/commands/*.md` system used on `chompy78/PACT` (and, moments earlier the same
  session, ported to `chompy78/family-hub`) replicated here too. Unlike family-hub (which had product-
  planning docs but zero AI-workflow governance), this repo already has a real, actively-used governance
  file — `AI.md` — plus a genuinely working `npm run check` test/build gate (18 passing tests) and an
  established, verbose `docs/sessions/` narrative style. This is much closer to PACT's own prior
  `homelife` port (mature repo, existing real conventions) than to family-hub's shape.
- **Options:** (1) treat this port identically to family-hub — build `AGENTS.md` as the primary entry
  point, relegate `AI.md` to a legacy/product doc. (2) Add `AGENTS.md`/`DECISIONS.md`/task-board/skills
  purely additively: `AI.md` stays the real "read this first" entry point (it's genuinely good at what
  it does — Canon, Scope boundary, verification command), `AGENTS.md` adds only the process layer
  (task-board format, decision logging, communication conventions) that `AI.md` doesn't cover, and
  explicitly says so rather than pretending to be the sole entry point. (3) Merge `AGENTS.md`'s content
  directly into `AI.md` instead of creating a second file.
- **Decision:** option 2. `AI.md` untouched. `AGENTS.md` created but scoped narrowly — its own first
  line tells a reader to go read `AI.md` first, and it never restates Canon/Scope-boundary/verification
  content `AI.md` already owns.
- **Why:** option 1 would have meant either duplicating `AI.md`'s content into `AGENTS.md` (drift risk —
  exactly the "too many docs pointing at each other" problem family-hub's own port explicitly fixed by
  *removing* competing files) or worse, writing an `AGENTS.md` that quietly ignored real, working
  conventions (Canon, Scope boundary, the encoding-audit gate) this repo already depends on. Option 3
  (merge into `AI.md`) was rejected because `AI.md`'s own stated purpose — a source-of-truth rule for
  project state — is a different concern from PACT-style process conventions (task format, decision
  logging, communication style); folding them into one file risks the same kind of file bloat PACT's own
  `AGENTS.md` already manages by keeping `CLAUDE.md`/`copilot-instructions.md` as thin stubs rather than
  full copies.
- **Consequence:** `CLAUDE.md`/`.github/copilot-instructions.md` both explicitly tell the reader to read
  `AI.md` first, `AGENTS.md` second. `docs/TASK_BOARD.md` was seeded from `CURRENT_CODE_REVIEW.md`'s
  "Next detailed review priorities" (left in place, untouched — it's a milestone-baseline record, a
  different purpose than an open-work tracker). `CHANGELOG.md` (existed as an empty file) was filled in
  with a backfill from the Milestone 3.2–5 history already documented in
  `docs/sessions/WILDLIFE_EXPLORER_SESSION_LOG_2026-07-20.md`. The new session note for this port uses
  this repo's own naming convention (`WILDLIFE_EXPLORER_SESSION_LOG_2026-07-20-scaffold-port.md`), not
  PACT's `<date>-<topic>.md` pattern — matching the existing style rather than importing a new one.
- **See also:** `chompy78/PACT`'s `DECISIONS.md` `D-GH-2026-07-16-agents-workflow-reconcile` (the
  original "read the target's real state, adapt vs. build fresh" precedent, from PACT's own reconciliation
  with an external standard); `chompy78/family-hub`'s `DECISIONS.md` `D-2026-07-21-scaffold-port` (this
  port's immediate predecessor, same session, opposite shape — build-fresh there, additive here).
- **Status:** Active.

## D-2026-07-21-branch-model · commit straight to `main`, no feature branches or PRs, for now
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
