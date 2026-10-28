# Package 06 — Mountains biome animal art

**Status:** ready to hand to Copilot 365 for Track A. Track B (wiring) is already specced as the
"Mountains art and photo wiring" task on `docs/TASK_BOARD_NOW.md`.
**Track A:** art brief (image generation, 6 animals × 5 photos each = 30 images). **Track B:** code, done by
Claude once the images arrive.
**Scope:** collectible photo art for the 6 Mountains animals, in the same 5-photo-variant shape as the
Park, Forest and Lake animals. The Mountains are already playable (`D-2026-10-28-mountains-biome-go-ahead`);
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
- **Rocky Trail:** `mountain-goat`, `marmot`
- **Alpine Meadow:** `pika`, `mountain-hare`
- **Lookout Ridge:** `golden-eagle`, `mountain-bluebird`

**Why 5 photos per animal** — every animal has 5 randomly-collectible photo variants, and photo N unlocks fact
N (`D-2026-07-25-photo-collection-mechanic`). So the 5 photos per animal must look clearly different from each
other.

**Filenames matter this time.** Use the exact animal id as the file prefix (`mountain-goat-1.png` …
`mountain-bluebird-5.png`). The Lake batch used `heron-*` for an animal whose id was `great-blue-heron`, which
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
> high-country habitat forms the background — rocky crags, alpine meadow, scree slopes, or distant peaks
> depending on the animal — like a nature-photography close-up, not a flat/empty background and not a studio
> cutout. No people, no text, no cages, no distress. The animal must be unclothed, not talking, not posed
> unnaturally.
>
> Subject: **[insert per-animal line from the table below]**

| Animal id | Filename (base shot) | Subject line to append to the master prompt |
|---|---|---|
| `mountain-goat` | `mountain-goat-1.png` | A mountain goat standing sure-footed on a rocky ledge, calm and watchful; blurred grey crags and pale sky behind it. |
| `marmot` | `marmot-1.png` | A marmot sunbathing upright on a flat rock, relaxed and alert; blurred alpine boulders and grass behind it. |
| `pika` | `pika-1.png` | A small round-eared pika perched on a mossy rock with a mouthful of fresh grass; blurred scree slope and wildflowers behind it. |
| `mountain-hare` | `mountain-hare-1.png` | A mountain hare sitting still in a cool alpine meadow, ears upright; blurred wildflowers and rocky slope behind it. |
| `golden-eagle` | `golden-eagle-1.png` | A golden eagle perched on a high rocky outcrop looking out over a valley, calm and powerful; blurred distant peaks behind it. |
| `mountain-bluebird` | `mountain-bluebird-1.png` | A bright sky-blue mountain bluebird perched on a weathered fence post, calm; blurred alpine grass and distant ridge behind it. |

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
Make the art mountain goat
Make the art mountain goat — soft morning light, calm resting pose
Make the art mountain goat — warm golden-hour light, alert active pose
Make the art mountain goat — soft overcast light, closer crop with more habitat detail visible
Make the art mountain goat — dappled shade lighting, three-quarter angle view

Make the art marmot
Make the art marmot — soft morning light, calm resting pose
Make the art marmot — warm golden-hour light, alert active pose
Make the art marmot — soft overcast light, closer crop with more habitat detail visible
Make the art marmot — dappled shade lighting, three-quarter angle view

Make the art pika
Make the art pika — soft morning light, calm resting pose
Make the art pika — warm golden-hour light, alert active pose
Make the art pika — soft overcast light, closer crop with more habitat detail visible
Make the art pika — dappled shade lighting, three-quarter angle view

Make the art mountain hare
Make the art mountain hare — soft morning light, calm resting pose
Make the art mountain hare — warm golden-hour light, alert active pose
Make the art mountain hare — soft overcast light, closer crop with more habitat detail visible
Make the art mountain hare — dappled shade lighting, three-quarter angle view

Make the art golden eagle
Make the art golden eagle — soft morning light, calm resting pose
Make the art golden eagle — warm golden-hour light, alert active pose
Make the art golden eagle — soft overcast light, closer crop with more habitat detail visible
Make the art golden eagle — dappled shade lighting, three-quarter angle view

Make the art mountain bluebird
Make the art mountain bluebird — soft morning light, calm resting pose
Make the art mountain bluebird — warm golden-hour light, alert active pose
Make the art mountain bluebird — soft overcast light, closer crop with more habitat detail visible
Make the art mountain bluebird — dappled shade lighting, three-quarter angle view
```

These are shorthand, not standalone prompts — the master prompt + subject line carry the instructions. In a
fresh Copilot chat, paste the master prompt + table once first.

---

## Track B — Code spec

Already a task: see "Mountains art and photo wiring" in `docs/TASK_BOARD_NOW.md`. Short version: copy the 30 JPEGs
into `public/assets/animals/`, add the 6 ids at count 5 to `PHOTO_VARIANT_COUNTS`
(`src/data/animalPhotoVariants.ts`), add 5 facts each to `ANIMAL_FACTS` (`src/data/animalFacts.ts` — not
`BONUS_FACTS`), and update the App test in `src/App.test.tsx` that expects no photo dialog for the Marmot (the table-driven `src/state/biomeState.test.ts` already handles animals with photos).

---

## Handing this to Copilot 365

1. Open a **new** Copilot 365 image-generation chat.
2. Attach `wild-camper-direction.png` and `docs/VISUAL_DIRECTION.md`.
3. Run the 30 trigger lines above (6 animals × 5 shots).
4. Send everything back to Claude — no sorting needed.

---

## Done when

- 30 images generated and handed to Claude to convert, rename and wire in (Track B).
