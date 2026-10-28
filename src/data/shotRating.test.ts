import { describe, expect, it } from 'vitest';
import { nextStreak, rateShot, shotMessage } from './shotRating';

describe('shot rating', () => {
  it('rates the middle of the sweet spot perfect, the rest of it great, and anything else nice', () => {
    expect(rateShot(0.5, 0.3)).toBe('perfect');
    expect(rateShot(0.55, 0.3)).toBe('great');
    expect(rateShot(0.2, 0.3)).toBe('nice');
    expect(rateShot(0, 0.3)).toBe('nice');
  });

  it('counts a streak of great shots and quietly restarts after a plain one', () => {
    expect(nextStreak(0, 'great')).toBe(1);
    expect(nextStreak(2, 'perfect')).toBe(3);
    expect(nextStreak(5, 'nice')).toBe(0);
  });

  it('only mentions the streak from two in a row and never uses harsh wording', () => {
    expect(shotMessage('great', 1)).toBe('Great shot!');
    expect(shotMessage('perfect', 3)).toContain('3 in a row');
    expect(shotMessage('nice', 0)).not.toMatch(/miss|fail|wrong/i);
  });
});
