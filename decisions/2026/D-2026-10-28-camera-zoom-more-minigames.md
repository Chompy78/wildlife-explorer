# D-2026-10-28-camera-zoom-more-minigames — optional camera zoom and three more Mini Games

Date: 2026-10-28
Status: Active

- **Context:** the user chose I2 (a more hands-on camera) and I3 (more mini games) after the first Mini Games
  and shot-feedback change (`D-2026-10-28-alien-planet-minigames-photo-fun`).
- **Camera:** instead of a new framing step before every photo (which would add a tap to the main loop and
  slow the calm flow), the Camera panel gets an optional **Zoom** dial: Wide (relaxed, default), Close
  (0.8x sweep speed and glowing-zone width, 1.5x points) and Macro (0.6x, 0.65x width, 2x points). A running
  Score for the visit sits beside the existing Perfect/streak feedback. Zoom only changes timing and the
  on-screen score. It never changes which photo you get, the Great Shot rules, or the collection, so
  players who ignore it play exactly as before.
- **Mini Games added:** Pattern Parade (watch and repeat; a wrong tap just replays the pattern), Count Them
  Up, and Day or Night? (uses the same active-time wording as the Camera mood; only animals with one clear
  active time are asked). Seven games in total. Still no timers, no losing, no rewards, nothing saved.
- **Options not taken:** a mandatory framing/zoom step (slows the loop, and the existing tests and design
  assume a single tap); persistent high scores or unlocks (would turn the games into a second progression
  system, against `D-2026-10-28-alien-planet-minigames-photo-fun`).
- **Canon check:** calm observation only; no failure states.
- **Not verified visually:** the browser could not reach the dev server.
- **Status:** Active.
