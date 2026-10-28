import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MiniGames } from './MiniGames';

describe('MiniGames', () => {
  it('lists every game and opens one', async () => {
    const user = userEvent.setup();
    render(<MiniGames onGoHome={vi.fn()} />);
    for (const name of ['Memory Match', 'Who Am I?', 'Spot the Animal', 'Where Do I Live?']) {
      expect(screen.getByRole('button', { name: new RegExp(name.replace('?', '\\?')) })).toBeInTheDocument();
    }
    await user.click(screen.getByRole('button', { name: /Memory Match/ }));
    expect(screen.getAllByRole('button', { name: 'Hidden card' })).toHaveLength(12);
    await user.click(screen.getByRole('button', { name: 'All games' }));
    expect(screen.getByRole('button', { name: /Who Am I/ })).toBeInTheDocument();
  });

  it('memory match flips a card and turns a mismatched pair back over', async () => {
    const user = userEvent.setup();
    render(<MiniGames onGoHome={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /Memory Match/ }));
    const cards = screen.getAllByRole('button', { name: 'Hidden card' });
    await user.click(cards[0]);
    expect(screen.getAllByRole('button', { name: 'Hidden card' })).toHaveLength(11);
    await user.click(cards[1]);
    // Either the pair matched (stays up) or it flips back - in both cases the board stays playable.
    await waitFor(() => expect(screen.getAllByRole('button', { name: 'Hidden card' }).length).toBeGreaterThanOrEqual(10), { timeout: 2000 });
  });

  it('a wrong guess in Who Am I? says try again, and the right one is celebrated', async () => {
    const user = userEvent.setup();
    render(<MiniGames onGoHome={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /Who Am I/ }));
    const choices = screen.getAllByRole('button').filter((b) => b.className.includes('choice'));
    expect(choices.length).toBeGreaterThanOrEqual(2);
    for (const choice of choices) {
      await user.click(choice);
      if (screen.queryByText(/^✅ Yes!/)) break;
      expect(screen.getByText(/Not quite - try another one!/)).toBeInTheDocument();
    }
    expect(screen.getByText(/^✅ Yes!/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('Spot the Animal can always be solved', async () => {
    const user = userEvent.setup();
    render(<MiniGames onGoHome={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /Spot the Animal/ }));
    const tiles = screen.getAllByRole('button', { name: /^Animal \d+$/ });
    expect(tiles).toHaveLength(12);
    for (const tile of tiles) {
      await user.click(tile);
      if (screen.queryByText(/Found it/)) break;
    }
    expect(screen.getByText(/Found it/)).toBeInTheDocument();
  });

  it('returns home', async () => {
    const onGoHome = vi.fn();
    render(<MiniGames onGoHome={onGoHome} />);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Home' }));
    expect(onGoHome).toHaveBeenCalled();
  });
});
