import type { Animal, PhotoDifficulty } from '../types/Animal';

// Each of the 6 explorer roles (src/data/roles.ts) gives one small, roughly-equal bonus tied to an
// existing mechanic - never a competitive/combat edge, per AI.md's Canon. Centralized here so every
// consuming component (CameraPanel, ParkScreen/ForestScreen, Journal, PhotoAlbum) checks eligibility
// the same way instead of re-deriving role/rarity logic in each place.

// Conservation Ranger doubles facts for common animals; Animal Researcher doubles them for rare animals
// (and gets an easier photo difficulty on them too) - deliberately split so neither role overlaps.
export function unlocksBonusFacts(selectedRole: string | null, animal: Animal): boolean {
  if (selectedRole === 'conservation-ranger') return animal.rarity === 'common';
  if (selectedRole === 'animal-researcher') return animal.rarity === 'rare';
  return false;
}

export function getsEasierPhotoDifficulty(selectedRole: string | null, animal: Animal): boolean {
  return selectedRole === 'animal-researcher' && animal.rarity === 'rare';
}

const EASIER_TIER: Record<PhotoDifficulty, PhotoDifficulty> = { hard: 'medium', medium: 'easy', easy: 'easy' };

export function effectivePhotoDifficulty(selectedRole: string | null, animal: Animal): PhotoDifficulty {
  return getsEasierPhotoDifficulty(selectedRole, animal) ? EASIER_TIER[animal.photoDifficulty] : animal.photoDifficulty;
}

// Zoologist sees a bonus fact (the animal's existing funFact) right on the very first photo of a
// species, ahead of the normal fact-per-variant schedule - no new content needed, funFact already exists.
export function getsBonusFirstPhotoFact(selectedRole: string | null): boolean {
  return selectedRole === 'zoologist';
}

// Explorer sees a still-locked location's real icon instead of a generic padlock - cosmetic only,
// doesn't change actual unlock conditions or timing.
export function seesLockedLocationPreview(selectedRole: string | null): boolean {
  return selectedRole === 'explorer';
}

// Wildlife Photographer gets a bonus 6th photo slot shown in the album as "coming soon" - the art for
// it doesn't exist yet (see docs/copilot-packages/05-bonus-photo-variants.md), so this never actually
// unlocks yet. Deliberately not wired into getPhotoVariantCount/isCollectionComplete/collection logic -
// purely a visual preview slot, so no broken image loads and no change to what "collection complete"
// means until real art lands.
export function getsBonusPhotoSlot(selectedRole: string | null): boolean {
  return selectedRole === 'wildlife-photographer';
}
