import type { DestinationId, DestinationPreview } from '../types/Destination';

export const destinationPreviews: DestinationPreview[] = [
  { id: 'forest', name: 'Forest', icon: '\uD83C\uDF32', tagline: 'Tall trees and hidden clearings', preview: 'A future wildlife journey through shaded trails and quiet woodland habitats.', status: 'preview', quizEligible: true },
  { id: 'mountains', name: 'Mountains', icon: '\u26F0\uFE0F', tagline: 'High paths and rocky lookouts', preview: 'A future expedition focused on patient observation in cooler high-country habitats.', status: 'preview', quizEligible: true },
  { id: 'lake', name: 'Lake', icon: '\uD83C\uDF0A', tagline: 'Reeds, shorelines, and open water', preview: 'A future journey for water birds, shoreline tracks, and peaceful habitat study.', status: 'preview', quizEligible: true },
  { id: 'safari', name: 'Safari', icon: '\uD83E\uDD92', tagline: 'Wide grasslands and distant wildlife', preview: 'A future long-distance observation trip built around respectful wildlife photography.', status: 'preview', quizEligible: true },
  { id: 'rainforest', name: 'Rainforest', icon: '\uD83C\uDF27\uFE0F', tagline: 'Dense leaves and layered habitats', preview: 'A future expedition where sound, colour, and careful searching reveal many species.', status: 'preview', quizEligible: true },
  { id: 'alien-planet', name: 'Alien Planet', icon: '\uD83E\uDE90', tagline: 'A special far-future mystery', preview: 'A playful future destination preview. This destination is not part of the current playable build.', status: 'preview', quizEligible: false },
  { id: 'desert', name: 'Desert', icon: '\uD83C\uDFDC\uFE0F', tagline: 'Warm dunes and cool nights', preview: 'A future expedition into sand dunes and rocky outcrops, searching for wildlife that hides from the midday sun.', status: 'preview', quizEligible: true },
  { id: 'arctic', name: 'Arctic', icon: '\u2744\uFE0F', tagline: 'Snow, ice, and open sky', preview: 'A future journey across quiet snowfields, watching for wildlife built for the cold.', status: 'preview', quizEligible: true },
  { id: 'coral-reef', name: 'Coral Reef', icon: '\uD83D\uDC20', tagline: 'Bright coral and calm blue water', preview: 'A future underwater expedition through colourful reefs, searching for fish and gentle sea life.', status: 'preview', quizEligible: true },
  { id: 'wetlands', name: 'Wetlands', icon: '\uD83E\uDDA9', tagline: 'Reeds, mangroves, and still water', preview: 'A future journey through quiet marshland, watching herons and other wetland wildlife from a respectful distance.', status: 'preview', quizEligible: true },
  { id: 'coastal', name: 'Coastal', icon: '\uD83E\uDD80', tagline: 'Tide pools and rocky shoreline', preview: 'A future shoreline expedition exploring tide pools and watching seabirds along the coast.', status: 'preview', quizEligible: true },
  { id: 'grassland', name: 'Grassland', icon: '\uD83C\uDF3E', tagline: 'Open plains and rolling grass', preview: 'A future journey across wide grasslands, observing wildlife that grazes and shelters in tall grass.', status: 'preview', quizEligible: true },
  { id: 'taiga', name: 'Taiga', icon: '\uD83D\uDC3A', tagline: 'Cold pines and quiet wilderness', preview: 'A future expedition through snow-dusted conifer forest, searching for wildlife built for long, cold winters.', status: 'preview', quizEligible: true },
  { id: 'volcanic-highlands', name: 'Volcanic Highlands', icon: '\uD83C\uDF0B', tagline: 'Hot springs and steaming ground', preview: 'A future expedition to geothermal highlands, observing wildlife that thrives near hot springs and steam vents.', status: 'preview', quizEligible: true },
];

export function getDestinationById(destinationId: DestinationId | null): DestinationPreview | undefined {
  return destinationId ? destinationPreviews.find((destination) => destination.id === destinationId) : undefined;
}
