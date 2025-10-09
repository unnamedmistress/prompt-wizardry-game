import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Lock, Clock, Star, CheckCircle } from "lucide-react";
import { InsightTooltip } from "./InsightTooltip";

interface GameCardProps {
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  icon?: string;
  estimatedTime?: string;
  starsEarned?: number;
  completed?: boolean;
  locked?: boolean;
  onClick?: () => void;
  className?: string;
  objective?: string;
  whatYoullLearn?: string[];
}

const difficultyRating = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3
};

const difficultyColors = {
  Beginner: "bg-green-500/10 text-green-500 border-green-500/20",
  Intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", 
  Advanced: "bg-red-500/10 text-red-500 border-red-500/20"
};

export function GameCard({ 
  title, 
  description,
  difficulty, 
  icon = "🎮",
  estimatedTime = "5 min",
  starsEarned = 3,
  completed = false, 
  locked = false, 
  onClick,
  className,
  objective,
  whatYoullLearn = []
}: GameCardProps) {
  const tooltipContent = (
    <div className="space-y-2 text-xs">
      <p className="font-medium">{description}</p>
      {objective && (
        <div className="space-y-1">
          <p className="font-semibold text-primary">🎯 Mission:</p>
          <p className="text-muted-foreground">{objective}</p>
        </div>
      )}
      {whatYoullLearn.length > 0 && (
        <div className="space-y-1">
          <p className="font-semibold text-primary">You'll practice:</p>
          <ul className="space-y-0.5">
            {whatYoullLearn.slice(0, 3).map((item, i) => (
              <li key={i} className="flex gap-1.5">
                <span className="text-primary">•</span>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <InsightTooltip content={tooltipContent}>
      <Card 
        className={cn(
          "bg-gradient-card border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-elegant cursor-pointer group hover:scale-[1.02] relative overflow-hidden",
          locked && "opacity-60 cursor-not-allowed hover:scale-100",
          completed && "border-accent/40",
          "p-3",
          className
        )}
        onClick={locked ? undefined : onClick}
      >
        {locked && (
          <div className="absolute inset-0 backdrop-blur-sm bg-background/80 flex items-center justify-center z-10 rounded-lg">
            <Lock className="w-6 h-6 text-muted-foreground" />
          </div>
        )}
        
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start gap-2">
            <span className="text-2xl flex-shrink-0">{icon}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors truncate">
                {title}
              </h3>
            </div>
            {completed && (
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            )}
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={`${difficultyColors[difficulty]} text-xs px-2 py-0 h-5`}>
              {"⚡".repeat(difficultyRating[difficulty])}
            </Badge>
            <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-muted text-xs px-2 py-0 h-5 gap-1">
              <Clock className="w-3 h-3" />
              {estimatedTime}
            </Badge>
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20 text-xs px-2 py-0 h-5 gap-1">
              <Star className="w-3 h-3 fill-current" />
              +{starsEarned}
            </Badge>
          </div>
        </div>
      </Card>
    </InsightTooltip>
  );
}