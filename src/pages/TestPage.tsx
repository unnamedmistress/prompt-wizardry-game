import { useState } from 'react';
import { PlayerDashboard } from '@/components/PlayerDashboard';
import { PromptTester } from '@/components/PromptTester';
import { AchievementToast } from '@/components/AchievementToast';
import { MentorAvatar } from '@/components/MentorAvatar';
import { DynamicMentor } from '@/components/DynamicMentor';
import { AvatarCustomizer } from '@/components/AvatarCustomizer';
import { WorkspaceTheme } from '@/components/WorkspaceTheme';
import { EnhancedPromptBuilder } from '@/components/EnhancedPromptBuilder';
import { LearningTrackSelector } from '@/components/LearningTrackSelector';
import { AIIntroGame } from '@/components/games/AIIntroGame';
import { PromptBuilderGame } from '@/components/games/PromptBuilderGame';
import { ToneController } from '@/components/games/ToneController';
import { RoleMatcher } from '@/components/games/RoleMatcher';
import { DetailDetective } from '@/components/games/DetailDetective';
import { SourceHunter } from '@/components/games/SourceHunter';
import PerspectiveShifterGame from '@/components/games/PerspectiveShifterGame';
import FormatCrafterGame from '@/components/games/FormatCrafterGame';
import CreativeChallenge from '@/components/games/CreativeChallenge';
import StoryEngineGame from '@/components/games/StoryEngineGame';
import PrecisionTargeterGame from '@/components/games/PrecisionTargeterGame';
import MultiTaskMaster from '@/components/games/MultiTaskMaster';
import { GameCard } from '@/components/GameCard';
import { GameHeader } from '@/components/GameHeader';
import { LearningTrack } from '@/types/game';
import { usePlayerStore } from '@/store/usePlayerStore';
import { AI_MENTORS, getMentorsForLevel } from '@/data/mentors';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Achievement } from '@/types/game';
import { Sparkles, Trophy, User, Zap, Palette, Wand2, Target } from 'lucide-react';

export default function TestPage() {
  const [activeAchievement, setActiveAchievement] = useState<Achievement | null>(null);
  const [activeGame, setActiveGame] = useState<string | null>(null);
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
            Phase 2: Immersive Experience
          </h1>
          <p className="text-muted-foreground">
            Enhanced mentorship, customization, workspace themes & learning tracks
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 lg:grid-cols-8">
            <TabsTrigger value="dashboard">
              <User className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="prompt-builder">
              <Wand2 className="w-4 h-4 mr-2" />
              Builder
            </TabsTrigger>
            <TabsTrigger value="mentors">
              <Trophy className="w-4 h-4 mr-2" />
              Mentors
            </TabsTrigger>
            <TabsTrigger value="avatar">
              <Sparkles className="w-4 h-4 mr-2" />
              Avatar
            </TabsTrigger>
            <TabsTrigger value="themes">
              <Palette className="w-4 h-4 mr-2" />
              Themes
            </TabsTrigger>
            <TabsTrigger value="tracks">
              <Target className="w-4 h-4 mr-2" />
              Tracks
            </TabsTrigger>
            <TabsTrigger value="games">
              <Trophy className="w-4 h-4 mr-2" />
              Games
            </TabsTrigger>
            <TabsTrigger value="testing">
              <Zap className="w-4 h-4 mr-2" />
              Testing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <PlayerDashboard />
          </TabsContent>

          <TabsContent value="prompt-builder">
            <EnhancedPromptBuilder />
          </TabsContent>

          <TabsContent value="avatar">
            <AvatarCustomizer />
          </TabsContent>

          <TabsContent value="themes">
            <WorkspaceTheme />
          </TabsContent>

          <TabsContent value="tracks">
            <LearningTrackSelector />
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

          <TabsContent value="games" className="space-y-4">
            {!activeGame ? (
              <>
                <h2 className="text-2xl font-bold mb-4">Choose a Game</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Phase 3 Games */}
                  <GameCard title="AI Introduction Quiz" description="Learn AI prompting basics" difficulty="Beginner" category="Fundamentals" icon="🎓" requiredLevel={1} currentLevel={level} isCompleted={false} onPlay={() => setActiveGame('intro')} />
                  <GameCard title="Prompt Builder Challenge" description="Create effective prompts" difficulty="Intermediate" category="Practice" icon="🏗️" requiredLevel={2} currentLevel={level} isCompleted={false} onPlay={() => setActiveGame('builder')} />
                  <GameCard title="Tone Controller" description="Master tone adjustment" difficulty="Intermediate" category="Communication" icon="🎭" requiredLevel={2} currentLevel={level} isCompleted={false} onPlay={() => setActiveGame('tone')} />
                  <GameCard title="Role Matcher" description="Match AI roles to tasks" difficulty="Beginner" category="Strategy" icon="👥" requiredLevel={1} currentLevel={level} isCompleted={false} onPlay={() => setActiveGame('role')} />
                  
                  {/* Phase 4 Games */}
                  <GameCard title="Detail Detective" description="Master comprehensive detail inclusion" difficulty="Intermediate" category="Precision" icon="🔍" requiredLevel={3} currentLevel={level} isCompleted={false} onPlay={() => setActiveGame('detail')} />
                  <GameCard title="Source Hunter" description="Learn citation and verification" difficulty="Intermediate" category="Ethics" icon="📚" requiredLevel={3} currentLevel={level} isCompleted={false} onPlay={() => setActiveGame('source')} />
                  <GameCard title="Perspective Shifter" description="Write from multiple viewpoints" difficulty="Advanced" category="Creativity" icon="👁️" requiredLevel={4} currentLevel={level} isCompleted={false} onPlay={() => setActiveGame('perspective')} />
                  <GameCard title="Format Crafter" description="Master output format specification" difficulty="Intermediate" category="Structure" icon="📄" requiredLevel={3} currentLevel={level} isCompleted={false} onPlay={() => setActiveGame('format')} />
                  <GameCard title="Creative Challenge" description="Open-ended creative prompts" difficulty="Advanced" category="Creativity" icon="✨" requiredLevel={4} currentLevel={level} isCompleted={false} onPlay={() => setActiveGame('creative')} />
                  <GameCard title="Story Engine" description="Multi-turn narrative building" difficulty="Advanced" category="Storytelling" icon="📖" requiredLevel={5} currentLevel={level} isCompleted={false} onPlay={() => setActiveGame('story')} />
                  <GameCard title="Precision Targeter" description="Hit exact specifications" difficulty="Advanced" category="Precision" icon="🎯" requiredLevel={4} currentLevel={level} isCompleted={false} onPlay={() => setActiveGame('precision')} />
                  <GameCard title="MultiTask Master" description="Combine multiple instructions" difficulty="Advanced" category="Mastery" icon="⚡" requiredLevel={5} currentLevel={level} isCompleted={false} onPlay={() => setActiveGame('multitask')} />
                </div>
              </>
            ) : (
              <>
                <GameHeader 
                  title={
                    activeGame === 'intro' ? 'AI Introduction Quiz' :
                    activeGame === 'builder' ? 'Prompt Builder Challenge' :
                    activeGame === 'tone' ? 'Tone Controller' :
                    activeGame === 'role' ? 'Role Matcher' :
                    activeGame === 'detail' ? 'Detail Detective' :
                    activeGame === 'source' ? 'Source Hunter' :
                    activeGame === 'perspective' ? 'Perspective Shifter' :
                    activeGame === 'format' ? 'Format Crafter' :
                    activeGame === 'creative' ? 'Creative Challenge' :
                    activeGame === 'story' ? 'Story Engine' :
                    activeGame === 'precision' ? 'Precision Targeter' :
                    'MultiTask Master'
                  } 
                  onBack={() => setActiveGame(null)} 
                />
                {activeGame === 'intro' && <AIIntroGame />}
                {activeGame === 'builder' && <PromptBuilderGame />}
                {activeGame === 'tone' && <ToneController />}
                {activeGame === 'role' && <RoleMatcher />}
                {activeGame === 'detail' && <DetailDetective />}
                {activeGame === 'source' && <SourceHunter />}
                {activeGame === 'perspective' && <PerspectiveShifterGame />}
                {activeGame === 'format' && <FormatCrafterGame />}
                {activeGame === 'creative' && <CreativeChallenge />}
                {activeGame === 'story' && <StoryEngineGame />}
                {activeGame === 'precision' && <PrecisionTargeterGame />}
                {activeGame === 'multitask' && <MultiTaskMaster />}
              </>
            )}
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
                <h3 className="font-bold">✅ Phase 2 Features Implemented:</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>✓ Dynamic AI mentor dialogue system</li>
                  <li>✓ Context-aware mentor responses</li>
                  <li>✓ Avatar customization with unlockables</li>
                  <li>✓ Workspace theme system (6 themes)</li>
                  <li>✓ Interactive prompt builder with templates</li>
                  <li>✓ Component-based prompt crafting</li>
                  <li>✓ Industry-specific learning tracks</li>
                  <li>✓ 5 specialized learning paths</li>
                  <li>✓ Level-gated progression system</li>
                  <li>✓ Visual customization rewards</li>
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

        {/* Dynamic Mentor */}
        <DynamicMentor context="greeting" />
      </div>
    </div>
  );
}
