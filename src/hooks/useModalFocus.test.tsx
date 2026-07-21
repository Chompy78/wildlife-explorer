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
