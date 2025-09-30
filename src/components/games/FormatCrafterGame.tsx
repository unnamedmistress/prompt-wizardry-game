import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { usePlayerStore } from '@/store/usePlayerStore';

export default function FormatCrafterGame() {
  const [prompt, setPrompt] = useState('');
  const { toast } = useToast();
  const { addXp } = usePlayerStore();

  const check = () => {
    if (prompt.toLowerCase().includes('table') || prompt.toLowerCase().includes('list')) {
      addXp(35);
      toast({ title: '✓ Format specified!' });
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h4 className="font-semibold">Specify output format</h4>
      <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Your formatted prompt..." />
      <Button onClick={check} className="w-full">Check Format</Button>
    </Card>
  );
}
