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

// Every animal is always visible and always shootable (no wandering, no waiting) - the active thing to
// do is watch a marker sweep back and forth along a short track and tap the shutter while it's inside
// the highlighted sweet spot for a Great Shot. Tapping any other time still always works - there is no
// miss, matching AI.md's Canon of "no harsh failure". Difficulty tunes the sweep speed and how wide the
// sweet spot is: easy animals get a slow sweep and a wide, forgiving zone; hard animals get a quick
// sweep and a narrow zone that takes real attention to catch. A minimum sweet-spot width is kept even on
// "hard" so it never tips into feeling unfair for younger players.
const FOCUS_TUNING: Record<PhotoDifficulty, { cycleMs: number; sweetSpotWidth: number }> = {
  easy: { cycleMs: 2200, sweetSpotWidth: 0.42 },
  medium: { cycleMs: 1600, sweetSpotWidth: 0.28 },
  hard: { cycleMs: 1100, sweetSpotWidth: 0.16 },
};
const TICK_MS = 50;

// A smooth 0 -> 1 -> 0 sweep, so the marker crosses the center (where the sweet spot is) twice per cycle.
function triangleWave(elapsedMs: number, cycleMs: number): number {
  const half = cycleMs / 2;
  const phase = ((elapsedMs % cycleMs) + cycleMs) % cycleMs;
  return phase <= half ? phase / half : (cycleMs - phase) / half;
}

function isInSweetSpot(position: number, width: number): boolean {
  return Math.abs(position - 0.5) <= width / 2;
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function CameraPanel({ animalsHere, saveData, onPhotographAnimal }: CameraPanelProps) {
  const animalIdsHere = animalsHere.map((animal) => animal.id).join(',');
  // Normal motion: a continuous 0-1 sweep position per animal, read at tap-time against its sweet spot.
  const [focusPosition, setFocusPosition] = useState<Partial<Record<AnimalId, number>>>({});
  // Reduced motion fallback: no moving marker (this preference is specifically about opting out of that
  // kind of movement) - instead the same calm on/off glow this game used before this mechanic existed.
  const [reducedMotionGlow, setReducedMotionGlow] = useState<Partial<Record<AnimalId, boolean>>>({});

  useEffect(() => {
    if (prefersReducedMotion()) {
      const timeouts: ReturnType<typeof setTimeout>[] = [];
      animalsHere.forEach((animal) => {
        const { cycleMs } = FOCUS_TUNING[effectivePhotoDifficulty(saveData.selectedRole, animal)];
        function loop(active: boolean) {
          setReducedMotionGlow((prev) => ({ ...prev, [animal.id]: active }));
          timeouts.push(setTimeout(() => loop(!active), active ? cycleMs / 2 : cycleMs / 2));
        }
        loop(false);
      });
      return () => timeouts.forEach(clearTimeout);
    }

    const startTime = Date.now();
    const offsets: Partial<Record<AnimalId, number>> = {};
    animalsHere.forEach((animal) => {
      const { cycleMs } = FOCUS_TUNING[effectivePhotoDifficulty(saveData.selectedRole, animal)];
      offsets[animal.id] = Math.random() * cycleMs;
    });
    const intervalId = setInterval(() => {
      const now = Date.now();
      setFocusPosition((prev) => {
        const next = { ...prev };
        animalsHere.forEach((animal) => {
          const { cycleMs } = FOCUS_TUNING[effectivePhotoDifficulty(saveData.selectedRole, animal)];
          next[animal.id] = triangleWave(now - startTime + (offsets[animal.id] ?? 0), cycleMs);
        });
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animalIdsHere]);

  return (
    <div className="camera-card">
      {animalsHere.length === 0 ? (
        <p>No common animals are ready to photograph here yet.</p>
      ) : (
        <>
          <p className="camera-hint muted">Tap the shutter while the marker is in the glowing zone for a Great Shot!</p>
          <div className="photo-target-list">
            {animalsHere.map((animal) => {
              const alreadyPhotographed = hasPhotographedAnimal(saveData, animal.id);
              const hasPhotos = getPhotoVariantCount(animal.id) > 0;
              const complete = isCollectionComplete(animal.id, saveData.collectedPhotoVariants);
              const reducedMotion = prefersReducedMotion();
              const { sweetSpotWidth } = FOCUS_TUNING[effectivePhotoDifficulty(saveData.selectedRole, animal)];
              const position = focusPosition[animal.id] ?? 0;
              const greatShotNow = reducedMotion
                ? Boolean(reducedMotionGlow[animal.id])
                : isInSweetSpot(position, sweetSpotWidth);
              const className = ['photo-target', greatShotNow && !complete ? 'pulse' : ''].filter(Boolean).join(' ');
              return (
                <button
                  key={animal.id}
                  className={className}
                  onClick={() => onPhotographAnimal(animal.id, greatShotNow)}
                  disabled={complete}
                >
                  {hasPhotos ? (
                    <img className="animal-thumb small animal-visual" src={getPhotoVariantUrl(animal.id, 1)} alt="" />
                  ) : (
                    <span className="animal-visual">{animal.emoji}</span>
                  )}
                  <span className="photo-target-body">
                    <strong>
                      {complete
                        ? `${animal.name} — collection complete`
                        : alreadyPhotographed
                          ? `Retake ${animal.name}`
                          : `Photograph ${animal.name}`}
                    </strong>
                    {!complete && !reducedMotion ? (
                      <span className="focus-track" aria-hidden="true">
                        <span
                          className="focus-sweet-spot"
                          style={{ left: `${(0.5 - sweetSpotWidth / 2) * 100}%`, width: `${sweetSpotWidth * 100}%` }}
                        />
                        <span className="focus-marker" style={{ left: `${position * 100}%` }} />
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
