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

  // Theme background colors
  const themeStyle = {
    backgroundImage: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
    backgroundAttachment: 'fixed'
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6" style={themeStyle}>
      <Card className="border-2 border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="text-2xl font-bold flex items-center gap-2 text-foreground">
            <Palette className="w-6 h-6 text-purple-600" />
            🎨 Creative Challenge
          </CardTitle>
          <CardDescription className="text-lg font-semibold text-foreground mb-3">Creative Applications</CardDescription>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              Creative projects need special details to make them amazing. The more specific you are about what you want, the more creative AI can be.
            </p>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2">Your Mission</h4>
              <p>Build the perfect creative prompt for a murder mystery dinner party by picking the best choices.</p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Activity</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>Pick one choice from each category below.</li>
                <li>Think about what would make the most fun and creative result.</li>
                <li>See how your choices add up to create an amazing prompt.</li>
              </ol>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2 mb-6">
            <div className="text-sm text-muted-foreground">
              Score: {score}/70 | Selections: {Object.keys(selections).length}/5
            </div>
          </div>

          {creativityElements.map((element) => (
            <div key={element.id} className="space-y-3 animate-fade-in">
              <h4 className="font-medium text-primary flex items-center gap-2">
                {element.id === 1 && <Lightbulb className="w-4 h-4" />}
                {element.id === 2 && <Star className="w-4 h-4" />}
                {element.id === 3 && <Star className="w-4 h-4" />}
                {element.id === 4 && <Star className="w-4 h-4" />}
                {element.id === 5 && <Star className="w-4 h-4" />}
                {element.category}
              </h4>
              <div className="grid gap-2 md:grid-cols-2">
                {element.options.map((option, index) => {
                  const isSelected = selections[element.id] === index;
                  const isRevealed = showResults;
                  
                  return (
                    <div
                      key={index}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all text-sm hover-scale ${
                        isSelected
                          ? 'border-primary bg-primary/10 shadow-md'
                          : 'border-muted hover:border-primary/50'
                      } ${
                        isRevealed
                          ? option.isGood
                            ? 'border-green-500 bg-green-50 text-green-900 dark:bg-green-900/30 dark:text-green-400 animate-bounce-in'
                            : isSelected
                              ? 'border-yellow-500 bg-yellow-50 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'opacity-60'
                          : 'text-foreground'
                      }`}
                      onClick={() => handleOptionSelect(element.id, index)}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-1">
                          {isRevealed ? (
                            option.isGood ? (
                              <Star className="w-5 h-5 text-green-600 animate-spin" style={{ animationDuration: '2s' }} />
                            ) : isSelected ? (
                              <span className="text-yellow-600 text-lg">⚠️</span>
                            ) : (
                              <div className="w-4 h-4" />
                            )
                          ) : (
                            <div className={`w-4 h-4 rounded border-2 transition-all ${
                              isSelected
                                ? 'bg-primary border-primary scale-110'
                                : 'border-muted-foreground'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{option.text}</div>
                          {isRevealed && (
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Star className="w-3 h-3" />
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
              <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                🎨 Your Creative Prompt Results:
              </h4>
              <div className="text-sm text-purple-800 space-y-1">
                <div>📊 Total Score: {score}/70 points</div>
                <div>⭐ Creative Choices: {creativityElements.filter(element => {
                  const selectedIndex = selections[element.id];
                  return selectedIndex !== undefined && element.options[selectedIndex].isGood;
                }).length}/5</div>
                {score >= 60 && (
                  <div className="text-green-700 font-medium">🏆 Creative Master Achieved!</div>
                )}
              </div>
              <div className="mt-3 text-xs text-purple-700">
                <strong>💡 Pro Tip:</strong> Creative prompts work best when you give AI a specific job, 
                clear setting details, and tell it exactly what kind of audience it's for!
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
                Check My Creative Prompt
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};