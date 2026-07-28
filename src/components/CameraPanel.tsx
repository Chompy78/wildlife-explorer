import { useEffect, useState } from 'react';
import { getPhotoVariantCount, getPhotoVariantUrl, isCollectionComplete } from '../data/animalPhotoVariants';
import { effectivePhotoDifficulty } from '../data/roleBonuses';
import type { AnimalId } from '../types/Ids';
import { hasPhotographedAnimal } from '../state/gameState';
import type { Animal, PhotoDifficulty } from '../types/Animal';
import type { SaveData } from '../types/SaveData';

type CameraPanelProps = {
  animalsHere: Animal[];
  saveData: SaveData;
  onPhotographAnimal: (animalId: AnimalId, greatShot: boolean) => void;
};

// Each species' Great Shot glow is tuned by its photoDifficulty: easy animals get a long, forgiving
// glow and a short dark gap; hard animals get a short glow that's genuinely tricky to catch. A safe
// minimum glow window is kept even on "hard" so it never tips into feeling unfair for younger players.
const PULSE_DURATIONS: Record<PhotoDifficulty, { onMs: number; offMs: number }> = {
  easy: { onMs: 1400, offMs: 1100 },
  medium: { onMs: 900, offMs: 1500 },
  hard: { onMs: 550, offMs: 1900 },
};

// Photo Mode: each animal wanders in and out of frame on its own randomized loop instead of always
// being available on demand. Shooting only ever succeeds while an animal is in frame - there is still
// no "miss" (an off-frame shutter button is simply disabled with encouraging copy, same visual language
// as an already-complete collection), matching AI.md's Canon of "no harsh failure".
const IN_FRAME_MIN_MS = 2500;
const IN_FRAME_MAX_MS = 3500;
const OFF_FRAME_MIN_MS = 2000;
const OFF_FRAME_MAX_MS = 4000;

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function CameraPanel({ animalsHere, saveData, onPhotographAnimal }: CameraPanelProps) {
  const animalIdsHere = animalsHere.map((animal) => animal.id).join(',');
  const [inFrame, setInFrame] = useState<Partial<Record<AnimalId, boolean>>>({});
  // A calm, non-punishing timing cue per animal: its shutter glows on its own loop (paced by that
  // species' photoDifficulty) whenever it's in frame, and shooting during the glow marks that photo a
  // "Great shot!" bonus. Shooting at any other time while in frame still always works - there is no miss.
  const [posePulse, setPosePulse] = useState<Partial<Record<AnimalId, boolean>>>({});

  useEffect(() => {
    const reducedMotion = prefersReducedMotion();
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    animalsHere.forEach((animal) => {
      const { onMs, offMs } = PULSE_DURATIONS[effectivePhotoDifficulty(saveData.selectedRole, animal)];
      let pulseTimeoutId: ReturnType<typeof setTimeout> | undefined;

      function pulseLoop(active: boolean) {
        setPosePulse((prev) => ({ ...prev, [animal.id]: active }));
        pulseTimeoutId = setTimeout(() => pulseLoop(!active), active ? onMs : offMs);
        timeouts.push(pulseTimeoutId);
      }

      if (reducedMotion) {
        // Reduced-motion fallback: skip the wandering gate entirely, every animal stays available like
        // before Photo Mode existed. The Great Shot glow keeps cycling (per-species timing still
        // applies) - it's a highlight, not a wandering/movement effect this preference opts out of.
        setInFrame((prev) => ({ ...prev, [animal.id]: true }));
        pulseLoop(false);
        return;
      }

      function presenceLoop(visible: boolean) {
        setInFrame((prev) => ({ ...prev, [animal.id]: visible }));
        if (visible) {
          pulseLoop(false); // glow only cycles while the animal is actually in frame
        } else if (pulseTimeoutId !== undefined) {
          clearTimeout(pulseTimeoutId);
          pulseTimeoutId = undefined;
          setPosePulse((prev) => ({ ...prev, [animal.id]: false }));
        }
        const duration = visible
          ? randomBetween(IN_FRAME_MIN_MS, IN_FRAME_MAX_MS)
          : randomBetween(OFF_FRAME_MIN_MS, OFF_FRAME_MAX_MS);
        timeouts.push(setTimeout(() => presenceLoop(!visible), duration));
      }
      // Stagger each animal's first appearance so a group doesn't all pop in/out together.
      timeouts.push(setTimeout(() => presenceLoop(true), randomBetween(0, OFF_FRAME_MAX_MS)));
    });
    return () => timeouts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animalIdsHere]);

  return (
    <div className="camera-card">
      {animalsHere.length === 0 ? (
        <p>No common animals are ready to photograph here yet.</p>
      ) : (
        <>
          <p className="camera-hint muted">Wait for an animal to come into view, then watch for the calm glow for a Great Shot bonus!</p>
          <div className="photo-target-list">
            {animalsHere.map((animal) => {
              const alreadyPhotographed = hasPhotographedAnimal(saveData, animal.id);
              const hasPhotos = getPhotoVariantCount(animal.id) > 0;
              const complete = isCollectionComplete(animal.id, saveData.collectedPhotoVariants);
              const visible = complete || Boolean(inFrame[animal.id]);
              const pulsing = Boolean(posePulse[animal.id]);
              const className = [
                'photo-target',
                visible ? 'in-frame' : 'off-frame',
                pulsing && !complete && visible ? 'pulse' : '',
              ].filter(Boolean).join(' ');
              return (
                <button
                  key={animal.id}
                  className={className}
                  onClick={() => onPhotographAnimal(animal.id, pulsing)}
                  disabled={complete || !visible}
                >
                  {hasPhotos ? (
                    <img className="animal-thumb small animal-visual" src={getPhotoVariantUrl(animal.id, 1)} alt="" />
                  ) : (
                    <span className="animal-visual">{animal.emoji}</span>
                  )}
                  <strong>
                    {complete
                      ? `${animal.name} — collection complete`
                      : !visible
                        ? `${animal.name} wandered off - wait for it to come back`
                        : alreadyPhotographed
                          ? `Retake ${animal.name}`
                          : `Photograph ${animal.name}`}
                  </strong>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
