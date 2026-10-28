import { animals } from './animals';
import type { Animal } from '../types/Animal';

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

export function pickAnimals(count: number, rng: Rng = Math.random, pool: readonly Animal[] = animals): Animal[] {
  return shuffle(gameAnimals(pool), rng).slice(0, count);
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
