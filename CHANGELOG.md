# Wildlife Explorer — Changelog

> One line per change, **newest first**. *Why* lives in `DECISIONS.md`; the messy middle in `docs/sessions/`.
> This file existed as an empty stub before 2026-07-20 — the entries below are a backfill from
> `docs/sessions/WILDLIFE_EXPLORER_SESSION_LOG_2026-07-20.md` and `MILESTONE_5_NOTES.md`, not
> contemporaneous logging.

- **2026-07-21 · test(canon): confirmed non-Forest destinations remain preview-only** — audited every
  destination card (Mountains, Lake, Safari, Rainforest, Alien Planet) via Playwright; pinning any of
  them keeps the screen on the Wild Camper with no travel action rendered, only Forest travels, per
  `AI.md`'s Scope boundary. No violation found; added a regression test per destination. Also fixed a
  harmless duplicate `'forest'` union member in `GameScreen`. Graduated off `docs/TASK_BOARD.md`.

- **2026-07-21 · fix(a11y): keyboard review of Forest interactions — fixed a real `useModalFocus` bug**
  — keyboard-navigated Forest Arrival/Fern Trail via Playwright: tab order, initial dialog focus, Tab
  trap, Escape-close-and-restore. Found opening the Journal never moved focus into the dialog under
  `npm run dev`. Root cause: React StrictMode double-invokes effects in development, and the old
  cleanup's `requestAnimationFrame`-deferred focus-restore from the discarded first invocation fired
  after the real second invocation had already focused the dialog, stealing focus back. Fixed by
  capturing the pre-dialog "previous" element once per real mount and guarding the deferred restore
  with a generation counter; confirmed via Playwright this never affected production builds (no
  double-invoke there), only made dev-mode keyboard testing misleading. Added a StrictMode-wrapped
  regression test (`src/hooks/useModalFocus.test.tsx`). Screen-reader live region already matched the
  existing Park/Camper pattern, no changes needed. Graduated off `docs/TASK_BOARD.md`.

- **2026-07-21 · fix(ui): Forest layout review — Wildlife Journal panel made opaque** — reviewed Forest
  Arrival and Fern Trail at 360/390px (mobile) and 1280px (desktop) via Playwright screenshots; no
  horizontal-overflow or reflow issues found there. Found and fixed a real pre-existing bug along the
  way: `.journal-panel` inherited `.panel`'s 88%-opacity background, so opening the Journal (shared with
  the Park screen, not Forest-specific) let page content bleed through and overlap its own text. Now
  opaque. Graduated off `docs/TASK_BOARD.md`.

- **2026-07-21 · fix(deps): upgraded vitest to 4.1.10** — patched a critical `npm audit` advisory
  (GHSA-5xrq-8626-4rwp, arbitrary file read/execute when the Vitest UI server is listening).
  `npm run check` passes cleanly on the patched version; `npm audit` now reports 0 vulnerabilities.
  Graduated off `docs/TASK_BOARD.md`.

- **2026-07-20 · docs(process): confirmed commit-straight-to-`main` as the standing branch policy** —
  even for harness-pinned sessions (fast-forward-merge the pinned branch into `main` before finishing,
  no PR gate). Resolves `DECISIONS.md`'s `D-2026-07-20-web-session-branch-override` via the new
  `D-2026-07-20-branch-model-confirmed`; graduated `docs/TASK_BOARD.md`'s "Reconcile branch-model
  conflict" item off the board.

- **2026-07-20 · docs(task-board): added 21 items surfaced by a full project status review** — new
  🟠 SOON section (critical vitest audit vulnerability, stale `README.md.txt`, `package-lock.json`
  drift, session-log naming, the branch-model conflict, CI wiring, verifying the ported
  `.claude/commands`, a favicon, browser-test tooling choice, corrupted-save test coverage,
  milestone-notes backfill), itemized README's Roadmap ideas under 🟡 NEXT, and a new 🟢 SOMEDAY
  section (hosting, a privacy statement, PWA manifest, i18n, audio). See `DECISIONS.md`'s
  `D-2026-07-20-web-session-branch-override` for the branch-model conflict this review surfaced.

- **2026-07-21 · docs(tooling): ported PACT's AI-agent workflow scaffold (additive)** — `AGENTS.md`,
  `CLAUDE.md`, `.github/copilot-instructions.md`, `DECISIONS.md`, `docs/TASK_BOARD.md`, and 7 adapted
  `.claude/commands/*.md` skills, ported from `chompy78/PACT`. Unlike the same-session port to
  `chompy78/family-hub` (build-fresh), this one is additive — `AI.md` stays the real entry point
  untouched, `AGENTS.md` only adds the process layer it doesn't cover. `npm run check` (not a plain
  build) is the skills' verification command. See `DECISIONS.md`'s `D-2026-07-21-scaffold-port` and
  `D-2026-07-21-branch-model`.

- **2026-07-20 · feat: Milestone 5 — Forest arrival shell** — Forest Arrival, one short Fern Trail,
  three common animals (Forest Wren, Forest Wallaby, Shiny Forest Beetle) with photography, Wildlife
  Journal integration, return travel to the Wild Camper. Save schema version 5, migrates older saves.
  Mountains, Lake, Safari, Rainforest, and Alien Planet remain preview-only per the Canon/Scope
  boundary. Verified: TypeScript passed, 7 test files / 18 tests passed, production build passed,
  encoding audit passed.

- **2026-07-19–20 · feat: Milestone 4.1 — Wild Camper polish** — friendly destination names/icons
  (replacing raw storage IDs), first-visit Wild Camper introduction, Expedition Readiness panel, clear
  selected-state text, destination clearing, live announcements, Photo Wall discovery summary,
  responsive + reduced-motion styling. Added a reusable modal-focus hook (initial-control focus, Tab
  trapping, Escape-to-close, focus restoration) applied to Journal, Camper unlock celebration, and the
  Camper introduction. Save schema version 4 (`camperIntroductionSeen`). Added React Testing Library +
  jest-dom + jsdom test infrastructure and `scripts/check-encoding.mjs`; `npm run check` established as
  the standard verification command (typecheck + tests + build + encoding audit).

- **2026-07-19 · feat: Milestone 4.0 — Wild Camper hub** — first playable Wild Camper hub after Tutorial
  Park completion: Route Map, Field Desk, Gear Rack, and Photo Wall stations; preview cards for Forest,
  Mountains, Lake, Safari, Rainforest, Alien Planet (all explicitly preview-only); pin one destination to
  the route map. Save schema version 3 (`camperVisited`, `selectedDestination`, `lastPlayArea`); Continue
  restores the last valid play area, locked-camper states normalize back to Tutorial Park. Fixed an
  inherited double-escaped Unicode bug affecting interface icons.

- **2026-07-19 · feat: Milestone 3.2 — Tutorial Park polish and reliability** — split the growing
  `gameState.ts` into focused modules (`animalState.ts`, `locationState.ts`, `questState.ts`,
  `progressionState.ts`, `saveDefaults.ts`, `saveMigration.ts`, `stateUtils.ts`); explicit save-schema
  versioning, legacy save normalization, validation/safe defaults for malformed saves. Environmental
  clue cards for the Lost Puppy/Rare Owl/Whisper Grove progression, Wild Camper unlock celebration,
  journal keyboard focus + Escape-to-close + focus restoration, ARIA live status messages, visible
  keyboard focus styling. Tests added covering Lost Puppy, Rare Owl, Whisper Grove, Wild Camper unlock,
  and legacy/malformed save migration.

- **2026-07-19 (dated earlier) · fix: source recovery and UTF-8 encoding repair** — recovered the
  project from a Base64 source transfer after direct ZIP upload wasn't possible; normalized mojibake
  (corrupted emoji/icon characters) to UTF-8 without BOM. Packaged as the Milestone 3.1 encoding-fixed
  baseline.
