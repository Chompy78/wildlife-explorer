# D-2026-10-28-godot-port — a Godot 4 version of the whole game, living beside the web game

Date: 2026-10-28
Status: Active

- **Context:** the user asked to "use godot to do a better job" and chose option M1 (port the whole game to
  Godot) over a one-piece trial, assets-only use, or staying on the web. Godot 4.7.1 is installed on this
  machine and has web export templates. The recommendation was M2 (try one piece first); M1 was chosen
  anyway, so the whole game was ported.
- **Decision:** a Godot project in `godot/` that reproduces every screen and rule of the web game: Start,
  role select, Tutorial Park (map, pins, Lost Puppy quest, discoveries, clues, progress, celebration, ranger
  quiz), Forest, Wild Camper (stations, journey planner, travel), all 13 data-driven biomes, the camera
  (sweep track, Great Shot, Perfect, streaks, zoom, mood), photo reveal with role bonus facts, Journal and
  Photo Album, habitat quiz, seven mini games, synthesized sound and ambient beds. The UI is built in code
  and laid out portrait-first (720x1280) with a bottom dock of big buttons for thumbs.
- **One source of truth:** the web game's TypeScript tables stay the source. `npm run godot:data` writes
  `godot/data/game_data.json` (animals, biomes, facts, photo counts...), which the Godot game loads.
  `scripts/sync-godot-assets.sh` copies the art from `public/assets` into `godot/assets` (git-ignored)
  as raw `.dat` files; Godot's own image import made the first web build 148 MB, raw files made it 45 MB.
- **Rules are ported, not shared:** `godot/scripts/game_logic.gd`, `shot_rating.gd` and `mini_logic.gd` are
  GDScript twins of `src/state/*`, `shotRating.ts` and `miniGames.ts`. `npm run check:godot` runs 419
  headless checks (data, save migration, photography, quest flow, biomes, shot rating, mini games) and a
  smoke test that builds all screens and overlays (158) and fails on any script error.
- **Save:** the Godot game has its own save (`user://`), not the web game's `localStorage`, so progress does
  not carry between the two. Same fields and schema number (15).
- **Found while reviewing screenshots:** two different animals can share an emoji (two turtles), which made
  Pattern Parade, Memory Match, Spot the Animal and Count Them Up ambiguous or unsolvable. Fixed in both
  versions: a round never picks two animals with the same emoji.
- **What is verified:** rules and screens by the headless tests, and the look by rendering the real scenes
  on a virtual display and reading the screenshots. **Not verified:** the web export running in a browser.
  Godot web builds need HTTPS (a secure context); this machine's plain-HTTP address is refused by the
  engine, and an HTTPS certificate request was declined, so the build could not be tried in the browser.
  No touch device test either.
- **Status:** Active. The web game remains the main, published version until the Godot version has been
  played on a device and hosted over HTTPS.
