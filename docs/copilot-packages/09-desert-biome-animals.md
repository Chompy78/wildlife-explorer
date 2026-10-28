# Package 09 — Desert biome animal art

**Status:** ready to hand to Copilot 365 for Track A. Track B (wiring) is already specced as the
"Desert art and photo wiring" task on `docs/TASK_BOARD_NOW.md`.
**Track A:** art brief (image generation, 6 animals × 5 photos each = 30 images). **Track B:** code, done by
Claude once the images arrive.
**Scope:** collectible photo art for the 6 Desert animals, in the same 5-photo-variant shape as the
Park, Forest and Lake animals. The Desert is already playable (`D-2026-10-28-remaining-biomes`);
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
- **Sand Dunes:** `fennec-fox`, `sidewinder`
- **Rocky Outcrop:** `desert-tortoise`, `chuckwalla`
- **Oasis Edge:** `roadrunner`, `dromedary-camel`

**Why 5 photos per animal** — every animal has 5 randomly-collectible photo variants, and photo N unlocks fact
N (`D-2026-07-25-photo-collection-mechanic`). So the 5 photos per animal must look clearly different from each
other.

**Filenames matter.** Use the exact animal id as the file prefix (`fennec-fox-1.png` … `dromedary-camel-5.png`). The ids above are final.

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
> filling most of the frame in a natural, characteristic pose; a softly blurred, out-of-focus hint of a calm sunlit desert of sand, rock and palms forms the background — like a nature-photography close-up, not a flat/empty background and not a studio
> cutout. No people, no text, no cages, no distress. The animal must be unclothed, not talking, not posed
> unnaturally.
>
> Subject: **[insert per-animal line from the table below]**

| Animal id | Filename (base shot) | Subject line to append to the master prompt |
|---|---|---|
| `fennec-fox` | `fennec-fox-1.png` | A fennec fox with huge ears sitting on pale sand, calm; blurred dunes and a warm sky behind it. |
| `sidewinder` | `sidewinder-1.png` | A sidewinder snake resting on rippled sand, calm; blurred dunes behind it. |
| `desert-tortoise` | `desert-tortoise-1.png` | A desert tortoise walking slowly across dry ground, calm; blurred rocks and desert shrubs behind it. |
| `chuckwalla` | `chuckwalla-1.png` | A chuckwalla lizard basking on a sunny rock, calm; blurred rocky desert behind it. |
| `roadrunner` | `roadrunner-1.png` | A roadrunner standing alert beside a palm, calm; blurred oasis plants behind it. |
| `dromedary-camel` | `dromedary-camel-1.png` | A dromedary camel resting beside a small oasis pool, calm; blurred palms behind it. |

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
Make the art fennec fox
Make the art fennec fox — soft morning light, calm resting pose
Make the art fennec fox — warm golden-hour light, alert active pose
Make the art fennec fox — soft overcast light, closer crop with more habitat detail visible
Make the art fennec fox — dappled shade lighting, three-quarter angle view

Make the art sidewinder
Make the art sidewinder — soft morning light, calm resting pose
Make the art sidewinder — warm golden-hour light, alert active pose
Make the art sidewinder — soft overcast light, closer crop with more habitat detail visible
Make the art sidewinder — dappled shade lighting, three-quarter angle view

Make the art desert tortoise
Make the art desert tortoise — soft morning light, calm resting pose
Make the art desert tortoise — warm golden-hour light, alert active pose
Make the art desert tortoise — soft overcast light, closer crop with more habitat detail visible
Make the art desert tortoise — dappled shade lighting, three-quarter angle view

Make the art chuckwalla
Make the art chuckwalla — soft morning light, calm resting pose
Make the art chuckwalla — warm golden-hour light, alert active pose
Make the art chuckwalla — soft overcast light, closer crop with more habitat detail visible
Make the art chuckwalla — dappled shade lighting, three-quarter angle view

Make the art roadrunner
Make the art roadrunner — soft morning light, calm resting pose
Make the art roadrunner — warm golden-hour light, alert active pose
Make the art roadrunner — soft overcast light, closer crop with more habitat detail visible
Make the art roadrunner — dappled shade lighting, three-quarter angle view

Make the art dromedary camel
Make the art dromedary camel — soft morning light, calm resting pose
Make the art dromedary camel — warm golden-hour light, alert active pose
Make the art dromedary camel — soft overcast light, closer crop with more habitat detail visible
Make the art dromedary camel — dappled shade lighting, three-quarter angle view
```

These are shorthand, not standalone prompts — the master prompt + subject line carry the instructions. In a
fresh Copilot chat, paste the master prompt + table once first.

---

## Track B — Code spec

Already a task: see "Desert art and photo wiring" in `docs/TASK_BOARD_NOW.md`. Short version: copy the 30 JPEGs
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
