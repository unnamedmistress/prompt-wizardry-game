import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GenieMentorProps {
  message: string;
  isOpen: boolean;
  onClose?: () => void;
  onGetHint?: () => void;
  hintCost?: number;
  hintDisabled?: boolean;
}

const GenieMentor: React.FC<GenieMentorProps> = ({
  message,
  isOpen,
  onClose,
  onGetHint,
  hintCost,
  hintDisabled,
}) => {
  if (!isOpen) {
    return onGetHint ? (
      <button
        aria-label="Get hint"
        onClick={onGetHint}
        disabled={hintDisabled}
        className="fixed bottom-4 right-4 z-50 bg-purple-600 text-white p-3 rounded-full shadow-lg"
      >
        ?
      </button>
    ) : null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-end gap-2">
      <span className="text-4xl" aria-hidden="true">🧞</span>
      <div className="relative">
        <div
          className="bg-purple-600 text-white rounded-lg p-3 pr-8 shadow-lg text-sm"
          role="status"
        >
          {message}
          {onClose && (
            <button
              aria-label="Close"
              onClick={onClose}
              className="absolute top-1 right-1 text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="absolute -bottom-2 right-6 w-4 h-4 bg-purple-600 rotate-45" />
        {onGetHint && (
          <Button
            onClick={onGetHint}
            disabled={hintDisabled}
            className="mt-2 w-full text-xs"
            aria-label="Get Hint"
          >
            Get Hint (-{hintCost}🪙)
          </Button>
        )}
      </div>
    </div>
  );
};

export default GenieMentor;

