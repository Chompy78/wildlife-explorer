import { useCallback, useState } from 'react';
import { destinationPreviews, getDestinationById } from '../data/destinations';
import { acknowledgeCamperIntroduction, clearDestinationPreview, selectDestinationPreview } from '../state/camperState';
import type { CamperStationId, DestinationId } from '../types/Destination';
import type { SaveData } from '../types/SaveData';
import { CamperIntroduction } from './CamperIntroduction';
import { ExpeditionReadiness } from './ExpeditionReadiness';
import { PhotoWallSummary } from './PhotoWallSummary';

type Props = { saveData: SaveData; onSaveChange: (saveData: SaveData) => void; onReturnToPark: () => void; onTravelToForest?: () => void; onGoHome: () => void };
const stationDetails: Record<CamperStationId, { name: string; icon: string; text: string }> = {
  'route-map': { name: 'Route Map', icon: '\uD83D\uDDFA\uFE0F', text: 'The route map shows future habitat regions. The Forest is now ready for a short arrival expedition. Other destinations remain previews.' },
  'field-desk': { name: 'Field Desk', icon: '\uD83D\uDCDD', text: 'The field desk holds gentle expedition notes and space for future wildlife research.' },
  'gear-rack': { name: 'Gear Rack', icon: '\uD83C\uDF92', text: 'The gear rack stores a camera bag, notebook, water bottle, and safe observation equipment.' },
  'photo-wall': { name: 'Photo Wall', icon: '\uD83D\uDDBC\uFE0F', text: 'The photo wall celebrates discoveries without collecting or removing wildlife from habitats.' },
};

export function CamperScreen({ saveData, onSaveChange, onReturnToPark, onTravelToForest, onGoHome }: Props) {
  const [station, setStation] = useState<CamperStationId>('route-map');
  const [announcement, setAnnouncement] = useState('Route Map selected.');
  const selected = getDestinationById(saveData.selectedDestination);
  const detail = stationDetails[station];
  const closeIntroduction = useCallback(() => onSaveChange(acknowledgeCamperIntroduction(saveData)), [onSaveChange, saveData]);
  function selectStation(id: CamperStationId) { setStation(id); setAnnouncement(`${stationDetails[id].name} selected.`); }
  function chooseDestination(id: DestinationId) { const d = getDestinationById(id); onSaveChange(selectDestinationPreview(saveData, id)); setAnnouncement(`${d?.name ?? 'Destination'} pinned to the route map.`); }
  function clearDestination() { onSaveChange(clearDestinationPreview(saveData)); setAnnouncement('Pinned destination cleared.'); }

  return (
    <main className="screen camper-screen">
      <header className="top-bar camper-header"><div><p className="eyebrow">Milestone 4.1 Hub</p><h1>Wild Camper</h1><p className="muted">A calm mobile base for planning future wildlife journeys.</p></div><div className="button-row"><button className="secondary" onClick={onReturnToPark}>Return to Tutorial Park</button><button className="secondary" onClick={onGoHome}>Home</button></div></header>
      <section className="camper-visual panel"><img src="/assets/wild-camper/wild-camper-direction.png" alt="Illustrated Wild Camper parked in a natural landscape"/><div className="camper-visual-copy"><p className="eyebrow">Unlocked base</p><h2>Inside the Wild Camper</h2><p>Inspect stations, review discoveries, and plan the next journey.</p></div></section>
      <section className="camper-layout">
        <section className="panel camper-interior" aria-labelledby="camper-interior-title"><h2 id="camper-interior-title">Camper Stations</h2><div className="station-grid">{(Object.keys(stationDetails) as CamperStationId[]).map((id) => { const item = stationDetails[id]; return <button key={id} className={station === id ? 'station-card active' : 'station-card'} onClick={() => selectStation(id)} aria-pressed={station === id}><span aria-hidden="true">{item.icon}</span><strong>{item.name}</strong>{station === id ? <small>Selected</small> : null}</button>; })}</div><div className="station-detail"><span aria-hidden="true">{detail.icon}</span><div><h3>{detail.name}</h3><p>{detail.text}</p></div></div>{station === 'photo-wall' ? <PhotoWallSummary saveData={saveData}/> : null}</section>
        <aside className="panel journey-panel"><p className="eyebrow">Journey planner</p><h2>Future Destinations</h2><p className="muted">Pin a preview to the route map. Forest travel is enabled. Other routes remain previews.</p><div className="destination-grid">{destinationPreviews.map((d) => <button key={d.id} className={saveData.selectedDestination === d.id ? 'destination-card selected' : 'destination-card'} onClick={() => chooseDestination(d.id)} aria-pressed={saveData.selectedDestination === d.id}><span aria-hidden="true">{d.icon}</span><strong>{d.name}</strong><small>{d.tagline}</small><em>{saveData.selectedDestination === d.id ? '\u2713 Selected - Preview only' : 'Preview only'}</em></button>)}</div><section className="destination-preview">{selected ? <><div className="destination-preview-icon" aria-hidden="true">{selected.icon}</div><h3>{selected.name} pinned to route map</h3><p>{selected.preview}</p>{selected.id === 'forest' && onTravelToForest ? <button onClick={onTravelToForest}>Travel to Forest</button> : null}<button className="secondary" onClick={clearDestination}>Clear pinned destination</button></> : <><h3>No destination pinned yet</h3><p>Choose a preview above to plan a future wildlife journey.</p></>}</section><ExpeditionReadiness saveData={saveData}/></aside>
      </section>
      <div className="sr-only" role="status" aria-live="polite">{announcement}</div>
      {!saveData.camperIntroductionSeen ? <CamperIntroduction onClose={closeIntroduction}/> : null}
    </main>
  );
}
