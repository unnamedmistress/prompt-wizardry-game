import { useState } from "react";
import type { LearningExperience } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle, XCircle, Target, Search, AlertTriangle } from "lucide-react";
import { CelebrationEffect } from "@/components/CelebrationEffect";

interface TruthDetectiveProps {
  onComplete: (score: number) => void;
  onBack: () => void;
  lesson: LearningExperience;
}

const hallucinations = [
  {
    id: 1,
    statements: [
      "The Eiffel Tower is 324 meters tall and was completed in 1889.",
      "Paris has a population of approximately 2.1 million people in the city proper.",
      "The Louvre Museum was built entirely underground in 1995 to preserve historical artifacts."
    ],
    correct: [0, 1],
    lie: 2,
    explanation: "The Louvre Museum was not built underground in 1995. It's a historic palace that became a museum in 1793, with the famous glass pyramid added in 1989."
  },
  {
    id: 2,
    statements: [
      "ChatGPT was released by OpenAI in November 2022.",
      "Large Language Models can process and generate text in multiple languages.",
      "GPT-4 contains exactly 175 trillion parameters, making it the largest AI model ever created."
    ],
    correct: [0, 1],
    lie: 2,
    explanation: "GPT-4's exact parameter count hasn't been publicly disclosed by OpenAI, and 175 trillion is not accurate. GPT-3 had 175 billion parameters."
  },
  {
    id: 3,
    statements: [
      "The human brain contains approximately 86 billion neurons.",
      "Neurons communicate through electrical and chemical signals called synapses.",
      "The average human uses only 10% of their brain capacity at any given time."
    ],
    correct: [0, 1],
    lie: 2,
    explanation: "The '10% brain usage' is a persistent myth. Humans actually use virtually all of their brain, with different areas active at different times."
  }
];

export const TruthDetective = ({ lesson, onComplete, onBack }: TruthDetectiveProps) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedStatements, setSelectedStatements] = useState<number[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [hoveredStatement, setHoveredStatement] = useState<number | null>(null);

  const currentHallucination = hallucinations[currentRound];

  const handleStatementSelect = (index: number) => {
    if (showExplanation) return;
    
    if (selectedStatements.includes(index)) {
      setSelectedStatements(selectedStatements.filter(i => i !== index));
    } else if (selectedStatements.length < 2) {
      setSelectedStatements([...selectedStatements, index]);
    }
  };

  const handleSubmit = () => {
    if (selectedStatements.length !== 2) {
      toast("Please select exactly 2 true statements!");
      return;
    }

    const isCorrect = selectedStatements.every(index => 
      currentHallucination.correct.includes(index)
    );

    if (isCorrect) {
      setScore(score + 100);
      setShowCelebration(true);
      toast("Correct! Great fact-checking skills! 🎉");
    } else {
      toast("Not quite right. Let's see the explanation.");
    }

    setShowExplanation(true);
  };

  const handleNextRound = () => {
    if (currentRound < hallucinations.length - 1) {
      setCurrentRound(currentRound + 1);
      setSelectedStatements([]);
      setShowExplanation(false);
    } else {
      setGameComplete(true);
      onComplete(score);
    }
  };

  if (gameComplete) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl">🎯 Truth Detective Complete!</CardTitle>
            <CardDescription>Final Score: {score} points</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You've mastered the art of spotting AI hallucinations!</p>
            <Button onClick={onBack}>Continue Learning</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {showCelebration && (
        <CelebrationEffect
          type="stars"
          amount={100}
          onComplete={() => setShowCelebration(false)}
        />
      )}
      
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Search className="w-7 h-7 text-primary animate-pulse" />
          Truth Detective
        </h2>
        <p className="text-muted-foreground">Find the 2 true statements and identify the AI hallucination</p>
        <div className="text-sm text-muted-foreground">
          Round {currentRound + 1} of {hallucinations.length} | Score: {score}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Which 2 statements are TRUE?</CardTitle>
          <CardDescription>
            AI sometimes generates false information that sounds convincing. Select the 2 true statements.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentHallucination.statements.map((statement, index) => {
            const isSelected = selectedStatements.includes(index);
            const isCorrect = currentHallucination.correct.includes(index);
            const isLie = index === currentHallucination.lie;
            const isHovered = hoveredStatement === index;
            const showAsCorrect = showExplanation && isCorrect;
            const showAsLie = showExplanation && isLie;
            
            return (
              <div
                key={index}
                className={`relative p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 transform ${
                  isSelected && !showExplanation
                    ? 'border-primary bg-primary/10 scale-102 shadow-md'
                    : 'border-muted hover:border-primary/50 hover:scale-101'
                } ${
                  showAsCorrect
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-green-200'
                    : showAsLie
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-red-200 animate-pulse-hint'
                      : ''
                }`}
                onClick={() => handleStatementSelect(index)}
                onMouseEnter={() => !showExplanation && setHoveredStatement(index)}
                onMouseLeave={() => setHoveredStatement(null)}
              >
                {/* Detective magnifying glass overlay when hovering */}
                {isHovered && !showExplanation && (
                  <div className="absolute -top-3 -right-3 animate-bounce-in">
                    <Search className="w-8 h-8 text-primary drop-shadow-lg" />
                  </div>
                )}
                
                {/* Suspicion meter for lie statement */}
                {!showExplanation && isLie && isHovered && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 animate-fade-in">
                    <div className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <AlertTriangle className="w-3 h-3" />
                      Suspicious?
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {showExplanation ? (
                      isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600 animate-scale-in" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600 animate-scale-in" />
                      )
                    ) : (
                      <div className={`w-6 h-6 rounded-full border-2 transition-all ${
                        isSelected
                          ? 'bg-primary border-primary shadow-sm scale-110'
                          : 'border-muted-foreground'
                      }`} />
                    )}
                  </div>
                  <p className="text-sm flex-1 leading-relaxed">{statement}</p>
                </div>
              </div>
            );
          })}

          {showExplanation && (
            <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl animate-fade-in">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Why This Was a Hallucination:
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{currentHallucination.explanation}</p>
              <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300">
                <strong>💡 Detective Tip:</strong> Always verify claims that sound too specific or surprising. Real facts can usually be cross-referenced with multiple credible sources.
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Back to Games
            </Button>
            {!showExplanation ? (
              <Button 
                onClick={handleSubmit} 
                disabled={selectedStatements.length !== 2}
                className="flex-1"
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNextRound} className="flex-1">
                {currentRound < hallucinations.length - 1 ? 'Next Round' : 'Complete Game'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};