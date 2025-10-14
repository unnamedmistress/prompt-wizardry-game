import { useGameStore } from "@/store/useGameStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Lock } from "lucide-react";

const ACHIEVEMENTS = [
  {
    id: 'first-lesson',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🌟',
    requirement: 'completedChallenges',
    threshold: 1,
  },
  {
    id: 'no-hints',
    name: 'No-Hint Hero',
    description: 'Complete a lesson without using any hints',
    icon: '🧠',
    requirement: 'noHints',
    threshold: 1,
  },
  {
    id: 'first-try',
    name: 'First Try Triumph',
    description: 'Complete a lesson on your first attempt with perfect score',
    icon: '⚡',
    requirement: 'perfectFirstTry',
    threshold: 1,
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    requirement: 'dailyStreak',
    threshold: 7,
  },
  {
    id: 'complete-5',
    name: 'Dedicated Student',
    description: 'Complete 5 different lessons',
    icon: '📚',
    requirement: 'completedChallenges',
    threshold: 5,
  },
  {
    id: 'complete-10',
    name: 'Master Learner',
    description: 'Complete 10 different lessons',
    icon: '🎓',
    requirement: 'completedChallenges',
    threshold: 10,
  },
  {
    id: 'initiate-rank',
    name: 'Initiate Achieved',
    description: 'Reach Initiate wizard rank',
    icon: '✨',
    requirement: 'wizardRank',
    threshold: 'Initiate',
  },
  {
    id: 'adept-rank',
    name: 'Adept Mastery',
    description: 'Reach Adept wizard rank',
    icon: '🔮',
    requirement: 'wizardRank',
    threshold: 'Adept',
  },
];

export function AchievementGrimoire() {
  const { achievements, completedChallenges, dailyStreak, wizardRank } = useGameStore();

  const checkUnlocked = (achievement: typeof ACHIEVEMENTS[0]) => {
    if (achievement.requirement === 'completedChallenges') {
      return completedChallenges >= Number(achievement.threshold);
    }
    if (achievement.requirement === 'dailyStreak') {
      return dailyStreak >= Number(achievement.threshold);
    }
    if (achievement.requirement === 'wizardRank') {
      const ranks = ['Apprentice', 'Initiate', 'Adept', 'Sage', 'Archmage'];
      const currentIndex = ranks.indexOf(wizardRank);
      const requiredIndex = ranks.indexOf(achievement.threshold as string);
      return currentIndex >= requiredIndex;
    }
    return achievements.includes(achievement.id);
  };

  return (
    <Card className="bg-gradient-card border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Achievement Grimoire
        </CardTitle>
        <CardDescription>
          Unlock achievements to earn arcane tokens
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((achievement) => {
            const unlocked = checkUnlocked(achievement);
            return (
              <div
                key={achievement.id}
                className={`p-3 rounded-lg border-2 transition-all ${
                  unlocked
                    ? 'border-primary bg-primary/5'
                    : 'border-muted bg-muted/30 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{achievement.name}</h4>
                      {!unlocked && <Lock className="w-3 h-3 text-muted-foreground" />}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                    {unlocked && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        +5 Arcane Tokens
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
