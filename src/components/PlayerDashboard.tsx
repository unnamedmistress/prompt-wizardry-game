import { usePlayerStore } from '@/store/usePlayerStore';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Coins, Star, Zap, TrendingUp, Award, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { MentorAvatar } from './MentorAvatar';
import { getMentorById, getMentorsForLevel } from '@/data/mentors';

export function PlayerDashboard() {
  const {
    level,
    xp,
    coins,
    stars,
    streak,
    skillLevels,
    achievements,
    preferences,
    getXpForNextLevel,
    getOverallSkillLevel,
  } = usePlayerStore();

  const xpNeeded = getXpForNextLevel();
  const xpProgress = (xp / xpNeeded) * 100;
  const overallSkill = getOverallSkillLevel();
  const currentMentor = getMentorById(preferences.mentorId);
  const availableMentors = getMentorsForLevel(level);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="p-4 bg-gradient-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Level</p>
                <p className="text-3xl font-bold text-white">{level}</p>
              </div>
              <Zap className="w-8 h-8 text-white/80" />
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Coins</p>
                <p className="text-3xl font-bold text-foreground">{coins}</p>
              </div>
              <Coins className="w-8 h-8 text-yellow-500" />
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stars</p>
                <p className="text-3xl font-bold text-foreground">{stars}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="p-4 bg-gradient-accent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Streak</p>
                <p className="text-3xl font-bold text-white">{streak} 🔥</p>
              </div>
              <Flame className="w-8 h-8 text-white/80" />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* XP Progress */}
      <Card className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">Progress to Level {level + 1}</h3>
            </div>
            <Badge variant="secondary">
              {xp} / {xpNeeded} XP
            </Badge>
          </div>
          <Progress value={xpProgress} className="h-3" />
          <p className="text-sm text-muted-foreground">
            {xpNeeded - xp} XP needed to level up!
          </p>
        </div>
      </Card>

      {/* Current Mentor */}
      {currentMentor && (
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span>Your AI Mentor</span>
          </h3>
          <MentorAvatar mentor={currentMentor} size="lg" showInfo />
        </Card>
      )}

      {/* Skill Levels */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Skill Levels
        </h3>
        <div className="space-y-4">
          {Object.entries(skillLevels).map(([skill, value]) => (
            <div key={skill} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="capitalize font-medium">
                  {skill.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-muted-foreground">{value}/100</span>
              </div>
              <Progress value={value} className="h-2" />
            </div>
          ))}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="font-bold">Overall Skill Level</span>
              <Badge variant="default">{overallSkill}/100</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Recent Achievements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {achievements.slice(-6).reverse().map((achievement) => (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: 1.05 }}
                className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20"
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <p className="font-bold text-sm">{achievement.title}</p>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {achievement.rarity}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
