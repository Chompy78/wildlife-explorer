export type DestinationId =
  | 'forest'
  | 'mountains'
  | 'lake'
  | 'safari'
  | 'rainforest'
  | 'alien-planet'
  | 'desert'
  | 'arctic'
  | 'coral-reef'
  | 'wetlands'
  | 'coastal'
  | 'grassland'
  | 'taiga'
  | 'volcanic-highlands';

export type DestinationPreview = {
  id: DestinationId;
  name: string;
  icon: string;
  tagline: string;
  preview: string;
  status: 'preview';
  // Whether this destination is offered as an answer choice in the "where does it belong" habitat
  // quiz (see HabitatQuiz.tsx). Real-world habitats are true; whimsical/non-real ones (Alien Planet,
  // and any future Dinosaur biome) must be false so the quiz never offers them as a serious answer.
  quizEligible: boolean;
};

export type CamperStationId = 'route-map' | 'field-desk' | 'gear-rack' | 'photo-wall';
