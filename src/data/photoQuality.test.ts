import { describe, expect, it } from 'vitest';
import { getPhotoQualityLabel, getPhotoQualityStyle } from './photoQuality';

describe('photoQuality', () => {
  it('is blurriest and scaled up on the very first photograph', () => {
    expect(getPhotoQualityStyle(1)).toEqual({ filter: 'blur(3px)', transform: 'scale(1.12)' });
    expect(getPhotoQualityLabel(1)).toBe('First shot - keep practicing!');
  });

  it('sharpens in stages as the practice count rises', () => {
    expect(getPhotoQualityStyle(2)).toEqual({ filter: 'blur(1.6px)', transform: 'scale(1.06)' });
    expect(getPhotoQualityStyle(3)).toEqual({ filter: 'blur(0.6px)', transform: 'scale(1.02)' });
  });

  it('is fully crisp from the 4th photograph onward, including far beyond it', () => {
    expect(getPhotoQualityStyle(4)).toEqual({ filter: 'none', transform: 'none' });
    expect(getPhotoQualityStyle(50)).toEqual({ filter: 'none', transform: 'none' });
    expect(getPhotoQualityLabel(4)).toBe('Crisp and sharp!');
  });

  it('never produces a discouraging label at any count', () => {
    for (const count of [0, 1, 2, 3, 4, 20]) {
      const label = getPhotoQualityLabel(count);
      expect(label.toLowerCase()).not.toMatch(/bad|poor|fail|miss/);
    }
  });
});
