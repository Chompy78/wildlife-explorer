# Package 03 — Illustrated Park Map

**Status:** ready to hand to Copilot 365 for Track A only. Track B (code) is implemented by Claude
directly, not routed through Copilot 365 Chat — see "Handing this to Copilot 365" below.
**Track A:** art brief (one map illustration). **Track B:** code spec (React/CSS).
**Scope:** replace the Park Map's plain grid of button-cards with a single illustrated map image and
clickable location pins positioned on top of it. Same underlying navigation logic
(`goToLocation`/`visitLocation`) — this is a display-only change, not a gameplay change.

---

## 0. Context Copilot needs (read this whole section — it replaces browsing the repo)

**What's being replaced** — `src/components/ParkScreen.tsx`'s `.location-grid`: a grid of rectangular
button-cards, one per location, each showing a big emoji, the location name, its description, and an
"Available now"/"Hidden for now" label. This reads as a form, not a place. Six locations, from
`src/data/locations.ts`:

| `id` | `name` | current `icon` | status |
|---|---|---|---|
| `park-entrance` | Park Entrance | 🌿 | available |
| `duck-pond` | Duck Pond | 🦆 | available |
| `open-meadow` | Open Meadow | 🌼 | available |
| `forest-trail` | Forest Trail | 🌲 | available |
| `strange-old-tree` | Strange Old Tree | 🌳 | available |
| `whisper-grove` | Whisper Grove | 🌺 | **hidden** until `saveData.whisperGroveDiscovered` |

**Canon/Scope** — same as Packages 01/02 (see `AI.md`): calm observation only, Whisper Grove must read as
a natural hidden place (not magical), Strange Old Tree is natural not magical, no new locations are being
added — this only changes how the existing 6 are displayed.

**Art direction** — `docs/VISUAL_DIRECTION.md` + `docs/design-reference/` + the already-shipped hero
images, same as before: bright, colourful, storybook-realistic, rich discoverable detail, calm mood.

**What must NOT change:** the click behaviour. Each pin calls the same `goToLocation(location.name)`
handler that the grid buttons call today, including the existing hidden-location message ("Whisper Grove
is hidden. Explore the old tree after helping the puppy.") when a hidden pin is clicked. No changes to
`src/state/locationState.ts` or any save data.

---

## Track A — Art brief (one map illustration)

**Prompt (revised 2026-07-25 — more explicit landmarks per zone than the original, so pin placement is
easier to eyeball against the actual generated art):**
> A wide, bird's-eye/three-quarter aerial view illustrated map of a children's wildlife exploration park,
> painted in the same bright, colourful, storybook-realistic style as the established Wildlife Explorer
> reference art (attach `wild-camper-direction.png` and `docs/VISUAL_DIRECTION.md`) — warm digital
> painting, fine painterly texture, calm natural lighting, rich but readable detail. The park reads as
> **six distinct, clearly separated zones** connected by one continuous winding dirt path, each visually
> bounded by natural features (trees, hedges, a stream) so every area is easy to tell apart at a glance:
>
> 1. **Park Entrance** (bottom-center foreground): a wooden welcome sign where the path begins, framed by
>    low garden flowers.
> 2. **Duck Pond** (left-middle): a round calm pond with lily pads and reeds.
> 3. **Open Meadow** (right-middle): a sunny grassy clearing with wildflowers.
> 4. **Forest Trail** (upper-center): denser trees and fallen logs, dappled shade, where the path
>    narrows.
> 5. **Strange Old Tree** (top, just left of center): one unmistakably large, gnarled ancient tree
>    standing alone as the park's clear landmark — natural, not glowing or magical.
> 6. **Whisper Grove** (top, just right of the old tree): a small secluded clearing glimpsed through a
>    gap in dense bushes, softly shadowed to suggest it isn't reachable yet.
>
> One single dirt path connects all six areas in that order. Bird's-eye three-quarter perspective
> (looking down and slightly forward, like a treasure-map illustration) so every zone is visible without
> overlapping. No text, no labels, no icons, no UI elements, no people or animals in distress, no combat
> imagery — those are added separately in code.

**Generate 2-3 alternates, not just one** — a 6-zone map is a much harder single-shot composition than a
single animal portrait, and first attempts often come out cluttered or with zones blending together:

```
Make the art park map
Make the art park map — higher aerial angle, more separation between zones
Make the art park map — warmer golden-hour light, slightly closer view
```

Send back whichever reads clearest (or all of them and let Claude help pick) — pin placement in Track B
depends on the zones actually being visually distinguishable.

- **Aspect ratio:** landscape, close to **4:3** (e.g. 1600×1200) — the code below assumes this ratio so
  location pins land in the right spots. If Copilot's output comes out a different ratio, that's fine,
  just say so when you send it back — the pin coordinates may need re-tuning to match.
- **Save as:** `public/assets/tutorial-park/park-map.png`

---

## Track B — Code spec

**Files needed:** `src/components/ParkScreen.tsx`, `src/data/locations.ts` (read-only), `src/styles.css`.
One new file to create: `src/data/parkMapCoordinates.ts`.

### B1. New file — `src/data/parkMapCoordinates.ts`

```ts
import type { LocationName } from '../types/Ids';

// Percentage position of each location's pin within the .park-map image, as (top, left) from the
// top-left corner. Approximate placeholders based on the Track A prompt's described layout — tune
// these against the actual generated map once it exists.
export const parkMapCoordinates: Record<LocationName, { top: string; left: string }> = {
  'Park Entrance': { top: '82%', left: '50%' },
  'Duck Pond': { top: '55%', left: '22%' },
  'Open Meadow': { top: '55%', left: '78%' },
  'Forest Trail': { top: '32%', left: '50%' },
  'Strange Old Tree': { top: '14%', left: '46%' },
  'Whisper Grove': { top: '16%', left: '66%' },
};
```

### B2. CSS — add to `src/styles.css`

```css
.park-map{position:relative;aspect-ratio:4/3;border-radius:28px;overflow:hidden;background:#193d28;margin-bottom:1rem}
.park-map img{width:100%;height:100%;object-fit:cover;display:block}
.map-pin{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:.3rem;border:0;background:none;padding:0;cursor:pointer}
.map-pin .pin-icon{width:2.75rem;height:2.75rem;border-radius:50%;display:grid;place-items:center;font-size:1.4rem;background:#fff;border:3px solid #267043;box-shadow:0 6px 16px rgba(20,60,32,.35)}
.map-pin.active .pin-icon{border-color:#f1b83b;box-shadow:0 0 0 4px rgba(241,184,59,.35)}
.map-pin.hidden .pin-icon{background:#edf0ec;border-color:#8ba58f;opacity:.85}
.map-pin .pin-label{padding:.15rem .55rem;border-radius:999px;background:rgba(18,45,29,.85);color:#fff;font-size:.72rem;font-weight:800;white-space:nowrap}
@media(max-width:520px){.map-pin .pin-icon{width:2.25rem;height:2.25rem;font-size:1.1rem}.map-pin .pin-label{font-size:.65rem}}
```
No new focus styling needed — `button:focus-visible` is already global (`src/styles.css` line 109) and
applies to these since pins stay real `<button>` elements.

### B3. `ParkScreen.tsx`

Replace the `.location-grid` block (the `{visibleLocations.map(...)}` button list) with:

```tsx
<div className="park-map">
  <img src="/assets/tutorial-park/park-map.png" alt="Illustrated map of Tutorial Park" />
  {visibleLocations.map((location) => {
    const coords = parkMapCoordinates[location.name];
    const isActive = location.name === saveData.currentLocation;
    return (
      <button
        key={location.id}
        className={`map-pin ${isActive ? 'active' : location.status}`}
        style={{ top: coords.top, left: coords.left }}
        onClick={() => goToLocation(location.name)}
        aria-label={`${location.name}${location.status === 'hidden' ? ', hidden' : isActive ? ', current location' : ''}`}
      >
        <span className="pin-icon" aria-hidden="true">{location.status === 'hidden' ? '🔒' : location.icon}</span>
        <span className="pin-label">{location.name}</span>
      </button>
    );
  })}
</div>
```
Import `parkMapCoordinates` from `../data/parkMapCoordinates`. Keep the existing `<h2>Park Map</h2>` and
the `<p className="muted">` summary line above this block unchanged — only the button-grid underneath is
replaced.

**Intentional behaviour change:** the grid used to show every location's description text at all times;
the map only shows name + icon per pin (a click still fully selects the location, and its description
already appears in the side panel via `currentLocation.description`, unchanged). This is expected — it's
what makes it read as a map instead of a form.

---

## Handing this to Copilot 365

1. **Track A** — same as Packages 01/02: attach `wild-camper-direction.png` and
   `docs/VISUAL_DIRECTION.md`, paste the prompt above, save as `park-map.png`.
2. **Track B** — send the generated map straight to Claude rather than routing through Copilot 365 Chat
   (per Packages 01/02's experience). Claude will also tune the pin coordinates in
   `parkMapCoordinates.ts` against the actual image once it exists, and verify the result in a browser
   before calling it done.

---

## Done when

- `public/assets/tutorial-park/park-map.png` exists, ~4:3 landscape, matching the established style.
- The Park Map section shows the image with clickable pins for all 6 locations, positioned sensibly on
  the art (tuned by eye against the final image, not left at the placeholder guesses above).
- Clicking a pin behaves exactly as the old grid buttons did: navigates for available locations, shows
  the existing "hidden" message for Whisper Grove before it's discovered, updates the side panel.
- Pins are real, labeled, keyboard-focusable buttons (existing `button:focus-visible` styling applies).
- Works responsively (checked at a narrow mobile width, not just desktop).
- Canon/Scope respected: Whisper Grove and Strange Old Tree read as natural, not magical.
- `npm run check` passes, and the screen is visually verified in a real browser (screenshot), not just
  by the test suite.
