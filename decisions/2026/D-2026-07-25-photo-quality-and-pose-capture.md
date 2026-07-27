# D-2026-07-25-photo-quality-and-pose-capture · Practice-based sharpening plus a cosmetic pose-capture pulse

Date: 2026-07-25
Status: Implemented

- **Context:** second item in the confirmed 2026-07-25 gameplay-excitement build order (facts shipped
  first). Design was already narrowed to option B (per-species practice counter, independent of which
  variant is picked) plus a pose-capture timing layer, both chosen over the task board's earlier
  alternatives — see `D-2026-07-25-gameplay-excitement-brainstorm` for the full options considered.
- **Decision 1 — where quality is tracked:** a new `photographCounts: Partial<Record<AnimalId, number>>`
  save field (schema v7→v8), bumped every time `photographAnimal`/`photographForestAnimal` succeeds,
  regardless of which random variant was picked or whether that variant was already collected. Deliberately
  separate from `collectedPhotoVariants` so it keeps rising past 5 (collection "complete" only caps which
  variants you can still get, not how much you've practiced with that species).
- **Decision 2 — how quality is shown:** CSS-only, applied to the `PhotoReveal` image specifically (the
  "moment of the shot"), not retroactively to Camera-panel or Journal thumbnails - those keep showing
  photos at normal clarity everywhere else, so a growing photo journal doesn't visually degrade instead of
  improve. Four tiers (`src/data/photoQuality.ts`): count 1 → `blur(3px)` + `scale(1.12)` ("First shot -
  keep practicing!"), rising through count 2 and 3 to fully crisp (`filter: none`) from count 4 onward. The
  photo is wrapped in a new `.reveal-photo-frame` (fixed size, `overflow: hidden`) so the zoom-in scale
  clips cleanly instead of visually overflowing the modal.
- **Decision 3 — Lost Puppy is exempt:** the reunion keepsake is a single guaranteed moment, not a
  repeated skill-building interaction (`completeLostPuppyQuest` never bumps `photographCounts`), and
  `ParkScreen` never passes a `photographCount` for it - showing a heartwarming reunion photo as "blurry,
  keep practicing" would read wrong tonally for a one-off moment (`AI.md`'s "no harsh failure").
- **Decision 4 — the pose-capture pulse needs no live scene:** the bigger animated "photo mode" idea is
  still deferred (see the brainstorm entry), so the pulse was built directly into the existing
  button-list `CameraPanel` instead of waiting on that rework. A shared timer (`setTimeout` loop, 1500ms
  dim / 900ms bright) toggles a `posePulse` boolean; while true, shutter buttons get a soft golden ring
  (`box-shadow`, CSS-transitioned) and the animal is fully photographable either way — shooting during the
  glow just marks that specific photo `greatShot: true`, shown as a "✨ Great shot!" badge on the reveal
  and a slightly different reveal message. This is **not persisted anywhere** - purely a one-time cosmetic
  flag passed through component state for that single reveal, matching the "cosmetic badge only" scope
  from the task board.
- **Why not reuse `CameraPanel` for Forest too:** `ForestScreen.tsx` has its own inline photo-target list
  with different disable-once-photographed behavior (not `isCollectionComplete`-gated like Park's shared
  `CameraPanel`). Refactoring it to use the shared component would have silently changed that existing
  retake behavior as a side effect of adding the pulse - out of scope for this change - so the same pulse
  timer was duplicated directly into `ForestScreen.tsx` instead, preserving its existing behavior exactly.
- **Status:** Implemented. `npm run check` passes (92 tests across 15 files - new `photoQuality.test.ts`,
  `CameraPanel.component.test.tsx`, expanded `PhotoReveal`/`saveMigration`/`gameState`/`forestState` tests).
  Verified in a real browser across a full sequence of 5 photographs of one species: photo 1 visibly
  blurred and labeled "First shot - keep practicing!", a photo taken during the pulse showed the "Great
  shot!" badge and a distinct message, photo 3 measured `blur(0.6px)` via computed style, photos 4-5
  measured `filter: none` (fully crisp) - and confirmed the Camera panel's own thumbnail and the Journal's
  thumbnail both stay unblurred throughout, matching the "reveal-only" design decision.
