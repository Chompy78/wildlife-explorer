import { describe, expect, it } from 'vitest';
import { migrateSaveData } from './saveMigration';
import { CURRENT_SAVE_SCHEMA_VERSION } from '../types/SaveData';

describe('Milestone 4.1 save migration',()=>{
  it('migrates a Milestone 4 save without losing camper progress',()=>{const save=migrateSaveData({wildCamperUnlocked:true,camperVisited:true,lastPlayArea:'camper',selectedDestination:'forest'});expect(save.schemaVersion).toBe(CURRENT_SAVE_SCHEMA_VERSION);expect(save.camperVisited).toBe(true);expect(save.selectedDestination).toBe('forest');expect(save.camperIntroductionSeen).toBe(false);});
  it('rejects locked camper-only state',()=>{const save=migrateSaveData({wildCamperUnlocked:false,camperVisited:true,camperIntroductionSeen:true,lastPlayArea:'camper',selectedDestination:'forest'});expect(save.camperVisited).toBe(false);expect(save.camperIntroductionSeen).toBe(false);expect(save.lastPlayArea).toBe('park');expect(save.selectedDestination).toBeNull();});
});
