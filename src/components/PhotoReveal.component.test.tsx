import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PhotoReveal } from './PhotoReveal';
import type { Animal } from '../types/Animal';

const duck: Animal = {
  id: 'duck', name: 'Duck', rarity: 'common', habitat: 'Duck Pond', activeTime: 'Day',
  funFact: 'Ducks have waterproof feathers.', behaviours: ['swimming'], emoji: '🦆', availableInMilestone: true,
  photoDifficulty: 'easy',
};

describe('PhotoReveal', () => {
  it('shows the animal name, the photo, and collection progress', () => {
    render(<PhotoReveal animal={duck} photoUrl="/assets/animals/duck-3.jpg" collectedCount={3} totalCount={5} onClose={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Duck' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Photo of Duck/i })).toHaveAttribute('src', '/assets/animals/duck-3.jpg');
    expect(screen.getByText('3 of 5 photos collected.')).toBeInTheDocument();
  });

  it('shows a fact when one is provided, and nothing extra when it is not', () => {
    const { rerender } = render(<PhotoReveal animal={duck} photoUrl="/assets/animals/duck-2.jpg" collectedCount={2} totalCount={5} fact="Ducks have waterproof feathers." onClose={vi.fn()} />);
    expect(screen.getByText('Ducks have waterproof feathers.')).toBeInTheDocument();
    rerender(<PhotoReveal animal={duck} photoUrl="/assets/animals/duck-2.jpg" collectedCount={2} totalCount={5} fact={null} onClose={vi.fn()} />);
    expect(screen.queryByText(/Did you know/i)).not.toBeInTheDocument();
  });

  it('blurs and scales the photo when practice count is low, and shows a quality label', () => {
    render(<PhotoReveal animal={duck} photoUrl="/assets/animals/duck-1.jpg" collectedCount={1} totalCount={5} photographCount={1} onClose={vi.fn()} />);
    const img = screen.getByRole('img', { name: /Photo of Duck/i });
    expect(img.style.filter).toBe('blur(3px)');
    expect(img.style.transform).toBe('scale(1.12)');
    expect(screen.getByText('First shot - keep practicing!')).toBeInTheDocument();
  });

  it('shows the photo fully crisp with no quality label when photographCount is not provided', () => {
    render(<PhotoReveal animal={duck} photoUrl="/assets/animals/duck-1.jpg" collectedCount={1} totalCount={5} onClose={vi.fn()} />);
    const img = screen.getByRole('img', { name: /Photo of Duck/i });
    expect(img.style.filter).toBe('');
    expect(screen.queryByText(/keep practicing|steadier|nice and clear|crisp and sharp/i)).not.toBeInTheDocument();
  });

  it('shows a "Great shot!" badge only when greatShot is true', () => {
    const { rerender } = render(<PhotoReveal animal={duck} photoUrl="/assets/animals/duck-1.jpg" collectedCount={1} totalCount={5} greatShot onClose={vi.fn()} />);
    expect(screen.getByText(/Great shot!/i)).toBeInTheDocument();
    rerender(<PhotoReveal animal={duck} photoUrl="/assets/animals/duck-1.jpg" collectedCount={1} totalCount={5} onClose={vi.fn()} />);
    expect(screen.queryByText(/Great shot!/i)).not.toBeInTheDocument();
  });

  it('announces collection completion distinctly', () => {
    render(<PhotoReveal animal={duck} photoUrl="/assets/animals/duck-5.jpg" collectedCount={5} totalCount={5} onClose={vi.fn()} />);
    expect(screen.getByText(/collection complete!/i)).toBeInTheDocument();
  });

  it('shows a bonus fact alongside the normal fact when one is provided, and nothing extra when it is not', () => {
    const { rerender } = render(<PhotoReveal animal={duck} photoUrl="/assets/animals/duck-2.jpg" collectedCount={2} totalCount={5} fact="Ducks have waterproof feathers." bonusFact="A bonus fact about ducks." onClose={vi.fn()} />);
    expect(screen.getByText('Ducks have waterproof feathers.')).toBeInTheDocument();
    expect(screen.getByText('A bonus fact about ducks.')).toBeInTheDocument();
    expect(screen.getByText(/Bonus fact!/i)).toBeInTheDocument();
    rerender(<PhotoReveal animal={duck} photoUrl="/assets/animals/duck-2.jpg" collectedCount={2} totalCount={5} fact="Ducks have waterproof feathers." bonusFact={null} onClose={vi.fn()} />);
    expect(screen.queryByText(/Bonus fact!/i)).not.toBeInTheDocument();
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
