import { describe, expect, it } from 'vitest';
import {
  getBonusFactForVariant,
  getBonusFactForVariantKey,
  getFactCount,
  getFactForVariant,
  getFactForVariantKey,
  getLearnedFacts,
  getTotalFactCount,
  hasBonusFacts,
} from './animalFacts';

describe('animalFacts', () => {
  it('returns exactly 5 facts for an animal with photo art', () => {
    expect(getFactCount('duck')).toBe(5);
  });

  it('returns 0 for an animal with no photo art (and therefore no facts)', () => {
    expect(getFactCount('red-eared-slider')).toBe(0);
  });

  it('returns the matching fact for a given variant number', () => {
    const fact = getFactForVariant('duck', 2);
    expect(fact).toBe('Baby ducklings can swim within hours of hatching.');
  });

  it('returns null for an out-of-range variant or an animal with no facts', () => {
    expect(getFactForVariant('duck', 6)).toBeNull();
    expect(getFactForVariant('red-eared-slider', 1)).toBeNull();
  });

  it('derives the same fact from a "<id>-<variant>" key, regardless of hyphens in the id', () => {
    expect(getFactForVariantKey('duck', 'duck-2')).toBe(getFactForVariant('duck', 2));
    expect(getFactForVariantKey('forest-wallaby', 'forest-wallaby-3')).toBe(getFactForVariant('forest-wallaby', 3));
  });

  it('lists learned facts in variant order, matching collected photo variants', () => {
    expect(getLearnedFacts('duck', ['duck-3', 'duck-1'])).toEqual([getFactForVariant('duck', 1), getFactForVariant('duck', 3)]);
  });

  it('returns no facts learned when nothing is collected', () => {
    expect(getLearnedFacts('duck', [])).toEqual([]);
  });

  it('has bonus facts for animals with photo art, but not for lost-puppy (a one-off keepsake, no facts pool at all beyond the normal 5)', () => {
    expect(hasBonusFacts('duck')).toBe(true);
    expect(hasBonusFacts('rare-owl')).toBe(true);
    expect(hasBonusFacts('lost-puppy')).toBe(false);
  });

  it('returns the matching bonus fact for a given variant, distinct from the normal fact', () => {
    const bonus = getBonusFactForVariant('duck', 2);
    expect(bonus).not.toBeNull();
    expect(bonus).not.toBe(getFactForVariant('duck', 2));
  });

  it('derives the same bonus fact from a "<id>-<variant>" key', () => {
    expect(getBonusFactForVariantKey('duck', 'duck-2')).toBe(getBonusFactForVariant('duck', 2));
  });

  it('total fact count is 5 normally, doubles to 10 with includeBonus for an animal that has a bonus set', () => {
    expect(getTotalFactCount('duck')).toBe(5);
    expect(getTotalFactCount('duck', true)).toBe(10);
    expect(getTotalFactCount('lost-puppy', true)).toBe(5); // no bonus set authored for this one
  });

  it('getLearnedFacts pairs each collected variant with its bonus fact when includeBonus is true', () => {
    const learned = getLearnedFacts('duck', ['duck-1'], true);
    expect(learned).toEqual([getFactForVariant('duck', 1), getBonusFactForVariant('duck', 1)]);
  });
});
