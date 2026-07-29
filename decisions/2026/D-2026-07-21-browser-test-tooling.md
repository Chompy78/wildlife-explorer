# D-2026-07-21-browser-test-tooling · vitest + testing-library stays the practice, Playwright stays uncommitted

Date: 2026-07-21
Status: Active

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
