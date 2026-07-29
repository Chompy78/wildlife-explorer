# D-2026-07-29-park-map-portrait — Park Map switched from landscape to portrait, user-supplied art

- **Context:** User reported "the background image no longer appears on my phone" (investigation
  interrupted before a root cause was confirmed). User then directly requested a portrait-oriented Park
  Map instead, offering to generate the art themselves. A landscape 3:2 map forced into the narrow-phone
  CSS fallback (which reverts `.park-map` to a fixed `aspect-ratio: 3/2` box) would render very short on
  a tall phone screen - a very plausible explanation for the original report, though not independently
  confirmed since the fix superseded the investigation.
- **Prompt:** wrote a portrait (~2:3) art brief reusing the same six zones and spatial logic as the
  original landscape prompt (Park Entrance bottom-center, Duck Pond/Open Meadow as a left/right pair,
  Forest Trail center, Strange Old Tree/Whisper Grove as a left/right pair near the top), just reflowed
  to read bottom-to-top instead of spread in a landscape diamond. User generated the art externally and
  supplied it directly (1024×1536 WebP, extracted from the conversation's image content and decoded to a
  file, since no image-generation tool exists in this session).
- **Format:** converted WebP → JPEG. Quality 85 chosen after comparing 90/85/80 - visually clean with no
  compression artifacts at 85, ~590KB (vs. 3.28MB for the original PNG, an 82% reduction), consistent
  with this repo's established PNG/WebP→JPEG treatment for every prior art batch. Saved as
  `park-map.jpg` (the code path/filename changed from `.png`), old `park-map.png` deleted.
- **Pin coordinates:** re-tuned by eye against the actual generated art (not the originally-planned
  coordinates from the prompt-writing stage, which were only a guess ahead of the real image existing).
  Whisper Grove has no distinct "clearing glimpsed through bushes" in the generated art, unlike the other
  5 zones which all rendered clearly - pinned near the stone-step side path in the upper right instead,
  the closest visual candidate, and noted as such in `parkMapCoordinates.ts`'s comment for future re-tuning
  if the art is ever regenerated.
- **Bug found and fixed while wiring this in:** the first attempt paired `.park-map`'s
  `aspect-ratio: 2/3` (matching the new image) with `object-fit: contain` on the `<img>`, reasoning that
  `contain` would safely show the whole portrait image without cropping regardless of what box shape the
  responsive layout produced. This worked correctly on the narrow-phone fallback (where the box is
  explicitly sized to `aspect-ratio: 2/3`, matching the image exactly - no letterboxing either way) but
  broke on desktop, where `.map-column .park-map` still had `aspect-ratio: auto` (stretching the box wide
  to fill available flex space). `contain` correctly avoided cropping the image there, but letterboxed it
  (dark bars) inside the now-much-wider box - and since every pin's `top`/`left` is a CSS percentage of
  the *box* (`.park-map`), not the *visible image content* inside it, every pin except the ones sitting
  at exactly 50% left silently drifted into the letterbox margins, off the actual artwork. Confirmed via
  a real-browser screenshot at desktop width before the fix, and re-verified correct after.
- **Options considered for the fix:**
  (A) keep the box stretching wide on desktop (`aspect-ratio: auto`) and letterbox the image inside it
  via `object-fit: contain`, but recompute pin percentages to account for the letterbox margins at each
  breakpoint.
  (B) always keep `.park-map`'s box at the image's own native ratio (2:3), centered within the available
  space via `align-self: center` (with `.map-column .park-map` no longer overriding to `auto`), so the
  box and the visible image are always the same shape and percentage-positioned pins never need
  breakpoint-specific correction.
- **Decision:** B.
- **Why:** A works but is fragile - it requires recalculating an offset correction for pin coordinates at
  every current and future breakpoint where the box's aspect ratio might differ from the image's, and
  breaks again the moment either changes. B removes the mismatch at its root: when the box is always the
  same shape as the image, there is no letterbox to correct for, and the exact same pin coordinates work
  identically at every viewport size. `object-fit` was reverted to `cover` (equivalent to `contain` once
  the ratios always match, and avoids any fractional-pixel letterbox sliver from rounding).
- **Consequence:** `src/styles.css`'s `.park-map` base rule sets `aspect-ratio: 2/3` (was `3/2`);
  `.map-column .park-map` (the play-screen/desktop context) now sets `align-self: center; max-width: 100%`
  instead of `aspect-ratio: auto`, so it grows to fill available height but is centered at its native
  width rather than stretched; the narrow-phone media query's override also moved to `2/3`. On wide
  desktop screens the map now renders as a portrait card centered in the play area with the page's own
  background gradient showing on either side, rather than filling the full width - a deliberate,
  accepted tradeoff for a portrait source image. Verified in a real browser at desktop (1280×800) and two
  phone-portrait sizes (390×844, 340×640): all 6 pins align correctly with their zones, clicking a pin
  still navigates via the same `goToLocation` handler, and the hidden-Whisper-Grove message still shows
  before discovery.
- **See also:** `docs/copilot-packages/03-park-map.md` (superseded - the original landscape prompt and
  Track B code spec this supersedes, kept as history).
- **Status:** Active.
