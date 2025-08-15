import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Users, Target } from "lucide-react";

interface RoleMatcherProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

const scenarios = [
  {
    id: 1,
    scenario: "A beginner wants to learn how to make spaghetti carbonara",
    roles: ["Professional chef", "Cooking instructor", "Food blogger", "Restaurant critic"],
    correctRole: 1,
    explanation: "A cooking instructor is best for teaching beginners - they know how to break down complex recipes into simple steps."
  },
  {
    id: 2,
    scenario: "Someone needs help writing a formal business proposal",
    roles: ["Creative writer", "Business consultant", "College student", "Social media manager"],
    correctRole: 1,
    explanation: "A business consultant has the expertise in formal business communication and proposal writing."
  },
  {
    id: 3,
    scenario: "A child wants to understand how plants grow",
    roles: ["University professor", "Elementary teacher", "Research scientist", "Garden store clerk"],
    correctRole: 1,
    explanation: "An elementary teacher knows how to explain complex concepts in simple, age-appropriate language."
  },
  {
    id: 4,
    scenario: "Someone needs help debugging complex Python code",
    roles: ["Software engineer", "Computer science student", "IT support", "Web designer"],
    correctRole: 0,
    explanation: "A software engineer has the deep technical expertise needed for complex debugging tasks."
  }
];

export const RoleMatcher = ({ onComplete, onBack }: RoleMatcherProps) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const scenario = scenarios[currentScenario];

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
      setScore(score + 25);
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
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Users className="w-6 h-6 text-primary" />
          Role Matcher
        </h2>
        <p className="text-muted-foreground">Match the best AI role to each scenario</p>
        <div className="text-sm text-muted-foreground">
          Scenario {currentScenario + 1} of {scenarios.length} | Score: {score}/100
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Scenario
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                      ? 'border-green-500 bg-green-50'
                      : selectedRole === index && index !== scenario.correctRole
                        ? 'border-red-500 bg-red-50'
                        : 'opacity-60'
                    : ''
                }`}
                onClick={() => handleRoleSelect(index)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    selectedRole === index
                      ? 'bg-primary text-white border-primary'
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
                <strong>Tip:</strong> Consider the audience, complexity level, and required expertise when choosing AI roles.
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
        </CardContent>
      </Card>
    </div>
  );
};