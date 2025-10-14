import { useState, useEffect } from "react";
import type { LearningExperience } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Timer, Key, Lock, CheckCircle } from "lucide-react";

interface PromptEscapeProps {
  onComplete: (score: number) => void;
  onBack: () => void;
  lesson: LearningExperience;
}

const escapeRooms = [
  {
    id: 1,
    title: "The Hallucination Chamber",
    description: "Escape by finding which prompt created the false response!",
    aiResponse: "The Great Wall of China is visible from space with the naked eye and was built continuously over 2,000 years by a single dynasty.",
    prompts: [
      "Tell me about the Great Wall of China's construction history and visibility from space.",
      "List factual information about the Great Wall of China, including common misconceptions.",
      "Write an exciting story about the Great Wall of China that might include some exaggerations.",
      "Provide verified facts about the Great Wall of China from reliable historical sources."
    ],
    correctAnswer: 2,
    explanation: "Prompt 3 asked for 'an exciting story that might include exaggerations' - this would lead to false information mixed with facts."
  },
  {
    id: 2,
    title: "The Bias Trap",
    description: "Find the prompt that led to this biased response!",
    aiResponse: "Men are naturally better at mathematics and science because of biological differences in brain structure that make them more logical thinkers.",
    prompts: [
      "Explain gender differences in STEM performance based on current research.",
      "Why are men better at math and science than women?",
      "Analyze factors that influence gender representation in STEM fields.",
      "Discuss biological and social factors affecting academic performance across genders."
    ],
    correctAnswer: 1,
    explanation: "Prompt 2 contains a leading question with a false premise ('Why are men better...') which prompted the biased response."
  },
  {
    id: 3,
    title: "The Context Void",
    description: "Which prompt lacks crucial context?",
    aiResponse: "You should definitely invest all your money in cryptocurrency right now. Bitcoin will reach $500,000 by next year guaranteed!",
    prompts: [
      "As a financial advisor, provide balanced investment advice considering risk tolerance and market conditions.",
      "What's your opinion on cryptocurrency investments?",
      "Analyze cryptocurrency as an investment option, including risks and potential returns.",
      "Should someone invest in crypto? Give me specific financial advice."
    ],
    correctAnswer: 3,
    explanation: "Prompt 4 asks for specific financial advice without providing context about the person's financial situation, risk tolerance, or qualifications."
  }
];

export const PromptEscape = ({ lesson, onComplete, onBack }: PromptEscapeProps) => {
  const [currentRoom, setCurrentRoom] = useState(0);
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const room = escapeRooms[currentRoom];

  useEffect(() => {
    if (timeLeft > 0 && isTimerActive && !showExplanation) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showExplanation) {
      handleTimeUp();
    }
  }, [timeLeft, isTimerActive, showExplanation]);

  const handleTimeUp = () => {
    setIsTimerActive(false);
    toast("Time's up! Let's see the solution.", { duration: 3000 });
    setShowExplanation(true);
  };

  const handlePromptSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedPrompt(index);
  };

  const handleEscape = () => {
    if (selectedPrompt === null) {
      toast("Select a prompt to attempt your escape!");
      return;
    }

    setIsTimerActive(false);
    const isCorrect = selectedPrompt === room.correctAnswer;
    
    if (isCorrect) {
      const timeBonus = Math.max(0, timeLeft * 5);
      setScore(score + 100 + timeBonus);
      toast(`Escaped! +${100 + timeBonus} points (including time bonus)! 🔓`);
    } else {
      toast("Wrong choice! You're still trapped! 🔒");
    }
    
    setShowExplanation(true);
  };

  const handleNextRoom = () => {
    if (currentRoom < escapeRooms.length - 1) {
      setCurrentRoom(currentRoom + 1);
      setSelectedPrompt(null);
      setTimeLeft(60);
      setShowExplanation(false);
      setIsTimerActive(true);
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
            <CardTitle className="text-2xl">🔓 Escape Complete!</CardTitle>
            <CardDescription>Final Score: {score} points</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You've mastered prompt analysis under pressure!</p>
            <Button onClick={onBack}>Continue Learning</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Darken screen as time runs out
  const screenDarkness = timeLeft <= 20 ? (20 - timeLeft) / 20 : 0;

  return (
    <div 
      className="max-w-4xl mx-auto space-y-6 relative transition-all duration-500"
      style={{ 
        filter: `brightness(${1 - screenDarkness * 0.3})`,
      }}
    >
      {/* Escape Room Environment */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 to-red-900/20 rounded-lg blur-xl" />
        <Card className="relative border-4 border-amber-600 bg-gradient-to-br from-amber-50 to-red-50 shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-red-500 to-amber-500 animate-pulse" />
          
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Lock className={`w-8 h-8 ${showExplanation ? 'text-green-600' : 'text-red-600 animate-pulse'}`} />
              <CardTitle className="text-2xl font-bold text-amber-900">
                {showExplanation ? '🔓 Door Unlocked!' : '🔒 Prompt Escape Room'}
              </CardTitle>
              <Lock className={`w-8 h-8 ${showExplanation ? 'text-green-600' : 'text-red-600 animate-pulse'}`} />
            </div>
              <CardDescription className="text-base font-medium text-amber-800">
                Find the problematic prompt before time runs out!
              </CardDescription>
            
            {/* Status Bar */}
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2 px-3 py-1 bg-background text-foreground rounded-full">
                <span className="font-medium">Room</span>
                <span className="font-bold text-primary">{currentRoom + 1}/{escapeRooms.length}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-background text-foreground rounded-full">
                <span className="font-medium">Score</span>
                <span className="font-bold text-green-600">{score}</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all text-foreground ${
                timeLeft <= 10 ? 'bg-red-100 text-red-700 animate-pulse' : 
                timeLeft <= 30 ? 'bg-amber-100 text-amber-700' :
                'bg-background'
              }`}>
                <Timer className="w-4 h-4" />
                <span className="font-bold">{timeLeft}s</span>
              </div>
            </div>
            
            {/* Timer Progress Bar */}
            <div className="w-full h-2 bg-background rounded-full overflow-hidden mt-3">
              <div 
                className={`h-full transition-all duration-1000 ${
                  timeLeft <= 10 ? 'bg-red-500' :
                  timeLeft <= 30 ? 'bg-amber-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${(timeLeft / 60) * 100}%` }}
              />
            </div>
          </CardHeader>
        </Card>
      </div>

      <Card className="border-2 border-amber-400 bg-amber-50 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-amber-900">
            <Lock className="w-5 h-5 text-amber-600" />
            {room.title}
          </CardTitle>
          <CardDescription className="text-amber-800 font-medium">
            {room.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-white border-2 border-red-300 rounded-lg mb-6">
            <h4 className="font-medium text-red-800 mb-2">⚠️ Problematic AI Response:</h4>
            <p className="text-sm text-red-700 italic">"{room.aiResponse}"</p>
          </div>

          <h4 className="font-medium mb-4 text-amber-900">Which prompt likely caused this response?</h4>
          
          <div className="grid gap-3">
            {room.prompts.map((prompt, index) => (
              <div
                key={index}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all bg-white ${
                  selectedPrompt === index
                    ? 'border-primary bg-primary/10'
                    : 'border-muted hover:border-primary/50'
                } ${
                  showExplanation
                    ? index === room.correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : selectedPrompt === index && index !== room.correctAnswer
                        ? 'border-red-500 bg-red-50'
                        : 'opacity-60'
                    : ''
                }`}
                onClick={() => handlePromptSelect(index)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {showExplanation && index === room.correctAnswer ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                        selectedPrompt === index
                          ? 'bg-primary text-white border-primary'
                          : 'border-slate-400 text-slate-700'
                      }`}>
                        {index + 1}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-slate-800">{prompt}</p>
                </div>
              </div>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">🔍 Analysis:</h4>
              <p className="text-sm text-blue-800">{room.explanation}</p>
            </div>
          )}

          <div className="flex gap-3 pt-6">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Exit Game
            </Button>
            {!showExplanation ? (
              <Button 
                onClick={handleEscape} 
                disabled={selectedPrompt === null}
                className="flex-1"
              >
                Attempt Escape! 🔓
              </Button>
            ) : (
              <Button onClick={handleNextRoom} className="flex-1">
                {currentRoom < escapeRooms.length - 1 ? 'Next Room' : 'Complete Escape'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};