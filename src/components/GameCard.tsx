import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Lock, Trophy } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  icon: string;
  requiredLevel?: number;
  currentLevel: number;
  isCompleted: boolean;
  onPlay: () => void;
}

export function GameCard({
  title,
  description,
  difficulty,
  category,
  icon,
  requiredLevel = 1,
  currentLevel,
  isCompleted,
  onPlay
}: GameCardProps) {
  const isLocked = currentLevel < requiredLevel;

  const difficultyColor = {
    Beginner: 'bg-green-500/20 text-green-700 dark:text-green-300',
    Intermediate: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
    Advanced: 'bg-red-500/20 text-red-700 dark:text-red-300'
  };

  return (
    <motion.div
      whileHover={!isLocked ? { scale: 1.02 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
    >
      <Card className={`p-6 h-full flex flex-col ${isLocked ? 'opacity-60' : ''}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl">{icon}</div>
          {isCompleted && (
            <Badge className="bg-primary">
              <Trophy className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          )}
          {isLocked && (
            <Badge variant="secondary">
              <Lock className="w-3 h-3 mr-1" />
              Level {requiredLevel}
            </Badge>
          )}
        </div>

        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4 flex-1">{description}</p>

        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className={difficultyColor[difficulty]}>
            {difficulty}
          </Badge>
          <Badge variant="outline">{category}</Badge>
        </div>

        <Button 
          onClick={onPlay} 
          disabled={isLocked}
          className="w-full"
        >
          {isLocked ? 'Locked' : isCompleted ? 'Play Again' : 'Start Game'}
        </Button>
      </Card>
    </motion.div>
  );
}