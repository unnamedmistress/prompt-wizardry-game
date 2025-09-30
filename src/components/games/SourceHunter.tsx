import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { usePlayerStore } from '@/store/usePlayerStore';

const scenarios = [
  { task: 'Research AI', correct: 1, options: ['Tell me about AI', 'List AI developments with citations', 'What is AI?'] },
  { task: 'Historical event', correct: 1, options: ['Write about moon landing', 'Summarize verified facts with sources', 'Tell a story'] }
];

export function SourceHunter() {
  const [current, setCurrent] = useState(0);
  const { toast } = useToast();
  const { addXp } = usePlayerStore();
  
  const handleSelect = (idx: number) => {
    if (idx === scenarios[current].correct) {
      addXp(40);
      toast({ title: '✓ Correct!', description: 'Great source awareness' });
      setTimeout(() => current < scenarios.length - 1 && setCurrent(current + 1), 1500);
    } else {
      toast({ title: 'Try again', variant: 'destructive' });
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h4 className="font-semibold">{scenarios[current].task}</h4>
      <div className="space-y-2">
        {scenarios[current].options.map((opt, idx) => (
          <Button key={idx} variant="outline" className="w-full" onClick={() => handleSelect(idx)}>{opt}</Button>
        ))}
      </div>
    </Card>
  );
}
