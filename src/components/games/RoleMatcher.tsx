import { useState } from "react";
import type { LearningExperience } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Users, Target } from "lucide-react";

interface RoleMatcherProps {
  onComplete: (score: number) => void;
  onBack: () => void;
  lesson: LearningExperience;
}

// Unified "Big Day Story" role-matching adventure
const scenarios = [
  {
    id: 1,
    scenario: "You're getting ready for your first part-time job interview at a clothing store tomorrow. You're nervous and want realistic practice.",
    roles: ["Career coach", "Retail hiring manager", "Public speaking coach", "Resume writer"],
    correctRole: 1,
    explanation: "A retail hiring manager knows exactly what store managers look for: customer interaction examples, reliability, and basic situational judgment. That makes their feedback the most targeted practice."
  },
  {
    id: 2,
    scenario: "After the interview, you realize you need to save money for a new phone instead of spending it on snacks and games. You want help creating a realistic plan you can stick to.",
    roles: ["Financial coach", "Teen budgeting mentor", "Math tutor", "Shopping advisor"],
    correctRole: 1,
    explanation: "A teen budgeting mentor focuses on real-world, age-appropriate spending habits and building sustainable routines—not just abstract financial theory."
  },
  {
    id: 3,
    scenario: "You want to celebrate finishing the interview with a few friends. Small budget. Need ideas for food, simple games, and a chill vibe playlist.",
    roles: ["Event planner", "Budgeting coach", "Party DJ", "Restaurant caterer"],
    correctRole: 0,
    explanation: "An event planner can balance budget, flow, activities, and atmosphere together—more holistic than just music, money, or food alone."
  },
  {
    id: 4,
    scenario: "Right after the mini celebration, your parents ask you to cook a quick family dinner. It has to be healthy, fast, and picky-eater friendly.",
    roles: ["Nutritionist", "Family chef", "Meal prep coach", "Grocery budget planner"],
    correctRole: 1,
    explanation: "A family chef focuses on practical, fast, crowd-pleasing meals—balancing taste, nutrition, and simplicity for mixed preferences."
  },
  {
    id: 5,
    scenario: "On the drive home, a tire suddenly blows out. You've never changed one and need calm, step-by-step help you can follow safely on the roadside.",
    roles: ["Auto mechanic", "Driving safety instructor", "Roadside assistance operator", "YouTube life hack guru"],
    correctRole: 0,
    explanation: "An auto mechanic can deliver precise, order-dependent instructions (jack placement, loosening pattern, safety checks) without distracting gimmicks—critical for doing it right and safely."
  }
];

export const RoleMatcher = ({ lesson, onComplete, onBack }: RoleMatcherProps) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const scenario = scenarios[currentScenario];
  const POINTS_PER_SCENARIO = 100 / scenarios.length; // 20 each for 5 scenarios

  const handleRoleSelect = (roleIndex: number) => {
    if (showExplanation) return;
    setSelectedRole(roleIndex);
  };

  const handleSubmit = () => {
    if (selectedRole === null) {
      toast("Please select a role!");
      return;
    }

    const isCorrect = selectedRole === scenario.correctRole;
    if (isCorrect) {
      setScore(score + POINTS_PER_SCENARIO);
      toast("Perfect match! Great role selection! 🎯");
    } else {
      toast("Not quite right. Let's see why!");
    }
    
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedRole(null);
      setShowExplanation(false);
    } else {
      setGameComplete(true);
      onComplete(score);
    }
  };

  if (gameComplete) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl">👥 Role Matcher Complete!</CardTitle>
            <CardDescription>Final Score: {score}/100 points</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You've mastered the art of choosing the right AI role!</p>
            <Button onClick={onBack}>Continue Learning</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
            <CardTitle className="text-2xl font-bold">👥 Big Day Role Matcher</CardTitle>
            <CardDescription className="text-lg font-semibold text-foreground mb-3">Prompting Fundamentals</CardDescription>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              One big day. Different situations. Each one needs a different kind of expert. Just like real life, you get better AI help when you assign the most relevant role.
            </p>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2">Your Mission</h4>
              <p>Follow the story from interview prep to an unexpected roadside problem. Pick the role that would give the most practical, context-aware help in that exact moment.</p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Activity</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>Read the scene from the day's story.</li>
                <li>Decide which expert gives the most relevant, actionable help.</li>
                <li>Learn why that role unlocks better AI responses.</li>
              </ol>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2 mb-6">
            <div className="text-sm text-muted-foreground">
              Scenario {currentScenario + 1} of {scenarios.length} | Score: {score}/100
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-primary" />
              <h4 className="font-medium">Scenario</h4>
            </div>
            
            <p className="text-lg font-medium mb-6">{scenario.scenario}</p>
            
            <h4 className="font-medium mb-4">Which role should the AI take?</h4>
            
            <div className="grid gap-3 md:grid-cols-2">
              {scenario.roles.map((role, index) => (
                <div
                  key={index}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedRole === index
                      ? 'border-primary bg-primary/10'
                      : 'border-muted hover:border-primary/50'
                  } ${
                    showExplanation
                      ? index === scenario.correctRole
                        ? 'border-green-500 bg-green-50 text-green-900'
                        : selectedRole === index && index !== scenario.correctRole
                          ? 'border-red-500 bg-red-50 text-red-900'
                          : 'opacity-60'
                      : 'text-foreground'
                  }`}
                  onClick={() => handleRoleSelect(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                      selectedRole === index
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-muted-foreground text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium">{role}</span>
                  </div>
                </div>
              ))}
            </div>

            {showExplanation && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 Why this role works best:</h4>
                <p className="text-sm text-blue-800">{scenario.explanation}</p>
                <div className="mt-3 text-xs text-blue-700">
                  <strong>Tip:</strong> Think about who knows the most about the topic and who can explain it to the right audience.
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-6">
              <Button variant="outline" onClick={onBack} className="flex-1">
                Back to Lessons
              </Button>
              {!showExplanation ? (
                <Button 
                  onClick={handleSubmit} 
                  disabled={selectedRole === null}
                  className="flex-1"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNext} className="flex-1">
                  {currentScenario < scenarios.length - 1 ? 'Next Scenario' : 'Complete Game'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};