import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { usePlayerStore } from '@/store/usePlayerStore';

export default function MultiTaskMaster() {
  const [prompt, setPrompt] = useState('');
  const { toast } = useToast();
  const { addXp } = usePlayerStore();

  const analyze = () => {
    const tasks = ['introduction', 'sections', 'examples', 'conclusion'];
    const found = tasks.filter(t => prompt.toLowerCase().includes(t)).length;
    if (found === 4) {
      addXp(75);
      toast({ title: '⚡ All tasks complete!' });
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h4 className="font-semibold">Combine multiple tasks</h4>
      <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Address all requirements..." className="min-h-[150px]" />
      <Button onClick={analyze} className="w-full">Analyze</Button>
    </Card>
  );
}
