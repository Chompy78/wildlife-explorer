# Wildlife Explorer AI Project Brief

## Source-of-truth rule

Read this file first. Treat the repository files as the source of truth. Do not reconstruct the implementation from memory. Run `npm install` and `npm run check` before editing.

## Current verified baseline

Milestone 5 builds on the verified Milestone 4.1 codebase.

Implemented:

- Tutorial Park progression and Lost Puppy helping quest
- Rare Owl, Whisper Grove and Wild Camper unlock flow
- Wild Camper introduction, stations, route previews, Photo Wall and Expedition Readiness
- Forest travel from the Wild Camper
- Forest Arrival and one short Fern Trail
- Forest Wren, Forest Wallaby, Shiny Forest Beetle and Cane Toad photography
- Wildlife Journal integration
- Return from Forest to the Wild Camper
- Illustrated Park Map: `ParkScreen.tsx`'s location grid replaced with a single map image and 6
  percentage-positioned, keyboard-accessible pins (`src/data/parkMapCoordinates.ts`)
- Single-screen landscape layout: Park/Forest/Camper (`.play-screen`) fill the viewport with no page
  scroll at common landscape sizes (phone/tablet/laptop). The hero banner moved behind an "About" button;
  Camera/Quest/Discover/Progress/Journey Planner moved behind action-bar buttons that open them as modals
  (`src/components/PanelModal.tsx`), reusing the existing Journal modal pattern. The action bar itself is
  a compact column of icon-only round buttons floating over the map/content area (not a sidebar), so the
  map gets the full screen width. A location's nearby clue (if any) gets its own magnifying-glass button,
  separate from the Quest button. Portrait/narrow phones fall back to a taller, scrollable stack.
- Non-native animal reporting: Red-eared Slider Turtle (Duck Pond) and Cane Toad (Forest) trigger a calm
  "where does it belong" habitat quiz after the first photograph, and a note in the Journal
- Photo collection: 11 animals (Duck, Frog, Butterfly, Rabbit, Lizard, Park Bird, Rare Owl, Forest Wren,
  Forest Wallaby, Forest Beetle, Lost Puppy) each have 5 real collectible photo variants — photographing
  (or, for Lost Puppy, completing the reunion) shows a randomly-picked not-yet-collected one in a "New
  photo!" reveal, duplicates are never handed out, and the Journal/Camera Panel/Photo Wall show
  collection progress and thumbnails instead of emoji
- Animal facts: each of the 11 animals with photo art has 5 facts tied 1:1 to its 5 photo variants —
  getting variant N reveals fact N in the photo reveal ("Did you know?") and permanently in the Journal
  ("X of 5 facts learned"). No new save state — a fact is learned iff its variant is already in
  `collectedPhotoVariants` (`src/data/animalFacts.ts`)
- Save schema version 7 and migration of older saves
- Keyboard focus handling, responsive styling and reduced-motion support
- TypeScript, state tests, component tests, production build and encoding audit
- Deployed to GitHub Pages at `https://chompy78.github.io/wildlife-explorer/` (auto-deploys on push to
  `main` via `.github/workflows/deploy.yml`, gated behind the full `npm run check` suite)

## Canon

- Calm wildlife observation and photography
- No combat or harsh failure
- Never catch, collect, harm or kill animals
- The Lost Puppy is helped and reunited, never collected
- Mountains, Lake, Safari, Rainforest and Alien Planet remain preview-only

## Scope boundary

Do not add a full Forest biome, complex quests, rare Forest animals, companions, inventory, crafting, shops, economy or another playable destination unless a later milestone explicitly requires it.

## Verification

```powershell
npm install
npm run check
npm run dev
```

`npm run check` must pass TypeScript checks, tests, the production build and encoding validation.

`vite.config.ts` sets `base: '/wildlife-explorer/'` for GitHub Pages — this also changes the local dev
server's URL: `npm run dev` serves at `http://localhost:<port>/wildlife-explorer/`, not the bare root.
Vite prints the exact URL to open; use that one, not a guessed `localhost:<port>/`. Any new hardcoded
`src="/assets/..."` path must go through `assetUrl()` (`src/assetUrl.ts`) instead of a raw string
literal, or it will silently 404 once deployed (works fine in dev, breaks under the Pages subpath).
