import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { usePromptScoring } from '@/hooks/usePromptScoring';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Target, Sparkles } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  scenario: string;
  requiredElements: string[];
  targetScore: number;
  hints: string[];
}

const challenges: Challenge[] = [
  {
    id: 'c1',
    title: 'The Email Assistant',
    scenario: 'Create a prompt to write a professional apology email to a client about a delayed shipment.',
    requiredElements: ['tone', 'purpose', 'context', 'desired outcome'],
    targetScore: 75,
    hints: [
      'Specify the tone (professional, apologetic)',
      'Include the reason for the delay',
      'Mention what action you\'ll take'
    ]
  },
  {
    id: 'c2',
    title: 'The Code Generator',
    scenario: 'Write a prompt to create a function that validates email addresses.',
    requiredElements: ['programming language', 'input/output', 'requirements'],
    targetScore: 80,
    hints: [
      'Specify the programming language',
      'Describe what makes an email valid',
      'Mention error handling'
    ]
  },
  {
    id: 'c3',
    title: 'The Creative Writer',
    scenario: 'Create a prompt for a short story about a time traveler who can only go back 24 hours.',
    requiredElements: ['genre', 'length', 'character details', 'conflict'],
    targetScore: 75,
    hints: [
      'Specify the story length and style',
      'Describe the main character',
      'Outline the central conflict'
    ]
  }
];

export function PromptBuilderGame() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const { scorePrompt, isScoring } = usePromptScoring();
  const { addXp, addCoins, improveSkill } = usePlayerStore();
  const { toast } = useToast();

  const challenge = challenges[currentChallenge];

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Empty Prompt',
        description: 'Please write a prompt first!',
        variant: 'destructive'
      });
      return;
    }

    setAttempts(attempts + 1);
    const score = await scorePrompt(prompt, challenge.scenario);
    
    if (!score) return;

    const passed = score.overall >= challenge.targetScore;
    
    if (passed) {
      const bonusXp = attempts === 1 ? 50 : 30;
      addXp(bonusXp);
      addCoins(10);
      improveSkill('promptClarity', 15);
      
      toast({
        title: '🎉 Challenge Complete!',
        description: `Score: ${score.overall}/100. Moving to next challenge!`,
      });

      setTimeout(() => {
        if (currentChallenge < challenges.length - 1) {
          setCurrentChallenge(currentChallenge + 1);
          setPrompt('');
          setAttempts(0);
          setShowHints(false);
        }
      }, 2000);
    } else {
      toast({
        title: 'Keep Trying!',
        description: `Score: ${score.overall}/100. Need ${challenge.targetScore}+ to pass.`,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">{challenge.title}</h3>
          <p className="text-sm text-muted-foreground">
            Challenge {currentChallenge + 1} of {challenges.length}
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Target className="w-4 h-4" />
          Target: {challenge.targetScore}+
        </Badge>
      </div>

      <Card className="p-6 space-y-4">
        <div className="bg-accent/50 rounded-lg p-4">
          <h4 className="font-semibold mb-2">Scenario:</h4>
          <p className="text-sm">{challenge.scenario}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Required Elements:</h4>
          <div className="flex flex-wrap gap-2">
            {challenge.requiredElements.map((element) => (
              <Badge key={element} variant="secondary">
                {element}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Your Prompt:</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Write your prompt here..."
            className="min-h-[150px]"
          />
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={handleSubmit} 
            disabled={isScoring}
            className="flex-1"
          >
            {isScoring ? 'Scoring...' : 'Submit Prompt'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowHints(!showHints)}
          >
            {showHints ? 'Hide' : 'Show'} Hints
          </Button>
        </div>

        {showHints && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-primary/10 rounded-lg p-4 space-y-2"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">Hints:</span>
            </div>
            <ul className="space-y-1 text-sm list-disc list-inside">
              {challenge.hints.map((hint, i) => (
                <li key={i}>{hint}</li>
              ))}
            </ul>
          </motion.div>
        )}

        {attempts > 0 && (
          <p className="text-sm text-muted-foreground text-center">
            Attempts: {attempts}
          </p>
        )}
      </Card>
    </div>
  );
}