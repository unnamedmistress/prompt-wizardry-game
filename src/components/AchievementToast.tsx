import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '@/types/game';
import { Card } from './ui/card';
import { Sparkles } from 'lucide-react';

interface AchievementToastProps {
  achievement: Achievement;
  onComplete: () => void;
}

export function AchievementToast({ achievement, onComplete }: AchievementToastProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 400 - 200,
      y: Math.random() * 400 - 200,
    }));
    setParticles(newParticles);

    const timer = setTimeout(onComplete, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-600',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0, opacity: 0, y: -50 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
      >
        <Card className={`relative overflow-hidden bg-gradient-to-br ${rarityColors[achievement.rarity]} p-6 shadow-2xl`}>
          {/* Particle effects */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: particle.x,
                y: particle.y,
                opacity: 0,
                scale: 0,
              }}
              transition={{
                duration: 1.5,
                ease: 'easeOut',
              }}
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-300 rounded-full"
            />
          ))}

          {/* Achievement content */}
          <div className="relative flex items-center gap-4">
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-6xl"
            >
              {achievement.icon}
            </motion.div>

            <div className="flex-1">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 mb-1"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <p className="text-sm font-bold uppercase tracking-wider text-white/90">
                  Achievement Unlocked!
                </p>
              </motion.div>

              <motion.h3
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-white mb-1"
              >
                {achievement.title}
              </motion.h3>

              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/80"
              >
                {achievement.description}
              </motion.p>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full inline-block"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  {achievement.rarity}
                </span>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
