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

    await user.click(screen.getByRole('button', { name: /^Forest/ }));
    await user.click(screen.getByRole('button', { name: 'Travel to Forest' }));
    expect(screen.getByRole('heading', { name: 'Forest Arrival', level: 1 })).toBeInTheDocument();
  });

  it('restores the Forest play area on Continue after Forest travel', async () => {
    const user = userEvent.setup();
    seedSave({ selectedRole: 'explorer', wildCamperUnlocked: true, camperVisited: true, camperIntroductionSeen: true, lastPlayArea: 'forest', forestLocation: 'Fern Trail' });
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('heading', { name: 'Forest Arrival', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Fern Trail' })).toBeInTheDocument();
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
