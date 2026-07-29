# D-2026-07-29-focus-the-shot — Replaced wandering + on/off pulse with a continuous "focus the shot" sweep

- **Context:** After Photo Mode (wandering in/out of frame, `D-2026-07-28-photo-mode-wandering-animals`)
  and timed blur/difficulty (`D-2026-07-28-timed-blur-and-photo-difficulty`) both shipped, user feedback
  was blunt: "the photo system is terrible. we need to rethink it." Asked what specifically felt bad;
  the answer wasn't a mechanical complaint (not "too much waiting," not "timing is too fiddly," not "too
  many stacked mechanics") but "it just doesn't feel satisfying" - a holistic judgment about the whole
  interaction, not any one broken piece.
- **Diagnosis:** the interaction loop was almost entirely passive watching (wait for an animal to wander
  back into frame, then wait for an unpredictable on/off glow to turn on) with the actual reward (blur
  tier, Great Shot badge) only appearing afterward in a separate reveal modal. The moment of pressing the
  shutter itself carried no immediate feedback - the "fun" bottleneck was a feedback-loop gap, not a
  specific number being mistuned.
- **Options presented:** (A) simplify + add "juice" - drop wandering, keep one punchier timing beat, add
  immediate feedback at the tap itself. (B) give active control instead of passive waiting - replace both
  the wander gate and the glow timer with one direct mini-interaction the player continuously tracks and
  reacts to. (C) double down on the wildlife-feels-alive angle - keep wandering, make it visually richer
  (real tracked movement, not an enable/disable toggle), Pokémon-Snap style. (D) stop trying to make the
  click itself the fun part - make photographing instant/trivial, pour all the "juice" into the reveal
  and collection side instead.
- **Decision:** B, chosen by the user directly ("either b or c"; C was flagged as blocked on real
  animation/art investment this session doesn't have - no image-generation tool exists here - so B was
  picked as the buildable option; documented under this session's "Auto Mode" guidance to make the
  reasonable call rather than pause and ask which of the two, given C's stated blocker).
- **Why:** B directly targets the diagnosed problem - it removes essentially all passive waiting (no more
  wander gate at all, every animal always shootable) and replaces the abstract, easy-to-miss-noticing
  on/off glow with a continuously visible, continuously moving element the player naturally tracks and
  times their tap against - agency instead of clock-watching, achievable with existing code/CSS (no new
  art needed, unlike C).
- **Consequence:** `CameraPanel.tsx` rewritten: removed `inFrame` state, the wander-gate presence loop,
  `IN_FRAME_MIN_MS`/`OFF_FRAME_MIN_MS` constants, and the `in-frame`/`off-frame` CSS classes/copy
  ("wandered off - wait for it to come back") entirely. Replaced the on/off `PULSE_DURATIONS` with
  `FOCUS_TUNING`: a per-animal `cycleMs` (full back-and-forth sweep duration) and `sweetSpotWidth`
  (fraction of the sweep centered on position 0.5), driving a continuous 0→1→0 triangle-wave position per
  animal, updated on a single shared 50ms interval (not per-animal recursive timeouts, simpler and more
  testable). A small `.focus-track`/`.focus-sweet-spot`/`.focus-marker` UI renders under each animal's
  name showing the live sweep. Tapping the shutter is unconditional (`disabled={complete}` only, no more
  wander-gate disabling) - `onPhotographAnimal(animalId, greatShot)` keeps its exact prior signature,
  `greatShot` now computed as "was the marker inside the sweet spot at tap time" instead of "was the
  binary pulse currently on." `prefers-reduced-motion` renders no track at all (this preference is
  specifically about opting out of that kind of continuous movement) and falls back to the prior calm
  on/off glow, toggling every `cycleMs/2` - the same fallback shape Photo Mode's reduced-motion path used,
  extended to this mechanism. `effectivePhotoDifficulty`'s role/rarity eligibility logic
  (`roleBonuses.ts`) is unchanged - Animal Researcher's easier-difficulty-for-rare-animals bonus now eases
  the sweep/sweet-spot tuning instead of the old pulse durations, same one-tier-easier behavior. The
  timed-blur system (`photoQuality.ts`) is completely unaffected - it only ever consumed the `greatShot`
  boolean, not how it was computed. No save-schema change. `CameraPanel.component.test.tsx` rewritten for
  the new mechanic (8 tests, all passing on the first run once the sweet-spot timing windows were worked
  out by hand against each animal's tuning).
- **See also:** `D-2026-07-28-photo-mode-wandering-animals` (superseded by this), `D-2026-07-28-timed-blur-
  and-photo-difficulty` (amended - core decision unchanged, only the glow-pacing mechanism this fed into).
- **Status:** Active.
