# Wildlife Explorer — Decisions (why it's built this way)

> Authoritative record of decisions **still in force**. One entry per decision:
> **Context → Options → Decision → Why → Status.** Newest at the TOP.
> `CHANGELOG.md` records *what* changed; this records *why*.

## D-2026-07-29-park-map-portrait · Park Map switched from landscape to portrait, user-supplied art

**Status:** Active

**Summary:** Replaced the landscape 3:2 Park Map with a portrait 2:3 map (user-generated, handed to
  Claude to integrate) for better phone display. All 6 pins re-tuned against the new art. Found and
  fixed a real pin-misalignment bug along the way: letting the map's box stretch wide on desktop while
  `object-fit: contain` letterboxed the portrait image inside it broke percentage-based pin positioning
  (pins are relative to the box, not the visible image). Fixed by keeping the box at the image's native
  ratio everywhere instead of stretching it. Converted to JPEG (quality 85, ~590KB, an 82% reduction from
  the original 3.28MB PNG). See full entry.

**Record:** decisions/2026/D-2026-07-29-park-map-portrait.md

## D-2026-07-28-explorer-role-bonuses · First real bonus per explorer role

**Status:** Active

**Summary:** Wired a first real, small, roughly-equal bonus into each of the 6 explorer roles, each
  tied to an existing mechanic: Zoologist (bonus fact on first photo), Wildlife Photographer (bonus 6th
  photo slot, shipped as an honest "coming soon" preview pending art), Conservation Ranger (double facts
  for common animals), Explorer (early icon preview for locked locations), Animal Researcher (easier
  photo difficulty + double facts, both for rare animals only), Custom Character (deliberately no
  bonus yet). Found and fixed a real gap along the way: `ForestScreen.tsx` had its own un-refactored
  inline camera implementation that never received Photo Mode or per-animal difficulty - replaced with
  the shared `CameraPanel` component. No save-schema change. See full entry.

**Record:** decisions/2026/D-2026-07-28-explorer-role-bonuses.md

## D-2026-07-28-timed-blur-and-photo-difficulty · Photo blur reacts to this shot's timing, glow difficulty varies per animal

**Status:** Active

**Summary:** Redesigned `photoQuality.ts` so the existing practice-count blur tiers act as a floor, and
  this specific shot's timing (did it land during the Great Shot glow?) nudges the displayed tier one
  step sharper or blurrier, clamped at both ends - keeps the encouraging practice progression while
  making timing genuinely matter, without a harsh-failure state. Each animal also gained a
  `photoDifficulty` (`easy`/`medium`/`hard`) driving its own glow on/off pacing in `CameraPanel.tsx`,
  replacing the old single shared timer. Composes with Photo Mode's existing per-animal in-frame gate.
  No save-schema change. See full entry.

**Record:** decisions/2026/D-2026-07-28-timed-blur-and-photo-difficulty.md

## D-2026-07-28-photo-mode-wandering-animals · Camera shutter gates on animal presence instead of always being available

**Status:** Active

**Summary:** Promoted the "Advanced photography features" 2026-07-25 roadmap item's first slice:
  `CameraPanel` now cycles each animal in/out of frame on an independent randomized timer (staggered),
  and the shutter is only enabled while the animal is actually in frame. Off-frame is never a failure —
  disabled with encouraging copy, same visual language as an already-complete collection, per Canon's
  "no harsh failure". Composes unchanged with the existing pose-capture pulse. `prefers-reduced-motion`
  skips the gate entirely. No save-schema change. See full entry.

**Record:** decisions/2026/D-2026-07-28-photo-mode-wandering-animals.md

## D-2026-07-28-action-bar-clipping-fix · Action-bar buttons clipped on small maps, fixed with a bounded scroll

**Status:** Active

**Summary:** The floating icon action bar (up to 7 buttons on Park) is an absolutely-positioned column
  inside an `overflow: hidden` map box. On narrow phones, and whenever both Clue and Discover show at
  once, the column could be taller than the box, silently clipping the bottom button(s) with no way to
  reach them. Fixed by anchoring `.action-bar` with both `top` and `bottom` plus `overflow-y: auto`
  (scrolls internally instead of clipping) rather than reflowing it into a wrapping horizontal row —
  lower-risk, no visual change on screens where it already fit. See full entry.

**Record:** decisions/2026/D-2026-07-28-action-bar-clipping-fix.md

## D-2026-07-28-wildlife-explorer-task-board-split · Split docs/TASK_BOARD.md into NOW/SOON/NEXT/SOMEDAY

**Status:** Accepted

**Summary:** Split docs/TASK_BOARD.md into TASK_BOARD_NOW.md/_SOON.md/_NEXT.md/_SOMEDAY.md by its
  existing four bands — this had been missed when DECISIONS.md was split, caught during a cross-project
  verification sweep. Updated all `.claude/commands/*.md` references to match.

**Record:** decisions/2026/D-2026-07-28-wildlife-explorer-task-board-split.md

## D-2026-07-28-technical-access-not-scope · Add a "technical access ≠ scope" rule to AGENTS.md

**Status:** Accepted

**Summary:** Added a "Technical Access ≠ Scope" section to AGENTS.md, after direct testing on Home AI
  Server confirmed a session with broad, non-enforced access would cross into a different project's files
  if asked.

**Record:** decisions/2026/D-2026-07-28-technical-access-not-scope.md

## D-2026-07-26-code-command-marker · renamed `.claude/commands/` files to carry a `-code-` marker

**Status:** Active

**Summary:** Renamed all seven `.claude/commands/` files to carry a `-code-` marker
  (`add-code-task.md`, `close-code-session.md`, `log-code-lesson.md`, `make-code-cold-plan-review.md`,
  `pick-code-task.md`, `run-code-task.md`, `sweep-code-tasks.md`), matching the convention
  `chompy78/PACT` and `chompy78/homelife` already applied, to disambiguate this repo's git/PR-driven
  engineering command family from a separate, lighter "-chat-" Claude.ai Skills family used for
  project-tracking elsewhere. Six renames were mechanical insertions after the leading verb;
  `cold-plan-review.md` got a deliberate rewrite to `make-code-cold-plan-review.md` (added a leading
  verb, matching the other repos' identical precedent for this exact filename shape). See full entry.

**Record:** decisions/2026/D-2026-07-26-code-command-marker.md

## D-2026-07-25-journal-biome-navigation-and-photo-album · Biome-select navigation and a real photo grid

**Status:** Implemented

**Summary:** User feedback: the Journal had no way to actually see collected photos, just a
  single small thumbnail per animal. Redesigned to a biome-select → animal-list → photo-album
  navigation: opening the Journal now shows three category cards (Tutorial Park, Forest, Places
  & Rewards, each with a discovered-count), and every discovered animal with photo art gets a
  "View Photos" button opening a grid of its 5 slots (real photo for each collected variant, a
  lock icon for each not-yet-collected one). No save-schema change — grouping is derived from
  the existing `forestAnimalIds` list, and the album reads directly from
  `collectedPhotoVariants`. See full entry.

**Record:** decisions/2026/D-2026-07-25-journal-biome-navigation-and-photo-album.md

## D-2026-07-25-biome-quiz-and-achievement · Ranger Quiz chained onto Tutorial Park completion

**Status:** Implemented

**Summary:** Third and final piece of the 2026-07-25 gameplay-excitement build order: finishing
  Tutorial Park now chains a 5-question "Ranger Quiz" (new `BiomeQuiz.tsx`, reusing
  `HabitatQuiz`'s modal pattern) after the existing `CompletionCelebration`, drawn from learned
  facts with a fun-fact fallback so it's never short of content, awarding a new `achievements`
  save field (schema v8→v9) on completion regardless of score — participation-based, per
  Canon's "no harsh failure". Shown in the Journal via a new "Achievements" section. See full
  entry.

**Record:** decisions/2026/D-2026-07-25-biome-quiz-and-achievement.md

## D-2026-07-25-photo-quality-and-pose-capture · Practice-based sharpening plus a cosmetic pose-capture pulse

**Status:** Implemented

**Summary:** Second piece of the gameplay-excitement build order: photos of a species sharpen
  with practice (new `photographCounts` save field, schema v7→v8, CSS blur/scale only, no new
  art), plus a pose-capture pulse on the Camera panel's shutter buttons — shoot anytime, shoot
  on the pulse for a cosmetic "Great shot!" bonus that isn't persisted anywhere. The Lost Puppy
  reunion photo is deliberately exempt from the blur (always shown crisp). See full entry.

**Record:** decisions/2026/D-2026-07-25-photo-quality-and-pose-capture.md

## D-2026-07-25-gameplay-excitement-brainstorm · Facts tied to photo variants, deferred a build order for the rest

**Status:** Facts implemented

**Summary:** Brainstormed ways to make gameplay more exciting within Canon/Scope, then built
  the first, lowest-risk piece: 5 facts per animal tied 1:1 to its 5 photo variants (getting
  variant N reveals fact N), shown in the photo reveal and permanently in the Journal, no new
  save state needed. Confirmed build order for the rest: pose-capture "good shot" timing +
  per-species practice counter next, then a biome-completion quiz/achievement, with the bigger
  animated photo-mode scene and weather/time-of-day ideas deferred to their own design pass.
  See full entry.

**Record:** decisions/2026/D-2026-07-25-gameplay-excitement-brainstorm.md

## D-2026-07-25-single-screen-landscape-layout · Hero and panels moved behind buttons, no orientation lock

**Status:** Implemented

**Summary:** User feedback: the Park/Forest/Camper screens were "too hard to use" and required
  scrolling. Restructured to a single-screen landscape-optimized layout on all three: the hero
  banner moved behind an "About" button, and Camera/Quest/Discover/Progress/Journey Planner
  moved behind action-bar buttons that open them as modals (new `PanelModal.tsx`, reusing the
  Journal modal pattern already proven this session). No orientation lock — layout-only,
  portrait still works via a scrollable fallback. Chosen via `AskUserQuestion` from tiered
  options per `AGENTS.md` convention. **Amended same day:** further feedback that the sidebar
  itself was still awkward and ate too much space — the action bar is now a compact floating
  column of icon-only buttons overlaid on the map (not a sidebar), and a location's clue got
  its own 🔍 button separate from Quest. See full entry.

**Record:** decisions/2026/D-2026-07-25-single-screen-landscape-layout.md

## D-2026-07-25-park-map-pins · Illustrated Park Map with location pins, and a transform click-hit-testing bug

**Status:** Implemented

**Summary:** Implemented the illustrated Park Map (`docs/copilot-packages/ 03-park-map.md`'s
  Track B): 6 clickable pins positioned by percentage over a single map image, replacing the
  plain location-card grid. Found and fixed a real click-hit-testing bug along the way: a
  `transform: translate(-50%, -50%)` directly on the clickable `<button>` made real
  mouse-coordinate clicks silently miss the button in headless-browser testing (programmatic
  `.click()` still worked, proving the handler itself was wired correctly) — fixed by moving
  the transform to a non-interactive wrapper `<div>` and keeping the button itself
  untransformed. See full entry for the diagnosis and why this pattern should be avoided for
  any future absolutely-positioned clickable element.

**Record:** decisions/2026/D-2026-07-25-park-map-pins.md

## D-2026-07-25-github-pages-deployment · GitHub Pages, base-path asset-URL fix, deploy gated behind full check

**Status:** Implemented

**Summary:** Deployed to GitHub Pages (`https://chompy78.github.io/ wildlife-explorer/`) rather
  than Vercel/Netlify/a custom domain, since the app is 100% client-side (local-storage only,
  no backend) and the repo already lives on GitHub — free, zero new accounts, no new service to
  manage. This requires `vite.config.ts`'s `base: '/wildlife-explorer/'`, which broke every
  hardcoded `src="/assets/..."` image path (they resolved from the domain root, not the Pages
  subpath) — fixed with a new `assetUrl()` helper (`src/assetUrl.ts`) used everywhere instead
  of raw string literals. Verified for real: built, served the actual `dist/` output under the
  subpath, and confirmed in a real browser with zero failed network requests (and confirmed the
  *old* un-prefixed path now 404s, proving the fix was load-bearing, not cosmetic). See full
  entry for the deploy workflow shape.

**Record:** decisions/2026/D-2026-07-25-github-pages-deployment.md

## D-2026-07-25-photo-collection-mechanic · Uncollected-only random selection, modal reveal, Lost Puppy wired in via quest completion

**Status:** Implemented

**Summary:** Animals with generated art (11 of them) each have 5 collectible photo variants
  instead of one static portrait. Random selection only ever draws from *uncollected* variants
  (duplicates are impossible by construction, not by chance), and the reveal is a modal (reused
  pattern, and every trigger is now guaranteed meaningful since duplicates can't happen). Lost
  Puppy was initially excluded (rarity `'quest'`, never touches the camera flow), then wired in
  separately via `completeLostPuppyQuest` as a reunion keepsake — see full entry for both
  halves.

**Record:** decisions/2026/D-2026-07-25-photo-collection-mechanic.md

## D-2026-07-25-invasive-species-quiz-eligible-flag · Habitat quiz answers come from a quizEligible allowlist, not exclusion logic

**Status:** Implemented

**Summary:** The new "where does it belong" habitat quiz (shown after photographing a
  non-native animal) draws its answer choices from an explicit `quizEligible: boolean` field on
  `DestinationPreview`, not an exclusion list. Alien Planet is `false`; the user's promised
  future Dinosaur biome must be too — see full entry for why an allowlist beats remembering to
  exclude each new non-real destination.

**Record:** decisions/2026/D-2026-07-25-invasive-species-quiz-eligible-flag.md

## D-2026-07-21-browser-test-tooling · vitest + testing-library stays the practice, Playwright stays uncommitted

**Status:** Active

**Summary:** Decided against adopting Playwright as a committed devDependency/CI-gated tool for
  now; vitest + `@testing-library/react` component tests remain this repo's practice for
  "browser-level" behavior (proven sufficient for Forest travel/Continue restoration).
  Playwright stays available for ad hoc, uncommitted manual QA — see full entry.

**Record:** decisions/2026/D-2026-07-21-browser-test-tooling.md

## D-2026-07-21-ci-added · wired npm run check into GitHub Actions

**Status:** Active

**Summary:** Added `npm run check` as a GitHub Actions workflow on push/PR. This fires
  `D-2026-07-21-branch-model`'s explicit "CI gets added" revisit trigger for the no-PR-gate
  policy — left the branch-model decision itself unchanged (that's the user's call), flagged
  for a follow-up decision.

**Record:** decisions/2026/D-2026-07-21-ci-added.md

## D-2026-07-20-branch-model-confirmed · commit-straight-to-main stands, even for harness-pinned sessions

**Status:** Resolved

**Summary:** User explicitly confirmed commit-straight-to-`main` remains the standing policy,
  including for harness-pinned sessions: fast-forward-merge the pinned branch into `main`
  before finishing rather than introducing a PR gate. Resolves
  `D-2026-07-20-web-session-branch-override`'s open question — see full entry.

**Record:** decisions/2026/D-2026-07-20-branch-model-confirmed.md

## D-2026-07-20-web-session-branch-override · followed the session's branch pin over the repo's straight-to-main convention

**Status:** Resolved

**Summary:** A Claude Code on the web session was pinned by its harness instructions to a
  dedicated branch, conflicting with `D-2026-07-21-branch-model`'s straight-to-`main`
  convention. Followed the session-level pin rather than resolving the conflict unilaterally;
  logged it as a `docs/TASK_BOARD.md` task instead — see full entry. **Resolved** by
  `D-2026-07-20-branch-model-confirmed`.

**Record:** decisions/2026/D-2026-07-20-web-session-branch-override.md

## D-2026-07-21-scaffold-port · port PACT's scaffold additively, keep AI.md as the real entry point

**Status:** Active

**Summary:** Ported PACT's task-board/decisions/skill scaffold, additive-merge style: kept
  `AI.md` as the real entry point, added `AGENTS.md` as a process-layer supplement rather than
  a competing/duplicate governance file. Decision: additive, not build-fresh — see full entry.

**Record:** decisions/2026/D-2026-07-21-scaffold-port.md

## D-2026-07-21-branch-model · commit straight to `main`, no feature branches or PRs, for now

**Status:** Active

**Summary:** Chose commit-straight-to-`main`, no feature branches/PRs, for now. Same as
  `chompy78/family-hub`, but this repo is one small step from being ready to reverse it (a real
  `npm run check` gate already exists) — see full entry for the explicit revisit trigger.

**Record:** decisions/2026/D-2026-07-21-branch-model.md
