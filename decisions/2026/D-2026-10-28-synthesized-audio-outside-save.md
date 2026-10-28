# D-2026-10-28-synthesized-audio-outside-save — synthesized sound effects, mute kept outside SaveData

Date: 2026-10-28
Status: Active

- **Context:** the SOMEDAY band listed a sound/audio system ("a natural fit for a calm nature game"); the
  user asked for it to be built.
- **Options:** (A) synthesize short tones with the Web Audio API - no files, no licensing, tiny bundle.
  (B) ship recorded audio assets - richer, but needs sourcing/licensing and adds weight to every load.
  Separately for the mute flag: (C) a field in `SaveData` - needs a schema bump and migration, and would
  be wiped by New Game / Reset Save. (D) its own `localStorage` key.
- **Decision:** A and D. Sounds (shutter, Great Shot chime, new-photo chime) are generated in
  `src/audio/sound.ts` and only play in response to a tap. The mute choice is stored under
  `wildlife-explorer-sound-muted`, toggled from the Camera panel.
- **Why:** A keeps the build self-contained and calm (soft attack/release, low volume). D is a device
  preference, not game progress, so it should survive a save reset and must not risk the save-migration
  path (which `npm run check` can't fully protect).
- **Consequence:** sound defaults to on. If richer audio is wanted later, swap the tone calls for asset
  playback behind the same three functions; ambient loops are not built.
- **Status:** Active.
