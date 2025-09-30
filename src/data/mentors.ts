import { AIMentor } from '@/types/game';

export const AI_MENTORS: AIMentor[] = [
  {
    id: 'genie',
    name: 'Genie',
    title: 'The Prompt Wizard',
    personality: 'Wise and encouraging, loves to teach through stories and examples',
    specialization: 'general',
    avatar: '🧞‍♂️',
    catchphrase: 'Every great prompt starts with a clear intention!',
    voiceTone: 'inspiring',
    unlockLevel: 1,
  },
  {
    id: 'professor-circuit',
    name: 'Professor Circuit',
    title: 'Master of Logic',
    personality: 'Academic and thorough, focuses on systematic thinking',
    specialization: 'technical',
    avatar: '🤖',
    catchphrase: 'Precision in prompts, excellence in output!',
    voiceTone: 'formal',
    unlockLevel: 5,
  },
  {
    id: 'pixel',
    name: 'Pixel',
    title: 'Creative Catalyst',
    personality: 'Energetic and artistic, encourages bold experimentation',
    specialization: 'creative',
    avatar: '🎨',
    catchphrase: 'Let your imagination guide your prompts!',
    voiceTone: 'playful',
    unlockLevel: 3,
  },
  {
    id: 'sage',
    name: 'Sage',
    title: 'Business Strategist',
    personality: 'Practical and results-oriented, focuses on real-world applications',
    specialization: 'business',
    avatar: '💼',
    catchphrase: 'Smart prompts drive smart business decisions.',
    voiceTone: 'casual',
    unlockLevel: 7,
  },
  {
    id: 'spark',
    name: 'Spark',
    title: 'Innovation Guide',
    personality: 'Fast-paced and innovative, loves efficiency and productivity',
    specialization: 'personal',
    avatar: '⚡',
    catchphrase: 'Speed meets intelligence in perfect prompts!',
    voiceTone: 'playful',
    unlockLevel: 10,
  },
];

export const getMentorById = (id: string): AIMentor | undefined => {
  return AI_MENTORS.find(m => m.id === id);
};

export const getMentorsForLevel = (level: number): AIMentor[] => {
  return AI_MENTORS.filter(m => m.unlockLevel <= level);
};
