# D-2026-07-28-photo-mode-wandering-animals — Camera shutter gates on animal presence instead of always being available

- **Context:** User feedback: photographing was "just press a button," not very interesting. Discussed
  achievable options (richer timing tiers, animal-wanders-in-frame "photo mode", a framing/aiming
  mini-interaction, full day/night scene, shutter-feedback polish) with pros/cons for each; user picked
  the photo-mode direction, which matches `docs/TASK_BOARD_NEXT.md`'s already-logged "Advanced
  photography features" 2026-07-25 brainstorm — its prerequisite smaller wins (facts, quiz,
  pose-capture) had all shipped, unblocking it.
- **Options considered for the presence gate:**
  (A) hide the animal's button entirely while off-frame (no button in the DOM) — most literally matches
  "wanders out of view".
  (B) keep the button always rendered, but disable it and dim/grey it while off-frame, re-enabling with
  a drift animation while in-frame.
- **Decision:** B.
- **Why:** Hiding buttons entirely (A) causes layout shift every few seconds in a modal a young player
  (8-14) is actively looking at, and risks reading as "broken" or "the animal left for good" rather than
  "come back in a moment" — harder to discover, harder to test, and a worse fit for Canon's "no harsh
  failure" tone (an element that vanishes reads more like a fail state than one that's visibly present
  but waiting). B reuses the exact disabled-button visual language this codebase already established for
  "collection complete" (`CameraPanel.tsx`), so the new state doesn't need a new interaction pattern —
  just a new reason to be disabled, with encouraging copy ("X wandered off - wait for it to come back")
  instead of silence.
- **Consequence:** `CameraPanel.tsx` gained a per-animal presence loop (independent randomized
  ~2.5-3.5s in-frame / ~2-4s off-frame cycle, staggered per animal so a group doesn't sync up), composed
  unchanged with the existing pose-capture pulse (the golden "Great shot!" timing still only matters
  while in frame). `prefers-reduced-motion` is checked once via `window.matchMedia` and skips the gate
  entirely — every animal stays always-available, identical to pre-Photo-Mode behavior; this was the
  deliberate a11y fallback, not an afterthought, since the wandering *is* a movement effect the
  preference is specifically about opting out of. jsdom doesn't implement `matchMedia`, so a default
  stub (matches: false) was added to `src/test/setup.ts` — the first component in this repo to need it.
  No save-schema change: presence is transient in-memory UI state, not persisted. Verified in a real
  browser (Playwright) under normal motion (animals visibly cycle independently), emulated reduced motion
  (immediately shootable, no gating), and a small viewport (340×640 — the Camera modal itself doesn't
  clip, following up on `D-2026-07-28-action-bar-clipping-fix`'s small-screen scrutiny).
- **See also:** `D-2026-07-25-photo-quality-and-pose-capture` (the pulse mechanic this composes with,
  unchanged). The "Day and night wildlife behaviour" roadmap item in `docs/TASK_BOARD_NEXT.md` depended
  on this photo-mode rework existing first — it's now unblocked as a future follow-up, not built here.
- **Status:** Active.
