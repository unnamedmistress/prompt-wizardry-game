import { LearningTrackInfo } from '@/types/game';

export const LEARNING_TRACKS: LearningTrackInfo[] = [
  {
    id: 'general',
    name: 'General AI Mastery',
    description: 'Comprehensive prompt engineering for everyday AI use',
    icon: '🎓',
    color: 'hsl(270 70% 55%)',
    skills: [
      'Prompt clarity and structure',
      'Context setting',
      'Effective communication with AI',
      'Debugging AI responses',
      'General purpose prompting'
    ],
    unlockLevel: 1
  },
  {
    id: 'business',
    name: 'Business & Marketing',
    description: 'AI for business strategy, marketing campaigns, and professional communication',
    icon: '💼',
    color: 'hsl(210 80% 50%)',
    skills: [
      'Marketing copy generation',
      'Business strategy prompts',
      'Data analysis requests',
      'Professional email drafting',
      'ROI-focused AI utilization'
    ],
    unlockLevel: 3
  },
  {
    id: 'creative',
    name: 'Creative & Media',
    description: 'Storytelling, content creation, and artistic AI applications',
    icon: '🎨',
    color: 'hsl(340 80% 60%)',
    skills: [
      'Story and narrative generation',
      'Character development',
      'Creative brainstorming',
      'Content ideation',
      'Artistic direction prompts'
    ],
    unlockLevel: 5
  },
  {
    id: 'technical',
    name: 'Technical & Research',
    description: 'Code generation, documentation, and research-focused AI workflows',
    icon: '💻',
    color: 'hsl(140 80% 50%)',
    skills: [
      'Code generation prompts',
      'Technical documentation',
      'Research synthesis',
      'Algorithm explanation',
      'Debugging assistance'
    ],
    unlockLevel: 7
  },
  {
    id: 'personal',
    name: 'Personal Productivity',
    description: 'Life organization, learning assistance, and personal development',
    icon: '⚡',
    color: 'hsl(45 100% 55%)',
    skills: [
      'Task planning and organization',
      'Learning acceleration',
      'Personal goal setting',
      'Decision making support',
      'Life optimization'
    ],
    unlockLevel: 10
  }
];

export const getTrackById = (id: string): LearningTrackInfo | undefined => {
  return LEARNING_TRACKS.find(t => t.id === id);
};

export const getTracksForLevel = (level: number): LearningTrackInfo[] => {
  return LEARNING_TRACKS.filter(t => t.unlockLevel <= level);
};
