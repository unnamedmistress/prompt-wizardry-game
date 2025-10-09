import { useState } from "react";
import { cn } from "@/lib/utils";

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  isFlipped?: boolean;
  onFlip?: (flipped: boolean) => void;
}

export const FlipCard = ({ front, back, className, isFlipped: controlledFlipped, onFlip }: FlipCardProps) => {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const isFlipped = controlledFlipped !== undefined ? controlledFlipped : internalFlipped;

  const handleFlip = () => {
    const newFlipped = !isFlipped;
    if (controlledFlipped === undefined) {
      setInternalFlipped(newFlipped);
    }
    onFlip?.(newFlipped);
  };

  return (
    <div
      className={cn("relative cursor-pointer group perspective-1000", className)}
      onMouseEnter={() => !controlledFlipped && handleFlip()}
      onMouseLeave={() => !controlledFlipped && handleFlip()}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-500 transform-style-3d",
          isFlipped && "rotate-y-180"
        )}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden">
          {front}
        </div>
        
        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          {back}
        </div>
      </div>
    </div>
  );
};
