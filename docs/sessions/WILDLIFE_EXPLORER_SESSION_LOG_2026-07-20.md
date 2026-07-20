# Wildlife Explorer — Session Log

**Session date:** 19–20 July 2026  
**User:** John Chow  
**Current verified release:** Milestone 4.1 (`wildlife-explorer-milestone-4-1@0.4.1`)  
**Project folder:** `C:\Users\user\dev\wildlife-exp-copilot\wildlife_explorer_milestone_4`

## AI Quick Summary

This session recovered the Wildlife Explorer source from a Base64 transfer, fixed broken emoji/mojibake encoding, reviewed and improved the codebase, implemented Milestones 3.2, 4.0, and 4.1, added automated tests and accessibility improvements, verified the project on Windows, and created a portable restart pack.

The final Windows verification passed:

```text
TypeScript: passed
Test files: 6 passed
Tests: 16 passed
Production build: passed
Modules transformed: 47
Encoding audit: passed
```

The final portable restart package was regenerated using `tar.exe`, and its ZIP entries were confirmed to use forward-slash paths such as `./src/`, making the package suitable for Linux and Windows extraction.

## Canon and Scope Preserved

- Wildlife observation and photography remain calm and child-friendly.
- No combat, catching, collecting, harming, or killing animals.
- Lost Puppy is helped and reunited, never collected.
- No harsh failure states.
- Tutorial Park is playable.
- The Wild Camper is a playable planning hub.
- Forest, Mountains, Lake, Safari, Rainforest, and Alien Planet remain preview-only in Milestone 4.1.
- Forest travel is deliberately not enabled yet.

## 1. Source Recovery and Encoding Repair

### Initial transfer problem

The original project ZIP could not be uploaded directly, so a source-only ZIP was created and converted to Base64. Several early PowerShell commands were malformed, including broken `certutil`, hash, here-string, and `[Convert]` commands. The working Base64 process was eventually reduced to three separate commands:

```powershell
$bytes = [System.IO.File]::ReadAllBytes((Resolve-Path ".\wildlife_codebase.zip").Path)
$base64 = [System.Convert]::ToBase64String($bytes)
[System.IO.File]::WriteAllText((Join-Path $PWD "CODEBASE_BASE64.txt"), $base64, [System.Text.Encoding]::ASCII)
```

The small source ZIP was expected because it excluded generated dependencies and build output:

```text
node_modules\
dist\
```

### Encoding repair completed

The recovered source contained mojibake such as:

```text
ðŸ¦†
ðŸŒ¿
â€”
â¬œ
```

The codebase was normalised to UTF-8 without BOM and emoji/icon values were made encoding-safe. Representative repaired icons included:

```text
Duck, frog, butterfly, rabbit, lizard, bird
Rare Owl, Lost Puppy
Park plants and locations
Lock, checkbox, Wild Camper
```

Milestone 3.1 was packaged as the encoding-fixed baseline.

## 2. Milestone 3.2 — Tutorial Park Polish and Reliability

Milestone 3.2 was implemented as a quality pass before expanding the game.

### Architecture improvements

The growing `gameState.ts` responsibilities were split into focused modules:

```text
animalState.ts
locationState.ts
questState.ts
progressionState.ts
saveDefaults.ts
saveMigration.ts
stateUtils.ts
```

`gameState.ts` remained as a compatibility export point plus tutorial-progress helpers.

### Save-system improvements

- Added explicit save schema versioning.
- Added legacy save normalisation.
- Preserved older save keys.
- Added typed animal and location identifiers.
- Added validation and safe defaults for malformed save data.

### Gameplay and interface improvements

- Added environmental clue cards for Lost Puppy, Rare Owl, and Whisper Grove progression.
- Added a Wild Camper unlock celebration.
- Added journal keyboard focus behaviour.
- Added Escape-to-close support.
- Added focus restoration to the Journal opener.
- Added polite ARIA live status messages.
- Added visible keyboard focus styling.

### Tests added

Tests covered:

- Lost Puppy sequence and skipped-step blocking.
- Rare Owl spotting and photography gating.
- Whisper Grove discovery gating.
- Wild Camper unlock conditions.
- Legacy and malformed save migration.

## 3. Milestone 4.0 — Wild Camper Hub

Milestone 4 added the first playable Wild Camper hub after Tutorial Park completion.

### Player flow

```text
Complete Tutorial Park
→ Unlock Wild Camper
→ Enter Wild Camper
→ Inspect camper stations
→ Preview destinations
→ Pin one destination to the route map
→ Return to Tutorial Park or Home
```

### Camper stations

```text
Route Map
Field Desk
Gear Rack
Photo Wall
```

### Destination previews

```text
Forest
Mountains
Lake
Safari
Rainforest
Alien Planet
```

All destination cards remained explicitly marked **Preview only**.

### Save schema version 3

Added persisted fields:

```text
camperVisited
selectedDestination
lastPlayArea
```

Continue behaviour restores the last valid play area. Locked-camper states are normalised back to Tutorial Park.

### Encoding correction

An inherited double-escaped Unicode issue was fixed so the interface renders actual icons instead of strings such as:

```text
\uD83D\uDE90
```

## 4. Milestone 4.1 — Wild Camper Polish

Milestone 4.1 was planned as a strict polish and quality release rather than a feature expansion.

### Player-facing improvements

- Friendly destination names and icons replaced raw storage IDs.
- Added a first-visit Wild Camper introduction.
- Added an Expedition Readiness panel.
- Added clear selected-state text for destination previews.
- Added destination clearing.
- Added live announcements for station and destination changes.
- Added a Photo Wall discovery summary.
- Integrated the camper visual direction image as presentation-layer artwork.
- Added responsive and reduced-motion styling.

### Accessibility improvements

A reusable modal focus hook was added to:

- Focus the initial control.
- Trap Tab and Shift+Tab within a dialog.
- Close on Escape.
- Restore focus after the dialog closes.

The hook was applied to:

```text
Journal
Wild Camper unlock celebration
First-visit Camper Introduction
```

### Save schema version 4

Added:

```text
camperIntroductionSeen
```

Migration preserves Milestone 4 progress and rejects invalid camper-only state when the camper is locked.

### Testing improvements

Added React Testing Library, user-event, jest-dom, and jsdom tests for camper behaviour and modal interaction. The final project contains six passing test files and sixteen passing tests.

### Encoding regression protection

Added:

```text
scripts/check-encoding.mjs
```

The standard check command now performs:

```text
TypeScript checking
Automated state and component tests
Production build
Encoding audit
```

## 5. Milestone 4.1 Windows Installation

The upgrade package was applied to the Milestone 4 project using:

```powershell
powershell -ExecutionPolicy Bypass -File .\APPLY_MILESTONE_4_1.ps1
```

### Duplicate-test issue

The first check found duplicate tests inside:

```text
patch_files
backup_before_milestone_4_1_...
```

The backup was moved outside the project and the installer staging folder was removed. A typo was corrected from:

```powershell
-For*e
```

to:

```powershell
-Force
```

The final clean verification command was:

```powershell
npm run check
```

### Final verified output

```text
Test Files  6 passed (6)
Tests       16 passed (16)
47 modules transformed
Production build completed
Encoding audit passed
```

This established the local Milestone 4.1 folder as the current source of truth.

## 6. Restart-Pack Creation

The exact local restart pack was generated with:

```powershell
powershell -ExecutionPolicy Bypass -File .\MAKE_FULL_RESTART_PACK.ps1
```

The first restart package used Windows backslash entry names. On Linux, entries such as:

```text
src\components\ParkScreen.tsx
```

were extracted as literal filenames instead of real directories, causing TypeScript error `TS18003` because no real `src/` directory existed.

### Durable portability fix

A backup of the generator was created:

```powershell
Copy-Item .\MAKE_FULL_RESTART_PACK.ps1 .\MAKE_FULL_RESTART_PACK.backup.ps1 -Force
```

This line:

```powershell
Compress-Archive -Path (Join-Path $SourceStage '*') -DestinationPath $Zip -Force
```

was replaced with:

```powershell
tar.exe -a -c -f $Zip -C $SourceStage .
```

The final period is intentional and means archive everything inside `$SourceStage`.

The corrected restart pack was regenerated. Its ZIP entries were verified with:

```powershell
tar.exe -tf .\WILDLIFE_EXPLORER_FULL_RESTART\wildlife_explorer_current_source.zip | Select-Object -First 15
```

Verified portable output began with:

```text
./
./.gitignore
./AI.md
./APPLY_MILESTONE_4_1.ps1
./CHECKSUMS.sha256
./CURRENT_CODE_REVIEW.md
./IMPORTANT.txt
./index.html
./MAKE_FULL_RESTART_PACK.backup.ps1
./MAKE_FULL_RESTART_PACK.ps1
```

This confirms forward-slash archive paths suitable for Linux and Windows extraction.

## 7. Final Restart-Pack Files

The corrected restart folder is:

```text
C:\Users\user\dev\wildlife-exp-copilot\wildlife_explorer_milestone_4\WILDLIFE_EXPLORER_FULL_RESTART
```

Files generated at 2:32 PM on 20 July 2026:

```text
AI.md                                      2,544 bytes
CHECKSUMS.sha256                             104 bytes
CODEBASE_BASE64.txt                    3,855,736 bytes
FULL_PACK_MANIFEST.json                      703 bytes
RESTORE_CODEBASE.ps1                         771 bytes
START_HERE.md                                815 bytes
wildlife_explorer_current_source.zip   2,891,801 bytes
```

The corrected 2:32 PM files replace the earlier 11:31 AM restart files.

## 8. Starting a New AI Session

### Preferred upload when ZIP files are supported

```text
AI.md
wildlife_explorer_current_source.zip
FULL_PACK_MANIFEST.json
CHECKSUMS.sha256
```

Suggested prompt:

```text
Read AI.md first. Verify wildlife_explorer_current_source.zip using FULL_PACK_MANIFEST.json and CHECKSUMS.sha256, extract it, inspect the complete source, run npm install and npm run check, and continue from the verified Milestone 4.1 codebase. Treat project files as the source of truth and do not rebuild the project from memory.
```

### Text-only upload path

```text
AI.md
CODEBASE_BASE64.txt
FULL_PACK_MANIFEST.json
CHECKSUMS.sha256
```

Suggested prompt:

```text
Read AI.md first. Decode CODEBASE_BASE64.txt into the source ZIP, verify its SHA-256 using FULL_PACK_MANIFEST.json and CHECKSUMS.sha256, extract it, inspect the complete codebase, run npm install and npm run check, and continue from the verified Milestone 4.1 state. Treat project files as the source of truth.
```

## 9. Local Restoration

From inside `WILDLIFE_EXPLORER_FULL_RESTART`, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\RESTORE_CODEBASE.ps1
```

The restoration script decodes the Base64, verifies the SHA-256 checksum, and extracts the project into `RESTORED_CODEBASE`.

After restoration:

```powershell
cd .\RESTORED_CODEBASE
npm install
npm run check
npm run dev
```

## 10. Recommended Next Development Step

Milestone 5 should remain narrow:

```text
One Forest arrival location
One short trail
A small common-animal set
Wildlife Journal integration
Return to the Wild Camper
```

Explicitly defer:

```text
Full Forest biome
Complex quests
Rare animals
Companions
Inventory and crafting
Currency, shops, or economy
Other playable destinations
```

## 11. Current Source-of-Truth Status

- Local Milestone 4.1 project: verified.
- TypeScript: passed.
- Automated tests: 16 passed across 6 files.
- Production build: passed.
- Encoding audit: passed.
- Portable restart ZIP path structure: verified.
- Corrected restart pack: created.
- Next safe development target: narrow Milestone 5 Forest arrival shell.
