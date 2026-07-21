import { StrictMode, useRef, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useModalFocus } from './useModalFocus';

function Dialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLElement>(null); const closeRef = useRef<HTMLButtonElement>(null);
  useModalFocus(dialogRef, onClose, closeRef);
  return <section ref={dialogRef} role="dialog" aria-modal="true" tabIndex={-1}>
    <button>First</button>
    <button ref={closeRef} onClick={onClose}>Close</button>
  </section>;
}
function Wrapper() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  return <div>
    <button ref={triggerRef} onClick={() => setOpen(true)}>Open</button>
    {/* onClose is a fresh inline function every render, matching ForestScreen/ParkScreen's real
        (unmemoized) closeJournal pattern - this is what makes the effect re-run on unrelated re-renders. */}
    {open ? <Dialog onClose={() => setOpen(false)} /> : null}
  </div>;
}

describe('useModalFocus under StrictMode double-invoked effects', () => {
  it('keeps initial focus on the dialog instead of the double-invoked cleanup stealing it back', async () => {
    const user = userEvent.setup();
    render(<StrictMode><Wrapper /></StrictMode>);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus());
  });
});

function WrapperWithUnrelatedRerenders({ tick }: { tick: number }) {
  const [open, setOpen] = useState(false);
  return <div>
    <button onClick={() => setOpen(true)}>Open</button>
    <span>tick: {tick}</span>
    {/* onClose is a fresh inline function every render, matching ForestScreen/ParkScreen's real
        (unmemoized) closeJournal pattern - this is what makes the effect re-run on unrelated re-renders. */}
    {open ? <Dialog onClose={() => setOpen(false)} /> : null}
  </div>;
}

describe('useModalFocus across unrelated parent re-renders while open', () => {
  it('does not steal focus back to the initial control when the dialog stays open across a re-render', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<WrapperWithUnrelatedRerenders tick={0} />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();

    await user.tab();
    // Only two focusable items in the dialog, so a single Tab from Close wraps around to First.
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();

    // Re-render the parent for a reason unrelated to the dialog - onClose gets a fresh identity as a
    // side effect, since it's defined inline. Focus should stay exactly where the user left it.
    rerender(<WrapperWithUnrelatedRerenders tick={1} />);
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();

    rerender(<WrapperWithUnrelatedRerenders tick={2} />);
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
  });
});
