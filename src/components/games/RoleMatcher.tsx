import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { usePlayerStore } from '@/store/usePlayerStore';
import { motion } from 'framer-motion';
import { Users, CheckCircle2 } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
}

interface Scenario {
  id: string;
  task: string;
  correctRole: string;
}

const roles: Role[] = [
  { id: 'expert', name: 'Expert Consultant', description: 'Provides detailed, professional advice' },
  { id: 'teacher', name: 'Patient Teacher', description: 'Explains concepts step-by-step' },
  { id: 'creative', name: 'Creative Partner', description: 'Generates imaginative ideas' },
  { id: 'analyst', name: 'Data Analyst', description: 'Analyzes information objectively' },
];

const scenarios: Scenario[] = [
  { id: 's1', task: 'Explain quantum physics to a 10-year-old', correctRole: 'teacher' },
  { id: 's2', task: 'Generate 10 unique business name ideas', correctRole: 'creative' },
  { id: 's3', task: 'Analyze sales data and identify trends', correctRole: 'analyst' },
  { id: 's4', task: 'Provide legal advice on contract terms', correctRole: 'expert' },
];

export function RoleMatcher() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();
  const { addXp, improveSkill } = usePlayerStore();

  const scenario = scenarios[currentScenario];
  const isCorrect = selectedRole === scenario.correctRole;

  const handleSubmit = () => {
    if (!selectedRole) {
      toast({
        title: 'Select a Role',
        description: 'Please choose a role first!',
        variant: 'destructive'
      });
      return;
    }

    setShowFeedback(true);

    if (isCorrect) {
      setScore(score + 1);
      addXp(20);
      improveSkill('contextAwareness', 12);
    }

    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(currentScenario + 1);
        setSelectedRole(null);
        setShowFeedback(false);
      } else {
        toast({
          title: '🎉 Game Complete!',
          description: `You matched ${score + (isCorrect ? 1 : 0)}/${scenarios.length} correctly!`,
        });
      }
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" />
            Role Matcher
          </h3>
          <p className="text-sm text-muted-foreground">
            Scenario {currentScenario + 1} of {scenarios.length}
          </p>
        </div>
        <Badge variant="outline">Score: {score}/{currentScenario + (showFeedback ? 1 : 0)}</Badge>
      </div>

      <Card className="p-6 space-y-6">
        <div className="bg-primary/10 rounded-lg p-4">
          <h4 className="font-semibold mb-2">Task:</h4>
          <p className="text-lg">{scenario.task}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Select the Best Role:</h4>
          <div className="grid gap-3">
            {roles.map((role) => (
              <motion.div
                key={role.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={selectedRole === role.id ? 'default' : 'outline'}
                  className="w-full justify-start h-auto py-4 px-4 text-left"
                  onClick={() => !showFeedback && setSelectedRole(role.id)}
                  disabled={showFeedback}
                >
                  <div className="flex-1">
                    <div className="font-semibold">{role.name}</div>
                    <div className="text-xs opacity-80 mt-1">{role.description}</div>
                  </div>
                  {showFeedback && role.id === scenario.correctRole && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 ml-2" />
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {!showFeedback ? (
          <Button onClick={handleSubmit} className="w-full">
            Submit Answer
          </Button>
        ) : (
          <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            <p className="font-semibold">
              {isCorrect ? '✓ Correct!' : '✗ Not quite.'}
            </p>
            <p className="text-sm mt-1">
              {isCorrect 
                ? 'Great job matching the role to the task!' 
                : `The best role for this task was "${roles.find(r => r.id === scenario.correctRole)?.name}"`}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}