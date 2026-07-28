# Wildlife Explorer — Changelog

> One line per change, **newest first**. *Why* lives in `DECISIONS.md`; the messy middle in `docs/sessions/`.
> This file existed as an empty stub before 2026-07-20 — the entries below are a backfill from
> `docs/sessions/WILDLIFE_EXPLORER_SESSION_LOG_2026-07-20.md` and `MILESTONE_5_NOTES.md`, not
> contemporaneous logging.

- **2026-07-28 · docs: add 'technical access != scope' rule** — Added a "Technical Access ≠ Scope" section
  to `AGENTS.md`, retrofitted from a new standard-level rule in AI_templates (`AGENTS_TEMPLATE.md`/
  `AI_RULES.md` Rule 10), after direct testing on Home AI Server confirmed a session with broad,
  non-enforced access would cross into a different project's files if asked. See `DECISIONS.md`
  D-2026-07-28-technical-access-not-scope.
- **2026-07-25 · feat(journal): biome navigation and a real per-animal photo album** — the Journal now
  opens on a biome-select screen (Tutorial Park / Forest / Places & Rewards, each with a discovered
  count) instead of one long flat list. Every discovered animal with photo art gets a new "View Photos"
  button opening a grid of its 5 photo slots — the real collected photos, and a lock icon for each
  variant not yet collected. No save-schema change. See `DECISIONS.md`'s
  `D-2026-07-25-journal-biome-navigation-and-photo-album`.
- **2026-07-25 · feat(quiz): biome-completion Ranger Quiz and achievement** — finishing Tutorial Park now
  chains a short, encouraging 5-question trivia quiz (new `BiomeQuiz.tsx`, reusing `HabitatQuiz`'s modal
  pattern) after the existing "You unlocked the Wild Camper!" celebration, drawn from facts the player has
  learned with a fun-fact fallback so it's never short of content. Completing it — regardless of score —
  unlocks the new "Tutorial Park Ranger" achievement (new `achievements` save field, schema v8→v9), shown
  in a new Journal "Achievements" section. See `DECISIONS.md`'s `D-2026-07-25-biome-quiz-and-achievement`.
  This closes out the 2026-07-25 gameplay-excitement brainstorm's confirmed build order.
- **2026-07-25 · feat(camera): photo-quality progression and a pose-capture "Great shot!" pulse** — photos
  of a species now visibly sharpen with practice (new `photographCounts` save field, schema v7→v8, CSS
  blur/scale only — no new art), shown on the photo-reveal image specifically. The Camera panel's shutter
  buttons pulse with a soft golden glow on a timer; shooting anytime still always works, shooting during
  the pulse marks that photo a cosmetic "Great shot!" bonus (not persisted). The Lost Puppy reunion photo
  is exempt from the blur effect. See `DECISIONS.md`'s `D-2026-07-25-photo-quality-and-pose-capture`.
- **2026-07-25 · feat(journal): animal facts tied to photo variants, shown on reveal and in the Journal**
  — each of the 11 animals with photo art now has 5 kid-friendly facts, one per photo variant. Getting
  variant N reveals fact N as a "Did you know?" card in the photo reveal, and the Journal shows "X of 5
  facts learned" plus the facts themselves per animal. No new save state — a fact is learned iff its
  variant is already in `collectedPhotoVariants` (`src/data/animalFacts.ts`). First of a confirmed
  gameplay-excitement build order — see `DECISIONS.md`'s `D-2026-07-25-gameplay-excitement-brainstorm` and
  `docs/TASK_BOARD.md` for what's next (pose-capture timing + practice counter, then a biome quiz/
  achievement).
- **2026-07-25 · fix(ui): floating icon action bar, map fills the screen, separate clue button** —
  follow-up to the single-screen layout: the sidebar was still awkward and ate too much width. The action
  bar is now a compact column of icon-only round buttons floating over the map/content area instead of a
  fixed-width sidebar, so the map/grid uses the full play area on Park, Forest and Camper. A location's
  nearby clue now gets its own 🔍 button, separate from the Quest button (which shows only quest steps).
  Fixed a real overlap bug found while implementing this: the floating icons were briefly anchored to the
  whole play area and covered the location-strip text when it wrapped to two lines — fixed by nesting the
  action bar inside the specific map/content element on each screen instead. See `DECISIONS.md`'s amended
  `D-2026-07-25-single-screen-landscape-layout`.
- **2026-07-25 · feat(ui): single-screen landscape layout for Park/Forest/Camper** — no page scroll at
  common phone/tablet/laptop landscape sizes. Hero banner moved behind an "About" button; Camera/Quest/
  Discover/Progress/Journey Planner moved behind action-bar buttons that open them in a new generic
  `PanelModal.tsx`, reusing the Journal modal pattern. No orientation lock (layout-only); portrait phones
  fall back to a scrollable stack. See `DECISIONS.md`'s `D-2026-07-25-single-screen-landscape-layout`.
- **2026-07-25 · feat(park): illustrated Park Map with clickable location pins** — replaced
  `ParkScreen.tsx`'s plain grid of location button-cards with the generated `park-map.png` (1536x1024)
  and 6 percentage-positioned pins (`src/data/parkMapCoordinates.ts`), tuned by eye against the real art.
  Same underlying `goToLocation`/`visitLocation` navigation, no state changes. Fixed a real click bug
  found during verification: `transform` directly on the clickable pin button broke real mouse-coordinate
  clicks in browser testing (see `DECISIONS.md`'s `D-2026-07-25-park-map-pins`) — moved the transform to
  a non-interactive wrapper div instead. Verified in a real browser: all 6 pins navigate correctly, the
  hidden Whisper Grove message still shows pre-discovery, pins are keyboard-focusable, works at mobile
  width, zero failed network requests.
- **2026-07-25 · chore(assets): generated and banked Lake biome animal art** — all 30 images from
  `docs/copilot-packages/04-lake-biome-animals.md` (6 animals × 5 photo variants) converted PNG→JPEG
  (72.7MB→9.0MB, same treatment as the Park/Forest batch) and renamed to `<animal-id>-<variant>.jpg` in a
  new `public/assets/lake/` folder — banked, not wired into the game yet (Lake has no locations/data model
  until a future milestone), kept out of `public/assets/animals/` so nothing is accidentally live early.
- **2026-07-25 · docs(tasks): logged a task-board entry for photo "quality" progression** — user idea to
  have photos sharpen with practice (blur/crop effect on early attempts); logged with three design
  options and a recommendation, not yet implemented — see `docs/TASK_BOARD.md`.
- **2026-07-25 · fix(deploy): fixed the first GitHub Pages deploy failing at configure-pages** — the
  workflow's first run failed with `HttpError: Not Found` fetching the Pages site config, a known
  chicken-and-egg issue on a brand-new Pages setup. Added `enablement: true` to
  `actions/configure-pages@v5` so it enables Pages itself instead of failing.

- **2026-07-25 · feat(deploy): shipped GitHub Pages deployment** — the game now deploys automatically to
  `https://chompy78.github.io/wildlife-explorer/` on every push to `main`
  (`.github/workflows/deploy.yml`), gated behind the full `npm run check` suite so a broken build/test
  can never reach the live site. Set `vite.config.ts`'s `base: '/wildlife-explorer/'` for the Pages
  project-site subpath, which broke every hardcoded `src="/assets/..."` image reference (root-relative
  paths that worked in dev but would 404 once deployed) — fixed with a new `assetUrl()` helper
  (`src/assetUrl.ts`, wraps `import.meta.env.BASE_URL`) used everywhere instead of raw string literals,
  across `ParkScreen.tsx`, `ForestScreen.tsx`, `CamperScreen.tsx`, and `animalPhotoVariants.ts`'s two
  URL-building functions. Verified for real, not just configured: built the production bundle, served
  `dist/` under the actual subpath, confirmed every image asset (hero images, an animal photo, the
  favicon) returns 200 and the *old* un-prefixed path now 404s, then did a full real-browser walkthrough
  with zero failed network requests. Note for local dev: `base` also changes the dev server's own URL —
  `npm run dev` now serves at `/wildlife-explorer/`, not the root (documented in `AI.md`). One manual step
  remains outside git's reach: enabling "Source: GitHub Actions" in the repo's Pages settings once.

- **2026-07-25 · docs(copilot-handoff): fixed Package 04's Rainbow Trout variants looking near-identical**
  — the user reported the 5 generated trout photos barely differed. Root cause: the 4 variant modifiers
  used across the whole Lake package vary time-of-day *lighting* (morning/golden-hour/overcast/dappled),
  which barely registers once a subject is filtered through water — trout was the only fully-underwater
  animal in the batch. Gave it a separate modifier set that varies water clarity/colour, camera angle,
  motion, and framing distance instead (clear vs murky water, close-up on scales, viewed from below with
  bubbles, etc.) — axes that actually read as different underwater. The other 5 Lake animals are
  above-water subjects in normal open-air light, so their original modifiers are unaffected.

- **2026-07-25 · docs(copilot-handoff): reformatted Package 04 to match the original Package 02
  structure** — the user had an earlier copy of `02-animal-portraits.md` (from before it evolved into
  the 5-photo-variant mechanic) and wanted Package 04 laid out the same way: numbered `## 0. Context` /
  `## Track A` / `## Track B` sections and an `| Animal id | Filename | Subject line |` table. Restructured
  Package 04 to match while keeping the actual content correct — the table now covers the base shot per
  animal, with a second small table for the 4 variant modifiers, since Lake's art still needs 5 photos
  per animal (not 1) to match the shipped mechanic's shape.

- **2026-07-25 · docs(copilot-handoff): revised Package 03's Park Map prompt with explicit per-zone
  landmarks** — the original prompt described rough positions ("left side," "top-center") without
  concrete visual anchors, making pin placement hard to eyeball against the generated art. Rewrote with
  one clear landmark per zone (welcome sign, round pond, gnarled ancient tree, etc.) and added a
  "generate 2-3 alternates" recommendation, since a 6-zone map composition is meaningfully harder to get
  right in one shot than a single animal portrait was.

- **2026-07-25 · docs(copilot-handoff): added Package 04 — Lake biome animal art prep** —
  `docs/copilot-packages/04-lake-biome-animals.md` specs 6 animals (Great Blue Heron, Beaver, Rainbow
  Trout, Loon, Dragonfly, Painted Turtle) across 3 proposed sections (Shoreline, Open Water, Reeds &
  Shallows), 5 photo variants each — 30 images total, same master-prompt + 4-variation-modifier pattern
  as the Park animals. Pure art prep: Lake has no gameplay built yet (preview-only destination, no
  locations/data model), so this produces no code changes today — ready to convert/wire in whenever a
  future milestone builds Lake out for real. Not yet run through Copilot.

- **2026-07-25 · feat(gameplay): wired a Lost Puppy reunion photo into the collection mechanic** — the
  5 generated `lost-puppy-*.jpg` images existed but were unused since Lost Puppy (`rarity: 'quest'`)
  never goes through the camera flow the mechanic hooks into. `completeLostPuppyQuest()` (`questState.ts`)
  now awards a random uncollected variant directly as a reunion keepsake, and `QuestPanel`'s "Reunite
  Puppy" button diffs `collectedPhotoVariants` (same pattern `ParkScreen`/`ForestScreen` already use) to
  trigger `PhotoReveal` via a new `onPhotoReveal` prop. Fixed a related latent bug while wiring this in:
  `completeLostPuppyQuest()`'s guard didn't check `quest.completed`, so a second call (only reachable in
  theory today — the UI hides the button after completion) would have silently awarded a second random
  photo; added the missing check, matching every sibling quest-step function's existing guard pattern.
  All 11 animals with generated art now have working photo collection. Verified with 2 new tests plus a
  real-browser screenshot of the actual reunion reveal.

- **2026-07-25 · feat(gameplay): implemented the multi-photo collection mechanic** — 10 animals (Duck,
  Frog, Butterfly, Rabbit, Lizard, Park Bird, Rare Owl, Forest Wren, Forest Wallaby, Forest Beetle) now
  each have 5 real collectible photo variants instead of a single portrait. Photographing picks a random
  *uncollected* variant only — `pickRandomUncollectedVariant()` makes duplicates structurally impossible,
  not just unlikely — and once all 5 are collected, the Camera Panel/Forest photo buttons disable with a
  "collection complete" label instead of offering a no-op retake. A new `PhotoReveal.tsx` modal (reusing
  the `useModalFocus` pattern already built for `HabitatQuiz`/`CompletionCelebration`) shows the newly
  collected photo at a real size (~320px) with a "New photo!" moment and progress count — the modal
  choice was deliberate: with duplicates impossible, every trigger is guaranteed to be genuinely new
  content, which removes the usual "modals get old fast" objection. The Journal now shows a thumbnail of
  a collected variant plus "X of Y photos collected" with progress dots instead of a static emoji/icon,
  and the Camera Panel/Forest screen/Photo Wall all show small thumbnails too. New
  `collectedPhotoVariants: string[]` save field bumped `CURRENT_SAVE_SCHEMA_VERSION` to 7 (migration
  updated). Lost Puppy was deliberately excluded despite having 5 generated variants — it's completed via
  a separate quest flow that never calls the photograph function the mechanic hooks into; wiring it in is
  logged as a follow-up on `docs/TASK_BOARD.md` rather than shipped half-working. Verified with 7 new
  tests (no-duplicate guarantee, cap-at-total, migration filtering) plus a full real-browser walkthrough:
  camera thumbnails, the reveal modal on first photo, repeated retakes advancing 2/5 → 5/5, the button
  disabling at completion, and the Journal showing 5 filled progress dots.

- **2026-07-25 · chore(assets): switched animal art from one portrait per animal to 5 numbered photo
  variants each** — the user clarified the previously-discarded variation-set alternates weren't meant to
  be discarded: they're meant to be randomly selectable "photos" the player can collect across repeat
  sightings. Restored the 39 variant files deleted in the previous cleanup from git history (`git show
  <commit>:<path>`, not a working-tree revert), combined with 5 newly-uploaded files that completed the
  missing variants for butterfly/rabbit/lost-puppy (every animal now has exactly 5: 1 base + 4 style
  alternates). Converted all 55 to JPEG quality 85 at full 1254px and renamed to
  `public/assets/animals/<id>-<1-5>.jpg` (128.8MB → 15.5MB). The old single-file-per-animal naming
  (`<id>.jpg`) is retired — nothing referenced it yet since Track B was never implemented. Game logic for
  the actual "random photo, collect all 5" mechanic is proposed but not yet implemented — see
  `docs/TASK_BOARD.md`.

- **2026-07-25 · chore(assets): cut the animal portrait art from 120MB to 2.9MB, moved to the correct
  folder** — Copilot's Track A output for Package 02 landed as 51 files (11 base + 40 unused
  variation-set alternates, all 1254px PNG, ~2.3MB each) in `public/assets/tutorial-park/` instead of
  the spec'd `public/assets/animals/`. Real compression testing (`duck.png`, no image content viewed —
  pure Pillow file-size measurement) showed format, not resolution, was the actual bloat: JPEG at the
  same 1254px cut file size ~8x (2549KB → 310KB) with no visible quality loss, versus resizing down which
  would have locked in a size that might not fit a still-undecided "bigger photo reveal" UI direction.
  Kept full 1254px resolution (matches the existing hero art's scale, leaves room for any future
  larger-than-icon use), converted the 11 base files to JPEG quality 85, moved them to
  `public/assets/animals/<id>.jpg`, and deleted the 40 unused variants (never referenced by any code).
  `docs/copilot-packages/02-animal-portraits.md` and `docs/TASK_BOARD.md` updated to reflect `.jpg` and
  the corrected path. Track B (wiring the images into the Journal/Camera Panel/Photo Wall/Forest screens)
  is still not implemented.

- **2026-07-25 · feat(content): added 8 new real-earth preview biomes to the Camper's route map** —
  Desert, Arctic, Coral Reef, Wetlands, Coastal, Grassland, Taiga and Volcanic Highlands join the existing
  Forest/Mountains/Lake/Safari/Rainforest as `status: 'preview'` `DestinationPreview` entries (14 total,
  none playable — same non-functional teaser pattern already established, not a Scope-boundary change).
  All 8 are `quizEligible: true` so they're available as habitat-quiz answers alongside the originals.
  Extended `DestinationId` and `saveMigration.ts`'s destination allowlist to match. Fixed a test that
  hardcoded the previous count of 6 preview cards (now 14) and extended its per-destination coverage to
  include the 8 new ids. Verified with a real-browser screenshot of the full 14-card route map. A future
  bonus Dinosaur biome (discussed but not yet added) will get `quizEligible: false`, same as Alien Planet.

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
