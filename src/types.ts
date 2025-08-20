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
}
