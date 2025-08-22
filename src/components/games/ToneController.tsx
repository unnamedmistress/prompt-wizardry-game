import { useState } from "react";
import type { LearningExperience } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Volume2, Check, X } from "lucide-react";

interface ToneControllerProps {
  onComplete: (score: number) => void;
  onBack: () => void;
  lesson: LearningExperience;
}

const scenarios = [
  {
    id: 1,
    situation: "You need to ask your boss for time off during a busy period at work.",
    prompt: "Write a request for time off during peak season",
    toneOptions: [
      {
        tone: "Understanding & Strategic",
        description: "Shows awareness of timing while making a reasonable case",
        isCorrect: true,
        example: "Acknowledges the busy period but explains the necessity and offers solutions"
      },
      {
        tone: "Demanding & Urgent", 
        description: "Too aggressive for this delicate situation",
        isCorrect: false,
        example: "Might create conflict during an already stressful time"
      },
      {
        tone: "Apologetic & Uncertain",
        description: "Shows lack of confidence in a legitimate request",
        isCorrect: false,
        example: "Makes the request seem less valid than it might be"
      }
    ]
  },
  {
    id: 2,
    situation: "A client complains that your team's work doesn't match their vision. Write a response email.",
    prompt: "Respond to a client who is unhappy with delivered work",
    toneOptions: [
      {
        tone: "Solution-Focused & Professional",
        description: "Takes ownership while steering toward resolution",
        isCorrect: true,
        example: "Acknowledges the gap and presents clear next steps"
      },
      {
        tone: "Defensive & Technical",
        description: "Explains why you're right instead of solving the problem",
        isCorrect: false,
        example: "Focuses on justification rather than client satisfaction"
      },
      {
        tone: "Overly Apologetic",
        description: "Takes too much blame without showing competence",
        isCorrect: false,
        example: "Undermines confidence in your team's abilities"
      }
    ]
  },
  {
    id: 3,
    situation: "Write a LinkedIn post about your team winning an industry award.",
    prompt: "Announce a professional achievement on social media",
    toneOptions: [
      {
        tone: "Grateful & Team-Focused",
        description: "Celebrates success while crediting others appropriately",
        isCorrect: true,
        example: "Shares the win while highlighting team contributions"
      },
      {
        tone: "Excited & Personal",
        description: "Too casual and self-centered for professional context",
        isCorrect: false,
        example: "Makes it about you rather than the achievement or team"
      },
      {
        tone: "Humble & Understated",
        description: "Doesn't capitalize on the networking opportunity",
        isCorrect: false,
        example: "Wastes the chance to showcase expertise and build connections"
      }
    ]
  }
];

export const ToneController = ({ lesson, onComplete, onBack }: ToneControllerProps) => {
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
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">🎵 Tone Controller</CardTitle>
          <CardDescription className="text-lg font-semibold text-foreground mb-3">Communication Mastery</CardDescription>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              The same message can sound friendly, bossy, or professional depending on the tone you choose. Getting tone right makes all the difference.
            </p>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2">Your Mission</h4>
              <p>Pick the perfect tone for tricky workplace situations where the wrong choice could backfire.</p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Activity</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>Read each workplace scenario carefully.</li>
                <li>Think about who you're talking to and what you want to happen.</li>
                <li>Choose the tone that gets the best result without causing problems.</li>
              </ol>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2 mb-6">
            <div className="text-sm text-muted-foreground">
              Scenario {currentScenario + 1} of {scenarios.length} | Score: {score}/105
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
              <h4 className="font-medium text-foreground mb-2">🎭 Situation</h4>
              <p className="text-lg font-medium text-foreground">{scenario.situation}</p>
            </div>
            
            <h4 className="font-medium text-foreground mb-4">What tone should the AI use?</h4>
            
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
                        ? 'border-green-500 bg-green-50 text-green-900'
                        : selectedTone === index && !option.isCorrect
                          ? 'border-red-500 bg-red-50 text-red-900'
                          : 'opacity-60'
                      : 'text-foreground'
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
                <h4 className="font-medium text-blue-900 mb-2">💡 Why tone matters in the workplace:</h4>
                <p className="text-sm text-blue-800">
                  Professional tone isn't just about being polite. It's about reading the situation, understanding 
                  your audience, and choosing an approach that gets results while maintaining relationships.
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};