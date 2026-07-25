import type { CSSProperties } from 'react';

// Photos of a species visibly sharpen as the player photographs it more (saveData.photographCounts),
// independent of which random variant was picked. Always encouraging in tone (AI.md's "no harsh
// failure") - never call an early photo "bad" or "poor quality" in visible copy.
const TIERS = [
  { minCount: 0, blurPx: 3, scale: 1.12, label: 'First shot - keep practicing!' },
  { minCount: 2, blurPx: 1.6, scale: 1.06, label: 'Getting steadier!' },
  { minCount: 3, blurPx: 0.6, scale: 1.02, label: 'Nice and clear!' },
  { minCount: 4, blurPx: 0, scale: 1, label: 'Crisp and sharp!' },
] as const;

function getTier(count: number): (typeof TIERS)[number] {
  let tier: (typeof TIERS)[number] = TIERS[0];
  for (const candidate of TIERS) if (count >= candidate.minCount) tier = candidate;
  return tier;
}

export function getPhotoQualityStyle(count: number): CSSProperties {
  const tier = getTier(count);
  return {
    filter: tier.blurPx > 0 ? `blur(${tier.blurPx}px)` : 'none',
    transform: tier.scale > 1 ? `scale(${tier.scale})` : 'none',
  };
}

export function getPhotoQualityLabel(count: number): string {
  return getTier(count).label;
}
