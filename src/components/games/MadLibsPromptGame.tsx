import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { usePlayerStore } from '@/store/usePlayerStore';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Send } from 'lucide-react';

interface BlankField {
  id: string;
  label: string;
  placeholder: string;
}

const templates = [
  {
    id: 1,
    title: "Email Generator",
    template: "Write a {tone} email to my {recipient} about {topic}. Keep it {length} and {style}.",
    blanks: [
      { id: "tone", label: "Tone", placeholder: "professional" },
      { id: "recipient", label: "Recipient", placeholder: "boss" },
      { id: "topic", label: "Topic", placeholder: "project update" },
      { id: "length", label: "Length", placeholder: "brief" },
      { id: "style", label: "Style", placeholder: "friendly" }
    ]
  },
  {
    id: 2,
    title: "Story Starter",
    template: "Write a {genre} story about a {character} who discovers a {object} in {location}. Make it {mood}.",
    blanks: [
      { id: "genre", label: "Genre", placeholder: "mystery" },
      { id: "character", label: "Character", placeholder: "detective" },
      { id: "object", label: "Object", placeholder: "ancient map" },
      { id: "location", label: "Location", placeholder: "an old library" },
      { id: "mood", label: "Mood", placeholder: "suspenseful" }
    ]
  }
];

export default function MadLibsPromptGame() {
  const [currentTemplate, setCurrentTemplate] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addXp, improveSkill } = usePlayerStore();

  const template = templates[currentTemplate];

  const handleGenerate = async () => {
    const allFilled = template.blanks.every(blank => values[blank.id]?.trim());
    
    if (!allFilled) {
      toast({ title: '⚠️ Fill in all blanks!', variant: 'destructive' });
      return;
    }

    let prompt = template.template;
    template.blanks.forEach(blank => {
      prompt = prompt.replace(`{${blank.id}}`, values[blank.id]);
    });

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-prompt-response', {
        body: { prompt }
      });

      if (error) throw error;

      setAiResponse(data.response);
      addXp(40);
      improveSkill('promptClarity', 8);
      improveSkill('creativityBalance', 5);
      toast({ title: '🎨 Great prompt crafted!' });
    } catch (error) {
      console.error('Error:', error);
      toast({ title: '❌ Generation failed', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setValues({});
    setAiResponse('');
  };

  const handleNextTemplate = () => {
    setCurrentTemplate((prev) => (prev + 1) % templates.length);
    handleReset();
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-xl font-bold">{template.title}</h3>
        <p className="text-sm text-muted-foreground">Fill in the blanks to create your prompt</p>
      </div>

      <div className="space-y-4">
        {template.blanks.map((blank) => (
          <div key={blank.id} className="space-y-2">
            <Label htmlFor={blank.id}>{blank.label}</Label>
            <Input
              id={blank.id}
              value={values[blank.id] || ''}
              onChange={(e) => setValues({ ...values, [blank.id]: e.target.value })}
              placeholder={blank.placeholder}
            />
          </div>
        ))}
      </div>

      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm font-mono">
          {template.blanks.reduce((acc, blank) => {
            return acc.replace(`{${blank.id}}`, values[blank.id] ? 
              `<span class="text-primary font-semibold">${values[blank.id]}</span>` : 
              `<span class="text-muted-foreground">{${blank.id}}</span>`);
          }, template.template).split('<span').map((part, i) => 
            i === 0 ? part : <span key={i} dangerouslySetInnerHTML={{ __html: '<span' + part }} />
          )}
        </p>
      </div>

      <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        Generate AI Response
      </Button>

      {aiResponse && (
        <div className="space-y-3">
          <div className="p-4 bg-primary/10 rounded-lg">
            <p className="text-sm font-medium mb-2">🤖 AI Response:</p>
            <p className="text-sm whitespace-pre-wrap">{aiResponse}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleReset} variant="outline" className="flex-1">Reset</Button>
            <Button onClick={handleNextTemplate} className="flex-1">Try Another</Button>
          </div>
        </div>
      )}
    </Card>
  );
}
