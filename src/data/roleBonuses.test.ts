import { describe, expect, it } from 'vitest';
import {
  effectivePhotoDifficulty,
  getsBonusFirstPhotoFact,
  getsBonusPhotoSlot,
  getsEasierPhotoDifficulty,
  seesLockedLocationPreview,
  unlocksBonusFacts,
} from './roleBonuses';
import type { Animal } from '../types/Animal';

const commonAnimal: Animal = {
  id: 'duck', name: 'Duck', rarity: 'common', habitat: 'Duck Pond', activeTime: 'Day',
  funFact: 'Ducks have waterproof feathers.', behaviours: [], emoji: '🦆', availableInMilestone: true,
  photoDifficulty: 'hard',
};

const rareAnimal: Animal = {
  id: 'rare-owl', name: 'Rare Owl', rarity: 'rare', habitat: 'Strange Old Tree', activeTime: 'Evening',
  funFact: 'Owls fly silently.', behaviours: [], emoji: '🦉', availableInMilestone: true,
  photoDifficulty: 'hard',
};

describe('roleBonuses', () => {
  it('Conservation Ranger unlocks bonus facts for common animals, not rare ones', () => {
    expect(unlocksBonusFacts('conservation-ranger', commonAnimal)).toBe(true);
    expect(unlocksBonusFacts('conservation-ranger', rareAnimal)).toBe(false);
  });

  it('Animal Researcher unlocks bonus facts for rare animals, not common ones', () => {
    expect(unlocksBonusFacts('animal-researcher', rareAnimal)).toBe(true);
    expect(unlocksBonusFacts('animal-researcher', commonAnimal)).toBe(false);
  });

  it('no other role (or no role) unlocks bonus facts for either', () => {
    expect(unlocksBonusFacts('zoologist', commonAnimal)).toBe(false);
    expect(unlocksBonusFacts(null, rareAnimal)).toBe(false);
  });

  it('Animal Researcher gets an easier photo difficulty only on rare animals', () => {
    expect(getsEasierPhotoDifficulty('animal-researcher', rareAnimal)).toBe(true);
    expect(getsEasierPhotoDifficulty('animal-researcher', commonAnimal)).toBe(false);
    expect(getsEasierPhotoDifficulty('wildlife-photographer', rareAnimal)).toBe(false);
  });

  it('effectivePhotoDifficulty steps down one tier for Animal Researcher on a rare animal, unchanged otherwise', () => {
    expect(effectivePhotoDifficulty('animal-researcher', rareAnimal)).toBe('medium'); // hard -> medium
    expect(effectivePhotoDifficulty(null, rareAnimal)).toBe('hard');
    expect(effectivePhotoDifficulty('animal-researcher', commonAnimal)).toBe('hard'); // common, unaffected
  });

  it('easy stays easy when eased further (clamped, no tier below easy)', () => {
    const easyRare: Animal = { ...rareAnimal, photoDifficulty: 'easy' };
    expect(effectivePhotoDifficulty('animal-researcher', easyRare)).toBe('easy');
  });

  it('only Zoologist gets the bonus first-photo fact', () => {
    expect(getsBonusFirstPhotoFact('zoologist')).toBe(true);
    expect(getsBonusFirstPhotoFact('animal-researcher')).toBe(false);
    expect(getsBonusFirstPhotoFact(null)).toBe(false);
  });

  it('only Explorer sees a locked location\'s real icon early', () => {
    expect(seesLockedLocationPreview('explorer')).toBe(true);
    expect(seesLockedLocationPreview('conservation-ranger')).toBe(false);
  });

  it('only Wildlife Photographer gets the bonus photo slot', () => {
    expect(getsBonusPhotoSlot('wildlife-photographer')).toBe(true);
    expect(getsBonusPhotoSlot('zoologist')).toBe(false);
  });
});
