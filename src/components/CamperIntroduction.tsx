import { useRef } from 'react';
import { useModalFocus } from '../hooks/useModalFocus';

export function CamperIntroduction({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useModalFocus(dialogRef, onClose, buttonRef);
  return (
    <div className="modal-overlay" role="presentation">
      <section ref={dialogRef} className="intro-card" role="dialog" aria-modal="true" aria-labelledby="camper-intro-title" aria-describedby="camper-intro-description" tabIndex={-1}>
        <div className="intro-icon" aria-hidden="true">{'\uD83D\uDE90'}</div>
        <p className="eyebrow">Your new mobile base</p>
        <h2 id="camper-intro-title">Welcome to the Wild Camper</h2>
        <p id="camper-intro-description">Inspect the stations, review Tutorial Park discoveries, and pin a future destination to the route map. Travel remains locked for now.</p>
        <button ref={buttonRef} onClick={onClose}>Got it</button>
      </section>
    </div>
  );
}
