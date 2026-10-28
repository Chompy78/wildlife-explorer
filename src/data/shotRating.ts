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
