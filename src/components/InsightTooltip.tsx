import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface InsightTooltipProps {
  insight: string;
  example?: string;
  children?: React.ReactNode;
}

export const InsightTooltip = ({ insight, example, children }: InsightTooltipProps) => (
  <TooltipProvider>
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center gap-1 cursor-help border-b border-dotted border-muted-foreground/40 hover:border-primary transition-colors">
          {children}
          <Info className="w-3 h-3 text-muted-foreground" />
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs space-y-2 p-3">
        <p className="text-sm font-medium">{insight}</p>
        {example && (
          <div className="text-xs text-muted-foreground border-l-2 border-accent pl-2 italic">
            {example}
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
