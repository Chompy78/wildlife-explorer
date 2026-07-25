import type { Achievement, AchievementId } from '../types/Achievement';

export const achievements: Record<AchievementId, Achievement> = {
  'tutorial-park-ranger': {
    id: 'tutorial-park-ranger',
    name: 'Tutorial Park Ranger',
    icon: '🎖️',
    description: 'Completed the Tutorial Park ranger quiz after finishing the park.',
  },
};

export const validAchievementIds: AchievementId[] = Object.keys(achievements) as AchievementId[];
