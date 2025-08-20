import React from "react";
import { X } from "lucide-react";

interface GenieMentorProps {
  message: string;
  isOpen: boolean;
  onClose?: () => void;
}

const GenieMentor: React.FC<GenieMentorProps> = ({ message, isOpen, onClose }) => {
  if (!isOpen) return null;

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
      </div>
    </div>
  );
};

export default GenieMentor;

