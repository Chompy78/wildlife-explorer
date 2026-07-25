import type { DestinationId, DestinationPreview } from '../types/Destination';

export const destinationPreviews: DestinationPreview[] = [
  { id: 'forest', name: 'Forest', icon: '\uD83C\uDF32', tagline: 'Tall trees and hidden clearings', preview: 'A future wildlife journey through shaded trails and quiet woodland habitats.', status: 'preview', quizEligible: true },
  { id: 'mountains', name: 'Mountains', icon: '\u26F0\uFE0F', tagline: 'High paths and rocky lookouts', preview: 'A future expedition focused on patient observation in cooler high-country habitats.', status: 'preview', quizEligible: true },
  { id: 'lake', name: 'Lake', icon: '\uD83C\uDF0A', tagline: 'Reeds, shorelines, and open water', preview: 'A future journey for water birds, shoreline tracks, and peaceful habitat study.', status: 'preview', quizEligible: true },
  { id: 'safari', name: 'Safari', icon: '\uD83E\uDD92', tagline: 'Wide grasslands and distant wildlife', preview: 'A future long-distance observation trip built around respectful wildlife photography.', status: 'preview', quizEligible: true },
  { id: 'rainforest', name: 'Rainforest', icon: '\uD83C\uDF27\uFE0F', tagline: 'Dense leaves and layered habitats', preview: 'A future expedition where sound, colour, and careful searching reveal many species.', status: 'preview', quizEligible: true },
  { id: 'alien-planet', name: 'Alien Planet', icon: '\uD83E\uDE90', tagline: 'A special far-future mystery', preview: 'A playful future destination preview. This destination is not part of the current playable build.', status: 'preview', quizEligible: false },
];

export function getDestinationById(destinationId: DestinationId | null): DestinationPreview | undefined {
  return destinationId ? destinationPreviews.find((destination) => destination.id === destinationId) : undefined;
}
