import { useState, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, XCircle, RotateCcw } from "lucide-react";

interface MultiAttemptWrapperProps {
  maxAttempts?: number;
  onAttemptComplete: (attemptNumber: number, score: number, success: boolean) => void;
  onFinalComplete: (finalScore: number, attemptsUsed: number) => void;
  children: (props: {
    currentAttempt: number;
    submitAttempt: (score: number, success: boolean) => void;
    attemptsRemaining: number;
  }) => ReactNode;
  lessonTitle: string;
}

export function MultiAttemptWrapper({
  maxAttempts = 3,
  onAttemptComplete,
  onFinalComplete,
  children,
  lessonTitle,
}: MultiAttemptWrapperProps) {
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [attemptHistory, setAttemptHistory] = useState<{ score: number; success: boolean }[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const submitAttempt = (score: number, success: boolean) => {
    const newHistory = [...attemptHistory, { score, success }];
    setAttemptHistory(newHistory);
    onAttemptComplete(currentAttempt, score, success);

    if (success || currentAttempt >= maxAttempts) {
      setIsComplete(true);
      const bestScore = Math.max(...newHistory.map(h => h.score));
      onFinalComplete(bestScore, currentAttempt);
    } else {
      setCurrentAttempt(currentAttempt + 1);
    }
  };

  const reset = () => {
    setCurrentAttempt(1);
    setAttemptHistory([]);
    setIsComplete(false);
  };

  const attemptsRemaining = maxAttempts - currentAttempt + 1;
  const bestScore = attemptHistory.length > 0 
    ? Math.max(...attemptHistory.map(h => h.score)) 
    : 0;

  return (
    <div className="space-y-4">
      {/* Attempt tracking header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-foreground">{lessonTitle}</CardTitle>
            <Badge variant={isComplete ? "default" : "outline"}>
              Attempt {currentAttempt} of {maxAttempts}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{currentAttempt}/{maxAttempts} attempts</span>
            </div>
            <Progress value={(currentAttempt / maxAttempts) * 100} className="h-2" />
          </div>

          {/* Attempt history */}
          {attemptHistory.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Previous Attempts:</p>
              <div className="flex gap-2 flex-wrap">
                {attemptHistory.map((attempt, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
                      attempt.success
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {attempt.success ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    <span>#{idx + 1}: {attempt.score}%</span>
                  </div>
                ))}
              </div>
              {bestScore > 0 && (
                <p className="text-xs text-primary font-semibold">
                  Best Score: {bestScore}%
                </p>
              )}
            </div>
          )}

          {/* Status message */}
          {!isComplete && attemptHistory.length > 0 && (
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-blue-900 font-medium">
                  {attemptsRemaining > 1 
                    ? `You have ${attemptsRemaining} attempts remaining`
                    : 'This is your final attempt!'}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Review the feedback and try again with improvements
                </p>
              </div>
            </div>
          )}

          {isComplete && (
            <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-green-900 font-medium">
                  Challenge Complete!
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Final Score: {bestScore}% • Attempts Used: {currentAttempt}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={reset}
                className="text-green-700 hover:text-green-900"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Render children with attempt props */}
      {children({
        currentAttempt,
        submitAttempt,
        attemptsRemaining,
      })}
    </div>
  );
}
