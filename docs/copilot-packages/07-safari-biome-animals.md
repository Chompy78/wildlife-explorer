# Package 07 — Safari biome animal art

**Status:** ready to hand to Copilot 365 for Track A. Track B (wiring) is already specced as the
"Safari art and photo wiring" task on `docs/TASK_BOARD_NOW.md`.
**Track A:** art brief (image generation, 6 animals × 5 photos each = 30 images). **Track B:** code, done by
Claude once the images arrive.
**Scope:** collectible photo art for the 6 Safari animals, in the same 5-photo-variant shape as the
Park, Forest and Lake animals. The Safari is already playable (`D-2026-10-28-safari-biome-go-ahead`);
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
- **Waterhole:** `african-elephant`, `hippo`
- **Open Plains:** `zebra`, `giraffe`
- **Acacia Grove:** `meerkat`, `lilac-breasted-roller`

**Why 5 photos per animal** — every animal has 5 randomly-collectible photo variants, and photo N unlocks fact
N (`D-2026-07-25-photo-collection-mechanic`). So the 5 photos per animal must look clearly different from each
other.

**Filenames matter this time.** Use the exact animal id as the file prefix (`african-elephant-1.png` …
`lilac-breasted-roller-5.png`). The Lake batch used `heron-*` for an animal whose id was `great-blue-heron`, which
needed a rename later; the ids above are final.

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
> filling most of the frame in a natural, characteristic pose; a softly blurred, out-of-focus hint of a calm
> sunlit African savanna habitat forms the background — golden grass, acacia trees, a waterhole, or a soft hazy horizon
> depending on the animal — like a nature-photography close-up, not a flat/empty background and not a studio
> cutout. No people, no text, no cages, no distress. The animal must be unclothed, not talking, not posed
> unnaturally.
>
> Subject: **[insert per-animal line from the table below]**

| Animal id | Filename (base shot) | Subject line to append to the master prompt |
|---|---|---|
| `african-elephant` | `african-elephant-1.png` | An African elephant standing at the edge of a waterhole, trunk raised gently, calm and gentle; blurred golden grass and soft haze behind it. |
| `hippo` | `hippo-1.png` | A hippo resting in shallow waterhole water with eyes and ears above the surface, calm; blurred reeds and warm light behind it. |
| `zebra` | `zebra-1.png` | A zebra standing on open grassland with its head raised, calm and alert; blurred golden savanna and distant herd behind it. |
| `giraffe` | `giraffe-1.png` | A giraffe reaching up to browse an acacia tree, calm and graceful; blurred savanna and soft sky behind it. |
| `meerkat` | `meerkat-1.png` | A meerkat standing upright on its hind legs keeping watch, alert and curious; blurred dry grass and sandy ground behind it. |
| `lilac-breasted-roller` | `lilac-breasted-roller-1.png` | A lilac-breasted roller perched on an acacia branch, colourful and calm; blurred savanna and warm sky behind it. |

That is the **base shot** (1 of 5). Generate 4 more per animal using the same subject line plus one modifier each:

| Variant | Modifier to append |
|---|---|
| 2 | soft morning light, calm resting pose |
| 3 | warm golden-hour light, alert active pose |
| 4 | soft overcast light, closer crop with more habitat detail visible |
| 5 | dappled shade lighting, three-quarter angle view |

**Watch for sameness.** The Lake trout batch came out with 5 near-identical images because lighting barely
shows through water. None of these animals are underwater, so the table above should work. If any animal's 5
shots still look alike, vary the camera angle, distance, and pose instead of the light.

**Quick-reference trigger list** (once the master prompt and tables are in view):

```
Make the art african elephant
Make the art african elephant — soft morning light, calm resting pose
Make the art african elephant — warm golden-hour light, alert active pose
Make the art african elephant — soft overcast light, closer crop with more habitat detail visible
Make the art african elephant — dappled shade lighting, three-quarter angle view

Make the art hippo
Make the art hippo — soft morning light, calm resting pose
Make the art hippo — warm golden-hour light, alert active pose
Make the art hippo — soft overcast light, closer crop with more habitat detail visible
Make the art hippo — dappled shade lighting, three-quarter angle view

Make the art zebra
Make the art zebra — soft morning light, calm resting pose
Make the art zebra — warm golden-hour light, alert active pose
Make the art zebra — soft overcast light, closer crop with more habitat detail visible
Make the art zebra — dappled shade lighting, three-quarter angle view

Make the art giraffe
Make the art giraffe — soft morning light, calm resting pose
Make the art giraffe — warm golden-hour light, alert active pose
Make the art giraffe — soft overcast light, closer crop with more habitat detail visible
Make the art giraffe — dappled shade lighting, three-quarter angle view

Make the art meerkat
Make the art meerkat — soft morning light, calm resting pose
Make the art meerkat — warm golden-hour light, alert active pose
Make the art meerkat — soft overcast light, closer crop with more habitat detail visible
Make the art meerkat — dappled shade lighting, three-quarter angle view

Make the art lilac-breasted roller
Make the art lilac-breasted roller — soft morning light, calm resting pose
Make the art lilac-breasted roller — warm golden-hour light, alert active pose
Make the art lilac-breasted roller — soft overcast light, closer crop with more habitat detail visible
Make the art lilac-breasted roller — dappled shade lighting, three-quarter angle view
```

These are shorthand, not standalone prompts — the master prompt + subject line carry the instructions. In a
fresh Copilot chat, paste the master prompt + table once first.

---

## Track B — Code spec

Already a task: see "Safari art and photo wiring" in `docs/TASK_BOARD_NOW.md`. Short version: copy the 30 JPEGs
into `public/assets/animals/`, add the 6 ids at count 5 to `PHOTO_VARIANT_COUNTS`
(`src/data/animalPhotoVariants.ts`), add 5 facts each to `ANIMAL_FACTS` (`src/data/animalFacts.ts` — not
`BONUS_FACTS`). No test change is needed: `src/state/biomeState.test.ts` already handles animals with and without photos.

---

## Handing this to Copilot 365

1. Open a **new** Copilot 365 image-generation chat.
2. Attach `wild-camper-direction.png` and `docs/VISUAL_DIRECTION.md`.
3. Run the 30 trigger lines above (6 animals × 5 shots).
4. Send everything back to Claude — no sorting needed.

---

## Done when

- 30 images generated and handed to Claude to convert, rename and wire in (Track B).
