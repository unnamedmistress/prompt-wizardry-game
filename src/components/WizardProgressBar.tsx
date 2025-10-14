import { useGameStore } from "@/store/useGameStore";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";

const WIZARD_RANKS = [
  { name: 'Apprentice', minXP: 0, title: 'Apprentice Wizard', icon: '🧙‍♂️' },
  { name: 'Initiate', minXP: 100, title: 'Initiate Spellcaster', icon: '✨' },
  { name: 'Adept', minXP: 300, title: 'Adept Prompter', icon: '🔮' },
  { name: 'Sage', minXP: 600, title: 'Sage of Prompts', icon: '📜' },
  { name: 'Archmage', minXP: 1000, title: 'Archmage of Wizardry', icon: '⚡' },
];

export function WizardProgressBar() {
  const { xp, wizardRank } = useGameStore();

  const currentRankIndex = WIZARD_RANKS.findIndex(r => r.name === wizardRank);
  const currentRank = WIZARD_RANKS[currentRankIndex];
  const nextRank = WIZARD_RANKS[currentRankIndex + 1];

  const xpInCurrentRank = xp - currentRank.minXP;
  const xpNeededForNextRank = nextRank ? nextRank.minXP - currentRank.minXP : 1000;
  const progressPercent = nextRank 
    ? (xpInCurrentRank / xpNeededForNextRank) * 100 
    : 100;

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentRank.icon}</span>
            <div>
              <p className="font-semibold text-sm text-foreground">{currentRank.title}</p>
              <p className="text-xs text-muted-foreground">
                {xp} XP {nextRank && `• ${nextRank.minXP - xp} to ${nextRank.name}`}
              </p>
            </div>
          </div>
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <Progress value={progressPercent} className="h-2" />
      </CardContent>
    </Card>
  );
}
