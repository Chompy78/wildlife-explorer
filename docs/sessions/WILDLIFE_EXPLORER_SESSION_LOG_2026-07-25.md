# Wildlife Explorer — Session Log

**Session date:** 25 July 2026
**Current verified release:** Milestone 5 (schema v9)

## AI Quick Summary

This session moved through four rounds of user-driven UI/UX feedback and one confirmed, three-part
gameplay-excitement build order, plus a Journal redesign. Every round followed the same loop: implement →
`npm run check` (typecheck + tests + build + encoding audit) → real-browser verification → log
(`AI.md`/`DECISIONS.md`/`CHANGELOG.md`/`docs/TASK_BOARD.md`) → commit → push to `main`. By the end of the
session the test suite had grown from the Milestone 5 baseline to 103 passing tests across 18 files, and
the save schema had advanced from v7 to v9.

## 1. Single-screen layout — the floating icon action bar

User feedback opened the session: "the buttons on the side are awkward and take to much screen space. The
map should take up the whole screen if possible. when on a location with a clue, it should be a separate
button, maybe a magnifying glass?"

This was a follow-up refinement to the single-screen landscape layout already in place
(`D-2026-07-25-single-screen-landscape-layout`): the fixed-width sidebar of Camera/Quest/Discover/
Progress/Journey Planner buttons was replaced with a compact floating column of icon-only round buttons
overlaid on the map/content area, so the map/grid gets the full play-area width on Park, Forest and
Camper. A location's nearby clue got its own dedicated magnifying-glass (🔍) button, separate from the
Quest button (which now only ever shows quest steps). A real overlap bug was found and fixed along the
way — the floating icons were briefly anchored to the wrong container edge and clipped under the map on
narrower layouts. Portrait/narrow phones keep the older scrollable stack as a fallback; no orientation
lock was added.

## 2. Gameplay-excitement brainstorm

Next request: "the gameplay is kinda boring. how can we make it more exciting. lets brainstorm a heap of
idea suitable for the target audience. Is there some mechanic we can add to be able to take a good photo?
Also, when taking a photo of an animal, it should give a random fact about the animal or biome. should not
repeat."

Rather than picking a direction unilaterally, three open questions were put to the user via
`AskUserQuestion`:

- **How many facts per animal, and how should they map to photo variants?** → Recommended and chosen:
  5 facts per animal, tied 1:1 to the 5 existing photo variants (fact N unlocks with variant N) — reuses
  the existing no-duplicate variant-collection design instead of inventing a second random-pick system.
- **Should a weather/time-of-day mechanic be built now?** → Recommended and chosen: defer it, cosmetic
  only, and only inside a future "photo mode" rework — too large to fold into this session's smaller wins.
- **What order should the confirmed features ship in?** → Recommended and chosen: smaller wins first
  (facts, then pose-capture/photo-quality, then a biome quiz/achievement), with the bigger animated
  photo-mode scene explicitly deferred to its own design pass.

This produced a confirmed build order, logged as `D-2026-07-25-gameplay-excitement-brainstorm`, and the
first piece — animal facts — shipped in the same round: each of the 11 animals with photo art got 5
kid-friendly facts (`src/data/animalFacts.ts`), one per photo variant. Getting variant N reveals fact N as
a "Did you know?" card in the photo reveal, and permanently afterward in the Journal ("X of 5 facts
learned"). Deliberately no new save field — a fact is learned iff its variant key is already in
`collectedPhotoVariants`, so the feature rides entirely on state that already existed.

## 3. Photo-quality progression and the pose-capture pulse

User: "yes, keep going with the pose-capture mechanic" — confirming the second piece of the build order.

Two things shipped together, both cosmetic and neither touching the photo-variant randomness:

- **Photo-quality progression** — a new `photographCounts: Partial<Record<AnimalId, number>>` save field
  (schema v7→v8). Photos of a species visibly sharpen (CSS blur/scale tiers, `src/data/photoQuality.ts` —
  no new art) as the count for that species rises, applied only to the photo-reveal image, never to
  Camera-panel or Journal thumbnails. Labels stay encouraging at every tier ("First shot - keep
  practicing!" through "Crisp and sharp!") — no tier reads as a failure state, per Canon's "no harsh
  failure."
- **Pose-capture pulse** — while the Camera panel is open, a soft golden glow cycles on the shutter
  buttons on a timer (900 ms on, 1500 ms off). Shooting at any time still always works; shooting during the
  pulse marks that photo a "Great shot!" bonus — purely transient UI state (a `posePulse` boolean driven
  by a `setTimeout` loop), never persisted to save data.

The Lost Puppy reunion photo was deliberately exempted from both the counter and the blur effect — a
one-off heartwarming keepsake shouldn't render "blurry, keep practicing."

A real test-authoring problem surfaced here: `vi.useFakeTimers()` combined with
`userEvent.setup({ advanceTimers: ... })` caused the new `CameraPanel` timer test to hang. Switching to
plain `fireEvent` (from `@testing-library/react`) plus `act(() => { vi.advanceTimersByTime(ms); })`
resolved it immediately — worth remembering for any future timer-driven component test in this codebase.

## 4. Biome-completion quiz and achievement

User: "yes, keep going with the biome quiz and achievement" — the third and final confirmed piece.

Finishing Tutorial Park (the existing `CompletionCelebration` trigger) now chains a short, encouraging
5-question "Ranger Quiz" (`src/components/BiomeQuiz.tsx`, reusing `HabitatQuiz`'s modal pattern). Questions
are built preferring facts the player has already learned, falling back to each animal's static fun fact
so the quiz is never short of content even if the player hasn't photographed every Tutorial Park animal —
`isTutorialComplete` only requires Lost Puppy, Whisper Grove and the Rare Owl, not full photo collection.
Completing the quiz — regardless of score — unlocks a new "Tutorial Park Ranger" achievement (new
`achievements: AchievementId[]` save field, schema v8→v9), shown in a new Journal "Achievements" section.
Participation-based unlocking, not score-gated, again per Canon's "no harsh failure."

## 5. Journal redesign — biome navigation and a real photo album

User: "The journal doesn't have any option to see the photos. ideally can open journal, select the biome,
then scoll to the animal and have a button that opens the photo album." A concrete, sequential UX spec,
executed as described.

`Journal.tsx` was restructured around a `JournalView` state machine (`'biomes' | 'park' | 'forest' |
'rewards'`). Opening the Journal now shows three biome-select cards (Tutorial Park, Forest, Places &
Rewards), each with a discovered-count, instead of one long flat list. Biome grouping is derived from the
existing `forestAnimalIds` list (not `Animal.habitat`, which doesn't cleanly separate Park from Forest) —
no new save state. Every discovered animal with photo art now gets a "📷 View Photos" button opening a new
`PhotoAlbum.tsx` — a grid of the animal's 5 photo slots, showing the real collected photo for each
collected variant and a lock icon for each one not yet collected, reading directly from
`collectedPhotoVariants`.

Two test-authoring snags came up while covering this: a `getByRole('heading', {name:'Duck'})` query
matched both the underlying Journal entry heading and the stacked photo album's heading at once (the
album renders as an overlay on top, not a replacement) — fixed by scoping the query to
`within(screen.getByRole('dialog', {name: /Duck/i}))`, since only the album's dialog has an accessible
name matching the animal. A similar ambiguity in the biome-quiz test (`getByText` matching both an `<h2>`
and a `<p>` containing the same achievement name) was fixed with `getByRole('heading', ...)`.

## 6. Housekeeping — v0.01 tag, branch/skill checks

A request to tag `v0.01` at the commit just before the layout-optimization change
(`4597eff5a773b07481e418e537a8298d7706947d`) hit a hard block: `git push origin v0.01` returned an HTTP
403 from the outbound proxy — an egress-policy denial specific to tag refs (branch pushes worked fine in
the same session), and no GitHub MCP tool exists to create tags/releases (only read-only equivalents).
Per the proxy's own guidance, the failure was reported rather than retried, and manual CLI + GitHub web-UI
tagging/release instructions were given instead, along with a suggested title and release notes for the
v0.01 release once the user created it by hand.

Separately, the user asked to pull `main` for "new skills" and specifically asked about
`.claude/commands/close-session.md`. Verified via `git log --oneline -- .claude/commands/close-session.md`
that the file was added in an earlier commit (`fb84ec2`, porting PACT's AI-agent workflow scaffold) — not
new to this pull. Reported this honestly rather than assuming a discovery. The user then explicitly asked
to run the `close-session` skill, which produced this note as part of its Part 1 logging step.

## Canon and Scope preserved

- All four shipped features are photography/observation-flavored (facts, photo sharpening, a pose timing
  bonus, a completion quiz) — no combat, no catching/collecting/harming animals, no harsh failure state
  anywhere (quiz awards regardless of score, blur labels never read as failure).
- No new playable destination, full Forest expansion, companions, inventory, crafting, shops or economy
  was introduced — the Scope boundary in `AI.md` is unchanged.
- The bigger animated "photo mode" scene and day/night weather idea from the brainstorm were deliberately
  deferred to `docs/TASK_BOARD.md`'s 🟡 NEXT section, not started this session.
