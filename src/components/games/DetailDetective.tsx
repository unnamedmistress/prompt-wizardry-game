import { useState } from "react";
import type { LearningExperience } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Search, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface DetailDetectiveProps {
  onComplete: (score: number) => void;
  onBack: () => void;
  lesson: LearningExperience;
}

const prompts = [
  {
    id: 1,
    prompt: "Help me create a social media strategy for our B2B software company.",
    missingDetails: [
      "Target audience size and industry vertical",
      "Current social media presence and metrics",
      "Primary business goals (lead generation, brand awareness, etc.)",
      "Budget allocation across platforms",
      "Competitor landscape analysis",
      "Key decision-maker personas and pain points",
      "Content creation resources and team capacity"
    ],
    correctCount: 7
  },
  {
    id: 2,
    prompt: "Write a performance review for my team member.",
    missingDetails: [
      "Employee's specific role and responsibilities",
      "Review period timeframe and previous feedback",
      "Specific performance metrics and KPIs achieved",
      "Behavioral examples (both positive and areas for improvement)",
      "Career development goals and advancement opportunities",
      "Company's performance review framework and scale",
      "Manager relationship context and previous conversations"
    ],
    correctCount: 7
  },
  {
    id: 3,
    prompt: "Create a training program for our sales team.",
    missingDetails: [
      "Current team performance gaps and skill assessment",
      "Sales process complexity and typical deal cycle length",
      "Product/service technical complexity and pricing tiers",
      "Target customer personas and objection patterns",
      "Training budget, timeline, and delivery format preferences",
      "Team experience levels and previous training history",
      "Success metrics and ROI measurement criteria"
    ],
    correctCount: 7
  }
];

export const DetailDetective = ({ lesson, onComplete, onBack }: DetailDetectiveProps) => {
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
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">🔍 Detail Detective</CardTitle>
          <CardDescription className="text-lg font-semibold text-foreground mb-3">Prompting Fundamentals</CardDescription>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              Vague prompts give vague answers. The more specific details you give AI, the better and more useful its response will be.
            </p>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2">Your Mission</h4>
              <p>Find all the missing details that would make these professional prompts much more specific and effective.</p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Activity</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>Read each business prompt and think about what's missing.</li>
                <li>Click on the details that would make the prompt clearer and more useful.</li>
                <li>Find all the important details to get the highest score.</li>
              </ol>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2 mb-6">
            <div className="text-sm text-muted-foreground">
              Case {currentPrompt + 1} of {prompts.length} | Score: {score} | Selected: {selectedDetails.length} details
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
              <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Business Prompt to Analyze:
              </h4>
              <p className="text-lg font-medium text-foreground">"{prompt.prompt}"</p>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-4">
                What important business details are missing? Click all that apply:
              </h4>
              
              <div className="grid gap-3 md:grid-cols-2">
                {prompt.missingDetails.map((detail, index) => (
                  <div
                    key={index}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all text-sm ${
                      selectedDetails.includes(detail)
                        ? 'border-primary bg-primary/10'
                        : 'border-muted hover:border-primary/50'
                    } ${
                      showResults
                        ? 'border-green-500 bg-green-50 text-green-900'
                        : 'text-foreground'
                    }`}
                    onClick={() => handleDetailSelect(detail)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {showResults ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <div className={`w-4 h-4 rounded border-2 ${
                            selectedDetails.includes(detail)
                              ? 'bg-primary border-primary'
                              : 'border-muted-foreground'
                          }`} />
                        )}
                      </div>
                      <span className="flex-1">{detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {showResults && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  🎯 Investigation Results:
                </h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <div>✅ Found {selectedDetails.length} out of {prompt.correctCount} key business details</div>
                  <div>📊 Professional Score: {Math.round((selectedDetails.length / prompt.correctCount) * 100)}%</div>
                </div>
                <div className="mt-3 text-xs text-blue-700">
                  <strong>💡 Pro Tip:</strong> Business prompts need context about goals, audience, constraints, timeline, and success metrics to get results that actually help!
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
                  disabled={selectedDetails.length === 0}
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};