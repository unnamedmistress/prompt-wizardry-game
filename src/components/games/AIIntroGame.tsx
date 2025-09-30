import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePlayerStore } from '@/store/usePlayerStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, XCircle } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 'q1',
    question: 'What is the most important part of an AI prompt?',
    options: ['Being polite', 'Being specific and clear', 'Using fancy words', 'Making it long'],
    correctAnswer: 1,
    explanation: 'Clarity and specificity help the AI understand exactly what you need!'
  },
  {
    id: 'q2',
    question: 'Which prompt is better for getting a recipe?',
    options: [
      'Give me food',
      'Recipe please',
      'Provide a vegetarian pasta recipe for 4 people under 30 minutes',
      'Cook something'
    ],
    correctAnswer: 2,
    explanation: 'Specific prompts with details (dietary needs, servings, time) get better results!'
  },
  {
    id: 'q3',
    question: 'What should you include when asking AI to write code?',
    options: [
      'Just the feature name',
      'Programming language, requirements, and expected behavior',
      'Ask it to figure it out',
      'Only the deadline'
    ],
    correctAnswer: 1,
    explanation: 'Context about language, requirements, and expected behavior helps AI generate better code!'
  }
];

export function AIIntroGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { toast } = useToast();
  const { addXp, addCoins, improveSkill } = usePlayerStore();

  const handleAnswer = (answerIndex: number) => {
    if (showExplanation) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      const finalScore = (score / questions.length) * 100;
      addXp(finalScore);
      addCoins(Math.floor(finalScore / 10));
      improveSkill('promptClarity', 10);
      
      setCompleted(true);
      toast({
        title: '🎉 Game Complete!',
        description: `You scored ${score}/${questions.length}! Keep learning!`,
      });
    }
  };

  if (completed) {
    return (
      <Card className="p-8 text-center space-y-4">
        <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Congratulations!</h2>
        <p className="text-muted-foreground">
          You've completed the AI Introduction game with a score of {score}/{questions.length}
        </p>
        <Button onClick={() => window.location.reload()}>Play Again</Button>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </span>
        <span className="text-sm font-semibold">Score: {score}/{currentQuestion + (showExplanation ? 1 : 0)}</span>
      </div>

      <Card className="p-6 space-y-6">
        <h3 className="text-xl font-semibold">{question.question}</h3>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <motion.div
              key={index}
              whileHover={!showExplanation ? { scale: 1.02 } : {}}
              whileTap={!showExplanation ? { scale: 0.98 } : {}}
            >
              <Button
                variant={selectedAnswer === index ? (isCorrect ? 'default' : 'destructive') : 'outline'}
                className="w-full justify-start text-left h-auto py-4 px-6 relative"
                onClick={() => handleAnswer(index)}
                disabled={showExplanation}
              >
                <span className="flex-1">{option}</span>
                {showExplanation && index === question.correctAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-green-500 ml-2" />
                )}
                {showExplanation && selectedAnswer === index && !isCorrect && (
                  <XCircle className="w-5 h-5 text-red-500 ml-2" />
                )}
              </Button>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-primary/10 rounded-lg p-4"
            >
              <p className="text-sm">
                <span className="font-semibold">{isCorrect ? '✓ Correct!' : '✗ Not quite.'}</span>
                {' '}{question.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {showExplanation && (
          <Button onClick={handleNext} className="w-full">
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Game'}
          </Button>
        )}
      </Card>
    </div>
  );
}