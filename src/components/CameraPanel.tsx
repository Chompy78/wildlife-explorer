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
// miss, matching AI.md's Canon of "no harsh failure". Difficulty tunes the sweep speed and the sweet
// spot's ceiling width: easy animals get a slow sweep and a wide, forgiving ceiling; hard animals get a
// quick sweep and a narrow ceiling that takes real attention to catch.
const FOCUS_TUNING: Record<PhotoDifficulty, { cycleMs: number; maxSweetSpotWidth: number }> = {
  easy: { cycleMs: 2200, maxSweetSpotWidth: 0.42 },
  medium: { cycleMs: 1600, maxSweetSpotWidth: 0.28 },
  hard: { cycleMs: 1100, maxSweetSpotWidth: 0.16 },
};
// Position only updates once per tick, so this needs to stay comfortably smaller than the shortest
// possible sweet-spot crossing duration (the narrowest band, at MIN_SWEET_SPOT_WIDTH on the fastest
// cycle, is still ~27ms of real crossing time) - otherwise an unlucky tick alignment could skip over
// the window entirely on a given pass, even though it was genuinely reachable a moment before or after.
const TICK_MS = 20;

// The sweet spot starts narrow and widens with practice, never landing outside it below this floor.
const MIN_SWEET_SPOT_WIDTH = 0.05;
// It starts at this fraction of its tier's ceiling width, before any practice on this species at all.
const START_WIDTH_FRACTION = 0.35;
// Practicing THIS specific animal grows it toward the full ceiling width over this many photos of it -
// 5, matching a full photo collection (animalPhotoVariants.ts), since every animal disables further
// shooting once complete and photographCounts can never exceed its variant count. A higher number here
// would make full mastery permanently unreachable for every animal in the game.
const SPECIES_MASTERY_SHOTS = 5;
// Being an experienced photographer overall (every species combined) stacks a further bonus on top,
// reached gradually over this many total photos - a small edge that helps even on a brand-new species.
// Unlike SPECIES_MASTERY_SHOTS this is deliberately a long-term target, not something every save is
// expected to fully reach - the point is a slow, ongoing trend across a whole playthrough, not a cap
// that must be attainable.
const GLOBAL_MASTERY_SHOTS = 60;
const GLOBAL_BONUS_FRACTION = 0.15;

function getTotalPhotographCount(saveData: SaveData): number {
  return Object.values(saveData.photographCounts).reduce((sum: number, count) => sum + (count ?? 0), 0);
}

function getSweetSpotWidth(maxWidth: number, speciesCount: number, totalCount: number): number {
  const speciesFraction = START_WIDTH_FRACTION + (1 - START_WIDTH_FRACTION) * Math.min(1, speciesCount / SPECIES_MASTERY_SHOTS);
  const globalBonusFraction = GLOBAL_BONUS_FRACTION * Math.min(1, totalCount / GLOBAL_MASTERY_SHOTS);
  return Math.max(MIN_SWEET_SPOT_WIDTH, maxWidth * (speciesFraction + globalBonusFraction));
}

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
    const totalCount = getTotalPhotographCount(saveData);

    if (prefersReducedMotion()) {
      const timeouts: ReturnType<typeof setTimeout>[] = [];
      animalsHere.forEach((animal) => {
        const { cycleMs, maxSweetSpotWidth } = FOCUS_TUNING[effectivePhotoDifficulty(saveData.selectedRole, animal)];
        const speciesCount = saveData.photographCounts[animal.id] ?? 0;
        const width = getSweetSpotWidth(maxSweetSpotWidth, speciesCount, totalCount);
        const onMs = cycleMs * width;
        const offMs = cycleMs - onMs;
        function loop(active: boolean) {
          setReducedMotionGlow((prev) => ({ ...prev, [animal.id]: active }));
          timeouts.push(setTimeout(() => loop(!active), active ? onMs : offMs));
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

  const totalCount = getTotalPhotographCount(saveData);

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
              const { maxSweetSpotWidth } = FOCUS_TUNING[effectivePhotoDifficulty(saveData.selectedRole, animal)];
              const speciesCount = saveData.photographCounts[animal.id] ?? 0;
              const sweetSpotWidth = getSweetSpotWidth(maxSweetSpotWidth, speciesCount, totalCount);
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
