# Package 12 — Wetlands biome animal art

**Status:** ready to hand to Copilot 365 for Track A. Track B (wiring) is already specced as the
"Wetlands art and photo wiring" task on `docs/TASK_BOARD_NOW.md`.
**Track A:** art brief (image generation, 6 animals × 5 photos each = 30 images). **Track B:** code, done by
Claude once the images arrive.
**Scope:** collectible photo art for the 6 Wetlands animals, in the same 5-photo-variant shape as the
Park, Forest and Lake animals. The Wetlands is already playable (`D-2026-10-28-remaining-biomes`);
until this art lands the animals show emoji and award no photos.

---

## 0. Context Copilot needs (read this whole section — it replaces browsing the repo)

**Stack:** React + TypeScript + Vite, same conventions as every prior package.

**Canon (never violate, from `AI.md`)** — calm observation only, no combat, never catch/collect/harm animals.

**Art direction** — full detail in `docs/VISUAL_DIRECTION.md` and `docs/design-reference/`. Summary: bright,
colourful, storybook-realistic wildlife adventure art, cute but believable and recognisable animals (not flat
vector cartoon, not photographic), warm natural lighting, calm exploration mood. Animals must not talk or wear
clothing, and must behave naturally.

**The animal roster** — 6 animals in 3 game sections, 2 per section:
- **Mangroves:** `mudskipper`, `roseate-spoonbill`
- **Still Marsh:** `river-otter`, `great-egret`
- **Mudflats:** `fiddler-crab`, `american-flamingo`

**Why 5 photos per animal** — every animal has 5 randomly-collectible photo variants, and photo N unlocks fact
N (`D-2026-07-25-photo-collection-mechanic`). So the 5 photos per animal must look clearly different from each
other.

**Filenames matter.** Use the exact animal id as the file prefix (`mudskipper-1.png` … `american-flamingo-5.png`). The ids above are final.

---

## Track A — Art brief (image generation, 6 animals × 5 photos = 30 images)

Generate 30 square images, **1024×1024** (any 1:1 ratio is fine — Claude resizes/converts), no
text/logos/watermarks, no border or frame baked in.

**Master style prompt — use this exact wording as the shared preamble for every animal, then add that animal's
subject line:**

> Bright, colourful, storybook-realistic wildlife adventure art — same style as the Wildlife Explorer
> reference art (attach `wild-camper-direction.png` and `docs/VISUAL_DIRECTION.md`): warm digital painting,
> cute but believable and recognisable animals, fine painterly texture, warm natural lighting (not flat vector
> cartoon, not photographic). Square close-up portrait composition: the animal is the clear, centered subject
> filling most of the frame in a natural, characteristic pose; a softly blurred, out-of-focus hint of a calm marsh of reeds, mangrove roots and still water forms the background — like a nature-photography close-up, not a flat/empty background and not a studio
> cutout. No people, no text, no cages, no distress. The animal must be unclothed, not talking, not posed
> unnaturally.
>
> Subject: **[insert per-animal line from the table below]**

| Animal id | Filename (base shot) | Subject line to append to the master prompt |
|---|---|---|
| `mudskipper` | `mudskipper-1.png` | A mudskipper sitting on a mangrove root above the mud, calm; blurred mangrove roots behind it. |
| `roseate-spoonbill` | `roseate-spoonbill-1.png` | A roseate spoonbill wading in shallow water, calm; blurred mangroves behind it. |
| `river-otter` | `river-otter-1.png` | A river otter floating at the edge of a marsh, calm; blurred reeds behind it. |
| `great-egret` | `great-egret-1.png` | A great egret standing still in shallow water, calm; blurred reeds behind it. |
| `fiddler-crab` | `fiddler-crab-1.png` | A fiddler crab on soft mud with one large claw raised, calm; blurred mudflat behind it. |
| `american-flamingo` | `american-flamingo-1.png` | An American flamingo standing on one leg in shallow water, calm; blurred mudflat behind it. |

That is the **base shot** (1 of 5). Generate 4 more per animal using the same subject line plus one modifier each:

| Variant | Modifier to append |
|---|---|
| 2 | soft morning light, calm resting pose |
| 3 | warm golden-hour light, alert active pose |
| 4 | soft overcast light, closer crop with more habitat detail visible |
| 5 | dappled shade lighting, three-quarter angle view |

**Watch for sameness.** If any animal's 5 shots look alike, vary the camera angle, distance, and pose instead of the light.

**Quick-reference trigger list** (once the master prompt and tables are in view):

```
Make the art mudskipper
Make the art mudskipper — soft morning light, calm resting pose
Make the art mudskipper — warm golden-hour light, alert active pose
Make the art mudskipper — soft overcast light, closer crop with more habitat detail visible
Make the art mudskipper — dappled shade lighting, three-quarter angle view

Make the art roseate spoonbill
Make the art roseate spoonbill — soft morning light, calm resting pose
Make the art roseate spoonbill — warm golden-hour light, alert active pose
Make the art roseate spoonbill — soft overcast light, closer crop with more habitat detail visible
Make the art roseate spoonbill — dappled shade lighting, three-quarter angle view

Make the art river otter
Make the art river otter — soft morning light, calm resting pose
Make the art river otter — warm golden-hour light, alert active pose
Make the art river otter — soft overcast light, closer crop with more habitat detail visible
Make the art river otter — dappled shade lighting, three-quarter angle view

Make the art great egret
Make the art great egret — soft morning light, calm resting pose
Make the art great egret — warm golden-hour light, alert active pose
Make the art great egret — soft overcast light, closer crop with more habitat detail visible
Make the art great egret — dappled shade lighting, three-quarter angle view

Make the art fiddler crab
Make the art fiddler crab — soft morning light, calm resting pose
Make the art fiddler crab — warm golden-hour light, alert active pose
Make the art fiddler crab — soft overcast light, closer crop with more habitat detail visible
Make the art fiddler crab — dappled shade lighting, three-quarter angle view

Make the art american flamingo
Make the art american flamingo — soft morning light, calm resting pose
Make the art american flamingo — warm golden-hour light, alert active pose
Make the art american flamingo — soft overcast light, closer crop with more habitat detail visible
Make the art american flamingo — dappled shade lighting, three-quarter angle view
```

These are shorthand, not standalone prompts — the master prompt + subject line carry the instructions. In a
fresh Copilot chat, paste the master prompt + table once first.

---

## Track B — Code spec

Already a task: see "Wetlands art and photo wiring" in `docs/TASK_BOARD_NOW.md`. Short version: copy the 30 JPEGs
into `public/assets/animals/`, add the 6 ids at count 5 to `PHOTO_VARIANT_COUNTS`
(`src/data/animalPhotoVariants.ts`), add 5 facts each to `ANIMAL_FACTS` (`src/data/animalFacts.ts` — not
`BONUS_FACTS`). No test change is needed: the table-driven `src/state/biomeState.test.ts` already handles animals with and without photos.

---

## Handing this to Copilot 365

1. Open a **new** Copilot 365 image-generation chat.
2. Attach `wild-camper-direction.png` and `docs/VISUAL_DIRECTION.md`.
3. Run the 30 trigger lines above (6 animals × 5 shots).
4. Send everything back to Claude — no sorting needed.

---

## Done when

- 30 images generated and handed to Claude to convert, rename and wire in (Track B).
