import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Layers, CheckCircle, AlertCircle } from "lucide-react";

interface MultiTaskMasterProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

const promptComponents = [
  { id: 1, text: "You are an experienced travel planner", category: "Role", required: true },
  { id: 2, text: "Plan a 3-day weekend trip", category: "Main Task", required: true },
  { id: 3, text: "Budget: $500 per person", category: "Constraint", required: true },
  { id: 4, text: "For a couple who loves food and culture", category: "Audience", required: true },
  { id: 5, text: "Within 2 hours of Chicago", category: "Location", required: true },
  { id: 6, text: "Include restaurant recommendations", category: "Specific Request", required: true },
  { id: 7, text: "Suggest 2-3 activities per day", category: "Format Detail", required: true },
  { id: 8, text: "Provide backup indoor options for bad weather", category: "Contingency", required: false },
  { id: 9, text: "Include estimated costs for each activity", category: "Detail Enhancement", required: false },
  { id: 10, text: "Mention parking availability", category: "Practical Detail", required: false }
];

const scenarios = [
  {
    id: 1,
    title: "Weekend Trip Planner",
    description: "Help a couple plan the perfect weekend getaway",
    objective: "Create a comprehensive travel plan that covers all their needs",
    minComponents: 7,
    maxComponents: 10
  }
];

export const MultiTaskMaster = ({ onComplete, onBack }: MultiTaskMasterProps) => {
  const [selectedComponents, setSelectedComponents] = useState<number[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const scenario = scenarios[0];

  const handleComponentToggle = (componentId: number) => {
    if (showResults) return;
    
    if (selectedComponents.includes(componentId)) {
      setSelectedComponents(selectedComponents.filter(id => id !== componentId));
    } else {
      setSelectedComponents([...selectedComponents, componentId]);
    }
  };

  const handleSubmit = () => {
    if (selectedComponents.length < scenario.minComponents) {
      toast(`You need at least ${scenario.minComponents} components for a complete prompt!`);
      return;
    }

    // Calculate score based on required components included
    const requiredComponents = promptComponents.filter(c => c.required);
    const selectedRequired = selectedComponents.filter(id => 
      requiredComponents.some(c => c.id === id)
    );
    
    const optionalComponents = promptComponents.filter(c => !c.required);
    const selectedOptional = selectedComponents.filter(id => 
      optionalComponents.some(c => c.id === id)
    );

    let totalScore = 0;
    
    // Required components: 10 points each
    totalScore += selectedRequired.length * 10;
    
    // Optional components: 5 points each
    totalScore += selectedOptional.length * 5;
    
    // Bonus for comprehensive prompt (8+ components)
    if (selectedComponents.length >= 8) {
      totalScore += 15;
    }

    setScore(totalScore);
    setShowResults(true);

    if (selectedRequired.length === requiredComponents.length) {
      toast("Excellent! You've created a comprehensive multi-task prompt! 🎉");
      setTimeout(() => {
        setGameComplete(true);
        onComplete(totalScore);
      }, 3000);
    } else {
      toast(`Good effort! You included ${selectedRequired.length}/${requiredComponents.length} essential components.`);
      setTimeout(() => {
        setGameComplete(true);
        onComplete(totalScore);
      }, 3000);
    }
  };

  const handleReset = () => {
    setSelectedComponents([]);
    setShowResults(false);
    setScore(0);
  };

  if (gameComplete) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl">🧠 Multi-Task Master Complete!</CardTitle>
            <CardDescription>Score: {score}/85 points</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You've mastered complex prompt engineering!</p>
            <Button onClick={onBack}>Continue Learning</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const requiredComponents = promptComponents.filter(c => c.required);
  const optionalComponents = promptComponents.filter(c => !c.required);
  const selectedRequired = selectedComponents.filter(id => 
    requiredComponents.some(c => c.id === id)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Layers className="w-6 h-6 text-primary" />
          Multi-Task Master
        </h2>
        <p className="text-muted-foreground">Build a comprehensive prompt with multiple requirements</p>
        <div className="text-sm text-muted-foreground">
          Score: {score}/85 | Required: {selectedRequired.length}/{requiredComponents.length}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🎯 Challenge: {scenario.title}</CardTitle>
          <CardDescription>{scenario.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-accent/50 rounded-lg mb-6">
            <p className="font-medium">{scenario.objective}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Select {scenario.minComponents}-{scenario.maxComponents} components to build your prompt
            </p>
          </div>

          {/* Required Components */}
          <div className="mb-6">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              Essential Components (Required)
            </h4>
            <div className="grid gap-3 md:grid-cols-2">
              {requiredComponents.map((component) => (
                <div
                  key={component.id}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedComponents.includes(component.id)
                      ? 'border-primary bg-primary/10'
                      : 'border-red-300 hover:border-red-500'
                  } ${
                    showResults && selectedComponents.includes(component.id)
                      ? 'border-green-500 bg-green-50'
                      : showResults && !selectedComponents.includes(component.id)
                        ? 'border-red-500 bg-red-50'
                        : ''
                  }`}
                  onClick={() => handleComponentToggle(component.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {showResults ? (
                        selectedComponents.includes(component.id) ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )
                      ) : (
                        <div className={`w-5 h-5 rounded border-2 ${
                          selectedComponents.includes(component.id)
                            ? 'bg-primary border-primary'
                            : 'border-red-400'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-red-600 font-medium mb-1">{component.category}</div>
                      <div className="text-sm">{component.text}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Components */}
          <div className="mb-6">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              Enhancement Components (Optional)
            </h4>
            <div className="grid gap-3 md:grid-cols-2">
              {optionalComponents.map((component) => (
                <div
                  key={component.id}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedComponents.includes(component.id)
                      ? 'border-primary bg-primary/10'
                      : 'border-blue-300 hover:border-blue-500'
                  } ${
                    showResults && selectedComponents.includes(component.id)
                      ? 'border-green-500 bg-green-50'
                      : ''
                  }`}
                  onClick={() => handleComponentToggle(component.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {showResults && selectedComponents.includes(component.id) ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <div className={`w-5 h-5 rounded border-2 ${
                          selectedComponents.includes(component.id)
                            ? 'bg-primary border-primary'
                            : 'border-blue-400'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-blue-600 font-medium mb-1">{component.category}</div>
                      <div className="text-sm">{component.text}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showResults && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
              <h4 className="font-medium text-blue-900 mb-2">📊 Your Prompt Analysis:</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <div>✅ Required components: {selectedRequired.length}/{requiredComponents.length}</div>
                <div>🎯 Optional enhancements: {selectedComponents.filter(id => 
                  optionalComponents.some(c => c.id === id)
                ).length}/{optionalComponents.length}</div>
                <div>📝 Total components: {selectedComponents.length}</div>
                {selectedComponents.length >= 8 && (
                  <div className="text-green-700 font-medium">🏆 Bonus: Comprehensive prompt!</div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Back to Lessons
            </Button>
            {showResults ? (
              <Button onClick={handleReset} className="flex-1">
                Try Again
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={selectedComponents.length < scenario.minComponents}
                className="flex-1"
              >
                Analyze My Prompt
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};