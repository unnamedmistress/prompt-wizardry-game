import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { usePlayerStore } from '@/store/usePlayerStore';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, RefreshCw } from 'lucide-react';

const tones = [
  { word: "professional", color: "bg-blue-500", description: "Formal, respectful and clear" },
  { word: "casual", color: "bg-green-500", description: "Friendly, relaxed" },
  { word: "urgent", color: "bg-red-500", description: "Immediate and important" },
  { word: "humorous", color: "bg-yellow-500", description: "Light-hearted and amusing" },
  { word: "confident", color: "bg-purple-500", description: "Assured and decisive" },
  { word: "empathetic", color: "bg-pink-500", description: "Understanding and caring" }
];

const basePrompt = "Write a _____ email to my boss to call out sick today.";

export default function ToneExperimentGame() {
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<Array<{tone: string, response: string}>>([]);
  const { toast } = useToast();
  const { addXp, improveSkill } = usePlayerStore();

  const handleToneSelect = async (tone: string) => {
    setSelectedTone(tone);
    const prompt = basePrompt.replace("_____", tone);
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-prompt-response', {
        body: { prompt }
      });

      if (error) throw error;

      setAiResponse(data.response);
      setResponses(prev => [...prev, { tone, response: data.response }]);
      addXp(25);
      improveSkill('promptClarity', 6);
      improveSkill('contextAwareness', 4);
      
      if (responses.length >= 2) {
        toast({ title: '🎯 Great! You see how tone changes everything!' });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({ title: '❌ Generation failed', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedTone(null);
    setAiResponse('');
    setResponses([]);
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-xl font-bold">Tone Experiment</h3>
        <p className="text-sm text-muted-foreground">See how one word changes everything</p>
      </div>

      <div className="p-4 bg-muted rounded-lg">
        <p className="text-lg text-center">
          Write a <span className="text-primary font-bold underline">_____</span> email to my boss to call out sick today.
        </p>
      </div>

      <div>
        <p className="text-sm font-medium mb-3">Choose a tone word:</p>
        <div className="grid grid-cols-2 gap-3">
          {tones.map((tone) => (
            <Button
              key={tone.word}
              variant={selectedTone === tone.word ? "default" : "outline"}
              onClick={() => !isLoading && handleToneSelect(tone.word)}
              disabled={isLoading}
              className="h-auto py-4 flex-col items-start"
            >
              <span className="font-bold capitalize">{tone.word}</span>
              <span className="text-xs opacity-80">{tone.description}</span>
            </Button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {aiResponse && !isLoading && (
        <div className="space-y-4">
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{selectedTone}</Badge>
              <span className="text-sm font-medium">AI Response:</span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{aiResponse}</p>
          </div>

          {responses.length > 1 && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">💡 Notice the differences:</p>
              <p className="text-xs">Each tone word completely changes the style, length, and feeling of the email!</p>
            </div>
          )}

          <Button onClick={handleReset} variant="outline" className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Another Tone
          </Button>
        </div>
      )}

      <div className="text-center text-sm text-muted-foreground">
        Tried {responses.length} tone{responses.length !== 1 ? 's' : ''}
      </div>
    </Card>
  );
}
