import { describe, expect, it } from 'vitest';
import { getPhotoQualityLabel, getPhotoQualityStyle } from './photoQuality';

describe('photoQuality', () => {
  it('is blurry and scaled up when the shot was not a Great Shot', () => {
    expect(getPhotoQualityStyle(false)).toEqual({ filter: 'blur(3px)', transform: 'scale(1.12)' });
    expect(getPhotoQualityLabel(false)).toBe('Keep practicing - aim for the glowing zone!');
  });

  it('is fully crisp when the shot was a Great Shot', () => {
    expect(getPhotoQualityStyle(true)).toEqual({ filter: 'none', transform: 'none' });
    expect(getPhotoQualityLabel(true)).toBe('Crisp and sharp!');
  });

  it('omitting greatShot is treated the same as a miss (blurry, not crisp)', () => {
    expect(getPhotoQualityStyle()).toEqual({ filter: 'blur(3px)', transform: 'scale(1.12)' });
    expect(getPhotoQualityLabel()).toBe('Keep practicing - aim for the glowing zone!');
  });

  it('never produces a discouraging label either way', () => {
    for (const greatShot of [true, false, undefined]) {
      const label = getPhotoQualityLabel(greatShot);
      expect(label.toLowerCase()).not.toMatch(/bad|poor|fail|miss/);
    }
  });
});
