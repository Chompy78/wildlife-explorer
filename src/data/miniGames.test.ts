import { describe, expect, it } from 'vitest';
import { animals } from './animals';
import { buildFindRound, buildHabitatRound, buildMemoryDeck, buildWhoAmIRound, gameAnimals, maskName, shuffle } from './miniGames';

// A small deterministic generator so the rounds are repeatable.
function seeded(seed: number) {
  let state = seed;
  return () => { state = (state * 1664525 + 1013904223) % 4294967296; return state / 4294967296; };
}

describe('mini game helpers', () => {
  it('shuffle keeps every item and does not change the input', () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(input, seeded(1));
    expect([...out].sort()).toEqual(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });

  it('never uses quest animals', () => {
    expect(gameAnimals().some((a) => a.rarity === 'quest')).toBe(false);
  });

  it('builds a memory deck of exact pairs', () => {
    const deck = buildMemoryDeck(6, seeded(2));
    expect(deck).toHaveLength(12);
    for (const card of deck) expect(deck.filter((c) => c.animalId === card.animalId)).toHaveLength(2);
    expect(new Set(deck.map((c) => c.key)).size).toBe(12);
  });

  it('masks the animal name and its last word in a clue', () => {
    expect(maskName('Ducks have waterproof feathers.', 'Duck')).toBe('??? have waterproof feathers.');
    expect(maskName('The Heron stands still.', 'Great Blue Heron')).toBe('The ??? stands still.');
  });

  it('who-am-i rounds contain the answer once among distinct choices and do not leak the name', () => {
    for (let seed = 1; seed <= 40; seed += 1) {
      const round = buildWhoAmIRound(seeded(seed));
      expect(round.choices).toContain(round.answer);
      expect(new Set(round.choices).size).toBe(round.choices.length);
      expect(round.choices.length).toBeGreaterThanOrEqual(2);
      expect(round.prompt.toLowerCase()).not.toContain(round.answer.toLowerCase());
    }
  });

  it('habitat rounds always include the true habitat', () => {
    for (let seed = 1; seed <= 40; seed += 1) {
      const round = buildHabitatRound(seeded(seed));
      expect(round.choices).toContain(round.animal.habitat);
      expect(new Set(round.choices).size).toBe(round.choices.length);
    }
  });

  it('find rounds hide exactly one target among decoys', () => {
    const round = buildFindRound(12, seeded(3));
    expect(round.tiles).toHaveLength(12);
    expect(round.tiles.filter((a) => a.id === round.target.id)).toHaveLength(1);
  });

  it('has enough animals for every game', () => {
    expect(animals.length).toBeGreaterThan(20);
  });
});
