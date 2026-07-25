import { useCallback, useRef, useState } from 'react';
import { getLearnedFacts } from '../data/animalFacts';
import { useModalFocus } from '../hooks/useModalFocus';
import { getAnimalById } from '../state/gameState';
import type { AnimalId } from '../types/Ids';
import type { SaveData } from '../types/SaveData';

// Tutorial Park's quiz-eligible animals - Lost Puppy is excluded (helped, not "learned about" the same
// way) and the non-native animals already have their own HabitatQuiz moment.
const PARK_QUIZ_ANIMALS: AnimalId[] = ['duck', 'frog', 'butterfly', 'rabbit', 'lizard', 'park-bird', 'rare-owl'];

type Question = { animalName: string; fact: string; choices: string[] };

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function buildQuestions(saveData: SaveData): Question[] {
  const candidates = PARK_QUIZ_ANIMALS.map((id) => {
    const animal = getAnimalById(id);
    if (!animal) return null;
    // Prefer a fact the player has actually learned from photographing; fall back to the animal's
    // always-available fun fact so the quiz never comes up short, even for an animal never photographed.
    const learned = getLearnedFacts(id, saveData.collectedPhotoVariants);
    const fact = learned.length > 0 ? learned[Math.floor(Math.random() * learned.length)] : animal.funFact;
    return { animalId: id, animalName: animal.name, fact };
  }).filter((candidate): candidate is { animalId: AnimalId; animalName: string; fact: string } => candidate !== null);

  return shuffle(candidates)
    .slice(0, Math.min(5, candidates.length))
    .map((question) => {
      const distractors = shuffle(candidates.filter((c) => c.animalId !== question.animalId)).slice(0, 2).map((c) => c.animalName);
      return { animalName: question.animalName, fact: question.fact, choices: shuffle([...distractors, question.animalName]) };
    });
}

type BiomeQuizProps = { saveData: SaveData; onComplete: () => void; onClose: () => void };

export function BiomeQuiz({ saveData, onComplete, onClose }: BiomeQuizProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(onClose, [onClose]);
  useModalFocus(dialogRef, close, closeRef);
  const [questions] = useState(() => buildQuestions(saveData));
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  if (questions.length === 0) {
    onComplete();
    onClose();
    return null;
  }

  const question = questions[index];
  const isCorrect = answer === question.animalName;
  const isLast = index === questions.length - 1;

  function next() {
    if (isLast) {
      setFinished(true);
      onComplete();
    } else {
      setIndex((i) => i + 1);
      setAnswer(null);
    }
  }

  return (
    <div className="quiz-overlay" role="presentation">
      <section ref={dialogRef} className="quiz-card" role="dialog" aria-modal="true" aria-labelledby="biome-quiz-title" aria-describedby="biome-quiz-description" tabIndex={-1}>
        {finished ? (
          <>
            <div className="celebration-icon" aria-hidden="true">🎖️</div>
            <p className="eyebrow">Achievement unlocked</p>
            <h2 id="biome-quiz-title">Tutorial Park Ranger</h2>
            <p id="biome-quiz-description">You finished the Tutorial Park ranger quiz! Find your new badge anytime in the Journal.</p>
            <button ref={closeRef} onClick={onClose}>Continue Exploring</button>
          </>
        ) : (
          <>
            <p className="eyebrow">Ranger Quiz &middot; Question {index + 1} of {questions.length}</p>
            <h2 id="biome-quiz-title">Which animal is this about?</h2>
            {answer === null ? (
              <>
                <p id="biome-quiz-description">&ldquo;{question.fact}&rdquo;</p>
                <div className="quiz-choice-grid">
                  {question.choices.map((choice) => (
                    <button key={choice} className="quiz-choice" onClick={() => setAnswer(choice)}>{choice}</button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p id="biome-quiz-description">
                  {isCorrect ? `That's right - it's the ${question.animalName}!` : `Good try! That one is about the ${question.animalName}.`}
                </p>
                <button onClick={next}>{isLast ? 'See my badge' : 'Next question'}</button>
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}
