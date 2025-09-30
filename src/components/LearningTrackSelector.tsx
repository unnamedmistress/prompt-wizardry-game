import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { usePlayerStore } from '@/store/usePlayerStore';
import { LEARNING_TRACKS } from '@/data/learningTracks';
import { Lock, Check } from 'lucide-react';
import { LearningTrack } from '@/types/game';

export function LearningTrackSelector() {
  const { level, preferences } = usePlayerStore();
  const store = usePlayerStore();

  const selectTrack = (trackId: LearningTrack) => {
    store.preferences = {
      ...preferences,
      learningTrack: trackId
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose Your Learning Path</h2>
        <p className="text-muted-foreground">
          Select a specialized track to focus your AI learning journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {LEARNING_TRACKS.map((track, index) => {
          const isUnlocked = level >= track.unlockLevel;
          const isActive = preferences.learningTrack === track.id;

          return (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`p-6 cursor-pointer transition-all relative overflow-hidden ${
                  isActive ? 'ring-2 ring-primary shadow-glow' : ''
                } ${!isUnlocked ? 'opacity-60' : ''}`}
                onClick={() => isUnlocked && selectTrack(track.id)}
              >
                {/* Background gradient */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: `linear-gradient(135deg, ${track.color}, transparent)`
                  }}
                />

                <div className="relative space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="text-4xl">{track.icon}</div>
                    
                    {isActive ? (
                      <Badge className="bg-primary">
                        <Check className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    ) : !isUnlocked ? (
                      <Badge variant="secondary">
                        <Lock className="w-3 h-3 mr-1" />
                        Level {track.unlockLevel}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Available</Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold">{track.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {track.description}
                    </p>
                  </div>

                  {/* Skills */}
                  {isUnlocked && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        You'll Master:
                      </p>
                      <ul className="space-y-1">
                        {track.skills.slice(0, 3).map((skill, i) => (
                          <li key={i} className="text-xs flex items-start gap-2">
                            <span className="text-accent mt-0.5">•</span>
                            <span>{skill}</span>
                          </li>
                        ))}
                        {track.skills.length > 3 && (
                          <li className="text-xs text-muted-foreground italic">
                            + {track.skills.length - 3} more skills
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Action */}
                  {isUnlocked && !isActive && (
                    <Button 
                      className="w-full"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectTrack(track.id);
                      }}
                    >
                      Select Track
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
