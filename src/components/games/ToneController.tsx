import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Volume2, Check, X } from "lucide-react";

interface ToneControllerProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

const scenarios = [
  {
    id: 1,
    situation: "You're writing a resignation letter - you got a better job offer!",
    prompt: "Write a resignation letter for someone leaving for a better opportunity",
    toneOptions: [
      {
        tone: "Professional & Grateful",
        description: "Maintains relationships while being clear about departure",
        isCorrect: true,
        example: "Express gratitude, give proper notice, offer transition help"
      },
      {
        tone: "Casual & Excited", 
        description: "Too informal for a resignation letter",
        isCorrect: false,
        example: "Might damage professional relationships"
      },
      {
        tone: "Apologetic & Hesitant",
        description: "Shows uncertainty which isn't ideal",
        isCorrect: false,
        example: "Makes it seem like you're not confident in your decision"
      }
    ]
  },
  {
    id: 2,
    situation: "Help your friend write a funny dating app message to someone who mentioned loving pizza",
    prompt: "Write a first message on a dating app about pizza",
    toneOptions: [
      {
        tone: "Witty & Playful",
        description: "Perfect for dating apps - shows personality",
        isCorrect: true,
        example: "Light humor that starts a conversation"
      },
      {
        tone: "Formal & Serious",
        description: "Too stiff for dating apps",
        isCorrect: false,
        example: "Might come across as boring or impersonal"
      },
      {
        tone: "Overly Flirty",
        description: "Too intense for a first message",
        isCorrect: false,
        example: "Could make the recipient uncomfortable"
      }
    ]
  },
  {
    id: 3,
    situation: "Write a complaint email to your internet provider about constant outages",
    prompt: "Write a complaint email about internet service issues",
    toneOptions: [
      {
        tone: "Firm but Professional",
        description: "Gets results while maintaining relationship",
        isCorrect: true,
        example: "States problems clearly, requests solutions professionally"
      },
      {
        tone: "Angry & Aggressive",
        description: "Might damage your case and relationship",
        isCorrect: false,
        example: "Could result in less helpful customer service"
      },
      {
        tone: "Overly Polite",
        description: "Might not convey the seriousness of the issue",
        isCorrect: false,
        example: "May not get the attention your problem deserves"
      }
    ]
  }
];

export const ToneController = ({ onComplete, onBack }: ToneControllerProps) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedTone, setSelectedTone] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const scenario = scenarios[currentScenario];

  const handleToneSelect = (toneIndex: number) => {
    if (showExplanation) return;
    setSelectedTone(toneIndex);
  };

  const handleSubmit = () => {
    if (selectedTone === null) {
      toast("Please select a tone!");
      return;
    }

    const selectedOption = scenario.toneOptions[selectedTone];
    if (selectedOption.isCorrect) {
      setScore(score + 35);
      toast("Perfect tone choice! 🎯");
    } else {
      toast("Not quite right. Let's see why!");
    }
    
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedTone(null);
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
            <CardTitle className="text-2xl">🎵 Tone Master Complete!</CardTitle>
            <CardDescription>Final Score: {score}/105 points</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You've mastered the art of tone control!</p>
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
          <Volume2 className="w-6 h-6 text-primary" />
          Tone Controller
        </h2>
        <p className="text-muted-foreground">Choose the perfect tone for each situation</p>
        <div className="text-sm text-muted-foreground">
          Scenario {currentScenario + 1} of {scenarios.length} | Score: {score}/105
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🎭 Situation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-accent/50 rounded-lg mb-6">
            <p className="text-lg font-medium">{scenario.situation}</p>
          </div>
          
          <h4 className="font-medium mb-4">What tone should the AI use?</h4>
          
          <div className="space-y-3">
            {scenario.toneOptions.map((option, index) => (
              <div
                key={index}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedTone === index
                    ? 'border-primary bg-primary/10'
                    : 'border-muted hover:border-primary/50'
                } ${
                  showExplanation
                    ? option.isCorrect
                      ? 'border-green-500 bg-green-50'
                      : selectedTone === index && !option.isCorrect
                        ? 'border-red-500 bg-red-50'
                        : 'opacity-60'
                    : ''
                }`}
                onClick={() => handleToneSelect(index)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {showExplanation ? (
                      option.isCorrect ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : selectedTone === index ? (
                        <X className="w-5 h-5 text-red-600" />
                      ) : (
                        <div className="w-5 h-5" />
                      )
                    ) : (
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        selectedTone === index
                          ? 'bg-primary border-primary'
                          : 'border-muted-foreground'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium mb-2">{option.tone}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                    {showExplanation && (
                      <div className="text-xs text-muted-foreground mt-2 italic">
                        {option.example}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">💡 Why tone matters:</h4>
              <p className="text-sm text-blue-800">
                The right tone can make or break your message. Consider your audience, 
                the relationship, and the desired outcome when choosing how the AI should sound.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-6">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Back to Lessons
            </Button>
            {!showExplanation ? (
              <Button 
                onClick={handleSubmit} 
                disabled={selectedTone === null}
                className="flex-1"
              >
                Submit Choice
              </Button>
            ) : (
              <Button onClick={handleNext} className="flex-1">
                {currentScenario < scenarios.length - 1 ? 'Next Scenario' : 'Complete Game'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};