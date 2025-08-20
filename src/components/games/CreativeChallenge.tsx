import { useState } from "react";
import type { LearningExperience } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Palette, Star, Lightbulb } from "lucide-react";

interface CreativeChallengeProps {
  onComplete: (score: number) => void;
  onBack: () => void;
  lesson: LearningExperience;
}

const creativityElements = [
  {
    id: 1,
    category: "Creative Role",
    options: [
      { text: "You are a mystery writer", points: 10, isGood: true },
      { text: "You are a party planner", points: 8, isGood: true },
      { text: "You are an assistant", points: 3, isGood: false },
      { text: "You are a creative storyteller", points: 10, isGood: true }
    ]
  },
  {
    id: 2,
    category: "Setting & Theme",
    options: [
      { text: "Set in a spooky mansion in the 1920s", points: 10, isGood: true },
      { text: "Modern day murder mystery", points: 6, isGood: true },
      { text: "At a dinner party", points: 4, isGood: false },
      { text: "Victorian-era mystery with supernatural elements", points: 10, isGood: true }
    ]
  },
  {
    id: 3,
    category: "Audience & Complexity",
    options: [
      { text: "For 6-8 friends who love puzzles", points: 10, isGood: true },
      { text: "For beginners to mystery games", points: 8, isGood: true },
      { text: "For people", points: 2, isGood: false },
      { text: "For experienced gamers who want a challenge", points: 10, isGood: true }
    ]
  },
  {
    id: 4,
    category: "Creative Constraints",
    options: [
      { text: "Include red herrings and plot twists", points: 10, isGood: true },
      { text: "Make it interactive with props", points: 10, isGood: true },
      { text: "Keep it simple", points: 3, isGood: false },
      { text: "Include multiple suspects with believable motives", points: 10, isGood: true }
    ]
  },
  {
    id: 5,
    category: "Output Format",
    options: [
      { text: "Provide character sheets, clues, and timeline", points: 10, isGood: true },
      { text: "Give me everything I need to host", points: 8, isGood: true },
      { text: "Just give me ideas", points: 2, isGood: false },
      { text: "Include setup instructions and reveal sequence", points: 10, isGood: true }
    ]
  }
];

export const CreativeChallenge = ({ lesson, onComplete, onBack }: CreativeChallengeProps) => {
  const [selections, setSelections] = useState<{ [key: number]: number }>({});
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleOptionSelect = (elementId: number, optionIndex: number) => {
    if (showResults) return;
    
    setSelections(prev => ({
      ...prev,
      [elementId]: optionIndex
    }));
  };

  const handleSubmit = () => {
    const selectedCount = Object.keys(selections).length;
    if (selectedCount < creativityElements.length) {
      toast(`Please make a selection for all ${creativityElements.length} categories!`);
      return;
    }

    let totalScore = 0;
    let creativityScore = 0;
    
    creativityElements.forEach(element => {
      const selectedIndex = selections[element.id];
      if (selectedIndex !== undefined) {
        const selectedOption = element.options[selectedIndex];
        totalScore += selectedOption.points;
        if (selectedOption.isGood) {
          creativityScore += 1;
        }
      }
    });

    // Bonus for creativity
    if (creativityScore >= 4) {
      totalScore += 20; // Creativity bonus
    }

    setScore(totalScore);
    setShowResults(true);

    if (creativityScore >= 4) {
      toast("Incredible! You've mastered creative prompting! 🎨");
      setTimeout(() => {
        setGameComplete(true);
        onComplete(totalScore);
      }, 3000);
    } else {
      toast(`Good effort! You made ${creativityScore}/5 optimal creative choices.`);
      setTimeout(() => {
        setGameComplete(true);
        onComplete(totalScore);
      }, 3000);
    }
  };

  const handleReset = () => {
    setSelections({});
    setShowResults(false);
    setScore(0);
  };

  if (gameComplete) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl">🎨 Creative Master Complete!</CardTitle>
            <CardDescription>Score: {score}/70 points</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You've unlocked AI's creative potential!</p>
            <Button onClick={onBack}>Continue Learning</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Palette className="w-6 h-6 text-primary" />
          Creative Challenge
        </h2>
        <p className="text-muted-foreground">Build a creative prompt for a murder mystery dinner party</p>
        <div className="text-sm text-muted-foreground">
          Score: {score}/70 | Selections: {Object.keys(selections).length}/5
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            🎭 Creative Scenario: Murder Mystery Dinner Party
          </CardTitle>
          <CardDescription>
            You want AI to help create an amazing murder mystery experience for your friends. 
            Choose the best elements for a creative, engaging prompt.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {creativityElements.map((element) => (
            <div key={element.id} className="space-y-3">
              <h4 className="font-medium text-primary">{element.category}</h4>
              <div className="grid gap-2 md:grid-cols-2">
                {element.options.map((option, index) => {
                  const isSelected = selections[element.id] === index;
                  const isRevealed = showResults;
                  
                  return (
                    <div
                      key={index}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all text-sm ${
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-muted hover:border-primary/50'
                      } ${
                        isRevealed
                          ? option.isGood
                            ? 'border-green-500 bg-green-50'
                            : isSelected
                              ? 'border-yellow-500 bg-yellow-50'
                              : 'opacity-60'
                          : ''
                      }`}
                      onClick={() => handleOptionSelect(element.id, index)}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-1">
                          {isRevealed ? (
                            option.isGood ? (
                              <Star className="w-4 h-4 text-green-600" />
                            ) : isSelected ? (
                              <span className="text-yellow-600">⚠️</span>
                            ) : (
                              <div className="w-4 h-4" />
                            )
                          ) : (
                            <div className={`w-4 h-4 rounded border-2 ${
                              isSelected
                                ? 'bg-primary border-primary'
                                : 'border-muted-foreground'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div>{option.text}</div>
                          {isRevealed && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {option.points} points - {option.isGood ? 'Great for creativity!' : 'Could be more specific'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {showResults && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                🎨 Your Creative Prompt Analysis:
              </h4>
              <div className="text-sm text-purple-800 space-y-1">
                <div>📊 Total Score: {score}/70 points</div>
                <div>⭐ Creative Choices: {creativityElements.filter(element => {
                  const selectedIndex = selections[element.id];
                  return selectedIndex !== undefined && element.options[selectedIndex].isGood;
                }).length}/5</div>
                {score >= 60 && (
                  <div className="text-green-700 font-medium">🏆 Creative Mastery Achieved!</div>
                )}
              </div>
              <div className="mt-3 text-xs text-purple-700">
                <strong>💡 Pro Tip:</strong> Creative prompts work best when you give AI a specific creative role, 
                vivid setting details, clear audience context, and specific creative constraints!
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Back to Lessons
            </Button>
            {showResults ? (
              <Button onClick={handleReset} className="flex-1">
                Try Again
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={Object.keys(selections).length < creativityElements.length}
                className="flex-1"
              >
                Analyze Creative Prompt
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};