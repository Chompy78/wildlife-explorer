// How good a shutter tap was. Purely for feedback and fun - every rating still takes the photo, so the
// Canon's "no harsh failure" holds. 'great' matches the existing Great Shot sweet spot.
export type ShotRating = 'perfect' | 'great' | 'nice';

// The middle fifth of the sweet spot counts as a bullseye.
const PERFECT_FRACTION = 0.2;

export function rateShot(position: number, sweetSpotWidth: number): ShotRating {
  const distance = Math.abs(position - 0.5);
  if (distance <= (sweetSpotWidth * PERFECT_FRACTION) / 2) return 'perfect';
  return distance <= sweetSpotWidth / 2 ? 'great' : 'nice';
}

// Consecutive Great (or Perfect) shots. A plain shot just starts the count over - nothing is lost.
export function nextStreak(streak: number, rating: ShotRating): number {
  return rating === 'nice' ? 0 : streak + 1;
}

export function shotMessage(rating: ShotRating, streak: number): string {
  if (rating === 'nice') return 'Nice shot! Tap while the marker is in the glowing zone for a Great Shot.';
  const base = rating === 'perfect' ? '✨ Perfect shot!' : 'Great shot!';
  return streak >= 2 ? `${base} 🔥 ${streak} in a row!` : base;
}

// Zoom is an optional challenge dial: closer shots swing faster through a smaller glowing zone, and pay
// more points. It only changes the Camera panel's timing and the on-screen score - never the photo you
// get or the collection - and Wide is always the relaxed default.
export type ZoomLevel = 'wide' | 'close' | 'macro';
export type ZoomTuning = { label: string; icon: string; speed: number; width: number; multiplier: number; blurb: string };

export const ZOOMS: Record<ZoomLevel, ZoomTuning> = {
  wide: { label: 'Wide', icon: '🔭', speed: 1, width: 1, multiplier: 1, blurb: 'Relaxed. The whole scene.' },
  close: { label: 'Close', icon: '📷', speed: 0.8, width: 0.8, multiplier: 1.5, blurb: 'A little quicker. 1.5x points.' },
  macro: { label: 'Macro', icon: '🔬', speed: 0.6, width: 0.65, multiplier: 2, blurb: 'Fast and fine. 2x points.' },
};
export const ZOOM_LEVELS: ZoomLevel[] = ['wide', 'close', 'macro'];

const BASE_POINTS: Record<ShotRating, number> = { nice: 10, great: 50, perfect: 100 };

export function shotPoints(rating: ShotRating, zoom: ZoomLevel): number {
  return Math.round(BASE_POINTS[rating] * ZOOMS[zoom].multiplier);
}
