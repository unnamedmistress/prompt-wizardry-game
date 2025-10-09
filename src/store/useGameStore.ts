import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { logEvent } from '@/lib/analytics';

interface AttemptRecord {
  lessonId: string;
  attempts: number;
  hintsUsed: number;
  completed: boolean;
  bestScore: number;
}

interface GameStore {
  coins: number;
  stars: number;
  level: number;
  completedChallenges: number;
  completedExperienceIds: string[];
  firstTimeExperiences: string[];
  // New progression fields
  xp: number;
  wizardRank: string;
  arcaneTokens: number;
  achievements: string[];
  dailyStreak: number;
  lastDailyDate: string | null;
  attemptRecords: Record<string, AttemptRecord>;
  // Existing methods
  completeExperience: (id: string, starsEarned: number, coinsEarned: number) => void;
  purchaseHint: (lessonId: string, hintIndex: number, cost: number) => boolean;
  markExperienceAsViewed: (id: string) => void;
  isFirstTime: (id: string) => boolean;
  // New methods
  addXP: (amount: number) => void;
  unlockAchievement: (achievementId: string) => void;
  recordAttempt: (lessonId: string, score: number, hintsUsed: number, completed: boolean) => void;
  checkDailyStreak: () => void;
  spendArcaneTokens: (amount: number) => boolean;
}

const WIZARD_RANKS = [
  { name: 'Apprentice', minXP: 0, title: 'Apprentice Wizard' },
  { name: 'Initiate', minXP: 100, title: 'Initiate Spellcaster' },
  { name: 'Adept', minXP: 300, title: 'Adept Prompter' },
  { name: 'Sage', minXP: 600, title: 'Sage of Prompts' },
  { name: 'Archmage', minXP: 1000, title: 'Archmage of Wizardry' },
];

function calculateWizardRank(xp: number): string {
  for (let i = WIZARD_RANKS.length - 1; i >= 0; i--) {
    if (xp >= WIZARD_RANKS[i].minXP) {
      return WIZARD_RANKS[i].name;
    }
  }
  return 'Apprentice';
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
      xp: 0,
      wizardRank: 'Apprentice',
      arcaneTokens: 0,
      achievements: [],
      dailyStreak: 0,
      lastDailyDate: null,
      attemptRecords: {},
      
      completeExperience: (id, starsEarned, coinsEarned) => {
        set((state) => {
          const alreadyCompleted = state.completedExperienceIds.includes(id);
          const completedChallenges = alreadyCompleted ? state.completedChallenges : state.completedChallenges + 1;
          const level = Math.floor(completedChallenges / 3) + 1;
          const xpGained = starsEarned * 20;
          const newXP = state.xp + xpGained;
          const tokensEarned = Math.floor(starsEarned / 2);
          
          return {
            coins: state.coins + coinsEarned,
            stars: state.stars + starsEarned,
            completedChallenges,
            level,
            xp: newXP,
            wizardRank: calculateWizardRank(newXP),
            arcaneTokens: state.arcaneTokens + tokensEarned,
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
      
      addXP: (amount) => {
        set((state) => {
          const newXP = state.xp + amount;
          return {
            xp: newXP,
            wizardRank: calculateWizardRank(newXP),
          };
        });
        logEvent('xp_gained', { amount });
      },
      
      unlockAchievement: (achievementId) => {
        set((state) => {
          if (state.achievements.includes(achievementId)) return state;
          logEvent('achievement_unlocked', { achievementId });
          return {
            achievements: [...state.achievements, achievementId],
            arcaneTokens: state.arcaneTokens + 5,
          };
        });
      },
      
      recordAttempt: (lessonId, score, hintsUsed, completed) => {
        set((state) => {
          const existing = state.attemptRecords[lessonId];
          const attempts = existing ? existing.attempts + 1 : 1;
          const bestScore = existing ? Math.max(existing.bestScore, score) : score;
          
          logEvent('attempt_recorded', { lessonId, attempt: attempts, score, hintsUsed, completed });
          
          return {
            attemptRecords: {
              ...state.attemptRecords,
              [lessonId]: {
                lessonId,
                attempts,
                hintsUsed: (existing?.hintsUsed || 0) + hintsUsed,
                completed: completed || (existing?.completed || false),
                bestScore,
              },
            },
          };
        });
      },
      
      checkDailyStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastDailyDate, dailyStreak } = get();
        
        if (lastDailyDate === today) return;
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        set({
          lastDailyDate: today,
          dailyStreak: lastDailyDate === yesterdayStr ? dailyStreak + 1 : 1,
        });
        
        logEvent('daily_streak_updated', { streak: lastDailyDate === yesterdayStr ? dailyStreak + 1 : 1 });
      },
      
      spendArcaneTokens: (amount) => {
        const { arcaneTokens } = get();
        if (arcaneTokens < amount) return false;
        set({ arcaneTokens: arcaneTokens - amount });
        logEvent('tokens_spent', { amount });
        return true;
      },
    }),
    { name: 'promptwizard-store' }
  )
);
