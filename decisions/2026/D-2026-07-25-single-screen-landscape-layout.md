# D-2026-07-25-single-screen-landscape-layout · Hero and panels moved behind buttons, no orientation lock

Date: 2026-07-25
Status: Implemented

- **Context:** the Park/Forest/Camper screens each stacked a full hero banner, a wide map/interaction
  area, and a long always-visible side panel (Camera, Quest, Discovery, Progress on Park; a destination
  grid and Expedition Readiness on Camper). The user reported the layout was "too hard to use" and asked
  for a single screen with no scrolling, landscape as the normal mode, the splash screen gone once
  playing, and the "bottom stuff" opened by a button.
- **Options presented (via `AskUserQuestion`, tiered per `AGENTS.md`):**
  1. *Panel reveal* — modal buttons (chosen) vs. a bottom slide-up drawer vs. a side slide-in drawer vs.
     an in-place accordion. Modal buttons won for reusing the exact pattern Journal already used
     successfully this session — lowest risk, no new UI primitive, no save-schema change.
  2. *Hero banner* — removed from normal play behind an "About" button (chosen) vs. collapsed to a thin
     strip vs. shown once per save ever (would have needed a save-schema change; rejected for that reason
     alone, not because the idea was bad).
  3. *Orientation* — layout-only, no lock (chosen) vs. a gentle rotate-prompt overlay. Rejected an actual
     orientation lock: the Screen Orientation API is unreliable across browsers (notably iOS Safari) and
     locking a web page's orientation is generally poor practice.
- **Decision:** all three "chosen" options above, applied consistently to Park/Forest/Camper.
  - New `src/components/PanelModal.tsx` — a generic modal wrapper (title/eyebrow/children) built from the
    same `.journal-overlay`/`.journal-panel` CSS and `useModalFocus` hook Journal already used; every
    panel this change moved behind a button reuses it instead of inventing a new modal pattern per panel.
  - CameraPanel/QuestPanel/ProgressTracker/DiscoveryPanel had their own internal `<h2>` removed (or
    downgraded to `<h3>` for QuestPanel, since the quest name is real content, not just a label) since
    `PanelModal`'s own title now serves that role - avoids duplicate headings once wrapped.
  - New `.play-screen` layout: `height: 100dvh; display:flex; flex-direction:column; overflow:hidden`,
    with the map/interaction area as `flex:1; min-height:0` so it fills exactly whatever room remains
    after the (now much smaller) header and action bar. Falls back to `height:auto` (page-scrollable) only
    below 700px width, i.e. a narrow portrait phone - landscape at any common phone/tablet/laptop size
    needs no scroll at all.
  - A further `@media (max-height: 460px)` tier (a phone held in landscape, ~390px tall) shrinks the
    header, location strip, message box and action-bar buttons further - without this, the very short
    viewport case compressed the Park Map so much the 6 pin labels visually overlapped.
- **Why not a drawer/accordion:** both were considered stronger fits for "feels native," but this session
  already has one working, tested modal (Journal) plus two more added the same day (PhotoReveal,
  HabitatQuiz) - reusing that pattern for five more panels is a mechanical, low-risk change; a bottom/side
  drawer would have been new interaction code with its own focus-trap and animation edge cases to get
  right, for a UX benefit that's real but secondary to just fixing the actual complaint (forced scrolling).
- **A real dead-space issue found and fixed:** Camper and Forest have far less content than Park (a
  4-station grid; a 2-location grid), so once the hero/panels were removed the remaining flex:1 area was
  mostly empty at typical landscape sizes. Fixed by centering that content within its flex column and
  enlarging the cards, rather than leaving it pinned to the top with a large empty void below - this was
  caught by actually screenshotting at laptop width, not assumed from the CSS alone.
- **Status:** Implemented. `npm run check` passes (component tests for `CamperScreen` and `App`'s Forest-
  travel/Continue-restoration flow updated to open the new Journey Planner modal / check the new
  `.location-strip` markup instead of the removed always-visible destination grid and forest-location
  heading). Verified in a real headless-Chromium browser: `document.documentElement.scrollHeight ===
  clientHeight` (zero scroll) confirmed at phone-landscape (844x390), tablet-landscape (1180x820), and
  laptop (1400x900) for all three screens; portrait mobile (390x844) confirmed to still work via the
  scrollable fallback; every panel modal opens/closes with focus correctly restored to its trigger button
  (via the existing `useModalFocus` restore-on-close behavior, no extra wiring needed); photographing an
  animal through the new Camera modal correctly stacks the PhotoReveal modal on top; zero failed network
  requests throughout.
- **Amendment (2026-07-25, same day):** user feedback after using it - the `.action-bar` sidebar (12.5rem
  wide, full-height text-labeled buttons) was itself still "awkward" and took too much screen space; asked
  for the map to take the full screen, and for a location's clue to get its own separate button (a
  magnifying glass) instead of being folded into the Quest panel.
  - `.action-bar` changed from a fixed-width sidebar (a flex sibling of the map, stealing its width) to a
    compact floating column of icon-only round buttons (`position: absolute`, no visible text - accessible
    name via `aria-label`) overlaid on top of the map/content area itself. The map/grid now uses the full
    play-area width on every screen.
  - `LocationClues`'s clue-lookup logic (`getClue`) exported as `getLocationClue` so `ParkScreen` can check
    for a clue's presence and conditionally show a new 🔍 "Nearby clue" button, separate from 🐾 "Quest"
    (which now shows only the Lost Puppy quest steps, not clues).
  - **A real bug found while implementing this:** the action bar was first anchored to `.play-area` (the
    outer container spanning the location-strip *and* the map), so on narrower widths where the
    location-strip text wrapped to two lines, the floating icons overlapped the second line. Fixed by
    nesting `.action-bar` as a child of the specific map/content element instead (`.park-map` on Park,
    a new `.forest-stage` wrapper on Forest, `.camper-interior-wrap` on Camper) - each already fills the
    remaining flex space and is the correct positioning root, so the icons only ever overlay the
    map/content itself, never the location strip or message box above/below it.
  - Verified again after the fix: zero scroll at phone-landscape/tablet/laptop on all three screens, the
    location-strip text no longer clipped under the icons at narrow widths, the clue button opens only its
    own content (no longer merged with the quest steps), and the quest modal no longer includes the clue.
