import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Search, CheckCircle, XCircle } from 'lucide-react';

interface Challenge {
  scenario: string;
  requiredDetails: string[];
  hints: string[];
}

const challenges: Challenge[] = [
  {
    scenario: 'Write a prompt to create a marketing email',
    requiredDetails: ['target audience', 'tone', 'call-to-action', 'key benefit'],
    hints: ['Who is this for?', 'What feeling should it convey?', 'What action do you want?', 'What value does it provide?']
  },
  {
    scenario: 'Design a prompt for a product description',
    requiredDetails: ['product category', 'key features', 'word count', 'format'],
    hints: ['What type of product?', 'What makes it special?', 'How long should it be?', 'Bullet points or paragraph?']
  }
];

export function DetailDetective() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userPrompt, setUserPrompt] = useState('');
  const [foundDetails, setFoundDetails] = useState<string[]>([]);
  const { toast } = useToast();
  const { addXp, improveSkill } = usePlayerStore();

  const challenge = challenges[currentChallenge];

  const analyzePrompt = () => {
    const promptLower = userPrompt.toLowerCase();
    const found = challenge.requiredDetails.filter(detail =>
      detail.split(' ').some(word => promptLower.includes(word))
    );
    
    setFoundDetails(found);
    
    if (found.length === challenge.requiredDetails.length) {
      addXp(50);
      improveSkill('promptClarity', 15);
      toast({ title: '🎯 Perfect!', description: 'All details found!' });
      
      setTimeout(() => {
        if (currentChallenge < challenges.length - 1) {
          setCurrentChallenge(currentChallenge + 1);
          setUserPrompt('');
          setFoundDetails([]);
        }
      }, 1500);
    } else {
      toast({ title: 'Keep trying', description: `Found ${found.length}/${challenge.requiredDetails.length}`, variant: 'destructive' });
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h4 className="font-semibold">{challenge.scenario}</h4>
      <div className="space-y-2">
        {challenge.requiredDetails.map((detail, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {foundDetails.includes(detail) ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-muted-foreground" />}
            <span>{detail}</span>
          </div>
        ))}
      </div>
      <Textarea value={userPrompt} onChange={(e) => setUserPrompt(e.target.value)} placeholder="Write your detailed prompt..." className="min-h-[120px]" />
      <Button onClick={analyzePrompt} className="w-full"><Search className="w-4 h-4 mr-2" />Analyze</Button>
    </Card>
  );
}
