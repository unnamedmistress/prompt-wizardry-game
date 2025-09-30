import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Sparkles, Lock } from 'lucide-react';

interface AvatarItem {
  id: string;
  name: string;
  emoji: string;
  category: 'body' | 'accessory' | 'effect' | 'background';
  unlockLevel: number;
  cost: number;
}

const AVATAR_ITEMS: AvatarItem[] = [
  // Bodies
  { id: 'wizard', name: 'Wizard', emoji: '🧙', category: 'body', unlockLevel: 1, cost: 0 },
  { id: 'robot', name: 'Robot', emoji: '🤖', category: 'body', unlockLevel: 3, cost: 50 },
  { id: 'alien', name: 'Alien', emoji: '👽', category: 'body', unlockLevel: 5, cost: 100 },
  { id: 'ninja', name: 'Ninja', emoji: '🥷', category: 'body', unlockLevel: 7, cost: 150 },
  { id: 'superhero', name: 'Superhero', emoji: '🦸', category: 'body', unlockLevel: 10, cost: 200 },
  
  // Accessories
  { id: 'crown', name: 'Crown', emoji: '👑', category: 'accessory', unlockLevel: 2, cost: 30 },
  { id: 'glasses', name: 'Glasses', emoji: '🕶️', category: 'accessory', unlockLevel: 4, cost: 50 },
  { id: 'hat', name: 'Top Hat', emoji: '🎩', category: 'accessory', unlockLevel: 6, cost: 80 },
  { id: 'headphones', name: 'Headphones', emoji: '🎧', category: 'accessory', unlockLevel: 8, cost: 120 },
  
  // Effects
  { id: 'sparkles', name: 'Sparkles', emoji: '✨', category: 'effect', unlockLevel: 1, cost: 20 },
  { id: 'fire', name: 'Fire', emoji: '🔥', category: 'effect', unlockLevel: 5, cost: 100 },
  { id: 'stars', name: 'Stars', emoji: '⭐', category: 'effect', unlockLevel: 7, cost: 120 },
  { id: 'lightning', name: 'Lightning', emoji: '⚡', category: 'effect', unlockLevel: 9, cost: 150 },
  
  // Backgrounds
  { id: 'space', name: 'Space', emoji: '🌌', category: 'background', unlockLevel: 3, cost: 80 },
  { id: 'sunset', name: 'Sunset', emoji: '🌅', category: 'background', unlockLevel: 6, cost: 120 },
  { id: 'matrix', name: 'Matrix', emoji: '💚', category: 'background', unlockLevel: 8, cost: 150 },
];

export function AvatarCustomizer() {
  const { level, coins, spendCoins, preferences } = usePlayerStore();
  const [selectedItems, setSelectedItems] = useState({
    body: 'wizard',
    accessory: '',
    effect: 'sparkles',
    background: '',
  });

  const handlePurchase = (item: AvatarItem) => {
    if (level < item.unlockLevel) return;
    if (!spendCoins(item.cost)) return;
    
    setSelectedItems({
      ...selectedItems,
      [item.category]: item.id,
    });
  };

  const renderItem = (item: AvatarItem) => {
    const isUnlocked = level >= item.unlockLevel;
    const isSelected = selectedItems[item.category] === item.id;
    const canAfford = coins >= item.cost;

    return (
      <motion.div
        key={item.id}
        whileHover={isUnlocked ? { scale: 1.05 } : {}}
        whileTap={isUnlocked ? { scale: 0.95 } : {}}
      >
        <Card 
          className={`p-4 cursor-pointer transition-all ${
            isSelected ? 'ring-2 ring-primary shadow-glow' : ''
          } ${!isUnlocked ? 'opacity-50' : ''}`}
          onClick={() => isUnlocked && handlePurchase(item)}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="text-4xl relative">
              {item.emoji}
              {!isUnlocked && (
                <Lock className="absolute -top-1 -right-1 w-4 h-4 text-muted-foreground" />
              )}
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium">{item.name}</p>
              
              {!isUnlocked ? (
                <Badge variant="secondary" className="text-xs">
                  Level {item.unlockLevel}
                </Badge>
              ) : isSelected ? (
                <Badge variant="default" className="text-xs">
                  Equipped
                </Badge>
              ) : (
                <Badge 
                  variant={canAfford ? "outline" : "secondary"}
                  className="text-xs"
                >
                  {item.cost} 🪙
                </Badge>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  const currentBody = AVATAR_ITEMS.find(i => i.id === selectedItems.body);
  const currentAccessory = AVATAR_ITEMS.find(i => i.id === selectedItems.accessory);
  const currentEffect = AVATAR_ITEMS.find(i => i.id === selectedItems.effect);
  const currentBackground = AVATAR_ITEMS.find(i => i.id === selectedItems.background);

  return (
    <div className="space-y-6">
      {/* Avatar Preview */}
      <Card className="p-8 bg-gradient-card">
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Your Avatar
          </h3>
          
          <motion.div 
            className="relative text-8xl"
            animate={{ 
              rotate: [0, 5, 0, -5, 0],
              transition: { duration: 4, repeat: Infinity }
            }}
          >
            {currentBackground && (
              <div className="absolute inset-0 -z-10 blur-xl opacity-50">
                {currentBackground.emoji}
              </div>
            )}
            
            <div className="relative">
              {currentBody?.emoji}
              {currentEffect && (
                <motion.span
                  className="absolute -top-2 -right-2 text-3xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, 0],
                    transition: { duration: 2, repeat: Infinity }
                  }}
                >
                  {currentEffect.emoji}
                </motion.span>
              )}
              {currentAccessory && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl">
                  {currentAccessory.emoji}
                </span>
              )}
            </div>
          </motion.div>
          
          <div className="flex gap-2 text-sm text-muted-foreground">
            <span>Level {level}</span>
            <span>•</span>
            <span>{coins} 🪙</span>
          </div>
        </div>
      </Card>

      {/* Customization Options */}
      <Tabs defaultValue="body">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="accessory">Accessories</TabsTrigger>
          <TabsTrigger value="effect">Effects</TabsTrigger>
          <TabsTrigger value="background">Background</TabsTrigger>
        </TabsList>

        <TabsContent value="body" className="space-y-4">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {AVATAR_ITEMS.filter(i => i.category === 'body').map(renderItem)}
          </div>
        </TabsContent>

        <TabsContent value="accessory" className="space-y-4">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {AVATAR_ITEMS.filter(i => i.category === 'accessory').map(renderItem)}
          </div>
        </TabsContent>

        <TabsContent value="effect" className="space-y-4">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {AVATAR_ITEMS.filter(i => i.category === 'effect').map(renderItem)}
          </div>
        </TabsContent>

        <TabsContent value="background" className="space-y-4">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {AVATAR_ITEMS.filter(i => i.category === 'background').map(renderItem)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
