import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Coins, Trophy } from 'lucide-react';
import { usePlayerStore } from '@/store/usePlayerStore';

interface GameHeaderProps {
  title: string;
  onBack: () => void;
}

export function GameHeader({ title, onBack }: GameHeaderProps) {
  const { coins, stars, level } = usePlayerStore();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant="outline" className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-primary" />
          Level {level}
        </Badge>
        <Badge variant="outline" className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500" />
          {stars}
        </Badge>
        <Badge variant="outline" className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-amber-500" />
          {coins}
        </Badge>
      </div>
    </div>
  );
}