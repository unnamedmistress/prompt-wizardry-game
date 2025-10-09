export interface LearningExperience {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  icon: string;
  objective: string;
  whatYoullLearn: string[];
  hints: string[];
  goodExamples: string[];
  badExamples: string[];
  gameComponent: string;
  requiredStars?: number;
  // New fields for roadmap alignment
  moduleTier?: "Initiate" | "Adept" | "Archmage";
  maxAttempts?: number;
  evaluationRubric?: EvaluationCriteria[];
  hintPenalty?: number;
}

export interface EvaluationCriteria {
  name: string;
  description: string;
  weight: number;
  keywords?: string[];
}

export interface WizardRank {
  name: string;
  minXP: number;
  title: string;
  icon: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  reward: number;
}

export interface DailyTrial {
  id: string;
  date: string;
  challenge: string;
  timeLimit: number;
  completed: boolean;
  score?: number;
}
