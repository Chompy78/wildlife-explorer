export type DestinationId = 'forest' | 'mountains' | 'lake' | 'safari' | 'rainforest' | 'alien-planet';

export type DestinationPreview = {
  id: DestinationId;
  name: string;
  icon: string;
  tagline: string;
  preview: string;
  status: 'preview';
};

export type CamperStationId = 'route-map' | 'field-desk' | 'gear-rack' | 'photo-wall';
