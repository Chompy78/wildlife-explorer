export type LostPuppyQuestProgress = {
  started: boolean;
  foundPawprints: boolean;
  foundToy: boolean;
  foundPuppy: boolean;
  completed: boolean;
};

export type QuestId = 'lost-puppy';

export type Quest = {
  id: QuestId;
  name: string;
  description: string;
  tone: string;
  steps: string[];
};
