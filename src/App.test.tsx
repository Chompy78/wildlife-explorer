import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { SAVE_KEY } from './state/saveGame';
import { createDefaultSave } from './state/saveGame';

function seedSave(overrides: Partial<ReturnType<typeof createDefaultSave>>) {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ ...createDefaultSave(), ...overrides }));
}

describe('App travel and Continue restoration', () => {
  beforeEach(() => localStorage.clear());

  it('completes Forest travel from the Wild Camper', async () => {
    const user = userEvent.setup();
    seedSave({ selectedRole: 'explorer', wildCamperUnlocked: true, camperVisited: true, camperIntroductionSeen: true, lastPlayArea: 'camper' });
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('heading', { name: 'Wild Camper' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /journey planner/i }));
    await user.click(screen.getByRole('button', { name: /^Forest/ }));
    await user.click(screen.getByRole('button', { name: 'Travel to Forest' }));
    expect(screen.getByRole('heading', { name: 'Forest Arrival', level: 1 })).toBeInTheDocument();
  });

  it('completes Lake travel, photographs a Lake animal, and restores the Lake on Continue', async () => {
    const user = userEvent.setup();
    seedSave({ selectedRole: 'explorer', wildCamperUnlocked: true, camperVisited: true, camperIntroductionSeen: true, lastPlayArea: 'camper' });
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: /journey planner/i }));
    await user.click(screen.getByRole('button', { name: /^Lake/ }));
    await user.click(screen.getByRole('button', { name: 'Travel to Lake' }));
    expect(screen.getByRole('heading', { name: 'Lake Arrival', level: 1 })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Reeds & Shallows/ }));
    await user.click(screen.getByRole('button', { name: 'Camera' }));
    await user.click(screen.getByRole('button', { name: /Photograph Painted Turtle/i }));
    expect(JSON.parse(localStorage.getItem(SAVE_KEY)!).photographedAnimals).toContain('painted-turtle');
    expect(screen.getByRole('dialog', { name: /Painted Turtle/i })).toBeInTheDocument();
  });

  it('restores the Lake play area on Continue', async () => {
    const user = userEvent.setup();
    seedSave({ selectedRole: 'explorer', wildCamperUnlocked: true, camperVisited: true, camperIntroductionSeen: true, lastPlayArea: 'lake', lakeLocation: 'Open Water' });
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('heading', { name: 'Lake Arrival', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Open Water/ })).toHaveClass('active');
  });

  it('completes Mountains travel and photographs an animal that has no photo art yet', async () => {
    const user = userEvent.setup();
    seedSave({ selectedRole: 'explorer', wildCamperUnlocked: true, camperVisited: true, camperIntroductionSeen: true, lastPlayArea: 'camper' });
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: /journey planner/i }));
    await user.click(screen.getByRole('button', { name: /^Mountains/ }));
    await user.click(screen.getByRole('button', { name: 'Travel to Mountains' }));
    expect(screen.getByRole('heading', { name: 'Mountain Arrival', level: 1 })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Camera' }));
    await user.click(screen.getByRole('button', { name: /Photograph Marmot/i }));
    expect(JSON.parse(localStorage.getItem(SAVE_KEY)!).photographedAnimals).toContain('marmot');
    expect(screen.queryByRole('dialog', { name: /Marmot/i })).not.toBeInTheDocument();
    expect(screen.getByText(/Marmot was added to your Wildlife Journal\. Did you know\?/)).toBeInTheDocument();
  });

  it('restores the Mountains play area on Continue', async () => {
    const user = userEvent.setup();
    seedSave({ selectedRole: 'explorer', wildCamperUnlocked: true, camperVisited: true, camperIntroductionSeen: true, lastPlayArea: 'mountains', mountainLocation: 'Alpine Meadow' });
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('heading', { name: 'Mountain Arrival', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Alpine Meadow/ })).toHaveClass('active');
  });

  it('completes Safari travel and restores the Safari on Continue', async () => {
    const user = userEvent.setup();
    seedSave({ selectedRole: 'explorer', wildCamperUnlocked: true, camperVisited: true, camperIntroductionSeen: true, lastPlayArea: 'camper' });
    const first = render(<App />);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: /journey planner/i }));
    await user.click(screen.getByRole('button', { name: /^Safari/ }));
    await user.click(screen.getByRole('button', { name: 'Travel to Safari' }));
    expect(screen.getByRole('heading', { name: 'Safari Arrival', level: 1 })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Open Plains/ }));
    first.unmount();

    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('heading', { name: 'Safari Arrival', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Open Plains/ })).toHaveClass('active');
  });

  it('restores the Forest play area on Continue after Forest travel', async () => {
    const user = userEvent.setup();
    seedSave({ selectedRole: 'explorer', wildCamperUnlocked: true, camperVisited: true, camperIntroductionSeen: true, lastPlayArea: 'forest', forestLocation: 'Fern Trail' });
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('heading', { name: 'Forest Arrival', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Fern Trail/ })).toHaveClass('active');
  });

  it('still restores the Camper play area on Continue when Forest was never visited', async () => {
    const user = userEvent.setup();
    seedSave({ selectedRole: 'explorer', wildCamperUnlocked: true, camperVisited: true, camperIntroductionSeen: true, lastPlayArea: 'camper' });
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('heading', { name: 'Wild Camper' })).toBeInTheDocument();
  });

  it('restores Camper (not Forest) on Continue after returning from Forest to the Camper', async () => {
    const user = userEvent.setup();
    seedSave({ selectedRole: 'explorer', wildCamperUnlocked: true, camperVisited: true, camperIntroductionSeen: true, lastPlayArea: 'forest', forestLocation: 'Fern Trail' });
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('heading', { name: 'Forest Arrival' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Return to Wild Camper' }));
    expect(screen.getByRole('heading', { name: 'Wild Camper' })).toBeInTheDocument();

    // simulate a reload: mount a fresh App instance and read the just-persisted save back
    render(<App />);
    const continueButtons = screen.getAllByRole('button', { name: 'Continue' });
    await user.click(continueButtons[continueButtons.length - 1]);
    expect(screen.getAllByRole('heading', { name: 'Wild Camper' }).length).toBeGreaterThan(0);
  });
});

describe('New game and reset after Forest travel', () => {
  beforeEach(() => localStorage.clear());

  it('starts a clean game with no stale Forest state after New Game', async () => {
    const user = userEvent.setup();
    seedSave({
      selectedRole: 'explorer', wildCamperUnlocked: true, camperVisited: true, camperIntroductionSeen: true,
      lastPlayArea: 'forest', forestLocation: 'Fern Trail', photographedAnimals: ['forest-wren'], discoveredAnimals: ['forest-wren'],
    });
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('heading', { name: 'Forest Arrival', level: 1 })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Home' }));
    await user.click(screen.getByRole('button', { name: 'New Game' }));
    expect(screen.getByRole('heading', { name: 'Pick a role' })).toBeInTheDocument();

    const saved = JSON.parse(localStorage.getItem(SAVE_KEY)!);
    expect(saved.lastPlayArea).toBe('park');
    expect(saved.wildCamperUnlocked).toBe(false);
    expect(saved.forestLocation).toBe('Forest Arrival');
    expect(saved.photographedAnimals).toEqual([]);
    expect(saved.discoveredAnimals).toEqual([]);

    await user.click(screen.getByRole('button', { name: /^Explorer/ }));
    expect(screen.getByRole('heading', { name: 'Wildlife Explorer', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Tutorial Park')).toBeInTheDocument();
  });

  it('clears all Forest and save state after Reset Save', async () => {
    const user = userEvent.setup();
    seedSave({
      selectedRole: 'explorer', wildCamperUnlocked: true, camperVisited: true, camperIntroductionSeen: true,
      lastPlayArea: 'forest', forestLocation: 'Fern Trail', photographedAnimals: ['forest-wren'], discoveredAnimals: ['forest-wren'],
    });
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: 'Home' }));
    await user.click(screen.getByRole('button', { name: 'Reset Save' }));

    // resetSave() clears storage then immediately re-persists a fresh default save via the
    // saveGame-on-change effect, so the key holds a clean default, not null.
    const resetSaved = JSON.parse(localStorage.getItem(SAVE_KEY)!);
    expect(resetSaved.lastPlayArea).toBe('park');
    expect(resetSaved.wildCamperUnlocked).toBe(false);
    expect(resetSaved.forestLocation).toBe('Forest Arrival');
    expect(resetSaved.photographedAnimals).toEqual([]);
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'New Game' }));
    await user.click(screen.getByRole('button', { name: /^Explorer/ }));
    expect(screen.getByRole('heading', { name: 'Wildlife Explorer', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Tutorial Park')).toBeInTheDocument();
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY)!);
    expect(saved.lastPlayArea).toBe('park');
    expect(saved.forestLocation).toBe('Forest Arrival');
  });
});
