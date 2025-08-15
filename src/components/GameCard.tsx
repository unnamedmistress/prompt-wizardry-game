import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GameCardProps {
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  completed?: boolean;
  locked?: boolean;
  onClick?: () => void;
  className?: string;
}

const difficultyColors = {
  Beginner: "bg-green-500/20 text-green-400 border-green-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", 
  Advanced: "bg-red-500/20 text-red-400 border-red-500/30"
};

export function GameCard({ 
  title, 
  description, 
  difficulty, 
  completed = false, 
  locked = false, 
  onClick,
  className 
}: GameCardProps) {
  return (
    <Card 
      className={cn(
        "bg-gradient-card border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-card cursor-pointer group",
        locked && "opacity-60 cursor-not-allowed",
        completed && "border-accent/40",
        className
      )}
      onClick={locked ? undefined : onClick}
    >
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground group-hover:text-primary-glow transition-colors">
            {title}
          </CardTitle>
          <div className="flex gap-2">
            <Badge className={difficultyColors[difficulty]}>
              {difficulty}
            </Badge>
            {completed && (
              <Badge className="bg-accent/20 text-accent border-accent/30">
                ✨ Complete
              </Badge>
            )}
            {locked && (
              <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
                🔒 Locked
              </Badge>
            )}
          </div>
        </div>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          variant="wizard" 
          className="w-full"
          disabled={locked}
        >
          {locked ? "Complete previous levels" : completed ? "Play Again" : "Start Challenge"}
        </Button>
      </CardContent>
    </Card>
  );
}