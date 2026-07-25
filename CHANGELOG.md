# Wildlife Explorer — Changelog

> One line per change, **newest first**. *Why* lives in `DECISIONS.md`; the messy middle in `docs/sessions/`.
> This file existed as an empty stub before 2026-07-20 — the entries below are a backfill from
> `docs/sessions/WILDLIFE_EXPLORER_SESSION_LOG_2026-07-20.md` and `MILESTONE_5_NOTES.md`, not
> contemporaneous logging.

- **2026-07-25 · feat(gameplay): added non-native animal reporting with a "where does it belong" habitat
  quiz** — introduces `Animal.nonNative` (a `correctHabitatId` + `impactNote`) on two new animals: the
  Red-eared Slider Turtle (Duck Pond, correct answer Lake) and the Cane Toad (Forest Trail/Fern Trail,
  correct answer Rainforest). Photographing either for the first time opens `HabitatQuiz.tsx`, a small
  accessible modal (reusing `useModalFocus`, same pattern as `CompletionCelebration`/`Journal`) asking
  the player where the animal actually belongs, with answer choices pulled from the existing
  `destinationPreviews` data. Both outcomes are equally encouraging and reveal the same fact — no fail
  state, matching the Canon's "no harsh failure" rule. The Journal gets a calm amber "Logged for the park
  rangers" note (`.invasive-note`) instead of alarm styling, and the Photo Wall summary gets a
  "Non-native sightings reported: N of M" stat. New `Animal.nonNative`-driven `reportedInvasiveSpecies`
  save field required bumping `CURRENT_SAVE_SCHEMA_VERSION` to 6 (migration updated, old saves default to
  `[]`). Verified with 8 new/updated tests plus a real-browser walkthrough (both the correct- and
  incorrect-answer branches, the Journal note, and the Photo Wall stat) — screenshots confirmed the copy
  read cleanly, catching and fixing one redundant-phrasing bug in the Cane Toad's correct-answer text
  before it shipped. Alien Planet is excluded from the quiz's answer choices via a new required
  `quizEligible` field on `DestinationPreview` (see `DECISIONS.md`'s
  `D-2026-07-25-invasive-species-quiz-eligible-flag`) rather than one-off exclusion logic, so a future
  Dinosaur biome stays excluded by default too. A second non-native animal per biome and 8 new preview
  biomes were discussed and deferred — see `docs/TASK_BOARD.md`.

- **2026-07-25 · docs(copilot-handoff): made "Claude implements Track B" the standing policy** — per
  explicit user direction, Copilot 365 is used for Track A (art) only, going forward; Track B is no
  longer offered to Copilot 365 Chat as an option even as a fallback. Updated
  `docs/copilot-packages/README.md`'s conventions and Package 02's handoff instructions to match (Package
  03 already read this way).

- **2026-07-25 · docs(copilot-handoff): drafted Package 03 — illustrated Park Map** —
  `docs/copilot-packages/03-park-map.md` specs replacing `ParkScreen.tsx`'s plain grid of location
  button-cards with a single illustrated map image and clickable location pins positioned on top of it.
  Track A is one map-illustration prompt; Track B is a new `parkMapCoordinates.ts` lookup (percentage pin
  positions, tuned against the actual art once generated), `.park-map`/`.map-pin` CSS, and replacing the
  `.location-grid` block — same underlying `goToLocation`/`visitLocation` logic, no state changes.
  Rated medium effort/risk (Package 01/02's first medium-risk package) since it touches the Park screen's
  primary navigation UI and needs care to keep pins keyboard-accessible and correctly positioned. Not yet
  implemented — tracked as a TODO on `docs/TASK_BOARD.md`.

- **2026-07-25 · docs(copilot-handoff): drafted Package 02 — animal portrait art** —
  `docs/copilot-packages/02-animal-portraits.md` specs real portrait art for all 11 animals (replacing
  emoji) across the Wildlife Journal, Camera Panel, Photo Wall summary and Forest photo buttons. Track A
  is 11 image-generation prompts sharing one master style preamble; Track B is a small new
  `animalPortraits.ts` lookup plus four small display-logic edits, preserving the Journal's existing
  no-spoiler-before-discovery behaviour. Based on Package 01's experience, the package recommends
  skipping Copilot 365 Chat for Track B and having Claude implement it directly once the images are
  back. Not yet implemented — tracked as a TODO on `docs/TASK_BOARD.md`.

- **2026-07-25 · feat(visuals): added Tutorial Park and Forest hero images, generalized the biome-visual
  pattern** — graduates the `docs/copilot-packages/01-biome-backgrounds.md` task. Copilot 365 generated
  both hero images from the package's Track A prompts (matching the established art direction); Copilot
  365 Chat could not complete Track B's code changes, so Claude implemented them directly: renamed
  `.camper-visual`/`.camper-visual-copy` to `.biome-visual`/`.biome-visual-copy` in `styles.css` (shared
  across all three biome screens now), updated `CamperScreen.tsx` to match, and added matching hero
  sections to `ParkScreen.tsx` and `ForestScreen.tsx`. Fixed one test regression along the way — the new
  Park hero's caption originally repeated the header's literal "Tutorial Park" text, breaking
  `App.test.tsx`'s `getByText('Tutorial Park')` assertion (expected exactly one match); changed the
  caption's eyebrow text to "Wildlife photography" instead. Verified visually in a real browser (both
  screens screenshotted, hero images confirmed loading) in addition to `npm run check` passing. Also
  relocated the 4 `VISUAL_DIRECTION.md` reference/mood images the user supplied from a wrongly-placed
  top-level `assets/images/` folder (not served by Vite) into `docs/design-reference/` — kept out of
  `public/` since they're reference material, not shipped assets.

- **2026-07-24 · docs(copilot-handoff): sharpened Package 01's Track A prompts against the actual
  confirmation images** — the user located and shared the 4 reference images `VISUAL_DIRECTION.md`
  describes. Confirmed `03_campervan_base_direction.png` matches the already-shipped
  `wild-camper-direction.png` exactly, and that `01_tutorial_nature_park_direction.png` is a direct,
  specific reference for the Park hero (explorer + dog companion, duck family, lizard, ivy archway
  path) — rewrote the A1 prompt to match it precisely instead of a generic landscape description.
  Confirmed `02_rainforest_many_animals_direction.png` is the separate, preview-only Rainforest
  destination and must not inform the Forest hero (A2 now explicitly excludes rainforest-only species).
  Noted the recurring explorer/dog characters are decorative art only, not a companion game mechanic —
  `AI.md`'s Scope boundary still excludes companions as gameplay. Images not yet committed to the repo
  (shared inline in chat, not as files); pending user decision on whether/how to add them.

- **2026-07-24 · docs(visual-direction): checked in `docs/VISUAL_DIRECTION.md` and reconciled it with
  Package 01** — the user supplied an existing approved art-direction doc (style, character/animal
  rules, environments, secret areas, avoid-list). Committed it as the persistent style source-of-truth,
  subordinate to `AI.md`'s Canon/Scope, with an added Scope note flagging two reconciliations: Forest
  (shipped) is not Rainforest (preview-only destination) and must not borrow its imagery, and
  Crystal Cave/Safari/Mountains/Snowlands/Beach/Wetlands are long-term direction, not current scope. The
  4 confirmation images it references aren't in the repo, so `01-biome-backgrounds.md`'s Track A prompts
  were refined to match its written style language directly rather than waiting on those images.

- **2026-07-24 · docs(copilot-handoff): added a Copilot 365 handoff package for Park/Forest biome
  background visuals** — `docs/copilot-packages/` is a new self-contained-spec workflow for outsourcing
  graphics/UI drafting to Copilot 365 (worked around its 20-file read limit and lack of zip support by
  inlining the exact code/context each package needs). Package 01 covers hero images for the Tutorial
  Park and Forest screens, matching the existing Camper screen's visual pattern and the established art
  direction (`public/assets/wild-camper/wild-camper-direction.png`). Not yet implemented — tracked as a
  TODO on `docs/TASK_BOARD.md` pending the user running it through Copilot and bringing back results.

- **2026-07-21 · fix(a11y): stop `useModalFocus` stealing focus back to the initial control on
  unrelated re-renders** — found during a post-sweep code review of `useModalFocus.ts`'s earlier
  StrictMode fix. The hook re-focused the dialog's initial control on *every* effect re-run, not just
  first mount; since `ForestScreen`/`ParkScreen` define `closeJournal` inline (a fresh function every
  render), any unrelated parent re-render while the Journal was open would snap focus back to the Close
  button, away from wherever the user had tabbed to. Fixed by gating the initial-focus move behind the
  same once-per-real-mount guard already used for the StrictMode fix. Added a regression test
  (confirmed it fails without the fix, passes with it).

- **2026-07-21 · chore(tooling): verified all 7 ported `.claude/commands` against this repo** — ran
  `add-task`, `pick-task`, `run-task`, `cold-plan-review`, `log-lesson`, `close-session`, and
  `sweep-tasks` (this session) for real. Found and fixed a real gap in `pick-task.md`: its fallback
  assumed 🔴 NOW always has a TODO, which broke once this sweep emptied it for the first time — now falls
  through to 🟠 SOON instead. Confirmed `run-task` correctly refuses to auto-decide an ambiguous
  judgment-call task via its own "stop and flag" escape hatch. `log-lesson` drafted two candidates for
  `chompy78/ai-lessons-learned` but couldn't write them - that repo isn't in this session's scope. See
  `docs/sessions/WILDLIFE_EXPLORER_SESSION_LOG_2026-07-21-sweep.md` for the full sweep narrative.
  Graduated off `docs/TASK_BOARD.md`.

- **2026-07-21 · docs: backfilled milestone-notes files for 3.2, 4.0 and 4.1** — added
  `MILESTONE_3_2_NOTES.md`, `MILESTONE_4_0_NOTES.md`, `MILESTONE_4_1_NOTES.md`, extracted from
  `docs/sessions/WILDLIFE_EXPLORER_SESSION_LOG_2026-07-20.md` and matching `MILESTONE_5_NOTES.md`'s
  terse one-paragraph-per-milestone format. Graduated off `docs/TASK_BOARD.md`.

- **2026-07-21 · test(save): covered corrupted and malformed save data** — fed `migrateSaveData`
  non-object top-levels, entirely-wrong-shaped `questProgress`/`lostPuppy`, wrong-typed array fields,
  unknown IDs mixed into valid arrays, and deeply nested garbage; confirmed it always returns a valid,
  safe `SaveData` shape. Added `saveGame.test.ts` covering `loadSave()` against unparseable JSON and
  JSON that parses but isn't an object - neither had any test before. Graduated off `docs/TASK_BOARD.md`.

- **2026-07-21 · docs: decided browser-level test tooling stays vitest + testing-library** — the
  concrete gap ("nothing proves Continue restores the right play area") is already closed by
  `src/App.test.tsx`'s jsdom-level tests. Decided against adopting Playwright as a committed
  devDependency/CI tool for now, even though it caught two real bugs as an ad hoc manual-QA aid this
  same sweep (see `D-2026-07-21-browser-test-tooling`); no new devDependency or npm script added.
  Graduated off `docs/TASK_BOARD.md`.

- **2026-07-21 · feat(ui): added a favicon** — `public/favicon.svg` (a simple 🌲 emoji glyph, matching
  the game's existing icon style) linked from `index.html`; verified it serves in both `npm run dev` and
  the production build (previously a bare browser default-favicon 404 on every load). Graduated off
  `docs/TASK_BOARD.md`.

- **2026-07-21 · ci: wired `npm run check` into GitHub Actions** — added `.github/workflows/check.yml`
  (`npm ci && npm run check` on push to `main` and on PRs); verified locally by running the same
  commands in a clean checkout. This fires `DECISIONS.md`'s `D-2026-07-21-branch-model` "CI gets added"
  revisit trigger for the no-PR-gate policy — logged as `D-2026-07-21-ci-added`, left the policy itself
  for the user to decide on. Graduated off `docs/TASK_BOARD.md`.

- **2026-07-21 · docs: normalized session-log file naming** — renamed
  `docs/sessions/SESSION_LOG_2026-07-19.md` to `WILDLIFE_EXPLORER_SESSION_LOG_2026-07-19.md` to match
  the other session logs' naming convention. Left the one historical-narrative mention of the old
  filename (in the 2026-07-20 status-review log) as-is - it accurately describes what the file was
  called at that point in time; not a broken link. Graduated off `docs/TASK_BOARD.md`.

- **2026-07-21 · chore(deps): regenerated a clean, reproducible `package-lock.json`** — a fresh
  `npm install` on the old committed lockfile produced a diff; regenerated from scratch
  (`rm -rf node_modules package-lock.json && npm install`), then confirmed `npm ci` from the new
  lockfile produces no further diff. The diff itself just reflects that `vite@8.1.5`'s own dependency
  tree has moved on upstream since the lockfile was last generated — it no longer depends on `esbuild`
  (dropping ~78 `@esbuild/<platform>` optional entries) in favor of `lightningcss`/newer `postcss` for
  its CSS pipeline; `npm run check` passes unchanged. Graduated off `docs/TASK_BOARD.md`.

- **2026-07-21 · chore: removed stale `README.md.txt`** — a leftover pre-cleanup draft from the Base64
  transfer era, confirmed unreferenced anywhere in the repo. Graduated off `docs/TASK_BOARD.md`.

- **2026-07-21 · test(app): covered New Game and Reset Save edge cases after Forest travel** —
  confirmed `createDefaultSave()` leaves no stale Forest state behind: New Game and Reset Save both land
  on a clean slate (`lastPlayArea` back to `'park'`, `forestLocation` back to `'Forest Arrival'`,
  `wildCamperUnlocked` false, no leftover photographed/discovered animals) both in the persisted save and
  by continuing play into a fresh Tutorial Park. Graduated off `docs/TASK_BOARD.md` — this was the last
  of the five 2026-07-20 NOW-section review priorities.

- **2026-07-21 · test(app): covered Forest travel and Continue restoration end-to-end** — no test
  previously exercised `App.tsx`'s `continueGame()` screen-selection logic (`forestState.test.ts` only
  covered the pure state-transition functions). Added `src/App.test.tsx`: Forest travel completing from
  the Camper, Continue restoring the Forest play area (with the correct `forestLocation`) after Forest
  travel, Continue still restoring Camper when Forest was never visited, and Continue restoring Camper
  (not Forest) after returning from Forest across a simulated reload. Graduated off `docs/TASK_BOARD.md`.

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
