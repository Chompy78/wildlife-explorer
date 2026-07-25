# Package 02 — Animal portrait art (Wildlife Journal + Camera Panel + Photo Wall)

**Status:** Track A done (2026-07-25) — Copilot generated all 11, plus extra variation-set alternates not
called for by this package. Claude post-processed the 11 base images: converted PNG → JPEG (quality 85,
same 1254px resolution — format was the actual size problem, not resolution; see `DECISIONS.md`) and
moved them to the correct `public/assets/animals/<id>.jpg` path (they'd landed in
`public/assets/tutorial-park/` alongside the unrelated Package 01 hero image). Cut 120MB of generated
files down to ~2.9MB. The 40 unused variant files were deleted — they were only ever meant for picking a
favorite, not for shipping. **File extension below is `.jpg`, not `.png`** — the prose still says `.png`
in a few places since that was the original ask; treat `.jpg` as authoritative.
Track B (code) is implemented by Claude directly, not routed through Copilot 365 Chat — see "Handing
this to Copilot 365" below.
**Track A:** art brief (image generation, 11 animal portraits). **Track B:** code spec (React/CSS).
**Scope:** replace the plain emoji currently used for every animal with real portrait art, in the
Wildlife Journal, the Camera Panel (Tutorial Park photography), the Photo Wall summary (Camper), and the
Forest screen's photo buttons. No gameplay, save-schema, or state logic changes — purely how existing
animals are displayed.

---

## 0. Context Copilot needs (read this whole section — it replaces browsing the repo)

**Stack:** React + TypeScript + Vite, same conventions as Package 01 (see
`docs/copilot-packages/01-biome-backgrounds.md` if you want the fuller primer — not required to complete
this package).

**Canon (never violate, from `AI.md`)** — same as Package 01: calm observation only, no combat, never
catch/collect/harm animals, Lost Puppy is helped and reunited (never collected), Mountains/Lake/Safari/
Rainforest/Alien Planet stay preview-only.

**Scope boundary** — this package only changes *how already-shipped animals are displayed*. It does not
add new animals, species, or locations.

**Art direction** — full detail in `docs/VISUAL_DIRECTION.md` and the confirmation images now in
`docs/design-reference/`. Summary: bright, colourful, storybook-realistic wildlife adventure art, cute
but believable and recognisable animals (not flat vector cartoon, not photographic), warm natural
lighting, calm exploration mood. Animals must not talk or wear clothing, must behave naturally.

**The animal roster** (from `src/data/animals.ts` — this is the complete, final list; do not invent
others): `duck`, `frog`, `butterfly`, `rabbit`, `lizard`, `park-bird`, `rare-owl`, `forest-wren`,
`forest-wallaby`, `forest-beetle`, `lost-puppy`. Each `id` below is also the exact filename to use.

**Where emoji are used today** (all four are being replaced by portraits in this package):
- `src/components/Journal.tsx` — each Journal entry shows `animal.emoji` in a `.animal-emoji` div, but
  **only once the animal is discovered** (photographed, or helped for Lost Puppy, or spotted for Rare
  Owl). Undiscovered entries show a lock or blank square instead — **portraits must preserve this
  "not spoiled before discovery" behaviour**, not show the animal's picture early.
- `src/components/CameraPanel.tsx` — Tutorial Park's photo buttons, `<span>{animal.emoji}</span>` inside
  a `.photo-target` button. No spoiler concern here — the animal is already visibly "here" in the game
  world before you photograph it.
- `src/components/PhotoWallSummary.tsx` — the Camper's Photo Wall chips, `{animal.emoji} {animal.name}`,
  only rendered for **already-photographed** animals, so no spoiler concern.
- `src/components/ForestScreen.tsx` — the Fern Trail's own photo buttons (same visual pattern as
  CameraPanel but a separate inline implementation, not the same component). No spoiler concern.

---

## Track A — Art brief (image generation, 11 images)

Generate 11 square portrait images, **1024×1024 PNG**, no text/logos/watermarks, no border or frame
baked into the image (a circular crop is applied in CSS).

**Master style prompt — use this exact wording as the shared preamble for every animal below, then add
the one-line subject description for that animal:**

> Bright, colourful, storybook-realistic wildlife adventure art — same style as the Wildlife Explorer
> reference art (attach `wild-camper-direction.png` and `docs/VISUAL_DIRECTION.md`): warm digital
> painting, cute but believable and recognisable animals, fine painterly texture, warm natural lighting
> (not flat vector cartoon, not photographic). Square close-up portrait composition: the animal is the
> clear, centered subject filling most of the frame in a natural, characteristic pose; a softly blurred,
> out-of-focus hint of its natural habitat forms the background — like a nature-photography close-up, not
> a flat/empty background and not a studio cutout. No people, no text, no cages, no distress. The animal
> must be unclothed, not talking, not posed unnaturally.
>
> Subject: **[insert per-animal line from the table below]**

| Animal id | Filename | Subject line to append to the master prompt |
|---|---|---|
| `duck` | `duck.png` | A mallard duck, calm and alert, preening at the edge of a pond; blurred pond water and lily pads behind it. |
| `frog` | `frog.png` | A small green frog resting on a lily pad, calm and alert; blurred pond water behind it. |
| `butterfly` | `butterfly.png` | A colourful butterfly resting on a wildflower with wings open; blurred meadow grass and flowers behind it. |
| `rabbit` | `rabbit.png` | A brown rabbit sitting alert in short meadow grass; blurred wildflowers behind it. |
| `lizard` | `lizard.png` | A small lizard basking on a sunlit rock or log; blurred forest-trail undergrowth behind it. |
| `park-bird` | `park-bird.png` | A small songbird perched on a low twig, mid-song; blurred forest-trail leaves behind it. |
| `rare-owl` | `rare-owl.png` | An owl perched quietly in soft evening light, calm and watchful — a real owl, not a magical creature; blurred tree branches behind it. |
| `forest-wren` | `forest-wren.png` | A small brown-and-white wren perched on a low branch, mid-call; blurred temperate-forest ferns behind it. |
| `forest-wallaby` | `forest-wallaby.png` | A wallaby resting quietly at a forest edge, alert and calm; blurred ferns and moss behind it. |
| `forest-beetle` | `forest-beetle.png` | A small iridescent beetle on a green leaf, close-up; blurred forest floor behind it. |
| `lost-puppy` | `lost-puppy.png` | A golden retriever puppy sitting calmly with a happy, reunited expression — the same golden retriever companion already shown in the shipped Camper/Park/Forest hero images; blurred grass behind it. |

Save each result as `public/assets/animals/<filename>` (new folder).

If Copilot's tool can't hit exactly 1024×1024, any square (1:1) result is fine — the CSS crops to a
circle with `object-fit: cover`.

**Quick-reference trigger list** — once the master prompt and the table above are in view (pasted earlier
in the same Copilot chat, or the chat has this file attached), these one-liners are enough to trigger each
image in turn:

```
Make the art duck
Make the art frog
Make the art butterfly
Make the art rabbit
Make the art lizard
Make the art park-bird
Make the art rare-owl
Make the art forest-wren
Make the art forest-wallaby
Make the art forest-beetle
Make the art lost-puppy
```
These are shorthand, not standalone prompts — "duck" alone doesn't carry the style or pose. If starting a
fresh chat, paste the master prompt + table once first.

**Variation sets (for randomising / picking a favorite)** — same shorthand, each set adds one consistent
modifier so the 4 sets produce visibly different results per animal instead of Copilot repeating the same
output. You don't need to run every set for every animal — use them to get a second opinion when the
first result isn't quite right, and pick whichever you like best.

*Variant A — soft morning light, calm resting pose*
```
Make the art duck — soft morning light, calm resting pose
Make the art frog — soft morning light, calm resting pose
Make the art butterfly — soft morning light, calm resting pose
Make the art rabbit — soft morning light, calm resting pose
Make the art lizard — soft morning light, calm resting pose
Make the art park-bird — soft morning light, calm resting pose
Make the art rare-owl — soft morning light, calm resting pose
Make the art forest-wren — soft morning light, calm resting pose
Make the art forest-wallaby — soft morning light, calm resting pose
Make the art forest-beetle — soft morning light, calm resting pose
Make the art lost-puppy — soft morning light, calm resting pose
```

*Variant B — warm golden-hour light, alert active pose*
```
Make the art duck — warm golden-hour light, alert active pose
Make the art frog — warm golden-hour light, alert active pose
Make the art butterfly — warm golden-hour light, alert active pose
Make the art rabbit — warm golden-hour light, alert active pose
Make the art lizard — warm golden-hour light, alert active pose
Make the art park-bird — warm golden-hour light, alert active pose
Make the art rare-owl — warm golden-hour light, alert active pose
Make the art forest-wren — warm golden-hour light, alert active pose
Make the art forest-wallaby — warm golden-hour light, alert active pose
Make the art forest-beetle — warm golden-hour light, alert active pose
Make the art lost-puppy — warm golden-hour light, alert active pose
```

*Variant C — soft overcast light, closer crop with more habitat detail*
```
Make the art duck — soft overcast light, closer crop with more habitat detail visible
Make the art frog — soft overcast light, closer crop with more habitat detail visible
Make the art butterfly — soft overcast light, closer crop with more habitat detail visible
Make the art rabbit — soft overcast light, closer crop with more habitat detail visible
Make the art lizard — soft overcast light, closer crop with more habitat detail visible
Make the art park-bird — soft overcast light, closer crop with more habitat detail visible
Make the art rare-owl — soft overcast light, closer crop with more habitat detail visible
Make the art forest-wren — soft overcast light, closer crop with more habitat detail visible
Make the art forest-wallaby — soft overcast light, closer crop with more habitat detail visible
Make the art forest-beetle — soft overcast light, closer crop with more habitat detail visible
Make the art lost-puppy — soft overcast light, closer crop with more habitat detail visible
```

*Variant D — dappled shade lighting, three-quarter angle view*
```
Make the art duck — dappled shade lighting, three-quarter angle view
Make the art frog — dappled shade lighting, three-quarter angle view
Make the art butterfly — dappled shade lighting, three-quarter angle view
Make the art rabbit — dappled shade lighting, three-quarter angle view
Make the art lizard — dappled shade lighting, three-quarter angle view
Make the art park-bird — dappled shade lighting, three-quarter angle view
Make the art rare-owl — dappled shade lighting, three-quarter angle view
Make the art forest-wren — dappled shade lighting, three-quarter angle view
Make the art forest-wallaby — dappled shade lighting, three-quarter angle view
Make the art forest-beetle — dappled shade lighting, three-quarter angle view
Make the art lost-puppy — dappled shade lighting, three-quarter angle view
```

---

## Track B — Code spec

**Files needed:** `src/types/Ids.ts` (read-only, confirms the id list), `src/components/Journal.tsx`,
`src/components/CameraPanel.tsx`, `src/components/PhotoWallSummary.tsx`, `src/components/ForestScreen.tsx`,
`src/styles.css`. One new file to create: `src/data/animalPortraits.ts`.

### B1. New helper — `src/data/animalPortraits.ts`

```ts
import type { AnimalId } from '../types/Ids';

const PORTRAIT_ANIMAL_IDS: AnimalId[] = [
  'duck', 'frog', 'butterfly', 'rabbit', 'lizard', 'park-bird',
  'rare-owl', 'forest-wren', 'forest-wallaby', 'forest-beetle', 'lost-puppy',
];

export function getAnimalPortraitUrl(id: AnimalId): string | null {
  return PORTRAIT_ANIMAL_IDS.includes(id) ? `/assets/animals/${id}.jpg` : null;
}
```
This is deliberately a lookup, not "always build the path" — if a future animal is added without art
yet, it falls back to its emoji automatically instead of showing a broken image.

### B2. CSS — add to `src/styles.css`

```css
.animal-portrait{width:2.75rem;height:2.75rem;border-radius:50%;object-fit:cover;display:block;flex-shrink:0}
.animal-portrait.small{width:1.8rem;height:1.8rem}
.animal-portrait.tiny{width:1.3rem;height:1.3rem;vertical-align:middle;margin-right:.15rem}
```

### B3. `Journal.tsx`

Import `getAnimalPortraitUrl`. In `JournalEntry`, only compute/use the portrait when `discovered` is
true (preserves the no-spoiler behaviour) — replace the emoji text with the image when available, keep
the existing lock/blank-square/emoji fallback otherwise:

```tsx
const portraitUrl = discovered ? getAnimalPortraitUrl(animal.id) : null;
// ...
<div className="animal-emoji" aria-hidden="true">
  {portraitUrl ? <img className="animal-portrait" src={portraitUrl} alt=""/> : discovered ? animal.emoji : locked ? '🔒' : '⬜'}
</div>
```

### B4. `CameraPanel.tsx`

Replace `<span>{animal.emoji}</span>` with:
```tsx
<span>{getAnimalPortraitUrl(animal.id) ? <img className="animal-portrait small" src={getAnimalPortraitUrl(animal.id)!} alt=""/> : animal.emoji}</span>
```

### B5. `PhotoWallSummary.tsx`

Replace `{animal.emoji} {animal.name}` inside the chip with:
```tsx
{getAnimalPortraitUrl(animal.id) ? <img className="animal-portrait tiny" src={getAnimalPortraitUrl(animal.id)!} alt=""/> : animal.emoji} {animal.name}
```

### B6. `ForestScreen.tsx`

Same treatment as B4, applied to that file's own inline `photo-target` buttons (`<span>{a.emoji}</span>`
→ same portrait-or-emoji pattern), keeping the file's existing dense single-line style.

**Why alt="" everywhere:** in every one of these four spots the animal's name is already shown as visible
text right next to the image (or the container is already `aria-hidden` in Journal's case), so the
portrait is decorative — an empty `alt` avoids a screen reader announcing the name twice.

---

## Handing this to Copilot 365

1. **Track A** — open Copilot 365's image generation, attach `wild-camper-direction.png` and
   `docs/VISUAL_DIRECTION.md`, then run the master prompt once per animal (11 times), swapping in each
   row's subject line. Save each result with the exact filename from the table.
2. **Track B** — Copilot 365 is not used for this. Send the 11 images straight back to Claude, which
   implements Track B directly (one new file, one CSS addition, four small edits).

---

## Done when

- All 11 files exist at `public/assets/animals/<id>.jpg`, square, matching the established style.
- `src/data/animalPortraits.ts` exists and is used by all four display spots (Journal, Camera Panel,
  Photo Wall, Forest screen buttons).
- Journal entries still hide the portrait for undiscovered animals (locked/blank-square behaviour
  unchanged) — only discovered animals show art.
- Canon and Scope boundary from `AI.md` are respected (no new animals invented, no distress/combat
  imagery).
- `npm run check` passes (typecheck + tests + build + encoding audit).
