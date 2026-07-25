import { useCallback, useState } from 'react';
import { assetUrl } from '../assetUrl';
import { destinationPreviews, getDestinationById } from '../data/destinations';
import { acknowledgeCamperIntroduction, clearDestinationPreview, selectDestinationPreview } from '../state/camperState';
import type { CamperStationId, DestinationId } from '../types/Destination';
import type { SaveData } from '../types/SaveData';
import { CamperIntroduction } from './CamperIntroduction';
import { ExpeditionReadiness } from './ExpeditionReadiness';
import { PanelModal } from './PanelModal';
import { PhotoWallSummary } from './PhotoWallSummary';

type Props = { saveData: SaveData; onSaveChange: (saveData: SaveData) => void; onReturnToPark: () => void; onTravelToForest?: () => void; onGoHome: () => void };
type PanelKey = 'journey' | 'about';
const stationDetails: Record<CamperStationId, { name: string; icon: string; text: string }> = {
  'route-map': { name: 'Route Map', icon: '🗺️', text: 'The route map shows future habitat regions. The Forest is now ready for a short arrival expedition. Other destinations remain previews.' },
  'field-desk': { name: 'Field Desk', icon: '📝', text: 'The field desk holds gentle expedition notes and space for future wildlife research.' },
  'gear-rack': { name: 'Gear Rack', icon: '🎒', text: 'The gear rack stores a camera bag, notebook, water bottle, and safe observation equipment.' },
  'photo-wall': { name: 'Photo Wall', icon: '🖼️', text: 'The photo wall celebrates discoveries without collecting or removing wildlife from habitats.' },
};

export function CamperScreen({ saveData, onSaveChange, onReturnToPark, onTravelToForest, onGoHome }: Props) {
  const [station, setStation] = useState<CamperStationId>('route-map');
  const [activePanel, setActivePanel] = useState<PanelKey | null>(null);
  const [announcement, setAnnouncement] = useState('Route Map selected.');
  const selected = getDestinationById(saveData.selectedDestination);
  const detail = stationDetails[station];
  const closeIntroduction = useCallback(() => onSaveChange(acknowledgeCamperIntroduction(saveData)), [onSaveChange, saveData]);
  function selectStation(id: CamperStationId) { setStation(id); setAnnouncement(`${stationDetails[id].name} selected.`); }
  function chooseDestination(id: DestinationId) { const d = getDestinationById(id); onSaveChange(selectDestinationPreview(saveData, id)); setAnnouncement(`${d?.name ?? 'Destination'} pinned to the route map.`); }
  function clearDestination() { onSaveChange(clearDestinationPreview(saveData)); setAnnouncement('Pinned destination cleared.'); }

  return (
    <main className="screen play-screen camper-screen">
      <header className="top-bar camper-header"><div><p className="eyebrow">Milestone 4.1 Hub</p><h1>Wild Camper</h1></div><div className="button-row"><button className="secondary" onClick={onReturnToPark}>Return to Tutorial Park</button><button className="secondary" onClick={onGoHome}>Home</button></div></header>
      <section className="play-area">
        <div className="map-column">
          <div className="location-strip"><strong>{detail.name}</strong>{detail.text}</div>
          <div className="camper-interior-wrap">
            <div className="station-grid">{(Object.keys(stationDetails) as CamperStationId[]).map((id) => { const item = stationDetails[id]; return <button key={id} className={station === id ? 'station-card active' : 'station-card'} onClick={() => selectStation(id)} aria-pressed={station === id}><span aria-hidden="true">{item.icon}</span><strong>{item.name}</strong>{station === id ? <small>Selected</small> : null}</button>; })}</div>
            {station === 'photo-wall' ? <PhotoWallSummary saveData={saveData} /> : null}
            <nav className="action-bar" aria-label="Camper tools">
              <button className="action-button" onClick={() => setActivePanel('journey')} aria-label="Journey Planner"><span aria-hidden="true">🗺️</span>{selected ? <span className="badge">1</span> : null}</button>
              <button className="action-button secondary" onClick={() => setActivePanel('about')} aria-label="About"><span aria-hidden="true">ℹ️</span></button>
            </nav>
          </div>
        </div>
      </section>

      {activePanel === 'journey' ? (
        <PanelModal title="Future Destinations" eyebrow="Journey planner" onClose={() => setActivePanel(null)}>
          <p className="muted">Pin a preview to the route map. Forest travel is enabled. Other routes remain previews.</p>
          <div className="destination-grid">{destinationPreviews.map((d) => <button key={d.id} className={saveData.selectedDestination === d.id ? 'destination-card selected' : 'destination-card'} onClick={() => chooseDestination(d.id)} aria-pressed={saveData.selectedDestination === d.id}><span aria-hidden="true">{d.icon}</span><strong>{d.name}</strong><small>{d.tagline}</small><em>{saveData.selectedDestination === d.id ? '✓ Selected - Preview only' : 'Preview only'}</em></button>)}</div>
          <section className="destination-preview">{selected ? <><div className="destination-preview-icon" aria-hidden="true">{selected.icon}</div><h3>{selected.name} pinned to route map</h3><p>{selected.preview}</p>{selected.id === 'forest' && onTravelToForest ? <button onClick={onTravelToForest}>Travel to Forest</button> : null}<button className="secondary" onClick={clearDestination}>Clear pinned destination</button></> : <><h3>No destination pinned yet</h3><p>Choose a preview above to plan a future wildlife journey.</p></>}</section>
          <ExpeditionReadiness saveData={saveData} />
        </PanelModal>
      ) : null}
      {activePanel === 'about' ? (
        <PanelModal title="Inside the Wild Camper" eyebrow="Unlocked base" onClose={() => setActivePanel(null)}>
          <img className="about-hero-image" src={assetUrl('assets/wild-camper/wild-camper-direction.png')} alt="Illustrated Wild Camper parked in a natural landscape" />
          <p>Inspect stations, review discoveries, and plan the next journey.</p>
        </PanelModal>
      ) : null}

      <div className="sr-only" role="status" aria-live="polite">{announcement}</div>
      {!saveData.camperIntroductionSeen ? <CamperIntroduction onClose={closeIntroduction} /> : null}
    </main>
  );
}
