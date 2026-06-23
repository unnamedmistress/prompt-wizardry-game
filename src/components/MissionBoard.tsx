import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";

interface MissionSlot {
  id: string;
  placeholder: string;
  hint?: string;
  category: "role" | "task" | "context" | "format";
}

interface MissionBoardProps {
  title: string;
  template: string; // e.g., "You are a [ROLE] helping to [TASK] for [CONTEXT] in [FORMAT] format"
  slots: MissionSlot[];
  onStart: (filledTemplate: Record<string, string>) => void;
  onSkip?: () => void;
}

const categoryColors = {
  role: "bg-[#4A8EFF]/10 text-[#4A8EFF] border-[#4A8EFF]/20",
  task: "bg-[#8C5CF6]/10 text-[#8C5CF6] border-[#8C5CF6]/20",
  context: "bg-[#1AC676]/10 text-[#1AC676] border-[#1AC676]/20",
  format: "bg-primary/10 text-primary border-primary/20"
};

export function MissionBoard({ title, template, slots, onStart, onSkip }: MissionBoardProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  
  const handleChange = (slotId: string, value: string) => {
    setValues(prev => ({ ...prev, [slotId]: value }));
  };

  const allFilled = slots.every(slot => values[slot.id]?.trim());

  const buildPreview = () => {
    let preview = template;
    slots.forEach(slot => {
      const value = values[slot.id] || `[${slot.placeholder}]`;
      preview = preview.replace(`[${slot.id.toUpperCase()}]`, value);
    });
    return preview;
  };

  return (
    <Card className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border-primary/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <CardTitle className="text-foreground">{title}</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Fill in the blanks to craft your prompt
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Interactive slots */}
        <div className="space-y-3">
          {slots.map((slot) => (
            <div key={slot.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-xs ${categoryColors[slot.category]}`}>
                  {slot.category}
                </Badge>
                {slot.hint && (
                  <span className="text-xs text-muted-foreground">
                    {slot.hint}
                  </span>
                )}
              </div>
              <Input
                placeholder={slot.placeholder}
                value={values[slot.id] || ""}
                onChange={(e) => handleChange(slot.id, e.target.value)}
                className="bg-background/50"
              />
            </div>
          ))}
        </div>

        {/* Live preview */}
        {Object.keys(values).length > 0 && (
          <div className="p-3 bg-background/50 rounded-lg border border-primary/20">
            <p className="text-xs text-muted-foreground mb-1">Preview:</p>
            <p className="text-sm text-foreground font-medium">
              {buildPreview()}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onStart(values)}
            disabled={!allFilled}
            className="flex-1"
          >
            Start Challenge
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          {onSkip && (
            <Button variant="ghost" onClick={onSkip}>
              Skip
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
