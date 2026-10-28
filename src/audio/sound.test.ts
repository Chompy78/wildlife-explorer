import { beforeEach, describe, expect, it } from 'vitest';
import { isSoundMuted, playGreatShot, playNewPhoto, playShutter, setSoundMuted, startAmbient, stopAmbient, subscribeSoundMuted } from './sound';

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

  it('ambient start/stop is safe without Web Audio, and mute changes notify subscribers', () => {
    expect(() => { startAmbient('lake'); stopAmbient('lake'); startAmbient('mountains'); stopAmbient(); }).not.toThrow();
    let calls = 0;
    const unsubscribe = subscribeSoundMuted(() => { calls += 1; });
    setSoundMuted(true);
    setSoundMuted(false);
    unsubscribe();
    setSoundMuted(true);
    expect(calls).toBe(2);
  });
});
