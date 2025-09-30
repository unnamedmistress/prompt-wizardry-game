import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Sparkles } from 'lucide-react';

const sentences = [
  { 
    prompt: "Mary had a little", 
    options: ["lamb", "dog", "car", "pizza"],
    correct: 0,
    explanation: "AI predicts 'lamb' because it's seen this phrase millions of times in training data."
  },
  { 
    prompt: "Honesty is the best", 
    options: ["policy", "friend", "choice", "weapon"],
    correct: 0,
    explanation: "The common phrase 'Honesty is the best policy' appears frequently in AI training data."
  },
  { 
    prompt: "Once upon a", 
    options: ["time", "day", "night", "hill"],
    correct: 0,
    explanation: "Story beginnings like 'Once upon a time' are extremely common patterns."
  }
];

export default function WordPredictionGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const { toast } = useToast();
  const { addXp, improveSkill } = usePlayerStore();

  const current = sentences[currentIndex];

  const handleSelect = (index: number) => {
    setSelectedOption(index);
    setShowExplanation(true);

    if (index === current.correct) {
      addXp(20);
      improveSkill('promptClarity', 5);
      toast({ title: '✨ Correct! You understand AI prediction!' });
    } else {
      toast({ title: '🤔 Not quite. AI predicts based on patterns it learned.', variant: 'destructive' });
    }
  };

  const handleNext = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      toast({ title: '🎉 Game Complete!', description: 'You understand word prediction!' });
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-xl font-bold">AI Word Prediction</h3>
          <p className="text-sm text-muted-foreground">What word comes next?</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-lg font-medium">
            {current.prompt} <span className="text-primary">____</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {current.options.map((option, index) => (
            <Button
              key={index}
              variant={selectedOption === index ? (index === current.correct ? "default" : "destructive") : "outline"}
              onClick={() => !showExplanation && handleSelect(index)}
              disabled={showExplanation}
              className="h-auto py-4"
            >
              {option}
              {showExplanation && index === current.correct && (
                <Badge className="ml-2" variant="secondary">✓</Badge>
              )}
            </Button>
          ))}
        </div>

        {showExplanation && (
          <div className="p-4 bg-primary/10 rounded-lg space-y-3">
            <p className="text-sm font-medium">💡 Why this matters:</p>
            <p className="text-sm">{current.explanation}</p>
            <Button onClick={handleNext} className="w-full">
              {currentIndex < sentences.length - 1 ? 'Next Sentence' : 'Complete'}
            </Button>
          </div>
        )}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Question {currentIndex + 1} of {sentences.length}
      </div>
    </Card>
  );
}
