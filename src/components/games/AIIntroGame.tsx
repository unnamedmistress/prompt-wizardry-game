import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Sparkles, Brain, RefreshCw } from 'lucide-react';
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface DraggableWordProps {
  id: string;
  word: string;
  isUsed: boolean;
}

interface SentencePrompt {
  text: string;
  options: string[];
  correct: string;
  explanation: string;
}

const sentences: SentencePrompt[] = [
  {
    text: "Mary had a little",
    options: ["lamb", "dog", "car", "pizza"],
    correct: "lamb",
    explanation: "AI predicts 'lamb' because it has seen the phrase 'Mary had a little lamb' millions of times in its training data!"
  },
  {
    text: "Honesty is the best",
    options: ["policy", "friend", "choice", "weapon"],
    correct: "policy",
    explanation: "The phrase 'Honesty is the best policy' is a common saying that appears frequently in text, so AI predicts it easily."
  },
  {
    text: "Once upon a",
    options: ["time", "day", "night", "hill"],
    correct: "time",
    explanation: "Story beginnings like 'Once upon a time' are extremely common patterns that AI recognizes instantly."
  }
];

function DraggableWord({ id, word, isUsed }: DraggableWordProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled: isUsed,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-move ${
        isUsed
          ? 'bg-muted text-muted-foreground cursor-not-allowed'
          : 'bg-primary text-primary-foreground hover:scale-105 shadow-sm'
      }`}
    >
      {word}
    </div>
  );
}

function DropZone({ onDrop, droppedWord }: { onDrop: (word: string) => void; droppedWord: string | null }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'drop-zone',
  });

  return (
    <div
      ref={setNodeRef}
      className={`inline-flex items-center justify-center min-w-[120px] h-12 px-4 rounded-lg border-2 border-dashed transition-all ${
        isOver
          ? 'border-primary bg-primary/10 scale-105'
          : droppedWord
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/30 bg-muted/20'
      }`}
    >
      {droppedWord ? (
        <span className="font-bold text-lg text-primary">{droppedWord}</span>
      ) : (
        <span className="text-muted-foreground text-sm">Drop here</span>
      )}
    </div>
  );
}

export function AIIntroGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [droppedWord, setDroppedWord] = useState<string | null>(null);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();
  const { addXp, addCoins, improveSkill } = usePlayerStore();

  const current = sentences[currentIndex];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && over.id === 'drop-zone') {
      const word = active.id as string;
      setDroppedWord(word);
      setUsedWords([...usedWords, word]);
    }
  };

  const handleCheck = () => {
    if (!droppedWord) {
      toast({ title: '⚠️ Drag a word first!', variant: 'destructive' });
      return;
    }

    const correct = droppedWord === current.correct;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(score + 1);
      addXp(30);
      improveSkill('promptClarity', 8);
      toast({ title: '✨ Correct! You think like AI!' });
    } else {
      toast({ title: '🤔 Not quite. See why below.', variant: 'destructive' });
    }
  };

  const handleNext = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setDroppedWord(null);
      setUsedWords([]);
      setShowFeedback(false);
      setIsCorrect(false);
    } else {
      addCoins(score * 20);
      setCompleted(true);
      toast({
        title: '🎉 You understand AI prediction!',
        description: `Score: ${score}/${sentences.length}`,
      });
    }
  };

  const handleReset = () => {
    setDroppedWord(null);
    setUsedWords([]);
    setShowFeedback(false);
    setIsCorrect(false);
  };

  if (completed) {
    return (
      <Card className="p-8 text-center space-y-6">
        <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center animate-scale-in">
          <Brain className="w-12 h-12 text-primary-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">You Did It!</h2>
          <p className="text-lg text-muted-foreground">
            You scored {score}/{sentences.length} - You're thinking like an AI!
          </p>
        </div>
        <div className="p-4 bg-primary/10 rounded-lg space-y-2">
          <p className="text-sm font-medium">💡 Key Takeaway:</p>
          <p className="text-sm text-muted-foreground">
            AI doesn't "know" facts - it predicts the most likely next word based on patterns it learned from billions of sentences.
          </p>
        </div>
        <Button onClick={() => window.location.reload()} size="lg">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </Card>
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI Word Prediction
          </Badge>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} of {sentences.length}
          </span>
        </div>

        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">What word comes next?</h3>
            </div>
            
            <p className="text-sm text-muted-foreground">
              AI predicts words based on patterns. Drag the word you think AI would choose:
            </p>
          </div>

          {/* Chatbot-style prompt display */}
          <div className="p-6 bg-gradient-card rounded-lg border border-primary/20">
            <div className="flex items-baseline gap-3 text-xl font-medium flex-wrap">
              <span>{current.text}</span>
              <DropZone onDrop={() => {}} droppedWord={droppedWord} />
            </div>
          </div>

          {/* Draggable word options */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Drag one of these words:</p>
            <div className="flex flex-wrap gap-3">
              {current.options.map((word) => (
                <DraggableWord
                  key={word}
                  id={word}
                  word={word}
                  isUsed={usedWords.includes(word)}
                />
              ))}
            </div>
          </div>

          {/* Action buttons */}
          {!showFeedback ? (
            <div className="flex gap-3">
              <Button onClick={handleCheck} className="flex-1" size="lg">
                Check Answer
              </Button>
              {droppedWord && (
                <Button onClick={handleReset} variant="outline" size="lg">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border-2 ${
                isCorrect 
                  ? 'bg-green-50 border-green-500' 
                  : 'bg-red-50 border-red-500'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {isCorrect ? (
                    <Badge className="bg-green-500">✓ Correct!</Badge>
                  ) : (
                    <Badge variant="destructive">✗ Not quite</Badge>
                  )}
                  {!isCorrect && (
                    <span className="text-sm text-muted-foreground">
                      AI would pick: <span className="font-bold text-foreground">{current.correct}</span>
                    </span>
                  )}
                </div>
                <p className="text-sm">{current.explanation}</p>
              </div>

              <Button onClick={handleNext} className="w-full" size="lg">
                {currentIndex < sentences.length - 1 ? 'Next Sentence →' : 'Complete'}
              </Button>
            </div>
          )}
        </Card>

        {/* Progress indicator */}
        <div className="flex gap-2 justify-center">
          {sentences.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx < currentIndex
                  ? 'w-8 bg-green-500'
                  : idx === currentIndex
                  ? 'w-12 bg-primary'
                  : 'w-6 bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
}
