import { cn } from "@/lib/utils";

interface ProgressMeterProps {
  value: number;
  max: number;
  label?: string;
  color?: "primary" | "green" | "amber" | "purple";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const ProgressMeter = ({ 
  value, 
  max, 
  label, 
  color = "primary", 
  size = "md",
  showLabel = true 
}: ProgressMeterProps) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    primary: "text-primary",
    green: "text-green-600",
    amber: "text-amber-600",
    purple: "text-purple-600"
  };

  const strokeClasses = {
    primary: "stroke-primary",
    green: "stroke-green-600",
    amber: "stroke-amber-600",
    purple: "stroke-purple-600"
  };

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };

  const fontSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  const radius = size === "sm" ? 28 : size === "md" ? 42 : 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn("relative", sizeClasses[size])}>
        <svg className="transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted opacity-20"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn(strokeClasses[color], "transition-all duration-500 ease-out")}
            strokeLinecap="round"
          />
        </svg>
        <div className={cn(
          "absolute inset-0 flex items-center justify-center font-bold",
          colorClasses[color],
          fontSize[size]
        )}>
          {value}/{max}
        </div>
      </div>
      {showLabel && label && (
        <span className={cn("text-xs text-muted-foreground text-center", fontSize[size])}>{label}</span>
      )}
    </div>
  );
};
