# D-2026-07-29-dynamic-focus-band — Binary blur, growing sweet-spot band (species + global practice)

- **Context:** After "focus the shot" shipped (`D-2026-07-29-focus-the-shot`), user feedback was
  positive but specific: "the photo system looks good. it should always return a blurry one until it's
  within the good shot band. that good shot band shou[ld] start narrow and expand the more shots on that
  animal, and also slowly expand for total photos taken and class may impact." The blur was still riding
  on the older practice-count-floor/timing-nudge hybrid from `D-2026-07-28-timed-blur-and-photo-
  difficulty`, which is a different (and now redundant) shape than what the user described.
- **Decision:** Replace the blur tiering with a strict binary - `getPhotoQualityStyle`/`getPhotoQualityLabel`
  now take only the `greatShot` boolean, no `count` parameter. Move all the "getting better with practice"
  feel into the sweet-spot band's width instead, computed in `CameraPanel.tsx`'s new `getSweetSpotWidth`:
  starts at `START_WIDTH_FRACTION` (35%) of the animal's difficulty tier's `maxSweetSpotWidth` (the old
  fixed `sweetSpotWidth` field, renamed to make clear it's now a ceiling not a constant) on a brand-new
  species, grows linearly to the full ceiling over `SPECIES_MASTERY_SHOTS` (5) photos of that specific
  species, then a further `GLOBAL_BONUS_FRACTION` (15% of ceiling) phases in as the save's
  `getTotalPhotographCount` (sum of `photographCounts` across every species) grows toward
  `GLOBAL_MASTERY_SHOTS` (60) - a small, slow, ongoing-playthrough bonus that helps even on a species shot
  for the first time. Both fractions are additive and clamped, with a `MIN_SWEET_SPOT_WIDTH` (5%) floor.
  Class/role effects are unchanged in mechanism: `effectivePhotoDifficulty(selectedRole, animal)` still
  picks which tier's ceiling width applies (e.g. Animal Researcher's eased rare-animal difficulty) before
  this growth formula scales it - satisfies "class may impact" without new code in `roleBonuses.ts`.
- **Why:** the user's description maps directly onto a two-factor growth curve (species-specific + global)
  gating a binary outcome, rather than the previous system's separate blur-tier ladder - simpler mental
  model for a kid ("hit the glowing zone or don't") while still rewarding practice visibly (the zone itself
  gets easier to hit, which is more legible feedback than a blur amount changing by increments).
- **Bugs found and fixed while building this:**
  1. `TICK_MS` was 50ms (inherited from `D-2026-07-29-focus-the-shot`). The narrowest reachable band
     (`MIN_SWEET_SPOT_WIDTH` on the fastest/hard cycle) crosses in only ~27ms of continuous time - shorter
     than the sampling tick, so an unlucky tick alignment could step clean over the window on a given pass
     even though it was briefly reachable. Reduced `TICK_MS` to 20ms and tightened `.focus-marker`'s CSS
     `left` transition from `0.05s` to `0.02s` to match, in `src/styles.css`.
  2. `SPECIES_MASTERY_SHOTS` was initially set to 8, matching an arbitrary "well-practiced" feel - but
     every animal has exactly 5 collectible photo variants (`animalPhotoVariants.ts`'s
     `PHOTO_VARIANT_COUNTS`) and the shutter disables once `isCollectionComplete` is true, so
     `photographCounts[animalId]` can never exceed 5 in real play. A threshold of 8 made full per-species
     band-width mastery permanently unreachable for every animal in the game. Fixed to 5, matching a full
     collection as the natural, reachable mastery milestone. Found via a Playwright verification script
     hitting a disabled shutter after only 5 clicks.
- **Consequence:** `photoQuality.ts` rewritten to the binary `BLURRY`/`CRISP` shape (see file); its test
  file rewritten to match (4 tests). `CameraPanel.tsx` gained `getTotalPhotographCount`, `getSweetSpotWidth`,
  and the five tuning constants above; `FOCUS_TUNING`'s width field renamed `maxSweetSpotWidth`.
  `PhotoReveal.tsx`'s `photographCount?: number` prop replaced by `showPhotoQuality?: boolean` (the photo
  count no longer feeds the blur math, so the component only needs to know whether to show quality styling
  at all - true for every reveal except the Lost Puppy reunion keepsake, which never used it). Call sites
  updated in `ParkScreen.tsx` and `ForestScreen.tsx`. `CameraPanel.component.test.tsx` gained two new tests
  covering species-specific and global widening, and all existing timing-window comments were re-derived
  by hand for the `TICK_MS=20` tick rate. `npm run check` passes (130 tests, typecheck, build, encoding
  audit). Verified in a real browser via Playwright: sweet-spot width measured at 14.7% fresh, 36.96% after
  4 photos of the same species (screenshots confirm the visible gold band widening); a miss renders
  `blur(3px)` with the unchanged encouraging label. No save-schema change (`photographCounts` already
  existed and is only read differently now, not written differently).
- **See also:** extends `D-2026-07-29-focus-the-shot` (the sweep/marker/tap mechanism itself is unchanged -
  only what happens with the tap result changes here); further simplifies `D-2026-07-28-timed-blur-and-
  photo-difficulty` by removing the practice-count-floor and timing-nudge blur tiers it introduced (that
  decision's core idea, tying quality to timing/practice, survives but now lives in the sweet-spot band's
  width rather than the blur amount).
- **Status:** Active.
