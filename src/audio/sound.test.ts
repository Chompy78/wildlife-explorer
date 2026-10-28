import { beforeEach, describe, expect, it } from 'vitest';
import { isSoundMuted, playGreatShot, playNewPhoto, playShutter, setSoundMuted } from './sound';

describe('sound', () => {
  beforeEach(() => window.localStorage.clear());

  it('defaults to sound on, and remembers the mute choice', () => {
    expect(isSoundMuted()).toBe(false);
    setSoundMuted(true);
    expect(isSoundMuted()).toBe(true);
    setSoundMuted(false);
    expect(isSoundMuted()).toBe(false);
  });

  it('never throws where Web Audio is unavailable or muted', () => {
    expect(() => { playShutter(); playGreatShot(); playNewPhoto(); }).not.toThrow();
    setSoundMuted(true);
    expect(() => playShutter()).not.toThrow();
  });
});
