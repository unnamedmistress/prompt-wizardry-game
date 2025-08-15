import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Search, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface DetailDetectiveProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

const prompts = [
  {
    id: 1,
    prompt: "Write a product description for a smart home device.",
    missingDetails: [
      "Target audience (tech-savvy vs beginners)",
      "Specific device type (thermostat, doorbell, etc.)",
      "Key features to highlight",
      "Desired length and tone",
      "Platform/format requirements"
    ],
    correctCount: 5
  },
  {
    id: 2,
    prompt: "Create a social media post about our new restaurant.",
    missingDetails: [
      "Restaurant type and cuisine",
      "Target social platform (Instagram, Facebook, etc.)",
      "Post goals (grand opening, promotion, etc.)",
      "Tone and style preferences",
      "Include hashtags or mentions",
      "Character/word limits"
    ],
    correctCount: 6
  },
  {
    id: 3,
    prompt: "Help me plan a vacation.",
    missingDetails: [
      "Budget range",
      "Travel dates and duration",
      "Number of travelers",
      "Preferred destinations or regions",
      "Activity preferences",
      "Accommodation type",
      "Transportation preferences"
    ],
    correctCount: 7
  }
];

export const DetailDetective = ({ onComplete, onBack }: DetailDetectiveProps) => {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [selectedDetails, setSelectedDetails] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const prompt = prompts[currentPrompt];

  const handleDetailSelect = (detail: string) => {
    if (showResults) return;
    
    if (selectedDetails.includes(detail)) {
      setSelectedDetails(selectedDetails.filter(d => d !== detail));
    } else {
      setSelectedDetails([...selectedDetails, detail]);
    }
  };

  const handleSubmit = () => {
    const correctSelections = selectedDetails.length;
    const maxScore = prompt.correctCount * 10;
    const earnedScore = Math.min(correctSelections * 10, maxScore);
    
    setScore(score + earnedScore);
    setShowResults(true);

    if (correctSelections === prompt.correctCount) {
      toast("Perfect detective work! You found all missing details! 🕵️");
    } else if (correctSelections >= prompt.correctCount * 0.7) {
      toast("Great job! You caught most of the missing details! 👍");
    } else {
      toast("Good start! Let's see what details were missing. 🔍");
    }
  };

  const handleNext = () => {
    if (currentPrompt < prompts.length - 1) {
      setCurrentPrompt(currentPrompt + 1);
      setSelectedDetails([]);
      setShowResults(false);
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
            <CardTitle className="text-2xl">🔍 Detail Detective Complete!</CardTitle>
            <CardDescription>Final Score: {score} points</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You've mastered the art of identifying missing prompt details!</p>
            <Button onClick={onBack}>Continue Learning</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Search className="w-6 h-6 text-primary" />
          Detail Detective
        </h2>
        <p className="text-muted-foreground">Find all the missing details in this vague prompt</p>
        <div className="text-sm text-muted-foreground">
          Case {currentPrompt + 1} of {prompts.length} | Score: {score}
        </div>
      </div>

      <Card className="border-amber-400 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Vague Prompt Under Investigation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-white border-2 border-amber-300 rounded-lg text-center">
            <p className="text-lg font-medium text-amber-800">
              "{prompt.prompt}"
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What details are missing?</CardTitle>
          <CardDescription>
            Select all the important details that should be added to make this prompt more effective
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            {prompt.missingDetails.map((detail, index) => (
              <div
                key={index}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedDetails.includes(detail)
                    ? 'border-primary bg-primary/10'
                    : 'border-muted hover:border-primary/50'
                } ${
                  showResults ? 'border-green-500 bg-green-50' : ''
                }`}
                onClick={() => handleDetailSelect(detail)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {showResults ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        selectedDetails.includes(detail)
                          ? 'bg-primary border-primary'
                          : 'border-muted-foreground'
                      }`} />
                    )}
                  </div>
                  <span className="text-sm">{detail}</span>
                </div>
              </div>
            ))}
          </div>

          {showResults && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">🎯 Analysis Complete!</h4>
              <p className="text-sm text-blue-800 mb-2">
                You identified {selectedDetails.length} out of {prompt.correctCount} missing details.
              </p>
              <div className="text-xs text-blue-700">
                <strong>Pro Tip:</strong> Specific prompts with clear context, audience, format, and constraints produce much better AI responses!
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Back to Lessons
            </Button>
            {!showResults ? (
              <Button 
                onClick={handleSubmit}
                className="flex-1"
              >
                Submit Investigation
              </Button>
            ) : (
              <Button onClick={handleNext} className="flex-1">
                {currentPrompt < prompts.length - 1 ? 'Next Case' : 'Complete Investigation'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};