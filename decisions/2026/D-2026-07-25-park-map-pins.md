# D-2026-07-25-park-map-pins · Illustrated Park Map with location pins, and a transform click-hit-testing bug

Date: 2026-07-25
Status: Implemented

- **Context:** `docs/copilot-packages/03-park-map.md` was ready to implement once the user generated the
  map art. The user came back with `public/assets/park-map.png` (1536x1024, 3:2 — not quite the package's
  planned 4:3, which the package itself said was fine, just re-tune the pins).
- **Decision 1 — pin layout:** `src/data/parkMapCoordinates.ts` holds a `Record<LocationName, {top, left}>`
  of percentage positions, tuned by eye against the actual generated image (not the package's placeholder
  guesses, which assumed a 4:3 layout). `.park-map`/`.map-pin` CSS added per the package spec, `aspect-
  ratio` on the container set to `3/2` to match the real art.
- **Decision 2 — a real bug, not just tuning:** the package's original CSS spec put
  `transform: translate(-50%, -50%)` directly on the clickable `.map-pin` button (standard technique for
  centering an element on a percentage-positioned point). In verification, real mouse-coordinate clicks on
  the pins silently did nothing — no error, no console output — while a programmatic `element.click()` on
  the exact same button fired the handler correctly and updated state. Diagnosis (native `mousedown`/
  `mouseup`/`click` listeners logging `event.target` at identical coordinates) showed the browser's
  hit-test target flipping between the image, the span, and the parent `<div>` across the three events at
  the same pixel — a coordinate/hit-test mismatch specific to a `position: absolute` element that *also*
  carries its own CSS `transform`. Confirmed via a live CSS override (`element.style.transform = 'none'`)
  that removing the transform alone fixed real-coordinate clicks.
- **Fix:** restructured to a two-element pattern — a non-interactive `<div className="map-pin-wrap">`
  carries `position: absolute` + the percentage `top`/`left` + the centering `transform`; the actual
  `<button className="map-pin">` lives inside it in normal (untransformed, non-absolutely-positioned) flow.
  Visually identical (confirmed via screenshot diff), but the button itself now has no transform of its
  own, and real-coordinate clicks, keyboard Enter activation, and the existing hidden-location message all
  verified working after the change.
- **Why this matters beyond this one screen:** this app's earlier absolutely-positioned UI (modals, panels)
  never needed `transform` directly on an interactive element, so this pattern hadn't been exercised before.
  Any future feature that positions a clickable element by percentage/coordinate (tooltips, more map pins,
  a minimap, etc.) should default to the wrapper-transform pattern from the start rather than transforming
  the interactive element directly.
- **Status:** Implemented. `npm run check` passes; verified in a real headless-Chromium browser at desktop
  and mobile widths — all 6 pins render on the correct zones, available/hidden/active states style
  correctly, clicking navigates (or shows the hidden-location message for Whisper Grove pre-discovery),
  keyboard Tab+Enter activates pins, and zero failed network requests.
