import type { AnimalId } from '../types/Ids';

// Animals with collectible photo variants, and how many each has. Absent/0 means the animal has no
// photo art yet (falls back to its emoji everywhere) - e.g. the non-native animals, which were added
// after this art was generated.
//
// lost-puppy is 'quest' rarity, so it never goes through photographAnimal()/photographForestAnimal() -
// its single variant is awarded directly by completeLostPuppyQuest() (questState.ts) as a reunion
// keepsake, not picked via the camera flow.
const PHOTO_VARIANT_COUNTS: Partial<Record<AnimalId, number>> = {
  duck: 5, frog: 5, butterfly: 5, rabbit: 5, lizard: 5, 'park-bird': 5, 'rare-owl': 5,
  'forest-wren': 5, 'forest-wallaby': 5, 'forest-beetle': 5, 'lost-puppy': 5,
};

export function getPhotoVariantCount(id: AnimalId): number {
  return PHOTO_VARIANT_COUNTS[id] ?? 0;
}

export function getPhotoVariantUrl(id: AnimalId, variant: number): string {
  return `/assets/animals/${id}-${variant}.jpg`;
}

export function getPhotoVariantUrlFromKey(key: string): string {
  return `/assets/animals/${key}.jpg`;
}

export function countCollectedVariants(id: AnimalId, collected: string[]): number {
  const count = getPhotoVariantCount(id);
  let found = 0;
  for (let i = 1; i <= count; i++) if (collected.includes(`${id}-${i}`)) found += 1;
  return found;
}

export function isCollectionComplete(id: AnimalId, collected: string[]): boolean {
  const count = getPhotoVariantCount(id);
  return count > 0 && countCollectedVariants(id, collected) >= count;
}

// Lowest-numbered collected variant, for a representative Journal thumbnail. Null if none collected yet.
export function getFirstCollectedVariant(id: AnimalId, collected: string[]): number | null {
  const count = getPhotoVariantCount(id);
  for (let i = 1; i <= count; i++) if (collected.includes(`${id}-${i}`)) return i;
  return null;
}

// Picks a random variant the player doesn't already have. Returns null if the animal has no photo art,
// or every variant is already collected (duplicates are never handed out).
export function pickRandomUncollectedVariant(id: AnimalId, collected: string[]): number | null {
  const count = getPhotoVariantCount(id);
  const uncollected: number[] = [];
  for (let i = 1; i <= count; i++) if (!collected.includes(`${id}-${i}`)) uncollected.push(i);
  if (uncollected.length === 0) return null;
  return uncollected[Math.floor(Math.random() * uncollected.length)];
}

export const ALL_PHOTO_VARIANT_KEYS: string[] = Object.entries(PHOTO_VARIANT_COUNTS).flatMap(
  ([id, count]) => Array.from({ length: count ?? 0 }, (_, i) => `${id}-${i + 1}`)
);
