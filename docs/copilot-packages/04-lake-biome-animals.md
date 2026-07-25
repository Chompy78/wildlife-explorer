# Package 04 — Lake biome animal art (pre-milestone art prep)

**Status:** ready to hand to Copilot 365 for Track A. Pure art prep — Lake has no gameplay built yet, so
there is no Track B to implement until a future milestone builds the Lake destination for real.
**Track A:** art brief (image generation, 6 animals × 5 photos each = 30 images). **Track B:** none yet.
**Scope:** generates collectible photo art for 6 Lake animals ahead of time, in the same 5-photo-variant
shape as the shipped Park/Forest animals. No gameplay, save-schema, or state logic changes — Lake stays a
`status: 'preview'` `DestinationPreview` (`src/data/destinations.ts`), non-playable, until a later
milestone explicitly builds it out.

---

## 0. Context Copilot needs (read this whole section — it replaces browsing the repo)

**Stack:** React + TypeScript + Vite, same conventions as every prior package.

**Canon (never violate, from `AI.md`)** — calm observation only, no combat, never catch/collect/harm
animals, Mountains/Lake/Safari/Rainforest/Alien Planet stay preview-only.

**Scope boundary** — Lake is not becoming playable from this package. Do not build a Lake locations/data
model, do not add Lake to any navigation — this is art generation only, banked for later.

**Art direction** — full detail in `docs/VISUAL_DIRECTION.md` and the confirmation images in
`docs/design-reference/`. Summary: bright, colourful, storybook-realistic wildlife adventure art, cute
but believable and recognisable animals (not flat vector cartoon, not photographic), warm natural
lighting, calm exploration mood. Animals must not talk or wear clothing, must behave naturally.

**The animal roster** — 6 animals, grouped into 3 proposed sections (not real game locations yet, just a
way to organize the art — 2 animals per section):
- **Shoreline:** `heron`, `beaver`
- **Open Water:** `rainbow-trout`, `loon`
- **Reeds & Shallows:** `dragonfly`, `painted-turtle`

**Why 5 photos per animal, not 1** — the shipped Park/Forest mechanic (`DECISIONS.md`'s
`D-2026-07-25-photo-collection-mechanic`) gives every animal 5 randomly-collectible photo variants, not
one static portrait. This package generates the same shape for Lake so it's ready to plug in later
without a second art pass.

---

## Track A — Art brief (image generation, 6 animals × 5 photos = 30 images)

Generate 30 square images, **1024×1024** (or any square 1:1 ratio — Claude resizes/converts on the way
in, same as every prior batch), no text/logos/watermarks, no border or frame baked into the image.

**Master style prompt — use this exact wording as the shared preamble for every animal below, then add
the one-line subject description for that animal:**

> Bright, colourful, storybook-realistic wildlife adventure art — same style as the Wildlife Explorer
> reference art (attach `wild-camper-direction.png` and `docs/VISUAL_DIRECTION.md`): warm digital
> painting, cute but believable and recognisable animals, fine painterly texture, warm natural lighting
> (not flat vector cartoon, not photographic). Square close-up portrait composition: the animal is the
> clear, centered subject filling most of the frame in a natural, characteristic pose; a softly blurred,
> out-of-focus hint of a calm lake habitat forms the background — reeds, still water, morning mist, or a
> wooded shoreline depending on the animal — like a nature-photography close-up, not a flat/empty
> background and not a studio cutout. No people, no text, no cages, no distress. The animal must be
> unclothed, not talking, not posed unnaturally.
>
> Subject: **[insert per-animal line from the table below]**

| Animal id | Filename (base shot) | Subject line to append to the master prompt |
|---|---|---|
| `heron` | `heron-1.png` | A great blue heron standing still in shallow water, calm and watchful; blurred reeds and morning mist behind it. |
| `beaver` | `beaver-1.png` | A beaver resting on a low bank at the water's edge, calm and alert; blurred still lake water behind it. |
| `rainbow-trout` | `rainbow-trout-1.png` | A rainbow trout just beneath the water's surface, calm and glinting with colour; blurred sunlit ripples behind it. |
| `loon` | `loon-1.png` | A loon floating calmly on open water, alert and watchful; blurred still lake surface and distant shoreline behind it. |
| `dragonfly` | `dragonfly-1.png` | A dragonfly resting on a reed with wings open, close-up, calm; blurred reeds and water behind it. |
| `painted-turtle` | `painted-turtle-1.png` | A painted turtle basking calmly on a partly-submerged log; blurred lake water and lily pads behind it. |

That's the **base shot** (1 of 5) per animal. Generate 4 more per animal using the same subject line plus
one of these variation modifiers each, so every animal ends up with 5 distinct photos to collect:

| Variant | Modifier to append |
|---|---|
| 2 | soft morning light, calm resting pose |
| 3 | warm golden-hour light, alert active pose |
| 4 | soft overcast light, closer crop with more habitat detail visible |
| 5 | dappled shade lighting, three-quarter angle view |

Save each result as `<animal-id>-<variant-number>.png` (e.g. `heron-1.png` through `heron-5.png`) — exact
filenames aren't critical, Claude renames/converts everything on the way in regardless, same as every
prior batch.

**Quick-reference trigger list** (once the master prompt and tables above are in view):

```
Make the art heron
Make the art heron — soft morning light, calm resting pose
Make the art heron — warm golden-hour light, alert active pose
Make the art heron — soft overcast light, closer crop with more habitat detail visible
Make the art heron — dappled shade lighting, three-quarter angle view

Make the art beaver
Make the art beaver — soft morning light, calm resting pose
Make the art beaver — warm golden-hour light, alert active pose
Make the art beaver — soft overcast light, closer crop with more habitat detail visible
Make the art beaver — dappled shade lighting, three-quarter angle view

Make the art rainbow trout
Make the art rainbow trout — soft morning light, calm resting pose
Make the art rainbow trout — warm golden-hour light, alert active pose
Make the art rainbow trout — soft overcast light, closer crop with more habitat detail visible
Make the art rainbow trout — dappled shade lighting, three-quarter angle view

Make the art loon
Make the art loon — soft morning light, calm resting pose
Make the art loon — warm golden-hour light, alert active pose
Make the art loon — soft overcast light, closer crop with more habitat detail visible
Make the art loon — dappled shade lighting, three-quarter angle view

Make the art dragonfly
Make the art dragonfly — soft morning light, calm resting pose
Make the art dragonfly — warm golden-hour light, alert active pose
Make the art dragonfly — soft overcast light, closer crop with more habitat detail visible
Make the art dragonfly — dappled shade lighting, three-quarter angle view

Make the art painted turtle
Make the art painted turtle — soft morning light, calm resting pose
Make the art painted turtle — warm golden-hour light, alert active pose
Make the art painted turtle — soft overcast light, closer crop with more habitat detail visible
Make the art painted turtle — dappled shade lighting, three-quarter angle view
```

These are shorthand, not standalone prompts — the master prompt + subject line carry the actual
instructions. If starting a fresh Copilot chat, paste the master prompt + table once first.

---

## Track B — Code spec

None yet. Lake has no locations, no data model, and isn't navigable from anywhere in the app — there is
nothing to wire this art into until a future milestone explicitly builds Lake out (`AI.md`'s Scope
boundary). When that happens, the code shape to follow is whatever `src/data/animalPhotoVariants.ts`,
`PhotoReveal.tsx`, and the Journal/Camera-equivalent display logic look like at that time — see
`DECISIONS.md`'s `D-2026-07-25-photo-collection-mechanic` for the pattern already proven on Park/Forest.

---

## Handing this to Copilot 365

1. Open a **new** Copilot 365 image-generation chat (recommended over reusing the Park-animals session —
   keeps this batch from getting mixed up with unrelated context).
2. Attach `wild-camper-direction.png` and `docs/VISUAL_DIRECTION.md`.
3. Run the 30 trigger lines above (6 animals × 5 shots each).
4. Send everything back to Claude — no need to sort or rename, that's handled on the way in.

---

## Done when

- 6 animals × 5 photos = 30 images generated and handed to Claude to convert/rename/move.
- No code changes expected from this package alone (see Track B note above) — art sits ready until a
  future milestone builds the Lake destination for real.
