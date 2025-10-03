import { useState } from "react";
import { cn } from "@/lib/utils";

interface ComparisonSliderProps {
  before: React.ReactNode;
  after: React.ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export const ComparisonSlider = ({ 
  before, 
  after, 
  beforeLabel = "Before", 
  afterLabel = "After",
  className 
}: ComparisonSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, rect);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.touches[0].clientX, rect);
  };

  return (
    <div
      className={cn("relative overflow-hidden rounded-lg border bg-background", className)}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* After content (full width) */}
      <div className="w-full">
        {after}
      </div>

      {/* Before content (clipped) */}
      <div
        className="absolute top-0 left-0 h-full overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        {before}
      </div>

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary shadow-lg flex items-center justify-center">
          <div className="w-1 h-4 bg-primary-foreground rounded-full" />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-2 left-2 text-xs font-medium bg-background/80 px-2 py-1 rounded backdrop-blur-sm">
        {beforeLabel}
      </div>
      <div className="absolute top-2 right-2 text-xs font-medium bg-background/80 px-2 py-1 rounded backdrop-blur-sm">
        {afterLabel}
      </div>
    </div>
  );
};
