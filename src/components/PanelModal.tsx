import { useCallback, useRef, type ReactNode } from 'react';
import { useModalFocus } from '../hooks/useModalFocus';

type PanelModalProps = { title: string; eyebrow?: string; onClose: () => void; children: ReactNode };

export function PanelModal({ title, eyebrow, onClose, children }: PanelModalProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(onClose, [onClose]);
  useModalFocus(dialogRef, close, closeRef);
  return (
    <div className="journal-overlay" role="presentation">
      <section ref={dialogRef} className="journal-panel" role="dialog" aria-modal="true" aria-labelledby="panel-modal-title" tabIndex={-1}>
        <div className="journal-header">
          <div>{eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}<h2 id="panel-modal-title">{title}</h2></div>
          <button ref={closeRef} className="secondary" onClick={onClose}>Close</button>
        </div>
        {children}
      </section>
    </div>
  );
}
