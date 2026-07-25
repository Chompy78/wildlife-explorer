# Package 04 — Lake biome animal art (pre-milestone art prep)

**Status:** ready to hand to Copilot 365. Pure art prep — Lake has no gameplay built yet (no locations,
no data model), so this package produces no code changes today. It exists so the art is ready whenever a
future milestone builds out the Lake destination, same spirit as the 8 preview biomes already added.
**Track A only.** There is no Track B for this package — nothing to wire up until Lake is real.

---

## Context

`Lake` already exists as a `status: 'preview'` `DestinationPreview` (`src/data/destinations.ts`),
non-playable. This package generates animal art for it ahead of time. **Do not** build a Lake locations/
data model from this package alone — that's out of `AI.md`'s Scope boundary ("another playable
destination unless a later milestone explicitly requires it") and isn't part of this ask.

**Sections** (proposed, not yet real game locations — just a way to group the art), 2 animals each:
- **Shoreline:** Great Blue Heron, Beaver
- **Open Water:** Rainbow Trout, Loon
- **Reeds & Shallows:** Dragonfly, Painted Turtle

**Art direction:** same as every prior package — `docs/VISUAL_DIRECTION.md` + the established style
anchor `public/assets/wild-camper/wild-camper-direction.png`. Attach both in Copilot 365 alongside the
prompts below.

---

## Master prompt

> Bright, colourful, storybook-realistic wildlife adventure art — matching the established Wildlife
> Explorer reference art (attach `wild-camper-direction.png` and `docs/VISUAL_DIRECTION.md`): warm
> digital painting, cute but believable and recognisable animals, fine painterly texture, warm natural
> lighting (not flat vector cartoon, not photographic). Square close-up portrait composition: the animal
> is the clear, centered subject filling most of the frame in a natural, characteristic pose; a softly
> blurred, out-of-focus hint of a calm lake habitat forms the background — reeds, still water, morning
> mist, or a wooded shoreline depending on the animal — like a nature-photography close-up, not a
> flat/empty background and not a studio cutout. No people, no text, no cages, no distress. The animal
> must be unclothed, not talking, not posed unnaturally.
>
> Subject: **[insert per-animal line from the table below]**

| Animal | Subject line |
|---|---|
| Great Blue Heron | A great blue heron standing still in shallow water, calm and watchful; blurred reeds and morning mist behind it. |
| Beaver | A beaver resting on a low bank at the water's edge, calm and alert; blurred still lake water behind it. |
| Rainbow Trout | A rainbow trout just beneath the water's surface, calm and glinting with colour; blurred sunlit ripples behind it. |
| Loon | A loon floating calmly on open water, alert and watchful; blurred still lake surface and distant shoreline behind it. |
| Dragonfly | A dragonfly resting on a reed with wings open, close-up, calm; blurred reeds and water behind it. |
| Painted Turtle | A painted turtle basking calmly on a partly-submerged log; blurred lake water and lily pads behind it. |

Square aspect ratio (1:1), any resolution — Claude resizes/converts on the way in, matching every prior
package (Park animals landed at 1254px PNG and were converted to JPEG quality 85 without losing quality;
same treatment applies here).

## Quick-reference trigger list (5 shots per animal: 1 base + 4 variation modifiers)

Once the master prompt and table are in view (pasted earlier in the same Copilot chat, or the chat has
this file attached), these one-liners trigger each image in turn — same pattern as the Park animals:

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

## Handing this to Copilot 365

1. Open a **new** Copilot 365 image-generation chat (recommended over reusing the Park-animals session —
   keeps this batch from getting mixed up with unrelated context).
2. Attach `wild-camper-direction.png` and `docs/VISUAL_DIRECTION.md`.
3. Run the 30 trigger lines above (6 animals × 5 shots each).
4. Send everything back to Claude — no need to sort or rename, that's handled on the way in, same as
   every prior batch.

## Done when

- 6 animals × 5 photos = 30 images generated and hosted for Claude to convert/rename/move.
- No code changes expected from this package alone (see Scope note above) — art sits ready until a
  future milestone builds the Lake destination for real.
