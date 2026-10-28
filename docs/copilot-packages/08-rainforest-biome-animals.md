# Package 08 — Rainforest biome animal art

**Status:** ready to hand to Copilot 365 for Track A. Track B (wiring) is already specced as the
"Rainforest art and photo wiring" task on `docs/TASK_BOARD_NOW.md`.
**Track A:** art brief (image generation, 6 animals × 5 photos each = 30 images). **Track B:** code, done by
Claude once the images arrive.
**Scope:** collectible photo art for the 6 Rainforest animals, in the same 5-photo-variant shape as the
Park, Forest and Lake animals. The Rainforest is already playable (`D-2026-10-28-rainforest-biome`);
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
- **Forest Floor:** `tapir`, `poison-dart-frog`
- **Canopy Walk:** `sloth`, `scarlet-macaw`
- **River Bank:** `capybara`, `green-iguana`

**Why 5 photos per animal** — every animal has 5 randomly-collectible photo variants, and photo N unlocks fact
N (`D-2026-07-25-photo-collection-mechanic`). So the 5 photos per animal must look clearly different from each
other.

**Filenames matter this time.** Use the exact animal id as the file prefix (`tapir-1.png` …
`green-iguana-5.png`). The Lake batch used `heron-*` for an animal whose id was `great-blue-heron`, which
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
> lush rainforest habitat forms the background — layered green leaves, ferns, a misty canopy, or a river bank
> depending on the animal — like a nature-photography close-up, not a flat/empty background and not a studio
> cutout. No people, no text, no cages, no distress. The animal must be unclothed, not talking, not posed
> unnaturally.
>
> Subject: **[insert per-animal line from the table below]**

| Animal id | Filename (base shot) | Subject line to append to the master prompt |
|---|---|---|
| `tapir` | `tapir-1.png` | A tapir standing on a leafy rainforest floor, snout raised to sniff the air, calm; blurred ferns and dappled green light behind it. |
| `poison-dart-frog` | `poison-dart-frog-1.png` | A small brightly coloured poison dart frog sitting on a broad green leaf, calm; blurred wet leaves and soft mist behind it. |
| `sloth` | `sloth-1.png` | A sloth hanging from a branch with a calm, gentle expression; blurred rainforest canopy and soft sunlight behind it. |
| `scarlet-macaw` | `scarlet-macaw-1.png` | A scarlet macaw perched on a branch, vivid red, yellow and blue feathers, calm; blurred green canopy behind it. |
| `capybara` | `capybara-1.png` | A capybara resting on a muddy river bank, relaxed and calm; blurred river water and tall green plants behind it. |
| `green-iguana` | `green-iguana-1.png` | A green iguana basking on a branch above a river, calm; blurred water and rainforest leaves behind it. |

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
Make the art tapir
Make the art tapir — soft morning light, calm resting pose
Make the art tapir — warm golden-hour light, alert active pose
Make the art tapir — soft overcast light, closer crop with more habitat detail visible
Make the art tapir — dappled shade lighting, three-quarter angle view

Make the art poison dart frog
Make the art poison dart frog — soft morning light, calm resting pose
Make the art poison dart frog — warm golden-hour light, alert active pose
Make the art poison dart frog — soft overcast light, closer crop with more habitat detail visible
Make the art poison dart frog — dappled shade lighting, three-quarter angle view

Make the art sloth
Make the art sloth — soft morning light, calm resting pose
Make the art sloth — warm golden-hour light, alert active pose
Make the art sloth — soft overcast light, closer crop with more habitat detail visible
Make the art sloth — dappled shade lighting, three-quarter angle view

Make the art scarlet macaw
Make the art scarlet macaw — soft morning light, calm resting pose
Make the art scarlet macaw — warm golden-hour light, alert active pose
Make the art scarlet macaw — soft overcast light, closer crop with more habitat detail visible
Make the art scarlet macaw — dappled shade lighting, three-quarter angle view

Make the art capybara
Make the art capybara — soft morning light, calm resting pose
Make the art capybara — warm golden-hour light, alert active pose
Make the art capybara — soft overcast light, closer crop with more habitat detail visible
Make the art capybara — dappled shade lighting, three-quarter angle view

Make the art green iguana
Make the art green iguana — soft morning light, calm resting pose
Make the art green iguana — warm golden-hour light, alert active pose
Make the art green iguana — soft overcast light, closer crop with more habitat detail visible
Make the art green iguana — dappled shade lighting, three-quarter angle view
```

These are shorthand, not standalone prompts — the master prompt + subject line carry the instructions. In a
fresh Copilot chat, paste the master prompt + table once first.

---

## Track B — Code spec

Already a task: see "Rainforest art and photo wiring" in `docs/TASK_BOARD_NOW.md`. Short version: copy the 30 JPEGs
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
