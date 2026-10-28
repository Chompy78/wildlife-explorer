# Package 11 — Coral Reef biome animal art

**Status:** ready to hand to Copilot 365 for Track A. Track B (wiring) is already specced as the
"Coral Reef art and photo wiring" task on `docs/TASK_BOARD_NOW.md`.
**Track A:** art brief (image generation, 6 animals × 5 photos each = 30 images). **Track B:** code, done by
Claude once the images arrive.
**Scope:** collectible photo art for the 6 Coral Reef animals, in the same 5-photo-variant shape as the
Park, Forest and Lake animals. The Coral Reef is already playable (`D-2026-10-28-remaining-biomes`);
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
- **Shallow Reef:** `clownfish`, `blue-tang`
- **Coral Garden:** `green-sea-turtle`, `seahorse`
- **Deep Blue:** `manta-ray`, `whale-shark`

**Why 5 photos per animal** — every animal has 5 randomly-collectible photo variants, and photo N unlocks fact
N (`D-2026-07-25-photo-collection-mechanic`). So the 5 photos per animal must look clearly different from each
other.

**Filenames matter.** Use the exact animal id as the file prefix (`clownfish-1.png` … `whale-shark-5.png`). The ids above are final.

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
> filling most of the frame in a natural, characteristic pose; a softly blurred, out-of-focus hint of a 
> a calm, clear blue underwater reef of coral and sunlit water forms the background — like a nature-photography close-up, not a flat/empty background and not a studio
> cutout. No people, no text, no cages, no distress. The animal must be unclothed, not talking, not posed
> unnaturally.
>
> Subject: **[insert per-animal line from the table below]**

| Animal id | Filename (base shot) | Subject line to append to the master prompt |
|---|---|---|
| `clownfish` | `clownfish-1.png` | A clownfish peeking out of a sea anemone, calm; blurred colourful coral behind it. |
| `blue-tang` | `blue-tang-1.png` | A blue tang swimming near coral, calm; blurred reef behind it. |
| `green-sea-turtle` | `green-sea-turtle-1.png` | A green sea turtle gliding above seagrass, calm; blurred coral and blue water behind it. |
| `seahorse` | `seahorse-1.png` | A seahorse holding onto seagrass with its tail, calm; blurred reef behind it. |
| `manta-ray` | `manta-ray-1.png` | A manta ray gliding through open blue water, calm; blurred sunlit water behind it. |
| `whale-shark` | `whale-shark-1.png` | A whale shark gliding slowly through blue water, calm; blurred sunlit water behind it. |

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
Make the art clownfish
Make the art clownfish — soft morning light, calm resting pose
Make the art clownfish — warm golden-hour light, alert active pose
Make the art clownfish — soft overcast light, closer crop with more habitat detail visible
Make the art clownfish — dappled shade lighting, three-quarter angle view

Make the art blue tang
Make the art blue tang — soft morning light, calm resting pose
Make the art blue tang — warm golden-hour light, alert active pose
Make the art blue tang — soft overcast light, closer crop with more habitat detail visible
Make the art blue tang — dappled shade lighting, three-quarter angle view

Make the art green sea turtle
Make the art green sea turtle — soft morning light, calm resting pose
Make the art green sea turtle — warm golden-hour light, alert active pose
Make the art green sea turtle — soft overcast light, closer crop with more habitat detail visible
Make the art green sea turtle — dappled shade lighting, three-quarter angle view

Make the art seahorse
Make the art seahorse — soft morning light, calm resting pose
Make the art seahorse — warm golden-hour light, alert active pose
Make the art seahorse — soft overcast light, closer crop with more habitat detail visible
Make the art seahorse — dappled shade lighting, three-quarter angle view

Make the art manta ray
Make the art manta ray — soft morning light, calm resting pose
Make the art manta ray — warm golden-hour light, alert active pose
Make the art manta ray — soft overcast light, closer crop with more habitat detail visible
Make the art manta ray — dappled shade lighting, three-quarter angle view

Make the art whale shark
Make the art whale shark — soft morning light, calm resting pose
Make the art whale shark — warm golden-hour light, alert active pose
Make the art whale shark — soft overcast light, closer crop with more habitat detail visible
Make the art whale shark — dappled shade lighting, three-quarter angle view
```

These are shorthand, not standalone prompts — the master prompt + subject line carry the instructions. In a
fresh Copilot chat, paste the master prompt + table once first.

---

## Track B — Code spec

Already a task: see "Coral Reef art and photo wiring" in `docs/TASK_BOARD_NOW.md`. Short version: copy the 30 JPEGs
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
