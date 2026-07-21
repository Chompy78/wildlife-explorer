import { beforeEach, describe, expect, it } from 'vitest';
import { createDefaultSave, loadSave, SAVE_KEY } from './saveGame';

describe('loadSave with corrupted storage', () => {
  beforeEach(() => localStorage.clear());

  it('falls back to a default save when the stored value is not valid JSON at all', () => {
    localStorage.setItem(SAVE_KEY, 'this is not json {{{');
    expect(loadSave()).toEqual(createDefaultSave());
  });

  it('falls back to a default save when the stored value is valid JSON but not an object', () => {
    localStorage.setItem(SAVE_KEY, JSON.stringify('just a string'));
    expect(loadSave()).toEqual(createDefaultSave());
  });

  it('returns a default save when nothing is stored', () => {
    expect(loadSave()).toEqual(createDefaultSave());
  });
});
