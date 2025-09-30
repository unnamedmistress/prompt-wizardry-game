// Enhanced game system types

export interface PlayerProfile {
  userId: string;
  level: number;
  xp: number;
  totalXp: number;
  coins: number;
  stars: number;
  streak: number;
  lastPlayedDate: string;
  skillLevels: SkillLevels;
  achievements: Achievement[];
  preferences: PlayerPreferences;
}

export interface SkillLevels {
  promptClarity: number; // 0-100
  contextAwareness: number;
  creativityBalance: number;
  technicalPrecision: number;
  ethicalConsideration: number;
}

export interface Achievement {
  id: string;
  type: AchievementType;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: string;
  progress?: number;
  maxProgress?: number;
}

export type AchievementType = 
  | 'first_lesson'
  | 'streak_3'
  | 'streak_7'
  | 'streak_30'
  | 'perfect_score'
  | 'ai_expert'
  | 'prompt_master'
  | 'speed_demon'
  | 'completionist'
  | 'social_butterfly';

export interface PlayerPreferences {
  mentorId: string;
  learningTrack: LearningTrack;
  difficulty: 'adaptive' | 'easy' | 'medium' | 'hard';
  notificationsEnabled: boolean;
}

export type LearningTrack = 
  | 'business'
  | 'creative'
  | 'technical'
  | 'personal'
  | 'general';

export interface LearningTrackInfo {
  id: LearningTrack;
  name: string;
  description: string;
  icon: string;
  color: string;
  skills: string[];
  unlockLevel: number;
}

export interface PromptScore {
  overall: number; // 0-100
  clarity: number;
  specificity: number;
  context: number;
  structure: number;
  feedback: PromptFeedback[];
  suggestions: string[];
  aiResponse?: string;
}

export interface PromptFeedback {
  type: 'strength' | 'weakness' | 'tip';
  category: string;
  message: string;
  impact: 'high' | 'medium' | 'low';
}

export interface AIMentor {
  id: string;
  name: string;
  title: string;
  personality: string;
  specialization: LearningTrack;
  avatar: string;
  catchphrase: string;
  voiceTone: 'formal' | 'casual' | 'inspiring' | 'playful';
  unlockLevel: number;
}

export interface LessonSession {
  lessonId: string;
  startedAt: string;
  completedAt?: string;
  score: number;
  xpEarned: number;
  coinsEarned: number;
  starsEarned: number;
  skillsImproved: Partial<SkillLevels>;
  promptsSubmitted: number;
  bestPromptScore?: PromptScore;
  mistakes: LessonMistake[];
}

export interface LessonMistake {
  prompt: string;
  issue: string;
  correction: string;
  lessonLearned: string;
}

export interface AdaptiveDifficulty {
  currentLevel: number;
  recentPerformance: number[]; // Last 10 scores
  suggestedLevel: number;
  confidenceScore: number;
}
