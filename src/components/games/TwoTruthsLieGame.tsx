import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { usePlayerStore } from '@/store/usePlayerStore';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const rounds = [
  {
    question: "Which claim about AI is FALSE?",
    options: [
      "A lawyer used AI and cited cases the court could not find",
      "A search feature once suggested adding glue to pizza",
      "Every hospital on Earth banned all AI forever"
    ],
    lie: 2,
    explanation: "C is false. While some hospitals have restrictions, there's no global ban. A & B are real incidents showing AI can hallucinate or give absurd advice."
  },
  {
    question: "Which statement about AI responses is FALSE?",
    options: [
      "AI can sound confident even when completely wrong",
      "AI always knows when it doesn't have enough information",
      "AI generates responses based on probability patterns"
    ],
    lie: 1,
    explanation: "B is false. AI doesn't 'know' its limitations - it generates text based on patterns and can confidently state incorrect information."
  },
  {
    question: "Which is FALSE about prompt engineering?",
    options: [
      "Adding 'please' can change AI's response tone",
      "More specific prompts generally get better results",
      "AI understands your intent even with vague prompts"
    ],
    lie: 2,
    explanation: "C is false. AI doesn't 'understand' - it matches patterns. Vague prompts lead to generic or off-target responses."
  }
];

export default function TwoTruthsLieGame() {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();
  const { addXp, improveSkill } = usePlayerStore();

  const round = rounds[currentRound];

  const handleSelect = (index: number) => {
    setSelectedOption(index);
    setShowReveal(true);

    if (index === round.lie) {
      setScore(score + 1);
      addXp(30);
      improveSkill('contextAwareness', 7);
      improveSkill('ethicalConsideration', 5);
      toast({ title: '✅ Correct! You spotted the lie!' });
    } else {
      toast({ title: '❌ Not quite. That one is actually true!', variant: 'destructive' });
    }
  };

  const handleNext = () => {
    if (currentRound < rounds.length - 1) {
      setCurrentRound(currentRound + 1);
      setSelectedOption(null);
      setShowReveal(false);
    } else {
      toast({ 
        title: '🎉 Game Complete!', 
        description: `You got ${score + (selectedOption === round.lie ? 1 : 0)} out of ${rounds.length} correct!` 
      });
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Two Truths and a Lie</h3>
          <p className="text-sm text-muted-foreground">Spot the false claim about AI</p>
        </div>
        <Badge variant="secondary">Score: {score}/{currentRound + (showReveal ? 1 : 0)}</Badge>
      </div>

      <div className="p-4 bg-muted rounded-lg">
        <p className="text-lg font-medium text-center mb-4">{round.question}</p>
      </div>

      <div className="space-y-3">
        {round.options.map((option, index) => {
          const isLie = index === round.lie;
          const isSelected = selectedOption === index;
          
          return (
            <Button
              key={index}
              variant={!showReveal ? "outline" : (isLie ? "destructive" : "default")}
              onClick={() => !showReveal && handleSelect(index)}
              disabled={showReveal}
              className="w-full h-auto py-4 px-4 text-left justify-start relative"
            >
              <div className="flex items-start gap-3 flex-1">
                <Badge variant="outline" className="mt-1">{String.fromCharCode(65 + index)}</Badge>
                <span className="flex-1">{option}</span>
                {showReveal && (
                  isLie ? 
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0" /> : 
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                )}
              </div>
            </Button>
          );
        })}
      </div>

      {showReveal && (
        <div className="space-y-4">
          <div className="p-4 bg-primary/10 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              <p className="text-sm font-medium">Why it matters:</p>
            </div>
            <p className="text-sm">{round.explanation}</p>
          </div>

          <Button onClick={handleNext} className="w-full">
            {currentRound < rounds.length - 1 ? 'Next Round' : 'Complete Game'}
          </Button>
        </div>
      )}

      <div className="text-center text-sm text-muted-foreground">
        Round {currentRound + 1} of {rounds.length}
      </div>
    </Card>
  );
}
