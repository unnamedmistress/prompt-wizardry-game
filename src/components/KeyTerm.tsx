import { ReactNode } from "react";
import { InsightTooltip } from "./InsightTooltip";

interface KeyTermProps {
  children: ReactNode;
  definition: string;
}

export function KeyTerm({ children, definition }: KeyTermProps) {
  return (
    <InsightTooltip content={definition}>
      <span className="underline decoration-dotted decoration-primary/50 cursor-help hover:decoration-primary transition-colors">
        {children}
      </span>
    </InsightTooltip>
  );
}
