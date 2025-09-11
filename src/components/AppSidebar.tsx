import React from "react";
import { Button } from "./ui/button";

interface AppSidebarProps {
  currentStep?: number;
  gameTitle?: string;
  showMobileSidebar?: boolean;
  setShowMobileSidebar?: (show: boolean) => void;
}

export function AppSidebar({ currentStep = 1, gameTitle, showMobileSidebar, setShowMobileSidebar }: AppSidebarProps) {
  const renderGameContent = () => {
    if (currentStep === 1) {
      return (
        <div className="p-4 sm:p-6 space-y-4">
          {/* Close button for mobile */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <h3 className="font-semibold">AI Introduction</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowMobileSidebar?.(false)}>
              ✕
            </Button>
          </div>

          {/* Video */}
          <div className="aspect-[9/16] w-full mb-4">
            <iframe
              src="https://www.youtube.com/embed/SBcirWAPVK0"
              title="AI Introduction Video"
              className="w-full h-full rounded-lg border"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
          
          {/* Text Content */}
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-bold text-lg mb-2">🤖 What is AI?</h3>
              <p className="text-muted-foreground mb-3">AI Basics</p>
              <p className="text-muted-foreground">
                Think of AI like a well‑read parrot: it has seen countless sentences, so when you 
                prompt it, it guesses the words that usually come next.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2">Your Mission</h4>
              <p className="text-muted-foreground">Explore how AI mimics voices, predicts words, and changes tone in this section.</p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Activity</h4>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Start a conversation by selecting a character and clicking Send.</li>
                <li>Try different characters to see how AI adapts its voice and style.</li>
                <li>Notice how the same message gets transformed based on the character's personality.</li>
              </ol>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="p-4 sm:p-6 space-y-4">
        <div>
          <h3 className="font-bold text-lg mb-2">{gameTitle}</h3>
          <p className="text-muted-foreground">
            Game content and instructions will appear here for different steps.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full">
      {renderGameContent()}
    </div>
  );
}