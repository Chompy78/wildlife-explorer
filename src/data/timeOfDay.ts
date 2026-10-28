import type { Animal } from '../types/Animal';

// Cosmetic only: the mood changes the Camera panel's backdrop and a "most active now" note. It never
// touches which photo variant you get or the Great Shot timing, so the "no duplicates, surprise reveal"
// collection design stays intact. Held in component state, not saved.
export type TimeOfDay = 'day' | 'dusk' | 'night';

export type TimeOfDayMood = { id: TimeOfDay; label: string; icon: string; description: string };

export const timeOfDayMoods: TimeOfDayMood[] = [
  { id: 'day', label: 'Day', icon: '☀️', description: 'Bright and warm. Most animals are out and about.' },
  { id: 'dusk', label: 'Dusk', icon: '🌅', description: 'Golden light as the day winds down.' },
  { id: 'night', label: 'Night', icon: '🌙', description: 'Quiet and dark. Only a few animals stay active.' },
];

const ACTIVE_PATTERNS: Record<TimeOfDay, RegExp> = {
  day: /day|morning|afternoon/i,
  dusk: /evening|dusk/i,
  night: /night/i,
};

// Matches the free-text Animal.activeTime (e.g. "Morning and late afternoon") against a mood.
export function isActiveAt(animal: Pick<Animal, 'activeTime'>, time: TimeOfDay): boolean {
  return ACTIVE_PATTERNS[time].test(animal.activeTime);
}

export function getMood(time: TimeOfDay): TimeOfDayMood {
  return timeOfDayMoods.find((mood) => mood.id === time)!;
}
