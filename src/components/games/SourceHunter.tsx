import { useState } from "react";
import type { LearningExperience } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Search, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface SourceHunterProps {
  onComplete: (score: number) => void;
  onBack: () => void;
  lesson: LearningExperience;
}

const scenarios = [
  {
    id: 1,
    claim: "Coffee consumption reduces the risk of type 2 diabetes by 25%",
    sources: [
      { 
        id: 1, 
        title: "Harvard Health Study on Coffee and Diabetes", 
        type: "Academic Study", 
        credible: true,
        description: "20-year longitudinal study published in Diabetes Care journal"
      },
      { 
        id: 2, 
        title: "CoffeeLover's Blog: Health Benefits", 
        type: "Personal Blog", 
        credible: false,
        description: "Unverified claims from coffee enthusiast website"
      },
      { 
        id: 3, 
        title: "American Diabetes Association Report", 
        type: "Medical Organization", 
        credible: true,
        description: "Peer-reviewed research compilation from official medical body"
      },
      { 
        id: 4, 
        title: "Social Media Post from @HealthGuru123", 
        type: "Social Media", 
        credible: false,
        description: "Unsubstantiated health claims from unverified account"
      }
    ]
  },
  {
    id: 2,
    claim: "Electric vehicles produce 50% fewer emissions than gasoline cars over their lifetime",
    sources: [
      { 
        id: 1, 
        title: "Tesla Marketing Brochure", 
        type: "Company Marketing", 
        credible: false,
        description: "Biased promotional material from EV manufacturer"
      },
      { 
        id: 2, 
        title: "International Energy Agency Report 2023", 
        type: "Government Agency", 
        credible: true,
        description: "Comprehensive lifecycle analysis by international organization"
      },
      { 
        id: 3, 
        title: "Nature Climate Change Journal Study", 
        type: "Academic Study", 
        credible: true,
        description: "Peer-reviewed research published in prestigious scientific journal"
      },
      { 
        id: 4, 
        title: "Oil Industry Newsletter Opinion", 
        type: "Industry Publication", 
        credible: false,
        description: "Biased perspective from fossil fuel industry"
      }
    ]
  }
];

export const SourceHunter = ({ lesson, onComplete, onBack }: SourceHunterProps) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedSources, setSelectedSources] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const scenario = scenarios[currentScenario];

  const handleSourceClick = (sourceId: number) => {
    if (showResults) return;
    
    if (selectedSources.includes(sourceId)) {
      setSelectedSources(selectedSources.filter(id => id !== sourceId));
    } else {
      setSelectedSources([...selectedSources, sourceId]);
    }
  };

  const handleSubmit = () => {
    if (selectedSources.length === 0) {
      toast("Please select at least one source to verify the claim!");
      return;
    }

    const credibleSources = scenario.sources.filter(s => s.credible);
    const selectedCredibleCount = selectedSources.filter(id => 
      scenario.sources.find(s => s.id === id)?.credible
    ).length;
    const selectedNonCredibleCount = selectedSources.length - selectedCredibleCount;

    // Scoring: +50 for each credible source, -25 for each non-credible source
    const roundScore = Math.max(0, (selectedCredibleCount * 50) - (selectedNonCredibleCount * 25));
    setScore(score + roundScore);
    setShowResults(true);

    if (selectedCredibleCount === credibleSources.length && selectedNonCredibleCount === 0) {
      toast("Perfect! You identified all credible sources! 🎯");
    } else if (selectedCredibleCount > selectedNonCredibleCount) {
      toast("Good job! You found most credible sources! 👍");
    } else {
      toast("Let's review which sources are most reliable. 📚");
    }
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedSources([]);
      setShowResults(false);
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
            <CardTitle className="text-2xl">🔍 Source Hunter Complete!</CardTitle>
            <CardDescription>Final Score: {score} points</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You've mastered the art of finding credible sources!</p>
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
          <Search className="w-6 h-6 text-primary" />
          Source Hunter
        </h2>
        <p className="text-muted-foreground">Find credible sources to verify AI claims</p>
        <div className="text-sm text-muted-foreground">
          Scenario {currentScenario + 1} of {scenarios.length} | Score: {score}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Claim to Verify
          </CardTitle>
          <CardDescription className="text-lg font-medium">
            "{scenario.claim}"
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Select Credible Sources</CardTitle>
          <CardDescription>
            Click on sources you would trust to verify this claim. Choose carefully!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {scenario.sources.map((source) => (
              <div
                key={source.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedSources.includes(source.id)
                    ? 'border-primary bg-primary/10'
                    : 'border-muted hover:border-primary/50'
                } ${
                  showResults
                    ? source.credible
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : ''
                }`}
                onClick={() => handleSourceClick(source.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {showResults ? (
                      source.credible ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )
                    ) : (
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        selectedSources.includes(source.id)
                          ? 'bg-primary border-primary'
                          : 'border-muted-foreground'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{source.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{source.type}</p>
                    <p className="text-xs">{source.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showResults && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Source Analysis:</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <p>✅ <strong>Credible:</strong> Academic studies, medical organizations, government agencies</p>
                <p>❌ <strong>Less Credible:</strong> Personal blogs, biased industry sources, unverified social media</p>
                <p>💡 <strong>Tip:</strong> Always cross-reference multiple credible sources!</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Back to Games
            </Button>
            {!showResults ? (
              <Button 
                onClick={handleSubmit} 
                disabled={selectedSources.length === 0}
                className="flex-1"
              >
                Verify Sources
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