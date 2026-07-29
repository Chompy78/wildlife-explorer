# D-2026-07-28-explorer-role-bonuses — First real bonus per explorer role

- **Context:** `RoleSelect.tsx` picks from 6 explorer roles, but every bonus was placeholder text ("No
  role is the best choice"); `saveData.selectedRole` was saved but only ever used to mark onboarding
  done. User asked to work out what each class actually does, and whether 6 roles is too many.
- **Too many roles?** No. Five of the six map to five genuinely distinct existing systems (facts, camera
  timing, clues, map exploration, rarity) - no redundancy to trim. The sixth, Custom Character, already
  tells the truth about itself ("a flexible role for later customisation") rather than pretending to be
  finished - kept as an honest placeholder, not cut.
- **Bonus mechanics considered and decided (iterated with the user across several rounds):**
  - **Zoologist** - reveals `Animal.funFact` (already existed, previously only used as a `BiomeQuiz`
    fallback) as a bonus "Did you know?" card on the very first photo of a species. No new content.
  - **Wildlife Photographer** - originally proposed as an easier glow window; the user redirected this to
    a bonus 6th photo per animal instead, specifically because a 5-photo album grid "sits awkwardly" and
    6 lays out cleanly, and a role-exclusive bonus photo "encourages playthrough" (replaying with a
    different role to complete the fuller collection). Real 6th-variant art doesn't exist and this
    session has no image-generation tool - shipped as an honest "coming soon" locked preview tile
    (`PhotoAlbum.tsx`'s `.bonus-slot`) rather than faking content or blocking on art that isn't ready.
    Deliberately **not** wired into `getPhotoVariantCount`/`isCollectionComplete`/`pickRandomUncollectedVariant`
    - those still only know about 5 real variants, so nothing risks a broken image load or a changed
    "collection complete" meaning until a real follow-up lands the art. `docs/copilot-packages/
    05-bonus-photo-variants.md` is the art brief for that follow-up (10 animals × 1 bonus photo,
    deliberately excluding `lost-puppy` - its single photo is a one-off reunion keepsake, not a huntable
    collectible).
  - **Conservation Ranger** - originally proposed as extra clue detail + a habitat-quiz hint; the user
    redirected this to double facts (10 total) for common animals instead. Mechanism: each photo-reveal
    for this role pairs the normal fact N with a bonus fact N from a new 50-entry pool (5 per eligible
    animal) in `animalFacts.ts`, rather than inventing a second unlock timeline - by the time the
    existing 5-variant collection completes, all 10 facts are known. Chosen over unlocking bonus facts
    via continued post-completion photographing, since the Camera panel already disables a completed
    species' button entirely and changing that would need new UI for a "no new photo, just a fact" retake
    state - the paired-reveal approach needed no camera-logic changes at all.
  - **Animal Researcher** - easier photo difficulty for rare animals (unchanged from the original
    proposal) **plus** the same double-facts mechanism as Ranger, scoped to `rarity === 'rare'` instead
    of `'common'` - deliberately the one place rarity and photo-difficulty bridge, kept out of the core
    difficulty system so it stays this role's unique bonus rather than a universal rule (see
    `D-2026-07-28-timed-blur-and-photo-difficulty`'s reasoning for keeping those two concepts separate).
  - **Explorer** - originally proposed as "hidden locations reveal sooner"; checking `DiscoveryPanel.tsx`
    showed reveals are already instant/binary once conditions are met, with no "sooner" lever to shorten.
    Corrected to: a still-locked Park Map pin shows its real icon instead of a generic padlock for this
    role - cosmetic only, doesn't change actual unlock conditions or timing.
  - **Custom Character** - no bonus, unchanged.
- **Why the "double facts" mechanism (pair the normal + bonus fact on every reveal) over alternatives:**
  it needed no new unlock timeline, no camera-logic changes, and no new save state - it rides entirely on
  the same `collectedPhotoVariants` gating the normal 5 facts already use, just paired. An alternative
  (facts 6-10 unlock via continued photographing after the 5-variant collection is already complete) was
  rejected because the Camera panel permanently disables a completed species, and enabling "practice
  photography with no new photo" for exactly two roles would have meant new UI and a new post-completion
  interaction state for a relatively small payoff.
- **Consequence:** new `src/data/roleBonuses.ts` centralizes every role-eligibility check
  (`unlocksBonusFacts`, `getsEasierPhotoDifficulty`/`effectivePhotoDifficulty`, `getsBonusFirstPhotoFact`,
  `seesLockedLocationPreview`, `getsBonusPhotoSlot`) so `CameraPanel.tsx`, `ParkScreen.tsx`,
  `ForestScreen.tsx`, `Journal.tsx`, and `PhotoAlbum.tsx` all check role/rarity eligibility the same way
  instead of re-deriving it. `animalFacts.ts` gained a 50-entry `BONUS_FACTS` pool (5 per animal, 9 common
  + Rare Owl) and `getLearnedFacts`/`getTotalFactCount` grew an `includeBonus` parameter.
  `RoleSelect.tsx`'s per-role descriptions and its "Bonuses are placeholder text" subtitle were updated to
  describe the real bonuses (Custom Character called out as the deliberate exception). A real bug was
  found and fixed while wiring this in: `ForestScreen.tsx` had its own separate, un-refactored inline
  camera implementation (a hardcoded global 900ms/1500ms pulse, no wandering gate at all) that predated
  Photo Mode and was never migrated to the shared `CameraPanel` component despite that migration being an
  explicit step in Photo Mode's own task - replaced with `<CameraPanel>`, so Forest now gets wandering
  animals, timed blur, per-animal difficulty, and all 6 role bonuses for free, matching Park. No
  save-schema change. Verified all 5 active bonuses in a real browser: Zoologist's bonus fact, Ranger's
  "2 of 10 facts learned," Explorer's real icon vs. a lock for a non-Explorer role, Animal Researcher's
  eased rare-owl glow pacing plus bonus fact, and Wildlife Photographer's bonus album slot (which also
  visibly confirmed the 5→6 grid-layout improvement the user predicted).
- **See also:** `D-2026-07-28-photo-mode-wandering-animals`, `D-2026-07-28-timed-blur-and-photo-difficulty`
  (both systems this reuses/extends). `docs/copilot-packages/05-bonus-photo-variants.md` (the art brief
  for the still-open Wildlife Photographer follow-up).
- **Status:** Active.
