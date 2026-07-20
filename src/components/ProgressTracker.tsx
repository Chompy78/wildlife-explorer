import { getTutorialProgressItems } from '../state/gameState';
import type { SaveData } from '../types/SaveData';

type ProgressTrackerProps = {
  saveData: SaveData;
};

export function ProgressTracker({ saveData }: ProgressTrackerProps) {
  const items = getTutorialProgressItems(saveData);

  return (
    <section className="progress-card">
      <h2>Tutorial Progress</h2>
      <ul>
        {items.map((item) => (
          <li key={item.label} className={item.done ? 'done' : item.locked ? 'locked' : ''}>
            <span>{item.done ? '✅' : item.locked ? '🔒' : '⬜'}</span>
            {item.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
