import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Lightbulb, Wand2 } from "lucide-react";
import { PromptScoreMeter } from "./PromptScoreMeter";

interface PromptBuilderProps {
  challenge: {
    id: string;
    title: string;
    description: string;
    objective: string;
    hints: string[];
    goodExamples: string[];
    badExamples: string[];
  };
  onComplete: (score: number) => void;
  onBack: () => void;
}

export function PromptBuilder({ challenge, onComplete, onBack }: PromptBuilderProps) {
  const [userPrompt, setUserPrompt] = useState("");
  const [feedback, setFeedback] = useState<{type: 'good' | 'bad' | null, message: string, score: number}>({ type: null, message: "", score: 0 });
  const [showHints, setShowHints] = useState(false);

  const evaluatePrompt = () => {
    const prompt = userPrompt.toLowerCase().trim();
    
    // Simple scoring logic - in a real app this would be more sophisticated
    let score = 0;
    let feedbackMessage = "";
    let feedbackType: 'good' | 'bad' = 'bad';

    // Check for key elements
    const hasContext = prompt.includes('context') || prompt.includes('role') || prompt.includes('you are');
    const hasSpecificity = prompt.length > 50;
    const hasObjective = prompt.includes('write') || prompt.includes('create') || prompt.includes('generate') || prompt.includes('explain');
    const hasStructure = prompt.includes('format') || prompt.includes('structure') || prompt.includes('organize');

    if (hasContext) score += 25;
    if (hasSpecificity) score += 25;
    if (hasObjective) score += 25;
    if (hasStructure) score += 25;

    if (score >= 75) {
      feedbackType = 'good';
      feedbackMessage = "Excellent prompt! You've included context, clear objectives, and good structure. ✨";
    } else if (score >= 50) {
      feedbackType = 'good';
      feedbackMessage = "Good prompt! Consider adding more context or being more specific about the desired format.";
    } else {
      feedbackMessage = "Your prompt needs improvement. Try adding context, being more specific, and clarifying what you want the AI to do.";
    }

    setFeedback({ type: feedbackType, message: feedbackMessage, score });
    
    if (score >= 50) {
      setTimeout(() => onComplete(score), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4"
      >
        ← Back to Challenges
      </Button>

      <Card className="bg-gradient-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Wand2 className="w-5 h-5 text-primary" />
            {challenge.title}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {challenge.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-secondary/30 border border-secondary/50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-accent mb-2">🎯 Objective:</h4>
            <p className="text-muted-foreground">{challenge.objective}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card border-primary/20">
        <CardHeader>
          <CardTitle className="text-foreground">Your Prompt</CardTitle>
          <CardDescription>
            Craft your AI prompt below. Think about context, specificity, and clear instructions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your prompt here..."
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            className="min-h-[120px] bg-background border-border"
          />
          
          <PromptScoreMeter prompt={userPrompt} />
          
          <div className="flex gap-2">
            <Button 
              variant="magical" 
              onClick={evaluatePrompt}
              disabled={!userPrompt.trim()}
            >
              Test Prompt ✨
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowHints(!showHints)}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {showHints ? 'Hide' : 'Show'} Hints
            </Button>
          </div>

          {feedback.type && (
            <Card className={`border-2 ${feedback.type === 'good' ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'}`}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  {feedback.type === 'good' ? (
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 mt-1" />
                  )}
                  <div>
                    <p className="text-foreground">{feedback.message}</p>
                    <Badge className="mt-2" variant={feedback.type === 'good' ? 'default' : 'destructive'}>
                      Score: {feedback.score}/100
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {showHints && (
            <Card className="bg-accent/10 border-accent/30">
              <CardHeader>
                <CardTitle className="text-accent flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Hints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {challenge.hints.map((hint, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-accent">•</span>
                      {hint}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}