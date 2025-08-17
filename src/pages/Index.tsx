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
import { ToneController } from "@/components/games/ToneController";
import { MultiTaskMaster } from "@/components/games/MultiTaskMaster";
import { CreativeChallenge } from "@/components/games/CreativeChallenge";
import FormatCrafterGame from "@/components/games/FormatCrafterGame";
import PrecisionTargeterGame from "@/components/games/PrecisionTargeterGame";
import PerspectiveShifterGame from "@/components/games/PerspectiveShifterGame";
import StoryEngineGame from "@/components/games/StoryEngineGame";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import heroImage from "@/assets/hero-crystal.jpg";
import { Sparkles, BookOpen, Target, Trophy, CheckCircle, Menu } from "lucide-react";

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
    description: "Learn the core principles of effective AI prompting through fun, relatable scenarios",
    type: "lessons",
    challenges: [
      {
        id: "1",
        title: "Basic Prompt Structure",
        description: "Master the building blocks of great prompts with fun scenarios",
        difficulty: "Beginner" as const,
        objective: "Help someone call in sick to work with a convincing (but honest!) excuse",
        hints: [
          "Start by giving the AI a role (like 'helpful assistant')",
          "Be specific about the situation",
          "Mention the tone you want (professional, casual, etc.)",
          "Include important details like timing"
        ],
        goodExamples: [
          "You are a helpful assistant. Write a professional text message to my boss explaining I'm sick and can't come to work today. Use a polite but not overly formal tone, mention I have flu symptoms, and that I hope to return tomorrow.",
          "Act as a professional communicator. Help me write an email to my manager about calling in sick. I have a bad migraine, need to rest today, and should be better by tomorrow. Keep it brief but sincere."
        ],
        badExamples: [
          "Write sick message",
          "Tell my boss I can't work",
          "Make excuse for work"
        ],
        gameComponent: "PromptBuilderGame"
      },
      {
        id: "2", 
        title: "Context & Role Mastery",
        description: "Learn how the right role transforms AI responses",
        difficulty: "Beginner" as const,
        objective: "Get AI to help plan an epic birthday party for a 25-year-old who loves board games",
        hints: [
          "Choose the perfect role (party planner, friend, event coordinator)",
          "Set the context (budget, guest count, preferences)",
          "Specify the style of response you want",
          "Include key constraints or requirements"
        ],
        goodExamples: [
          "You are an experienced party planner. Help me plan a birthday party for my 25-year-old friend who loves board games. We have a $300 budget, 15 guests, and want it to be casual but memorable. Give me ideas for games, food, decorations, and activities.",
          "Act as a creative event coordinator. I'm planning a board game themed birthday party for someone turning 25. Include suggestions for themed snacks, party games beyond board games, and how to make it Instagram-worthy."
        ],
        badExamples: [
          "Plan a birthday party",
          "Give me party ideas",
          "What should I do for a birthday?"
        ],
        gameComponent: "RoleMatcher"
      },
      {
        id: "3",
        title: "Specificity & Details",
        description: "Transform vague requests into crystal-clear instructions",
        difficulty: "Intermediate" as const, 
        objective: "Get AI to help write the perfect dating app profile that's authentic and engaging",
        hints: [
          "Include specific details about personality and interests",
          "Mention the target audience you want to attract",
          "Specify the tone (witty, sincere, adventurous, etc.)",
          "Add constraints like character limits or must-include elements"
        ],
        goodExamples: [
          "You are a dating coach specializing in authentic profiles. Help me write a dating app bio that's 150 characters max. I'm 28, love hiking and cooking, work as a teacher, and want to attract someone who values humor and outdoor adventures. Make it witty but genuine.",
          "Act as a relationship expert. Create a dating profile for someone who's introverted but loves deep conversations, enjoys reading sci-fi, plays guitar, and is looking for a meaningful connection rather than casual dating. Keep it engaging but not overly quirky."
        ],
        badExamples: [
          "Write dating profile",
          "Make me sound good on dating apps",
          "Help with my bio"
        ],
        gameComponent: "DetailDetective"
      },
      {
        id: "4",
        title: "Tone & Style Control",
        description: "Master the art of getting exactly the right voice from AI",
        difficulty: "Intermediate" as const,
        objective: "Get AI to write a resignation letter that's professional but shows you're leaving for positive reasons",
        hints: [
          "Specify the exact tone (professional, grateful, optimistic)",
          "Include the context (new opportunity, career growth, etc.)",
          "Mention what to avoid (negativity, complaints, burning bridges)",
          "Set the format and length requirements"
        ],
        goodExamples: [
          "You are a career counselor. Help me write a resignation letter that's professional and positive. I'm leaving for a better opportunity, want to express gratitude for my experience, and maintain good relationships. Keep it to one page and include a 2-week notice.",
          "Act as an HR professional. Write a resignation email that's warm but professional. I'm moving to a new city for family reasons, have enjoyed my 3 years here, and want to ensure a smooth transition. Avoid mentioning any workplace frustrations."
        ],
        badExamples: [
          "Write resignation letter",
          "Help me quit my job",
          "I want to leave work"
        ],
        gameComponent: "ToneController"
      },
      {
        id: "5",
        title: "Complex Multi-Task Prompts",
        description: "Combine multiple requirements into one powerful prompt",
        difficulty: "Advanced" as const,
        objective: "Get AI to plan a surprise proposal that's personal, memorable, and perfectly executed",
        hints: [
          "Break down all the components (location, timing, backup plans)",
          "Include personal details that make it special",
          "Specify what you need help with (planning vs. execution)",
          "Add constraints like budget, privacy, weather considerations"
        ],
        goodExamples: [
          "You are a romantic event planner with experience in proposals. Help me plan a surprise proposal for my partner who loves sunsets, quiet moments, and meaningful locations. We met at a coffee shop, she loves hiking, budget is $1000. I need location ideas, timing advice, backup weather plans, and a step-by-step timeline. Make it personal but not overly elaborate.",
          "Act as a proposal consultant. Plan a marriage proposal for someone who values experiences over material things, loves their hometown, and is close to family. Include ideas for incorporating family, choosing the right moment, and making it feel authentic rather than performative. Consider seasonal factors and meaningful locations."
        ],
        badExamples: [
          "Help me propose",
          "Plan a proposal",
          "How should I ask someone to marry me?"
        ],
        gameComponent: "MultiTaskMaster"
      },
      {
        id: "6",
        title: "Creative & Fun Prompts",
        description: "Unlock AI's creative potential with imaginative scenarios",
        difficulty: "Advanced" as const,
        objective: "Get AI to help create a murder mystery dinner party that will blow your friends' minds",
        hints: [
          "Set the creative role (mystery writer, party planner, etc.)",
          "Include constraints (number of people, complexity level)",
          "Specify what you need (characters, plot, clues, timeline)",
          "Mention the audience and their interests"
        ],
        goodExamples: [
          "You are a mystery writer and party planner. Create a murder mystery dinner party for 8 friends who love puzzles and drama. Set it in the 1920s, include character descriptions with motives, clues that reveal throughout dinner, and a shocking but logical conclusion. Make it interactive but not too complex for first-time players.",
          "Act as an escape room designer. Design a murder mystery experience for a dinner party with 6 people. Include props they can find around a house, red herrings, character backstories with secrets, and multiple possible suspects until the final reveal. Keep it fun and engaging rather than dark or disturbing."
        ],
        badExamples: [
          "Create a murder mystery",
          "Help with a party game",
          "Make a mystery for dinner"
        ],
        gameComponent: "CreativeChallenge"
      }
    ]
  },
  {
    id: "format-crafter",
    title: "Format Crafter",
    description: "Master designing outputs as tables, lists, scripts, and charts",
    type: "lessons",
    challenges: [{ id: "1", title: "Office Format Master", description: "Structure AI output for business", difficulty: "Intermediate" as const, objective: "Transform information into professional formats", hints: ["Specify exact format"], goodExamples: ["Professional example"], badExamples: ["Make agenda"], gameComponent: "FormatCrafterGame" }]
  },
  {
    id: "precision-targeter",
    title: "Precision Targeter", 
    description: "Use exact constraints and delimiters for scoped AI output",
    type: "lessons",
    challenges: [{ id: "1", title: "Fitness Precision Trainer", description: "Master constraints and delimiters", difficulty: "Advanced" as const, objective: "Use precise constraints", hints: ["Add constraints"], goodExamples: ["Precise example"], badExamples: ["Give workout"], gameComponent: "PrecisionTargeterGame" }]
  },
  {
    id: "perspective-shifter",
    title: "Perspective Shifter",
    description: "Prompt AI to adopt alternate viewpoints",
    type: "lessons",
    challenges: [{ id: "1", title: "Hollywood Perspective Master", description: "Learn viewpoint transformation", difficulty: "Intermediate" as const, objective: "Write from different perspectives", hints: ["Choose role"], goodExamples: ["Director example"], badExamples: ["Review movie"], gameComponent: "PerspectiveShifterGame" }]
  },
  {
    id: "story-engine",
    title: "Story Engine",
    description: "Build narrative prompts with plot, structure, and tone",
    type: "lessons", 
    challenges: [{ id: "1", title: "Creative Story Engine", description: "Master narrative prompts", difficulty: "Advanced" as const, objective: "Combine genre, structure, tone", hints: ["Choose genre"], goodExamples: ["Story example"], badExamples: ["Write story"], gameComponent: "StoryEngineGame" }]
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
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

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

  const handleChallengeComplete = (score: number = 100) => {
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

  const handleChallengeCompleteNoScore = () => {
    handleChallengeComplete(100); // Default score for games that don't track score
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
      <div className="min-h-screen bg-background flex flex-col">
        {/* Navigation Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <span className="font-bold text-sm sm:text-lg">AI Literacy</span>
            </div>
            <div className="hidden sm:flex items-center gap-6">
              <Button variant="ghost" onClick={() => setGameState("welcome")} className="text-sm">
                🏠 Home
              </Button>
              <Button variant="ghost" onClick={() => setGameState("game-select")} className="text-sm">
                🎓 Lessons
              </Button>
              <Button variant="ghost" onClick={() => setGameState("game-select")} className="text-sm">
                📈 Levels
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 pt-16 sm:pt-20">
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                  Welcome to AI Literacy!
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                  Master AI prompting and fact-checking through interactive games. 
                  Learn to prompt effectively and verify AI responses using the FACTS framework.
                </p>
              </div>
              
              <Button 
                onClick={handleStartGame}
                size="lg"
                className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary/90"
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
      <div className="min-h-screen bg-muted/30 flex flex-col">
        {/* Navigation Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <span className="font-bold text-sm sm:text-lg">AI Literacy</span>
            </div>
            <div className="hidden sm:flex items-center gap-6">
              <Button variant="ghost" onClick={() => setGameState("welcome")} className="text-sm">
                🏠 Home
              </Button>
              <span className="text-sm font-medium text-primary">🎓 Lessons</span>
              <Button variant="ghost" onClick={() => setGameState("game-select")} className="text-sm">
                📈 Levels
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 pt-16 sm:pt-20 p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 sm:space-y-6 mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Choose Your Learning Path</h1>
              <p className="text-sm sm:text-base text-muted-foreground px-4">
                Master AI prompting and fact-checking through interactive experiences
              </p>
            </div>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {games.map((game) => (
                <Card 
                  key={game.id}
                  className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
                  onClick={() => handleGameCategorySelect(game.id)}
                >
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-lg sm:text-xl">{game.title}</CardTitle>
                    <CardDescription className="text-sm sm:text-base">{game.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 sm:px-3 py-1 rounded-full ${
                        game.type === 'lessons' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {game.type === 'lessons' ? 'Lessons' : 'Games'}
                      </span>
                      <span className="text-xl sm:text-2xl">
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
      <div className="min-h-screen bg-background flex flex-col">
        {/* Navigation Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <span className="font-bold text-sm sm:text-lg">AI Literacy</span>
            </div>
            <div className="hidden sm:flex items-center gap-6">
              <Button variant="ghost" onClick={() => setGameState("welcome")} className="text-sm">
                🏠 Home
              </Button>
              <span className="text-sm font-medium text-primary">🎮 Games</span>
              <Button variant="ghost" onClick={() => setGameState("game-select")} className="text-sm">
                📈 Levels
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 pt-16 sm:pt-20 p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 sm:space-y-6 mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">FACTS Framework Games</h1>
              <p className="text-sm sm:text-base text-muted-foreground px-4">
                Master fact-checking and verification through interactive challenges
              </p>
            </div>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {factGames.map((game) => (
                <Card
                  key={game.id}
                  className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
                  onClick={() => handleFactGameSelect(game.id)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{game.icon}</span>
                      {game.title}
                    </CardTitle>
                    <CardDescription>{game.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button variant="outline" onClick={handleBackToGameSelect}>
                ← Back to All Games
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "challenges") {
    const challenges = games.find(g => g.id === selectedGameCategory)?.challenges || [];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex flex-col">
        {/* Navigation Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <span className="font-bold text-sm sm:text-lg">AI Literacy</span>
            </div>
            <div className="hidden sm:flex items-center gap-6">
              <Button variant="ghost" onClick={() => setGameState("welcome")} className="text-sm">
                🏠 Home
              </Button>
              <span className="text-sm font-medium text-primary">🎓 Lessons</span>
              <span className="text-sm text-muted-foreground">Level {playerData.level} • {playerData.score} pts</span>
            </div>
            <div className="sm:hidden">
              <Button variant="ghost" size="sm" onClick={() => setShowMobileSidebar(!showMobileSidebar)}>
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Layout Container */}
        <div className="flex flex-1 pt-16 sm:pt-20">
          {/* Enhanced Sidebar - Hidden on mobile, fixed on larger screens */}
          <div className={`${showMobileSidebar ? 'block' : 'hidden'} lg:block fixed lg:relative top-16 sm:top-20 left-0 h-full lg:h-auto w-full lg:w-80 bg-card border-r border-border overflow-y-auto shadow-lg z-40`}>
            <div className="p-4 lg:p-6">
              <div className="space-y-4 lg:space-y-6">
                {/* Close button for mobile */}
                <div className="lg:hidden flex justify-between items-center">
                  <h3 className="font-semibold">Progress & Learning Path</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowMobileSidebar(false)}>
                    ✕
                  </Button>
                </div>

                {/* Progress Stats */}
                <div className="text-center space-y-3 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
                  <div>
                    <div className="text-2xl lg:text-3xl font-bold text-primary">Level {playerData.level}</div>
                    <div className="text-sm text-muted-foreground">Prompt Master</div>
                  </div>
                  <div className="flex justify-center gap-4 text-xs">
                    <div className="text-center">
                      <div className="font-bold text-base lg:text-lg">{playerData.score}</div>
                      <div className="text-muted-foreground">Points</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-base lg:text-lg">{completedChallengeIds.size}</div>
                      <div className="text-muted-foreground">Completed</div>
                    </div>
                  </div>
                </div>

                {/* Learning Path */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Learning Path
                  </h3>
                  <div className="space-y-2">
                    {challenges.map((challenge, index) => {
                      const isCompleted = completedChallengeIds.has(challenge.id);
                      const isLocked = index > 0 && !completedChallengeIds.has(challenges[index - 1].id);
                      const isCurrent = !isCompleted && !isLocked;
                      
                      return (
                        <div 
                          key={challenge.id}
                          className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                            isCompleted ? 'bg-green-50 border-green-200' : 
                            isCurrent ? 'bg-primary/5 border-primary/30' : 
                            'bg-muted/30 border-muted'
                          }`}
                          onClick={() => !isLocked && handleChallengeSelect(challenge)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {isCompleted ? (
                                <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-green-500 flex items-center justify-center">
                                  <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                                </div>
                              ) : isLocked ? (
                                <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-muted flex items-center justify-center">
                                  <span className="text-xs lg:text-sm">🔒</span>
                                </div>
                              ) : isCurrent ? (
                                <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-primary flex items-center justify-center">
                                  <span className="text-xs lg:text-sm text-white font-bold">{index + 1}</span>
                                </div>
                              ) : (
                                <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2 border-primary flex items-center justify-center">
                                  <span className="text-xs lg:text-sm font-bold text-primary">{index + 1}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm leading-tight">{challenge.title}</div>
                              <div className="text-xs text-muted-foreground mt-1">{challenge.difficulty}</div>
                              {challenge.description && (
                                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {challenge.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Learning Objectives */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    What You'll Master
                  </h3>
                  <div className="text-xs text-muted-foreground space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span>Build perfect prompt structure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span>Master role-based prompting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span>Control tone and style</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span>Handle complex multi-tasks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 lg:ml-80 p-4 sm:p-6">
            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setShowMobileSidebar(true)}
              >
                📊 View Progress & Learning Path
              </Button>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="text-center space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {games.find(g => g.id === selectedGameCategory)?.title}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground px-4">
                  Complete the challenges to master {games.find(g => g.id === selectedGameCategory)?.title.toLowerCase()}
                </p>
              </div>

              <div className="grid gap-4 sm:gap-6">
                {challenges.map((challenge, index) => {
                  const isCompleted = completedChallengeIds.has(challenge.id);
                  const isLocked = index > 0 && !completedChallengeIds.has(challenges[index - 1].id);
                  const isCurrent = !isCompleted && !isLocked;

                  return (
                    <Card 
                      key={challenge.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        isCompleted ? 'border-green-500 bg-green-50' : 
                        isLocked ? 'border-muted bg-muted/30 cursor-not-allowed' : 
                        'border-primary/50 hover:border-primary'
                      }`}
                      onClick={() => !isLocked && handleChallengeSelect(challenge)}
                    >
                      <CardHeader className="pb-3 sm:pb-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {isCompleted ? (
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              </div>
                            ) : isLocked ? (
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-muted flex items-center justify-center">
                                <span className="text-xs sm:text-sm">🔒</span>
                              </div>
                            ) : (
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center">
                                <span className="text-xs sm:text-sm text-white font-bold">{index + 1}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base sm:text-lg leading-tight">{challenge.title}</CardTitle>
                            <CardDescription className="text-sm text-muted-foreground mt-1">
                              {challenge.difficulty} • {challenge.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            {isCompleted ? '✅ Completed' : isLocked ? '🔒 Complete previous challenge' : '🎮 Ready to start'}
                          </div>
                          <Button 
                            size="sm" 
                            disabled={isLocked}
                            className="text-xs sm:text-sm"
                          >
                            {isCompleted ? 'Review' : 'Start Challenge'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "playing") {
    if (currentGame) {
      // Render fact-checking games
      const GameComponent = (() => {
        switch (currentGame) {
          case "truth-detective":
            return TruthDetective;
          case "source-hunter":
            return SourceHunter;
          case "prompt-escape":
            return PromptEscape;
          default:
            return null;
        }
      })();

      if (!GameComponent) {
        return <div>Game not found</div>;
      }

      return (
        <div className="min-h-screen bg-background flex flex-col">
          {/* Navigation Header */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                <span className="font-bold text-sm sm:text-lg">AI Literacy</span>
              </div>
              <div className="hidden sm:flex items-center gap-6">
                <Button variant="ghost" onClick={handleBackToChallenges} className="text-sm">
                  🏠 Home
                </Button>
                <span className="text-sm font-medium text-primary">🎮 Games</span>
                <Button variant="ghost" onClick={() => setGameState("game-select")} className="text-sm">
                  📈 Levels
                </Button>
              </div>
            </div>
          </div>

          {/* Main Game Area */}
          <div className="flex-1 pt-16 sm:pt-20 p-4 sm:p-6">
            <GameComponent
              onComplete={handleChallengeComplete}
              onBack={handleBackToChallenges}
            />
          </div>
        </div>
      );
    }

    if (currentChallenge) {
      // Render lesson challenge
      const GameComponent = (() => {
        switch (currentChallenge.gameComponent) {
          case "PromptBuilderGame":
            return PromptBuilderGame;
          case "RoleMatcher":
            return RoleMatcher;
          case "DetailDetective":
            return DetailDetective;
          case "ToneController":
            return ToneController;
          case "MultiTaskMaster":
            return MultiTaskMaster;
          case "CreativeChallenge":
            return CreativeChallenge;
          case "FormatCrafterGame":
            return FormatCrafterGame;
          case "PrecisionTargeterGame":
            return PrecisionTargeterGame;
          case "PerspectiveShifterGame":
            return PerspectiveShifterGame;
          case "StoryEngineGame":
            return StoryEngineGame;
          default:
            return PromptBuilder;
        }
      })();

      return (
        <div className="min-h-screen bg-background flex flex-col">
          {/* Navigation Header */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                <span className="font-bold text-sm sm:text-lg">AI Literacy</span>
              </div>
              <div className="hidden sm:flex items-center gap-6">
                <Button variant="ghost" onClick={handleBackToChallenges} className="text-sm">
                  🏠 Home
                </Button>
                <span className="text-sm font-medium text-primary">🎓 Lessons</span>
                <span className="text-sm text-muted-foreground">Level {playerData.level} • {playerData.score} pts</span>
              </div>
            </div>
          </div>

          {/* Layout Container */}
          <div className="flex flex-1 pt-16 sm:pt-20">
            {/* Sidebar - Hidden on mobile, visible on larger screens */}
            <div className="hidden lg:block fixed left-0 top-16 sm:top-20 h-full w-80 bg-card border-r border-border overflow-y-auto shadow-lg">
              <div className="p-6">
                <div className="space-y-6">
                  {/* Progress Stats */}
                  <div className="text-center space-y-3 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
                    <div>
                      <div className="text-3xl font-bold text-primary">Level {playerData.level}</div>
                      <div className="text-sm text-muted-foreground">Prompt Master</div>
                    </div>
                    <div className="flex justify-center gap-4 text-xs">
                      <div className="text-center">
                        <div className="font-bold text-lg">{playerData.score}</div>
                        <div className="text-muted-foreground">Points</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg">{completedChallengeIds.size}</div>
                        <div className="text-muted-foreground">Completed</div>
                      </div>
                    </div>
                  </div>

                  {/* Current Challenge Context */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-base flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      Current Challenge
                    </h3>
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="text-sm">
                        <h4 className="font-medium text-primary mb-2">🎯 {currentChallenge.title}</h4>
                        <p className="text-muted-foreground mb-3">{currentChallenge.objective}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-blue-800 mb-2">💡 Hints</h4>
                            <ul className="text-xs space-y-1">
                              {currentChallenge.hints.map((hint, index) => (
                                <li key={index} className="text-blue-700">• {hint}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-green-800 mb-2">✅ Examples</h4>
                            <div className="space-y-2">
                              {currentChallenge.goodExamples.length > 0 && (
                                <div>
                                  <div className="text-xs font-medium text-green-700 mb-1">Good:</div>
                                  <div className="text-xs text-green-600 bg-green-50 p-2 rounded max-h-20 overflow-y-auto">
                                    {currentChallenge.goodExamples[0]}
                                  </div>
                                </div>
                              )}
                              {currentChallenge.badExamples.length > 0 && (
                                <div>
                                  <div className="text-xs font-medium text-red-700 mb-1">❌ Avoid:</div>
                                  <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                                    "{currentChallenge.badExamples[0]}"
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Game Area */}
            <div className="flex-1 lg:ml-80 p-4 sm:p-6">
              {currentChallenge.gameComponent === "FormatCrafterGame" || 
               currentChallenge.gameComponent === "PrecisionTargeterGame" || 
               currentChallenge.gameComponent === "PerspectiveShifterGame" || 
               currentChallenge.gameComponent === "StoryEngineGame" ? (
                <GameComponent
                  onComplete={handleChallengeCompleteNoScore}
                  onBack={handleBackToChallenges}
                />
              ) : (
                <GameComponent
                  onComplete={handleChallengeComplete}
                  onBack={handleBackToChallenges}
                />
              )}
            </div>
          </div>
        </div>
      );
    }
  }

  return <div>No content to display</div>;
};

export default Index;