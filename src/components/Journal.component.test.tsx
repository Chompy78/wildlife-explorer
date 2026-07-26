import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Journal } from './Journal';
import { createDefaultSave } from '../state/saveGame';
import type { AnimalId } from '../types/Ids';

describe('Journal', () => {
  it('opens on the biome selection screen with a discovered-count per biome', () => {
    const save = { ...createDefaultSave(), photographedAnimals: ['duck'] as AnimalId[], collectedPhotoVariants: ['duck-2'] };
    render(<Journal saveData={save} onClose={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Tutorial Park/i })).toHaveTextContent('1 of');
    expect(screen.getByRole('button', { name: /^Forest/i })).toHaveTextContent('0 of');
    expect(screen.queryByText('Duck')).not.toBeInTheDocument();
  });

  it('shows only Park animals under Tutorial Park, and lets Back return to biome selection', async () => {
    const user = userEvent.setup();
    render(<Journal saveData={createDefaultSave()} onClose={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /Tutorial Park/i }));
    expect(screen.getByRole('heading', { name: 'Duck' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Forest Wren' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Back to biomes/i }));
    expect(screen.getByRole('button', { name: /Tutorial Park/i })).toBeInTheDocument();
  });

  it('shows only Forest animals under Forest', async () => {
    const user = userEvent.setup();
    render(<Journal saveData={createDefaultSave()} onClose={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /^Forest/i }));
    expect(screen.getByRole('heading', { name: 'Forest Wren' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Duck' })).not.toBeInTheDocument();
  });

  it('shows Places, Rewards, and Achievements under that category', async () => {
    const user = userEvent.setup();
    render(<Journal saveData={createDefaultSave()} onClose={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /Places & Rewards/i }));
    expect(screen.getByRole('heading', { name: 'Whisper Grove' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Wild Camper' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Tutorial Park Ranger' })).toBeInTheDocument();
  });

  it('shows a View Photos button only for a discovered animal with photo art, and opens its album', async () => {
    const user = userEvent.setup();
    const save = { ...createDefaultSave(), photographedAnimals: ['duck'] as AnimalId[], collectedPhotoVariants: ['duck-2', 'duck-4'] };
    render(<Journal saveData={save} onClose={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /Tutorial Park/i }));
    await user.click(screen.getByRole('button', { name: /View Photos/i }));
    const album = within(screen.getByRole('dialog', { name: /Duck/i }));
    expect(album.getByRole('heading', { name: 'Duck' })).toBeInTheDocument();
    expect(album.getByText('2 of 5 photos collected')).toBeInTheDocument();
    expect(album.getByRole('img', { name: /Photo 2 of Duck/i })).toBeInTheDocument();
    expect(album.getByRole('img', { name: /Photo 4 of Duck/i })).toBeInTheDocument();
  });

  it('offers no View Photos button for an undiscovered animal', async () => {
    const user = userEvent.setup();
    render(<Journal saveData={createDefaultSave()} onClose={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /Tutorial Park/i }));
    expect(screen.queryByRole('button', { name: /View Photos/i })).not.toBeInTheDocument();
  });
});
