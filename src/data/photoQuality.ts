import type { CSSProperties } from 'react';

// Photos of a species visibly sharpen as the player photographs it more (saveData.photographCounts) -
// this is the "floor" quality, independent of which random variant was picked. On top of that floor,
// this specific shot's timing (did it land during the Camera panel's Great Shot glow?) nudges the
// displayed tier one step sharper (hit) or one step blurrier (missed), clamped to the tier range - so
// timing matters and is worth retrying, without a single missed glow ever undoing all of a species'
// practice progress. Always encouraging in tone (AI.md's "no harsh failure") - never call an early or
// blurrier photo "bad" or "poor quality" in visible copy.
const TIERS = [
  { blurPx: 3, scale: 1.12, label: 'First shot - keep practicing!' },
  { blurPx: 1.6, scale: 1.06, label: 'Getting steadier!' },
  { blurPx: 0.6, scale: 1.02, label: 'Nice and clear!' },
  { blurPx: 0, scale: 1, label: 'Crisp and sharp!' },
] as const;

const TIER_MIN_COUNTS = [0, 2, 3, 4] as const;

function getFloorTierIndex(count: number): number {
  let index = 0;
  TIER_MIN_COUNTS.forEach((minCount, i) => { if (count >= minCount) index = i; });
  return index;
}

function getTierIndex(count: number, greatShot?: boolean): number {
  const floor = getFloorTierIndex(count);
  if (greatShot === true) return Math.min(floor + 1, TIERS.length - 1);
  if (greatShot === false) return Math.max(floor - 1, 0);
  return floor;
}

export function getPhotoQualityStyle(count: number, greatShot?: boolean): CSSProperties {
  const tier = TIERS[getTierIndex(count, greatShot)];
  return {
    filter: tier.blurPx > 0 ? `blur(${tier.blurPx}px)` : 'none',
    transform: tier.scale > 1 ? `scale(${tier.scale})` : 'none',
  };
}

export function getPhotoQualityLabel(count: number, greatShot?: boolean): string {
  return TIERS[getTierIndex(count, greatShot)].label;
}
