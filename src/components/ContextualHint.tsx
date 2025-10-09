import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ContextualHintProps {
  message: string;
  type?: "info" | "warning" | "success";
}

export function ContextualHint({ message, type = "info" }: ContextualHintProps) {
  const colors = {
    info: "border-primary/30 bg-primary/5 text-primary",
    warning: "border-yellow-500/30 bg-yellow-500/5 text-yellow-600 dark:text-yellow-400",
    success: "border-green-500/30 bg-green-500/5 text-green-600 dark:text-green-400"
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
