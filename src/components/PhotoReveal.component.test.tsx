import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PhotoReveal } from './PhotoReveal';
import type { Animal } from '../types/Animal';

const duck: Animal = {
  id: 'duck', name: 'Duck', rarity: 'common', habitat: 'Duck Pond', activeTime: 'Day',
  funFact: 'Ducks have waterproof feathers.', behaviours: ['swimming'], emoji: '🦆', availableInMilestone: true,
};

describe('PhotoReveal', () => {
  it('shows the animal name, the photo, and collection progress', () => {
    render(<PhotoReveal animal={duck} photoUrl="/assets/animals/duck-3.jpg" collectedCount={3} totalCount={5} onClose={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Duck' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Photo of Duck/i })).toHaveAttribute('src', '/assets/animals/duck-3.jpg');
    expect(screen.getByText('3 of 5 photos collected.')).toBeInTheDocument();
  });

  it('announces collection completion distinctly', () => {
    render(<PhotoReveal animal={duck} photoUrl="/assets/animals/duck-5.jpg" collectedCount={5} totalCount={5} onClose={vi.fn()} />);
    expect(screen.getByText(/collection complete!/i)).toBeInTheDocument();
  });

  it('closes when Continue Exploring is pressed, and receives initial focus', async () => {
    const user = userEvent.setup();
    const close = vi.fn();
    render(<PhotoReveal animal={duck} photoUrl="/assets/animals/duck-1.jpg" collectedCount={1} totalCount={5} onClose={close} />);
    expect(screen.getByRole('button', { name: /Continue Exploring/i })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: /Continue Exploring/i }));
    expect(close).toHaveBeenCalled();
  });
});
