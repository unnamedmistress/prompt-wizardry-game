import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { logEvent } from '@/lib/analytics';

interface GameStore {
  coins: number;
  stars: number;
  level: number;
  completedChallenges: number;
  completedExperienceIds: string[];
  firstTimeExperiences: string[];
  completeExperience: (id: string, starsEarned: number, coinsEarned: number) => void;
  purchaseHint: (lessonId: string, hintIndex: number, cost: number) => boolean;
  markExperienceAsViewed: (id: string) => void;
  isFirstTime: (id: string) => boolean;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      coins: 0,
      stars: 0,
      level: 1,
      completedChallenges: 0,
      completedExperienceIds: [],
      firstTimeExperiences: [],
      completeExperience: (id, starsEarned, coinsEarned) => {
        set((state) => {
          const alreadyCompleted = state.completedExperienceIds.includes(id);
          const completedChallenges = alreadyCompleted ? state.completedChallenges : state.completedChallenges + 1;
          const level = Math.floor(completedChallenges / 3) + 1;
          return {
            coins: state.coins + coinsEarned,
            stars: state.stars + starsEarned,
            completedChallenges,
            level,
            completedExperienceIds: alreadyCompleted ? state.completedExperienceIds : [...state.completedExperienceIds, id],
          };
        });
        logEvent('lesson_completed', { lessonId: id, stars: starsEarned, coins: coinsEarned });
      },
      purchaseHint: (lessonId, hintIndex, cost) => {
        const { coins } = get();
        if (coins < cost) return false;
        set({ coins: coins - cost });
        logEvent('hint_purchased', { lessonId, hintIndex, cost });
        return true;
      },
      markExperienceAsViewed: (id) => {
        set((state) => ({
          firstTimeExperiences: state.firstTimeExperiences.includes(id) 
            ? state.firstTimeExperiences 
            : [...state.firstTimeExperiences, id]
        }));
      },
      isFirstTime: (id) => {
        return !get().firstTimeExperiences.includes(id);
      },
    }),
    { name: 'promptwizard-store' }
  )
);
