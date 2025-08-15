import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Puzzle, CheckCircle, Target } from "lucide-react";

interface PromptBuilderGameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

const promptElements = [
  { id: 1, text: "You are a professional assistant.", type: "role", category: "Role Definition" },
  { id: 2, text: "Write a polite email", type: "task", category: "Main Task" },
  { id: 3, text: "to reschedule our team meeting", type: "context", category: "Context" },
  { id: 4, text: "Use a professional and apologetic tone", type: "tone", category: "Tone/Style" },
  { id: 5, text: "Include a new proposed date and time", type: "details", category: "Specific Details" }
];

const correctOrder = [1, 2, 3, 4, 5];

export const PromptBuilderGame = ({ onComplete, onBack }: PromptBuilderGameProps) => {
  const [selectedElements, setSelectedElements] = useState<number[]>([]);
  const [availableElements, setAvailableElements] = useState([...promptElements]);
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleElementClick = (elementId: number) => {
    if (showFeedback) return;
    
    const element = availableElements.find(e => e.id === elementId);
    if (!element) return;

    setSelectedElements([...selectedElements, elementId]);
    setAvailableElements(availableElements.filter(e => e.id !== elementId));
  };

  const handleRemoveElement = (elementId: number) => {
    if (showFeedback) return;
    
    const element = promptElements.find(e => e.id === elementId);
    if (!element) return;

    setSelectedElements(selectedElements.filter(id => id !== elementId));
    setAvailableElements([...availableElements, element].sort((a, b) => a.id - b.id));
  };

  const handleSubmit = () => {
    if (selectedElements.length !== promptElements.length) {
      toast("Please arrange all prompt elements!");
      return;
    }

    let correctPlacements = 0;
    selectedElements.forEach((elementId, index) => {
      if (elementId === correctOrder[index]) {
        correctPlacements++;
      }
    });

    const scoreEarned = correctPlacements * 20;
    setScore(scoreEarned);
    setShowFeedback(true);

    if (correctPlacements === promptElements.length) {
      toast("Perfect! You've mastered prompt structure! 🎉");
      setTimeout(() => {
        setGameComplete(true);
        onComplete(scoreEarned);
      }, 2000);
    } else {
      toast(`Good effort! You got ${correctPlacements}/${promptElements.length} elements correct.`);
    }
  };

  const handleReset = () => {
    setSelectedElements([]);
    setAvailableElements([...promptElements]);
    setShowFeedback(false);
    setScore(0);
  };

  if (gameComplete) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl">🧩 Prompt Builder Complete!</CardTitle>
            <CardDescription>Score: {score}/100 points</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You've learned the fundamentals of prompt structure!</p>
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
          <Puzzle className="w-6 h-6 text-primary" />
          Prompt Builder Challenge
        </h2>
        <p className="text-muted-foreground">Drag and arrange the elements to build an effective prompt</p>
        <div className="text-sm text-muted-foreground">
          Score: {score}/100
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Available Elements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available Elements</CardTitle>
            <CardDescription>Click to add to your prompt</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableElements.map((element) => (
              <div
                key={element.id}
                className="p-3 border-2 border-dashed border-muted rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => handleElementClick(element.id)}
              >
                <div className="text-xs text-muted-foreground mb-1">{element.category}</div>
                <div className="text-sm">{element.text}</div>
              </div>
            ))}
            {availableElements.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                All elements used! ✨
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prompt Builder */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Prompt</CardTitle>
            <CardDescription>Build your prompt in the correct order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedElements.map((elementId, index) => {
              const element = promptElements.find(e => e.id === elementId);
              const isCorrectPosition = showFeedback && elementId === correctOrder[index];
              
              return (
                <div
                  key={`${elementId}-${index}`}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    showFeedback
                      ? isCorrectPosition
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : 'border-primary bg-primary/10 hover:bg-primary/20'
                  }`}
                  onClick={() => handleRemoveElement(elementId)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Step {index + 1}: {element?.category}
                      </div>
                      <div className="text-sm">{element?.text}</div>
                    </div>
                    {showFeedback && (
                      <CheckCircle className={`w-5 h-5 ${
                        isCorrectPosition ? 'text-green-600' : 'text-red-600'
                      }`} />
                    )}
                  </div>
                </div>
              );
            })}
            {selectedElements.length === 0 && (
              <div className="text-center text-muted-foreground py-8 border-2 border-dashed border-muted rounded-lg">
                Click elements to build your prompt
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showFeedback && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <h4 className="font-medium text-blue-900 mb-2">💡 Perfect Prompt Structure:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. <strong>Role Definition:</strong> "You are a professional assistant."</li>
              <li>2. <strong>Main Task:</strong> "Write a polite email"</li>
              <li>3. <strong>Context:</strong> "to reschedule our team meeting"</li>
              <li>4. <strong>Tone/Style:</strong> "Use a professional and apologetic tone"</li>
              <li>5. <strong>Specific Details:</strong> "Include a new proposed date and time"</li>
            </ol>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back to Lessons
        </Button>
        {showFeedback ? (
          <Button onClick={handleReset} className="flex-1">
            Try Again
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={selectedElements.length !== promptElements.length}
            className="flex-1"
          >
            Check My Prompt
          </Button>
        )}
      </div>
    </div>
  );
};