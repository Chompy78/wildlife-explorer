import { animals } from './animals';
import type { Animal } from '../types/Animal';
import { isActiveAt, type TimeOfDay } from './timeOfDay';

// Pure helpers behind the Mini Games screen. Nothing here touches the save: mini games are calm, have no
// fail state, and award nothing, so the photo collection stays the only thing that grows.
export type Rng = () => number;

export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Quest animals (the Lost Puppy) are story characters, not wildlife, so they never appear in games.
export function gameAnimals(pool: readonly Animal[] = animals): Animal[] {
  return pool.filter((animal) => animal.rarity !== 'quest');
}

// Animals picked for a round never share an emoji (two different turtles would look identical on a card,
// a pad or a grid), so every round can be told apart by eye.
export function pickAnimals(count: number, rng: Rng = Math.random, pool: readonly Animal[] = animals): Animal[] {
  const seen = new Set<string>();
  const picked: Animal[] = [];
  for (const animal of shuffle(gameAnimals(pool), rng)) {
    if (seen.has(animal.emoji)) continue;
    seen.add(animal.emoji);
    picked.push(animal);
    if (picked.length === count) break;
  }
  return picked;
}

export type MemoryCard = { key: string; animalId: Animal['id']; emoji: string; name: string };

export function buildMemoryDeck(pairs: number, rng: Rng = Math.random, pool: readonly Animal[] = animals): MemoryCard[] {
  const chosen = pickAnimals(pairs, rng, pool);
  const cards = chosen.flatMap((animal) => [0, 1].map((copy) => ({ key: `${animal.id}-${copy}`, animalId: animal.id, emoji: animal.emoji, name: animal.name })));
  return shuffle(cards, rng);
}

// Hides the animal's name (and its last word, e.g. "Heron") in its fun fact so it works as a clue.
export function maskName(text: string, name: string): string {
  const words = name.split(/\s+/);
  const forms = [name, words[words.length - 1]].filter((form, i, all) => form.length > 2 && all.indexOf(form) === i);
  return forms.reduce((out, form) => out.replace(new RegExp(`${form.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(es|s)?`, 'gi'), '???'), text);
}

export type ChoiceRound = { prompt: string; answer: string; choices: string[]; animal: Animal };

function withDistractors(correct: string, others: string[], count: number, rng: Rng): string[] {
  const distractors = shuffle([...new Set(others)].filter((value) => value !== correct), rng).slice(0, count - 1);
  return shuffle([correct, ...distractors], rng);
}

export function buildWhoAmIRound(rng: Rng = Math.random, pool: readonly Animal[] = animals): ChoiceRound {
  const [animal, ...rest] = pickAnimals(4, rng, pool);
  return { animal, prompt: maskName(animal.funFact, animal.name), answer: animal.name, choices: withDistractors(animal.name, rest.map((a) => a.name), 4, rng) };
}

export function buildHabitatRound(rng: Rng = Math.random, pool: readonly Animal[] = animals): ChoiceRound {
  const candidates = gameAnimals(pool);
  const animal = candidates[Math.floor(rng() * candidates.length)];
  return { animal, prompt: `Where does the ${animal.name} live?`, answer: animal.habitat, choices: withDistractors(animal.habitat, candidates.map((a) => a.habitat), 3, rng) };
}

export type FindRound = { target: Animal; tiles: Animal[] };

// A grid of look-alike animals with exactly one target hidden among them.
export function buildFindRound(tileCount: number, rng: Rng = Math.random, pool: readonly Animal[] = animals): FindRound {
  const [target, decoy] = pickAnimals(2, rng, pool);
  const tiles = shuffle([target, ...Array.from({ length: tileCount - 1 }, () => decoy)], rng);
  return { target, tiles };
}

// Pattern Parade: a short run of animals to watch and then repeat. Four animals make the pad; the pattern
// is picked from them (repeats allowed), so the pad stays the same all game.
export type PatternRound = { pad: Animal[]; sequence: number[] };

export function buildPatternPad(rng: Rng = Math.random, pool: readonly Animal[] = animals): Animal[] {
  return pickAnimals(4, rng, pool);
}

export function extendPattern(sequence: readonly number[], padSize: number, rng: Rng = Math.random): number[] {
  return [...sequence, Math.floor(rng() * padSize)];
}

// Count Them Up: how many of one animal are hiding in a crowd of another?
export type CountRound = { target: Animal; tiles: Animal[]; answer: number; choices: number[] };

export function buildCountRound(rng: Rng = Math.random, pool: readonly Animal[] = animals): CountRound {
  const [target, decoy] = pickAnimals(2, rng, pool);
  const answer = 2 + Math.floor(rng() * 5); // 2 to 6
  const tiles = shuffle([...Array.from({ length: answer }, () => target), ...Array.from({ length: 12 - answer }, () => decoy)], rng);
  const choices = [...new Set([answer, answer - 1, answer + 1, answer + 2].filter((n) => n >= 1))].sort((a, b) => a - b).slice(0, 4);
  return { target, tiles, answer, choices };
}

// Day or Night?: only animals whose active time is clearly one of the three moods are used.
const MOODS: TimeOfDay[] = ['day', 'dusk', 'night'];
export function clearTimeOfDay(animal: Pick<Animal, 'activeTime'>): TimeOfDay | null {
  const matches = MOODS.filter((mood) => isActiveAt(animal, mood));
  return matches.length === 1 ? matches[0] : null;
}

export function buildTimeRound(rng: Rng = Math.random, pool: readonly Animal[] = animals): ChoiceRound {
  const candidates = gameAnimals(pool).filter((a) => clearTimeOfDay(a) !== null);
  const animal = candidates[Math.floor(rng() * candidates.length)];
  const answer = clearTimeOfDay(animal)!;
  const label = (mood: TimeOfDay) => ({ day: '☀️ Day', dusk: '🌅 Dusk', night: '🌙 Night' })[mood];
  return { animal, prompt: `When is the ${animal.name} most active?`, answer: label(answer), choices: MOODS.map(label) };
}
