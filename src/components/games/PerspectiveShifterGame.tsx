import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { usePlayerStore } from '@/store/usePlayerStore';

export default function PerspectiveShifterGame() {
  const [prompt, setPrompt] = useState('');
  const { toast } = useToast();
  const { addXp } = usePlayerStore();

  const submit = () => {
    if (prompt.length > 30) {
      addXp(30);
      toast({ title: '✓ Great perspective!' });
      setPrompt('');
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h4 className="font-semibold">Write from different viewpoints</h4>
      <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Your prompt..." />
      <Button onClick={submit} className="w-full">Submit</Button>
    </Card>
  );
}
