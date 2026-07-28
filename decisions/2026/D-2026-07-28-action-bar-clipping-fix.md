# D-2026-07-28-action-bar-clipping-fix — Action-bar buttons clipped on small maps, fixed with a bounded scroll

- **Context:** User reported "on a small screen, not all the buttons show." Reproduced in a real
  browser (Playwright, Chromium) at several small viewports: `.action-bar` (Park/Forest/Camper's floating
  icon toolbar) is `position: absolute; top: 0.6rem; right: 0.6rem` inside `.park-map`/`.forest-stage`,
  which has `overflow: hidden`. The column has no height limit, so once its intrinsic height (button count
  × ~2.9rem each) exceeds the map box's actual height, the bottom button(s) are clipped and unreachable —
  confirmed at 320×480 and 340×640: the `About` button (5 buttons) was clipped, and with both `Clue` and
  `Discover` also showing (7 buttons, reachable by visiting Strange Old Tree), even more of the column was
  cut off.
- **Options:** (A1 — shallow) bound `.action-bar` between `top` and `bottom` and add `overflow-y: auto`,
  so it scrolls internally instead of clipping when content still doesn't fit. (A2 — deeper) reflow
  `.action-bar` into a wrapping horizontal row docked at the bottom of the map on narrow/short screens,
  instead of a vertical column in the corner.
- **Decision:** A1.
- **Why:** A1 is a 1-line CSS change with no visual difference on any screen where the buttons already
  fit (verified desktop screenshot unchanged), and it guarantees every button stays reachable — worst
  case the user scrolls a short internal list, which is still strictly better than a button silently
  vanishing with no affordance at all. A2 gives better discoverability (no hidden scroll) but is a bigger
  layout change: it needs the row to dock without overlapping the map's location pins (checked
  `parkMapCoordinates.ts` — no pins sit in the bottom-right corner today, but a docked-bottom row would
  need re-tuning per screen and per future pin layout), and touches Park/Forest/Camper simultaneously for
  a bug that, once bounded, is no longer a hard blocker. Deferred as a follow-up if the scroll affordance
  itself turns out to be a problem for the target age range (8-14).
- **Consequence:** `.action-bar` in `src/styles.css` gained `bottom: 0.6rem; overflow-y: auto;`. Verified
  in a real browser (not just `npm run check`, which doesn't cover visual clipping): all 5 buttons
  reachable down to 320×480 and 340×640, and all 7 buttons (Clue + Discover both showing, at Strange Old
  Tree) reachable via internal scroll at the same sizes. Desktop (1280×800) screenshot confirmed visually
  unchanged.
- **See also:** none yet — if the deeper row-based redesign (A2) is picked up later, link it back here.
- **Status:** Active.
