import { useCallback, useRef } from 'react';
import { animals } from '../data/animals';
import { countCollectedVariants, getFirstCollectedVariant, getPhotoVariantCount, getPhotoVariantUrl } from '../data/animalPhotoVariants';
import { useModalFocus } from '../hooks/useModalFocus';
import { hasHelpedLostPuppy, hasPhotographedAnimal } from '../state/gameState';
import type { Animal } from '../types/Animal';
import type { SaveData } from '../types/SaveData';

type JournalProps = { saveData: SaveData; onClose: () => void };
export function Journal({ saveData, onClose }: JournalProps) {
  const dialogRef = useRef<HTMLElement>(null); const closeRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(onClose, [onClose]); useModalFocus(dialogRef, close, closeRef);
  return <div className="journal-overlay" role="presentation"><section ref={dialogRef} className="journal-panel" role="dialog" aria-modal="true" aria-labelledby="journal-title" aria-describedby="journal-description" tabIndex={-1}>
    <div className="journal-header"><div><p className="eyebrow">Wildlife Journal</p><h2 id="journal-title">Collection Book</h2><p id="journal-description" className="muted">Photos, discoveries, and animals helped during the adventure.</p></div><button ref={closeRef} className="secondary" onClick={onClose}>Close</button></div>
    <section className="journal-section"><h3>Animals and Helping</h3><div className="journal-list">{animals.map((animal) => <JournalEntry key={animal.id} animal={animal} saveData={saveData}/>)}</div></section>
    <section className="journal-section"><h3>Places and Rewards</h3><SpecialEntry icon={saveData.whisperGroveDiscovered ? '\uD83C\uDF3A' : '\uD83D\uDD12'} title="Whisper Grove" discovered={saveData.whisperGroveDiscovered} text={saveData.whisperGroveDiscovered ? 'Discovered - a peaceful hidden natural area.' : 'Hidden. Help animals and explore the Strange Old Tree area.'}/><SpecialEntry icon={saveData.wildCamperUnlocked ? '\uD83D\uDE90' : '\uD83D\uDD12'} title="Wild Camper" discovered={saveData.wildCamperUnlocked} text={saveData.wildCamperUnlocked ? 'Unlocked - Tutorial Park complete!' : 'Locked. Complete Lost Puppy, photograph Rare Owl, and discover Whisper Grove.'}/></section>
  </section></div>;
}
function SpecialEntry({ icon, title, discovered, text }: { icon:string; title:string; discovered:boolean; text:string }) { return <article className={discovered ? 'journal-entry' : 'journal-entry undiscovered'}><div className="animal-emoji" aria-hidden="true">{icon}</div><div><h3>{title}</h3><p>{text}</p></div></article>; }
function PhotoProgress({ animal, saveData }: { animal:Animal; saveData:SaveData }) {
  const total=getPhotoVariantCount(animal.id); const collected=countCollectedVariants(animal.id,saveData.collectedPhotoVariants);
  if (total===0) return null;
  return <p className="photo-progress"><span>{collected} of {total} photos collected</span><span className="photo-progress-dots" aria-hidden="true">{Array.from({length:total},(_,i)=>(<span key={i} className={i<collected?'collected':''}/>))}</span></p>;
}
function JournalEntry({ animal, saveData }: { animal:Animal; saveData:SaveData }) {
  const photographed=hasPhotographedAnimal(saveData,animal.id); const helped=animal.id==='lost-puppy'&&hasHelpedLostPuppy(saveData); const owlSpotted=animal.id==='rare-owl'&&saveData.rareOwlSpotted; const discovered=photographed||helped||owlSpotted; const locked=!animal.availableInMilestone&&!helped&&!owlSpotted;
  const firstCollected=photographed?getFirstCollectedVariant(animal.id,saveData.collectedPhotoVariants):null;
  const icon=discovered&&firstCollected ? <img className="animal-thumb" src={getPhotoVariantUrl(animal.id,firstCollected)} alt=""/> : <div className="animal-emoji" aria-hidden="true">{discovered ? animal.emoji : locked ? '\uD83D\uDD12' : '\u2B1C'}</div>;
  return <article className={discovered ? 'journal-entry' : 'journal-entry undiscovered'}>{icon}<div><h3>{discovered ? animal.name : locked ? `${animal.name} - later` : animal.name}</h3>{helped ? <><p><strong>Status:</strong> Helped and reunited with owner.</p><p>{animal.funFact}</p></> : null}{!helped&&photographed ? <><p><strong>Habitat:</strong> {animal.habitat}</p><p>{animal.funFact}</p><PhotoProgress animal={animal} saveData={saveData}/>{animal.nonNative ? <p className="invasive-note"><strong>Logged for the park rangers:</strong> {animal.nonNative.impactNote}</p> : null}</> : null}{!helped&&!photographed&&owlSpotted ? <p className="muted">Spotted at the Strange Old Tree. Use the camera to photograph the owl.</p> : null}{!discovered ? <p className="muted">{locked ? 'This entry belongs to a later milestone or quest.' : `Not photographed yet. Explore ${animal.habitat}.`}</p> : null}</div></article>;
}
