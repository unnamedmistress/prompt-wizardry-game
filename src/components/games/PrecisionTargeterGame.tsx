import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { usePlayerStore } from '@/store/usePlayerStore';

export default function PrecisionTargeterGame() {
  const [prompt, setPrompt] = useState('');
  const { toast } = useToast();
  const { addXp } = usePlayerStore();

  const check = () => {
    const words = prompt.split(/\s+/).length;
    if (words >= 40 && words <= 60) {
      addXp(60);
      toast({ title: '🎯 Bullseye!' });
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h4 className="font-semibold">Hit exact specifications</h4>
      <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="40-60 words..." />
      <Button onClick={check} className="w-full">Check Precision</Button>
    </Card>
  );
}
