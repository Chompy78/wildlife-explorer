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
- Non-native animal reporting: Red-eared Slider Turtle (Duck Pond) and Cane Toad (Forest) trigger a calm
  "where does it belong" habitat quiz after the first photograph, and a note in the Journal
- Save schema version 6 and migration of older saves
- Keyboard focus handling, responsive styling and reduced-motion support
- TypeScript, state tests, component tests, production build and encoding audit

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
