import { describe, expect, it } from 'vitest';
import { getFactCount, getFactForVariant, getFactForVariantKey, getLearnedFacts } from './animalFacts';

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
});
