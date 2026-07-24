# Package 01 — Biome background visuals (Tutorial Park + Forest)

**Status:** done (2026-07-25) — Copilot 365 generated both hero images; Claude implemented Track B
directly after Copilot wasn't able to produce it. Kept here as the record and as a template for the next
package.
**Track A:** art brief (image generation). **Track B:** code spec (React/CSS).
**Scope:** two new hero images (Tutorial Park, Forest) plus a small CSS/JSX change so all three biome
screens (Camper, Park, Forest) share one visual pattern. No gameplay, save-schema, or state logic
changes.

---

## 0. Context Copilot needs (read this whole section — it replaces browsing the repo)

**Stack:** React + TypeScript + Vite. Components are plain functions returning JSX; state flows in via
props (`saveData`, `onSaveChange`, ...) — see the inlined code below for the exact pattern. No CSS
framework; one global stylesheet, `src/styles.css`, using hand-written classes.

**Canon (never violate, from `AI.md`)**
- Calm wildlife observation and photography only.
- No combat or harsh failure.
- Never catch, collect, harm or kill animals.
- The Lost Puppy is helped and reunited, never collected.
- Mountains, Lake, Safari, Rainforest and Alien Planet remain preview-only — do not depict them as
  playable/visited.

**Scope boundary (from `AI.md`)** — do not add a full Forest biome, complex quests, rare Forest animals,
companions, inventory, crafting, shops, economy, or another playable destination. This package only adds
*visuals* for locations that already exist in the shipped game (Tutorial Park, Forest Arrival/Fern
Trail) — it does not expand gameplay scope.

**Established art direction** — full detail lives in `docs/VISUAL_DIRECTION.md` (read it before running
Track A; it also has a Scope note on what's in/out of bounds for the shipped game). Summary as it
applies to this package:
- **Style anchor image:** `public/assets/wild-camper/wild-camper-direction.png` (1536×1024 PNG, already
  live in the app on the Camper screen). **Attach this actual file in Copilot 365** alongside the Track A
  prompts below — it is the ground truth for style, not just the text description of it.
- **Style summary:** bright, colourful, storybook-realistic wildlife adventure art — cute but believable
  animals (not flat vector cartoon, not photographic), rich natural habitats with discoverable detail,
  warm dappled lighting, fine painterly texture, calm exploration feeling.
- **Rules that apply to these two images specifically** (full list in `VISUAL_DIRECTION.md`): animals
  must look recognisable/believable, must not talk or wear clothing, must stay in their natural habitat
  and behave naturally; no dark/horror mood, no empty flat backgrounds, no danger or distress.
- **Do not use rainforest-dense styling for the Forest hero** — `VISUAL_DIRECTION.md`'s Scope note
  explains why: Rainforest is a separate, preview-only destination in `AI.md`, distinct from the shipped
  Forest biome this package covers.

**Existing pattern to match** (`src/components/CamperScreen.tsx`, relevant excerpt):
```tsx
return (
  <main className="screen camper-screen">
    <header className="top-bar camper-header">...</header>
    <section className="camper-visual panel">
      <img src="/assets/wild-camper/wild-camper-direction.png" alt="Illustrated Wild Camper parked in a natural landscape"/>
      <div className="camper-visual-copy">
        <p className="eyebrow">Unlocked base</p>
        <h2>Inside the Wild Camper</h2>
        <p>Inspect stations, review discoveries, and plan the next journey.</p>
      </div>
    </section>
    <section className="camper-layout">...</section>
  </main>
);
```

**Existing CSS for that pattern** (`src/styles.css`, relevant excerpt):
```css
.camper-visual{position:relative;overflow:hidden;min-height:260px;padding:0;margin:0 auto 1rem;max-width:1240px;background:#193d28}
.camper-visual img{display:block;width:100%;height:clamp(260px,38vw,470px);object-fit:cover}
.camper-visual-copy{position:absolute;left:1rem;bottom:1rem;max-width:500px;padding:1rem 1.2rem;border-radius:20px;color:#fff;background:rgba(18,45,29,.88);backdrop-filter:blur(4px)}
.camper-visual-copy h2,.camper-visual-copy p{margin-top:.25rem}.camper-visual-copy .eyebrow{color:#ffe08c}
@media(max-width:700px){.camper-visual-copy{position:static;max-width:none;border-radius:0}.camper-visual img{height:240px}.intro-card{padding:1.25rem}}
```
Note there is a `prefers-reduced-motion` rule elsewhere in `styles.css` that disables animation/transition
durations globally — do not add any new transitions/animations to this pattern that would need a separate
opt-out; the existing image treatment has none.

**Current state of the two target screens** — `ParkScreen.tsx` and `ForestScreen.tsx` currently open with
a plain `<header className="top-bar">...</header>` and go straight into layout panels — **neither has a
hero image today.** `ForestScreen.tsx` is a single dense line (not yet split across multiple lines like
the other components) — match that file's existing formatting when editing it, don't reformat the whole
file as a side effect.

---

## Track A — Art brief (image generation)

Generate two new hero images at **1536×1024**, PNG, landscape, no text/logos/watermarks in the image,
matching the attached reference images exactly in style (see art direction above).

**Reference images confirmed** (now in `docs/design-reference/`, see `VISUAL_DIRECTION.md`'s Scope note):
- `03_campervan_base_direction.png` is the same picture as the already-shipped
  `public/assets/wild-camper/wild-camper-direction.png` — confirms it as the style anchor.
- `01_tutorial_nature_park_direction.png` is the direct, specific reference for A1 below — use it, not
  just the text description.
- `02_rainforest_many_animals_direction.png` is **not** a reference for A2 — it's the separate,
  preview-only Rainforest destination (tiger, elephants, monkeys, toucans). Do not pull species or
  density from it into the Forest hero.

**Recurring character** — both the Camper reference and the Tutorial Park reference (`01_...`) show the
same wildlife-explorer character (practical khaki/olive outdoor clothing, wide-brim hat or cap,
backpack) with a golden retriever companion (plain bandana only, no other clothing). Both are
**decorative/atmospheric art only** — matching the already-shipped Camper hero for series consistency.
This does not imply building a companion game mechanic; `AI.md`'s Scope boundary still excludes
companions as a gameplay system until a later milestone.

### A1. Tutorial Park hero
> Bright, colourful, storybook-realistic wildlife adventure art — matching the attached
> `01_tutorial_nature_park_direction.png` reference's warm dappled lighting, lush saturated greens, fine
> painterly texture, and calm exploration mood (not flat vector cartoon, not photographic). The wildlife
> explorer character (khaki/olive outdoor clothing, wide-brim hat, backpack) kneels beside a calm
> woodland pond, photographing a mallard duck family (adult drake, hen, and ducklings) swimming near
> lily pads; her golden retriever companion (plain bandana, no other clothing) sits calmly beside her; a
> small lizard rests on a mossy log in the foreground. A wooden footbridge crosses the stream in the
> background; a stone path bordered by wildflowers leads through a round ivy-covered archway into the
> trees beyond; butterflies and small birds in the branches; orange lilies and pink blossoms in the
> foreground. Calm, safe, richly detailed but readable composition suitable for a children's calm
> wildlife-photography game (ages 8-14) — no danger, no predators, no distress, no cages.

- **Save as:** `public/assets/tutorial-park/park-direction.png`
- **Alt text to use in code:** `"Illustrated wildlife explorer and dog photographing a duck family at a woodland pond in Tutorial Park"`

### A2. Forest hero
> Bright, colourful, storybook-realistic wildlife adventure art — same style and the same recurring
> explorer-and-dog characters as A1 above, but set in a quiet **temperate forest** clearing beside a
> dirt camper track — explicitly **not** a dense rainforest: moderate tree cover, ferns and moss
> carpeting the ground, dappled canopy light, not the density of `02_rainforest_many_animals_direction.png`.
> The wildlife explorer kneels quietly with her camera raised; her golden retriever companion rests
> beside her; a small Forest Wren perches calmly on a low branch nearby; a Forest Wallaby rests in the
> ferns at a comfortable distance; a Shiny Forest Beetle sits on a leaf in the immediate foreground.
> Calm, unhurried, entirely safe atmosphere suitable for a children's calm wildlife-photography game
> (ages 8-14) — no danger, no predators, no distress, no cages, and explicitly **no rainforest-only
> species** (no tigers, elephants, monkeys, toucans, or macaws).

- **Save as:** `public/assets/forest/forest-direction.png`
- **Alt text to use in code:** `"Illustrated wildlife explorer and dog with a Forest Wren and Forest Wallaby in a quiet temperate forest clearing"`

If Copilot's image tool cannot exactly hit 1536×1024, anything with the **same ~3:2 landscape aspect
ratio** is fine — the CSS crops with `object-fit: cover` at a responsive height, so exact pixel match
isn't required, only the aspect ratio and style.

---

## Track B — Code spec

**Files Copilot needs open for this track (well under the 20-file limit):**
`src/components/CamperScreen.tsx`, `src/components/ParkScreen.tsx`, `src/components/ForestScreen.tsx`,
`src/styles.css`.

### B1. Generalize the visual-band CSS (styles.css)

Replace the `.camper-visual` / `.camper-visual-copy` block quoted in section 0 with a shared
`.biome-visual` / `.biome-visual-copy` base (same rules, renamed), so Park and Forest can reuse it
without duplicating CSS:

```css
.biome-visual{position:relative;overflow:hidden;min-height:260px;padding:0;margin:0 auto 1rem;max-width:1240px;background:#193d28}
.biome-visual img{display:block;width:100%;height:clamp(260px,38vw,470px);object-fit:cover}
.biome-visual-copy{position:absolute;left:1rem;bottom:1rem;max-width:500px;padding:1rem 1.2rem;border-radius:20px;color:#fff;background:rgba(18,45,29,.88);backdrop-filter:blur(4px)}
.biome-visual-copy h2,.biome-visual-copy p{margin-top:.25rem}.biome-visual-copy .eyebrow{color:#ffe08c}
@media(max-width:700px){.biome-visual-copy{position:static;max-width:none;border-radius:0}.biome-visual img{height:240px}.intro-card{padding:1.25rem}}
```

### B2. Update CamperScreen.tsx to use the shared class

In the JSX quoted in section 0, change `className="camper-visual panel"` to
`className="biome-visual panel"` and `className="camper-visual-copy"` to
`className="biome-visual-copy"`. No other change to this file.

### B3. Add the hero section to ParkScreen.tsx

Insert immediately after the closing `</header>` tag and before `<section className="park-grid">`:

```tsx
<section className="biome-visual panel">
  <img src="/assets/tutorial-park/park-direction.png" alt="Illustrated wildlife explorer and dog photographing a duck family at a woodland pond in Tutorial Park"/>
  <div className="biome-visual-copy">
    <p className="eyebrow">Wildlife photography</p>
    <h2>Explore the park</h2>
    <p>Visit each location and photograph wildlife calmly.</p>
  </div>
</section>
```
Note: the eyebrow text is "Wildlife photography", not "Tutorial Park" — the header directly above already
renders the literal text "Tutorial Park" (`src/components/ParkScreen.tsx` line 56), and `App.test.tsx`
asserts `getByText('Tutorial Park')` expecting exactly one match.

### B4. Add the hero section to ForestScreen.tsx

Insert the equivalent section immediately after that file's `</header>` and before
`<section className="forest-layout">`, keeping the file's existing single-line JSX style rather than
reformatting the whole file:

```tsx
<section className="biome-visual panel"><img src="/assets/forest/forest-direction.png" alt="Illustrated wildlife explorer and dog with a Forest Wren and Forest Wallaby in a quiet temperate forest clearing"/><div className="biome-visual-copy"><p className="eyebrow">Forest</p><h2>A quiet arrival</h2><p>Follow the Fern Trail and photograph what you find.</p></div></section>
```

### B5. Place the generated images

Copy the two PNGs from Track A into:
- `public/assets/tutorial-park/park-direction.png`
- `public/assets/forest/forest-direction.png`

(New folders — mirror the existing `public/assets/wild-camper/` layout.)

---

## Handing this to Copilot 365

1. **Track A** — open Copilot 365's image generation and attach: `wild-camper-direction.png` (already in
   the repo), `01_tutorial_nature_park_direction.png` (the file you have locally — the direct reference
   for A1), and `docs/VISUAL_DIRECTION.md`. Do **not** attach `02_rainforest_many_animals_direction.png`
   — it would push the Forest prompt toward the wrong destination's density/species. Paste prompts A1 and
   A2 one at a time. Save the results locally with the exact filenames given above.
2. **Track B** — open Copilot 365 Chat, attach only the 4 files listed at the top of Track B (not the
   whole repo — stays well inside the 20-file limit), paste this document's Track B section, and ask it
   to produce the diffs for B1–B4.
3. Bring both back here: drop the two PNGs into the paths in B5, apply/adjust the code diffs, then let
   Claude run the verification and integration pass below.

**What actually happened (2026-07-25):** Track A worked as planned — Copilot 365 generated both hero
images matching the reference style. Copilot 365 Chat was not able to complete Track B's code changes,
so Claude implemented B1–B5 directly instead (it's a small, fully-specified, low-risk change — faster to
do directly than to keep iterating with Copilot on it). Worth knowing for the next package: budget for
Track B possibly needing to fall back to Claude rather than assuming Copilot 365 Chat will complete it.

---

## Done when

- `public/assets/tutorial-park/park-direction.png` and `public/assets/forest/forest-direction.png` exist
  and match the reference style (semi-realistic digital-painting, ~3:2 landscape).
- `ParkScreen.tsx` and `ForestScreen.tsx` render a hero visual section in the same position/pattern as
  `CamperScreen.tsx`'s existing one, using the shared `.biome-visual` CSS.
- `CamperScreen.tsx`'s existing visual still renders identically after the class rename (visual check —
  no `camper-visual` class references left orphaned in `styles.css`).
- Canon and Scope boundary from `AI.md` are respected (no combat/collection imagery, no depiction of
  preview-only destinations as playable).
- `npm run check` passes (typecheck + tests + build + encoding audit).
