import { useState, useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Flame, Star } from "lucide-react";

const DAILY_CHALLENGES = [
  {
    id: 'monday',
    title: 'Clarity Challenge',
    description: 'Write a clear, concise prompt that gets exactly what you need',
    timeLimit: 300, // 5 minutes
    xpReward: 50,
  },
  {
    id: 'tuesday',
    title: 'Role Master',
    description: 'Assign the perfect role to solve a complex task',
    timeLimit: 300,
    xpReward: 50,
  },
  {
    id: 'wednesday',
    title: 'Detail Detective',
    description: 'Include all necessary details without being verbose',
    timeLimit: 300,
    xpReward: 50,
  },
  {
    id: 'thursday',
    title: 'Format Wizard',
    description: 'Structure output in a specific professional format',
    timeLimit: 300,
    xpReward: 50,
  },
  {
    id: 'friday',
    title: 'Creative Conjurer',
    description: 'Craft a prompt for a unique creative output',
    timeLimit: 300,
    xpReward: 50,
  },
  {
    id: 'saturday',
    title: 'Speed Spellcaster',
    description: 'Complete a prompt challenge in record time',
    timeLimit: 180, // 3 minutes
    xpReward: 75,
  },
  {
    id: 'sunday',
    title: 'Reflection & Review',
    description: 'Master a difficult concept from the week',
    timeLimit: 300,
    xpReward: 50,
  },
];

export function DailySpellTrial() {
  const { dailyStreak, lastDailyDate, checkDailyStreak, addXP } = useGameStore();
  const [todaysChallenge, setTodaysChallenge] = useState(DAILY_CHALLENGES[0]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const challengeIndex = dayOfWeek;
    setTodaysChallenge(DAILY_CHALLENGES[challengeIndex]);

    // Check if already completed today
    const todayStr = today.toISOString().split('T')[0];
    setIsCompleted(lastDailyDate === todayStr);
  }, [lastDailyDate]);

  const handleStart = () => {
    checkDailyStreak();
    // In a real implementation, this would open the daily challenge
    console.log('Starting daily challenge:', todaysChallenge.id);
  };

  const handleComplete = () => {
    addXP(todaysChallenge.xpReward);
    setIsCompleted(true);
  };

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Calendar className="w-5 h-5 text-orange-600" />
            Daily Spell Trial
          </CardTitle>
          {dailyStreak > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-600" />
              {dailyStreak} Day Streak
            </Badge>
          )}
        </div>
        <CardDescription className="text-muted-foreground">
          Complete today's challenge to earn bonus XP and maintain your streak
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-white rounded-lg border border-orange-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-lg text-foreground">{todaysChallenge.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{todaysChallenge.description}</p>
            </div>
            {isCompleted && (
              <Badge variant="default" className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                Completed
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{Math.floor(todaysChallenge.timeLimit / 60)} min limit</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>+{todaysChallenge.xpReward} XP</span>
            </div>
          </div>

          <Button 
            onClick={isCompleted ? () => {} : handleStart}
            disabled={isCompleted}
            className="w-full"
          >
            {isCompleted ? 'Completed Today' : 'Start Daily Challenge'}
          </Button>
        </div>

        {dailyStreak > 3 && (
          <div className="p-3 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg border border-orange-300">
            <p className="text-sm text-orange-900 font-medium">
              🔥 Amazing! You're on a {dailyStreak}-day streak!
            </p>
            <p className="text-xs text-orange-700 mt-1">
              Keep it going to unlock special achievements
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
