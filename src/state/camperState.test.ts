import { describe, expect, it } from 'vitest';
import { acknowledgeCamperIntroduction, clearDestinationPreview, enterWildCamper, returnToTutorialPark, selectDestinationPreview } from './camperState';
import { createDefaultSave } from './saveGame';

describe('Wild Camper 4.1 state',()=>{
  it('blocks camper actions before unlock',()=>{const save=createDefaultSave();expect(enterWildCamper(save)).toEqual(save);expect(selectDestinationPreview(save,'forest')).toEqual(save);expect(acknowledgeCamperIntroduction(save)).toEqual(save);});
  it('records a camper visit and last play area',()=>{const save=enterWildCamper({...createDefaultSave(),wildCamperUnlocked:true});expect(save.camperVisited).toBe(true);expect(save.lastPlayArea).toBe('camper');expect(returnToTutorialPark(save).lastPlayArea).toBe('park');});
  it('persists a destination preview',()=>{const save=selectDestinationPreview({...createDefaultSave(),wildCamperUnlocked:true},'forest');expect(save.selectedDestination).toBe('forest');});
  it('records the first-visit introduction',()=>{const save=acknowledgeCamperIntroduction({...createDefaultSave(),wildCamperUnlocked:true});expect(save.camperIntroductionSeen).toBe(true);});
  it('clears a pinned destination',()=>{const save=clearDestinationPreview({...createDefaultSave(),wildCamperUnlocked:true,selectedDestination:'forest'});expect(save.selectedDestination).toBeNull();});
});
