import { getDestinationById } from '../data/destinations';
import type { SaveData } from '../types/SaveData';

export function ExpeditionReadiness({ saveData }: { saveData: SaveData }) {
  const destination = getDestinationById(saveData.selectedDestination);
  const items = [
    ['Tutorial Park complete', saveData.wildCamperUnlocked],
    ['Wild Camper visited', saveData.camperVisited],
    [destination ? `${destination.name} preview pinned` : 'Destination preview pinned', Boolean(destination)],
  ] as const;
  return (
    <section className="readiness-card" aria-labelledby="readiness-title">
      <p className="eyebrow">Expedition readiness</p><h3 id="readiness-title">Preparing the next journey</h3>
      <ul>{items.map(([label, done]) => <li key={label}><span aria-hidden="true">{done ? '\u2705' : '\u2B1C'}</span>{label}</li>)}</ul>
      <p className="travel-locked"><span aria-hidden="true">{'\uD83D\uDD12'}</span> Expedition travel - coming in a future milestone.</p>
    </section>
  );
}
