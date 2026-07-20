import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CamperIntroduction } from './CamperIntroduction';
describe('CamperIntroduction',()=>{it('receives focus and closes with Escape',async()=>{const user=userEvent.setup();const close=vi.fn();render(<CamperIntroduction onClose={close}/>);expect(screen.getByRole('button',{name:/got it/i})).toHaveFocus();await user.keyboard('{Escape}');expect(close).toHaveBeenCalled();});});
