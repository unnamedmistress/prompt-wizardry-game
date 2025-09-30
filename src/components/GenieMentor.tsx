import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface GenieMentorProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  onGetHint: () => Promise<void>;
  hintCost: number;
  hintDisabled: boolean;
}

export function GenieMentor({ 
  message, 
  isOpen, 
  onClose, 
  onGetHint, 
  hintCost, 
  hintDisabled 
}: GenieMentorProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-4xl">🧞</span>
            Genie's Wisdom
          </DialogTitle>
          <DialogDescription>
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onGetHint}
            disabled={hintDisabled}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Get Hint ({hintCost} coins)
          </Button>
          <Button onClick={onClose}>Got it!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default GenieMentor;
