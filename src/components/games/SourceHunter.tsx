import { useState } from "react";
import type { LearningExperience } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Search, CheckCircle, XCircle, AlertCircle, Shield, AlertTriangle } from "lucide-react";
import { CelebrationEffect } from "@/components/CelebrationEffect";
import { VisualBadge } from "@/components/VisualBadge";

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
  const [showCelebration, setShowCelebration] = useState(false);

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
      setShowCelebration(true);
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

  const credibleCount = scenario.sources.filter(s => s.credible).length;
  const selectedCredibleCount = selectedSources.filter(id => 
    scenario.sources.find(s => s.id === id)?.credible
  ).length;
  const trustScore = selectedSources.length > 0 
    ? Math.round((selectedCredibleCount / selectedSources.length) * 100) 
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {showCelebration && (
        <CelebrationEffect
          type="stars"
          amount={100}
          onComplete={() => setShowCelebration(false)}
        />
      )}
      
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Search className="w-7 h-7 text-primary animate-pulse" />
          Source Hunter
        </h2>
        <p className="text-muted-foreground">Find credible sources to verify AI claims</p>
        
        {/* Trust Score Display */}
        {!showResults && selectedSources.length > 0 && (
          <div className="max-w-md mx-auto space-y-2 animate-fade-in">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Trust Score</span>
              <span className={`font-bold ${
                trustScore >= 80 ? 'text-green-600' : 
                trustScore >= 50 ? 'text-amber-600' : 
                'text-red-600'
              }`}>
                {trustScore}%
              </span>
            </div>
            <Progress value={trustScore} className="h-2" />
          </div>
        )}
        
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
            {scenario.sources.map((source) => {
              const isSelected = selectedSources.includes(source.id);
              const showAsCorrect = showResults && source.credible;
              const showAsWrong = showResults && !source.credible;
              
              // Determine badge type
              let badgeType: "verified" | "credible" | "biased" | "unverified" | "peer-reviewed" = "unverified";
              if (source.type === "Academic Study") badgeType = "peer-reviewed";
              else if (source.credible) badgeType = "credible";
              else if (source.type.includes("Blog") || source.type.includes("Social")) badgeType = "unverified";
              else badgeType = "biased";
              
              return (
                <div
                  key={source.id}
                  className={`relative p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 transform ${
                    isSelected && !showResults
                      ? 'border-primary bg-primary/10 scale-102 shadow-md'
                      : 'border-muted hover:border-primary/50 hover:scale-101'
                  } ${
                    showAsCorrect
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-green-200'
                      : showAsWrong
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-red-200'
                        : ''
                  }`}
                  onClick={() => handleSourceClick(source.id)}
                >
                  {/* Credibility badge in top right */}
                  {showResults && (
                    <div className="absolute -top-2 -right-2 animate-scale-in">
                      <VisualBadge type={badgeType} />
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {showResults ? (
                        source.credible ? (
                          <Shield className="w-6 h-6 text-green-600 animate-scale-in" />
                        ) : (
                          <AlertTriangle className="w-6 h-6 text-red-600 animate-scale-in" />
                        )
                      ) : (
                        <div className={`w-6 h-6 rounded-full border-2 transition-all ${
                          isSelected
                            ? 'bg-primary border-primary shadow-sm scale-110'
                            : 'border-muted-foreground'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-sm">{source.title}</h4>
                      <p className="text-xs text-muted-foreground font-medium">{source.type}</p>
                      <p className="text-xs leading-relaxed">{source.description}</p>
                      
                      {/* Show credibility indicator on hover (when not showing results) */}
                      {!showResults && (
                        <div className="pt-2">
                          {source.credible ? (
                            <div className="flex items-center gap-1 text-xs text-green-700 dark:text-green-400">
                              <Shield className="w-3 h-3" />
                              <span>Potentially credible</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Verify carefully</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {showResults && (
            <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl animate-fade-in">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Source Analysis:
              </h4>
              <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Credible Sources:</strong> Academic studies, peer-reviewed journals, medical organizations, government agencies, established institutions</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Less Credible:</strong> Personal blogs, biased industry sources, unverified social media posts, marketing materials</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Best Practice:</strong> Always cross-reference multiple credible sources and check publication dates!</p>
                </div>
              </div>
              
              {/* Trust score summary */}
              <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">Your Trust Score:</span>
                  <span className={`font-bold text-base ${
                    trustScore >= 80 ? 'text-green-600' : 
                    trustScore >= 50 ? 'text-amber-600' : 
                    'text-red-600'
                  }`}>
                    {trustScore}%
                  </span>
                </div>
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