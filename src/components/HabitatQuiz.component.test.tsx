import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { HabitatQuiz } from './HabitatQuiz';
import type { Animal } from '../types/Animal';

const caneToad: Animal = {
  id: 'cane-toad', name: 'Cane Toad', rarity: 'common', habitat: 'Forest Trail', activeTime: 'Evening',
  funFact: 'Cane Toads were introduced to some places to help control pests.', behaviours: ['hopping'], emoji: '🐸',
  availableInMilestone: true,
  nonNative: { correctHabitatId: 'rainforest', impactNote: 'They can be harmful to animals that try to eat them.' },
};

describe('HabitatQuiz', () => {
  it('shows the question with a choice per quiz-eligible destination, excluding Alien Planet', () => {
    render(<HabitatQuiz animal={caneToad} onClose={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Cane Toad' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Rainforest/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Alien Planet/ })).not.toBeInTheDocument();
  });

  it('gives encouraging feedback and reveals the fact when the correct habitat is picked', async () => {
    const user = userEvent.setup();
    render(<HabitatQuiz animal={caneToad} onClose={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /Rainforest/ }));
    expect(screen.getByText(/Great work!/)).toBeInTheDocument();
    expect(screen.getByText(/harmful to animals that try to eat them/)).toBeInTheDocument();
  });

  it('still gives encouraging feedback and the correct answer when the wrong habitat is picked', async () => {
    const user = userEvent.setup();
    render(<HabitatQuiz animal={caneToad} onClose={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /Mountains/ }));
    expect(screen.getByText(/Good try!/)).toBeInTheDocument();
    expect(screen.getByText(/actually comes from the Rainforest/)).toBeInTheDocument();
  });

  it('closes when Continue Exploring is pressed', async () => {
    const user = userEvent.setup();
    const close = vi.fn();
    render(<HabitatQuiz animal={caneToad} onClose={close} />);
    await user.click(screen.getByRole('button', { name: /Rainforest/ }));
    await user.click(screen.getByRole('button', { name: /Continue Exploring/ }));
    expect(close).toHaveBeenCalled();
  });
});
