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

function mockReducedMotion(matches: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList);
}

describe('CameraPanel', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

  it('shows a hint and always allows photographing regardless of the pulse, once the animal is in frame', () => {
    mockReducedMotion(true); // Photo Mode's wandering gate isn't what this test is about.
    const onPhotographAnimal = vi.fn();
    render(<CameraPanel animalsHere={[duck]} saveData={createDefaultSave()} onPhotographAnimal={onPhotographAnimal} />);
    expect(screen.getByText(/calm glow/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Photograph Duck/i }));
    expect(onPhotographAnimal).toHaveBeenCalledWith('duck', expect.any(Boolean));
  });

  it('marks the shot as a "great shot" only while the pulse is active, never blocking the photo either way', () => {
    mockReducedMotion(true); // Photo Mode's wandering gate isn't what this test is about.
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

  it('starts off-frame (disabled, no miss) until the animal wanders into view, then is shootable', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // deterministic: 0 initial delay, minimum durations
    render(<CameraPanel animalsHere={[duck]} saveData={createDefaultSave()} onPhotographAnimal={vi.fn()} />);

    // Before the staggered entrance timer fires, the animal hasn't wandered in yet - disabled, not a fail.
    const button = () => screen.getByRole('button', { name: /Duck/i });
    expect(button()).toBeDisabled();
    expect(button()).toHaveTextContent(/wandered off/i);

    // Flush the (0ms, since Math.random is mocked to 0) entrance timer.
    act(() => { vi.advanceTimersByTime(0); });
    expect(button()).not.toBeDisabled();
    expect(button()).toHaveTextContent(/Photograph Duck/i);

    // Advance past the in-frame window - it wanders off again.
    act(() => { vi.advanceTimersByTime(2600); });
    expect(button()).toBeDisabled();
  });

  it('reduced motion skips the wandering gate entirely - every animal stays shootable, matching pre-Photo-Mode behavior', () => {
    mockReducedMotion(true);
    render(<CameraPanel animalsHere={[duck]} saveData={createDefaultSave()} onPhotographAnimal={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Photograph Duck/i })).not.toBeDisabled();
  });
});
