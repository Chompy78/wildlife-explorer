# D-2026-10-28-alien-planet-minigames-photo-fun — Alien Planet, Mini Games and livelier photos

Date: 2026-10-28
Status: Active

- **Context:** the user chose H2 (build Alien Planet) and asked for "a range of mini games and a way to
  improve the taking photo to be more fun". Both are explicit go-aheads for things the Scope boundary
  would otherwise hold back.
- **Alien Planet:** the 13th data-driven biome (Crystal Meadow, Floating Islands, Glowing Caves). Its six
  animals are imaginary, which its own "far-future mystery" text implies. It stays out of the habitat quiz
  (`quizEligible: false`) because that quiz teaches real-world habitats. Save schema 14 -> 15.
- **Mini Games:** a separate screen from the Start screen with four calm games: Memory Match, Who Am I?,
  Spot the Animal, Where Do I Live?. No timer, no losing, no rewards, and they never read or write the
  save, so the photo collection stays the only thing that grows. Quest animals (the Lost Puppy) are never
  used. Only pure helpers in `src/data/miniGames.ts` hold the logic, so they are unit tested.
- **Photo fun:** each shutter tap now gets feedback: a quick flash, a "Perfect" bullseye (middle fifth of
  the sweet spot), a Great Shot streak ("3 in a row!") and a best streak. It is display-only. It does not
  change which photo you get, the Great Shot timing or the collection, and a plain shot just restarts the
  streak with encouraging wording, so the Canon's "no harsh failure" holds.
- **Options not taken:** rewards for mini games (would blur the "photos are the collection" design); a timer
  or lives (against Canon's calm tone); a zoom or framing step in the camera (bigger redesign - can be a
  later task if the streak feedback is not enough).
- **Canon check:** no combat, harm or collecting; imaginary animals are observed only.
- **Not verified visually:** the browser could not reach the dev server.
- **Status:** Active.
