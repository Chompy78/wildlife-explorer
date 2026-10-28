# Package 16 — Volcanic Highlands biome animal art

**Status:** ready to hand to Copilot 365 for Track A. Track B (wiring) is already specced as the
"Volcanic Highlands art and photo wiring" task on `docs/TASK_BOARD_NOW.md`.
**Track A:** art brief (image generation, 6 animals × 5 photos each = 30 images). **Track B:** code, done by
Claude once the images arrive.
**Scope:** collectible photo art for the 6 Volcanic Highlands animals, in the same 5-photo-variant shape as the
Park, Forest and Lake animals. The Volcanic Highlands is already playable (`D-2026-10-28-remaining-biomes`);
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
- **Hot Springs:** `japanese-macaque`, `mandarin-duck`
- **Steam Vents:** `lava-lizard`, `nene`
- **Lava Fields:** `marine-iguana`, `galapagos-tortoise`

**Why 5 photos per animal** — every animal has 5 randomly-collectible photo variants, and photo N unlocks fact
N (`D-2026-07-25-photo-collection-mechanic`). So the 5 photos per animal must look clearly different from each
other.

**Filenames matter.** Use the exact animal id as the file prefix (`japanese-macaque-1.png` … `galapagos-tortoise-5.png`). The ids above are final.

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
> filling most of the frame in a natural, characteristic pose; a softly blurred, out-of-focus hint of a calm volcanic highland of dark rock, steam and mossy ground forms the background — like a nature-photography close-up, not a flat/empty background and not a studio
> cutout. No people, no text, no cages, no distress. The animal must be unclothed, not talking, not posed
> unnaturally.
>
> Subject: **[insert per-animal line from the table below]**

| Animal id | Filename (base shot) | Subject line to append to the master prompt |
|---|---|---|
| `japanese-macaque` | `japanese-macaque-1.png` | A Japanese macaque sitting in a warm hot spring, calm; blurred steam and rocks behind it. |
| `mandarin-duck` | `mandarin-duck-1.png` | A male mandarin duck swimming on calm water, calm; blurred steam and rocks behind it. |
| `lava-lizard` | `lava-lizard-1.png` | A lava lizard on dark volcanic rock, calm; blurred steaming hills behind it. |
| `nene` | `nene-1.png` | A nene goose standing on mossy volcanic ground, calm; blurred steaming hills behind it. |
| `marine-iguana` | `marine-iguana-1.png` | A marine iguana basking on dark lava rock, calm; blurred sea behind it. |
| `galapagos-tortoise` | `galapagos-tortoise-1.png` | A Galapagos tortoise walking on volcanic ground, calm; blurred lava hills behind it. |

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
Make the art japanese macaque
Make the art japanese macaque — soft morning light, calm resting pose
Make the art japanese macaque — warm golden-hour light, alert active pose
Make the art japanese macaque — soft overcast light, closer crop with more habitat detail visible
Make the art japanese macaque — dappled shade lighting, three-quarter angle view

Make the art mandarin duck
Make the art mandarin duck — soft morning light, calm resting pose
Make the art mandarin duck — warm golden-hour light, alert active pose
Make the art mandarin duck — soft overcast light, closer crop with more habitat detail visible
Make the art mandarin duck — dappled shade lighting, three-quarter angle view

Make the art lava lizard
Make the art lava lizard — soft morning light, calm resting pose
Make the art lava lizard — warm golden-hour light, alert active pose
Make the art lava lizard — soft overcast light, closer crop with more habitat detail visible
Make the art lava lizard — dappled shade lighting, three-quarter angle view

Make the art nene
Make the art nene — soft morning light, calm resting pose
Make the art nene — warm golden-hour light, alert active pose
Make the art nene — soft overcast light, closer crop with more habitat detail visible
Make the art nene — dappled shade lighting, three-quarter angle view

Make the art marine iguana
Make the art marine iguana — soft morning light, calm resting pose
Make the art marine iguana — warm golden-hour light, alert active pose
Make the art marine iguana — soft overcast light, closer crop with more habitat detail visible
Make the art marine iguana — dappled shade lighting, three-quarter angle view

Make the art galapagos tortoise
Make the art galapagos tortoise — soft morning light, calm resting pose
Make the art galapagos tortoise — warm golden-hour light, alert active pose
Make the art galapagos tortoise — soft overcast light, closer crop with more habitat detail visible
Make the art galapagos tortoise — dappled shade lighting, three-quarter angle view
```

These are shorthand, not standalone prompts — the master prompt + subject line carry the instructions. In a
fresh Copilot chat, paste the master prompt + table once first.

---

## Track B — Code spec

Already a task: see "Volcanic Highlands art and photo wiring" in `docs/TASK_BOARD_NOW.md`. Short version: copy the 30 JPEGs
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
