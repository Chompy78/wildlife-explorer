# D-2026-07-25-photo-collection-mechanic · Uncollected-only random selection, modal reveal, Lost Puppy wired in via quest completion

Date: 2026-07-25
Status: Implemented

- **Context:** Copilot generated 5 style variants per animal (originally treated as disposable "pick a
  favorite" drafts, per `docs/copilot-packages/02-animal-portraits.md`). The user clarified afterward
  that all 5 should ship as separate collectible "photos": photographing an animal shows a random one,
  and the player collects the full set over repeat sightings.
- **Decision 1 — no duplicates, ever:** `pickRandomUncollectedVariant()` only draws from variants not
  yet in `collectedPhotoVariants`; once all 5 are collected it returns `null` and the Camera
  Panel/Forest photo buttons disable with a "collection complete" label instead of offering a pointless
  retake. Considered allowing duplicates with the collection state simply not advancing, but the user
  was explicit ("duplicates should not be possible") — a disabled button is a cleaner signal than a
  photo that silently does nothing new.
- **Decision 2 — reveal is a modal, not inline:** Reuses the same overlay/focus-trap pattern already
  built for `HabitatQuiz`/`CompletionCelebration`. The usual objection to modals — they get old fast if
  they fire on something routine — doesn't apply here specifically *because* Decision 1 guarantees every
  trigger is genuinely new content, never a repeat. See the chat discussion for the fuller inline-vs-modal
  tradeoff; the "no duplicates" decision is what tipped it.
- **Decision 3 — Lost Puppy initially excluded, then wired in via quest completion, not the camera:**
  it's `rarity: 'quest'`, and `photographAnimal()` refuses anything but `'common'` (and `'rare-owl'`) —
  Lost Puppy is completed via `QuestPanel`'s own flow. Rather than force it through the camera path,
  `completeLostPuppyQuest()` (`questState.ts`) awards a random variant directly as a reunion keepsake,
  and `QuestPanel`'s "Reunite Puppy" button diffs `collectedPhotoVariants` the same way
  `ParkScreen`/`ForestScreen` do, calling a new `onPhotoReveal` prop threaded up to `ParkScreen`'s
  existing `PhotoReveal` state. Fixed a related latent bug while wiring this in:
  `completeLostPuppyQuest()`'s guard didn't check `quest.completed`, so calling it a second time (only
  possible in theory — the UI already hides the button after completion) would have silently awarded a
  second random photo; added `|| quest.completed` to the guard, matching every sibling quest-step
  function's existing pattern.
- **Status:** Implemented. All 11 animals with generated art have working collection (the 2
  invasive-species animals, Red-eared Slider Turtle and Cane Toad, have no generated art at all and stay
  emoji-only).
