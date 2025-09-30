import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { usePlayerStore } from '@/store/usePlayerStore';
import { getMentorById } from '@/data/mentors';
import { MentorAvatar } from './MentorAvatar';
import { Sparkles } from 'lucide-react';

interface GenieMentorProps {
  context?: 'lesson' | 'challenge' | 'achievement' | 'greeting';
  lessonId?: string;
  performanceScore?: number;
}

export function GenieMentor({ context = 'greeting', lessonId, performanceScore }: GenieMentorProps) {
  const { preferences, level, getOverallSkillLevel } = usePlayerStore();
  const [dialogue, setDialogue] = useState<string>('');
  const [showDialogue, setShowDialogue] = useState(false);

  const mentor = getMentorById(preferences.mentorId);
  
  useEffect(() => {
    generateDialogue();
  }, [context, performanceScore, lessonId]);

  const generateDialogue = () => {
    if (!mentor) return;

    let message = '';
    const skillLevel = getOverallSkillLevel();

    switch (context) {
      case 'greeting':
        message = getGreeting(mentor.voiceTone, level);
        break;
      case 'lesson':
        message = getLessonEncouragement(mentor.voiceTone, lessonId);
        break;
      case 'challenge':
        message = getChallengeMotivation(mentor.voiceTone, skillLevel);
        break;
      case 'achievement':
        message = getAchievementPraise(mentor.voiceTone, performanceScore || 0);
        break;
    }

    setDialogue(message);
    setShowDialogue(true);

    // Auto-hide after 8 seconds
    setTimeout(() => setShowDialogue(false), 8000);
  };

  const getGreeting = (tone: string, level: number): string => {
    const greetings = {
      inspiring: [
        `Welcome back, young wizard! You've reached level ${level} - your journey to mastery continues! ✨`,
        `The path of AI mastery awaits you! At level ${level}, you're making incredible progress! 🌟`,
        `Every prompt is a spell waiting to be cast. Let's make some magic at level ${level}! 🔮`
      ],
      formal: [
        `Greetings, student. Your current level of ${level} indicates substantial progress. Shall we proceed?`,
        `Welcome back. We shall continue your structured education in AI prompt engineering.`,
        `Your analytical skills are developing well. Level ${level} achieved. Let us continue.`
      ],
      casual: [
        `Hey there! Level ${level} looking good! Ready to level up some more? 🚀`,
        `What's up! You're crushing it at level ${level}. Let's keep the momentum going!`,
        `Back for more? Awesome! Level ${level} squad represent! 💪`
      ],
      playful: [
        `Woohoo! Level ${level} adventurer returns! Time for some prompt party! 🎉`,
        `Hey prompt wizard! Level ${level} is just the beginning of your epic journey! ⚡`,
        `Ready to play? You're at level ${level} and the fun is just getting started! 🎮`
      ]
    };

    const messages = greetings[tone as keyof typeof greetings] || greetings.inspiring;
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getLessonEncouragement = (tone: string, lessonId?: string): string => {
    const encouragement = {
      inspiring: [
        'Remember: clarity is power. Every word you choose shapes the AI\'s understanding! 💫',
        'You\'re learning to speak the language of AI. Each lesson brings you closer to mastery! ✨',
        'Great prompts aren\'t written, they\'re crafted. Take your time and be intentional! 🌟'
      ],
      formal: [
        'Precision and specificity are the hallmarks of effective prompt engineering.',
        'Consider the context, structure, and desired output format carefully.',
        'Each component of your prompt serves a specific purpose. Analyze and optimize.'
      ],
      casual: [
        'Don\'t overthink it! Just be clear about what you want and AI will deliver! 🎯',
        'Pro tip: specifics get results. The more details, the better the output!',
        'You got this! Remember to add context and examples when you can! 💪'
      ],
      playful: [
        'Imagine you\'re giving instructions to a super smart but literal friend! 🤖',
        'Prompts are like recipes - the more specific, the tastier the result! 🍰',
        'Let\'s make this prompt SHINE! Add those juicy details! ✨'
      ]
    };

    const messages = encouragement[tone as keyof typeof encouragement] || encouragement.inspiring;
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getChallengeMotivation = (tone: string, skillLevel: number): string => {
    const motivation = {
      inspiring: [
        `Your skill level of ${skillLevel}% shows real dedication. Push yourself further! 🚀`,
        'Challenges are where growth happens. Embrace the difficulty and learn! 💪',
        'Every expert was once a beginner who refused to give up. Keep going! ⭐'
      ],
      formal: [
        `Current skill assessment: ${skillLevel}%. Consistent practice yields measurable improvement.`,
        'Advanced challenges develop critical thinking. Approach systematically.',
        'Each difficulty level targets specific competency development areas.'
      ],
      casual: [
        `${skillLevel}% and climbing! You\'re on fire! Keep pushing those limits! 🔥`,
        'This one\'s tricky, but I know you can crack it! Let\'s gooo! 🎮',
        'Challenges are just XP waiting to be earned. You got this! ⚡'
      ],
      playful: [
        `Skill level ${skillLevel}%? More like skill level AWESOME! Let\'s play! 🎪`,
        'Ooh, a challenge! This is where the magic happens! Ready? 🎭',
        'Time to level up! This challenge is your playground! 🎨'
      ]
    };

    const messages = motivation[tone as keyof typeof motivation] || motivation.inspiring;
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getAchievementPraise = (tone: string, score: number): string => {
    const praise = {
      inspiring: [
        `${score}% excellence! You\'re not just learning, you\'re mastering! 🏆`,
        'Incredible work! Your dedication to prompt mastery is paying off! 🌟',
        'This is what greatness looks like! Keep this momentum going! ✨'
      ],
      formal: [
        `Achievement unlocked. Performance score: ${score}%. Exemplary work.`,
        'Your systematic approach yields consistent results. Well executed.',
        'Competency milestone achieved. Continue applying these principles.'
      ],
      casual: [
        `${score}%?! Okay, show-off! 😄 That\'s seriously impressive!`,
        'You absolutely crushed that! High five! 🙌',
        'Boom! Achievement unlocked! You\'re unstoppable! 💥'
      ],
      playful: [
        `${score}% = LEGENDARY! You\'re on fire! 🔥🎉`,
        'WOW WOW WOW! That was AMAZING! Dance party time! 💃',
        'Achievement GET! You\'re collecting them like Pokémon! ⭐✨'
      ]
    };

    const messages = praise[tone as keyof typeof praise] || praise.inspiring;
    return messages[Math.floor(Math.random() * messages.length)];
  };

  if (!mentor) return null;

  return (
    <AnimatePresence>
      {showDialogue && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 max-w-md"
        >
          <Card className="p-4 bg-gradient-card border-primary/30 shadow-glow">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <MentorAvatar mentor={mentor} size="sm" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-primary">{mentor.name}</h4>
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                
                <p className="text-sm text-foreground leading-relaxed">
                  {dialogue}
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDialogue(false)}
              className="absolute top-2 right-2 h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            >
              ✕
            </Button>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
