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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import heroImage from "@/assets/hero-crystal.jpg";
import { Sparkles, BookOpen, Target, Trophy, CheckCircle } from "lucide-react";

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

  if (gameState === "challenges") {
    const challenges = games.find(g => g.id === selectedGameCategory)?.challenges || [];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex">
        {/* Navigation Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">AI Literacy - Learn to Prompt</span>
            </div>
            <div className="flex items-center gap-6">
              <Button variant="ghost" onClick={() => setGameState("welcome")} className="text-sm">
                🏠 Home
              </Button>
              <span className="text-sm font-medium text-primary">🎓 Lessons</span>
              <span className="text-sm text-muted-foreground">Level {playerData.level} • {playerData.score} pts</span>
            </div>
          </div>
        </div>

        {/* Enhanced Sidebar */}
        <div className="fixed left-0 top-20 h-full w-80 bg-card border-r border-border overflow-y-auto shadow-lg">
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
              
              <Button 
                variant="outline" 
                onClick={handleBackToGameSelect} 
                className="w-full"
              >
                ← Choose Different Path
              </Button>
              
              {/* Current Lesson Objective */}
              {currentChallenge && (
                <div className="space-y-3 p-4 bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-base flex items-center gap-2 text-green-800">
                    🎯 Current Objective
                  </h3>
                  <div className="text-sm text-green-700">
                    <div className="font-medium mb-2">{currentChallenge.title}</div>
                    <div className="text-sm">{currentChallenge.objective}</div>
                  </div>
                  
                  {/* Lesson Content */}
                  <div className="mt-4 space-y-3">
                    <div className="text-sm">
                      <h4 className="font-medium text-green-800 mb-2">📚 Lesson</h4>
                      <div className="text-green-700 space-y-2">
                        {currentChallenge.id === "1" && (
                          <div>
                            <div className="font-medium mb-1">Prompt structure affects:</div>
                            <ul className="text-xs space-y-1 ml-4">
                              <li>• <strong>Clarity:</strong> Clear vs. confusing responses</li>
                              <li>• <strong>Accuracy:</strong> Relevant vs. off-topic answers</li>
                              <li>• <strong>Tone:</strong> Professional vs. casual delivery</li>
                              <li>• <strong>Format:</strong> Structured vs. rambling output</li>
                            </ul>
                          </div>
                        )}
                        {currentChallenge.id === "2" && (
                          <div>
                            <div className="font-medium mb-1">Role definition affects:</div>
                            <ul className="text-xs space-y-1 ml-4">
                              <li>• <strong>Expertise:</strong> Expert vs. beginner explanations</li>
                              <li>• <strong>Language:</strong> Technical vs. simple terms</li>
                              <li>• <strong>Perspective:</strong> Different viewpoints</li>
                              <li>• <strong>Authority:</strong> Confident vs. uncertain tone</li>
                            </ul>
                          </div>
                        )}
                        {currentChallenge.id === "3" && (
                          <div>
                            <div className="font-medium mb-1">Specificity improves:</div>
                            <ul className="text-xs space-y-1 ml-4">
                              <li>• <strong>Relevance:</strong> Targeted responses</li>
                              <li>• <strong>Completeness:</strong> All needs addressed</li>
                              <li>• <strong>Actionability:</strong> Practical guidance</li>
                              <li>• <strong>Efficiency:</strong> Less back-and-forth</li>
                            </ul>
                          </div>
                        )}
                        {currentChallenge.id === "4" && (
                          <div>
                            <div className="font-medium mb-1">Tone control affects:</div>
                            <ul className="text-xs space-y-1 ml-4">
                              <li>• <strong>Reception:</strong> How message is received</li>
                              <li>• <strong>Relationship:</strong> Professional connections</li>
                              <li>• <strong>Effectiveness:</strong> Achieving desired outcome</li>
                              <li>• <strong>Context:</strong> Appropriate for situation</li>
                            </ul>
                          </div>
                        )}
                        {currentChallenge.id === "5" && (
                          <div>
                            <div className="font-medium mb-1">Multi-task prompts require:</div>
                            <ul className="text-xs space-y-1 ml-4">
                              <li>• <strong>Organization:</strong> Clear structure</li>
                              <li>• <strong>Prioritization:</strong> Important items first</li>
                              <li>• <strong>Constraints:</strong> Boundaries and limits</li>
                              <li>• <strong>Integration:</strong> Connected components</li>
                            </ul>
                          </div>
                        )}
                        {currentChallenge.id === "6" && (
                          <div>
                            <div className="font-medium mb-1">Creative prompts need:</div>
                            <ul className="text-xs space-y-1 ml-4">
                              <li>• <strong>Inspiration:</strong> Creative role setting</li>
                              <li>• <strong>Constraints:</strong> Focused creativity</li>
                              <li>• <strong>Context:</strong> Rich background details</li>
                              <li>• <strong>Freedom:</strong> Room for AI imagination</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-sm">
                      <h4 className="font-medium text-green-800 mb-2">💡 Examples</h4>
                      <div className="space-y-2">
                        {currentChallenge.goodExamples.length > 0 && (
                          <div>
                            <div className="text-xs font-medium text-green-700 mb-1">✅ Good:</div>
                            {currentChallenge.goodExamples.map((example, index) => (
                              <div key={index} className="text-xs text-green-600 bg-green-100 p-2 rounded border-l-2 border-green-400 mb-1">
                                {example}
                              </div>
                            ))}
                          </div>
                        )}
                        {currentChallenge.badExamples.length > 0 && (
                          <div>
                            <div className="text-xs font-medium text-red-700 mb-1">❌ Avoid:</div>
                            {currentChallenge.badExamples.map((example, index) => (
                              <div key={index} className="text-xs text-red-600 bg-red-100 p-2 rounded border-l-2 border-red-400 mb-1">
                                {example}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Lesson List */}
              <div className="space-y-3">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Learning Path
                </h3>
                {challenges.map((challenge, index) => {
                  const isCompleted = completedChallengeIds.has(challenge.id);
                  // COMMENTED OUT LOCKING FOR DEVELOPMENT - WILL RE-ENABLE LATER
                  // const isLocked = challenge.id !== "1" && !completedChallengeIds.has((parseInt(challenge.id) - 1).toString());
                  const isLocked = false; // All unlocked for development
                  const isCurrent = currentChallenge?.id === challenge.id;
                  
                  return (
                    <div
                      key={challenge.id}
                      className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                        isCurrent
                          ? 'border-primary bg-primary/10 shadow-md'
                          : isCompleted
                            ? 'border-green-500/50 bg-green-50/50 hover:bg-green-50'
                            : isLocked
                              ? 'border-muted bg-muted/50 cursor-not-allowed opacity-60'
                              : 'border-muted hover:border-primary/50 hover:bg-accent/50'
                      }`}
                      onClick={() => !isLocked && handleChallengeSelect(challenge)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {isCompleted ? (
                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                          ) : isLocked ? (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <span className="text-sm">🔒</span>
                            </div>
                          ) : isCurrent ? (
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                              <span className="text-sm text-white font-bold">{index + 1}</span>
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">{index + 1}</span>
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
                    <span>Handle complex requirements</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Unlock creative AI potential</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Real-world prompt applications</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-80 pt-20 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-6 mb-8">
              <h1 className="text-4xl font-bold text-foreground">Prompting Fundamentals</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Master AI prompting through fun, real-world scenarios. From calling in sick to planning the perfect party!
              </p>
            </div>

            <div className="grid gap-6">
              {challenges.map((challenge, index) => {
                const isCompleted = completedChallengeIds.has(challenge.id);
                // COMMENTED OUT LOCKING FOR DEVELOPMENT - WILL RE-ENABLE LATER
                // const isLocked = challenge.id !== "1" && !completedChallengeIds.has((parseInt(challenge.id) - 1).toString());
                const isLocked = false; // All unlocked for development
                
                return (
                  <Card 
                    key={challenge.id}
                    className={`transition-all hover:shadow-lg cursor-pointer ${
                      isCompleted 
                        ? 'border-green-500/50 bg-green-50/50' 
                        : isLocked 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:border-primary/50'
                    }`}
                    onClick={() => !isLocked && handleChallengeSelect(challenge)}
                  >
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : isLocked 
                              ? 'bg-muted text-muted-foreground' 
                              : 'bg-primary text-white'
                        }`}>
                          {isCompleted ? '✓' : isLocked ? '🔒' : index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">{challenge.title}</CardTitle>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              challenge.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                              challenge.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {challenge.difficulty}
                            </span>
                          </div>
                          <CardDescription className="text-base">
                            {challenge.description}
                          </CardDescription>
                          <div className="mt-3 p-3 bg-accent/50 rounded-lg">
                            <div className="text-sm font-medium text-foreground mb-1">🎯 Challenge:</div>
                            <div className="text-sm text-muted-foreground">{challenge.objective}</div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {isCompleted ? '✅ Completed' : isLocked ? '🔒 Locked' : '🎮 Interactive Game Included'}
                        </div>
                        <Button 
                          size="sm" 
                          disabled={isLocked}
                          className={isCompleted ? 'bg-green-500 hover:bg-green-600' : ''}
                        >
                          {isCompleted ? 'Review' : isLocked ? 'Locked' : 'Start Lesson'}
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
          case "ToneController":
            GameComponent = ToneController;
            break;
          case "MultiTaskMaster":
            GameComponent = MultiTaskMaster;
            break;
          case "CreativeChallenge":
            GameComponent = CreativeChallenge;
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
                  <Button variant="ghost" onClick={handleBackToChallenges} className="text-sm">
                    🏠 Home
                  </Button>
                  <span className="text-sm font-medium text-primary">🎓 Lessons</span>
                  <span className="text-sm text-muted-foreground">Level {playerData.level} • {playerData.score} pts</span>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="fixed left-0 top-16 bottom-0 w-80 bg-gradient-to-br from-primary/10 to-primary/5 border-r border-border p-6 overflow-y-auto z-40">
              <div className="space-y-6">
                {/* Level Status */}
                <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl p-6 border border-primary/20">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">Level 1</div>
                    <div className="text-muted-foreground mb-4">Prompt Master</div>
                    <div className="flex justify-center gap-8 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">0</div>
                        <div className="text-sm text-muted-foreground">Points</div>
                      </div>
                      <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">
                        {completedChallengeIds.size}
                      </div>
                        <div className="text-sm text-muted-foreground">Completed</div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full text-muted-foreground"
                      onClick={() => {
                        setCurrentChallenge(null);
                        setCurrentGame(null);
                      }}
                    >
                      ← Choose Different Path
                    </Button>
                  </div>
                </div>

                {/* Learning Path */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <BookOpen className="w-4 h-4" />
                    Learning Path
                  </div>
                  
                  <div className="space-y-3">
                    {games.find(g => g.id === currentGame)?.challenges.map((challenge, index) => (
                      <div 
                        key={challenge.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                          currentChallenge?.id === challenge.id 
                            ? 'bg-primary/10 border-primary/30' 
                            : 'bg-background/50 border-border hover:bg-background/70'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          completedChallengeIds.has(challenge.id) 
                            ? 'bg-green-500 text-white' 
                            : currentChallenge?.id === challenge.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {completedChallengeIds.has(challenge.id) ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">
                            {challenge.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {challenge.difficulty}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What You'll Master */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <Target className="w-4 h-4" />
                    What You'll Master
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      "Build perfect prompt structure",
                      "Master role-based prompting",
                      "Control tone and style",
                      "Handle complex requirements",
                      "Unlock creative AI potential",
                      "Real-world prompt applications"
                    ].map((skill, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-muted-foreground">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Game Area */}
            <div className="flex-1 ml-80 pt-20 p-6">
              <GameComponent
                challenge={currentChallenge}
                onComplete={handleChallengeComplete}
                onBack={handleBackToChallenges}
              />
            </div>
          </div>
        );
      }

      // Fallback for lessons without game components
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
                <Button variant="ghost" onClick={handleBackToChallenges} className="text-sm">
                  🏠 Home
                </Button>
                <span className="text-sm font-medium text-primary">🎓 Lessons</span>
                <span className="text-sm text-muted-foreground">Level {playerData.level} • {playerData.score} pts</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="fixed left-0 top-16 bottom-0 w-80 bg-gradient-to-br from-primary/10 to-primary/5 border-r border-border p-6 overflow-y-auto z-40">
            <div className="space-y-6">
              {/* Level Status */}
              <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl p-6 border border-primary/20">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">Level 1</div>
                  <div className="text-muted-foreground mb-4">Prompt Master</div>
                  <div className="flex justify-center gap-8 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">0</div>
                      <div className="text-sm text-muted-foreground">Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">
                        {completedChallengeIds.size}
                      </div>
                      <div className="text-sm text-muted-foreground">Completed</div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full text-muted-foreground"
                    onClick={() => {
                      setCurrentChallenge(null);
                      setCurrentGame(null);
                    }}
                  >
                    ← Choose Different Path
                  </Button>
                </div>
              </div>

              {/* Learning Path */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <BookOpen className="w-4 h-4" />
                  Learning Path
                </div>
                
                <div className="space-y-3">
                  {games.find(g => g.id === currentGame)?.challenges.map((challenge, index) => (
                    <div 
                      key={challenge.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        currentChallenge?.id === challenge.id 
                          ? 'bg-primary/10 border-primary/30' 
                          : 'bg-background/50 border-border hover:bg-background/70'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        completedChallengeIds.has(challenge.id) 
                          ? 'bg-green-500 text-white' 
                          : currentChallenge?.id === challenge.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {completedChallengeIds.has(challenge.id) ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">
                          {challenge.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {challenge.difficulty}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What You'll Master */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <Target className="w-4 h-4" />
                  What You'll Master
                </div>
                
                <div className="space-y-2">
                  {[
                    "Build perfect prompt structure",
                    "Master role-based prompting",
                    "Control tone and style",
                    "Handle complex requirements",
                    "Unlock creative AI potential",
                    "Real-world prompt applications"
                  ].map((skill, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-muted-foreground">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Game Area */}
          <div className="flex-1 ml-80 pt-20 p-6">
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

  return <div>Something went wrong</div>;
};

export default Index;