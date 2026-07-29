import type { CSSProperties } from 'react';

// A photo is either a Great Shot (the tap landed inside the Camera panel's focus sweet spot) or not -
// there is no middle ground and no failure state, just encouraging "keep practicing" framing for a miss,
// per AI.md's Canon of "no harsh failure". How EASY the sweet spot is to hit (its width) is a separate,
// practice-driven concern that lives in CameraPanel.tsx's getSweetSpotWidth - this module only renders
// the visual consequence of the greatShot boolean it's given.
const BLURRY = { blurPx: 3, scale: 1.12, label: 'Keep practicing - aim for the glowing zone!' };
const CRISP = { blurPx: 0, scale: 1, label: 'Crisp and sharp!' };

export function getPhotoQualityStyle(greatShot?: boolean): CSSProperties {
  const tier = greatShot ? CRISP : BLURRY;
  return {
    filter: tier.blurPx > 0 ? `blur(${tier.blurPx}px)` : 'none',
    transform: tier.scale > 1 ? `scale(${tier.scale})` : 'none',
  };
}

export function getPhotoQualityLabel(greatShot?: boolean): string {
  return (greatShot ? CRISP : BLURRY).label;
}
