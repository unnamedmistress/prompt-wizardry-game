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

// Dating Profile Edition – escalating specificity rounds
const prompts = [
  {
    id: 1,
    prompt: "Help me write a dating profile.",
    missingDetails: [
      "Personality traits (funny, kind, adventurous, thoughtful, etc.)",
      "Hobbies and interests (music, sports, books, travel)",
      "Age range and relationship goals (serious, casual, friendship)",
      "Tone of writing (light and witty, professional, romantic)",
      "Desired character length (short bio vs 200 words)"
    ],
    correctCount: 5
  },
  {
    id: 2,
    prompt: "Write me a short dating profile that makes me sound fun.",
    missingDetails: [
      "What kind of 'fun' (jokes, travel, nightlife, quirky hobbies)",
      "Hobbies or passions to highlight",
      "Whether 'short' means one line or a paragraph",
      "Relationship goals (long-term vs casual)"
    ],
    correctCount: 4
  },
  {
    id: 3,
    prompt: "Make a dating profile for me. I like movies and music.",
    missingDetails: [
      "Which genres of movies/music (horror vs rom-com, rap vs classical)",
      "Personality traits to match tone",
      "Age and audience (who you want to attract)",
      "How much detail to include (quick blurb vs storytelling style)",
      "Tone (funny, witty, serious, adventurous)"
    ],
    correctCount: 5
  },
  {
    id: 4,
    prompt: "Help me write a witty profile. I’m adventurous and outgoing.",
    missingDetails: [
      "Specific examples of adventurous/outgoing activities (hiking, skydiving, karaoke nights)",
      "Relationship goals (serious partner, casual, friendship)",
      "Writing style (short punchy lines vs longer storytelling)",
      "Fun facts or quirks (hidden talents, favorite food, pets)"
    ],
    correctCount: 4
  },
  {
    id: 5,
    prompt: "Create a dating bio that shows I’m 25, love board games, and want a long-term relationship.",
    missingDetails: [
      "Tone (lighthearted, romantic, professional, nerdy)",
      "Favorite board games or styles (strategy, party games, classics)",
      "Personality traits (funny, empathetic, competitive, easy-going)",
      "Constraints (150 characters vs 200 words)",
      "Dealbreakers/boundaries (must love pets, non-smoker, etc.)"
    ],
    correctCount: 5
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
          <CardTitle className="text-2xl font-bold">❤️ Specificity & Details (Dating Profile Edition)</CardTitle>
          <CardDescription className="text-lg font-semibold text-foreground mb-3">Prompting Fundamentals</CardDescription>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              Vague prompts give vague answers. Watch how adding specifics turns a bland dating bio prompt into something the AI can actually nail.
            </p>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2">Your Mission</h4>
              <p>Identify every missing detail that would help the AI write a compelling, authentic dating profile.</p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Activity</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>Read the draft prompt for the dating bio.</li>
                <li>Click all the important details the AI still needs.</li>
                <li>Select every missing piece to maximize your score.</li>
              </ol>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2 mb-6">
            <div className="text-sm text-muted-foreground">
              Round {currentPrompt + 1} of {prompts.length} | Score: {score} | Selected: {selectedDetails.length} details
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
              <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Prompt to Analyze:
              </h4>
              <p className="text-lg font-medium text-foreground">"{prompt.prompt}"</p>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-4">
                What important details are missing? Click all that apply:
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
                  🎯 Round Results:
                </h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <div>✅ Found {selectedDetails.length} out of {prompt.correctCount} key dating profile details</div>
                  <div>📊 Specificity Score: {Math.round((selectedDetails.length / prompt.correctCount) * 100)}%</div>
                </div>
                <div className="mt-3 text-xs text-blue-700">
                  <strong>💡 Pro Tip:</strong> Strong dating prompts specify tone, personality, interests, relationship intent, and constraints (length, style, quirks) for authentic results.
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
                  Submit Round
                </Button>
              ) : (
                <Button onClick={handleNext} className="flex-1">
                  {currentPrompt < prompts.length - 1 ? 'Next Round' : 'Complete Game'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};