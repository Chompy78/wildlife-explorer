import { useCallback, useRef, useState } from 'react';
import { destinationPreviews, getDestinationById } from '../data/destinations';
import { useModalFocus } from '../hooks/useModalFocus';
import type { Animal } from '../types/Animal';
import type { DestinationId } from '../types/Destination';

export function HabitatQuiz({ animal, onClose }: { animal: Animal; onClose: () => void }) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(onClose, [onClose]);
  useModalFocus(dialogRef, close, closeRef);
  const [answer, setAnswer] = useState<DestinationId | null>(null);

  const nonNative = animal.nonNative;
  if (!nonNative) return null;

  const correctDestination = getDestinationById(nonNative.correctHabitatId);
  const choices = destinationPreviews.filter((destination) => destination.quizEligible);
  const isCorrect = answer === nonNative.correctHabitatId;

  return (
    <div className="quiz-overlay" role="presentation">
      <section ref={dialogRef} className="quiz-card" role="dialog" aria-modal="true" aria-labelledby="quiz-title" aria-describedby="quiz-description" tabIndex={-1}>
        <p className="eyebrow">Where does it belong?</p>
        <h2 id="quiz-title">{animal.name}</h2>
        {answer === null ? (
          <>
            <p id="quiz-description">Great photo! But the {animal.name} doesn&apos;t naturally live here. Where do you think it actually belongs?</p>
            <div className="quiz-choice-grid">
              {choices.map((destination) => (
                <button key={destination.id} className="quiz-choice" onClick={() => setAnswer(destination.id)}>
                  <span aria-hidden="true">{destination.icon}</span> {destination.name}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p id="quiz-description">
              {isCorrect
                ? `Great work! ${animal.name} naturally lives in the ${correctDestination?.name}. `
                : `Good try! ${animal.name} actually comes from the ${correctDestination?.name}, not the ${getDestinationById(answer)?.name}. `}
              {nonNative.impactNote}
            </p>
            <button ref={closeRef} onClick={onClose}>Continue Exploring</button>
          </>
        )}
      </section>
    </div>
  );
}
