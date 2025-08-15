import { useState, useEffect } from "react";
import { toast } from "sonner";
import { GameHeader } from "@/components/GameHeader";
import { GameCard } from "@/components/GameCard";
import { PromptBuilder } from "@/components/PromptBuilder";
import { TruthDetective } from "@/components/games/TruthDetective";
import { SourceHunter } from "@/components/games/SourceHunter";
import { PromptEscape } from "@/components/games/PromptEscape";
import { PromptBuilderGame } from "@/components/games/PromptBuilderGame";
import { RoleMatcher } from "@/components/games/RoleMatcher";
import { DetailDetective } from "@/components/games/DetailDetective";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import heroImage from "@/assets/hero-crystal.jpg";
import { Sparkles, BookOpen, Target, Trophy } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  objective: string;
  hints: string[];
  goodExamples: string[];
  badExamples: string[];
  gameComponent?: string;
}

const games = [
  {
    id: "prompting-basics",
    title: "Prompting Fundamentals",
    description: "Learn the core principles of effective AI prompting",
    type: "lessons",
    challenges: [
      {
        id: "1",
        title: "Basic Prompt Structure",
        description: "Learn the fundamental elements of a well-structured prompt",
        difficulty: "Beginner" as const,
        objective: "Create a prompt that asks AI to write a professional email about a meeting reschedule",
        hints: [
          "Start by giving the AI a role or context",
          "Be specific about what you want",
          "Mention the tone and format you prefer",
          "Include relevant details"
        ],
        goodExamples: ["You are a professional assistant. Write a polite email to reschedule a team meeting..."],
        badExamples: ["Write email about meeting"],
        gameComponent: "PromptBuilderGame"
      },
      {
        id: "2", 
        title: "Adding Context & Role",
        description: "Master the art of giving AI proper context and role definition",
        difficulty: "Beginner" as const,
        objective: "Create a prompt where AI acts as a cooking instructor explaining how to make pasta",
        hints: [
          "Define who the AI should be",
          "Set the audience level (beginner, expert, etc.)",
          "Specify the communication style",
          "Include the specific task"
        ],
        goodExamples: [],
        badExamples: [],
        gameComponent: "RoleMatcher"
      },
      {
        id: "3",
        title: "Specificity & Details",
        description: "Learn how being specific dramatically improves AI responses",
        difficulty: "Intermediate" as const, 
        objective: "Create a detailed prompt for AI to write a product description for a smart home device",
        hints: [
          "Include target audience",
          "Specify key features to highlight",
          "Mention desired length and tone",
          "Add formatting requirements"
        ],
        goodExamples: [],
        badExamples: [],
        gameComponent: "DetailDetective"
      }
    ]
  },
  {
    id: "facts-framework",
    title: "FACTS Framework Games",
    description: "Master fact-checking and verification through gamified challenges",
    type: "games",
    games: [
      {
        id: "truth-detective",
        title: "Truth Detective",
        description: "Spot AI hallucinations in 'Two Truths and a Lie' format",
        icon: "🕵️",
        component: "TruthDetective"
      },
      {
        id: "source-hunter", 
        title: "Source Hunter",
        description: "Find credible sources to verify AI claims",
        icon: "🔍",
        component: "SourceHunter"
      },
      {
        id: "prompt-escape",
        title: "Prompt Escape Room",
        description: "Escape by finding which prompt caused problematic responses",
        icon: "🔓",
        component: "PromptEscape"
      }
    ]
  }
];

const Index = () => {
  const [gameState, setGameState] = useState<"welcome" | "game-select" | "challenges" | "playing" | "fact-games">("welcome");
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [selectedGameCategory, setSelectedGameCategory] = useState<string | null>(null);
  const [playerData, setPlayerData] = useState({
    level: 1,
    score: 0,
    completedChallenges: 0
  });
  const [completedChallengeIds, setCompletedChallengeIds] = useState<Set<string>>(new Set());

  // Load saved progress from localStorage
  useEffect(() => {
    const savedPlayerData = localStorage.getItem('promptWizardry_playerData');
    const savedCompletedChallenges = localStorage.getItem('promptWizardry_completedChallenges');
    const savedGameState = localStorage.getItem('promptWizardry_gameState');

    if (savedPlayerData) {
      setPlayerData(JSON.parse(savedPlayerData));
    }
    if (savedCompletedChallenges) {
      setCompletedChallengeIds(new Set(JSON.parse(savedCompletedChallenges)));
    }
    if (savedGameState && savedGameState !== 'playing') {
      setGameState(savedGameState as "welcome" | "challenges");
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('promptWizardry_playerData', JSON.stringify(playerData));
  }, [playerData]);

  useEffect(() => {
    localStorage.setItem('promptWizardry_completedChallenges', JSON.stringify([...completedChallengeIds]));
  }, [completedChallengeIds]);

  useEffect(() => {
    localStorage.setItem('promptWizardry_gameState', gameState);
  }, [gameState]);

  const handleStartGame = () => {
    setGameState("game-select");
  };

  const handleGameCategorySelect = (categoryId: string) => {
    setSelectedGameCategory(categoryId);
    const category = games.find(g => g.id === categoryId);
    if (category?.type === "lessons") {
      setGameState("challenges");
    } else {
      setGameState("fact-games");
    }
  };

  const handleFactGameSelect = (gameId: string) => {
    setCurrentGame(gameId);
    setGameState("playing");
  };

  const handleChallengeSelect = (challenge: Challenge) => {
    setCurrentChallenge(challenge);
    setGameState("playing");
  };

  const handleChallengeComplete = (score: number) => {
    if (currentChallenge) {
      setCompletedChallengeIds(prev => new Set([...prev, currentChallenge.id]));
      setPlayerData(prev => ({
        ...prev,
        score: prev.score + score,
        completedChallenges: prev.completedChallenges + 1,
        level: Math.floor((prev.completedChallenges + 1) / 2) + 1
      }));
      
      toast(`Challenge completed! +${score} points`, {
        description: `You've earned ${score} points and leveled up your prompting skills!`,
      });
    }
    setGameState("challenges");
    setCurrentChallenge(null);
  };

  const handleBackToChallenges = () => {
    if (selectedGameCategory === "facts-framework") {
      setGameState("fact-games");
    } else {
      setGameState("challenges");
    }
    setCurrentChallenge(null);
    setCurrentGame(null);
  };

  const handleBackToGameSelect = () => {
    setGameState("game-select");
    setSelectedGameCategory(null);
    setCurrentChallenge(null);
    setCurrentGame(null);
  };

  if (gameState === "welcome") {
    return (
      <div className="min-h-screen bg-background flex">
        {/* Navigation Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">AI Literacy - Learn to Prompt</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-muted-foreground">🏠 Home</span>
              <span className="text-sm text-muted-foreground">🎮 Games</span>
              <span className="text-sm text-muted-foreground">📈 Progress</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 pt-20">
          <div className="container mx-auto px-6 py-8">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold text-foreground">
                  Welcome to AI Literacy!
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Master AI prompting and fact-checking through interactive games. 
                  Learn to prompt effectively and verify AI responses using the FACTS framework.
                </p>
              </div>
              
                <Button 
                onClick={handleStartGame}
                size="lg"
                className="text-lg px-8 py-4 bg-primary hover:bg-primary/90"
              >
                Start Learning
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "game-select") {
    return (
      <div className="min-h-screen bg-muted/30 flex">
        {/* Navigation Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">AI Literacy - Learn to Prompt</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-muted-foreground">🏠 Home</span>
              <span className="text-sm font-medium text-primary">🎮 Games</span>
              <span className="text-sm text-muted-foreground">📈 Progress</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 pt-20 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-6 mb-8">
              <h1 className="text-3xl font-bold text-foreground">Choose Your Learning Path</h1>
              <p className="text-muted-foreground">
                Master AI prompting and fact-checking through interactive experiences
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {games.map((game) => (
                <Card 
                  key={game.id}
                  className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
                  onClick={() => handleGameCategorySelect(game.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-xl">{game.title}</CardTitle>
                    <CardDescription className="text-base">{game.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        game.type === 'lessons' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {game.type === 'lessons' ? 'Structured Lessons' : 'Interactive Games'}
                      </span>
                      <span className="text-2xl">
                        {game.type === 'lessons' ? '📚' : '🎮'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "fact-games") {
    const factGames = games.find(g => g.id === "facts-framework")?.games || [];
    
    return (
      <div className="min-h-screen bg-muted/30 flex">
        {/* Navigation Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">AI Literacy - Learn to Prompt</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-muted-foreground">🏠 Home</span>
              <span className="text-sm font-medium text-primary">🎮 Games</span>
              <span className="text-sm text-muted-foreground">📈 Progress</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 pt-20 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-6 mb-8">
              <h1 className="text-3xl font-bold text-foreground">FACTS Framework Games</h1>
              <p className="text-muted-foreground">
                Learn to verify AI responses using the FACTS framework through fun games
              </p>
              <Button variant="outline" onClick={handleBackToGameSelect}>
                ← Back to Game Selection
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {factGames.map((game) => (
                <Card 
                  key={game.id}
                  className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
                  onClick={() => handleFactGameSelect(game.id)}
                >
                  <CardHeader className="text-center">
                    <div className="text-4xl mb-2">{game.icon}</div>
                    <CardTitle className="text-lg">{game.title}</CardTitle>
                    <CardDescription>{game.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "playing" && (currentChallenge || currentGame)) {
    // Render fact-checking games
    if (currentGame) {
      let GameComponent;
      switch (currentGame) {
        case "truth-detective":
          GameComponent = TruthDetective;
          break;
        case "source-hunter":
          GameComponent = SourceHunter;
          break;
        case "prompt-escape":
          GameComponent = PromptEscape;
          break;
        default:
          GameComponent = () => <div>Game not found</div>;
      }

      return (
        <div className="min-h-screen bg-muted/30 flex">
          {/* Navigation Header */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="font-bold text-lg">AI Literacy - Learn to Prompt</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-sm text-muted-foreground">🏠 Home</span>
                <span className="text-sm font-medium text-primary">🎮 Games</span>
                <span className="text-sm text-muted-foreground">📈 Progress</span>
              </div>
            </div>
          </div>

          {/* Main Game Area */}
          <div className="flex-1 pt-20 p-6">
            <GameComponent
              onComplete={handleChallengeComplete}
              onBack={handleBackToChallenges}
            />
          </div>
        </div>
      );
    }

    // Render prompting lessons with games
    if (currentChallenge) {
      // Check if this challenge has a game component
      if (currentChallenge.gameComponent) {
        let GameComponent;
        switch (currentChallenge.gameComponent) {
          case "PromptBuilderGame":
            GameComponent = PromptBuilderGame;
            break;
          case "RoleMatcher":
            GameComponent = RoleMatcher;
            break;
          case "DetailDetective":
            GameComponent = DetailDetective;
            break;
          default:
            GameComponent = PromptBuilder;
        }

        return (
          <div className="min-h-screen bg-muted/30 flex">
            {/* Navigation Header */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <span className="font-bold text-lg">AI Literacy - Learn to Prompt</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-sm text-muted-foreground">🏠 Home</span>
                  <span className="text-sm font-medium text-primary">🎮 Games</span>
                  <span className="text-sm text-muted-foreground">📈 Progress</span>
                </div>
              </div>
            </div>

            {/* Main Game Area */}
            <div className="flex-1 pt-20 p-6">
              <GameComponent
                onComplete={handleChallengeComplete}
                onBack={handleBackToChallenges}
              />
            </div>
          </div>
        );
      }

      // Original lesson view with sidebar for challenges without games
    return (
      <div className="min-h-screen bg-muted/30 flex">
        {/* Navigation Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">AI Literacy - Learn to Prompt</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-muted-foreground">🏠 Home</span>
              <span className="text-sm font-medium text-primary">🎮 Games</span>
              <span className="text-sm text-muted-foreground">📈 Progress</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-background border-r border-border pt-20 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Challenge Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">{currentChallenge.title}</h2>
              </div>
              <p className="text-sm text-muted-foreground">{currentChallenge.description}</p>
            </div>

            {/* Lesson Content */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-foreground">Lesson</span>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-foreground font-medium">Objective:</p>
                <p className="text-sm text-muted-foreground">{currentChallenge.objective}</p>
              </div>
            </div>

            {/* Hints */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Hints</span>
              </div>
              <div className="space-y-2">
                {currentChallenge.hints.map((hint, index) => (
                  <div key={index} className="p-2 bg-muted/50 rounded text-xs text-foreground">
                    {hint}
                  </div>
                ))}
              </div>
            </div>

            {/* Examples */}
            {currentChallenge.goodExamples.length > 0 && (
              <div className="space-y-4">
                <span className="text-sm font-medium text-foreground">Examples</span>
                <div className="space-y-2">
                  {currentChallenge.goodExamples.map((example, index) => (
                    <div key={index} className="p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                      ✓ {example}
                    </div>
                  ))}
                  {currentChallenge.badExamples.map((example, index) => (
                    <div key={index} className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                      ✗ {example}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button 
              variant="outline" 
              onClick={handleBackToChallenges}
              className="w-full"
            >
              Back to Challenges
            </Button>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="flex-1 pt-20 p-6">
          <PromptBuilder
            challenge={currentChallenge}
            onComplete={handleChallengeComplete}
            onBack={handleBackToChallenges}
          />
        </div>
      </div>
    );
    }
  }

  // Challenges view for prompting lessons
  const selectedCategory = games.find(g => g.id === selectedGameCategory);
  const challenges = selectedCategory?.challenges || [];

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Navigation Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">AI Literacy - Learn to Prompt</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm text-muted-foreground">🏠 Home</span>
            <span className="text-sm font-medium text-primary">🎮 Games</span>
            <span className="text-sm text-muted-foreground">📈 Progress</span>
          </div>
        </div>
      </div>

      {/* Progress Sidebar */}
      <div className="w-80 bg-background border-r border-border pt-20 p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-semibold text-foreground">Your Progress</h2>
            <div className="text-sm text-muted-foreground">
              Total Points: {playerData.score}
            </div>
            <div className="text-sm text-muted-foreground">
              Level: {playerData.level}
            </div>
            <div className="text-sm text-muted-foreground">
              Completed: {playerData.completedChallenges}/{challenges.length}
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-sm font-medium text-foreground">Challenges</span>
            <div className="space-y-2">
              {challenges.map((challenge, index) => {
                const isCompleted = completedChallengeIds.has(challenge.id);
                const isLocked = index > 0 && !completedChallengeIds.has(challenges[index - 1].id);
                
                return (
                  <div 
                    key={challenge.id}
                    className={`p-2 text-xs rounded border cursor-pointer transition-colors ${
                      isCompleted 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : isLocked 
                          ? 'bg-muted border-muted-foreground/20 text-muted-foreground cursor-not-allowed'
                          : 'bg-background border-border text-foreground hover:bg-muted/50'
                    }`}
                    onClick={() => !isLocked && handleChallengeSelect(challenge)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{challenge.title}</span>
                      <span>
                        {isCompleted ? '✓' : isLocked ? '🔒' : '○'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-20 p-6">
        <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-6 mb-8">
              <h1 className="text-3xl font-bold text-foreground">Prompting Challenges</h1>
              <p className="text-muted-foreground">
                Master the fundamentals of AI prompting through structured lessons
              </p>
              <Button variant="outline" onClick={handleBackToGameSelect}>
                ← Back to Game Selection
              </Button>
            </div>

          <div className="grid gap-4 md:grid-cols-2">
            {challenges.map((challenge, index) => {
              const isCompleted = completedChallengeIds.has(challenge.id);
              const isLocked = index > 0 && !completedChallengeIds.has(challenges[index - 1].id);
              
              return (
                <Card 
                  key={challenge.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isCompleted 
                      ? 'border-green-200 bg-green-50' 
                      : isLocked 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:border-primary/50'
                  }`}
                  onClick={() => !isLocked && handleChallengeSelect(challenge)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <div className="text-lg">
                        {isCompleted ? '✓' : isLocked ? '🔒' : '○'}
                      </div>
                    </div>
                    <CardDescription>{challenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded ${
                        challenge.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                        challenge.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
