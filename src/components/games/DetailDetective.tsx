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

// Dating Profile Edition – rounds with distractor (incorrect) options so it's never "all correct"
interface RoundOption { text: string; correct: boolean }
interface RoundData { id: number; prompt: string; options: RoundOption[] }

const prompts: RoundData[] = [
  {
    id: 1,
    prompt: "Help me write a dating profile.",
    options: [
      { text: "Personality traits (funny, kind, adventurous, thoughtful, etc.)", correct: true },
      { text: "Hobbies and interests (music, sports, books, travel)", correct: true },
      { text: "Age range and relationship goals (serious, casual, friendship)", correct: true },
      { text: "Tone of writing (light and witty, professional, romantic)", correct: true },
      { text: "Desired character length (short bio vs 200 words)", correct: true },
      { text: "Number of emojis the AI model internally prefers (not relevant)", correct: false },
      { text: "Exact app algorithm weighting formula (impossible to know)", correct: false }
    ]
  },
  {
    id: 2,
    prompt: "Write me a short dating profile that makes me sound fun.",
    options: [
      { text: "What kind of 'fun' (jokes, travel, nightlife, quirky hobbies)", correct: true },
      { text: "Hobbies or passions to highlight", correct: true },
      { text: "Whether 'short' means one line or a paragraph", correct: true },
      { text: "Relationship goals (long-term vs casual)", correct: true },
      { text: "Favorite brand of phone charger (not relevant)", correct: false },
      { text: "Exact sunrise time tomorrow (impossible to predict)", correct: false }
    ]
  },
  {
    id: 3,
    prompt: "Make a dating profile for me. I like movies and music.",
    options: [
      { text: "Which genres of movies/music (horror vs rom-com, rap vs classical)", correct: true },
      { text: "Personality traits to match tone", correct: true },
      { text: "Age and audience (who you want to attract)", correct: true },
      { text: "How much detail to include (quick blurb vs storytelling style)", correct: true },
      { text: "Tone (funny, witty, serious, adventurous)", correct: true },
      { text: "Favorite operating system version number (not relevant)", correct: false }
    ]
  },
  {
    id: 4,
    prompt: "Help me write a witty profile. I’m adventurous and outgoing.",
    options: [
      { text: "Specific examples of adventurous/outgoing activities (hiking, skydiving, karaoke nights)", correct: true },
      { text: "Relationship goals (serious partner, casual, friendship)", correct: true },
      { text: "Writing style (short punchy lines vs longer storytelling)", correct: true },
      { text: "Fun facts or quirks (hidden talents, favorite food, pets)", correct: true },
      { text: "Server response latency of the dating app (not relevant)", correct: false },
      { text: "The humidity level in your city right now (not relevant)", correct: false }
    ]
  },
  {
    id: 5,
    prompt: "Create a dating bio that shows I’m 25, love board games, and want a long-term relationship.",
    options: [
      { text: "Tone (lighthearted, romantic, professional, nerdy)", correct: true },
      { text: "Favorite board games or styles (strategy, party games, classics)", correct: true },
      { text: "Personality traits (funny, empathetic, competitive, easy-going)", correct: true },
      { text: "Constraints (150 characters vs 200 words)", correct: true },
      { text: "Dealbreakers/boundaries (must love pets, non-smoker, etc.)", correct: true },
      { text: "Exact probability of first-date match success (impossible to know)", correct: false }
    ]
  }
];

export const DetailDetective = ({ lesson, onComplete, onBack }: DetailDetectiveProps) => {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [selectedDetails, setSelectedDetails] = useState<number[]>([]); // indices of selected options
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const prompt = prompts[currentPrompt];
  const correctTotal = prompt.options.filter(o => o.correct).length;

  const handleDetailSelect = (index: number) => {
    if (showResults) return;
    if (selectedDetails.includes(index)) {
      setSelectedDetails(selectedDetails.filter(d => d !== index));
    } else {
      setSelectedDetails([...selectedDetails, index]);
    }
  };

  const handleSubmit = () => {
    const correctSelections = selectedDetails.filter(i => prompt.options[i].correct).length;
    const incorrectSelections = selectedDetails.filter(i => !prompt.options[i].correct).length;
    const pointsPerCorrect = 10;
    let earned = correctSelections * pointsPerCorrect - incorrectSelections * 5; // light penalty
    if (earned < 0) earned = 0;
    setScore(score + earned);
    setShowResults(true);

    if (correctSelections === correctTotal && incorrectSelections === 0) {
      toast("Flawless! Every needed detail — no extras. 🏆");
    } else if (correctSelections / correctTotal >= 0.7) {
      toast("Great eye — most essentials captured! �");
    } else {
      toast("Solid start. Review what's still missing. 🔍");
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
              Round {currentPrompt + 1} of {prompts.length} | Score: {score} | Selected: {selectedDetails.length} items
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
                {prompt.options.map((opt, index) => {
                  const isSelected = selectedDetails.includes(index);
                  const isCorrect = opt.correct;
                  const revealCorrect = showResults && isCorrect;
                  const revealWrong = showResults && isSelected && !isCorrect;
                  return (
                    <div
                      key={index}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all text-sm
                        ${isSelected && !showResults ? 'border-primary bg-primary/10' : 'border-muted hover:border-primary/50'}
                        ${revealCorrect ? 'border-green-500 bg-green-50 text-green-900' : ''}
                        ${revealWrong ? 'border-red-500 bg-red-50 text-red-900' : ''}
                        ${!isSelected && showResults && !isCorrect ? 'opacity-60' : ''}`}
                      onClick={() => handleDetailSelect(index)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {showResults ? (
                            revealCorrect ? <CheckCircle className="w-4 h-4 text-green-600" /> : (
                              revealWrong ? <XCircle className="w-4 h-4 text-red-600" /> : <div className="w-4 h-4 rounded border-2 border-muted-foreground/40" />
                            )
                          ) : (
                            <div className={`w-4 h-4 rounded border-2 ${isSelected ? 'bg-primary border-primary' : 'border-muted-foreground'}`} />
                          )}
                        </div>
                        <span className="flex-1">{opt.text}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {showResults && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  🎯 Round Results:
                </h4>
                {(() => {
                  const correctSelections = selectedDetails.filter(i => prompt.options[i].correct).length;
                  const incorrectSelections = selectedDetails.filter(i => !prompt.options[i].correct).length;
                  const totalSelected = selectedDetails.length;
                  return (
                    <div className="text-sm text-blue-800 space-y-1">
                      <div>✅ Correct details selected: {correctSelections} / {correctTotal} available</div>
                      <div>❌ Incorrect details selected: {incorrectSelections}</div>
                      <div>📊 Total selected: {totalSelected}</div>
                      <div>📈 Accuracy: {totalSelected > 0 ? Math.round((correctSelections / totalSelected) * 100) : 0}%</div>
                      <div>🎯 Coverage: {Math.round((correctSelections / correctTotal) * 100)}%</div>
                    </div>
                  );
                })()}
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