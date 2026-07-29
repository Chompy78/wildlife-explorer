import { useCallback, useRef } from 'react';
import { useModalFocus } from '../hooks/useModalFocus';
import { getPhotoQualityLabel, getPhotoQualityStyle } from '../data/photoQuality';
import type { Animal } from '../types/Animal';

type Props = {
  animal: Animal;
  photoUrl: string;
  collectedCount: number;
  totalCount: number;
  fact?: string | null;
  bonusFact?: string | null;
  showPhotoQuality?: boolean;
  greatShot?: boolean;
  isNewFact?: boolean;
  onClose: () => void;
};

export function PhotoReveal({ animal, photoUrl, collectedCount, totalCount, fact, bonusFact, showPhotoQuality, greatShot, isNewFact, onClose }: Props) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(onClose, [onClose]);
  useModalFocus(dialogRef, close, closeRef);
  const complete = collectedCount >= totalCount;
  const qualityStyle = showPhotoQuality ? getPhotoQualityStyle(greatShot) : undefined;
  const qualityLabel = showPhotoQuality ? getPhotoQualityLabel(greatShot) : null;

  return (
    <div className="reveal-overlay" role="presentation">
      <section ref={dialogRef} className="reveal-card" role="dialog" aria-modal="true" aria-labelledby="reveal-title" aria-describedby="reveal-description" tabIndex={-1}>
        <p className="eyebrow">New photo!</p>
        <h2 id="reveal-title">{animal.name}</h2>
        <div className="reveal-photo-frame">
          <img className="reveal-photo" src={photoUrl} alt={`Photo of ${animal.name}`} style={qualityStyle} />
          {greatShot ? <span className="great-shot-badge">✨ Great shot!</span> : null}
        </div>
        {qualityLabel ? <p className="quality-label">{qualityLabel}</p> : null}
        <p id="reveal-description">
          {complete
            ? `${collectedCount} of ${totalCount} photos collected — collection complete!`
            : `${collectedCount} of ${totalCount} photos collected.`}
        </p>
        {fact ? (
          <div className={`reveal-fact ${isNewFact ? 'reveal-new-fact' : ''}`}>
            <span className="eyebrow">Did you know?</span>
            <p>{fact}</p>
            {isNewFact && <span className="new-fact-badge">✨ This is new!</span>}
          </div>
        ) : null}
        {bonusFact ? (
          <p className="reveal-fact reveal-bonus-fact"><span className="eyebrow">🎓 Bonus fact!</span>{bonusFact}</p>
        ) : null}
        <button ref={closeRef} onClick={onClose}>Continue Exploring</button>
      </section>
    </div>
  );
}
