import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ContextualHintProps {
  message: string;
  type?: "info" | "warning" | "success";
}

export function ContextualHint({ message, type = "info" }: ContextualHintProps) {
  const colors = {
    info: "border-primary/30 bg-primary/5 text-primary",
    warning: "border-[#FFB200]/30 bg-[#FFB200]/5 text-[#FFB200]",
    success: "border-[#1AC676]/30 bg-[#1AC676]/5 text-[#1AC676]"
  };

  return (
    <Card className={`p-3 ${colors[type]} animate-fade-in`}>
      <div className="flex items-start gap-2">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed">{message}</p>
      </div>
    </Card>
  );
}
