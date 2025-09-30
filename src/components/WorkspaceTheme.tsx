import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Lock } from 'lucide-react';

interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string;
  unlockLevel: number;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const WORKSPACE_THEMES: Theme[] = [
  {
    id: 'mystical-wizard',
    name: 'Mystical Wizard',
    description: 'Purple magic and cosmic vibes',
    preview: '🔮',
    unlockLevel: 1,
    colors: {
      primary: '270 70% 55%',
      secondary: '240 15% 18%',
      accent: '190 85% 60%'
    }
  },
  {
    id: 'cyber-hacker',
    name: 'Cyber Hacker',
    description: 'Neon green matrix aesthetic',
    preview: '💻',
    unlockLevel: 5,
    colors: {
      primary: '140 80% 50%',
      secondary: '180 5% 15%',
      accent: '60 90% 60%'
    }
  },
  {
    id: 'sunset-paradise',
    name: 'Sunset Paradise',
    description: 'Warm oranges and pinks',
    preview: '🌅',
    unlockLevel: 8,
    colors: {
      primary: '25 95% 60%',
      secondary: '340 80% 50%',
      accent: '50 100% 50%'
    }
  },
  {
    id: 'arctic-frost',
    name: 'Arctic Frost',
    description: 'Cool blues and icy whites',
    preview: '❄️',
    unlockLevel: 12,
    colors: {
      primary: '200 80% 60%',
      secondary: '220 15% 85%',
      accent: '180 100% 70%'
    }
  },
  {
    id: 'forest-sage',
    name: 'Forest Sage',
    description: 'Deep greens and earth tones',
    preview: '🌲',
    unlockLevel: 15,
    colors: {
      primary: '150 40% 45%',
      secondary: '30 30% 30%',
      accent: '80 60% 50%'
    }
  },
  {
    id: 'royal-gold',
    name: 'Royal Gold',
    description: 'Luxurious gold and deep purple',
    preview: '👑',
    unlockLevel: 20,
    colors: {
      primary: '45 100% 50%',
      secondary: '280 50% 25%',
      accent: '30 100% 60%'
    }
  }
];

interface WorkspaceThemeProps {
  currentTheme?: string;
  onThemeSelect?: (themeId: string) => void;
}

export function WorkspaceTheme({ currentTheme = 'mystical-wizard', onThemeSelect }: WorkspaceThemeProps) {
  const { level } = usePlayerStore();

  const applyTheme = (theme: Theme) => {
    if (level < theme.unlockLevel) return;
    
    // Apply CSS variables
    document.documentElement.style.setProperty('--primary', theme.colors.primary);
    document.documentElement.style.setProperty('--secondary', theme.colors.secondary);
    document.documentElement.style.setProperty('--accent', theme.colors.accent);
    
    onThemeSelect?.(theme.id);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold mb-2">Workspace Themes</h3>
        <p className="text-sm text-muted-foreground">
          Customize your learning environment with themes that unlock as you level up
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {WORKSPACE_THEMES.map((theme) => {
          const isUnlocked = level >= theme.unlockLevel;
          const isActive = currentTheme === theme.id;

          return (
            <motion.div
              key={theme.id}
              whileHover={isUnlocked ? { y: -4 } : {}}
              whileTap={isUnlocked ? { scale: 0.98 } : {}}
            >
              <Card 
                className={`p-4 cursor-pointer transition-all ${
                  isActive ? 'ring-2 ring-primary shadow-glow' : ''
                } ${!isUnlocked ? 'opacity-60' : ''}`}
                onClick={() => isUnlocked && applyTheme(theme)}
              >
                <div className="space-y-3">
                  {/* Preview */}
                  <div 
                    className="h-24 rounded-lg flex items-center justify-center text-5xl relative overflow-hidden"
                    style={{
                      background: isUnlocked 
                        ? `linear-gradient(135deg, hsl(${theme.colors.primary}), hsl(${theme.colors.accent}))`
                        : 'hsl(var(--muted))'
                    }}
                  >
                    {theme.preview}
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                        <Lock className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold">{theme.name}</h4>
                      {isActive && (
                        <Badge variant="default" className="text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {theme.description}
                    </p>

                    {!isUnlocked && (
                      <Badge variant="secondary" className="text-xs">
                        Unlock at Level {theme.unlockLevel}
                      </Badge>
                    )}
                  </div>

                  {/* Color Swatches */}
                  {isUnlocked && (
                    <div className="flex gap-2">
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-border"
                        style={{ background: `hsl(${theme.colors.primary})` }}
                      />
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-border"
                        style={{ background: `hsl(${theme.colors.secondary})` }}
                      />
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-border"
                        style={{ background: `hsl(${theme.colors.accent})` }}
                      />
                    </div>
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
