import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PlayerProfile, Achievement, SkillLevels, LessonSession, AdaptiveDifficulty } from '@/types/game';
import { logEvent } from '@/lib/analytics';

interface PlayerStore extends PlayerProfile {
  // XP and Leveling
  addXp: (amount: number) => void;
  getXpForNextLevel: () => number;
  
  // Currency
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addStars: (amount: number) => void;
  
  // Streaks
  updateStreak: () => void;
  
  // Skills
  improveSkill: (skill: keyof SkillLevels, amount: number) => void;
  getOverallSkillLevel: () => number;
  
  // Achievements
  unlockAchievement: (achievement: Achievement) => void;
  hasAchievement: (id: string) => boolean;
  
  // Sessions
  startLessonSession: (lessonId: string) => void;
  completeLessonSession: (session: LessonSession) => void;
  
  // Adaptive Difficulty
  adaptiveDifficulty: AdaptiveDifficulty;
  updateDifficulty: (score: number) => void;
  
  // Mentor
  selectMentor: (mentorId: string) => void;
  
  // Reset (for testing)
  resetProgress: () => void;
}

const INITIAL_STATE: PlayerProfile = {
  userId: '',
  level: 1,
  xp: 0,
  totalXp: 0,
  coins: 0,
  stars: 0,
  streak: 0,
  lastPlayedDate: new Date().toISOString().split('T')[0],
  skillLevels: {
    promptClarity: 0,
    contextAwareness: 0,
    creativityBalance: 0,
    technicalPrecision: 0,
    ethicalConsideration: 0,
  },
  achievements: [],
  preferences: {
    mentorId: 'genie',
    learningTrack: 'general',
    difficulty: 'adaptive',
    notificationsEnabled: true,
  },
};

const XP_CURVE_BASE = 100;
const XP_CURVE_MULTIPLIER = 1.5;

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,
      adaptiveDifficulty: {
        currentLevel: 1,
        recentPerformance: [],
        suggestedLevel: 1,
        confidenceScore: 0,
      },

      getXpForNextLevel: () => {
        const { level } = get();
        return Math.floor(XP_CURVE_BASE * Math.pow(level, XP_CURVE_MULTIPLIER));
      },

      addXp: (amount) => {
        set((state) => {
          const newXp = state.xp + amount;
          const newTotalXp = state.totalXp + amount;
          const xpNeeded = Math.floor(XP_CURVE_BASE * Math.pow(state.level, XP_CURVE_MULTIPLIER));
          
          let newLevel = state.level;
          let remainingXp = newXp;
          
          // Level up if enough XP
          if (newXp >= xpNeeded) {
            newLevel += 1;
            remainingXp = newXp - xpNeeded;
            
            logEvent('player_level_up', { 
              newLevel, 
              totalXp: newTotalXp 
            });
          }
          
          return {
            xp: remainingXp,
            totalXp: newTotalXp,
            level: newLevel,
          };
        });
      },

      addCoins: (amount) => {
        set((state) => ({ coins: state.coins + amount }));
        logEvent('coins_earned', { amount });
      },

      spendCoins: (amount) => {
        const { coins } = get();
        if (coins < amount) return false;
        
        set({ coins: coins - amount });
        logEvent('coins_spent', { amount });
        return true;
      },

      addStars: (amount) => {
        set((state) => ({ stars: state.stars + amount }));
        logEvent('stars_earned', { amount });
      },

      updateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastPlayedDate, streak } = get();
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        let newStreak = streak;
        
        if (lastPlayedDate === yesterdayStr) {
          // Continued streak
          newStreak += 1;
        } else if (lastPlayedDate !== today) {
          // Broke streak
          newStreak = 1;
        }
        
        set({ streak: newStreak, lastPlayedDate: today });
        
        // Check for streak achievements
        if (newStreak === 3) get().unlockAchievement({
          id: 'streak_3',
          type: 'streak_3',
          title: 'On a Roll!',
          description: 'Completed lessons 3 days in a row',
          icon: '🔥',
          rarity: 'common',
          earnedAt: new Date().toISOString(),
        });
        
        if (newStreak === 7) get().unlockAchievement({
          id: 'streak_7',
          type: 'streak_7',
          title: 'Week Warrior',
          description: 'Completed lessons 7 days in a row',
          icon: '🔥',
          rarity: 'rare',
          earnedAt: new Date().toISOString(),
        });
        
        logEvent('streak_updated', { streak: newStreak });
      },

      improveSkill: (skill, amount) => {
        set((state) => ({
          skillLevels: {
            ...state.skillLevels,
            [skill]: Math.min(100, state.skillLevels[skill] + amount),
          },
        }));
        logEvent('skill_improved', { skill, amount });
      },

      getOverallSkillLevel: () => {
        const { skillLevels } = get();
        const total = Object.values(skillLevels).reduce((sum, val) => sum + val, 0);
        return Math.floor(total / Object.keys(skillLevels).length);
      },

      unlockAchievement: (achievement) => {
        const { achievements } = get();
        if (achievements.some(a => a.id === achievement.id)) return;
        
        set((state) => ({
          achievements: [...state.achievements, achievement],
        }));
        
        logEvent('achievement_unlocked', { 
          achievementId: achievement.id,
          rarity: achievement.rarity 
        });
      },

      hasAchievement: (id) => {
        return get().achievements.some(a => a.id === id);
      },

      startLessonSession: (lessonId) => {
        logEvent('lesson_started', { lessonId });
      },

      completeLessonSession: (session) => {
        const store = get();
        
        // Award XP, coins, stars
        store.addXp(session.xpEarned);
        store.addCoins(session.coinsEarned);
        store.addStars(session.starsEarned);
        
        // Improve relevant skills
        Object.entries(session.skillsImproved).forEach(([skill, amount]) => {
          store.improveSkill(skill as keyof SkillLevels, amount || 0);
        });
        
        // Update streak
        store.updateStreak();
        
        // Update adaptive difficulty
        store.updateDifficulty(session.score);
        
        // Check for achievements
        if (session.score >= 95) {
          store.unlockAchievement({
            id: 'perfect_score',
            type: 'perfect_score',
            title: 'Perfectionist',
            description: 'Scored 95% or higher on a lesson',
            icon: '💯',
            rarity: 'rare',
            earnedAt: new Date().toISOString(),
          });
        }
        
        logEvent('lesson_completed', {
          lessonId: session.lessonId,
          score: session.score,
          xpEarned: session.xpEarned,
        });
      },

      updateDifficulty: (score) => {
        set((state) => {
          const recentPerformance = [...state.adaptiveDifficulty.recentPerformance, score].slice(-10);
          const avgPerformance = recentPerformance.reduce((a, b) => a + b, 0) / recentPerformance.length;
          
          let suggestedLevel = state.adaptiveDifficulty.currentLevel;
          
          // Adjust difficulty based on performance
          if (avgPerformance > 85 && recentPerformance.length >= 3) {
            suggestedLevel = Math.min(3, suggestedLevel + 1);
          } else if (avgPerformance < 60 && recentPerformance.length >= 3) {
            suggestedLevel = Math.max(1, suggestedLevel - 1);
          }
          
          return {
            adaptiveDifficulty: {
              currentLevel: state.adaptiveDifficulty.currentLevel,
              recentPerformance,
              suggestedLevel,
              confidenceScore: Math.min(100, recentPerformance.length * 10),
            },
          };
        });
      },

      selectMentor: (mentorId) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            mentorId,
          },
        }));
        logEvent('mentor_selected', { mentorId });
      },

      resetProgress: () => {
        set({
          ...INITIAL_STATE,
          userId: get().userId, // Keep user ID
        });
        logEvent('progress_reset');
      },
    }),
    {
      name: 'promptwizard-player-store',
    }
  )
);
