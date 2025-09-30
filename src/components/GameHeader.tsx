import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star, Trophy } from "lucide-react";

interface GameHeaderProps {
  level: number;
  score: number;
  totalChallenges: number;
  completedChallenges: number;
}

export function GameHeader({ level, score, totalChallenges, completedChallenges }: GameHeaderProps) {
  const progressPercentage = (completedChallenges / totalChallenges) * 100;

  return (
    <div className="bg-gradient-card border border-primary/20 rounded-lg p-6 mb-8 shadow-card">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-mystical bg-clip-text text-transparent">
            Prompt Wizardry
          </h1>
          <p className="text-muted-foreground">
            Master the art of AI prompting through magical challenges
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex gap-2">
            <Badge className="bg-primary/20 text-primary border-primary/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Level {level}
            </Badge>
            <Badge className="bg-accent/20 text-accent border-accent/30">
              <Star className="w-3 h-3 mr-1" />
              {score} Points
            </Badge>
            <Badge className="bg-secondary/40 text-secondary-foreground border-secondary/30">
              <Trophy className="w-3 h-3 mr-1" />
              {completedChallenges}/{totalChallenges}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
    </div>
  );
}