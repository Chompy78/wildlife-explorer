# D-2026-07-25-biome-quiz-and-achievement · Ranger Quiz chained onto Tutorial Park completion

Date: 2026-07-25
Status: Implemented

- **Context:** third and final item in the confirmed gameplay-excitement build order (facts, then photo-
  quality/pose-capture, both shipped earlier the same day). Task board spec: a short quiz on finishing a
  biome, drawn from learned facts, awarding a participation-based achievement.
- **Decision 1 — where it triggers:** chained onto the existing `CompletionCelebration` flow rather than a
  new completion signal. `ParkScreen.tsx`'s celebration `onClose` now also opens the quiz (only if the
  achievement isn't already unlocked), so the sequence reads as one continuous moment: "You unlocked the
  Wild Camper!" → close → 5-question Ranger Quiz → "Achievement unlocked" screen. No change to
  `isTutorialComplete`/`checkTutorialCompletion` (`progressionState.ts`) - `wildCamperUnlocked` flipping
  true is still the one completion signal, just observed twice now.
- **Decision 2 — quiz content never comes up short:** `isTutorialComplete` only requires the Lost Puppy
  quest, Whisper Grove, and photographing the Rare Owl — a player can reach Tutorial Park completion
  having photographed very few of the other common animals, meaning `getLearnedFacts` could return nothing
  for most of them at that moment. `BiomeQuiz.tsx` prefers an already-learned rotating fact per animal but
  falls back to that animal's always-present static `funFact` (the same field the Journal already shows)
  so all 7 quiz-eligible Park animals (`duck, frog, butterfly, rabbit, lizard, park-bird, rare-owl` -
  Lost Puppy excluded, helped rather than "learned about" the same way) always have real question content,
  regardless of how much photography the player actually did.
- **Decision 3 — participation-based, never score-gated:** the achievement unlocks the moment the last
  question's "See my badge" is pressed, with no minimum-correct threshold and no wrong-answer penalty
  (reuses `HabitatQuiz`'s already-established "good try, here's the right answer" tone) - matches `AI.md`'s
  "no harsh failure" Canon rule exactly as the earlier `HabitatQuiz` decision did.
- **Decision 4 — one achievement, extensible list:** new `src/types/Achievement.ts` (`AchievementId`
  union, mirroring the existing `Quest.ts`/`Destination.ts` type-file split) plus `src/data/
  achievements.ts` (a `Record<AchievementId, Achievement>`), currently holding just
  `'tutorial-park-ranger'`. New `achievements: AchievementId[]` save field (schema v8→v9),
  `unlockAchievement()` in a new `achievementState.ts` reusing the existing `addUnique` helper so it's
  idempotent by construction, same pattern as every other id-array save field this session.
- **Status:** Implemented. `npm run check` passes (97 tests across 17 files - new `achievementState.test.ts`,
  `BiomeQuiz.component.test.tsx`, expanded `saveMigration.test.ts`). Verified in a real browser end to end:
  seeded a save one photograph away from Tutorial Park completion, photographed an animal, watched the
  celebration fire, closed it into the Ranger Quiz, answered all 5 questions (feedback correctly named the
  right animal whether the answer was right or wrong), reached the "Achievement unlocked" screen, and
  confirmed the Journal's new Achievements section shows the unlocked badge with its icon and description.
