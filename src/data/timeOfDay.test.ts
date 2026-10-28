import { describe, expect, it } from 'vitest';
import { isActiveAt } from './timeOfDay';

describe('isActiveAt', () => {
  it('matches free-text activeTime against each mood', () => {
    expect(isActiveAt({ activeTime: 'Morning and late afternoon' }, 'day')).toBe(true);
    expect(isActiveAt({ activeTime: 'Evening' }, 'dusk')).toBe(true);
    expect(isActiveAt({ activeTime: 'Evening' }, 'day')).toBe(false);
    expect(isActiveAt({ activeTime: 'Day and evening' }, 'dusk')).toBe(true);
    expect(isActiveAt({ activeTime: 'Day' }, 'night')).toBe(false);
  });
});
