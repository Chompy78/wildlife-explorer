# D-2026-07-25-invasive-species-quiz-eligible-flag · Habitat quiz answers come from a quizEligible allowlist, not exclusion logic

Date: 2026-07-25
Status: Implemented

- **Context:** Added a calm "where does it belong" habitat quiz (`HabitatQuiz.tsx`) shown once, the first
  time the player photographs a non-native animal (Red-eared Slider Turtle, Cane Toad). It reuses the
  existing `destinationPreviews` data (Forest, Mountains, Lake, Safari, Rainforest, Alien Planet) as its
  multiple-choice answers. The user was explicit that Alien Planet must never be a quiz answer, and that
  a future "bonus Dinosaur biome" must also be excluded once it's added — a requirement for *any*
  future non-real destination, not just these two.
- **Options:**
  - **A. Exclusion list** — hardcode `destination.id !== 'alien-planet'` (and later add `!== 'dinosaur'`)
    directly in the quiz component.
  - **B. Allowlist field** — add a required `quizEligible: boolean` to the `DestinationPreview` type, set
    per entry in `destinations.ts`, and have the quiz filter to `destination.quizEligible`.
- **Decision:** B.
- **Why:** Option A means every future non-real destination has to be remembered and manually added to an
  exclusion list wherever the quiz code lives — an easy thing to forget, and the failure mode (a joke or
  prehistoric biome shows up as a serious "where does this animal belong" answer) is exactly what the
  user flagged twice in one request. Making `quizEligible` a *required* field means TypeScript itself
  forces whoever adds a new destination to make an explicit choice at the data-entry site — it can't be
  silently omitted and default to "eligible." The quiz component never needs to know destination names or
  grow a new exclusion case again.
- **Status:** Implemented — `alien-planet` is `quizEligible: false`; Forest, Mountains, Lake, Safari and
  Rainforest are `true`. A future Dinosaur biome (and the 8 additional real-earth biomes discussed in the
  same session, logged on `docs/TASK_BOARD.md`) just needs to set this field deliberately when added.
