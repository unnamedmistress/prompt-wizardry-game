import {
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface KeyTermProps {
  term: string;
  definition: string;
  example?: string;
  children?: React.ReactNode;
}

export const KeyTerm = ({ term, definition, example, children }: KeyTermProps) => (
  <TooltipProvider>
    <Tooltip delayDuration={200}>
      <TooltipTrigger className="inline-flex items-center gap-1 underline decoration-dotted cursor-help hover:text-primary transition-colors">
        {children ?? term}
        <Info className="w-3 h-3 opacity-70" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs space-y-2 p-3 animate-slide-up">
        <p className="text-sm font-medium">{definition}</p>
        {example && (
          <div className="text-xs text-muted-foreground border-l-2 border-accent pl-2 italic">
            {example}
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);