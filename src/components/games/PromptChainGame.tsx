import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { usePlayerStore } from '@/store/usePlayerStore';
import { supabase } from '@/integrations/supabase/client';
import { ArrowDown, Loader2, Sparkles } from 'lucide-react';

interface ChainStep {
  id: number;
  instruction: string;
  userPrompt: string;
  aiResponse: string;
}

export default function PromptChainGame() {
  const [steps, setSteps] = useState<ChainStep[]>([
    { id: 1, instruction: "Start: Ask AI to write a short story about a robot", userPrompt: "", aiResponse: "" }
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addXp, improveSkill } = usePlayerStore();

  const nextStepInstructions = [
    "Now ask AI to summarize that story in one sentence",
    "Ask AI to rewrite the summary as a tweet",
    "Finally, ask AI to turn the tweet into a haiku"
  ];

  const handleSubmit = async () => {
    const currentPrompt = steps[currentStep].userPrompt;
    
    if (!currentPrompt.trim()) {
      toast({ title: '⚠️ Enter a prompt first!', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      // Use previous AI response as context for chained prompts
      const context = currentStep > 0 ? `Previous output: ${steps[currentStep - 1].aiResponse}` : '';
      const fullPrompt = context ? `${context}\n\nNew instruction: ${currentPrompt}` : currentPrompt;

      const { data, error } = await supabase.functions.invoke('generate-prompt-response', {
        body: { prompt: fullPrompt }
      });

      if (error) throw error;

      const updatedSteps = [...steps];
      updatedSteps[currentStep].aiResponse = data.response;
      setSteps(updatedSteps);

      addXp(35);
      improveSkill('promptClarity', 8);
      improveSkill('contextAwareness', 6);

      if (currentStep < nextStepInstructions.length) {
        // Add next step
        setTimeout(() => {
          setSteps([...updatedSteps, {
            id: currentStep + 2,
            instruction: nextStepInstructions[currentStep],
            userPrompt: "",
            aiResponse: ""
          }]);
          setCurrentStep(currentStep + 1);
        }, 1000);
      } else {
        toast({ title: '🎉 Chain Complete!', description: 'You built a 4-step prompt chain!' });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({ title: '❌ Generation failed', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSteps([
      { id: 1, instruction: "Start: Ask AI to write a short story about a robot", userPrompt: "", aiResponse: "" }
    ]);
    setCurrentStep(0);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-xl font-bold">Prompt Chain Builder</h3>
          <p className="text-sm text-muted-foreground">Use AI's output as input for the next prompt</p>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id}>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Step {step.id}</Badge>
                <p className="text-sm font-medium">{step.instruction}</p>
              </div>

              <Textarea
                value={step.userPrompt}
                onChange={(e) => {
                  const updated = [...steps];
                  updated[index].userPrompt = e.target.value;
                  setSteps(updated);
                }}
                placeholder="Type your prompt here..."
                disabled={index !== currentStep || isLoading}
                className="min-h-[80px]"
              />

              {step.aiResponse && (
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-xs font-medium mb-2">🤖 AI Response:</p>
                  <p className="text-sm whitespace-pre-wrap">{step.aiResponse}</p>
                </div>
              )}
            </div>

            {index < steps.length - 1 && (
              <div className="flex justify-center my-3">
                <ArrowDown className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>

      {currentStep < steps.length && (
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading} 
          className="w-full"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {currentStep === 0 ? 'Start Chain' : `Generate Step ${currentStep + 1}`}
        </Button>
      )}

      {currentStep >= nextStepInstructions.length && steps[currentStep]?.aiResponse && (
        <Button onClick={handleReset} variant="outline" className="w-full">
          Start New Chain
        </Button>
      )}

      <div className="text-center text-sm text-muted-foreground">
        {currentStep + 1} of {nextStepInstructions.length + 1} steps complete
      </div>
    </Card>
  );
}
