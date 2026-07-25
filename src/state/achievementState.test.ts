import { describe, expect, it } from 'vitest';
import { unlockAchievement } from './achievementState';
import { createDefaultSave } from './saveGame';

describe('unlockAchievement', () => {
  it('adds a new achievement', () => {
    const save = unlockAchievement(createDefaultSave(), 'tutorial-park-ranger');
    expect(save.achievements).toEqual(['tutorial-park-ranger']);
  });

  it('never adds the same achievement twice', () => {
    let save = createDefaultSave();
    save = unlockAchievement(save, 'tutorial-park-ranger');
    save = unlockAchievement(save, 'tutorial-park-ranger');
    expect(save.achievements).toEqual(['tutorial-park-ranger']);
  });
});
