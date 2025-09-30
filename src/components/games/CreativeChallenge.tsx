import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { usePlayerStore } from '@/store/usePlayerStore';

export default function CreativeChallenge() {
  const [response, setResponse] = useState('');
  const { toast } = useToast();
  const { addXp } = usePlayerStore();

  const evaluate = () => {
    if (response.split(/\s+/).length >= 50) {
      addXp(50);
      toast({ title: '🌟 Creative!' });
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h4 className="font-semibold">Create something unique</h4>
      <Textarea value={response} onChange={(e) => setResponse(e.target.value)} placeholder="Be creative..." className="min-h-[150px]" />
      <Button onClick={evaluate} className="w-full">Submit</Button>
    </Card>
  );
}
