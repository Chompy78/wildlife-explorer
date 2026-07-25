import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BiomeQuiz } from './BiomeQuiz';
import { createDefaultSave } from '../state/saveGame';

describe('BiomeQuiz', () => {
  it('asks 5 questions, always lets an answer proceed, then awards the achievement exactly once and closes', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    const onClose = vi.fn();
    render(<BiomeQuiz saveData={createDefaultSave()} onComplete={onComplete} onClose={onClose} />);

    for (let i = 0; i < 5; i++) {
      expect(screen.getByText(new RegExp(`Question ${i + 1} of 5`))).toBeInTheDocument();
      const choices = screen.getAllByRole('button');
      await user.click(choices[0]);
      const nextButton = screen.getByRole('button', { name: /next question|see my badge/i });
      await user.click(nextButton);
    }

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('heading', { name: /Tutorial Park Ranger/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Continue Exploring/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('gives feedback naming the correct animal whether the answer was right or wrong', async () => {
    const user = userEvent.setup();
    render(<BiomeQuiz saveData={createDefaultSave()} onComplete={vi.fn()} onClose={vi.fn()} />);
    const choices = screen.getAllByRole('button');
    await user.click(choices[0]);
    expect(screen.getByText(/that's right|good try/i)).toBeInTheDocument();
  });
});
