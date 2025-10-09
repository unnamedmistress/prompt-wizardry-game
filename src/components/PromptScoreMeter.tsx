import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Zap, Target, CheckCircle2 } from "lucide-react";

interface PromptScoreMeterProps {
  prompt: string;
  onScoreChange?: (score: number) => void;
}

interface ScoreCriteria {
  label: string;
  met: boolean;
  icon: React.ReactNode;
}

export function PromptScoreMeter({ prompt, onScoreChange }: PromptScoreMeterProps) {
  const [score, setScore] = useState(0);
  const [criteria, setCriteria] = useState<ScoreCriteria[]>([]);

  useEffect(() => {
    const evaluatePrompt = () => {
      const text = prompt.toLowerCase().trim();
      const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;

      const checks: ScoreCriteria[] = [
        {
          label: "Has context/role",
          met: text.includes('you are') || text.includes('act as') || text.includes('role') || text.includes('expert'),
          icon: <Target className="w-3 h-3" />
        },
        {
          label: "Clear task",
          met: text.includes('write') || text.includes('create') || text.includes('generate') || text.includes('explain') || text.includes('help'),
          icon: <Zap className="w-3 h-3" />
        },
        {
          label: "Specific details",
          met: wordCount >= 15,
          icon: <Sparkles className="w-3 h-3" />
        },
        {
          label: "Format/tone specified",
          met: text.includes('format') || text.includes('tone') || text.includes('style') || text.includes('professional') || text.includes('casual'),
          icon: <CheckCircle2 className="w-3 h-3" />
        }
      ];

      const metCount = checks.filter(c => c.met).length;
      const calculatedScore = (metCount / checks.length) * 100;

      setCriteria(checks);
      setScore(calculatedScore);
      onScoreChange?.(calculatedScore);
    };

    evaluatePrompt();
  }, [prompt, onScoreChange]);

  const getScoreColor = () => {
    if (score >= 75) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreLabel = () => {
    if (score >= 75) return "Strong";
    if (score >= 50) return "Good";
    if (score >= 25) return "Weak";
    return "Needs work";
  };

  if (!prompt) return null;

  return (
    <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Prompt Quality</span>
          <Badge variant="outline" className={getScoreColor()}>
            {Math.round(score)}% · {getScoreLabel()}
          </Badge>
        </div>
        
        <Progress value={score} className="h-2" />
        
        <div className="grid grid-cols-2 gap-2">
          {criteria.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 text-xs px-2 py-1 rounded ${
                item.met 
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
