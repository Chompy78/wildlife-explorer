# D-2026-07-25-gameplay-excitement-brainstorm · Facts tied to photo variants, deferred a build order for the rest

Date: 2026-07-25
Status: Facts implemented

- **Context:** user feedback that gameplay felt "kinda boring," asking to brainstorm ideas suitable for
  the target audience, specifically asking for (1) a mechanic to reward taking a "good" photo and (2) a
  random, non-repeating fact about the animal/biome shown on photograph.
- **Brainstorm covered:** photo-quality mechanics (timing/pose capture, steady-hold, approach/stealth,
  passive per-species practice), the facts/Journal/quiz chain, an animated "photo mode" scene where
  animals wander in and out of a live view, and weather/time-of-day. All screened against Canon (no
  combat, no harsh failure, no collecting/harming animals) and Scope (no companions/inventory/economy/new
  biome) before being offered.
- **Decisions confirmed via `AskUserQuestion`:**
  1. Photo-quality mechanic: **pose-capture timing cue** (shoot anytime, a soft pulse marks a "great pose"
     moment for a bonus) layered on top of **per-species practice counter** (photos sharpen with repeated
     visits, independent of which variant is picked) — both build on the existing photo-collection
     mechanic without changing its random-variant selection.
  2. Facts: **exactly 5 per animal, tied 1:1 to the 5 photo variants** (not an independent larger pool) -
     rejected the larger-pool alternative because it would require re-enabling photography after an
     animal's collection is already "complete," which the current mechanic deliberately disables.
  3. Weather/time-of-day (once photo mode exists): **cosmetic only** - changes the mood/backdrop while
     framing a shot, but which variant you get stays random-from-uncollected as today. Rejected letting it
     directly pick the variant, since the existing 5 variants already ARE lighting conditions (soft
     morning/golden hour/overcast/dappled shade) and letting the player choose one directly would turn the
     random "surprise" reveal - an explicit earlier decision (`D-2026-07-25-photo-collection-mechanic`) -
     into a directed, deterministic pick.
  4. Sequencing: **ship the smaller wins first** (facts → quiz/achievement → pose-capture/practice
     counter), defer the animated photo-mode scene to its own design pass - it's the biggest unknown (what
     renders the scene? new art or animate existing photo art?) and the other three are ready to build now
     with patterns already proven this session.
- **Built this round — animal facts:** turned out to need **no new save field at all**. Since a fact is
  tied 1:1 to a photo variant, "has this fact been learned" is exactly "is this variant key already in
  `collectedPhotoVariants`" - no separate learned-facts list to maintain, migrate, or version-bump. New
  `src/data/animalFacts.ts` holds 5 kid-friendly facts per animal plus `getFactForVariant`/
  `getFactForVariantKey`/`getLearnedFacts` helpers; `PhotoReveal.tsx` gained an optional `fact` prop shown
  as a "Did you know?" card; `Journal.tsx` gained a `FactsProgress` sub-component showing "X of 5 facts
  learned" plus the learned facts themselves, next to the existing photo-progress dots.
- **Logged to `docs/TASK_BOARD.md`** for the rest of the build order: photo-quality progression (updated
  with the confirmed design), a new biome-completion quiz/achievement task, and the deferred photo-mode/
  weather ideas annotated onto README's existing "Advanced photography features" / "Day and night
  wildlife behaviour" roadmap bullets.
- **Status:** Facts implemented. `npm run check` passes (13 test files, 79 tests - a new
  `animalFacts.test.ts` plus a `PhotoReveal` test for the new `fact` prop). Verified in a real browser:
  photographing an animal shows its matching fact in the reveal, taking 5 photos of the same animal shows
  all 5 facts with zero repeats (matching the 5 variants exactly), and the Journal's fact count/list stay
  in sync with what's been revealed.
