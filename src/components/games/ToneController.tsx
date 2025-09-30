import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Smile, Frown } from 'lucide-react';

interface ToneChallenge {
  message: string;
  targetTone: 'formal' | 'casual' | 'friendly' | 'professional' | 'enthusiastic';
  context: string;
}

const challenges: ToneChallenge[] = [
  {
    message: 'We need to discuss the project deadline.',
    targetTone: 'professional',
    context: 'Email to your manager'
  },
  {
    message: 'Check out this cool feature!',
    targetTone: 'enthusiastic',
    context: 'Marketing copy'
  },
  {
    message: 'Thank you for your inquiry.',
    targetTone: 'formal',
    context: 'Customer service response'
  }
];

export function ToneController() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userPrompt, setUserPrompt] = useState('');
  const [formalityLevel, setFormalityLevel] = useState([50]);
  const { toast } = useToast();
  const { addXp, improveSkill } = usePlayerStore();

  const challenge = challenges[currentChallenge];

  const handleSubmit = () => {
    const hasProperTone = userPrompt.length > 20;
    
    if (hasProperTone) {
      addXp(25);
      improveSkill('creativityBalance', 10);
      
      toast({
        title: '✓ Great Tone Control!',
        description: 'Moving to next challenge...',
      });

      setTimeout(() => {
        if (currentChallenge < challenges.length - 1) {
          setCurrentChallenge(currentChallenge + 1);
          setUserPrompt('');
          setFormalityLevel([50]);
        }
      }, 1500);
    } else {
      toast({
        title: 'Try Again',
        description: 'Your prompt needs more detail to match the target tone.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Tone Controller</h3>
        <p className="text-sm text-muted-foreground">
          Master the art of adjusting tone in AI prompts
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="bg-accent/50 rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold">Original Message:</h4>
              <p className="text-sm mt-1">{challenge.message}</p>
            </div>
            <Badge>{challenge.targetTone}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Context: {challenge.context}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium mb-3 block">
            Adjust the Formality:
          </label>
          <div className="flex items-center gap-4">
            <Smile className="w-5 h-5 text-primary" />
            <Slider
              value={formalityLevel}
              onValueChange={setFormalityLevel}
              max={100}
              step={1}
              className="flex-1"
            />
            <Frown className="w-5 h-5 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            {formalityLevel[0] < 33 ? 'Casual' : formalityLevel[0] < 66 ? 'Balanced' : 'Formal'}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Write a prompt to achieve the <Badge variant="outline" className="ml-1">{challenge.targetTone}</Badge> tone:
          </label>
          <Textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder={`e.g., "Rewrite this message in a ${challenge.targetTone} tone for ${challenge.context}..."`}
            className="min-h-[120px]"
          />
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Submit
        </Button>

        <div className="text-xs text-muted-foreground bg-muted/50 rounded p-3">
          <p className="font-semibold mb-1">💡 Tip:</p>
          <p>Include specific tone instructions in your prompt, like "use a {challenge.targetTone} tone" or describe the audience and context.</p>
        </div>
      </Card>
    </div>
  );
}