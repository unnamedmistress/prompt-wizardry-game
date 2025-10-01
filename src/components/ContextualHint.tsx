import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";

interface ContextualHintProps {
  children: React.ReactNode;
  hint: string;
  delayMs?: number;
}

export const ContextualHint = ({ children, hint, delayMs = 3000 }: ContextualHintProps) => {
  const [showHint, setShowHint] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (hasInteracted) return;

    const timer = setTimeout(() => {
      setShowHint(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs, hasInteracted]);

  const handleInteraction = () => {
    setHasInteracted(true);
    setShowHint(false);
  };

  return (
    <div 
      className="relative"
      onClick={handleInteraction}
      onMouseEnter={handleInteraction}
    >
      {children}
      {showHint && !hasInteracted && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10 animate-bounce-in pointer-events-none">
          <div className="bg-accent text-accent-foreground px-3 py-2 rounded-lg shadow-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap">
            <Lightbulb className="w-3 h-3" />
            {hint}
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent rotate-45" />
        </div>
      )}
      {showHint && !hasInteracted && (
        <div className="absolute inset-0 rounded-lg animate-pulse-hint ring-2 ring-accent/50 pointer-events-none" />
      )}
    </div>
  );
};
