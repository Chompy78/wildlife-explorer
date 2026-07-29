import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CameraPanel } from './CameraPanel';
import { createDefaultSave } from '../state/saveGame';
import type { Animal } from '../types/Animal';

const duck: Animal = {
  id: 'duck', name: 'Duck', rarity: 'common', habitat: 'Duck Pond', activeTime: 'Day',
  funFact: 'Ducks have waterproof feathers.', behaviours: ['swimming'], emoji: '🦆', availableInMilestone: true,
  photoDifficulty: 'medium', // 1600ms cycle, 0.28 max width - on a fresh save, rising window ~361-439ms
};

const butterfly: Animal = {
  id: 'butterfly', name: 'Butterfly', rarity: 'common', habitat: 'Open Meadow', activeTime: 'Sunny day',
  funFact: 'Butterflies taste with their feet.', behaviours: ['flying'], emoji: '🦋', availableInMilestone: true,
  photoDifficulty: 'hard', // 1100ms cycle, 0.16 max width - on a fresh save, rising window ~260-290ms
};

const rareOwl: Animal = {
  id: 'rare-owl', name: 'Rare Owl', rarity: 'rare', habitat: 'Strange Old Tree', activeTime: 'Evening',
  funFact: 'Owls fly silently.', behaviours: ['watching'], emoji: '🦉', availableInMilestone: true,
  photoDifficulty: 'hard', // eased to medium's tuning for Animal Researcher
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
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0); // deterministic: every animal's sweep starts at the same phase
  });
  afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

  it('shows a hint and is always shootable - no wandering, no waiting, never disabled', () => {
    const onPhotographAnimal = vi.fn();
    render(<CameraPanel animalsHere={[duck]} saveData={createDefaultSave()} onPhotographAnimal={onPhotographAnimal} />);
    expect(screen.getByText(/glowing zone/i)).toBeInTheDocument();
    const button = screen.getByRole('button', { name: /Photograph Duck/i });
    expect(button).not.toBeDisabled();
    fireEvent.click(button);
    expect(onPhotographAnimal).toHaveBeenCalledWith('duck', expect.any(Boolean));
  });

  it('marks the shot a "great shot" only while the marker is inside the sweet spot, never blocking the photo either way', () => {
    const onPhotographAnimal = vi.fn();
    render(<CameraPanel animalsHere={[duck]} saveData={createDefaultSave()} onPhotographAnimal={onPhotographAnimal} />);
    const button = () => screen.getByRole('button', { name: /Photograph Duck/i });

    // t=0: marker at position 0, well outside the fresh-save (narrow) sweet spot.
    fireEvent.click(button());
    expect(onPhotographAnimal).toHaveBeenLastCalledWith('duck', false);
    expect(button()).not.toHaveClass('pulse');

    // t=400ms: within the rising sweet-spot window (~361-439ms for duck's fresh, narrow band).
    act(() => { vi.advanceTimersByTime(400); });
    expect(button()).toHaveClass('pulse');
    fireEvent.click(button());
    expect(onPhotographAnimal).toHaveBeenLastCalledWith('duck', true);
  });

  it('shows a message and no photograph buttons when no animals are here', () => {
    render(<CameraPanel animalsHere={[]} saveData={createDefaultSave()} onPhotographAnimal={vi.fn()} />);
    expect(screen.getByText(/no common animals are ready/i)).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('paces the sweet-spot window per animal by photoDifficulty - a hard animal reaches (and leaves) it sooner than a medium one', () => {
    render(<CameraPanel animalsHere={[duck, butterfly]} saveData={createDefaultSave()} onPhotographAnimal={vi.fn()} />);

    // t=260ms (a tick boundary): butterfly (hard, fresh window ~260-290ms) is in its sweet spot; duck
    // (medium, needs ~361ms+) isn't yet.
    act(() => { vi.advanceTimersByTime(260); });
    expect(screen.getByRole('button', { name: /Photograph Butterfly/i })).toHaveClass('pulse');
    expect(screen.getByRole('button', { name: /Photograph Duck/i })).not.toHaveClass('pulse');

    // t=400ms: duck has now entered its window; butterfly's narrower/faster window has already closed.
    act(() => { vi.advanceTimersByTime(140); });
    expect(screen.getByRole('button', { name: /Photograph Duck/i })).toHaveClass('pulse');
    expect(screen.getByRole('button', { name: /Photograph Butterfly/i })).not.toHaveClass('pulse');
  });

  it("Animal Researcher eases a rare animal's difficulty one tier (hard -> medium), unaffected for other roles", () => {
    const researcherSave = { ...createDefaultSave(), selectedRole: 'animal-researcher' };
    render(<CameraPanel animalsHere={[rareOwl]} saveData={researcherSave} onPhotographAnimal={vi.fn()} />);

    // Medium's fresh window opens ~361ms - hard's would still be closed by then (hard's window is ~260-290ms).
    act(() => { vi.advanceTimersByTime(400); });
    expect(screen.getByRole('button', { name: /Rare Owl/i })).toHaveClass('pulse');
  });

  it('a non-Animal-Researcher role leaves a rare animal at its normal (harder, faster) difficulty', () => {
    const otherSave = { ...createDefaultSave(), selectedRole: 'zoologist' };
    render(<CameraPanel animalsHere={[rareOwl]} saveData={otherSave} onPhotographAnimal={vi.fn()} />);

    // Hard's fresh rising window is ~260-290ms - by 340ms it's already closed again (unlike the eased medium tier).
    act(() => { vi.advanceTimersByTime(340); });
    expect(screen.getByRole('button', { name: /Rare Owl/i })).not.toHaveClass('pulse');
  });

  it('the sweet spot widens with practice on that specific species - a tap that would miss on a fresh save now lands', () => {
    // t=300ms is outside duck's fresh (narrow) window (~361-439ms) - but with a full 5-photo collection
    // of this species (the real achievable ceiling - the camera disables further shooting past this),
    // the band has grown to its full tier width (~288-512ms) and now covers this moment too.
    const practicedSave = { ...createDefaultSave(), photographCounts: { duck: 5 } };
    render(<CameraPanel animalsHere={[duck]} saveData={practicedSave} onPhotographAnimal={vi.fn()} />);
    act(() => { vi.advanceTimersByTime(300); });
    expect(screen.getByRole('button', { name: /Photograph Duck/i })).toHaveClass('pulse');
  });

  it('total photos across every animal give a smaller, separate widening bonus even on a brand-new species', () => {
    // t=360ms sits just outside a truly fresh (0 total, 0 species) band (~361-439ms) - but a veteran
    // photographer's (60 total shots elsewhere) global bonus widens even a never-before-seen species'
    // band enough (~344-456ms) to cover this moment too.
    const veteranSave = { ...createDefaultSave(), photographCounts: { frog: 60 } };
    render(<CameraPanel animalsHere={[duck]} saveData={veteranSave} onPhotographAnimal={vi.fn()} />);
    act(() => { vi.advanceTimersByTime(360); });
    expect(screen.getByRole('button', { name: /Photograph Duck/i })).toHaveClass('pulse');
  });

  it('renders a moving focus track under normal motion', () => {
    const { container } = render(<CameraPanel animalsHere={[duck]} saveData={createDefaultSave()} onPhotographAnimal={vi.fn()} />);
    expect(container.querySelector('.focus-track')).toBeInTheDocument();
    expect(container.querySelector('.focus-marker')).toBeInTheDocument();
  });

  it('reduced motion shows no moving track, but still cycles the Great Shot window on a calm on/off glow', () => {
    mockReducedMotion(true);
    const { container } = render(<CameraPanel animalsHere={[duck]} saveData={createDefaultSave()} onPhotographAnimal={vi.fn()} />);
    const button = () => screen.getByRole('button', { name: /Photograph Duck/i });
    expect(container.querySelector('.focus-track')).not.toBeInTheDocument();
    expect(button()).not.toBeDisabled();

    // Duck's fresh (narrow) band means a short "on" phase (~157ms) after a long "off" phase (~1443ms).
    expect(button()).not.toHaveClass('pulse');
    act(() => { vi.advanceTimersByTime(1500); });
    expect(button()).toHaveClass('pulse');
  });
});
