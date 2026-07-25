import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CameraPanel } from './CameraPanel';
import { createDefaultSave } from '../state/saveGame';
import type { Animal } from '../types/Animal';

const duck: Animal = {
  id: 'duck', name: 'Duck', rarity: 'common', habitat: 'Duck Pond', activeTime: 'Day',
  funFact: 'Ducks have waterproof feathers.', behaviours: ['swimming'], emoji: '🦆', availableInMilestone: true,
};

describe('CameraPanel', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('shows a hint about the calm-glow bonus and always allows photographing regardless of the pulse', () => {
    const onPhotographAnimal = vi.fn();
    render(<CameraPanel animalsHere={[duck]} saveData={createDefaultSave()} onPhotographAnimal={onPhotographAnimal} />);
    expect(screen.getByText(/calm glow/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Photograph Duck/i }));
    expect(onPhotographAnimal).toHaveBeenCalledWith('duck', expect.any(Boolean));
  });

  it('marks the shot as a "great shot" only while the pulse is active, never blocking the photo either way', () => {
    const onPhotographAnimal = vi.fn();
    render(<CameraPanel animalsHere={[duck]} saveData={createDefaultSave()} onPhotographAnimal={onPhotographAnimal} />);

    // Starts dim (not pulsing) - the mount effect fires loop(false) first.
    fireEvent.click(screen.getByRole('button', { name: /Photograph Duck/i }));
    expect(onPhotographAnimal).toHaveBeenLastCalledWith('duck', false);

    // Advance past the dim window (1500ms) into the bright pulse window.
    act(() => { vi.advanceTimersByTime(1600); });
    expect(screen.getByRole('button', { name: /Photograph Duck/i })).toHaveClass('pulse');
    fireEvent.click(screen.getByRole('button', { name: /Photograph Duck/i }));
    expect(onPhotographAnimal).toHaveBeenLastCalledWith('duck', true);
  });

  it('shows a message and no photograph buttons when no animals are here', () => {
    render(<CameraPanel animalsHere={[]} saveData={createDefaultSave()} onPhotographAnimal={vi.fn()} />);
    expect(screen.getByText(/no common animals are ready/i)).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
