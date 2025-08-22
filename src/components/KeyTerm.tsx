import {
  Tooltip, TooltipTrigger, TooltipContent
} from "@/components/ui/tooltip";

interface KeyTermProps {
  term: string;
  definition: string;
  children?: React.ReactNode;
}

export const KeyTerm = ({ term, definition, children }: KeyTermProps) => (
  <Tooltip>
    <TooltipTrigger className="underline decoration-dotted cursor-help">
      {children ?? term}
    </TooltipTrigger>
    <TooltipContent className="max-w-xs text-sm">
      {definition}
    </TooltipContent>
  </Tooltip>
);