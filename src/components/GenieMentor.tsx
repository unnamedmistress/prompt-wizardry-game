import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, X, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenieMentorProps {
  hint?: string;
  isVisible: boolean;
  onDismiss: () => void;
  className?: string;
}

export function GenieMentor({ hint, isVisible, onDismiss, className }: GenieMentorProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [isVisible]);

  if (!isVisible && !isAnimating) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        className
      )}
    >
      <Card className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border-primary/30 p-4 max-w-xs shadow-elegant">
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center animate-pulse">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ping" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary flex items-center gap-1">
                <Lightbulb className="w-3 h-3" />
                Genie Tip
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="h-6 w-6 p-0 hover:bg-primary/10"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {hint || "Keep going! You're on the right track."}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
