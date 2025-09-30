import { motion } from 'framer-motion';
import { AIMentor } from '@/types/game';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface MentorAvatarProps {
  mentor: AIMentor;
  size?: 'sm' | 'md' | 'lg';
  showInfo?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

export function MentorAvatar({ 
  mentor, 
  size = 'md', 
  showInfo = false,
  isActive = false,
  onClick 
}: MentorAvatarProps) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-20 h-20 text-4xl',
    lg: 'w-32 h-32 text-6xl',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={onClick ? 'cursor-pointer' : ''}
    >
      <Card className={`p-4 ${isActive ? 'ring-2 ring-primary shadow-glow' : ''}`}>
        <div className="flex flex-col items-center gap-3">
          {/* Avatar */}
          <motion.div
            animate={isActive ? {
              y: [0, -5, 0],
              transition: { repeat: Infinity, duration: 2 }
            } : {}}
            className={`${sizeClasses[size]} flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 rounded-full`}
          >
            <span className="drop-shadow-lg">{mentor.avatar}</span>
          </motion.div>

          {showInfo && (
            <div className="text-center space-y-2">
              <div>
                <h3 className="font-bold text-lg text-foreground">{mentor.name}</h3>
                <p className="text-sm text-muted-foreground">{mentor.title}</p>
              </div>

              <Badge variant="secondary" className="text-xs">
                {mentor.specialization}
              </Badge>

              {mentor.catchphrase && (
                <p className="text-xs italic text-muted-foreground max-w-[200px]">
                  "{mentor.catchphrase}"
                </p>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
