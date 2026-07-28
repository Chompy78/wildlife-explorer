# D-2026-07-28-timed-blur-and-photo-difficulty — Photo blur reacts to this shot's timing, glow difficulty varies per animal

- **Context:** User feedback after Photo Mode shipped: "the blur should relate to the photo timing so
  the kid keeps trying to get it right. some animals should be easier, some harder." Previously,
  `getPhotoQualityStyle` was driven only by a per-species practice count (`photographCounts`); the
  Great Shot glow-timing bonus existed but had zero effect on displayed blur. The Camera panel's glow
  was also a single shared 900ms-on/1500ms-off timer for every animal, regardless of species.
- **Options for how blur should react to timing:**
  (A) per-shot only: Great Shot = crisp, miss = blurry, full stop - discards the practice-count
  progression and its existing encouraging tier labels.
  (B) hybrid: practice count still sets a rising floor tier (unchanged 4-tier logic); this specific
  shot's timing nudges the displayed tier one step sharper (hit) or blurrier (miss), clamped at both
  ends.
  (C) track a rolling hit-rate per species and derive blur from that average - needs new save state (a
  history or rate per species), the only option touching the save schema.
- **Decision:** B (user explicitly confirmed this option after it was presented with pros/cons).
- **Why:** B keeps the existing encouraging practice-count progression (so a total beginner isn't
  expected to nail timing immediately) while making a Great Shot visibly worth chasing on any given
  photo - directly serving "keeps the kid trying to get it right" without a harsh-failure state (a
  missed glow only ever costs one tier, never resets progress, and is clamped so it can't go below the
  bottom tier). It also needed no save-schema change: the `greatShot` flag was already computed at
  photograph time and already flowing into `PhotoReveal` (just unused for blur), unlike (C).
- **Per-animal difficulty:** rejected reusing `Animal.rarity` as a difficulty proxy - rarity is about
  how often you encounter a species, not how twitchy it is to photograph, and conflating them risks
  feeling like double-punishing a kid for finding something rare. Added a separate `photoDifficulty`
  field instead, assigned per-species roughly by its `behaviours` flavor (calm/stationary animals like
  Duck, Red-eared Slider, Cane Toad, Shiny Forest Beetle = easy; twitchy/fast ones like Butterfly and
  Rare Owl = hard; everything else = medium), each mapping to a glow on/off duration pair in
  `CameraPanel.tsx`'s `PULSE_DURATIONS`. A safe minimum glow window (550ms on for "hard") was kept so
  difficulty never tips into feeling unfair for the target age range (8-14). Keeping difficulty separate
  from rarity deliberately leaves room for a future class-skill bonus (Animal Researcher, logged on
  `docs/TASK_BOARD_NOW.md`) to bridge the two as its unique perk, rather than baking that link into the
  core system for everyone.
- **Consequence:** The Camera panel's glow-pulse timer moved from one global `posePulse` boolean into
  the same per-animal loop structure Photo Mode already built for the in-frame gate - each animal's own
  loop now tracks both its in-frame presence and, only while in frame, its own glow cycle at its
  species' pace. Reduced-motion still skips the wandering gate entirely (every animal always in-frame),
  but the glow itself keeps cycling per-species even then - it's a highlight, not a movement effect, so
  keeping it running matches how the pulse behaved before Photo Mode existed. A concurrency bug was
  caught and fixed while wiring this up: the glow's own pending timeout wasn't actually being tracked, so
  clearing it when an animal wandered off-frame did nothing, risking multiple overlapping glow-cycle
  chains for the same animal after a few in/out cycles - fixed by having the glow loop assign its own
  timeout id to a per-animal variable the presence loop can actually cancel. Verified in a real browser:
  an easy animal's glow visibly stays on longer than a hard one's, and a Great Shot vs. a missed-glow
  photo produce different blur on the reveal screen (confirmed via the actual `filter`/`transform` style
  and the "✨ Great shot!" badge). No save-schema change.
- **See also:** `D-2026-07-28-photo-mode-wandering-animals` (the per-animal in-frame loop this reuses).
  `docs/TASK_BOARD_NOW.md`'s "Class/role skills" task depends on this for the Wildlife Photographer and
  Animal Researcher bonuses.
- **Status:** Active.
