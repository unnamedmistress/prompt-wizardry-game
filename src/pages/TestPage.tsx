import { useState } from 'react';
import { PlayerDashboard } from '@/components/PlayerDashboard';
import { PromptTester } from '@/components/PromptTester';
import { AchievementToast } from '@/components/AchievementToast';
import { MentorAvatar } from '@/components/MentorAvatar';
import { usePlayerStore } from '@/store/usePlayerStore';
import { AI_MENTORS, getMentorsForLevel } from '@/data/mentors';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Achievement } from '@/types/game';
import { Sparkles, Trophy, User, Zap } from 'lucide-react';

export default function TestPage() {
  const [activeAchievement, setActiveAchievement] = useState<Achievement | null>(null);
  const { 
    level, 
    addXp, 
    addCoins, 
    addStars, 
    unlockAchievement,
    selectMentor,
    preferences,
    resetProgress
  } = usePlayerStore();

  const availableMentors = getMentorsForLevel(level);

  const testXpGain = () => {
    addXp(50);
    addCoins(10);
    addStars(1);
  };

  const testAchievement = () => {
    const achievement: Achievement = {
      id: `test_${Date.now()}`,
      type: 'ai_expert',
      title: 'Test Achievement!',
      description: 'You unlocked a test achievement',
      icon: '🎉',
      rarity: 'epic',
      earnedAt: new Date().toISOString(),
    };
    unlockAchievement(achievement);
    setActiveAchievement(achievement);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Phase 1: Core Game Engine
          </h1>
          <p className="text-muted-foreground">
            Enhanced state management, AI integration, mentors & achievements
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">
              <User className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="prompt-tester">
              <Sparkles className="w-4 h-4 mr-2" />
              Prompt Tester
            </TabsTrigger>
            <TabsTrigger value="mentors">
              <Trophy className="w-4 h-4 mr-2" />
              Mentors
            </TabsTrigger>
            <TabsTrigger value="testing">
              <Zap className="w-4 h-4 mr-2" />
              Testing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <PlayerDashboard />
          </TabsContent>

          <TabsContent value="prompt-tester">
            <PromptTester />
          </TabsContent>

          <TabsContent value="mentors">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Available AI Mentors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableMentors.map((mentor) => (
                  <div key={mentor.id} onClick={() => selectMentor(mentor.id)}>
                    <MentorAvatar
                      mentor={mentor}
                      size="md"
                      showInfo
                      isActive={preferences.mentorId === mentor.id}
                      onClick={() => selectMentor(mentor.id)}
                    />
                  </div>
                ))}
              </div>

              {level < 10 && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    🔒 More mentors unlock as you level up! 
                    {AI_MENTORS.filter(m => m.unlockLevel > level).length} mentors remaining
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="testing">
            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-bold mb-4">Test Features</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={testXpGain} variant="default">
                  <Zap className="w-4 h-4 mr-2" />
                  Gain XP (+50 XP, +10 coins, +1 star)
                </Button>

                <Button onClick={testAchievement} variant="secondary">
                  <Trophy className="w-4 h-4 mr-2" />
                  Unlock Test Achievement
                </Button>

                <Button 
                  onClick={() => addXp(1000)} 
                  variant="outline"
                >
                  Level Up Fast (+1000 XP)
                </Button>

                <Button 
                  onClick={resetProgress} 
                  variant="destructive"
                >
                  Reset All Progress
                </Button>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg space-y-2">
                <h3 className="font-bold">✅ Phase 1 Features Implemented:</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>✓ Enhanced state management with XP, coins, stars</li>
                  <li>✓ Skill level tracking (5 core skills)</li>
                  <li>✓ Achievement system with celebrations</li>
                  <li>✓ AI mentor characters (5 unique personalities)</li>
                  <li>✓ Lovable AI integration for prompt scoring</li>
                  <li>✓ Real-time prompt feedback & suggestions</li>
                  <li>✓ Adaptive difficulty tracking</li>
                  <li>✓ Streak system with daily tracking</li>
                  <li>✓ Player dashboard with progress visualization</li>
                  <li>✓ Particle effects for achievements</li>
                </ul>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Achievement Toast */}
        {activeAchievement && (
          <AchievementToast
            achievement={activeAchievement}
            onComplete={() => setActiveAchievement(null)}
          />
        )}
      </div>
    </div>
  );
}
