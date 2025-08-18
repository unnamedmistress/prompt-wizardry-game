import { useState, useEffect } from "react";
import { toast } from "sonner";
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
import { Sparkles, BookOpen, Target, Trophy, CheckCircle, Menu, Play, ArrowLeft } from "lucide-react";

interface LearningExperience {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  icon: string;
  objective: string;
  whatYoullLearn: string[];
  hints: string[];
  goodExamples: string[];
  badExamples: string[];
  gameComponent: string;
}

// Unified learning experiences for all games
const allLearningExperiences: LearningExperience[] = [
  // Prompting Fundamentals
  {
    id: "prompt-structure",
    title: "Basic Prompt Structure",
    description: "Master the building blocks of great prompts with fun scenarios",
    difficulty: "Beginner" as const,
    category: "Prompting Fundamentals",
    icon: "🏗️",
    objective: "Help someone call in sick to work with a convincing (but honest!) excuse",
    whatYoullLearn: [
      "Structure prompts with clear role assignments",
      "Include specific context and details",
      "Control tone and formality levels",
      "Balance honesty with effectiveness"
    ],
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
    id: "role-mastery",
    title: "Context & Role Mastery",
    description: "Learn how the right role transforms AI responses",
    difficulty: "Beginner" as const,
    category: "Prompting Fundamentals",
    icon: "🎭",
    objective: "Get AI to help plan an epic birthday party for a 25-year-old who loves board games",
    whatYoullLearn: [
      "Choose effective AI roles for different tasks",
      "Set proper context and constraints",
      "Specify response style and format",
      "Include key requirements and limitations"
    ],
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
    id: "specificity-details",
    title: "Specificity & Details",
    description: "Transform vague requests into crystal-clear instructions",
    difficulty: "Intermediate" as const,
    category: "Prompting Fundamentals",
    icon: "🎯",
    objective: "Get AI to help write the perfect dating app profile that's authentic and engaging",
    whatYoullLearn: [
      "Add specific personality and interest details",
      "Define target audience clearly",
      "Specify tone and style preferences",
      "Set constraints like character limits"
    ],
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
    id: "tone-control",
    title: "Tone & Style Control",
    description: "Master the art of getting exactly the right voice from AI",
    difficulty: "Intermediate" as const,
    category: "Prompting Fundamentals",
    icon: "🎨",
    objective: "Get AI to write a resignation letter that's professional but shows you're leaving for positive reasons",
    whatYoullLearn: [
      "Specify exact tone preferences",
      "Include relevant context",
      "Define what to avoid in responses",
      "Set format and length requirements"
    ],
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
    id: "multi-task",
    title: "Complex Multi-Task Prompts",
    description: "Combine multiple requirements into one powerful prompt",
    difficulty: "Advanced" as const,
    category: "Prompting Fundamentals",
    icon: "⚡",
    objective: "Get AI to plan a surprise proposal that's personal, memorable, and perfectly executed",
    whatYoullLearn: [
      "Break down complex tasks into components",
      "Include personal details for customization",
      "Specify different types of help needed",
      "Add multiple constraints and considerations"
    ],
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
    id: "creative-prompts",
    title: "Creative & Fun Prompts",
    description: "Unlock AI's creative potential with imaginative scenarios",
    difficulty: "Advanced" as const,
    category: "Prompting Fundamentals",
    icon: "🎪",
    objective: "Get AI to help create a murder mystery dinner party that will blow your friends' minds",
    whatYoullLearn: [
      "Set creative roles for AI",
      "Include constraints for complexity",
      "Specify exactly what you need",
      "Consider your audience's interests"
    ],
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
  },
  // Format & Output Control
  {
    id: "format-crafter",
    title: "Office Format Master",
    description: "Structure AI output for business presentations and documents",
    difficulty: "Intermediate" as const,
    category: "Format & Output Control",
    icon: "📊",
    objective: "Transform information into professional formats like tables, lists, and scripts",
    whatYoullLearn: [
      "Create tables and structured data",
      "Format professional lists and outlines",
      "Generate scripts and templates",
      "Control output formatting precisely"
    ],
    hints: ["Specify exact format requirements", "Include structure preferences", "Define professional standards"],
    goodExamples: ["Format as a table with columns for...", "Create a bulleted list with..."],
    badExamples: ["Make agenda", "Format this"],
    gameComponent: "FormatCrafterGame"
  },
  {
    id: "precision-targeter",
    title: "Fitness Precision Trainer",
    description: "Master constraints and delimiters for scoped output",
    difficulty: "Advanced" as const,
    category: "Precision & Constraints",
    icon: "💪",
    objective: "Use precise constraints to get exactly what you need",
    whatYoullLearn: [
      "Apply specific constraints effectively",
      "Use delimiters to scope responses",
      "Control output boundaries",
      "Create precise requirements"
    ],
    hints: ["Add clear constraints", "Define scope boundaries", "Use specific delimiters"],
    goodExamples: ["Within 30 minutes, using only bodyweight exercises..."],
    badExamples: ["Give workout", "Help with exercise"],
    gameComponent: "PrecisionTargeterGame"
  },
  {
    id: "perspective-shifter",
    title: "Hollywood Perspective Master",
    description: "Learn viewpoint transformation and role-based responses",
    difficulty: "Intermediate" as const,
    category: "Perspective & Viewpoint",
    icon: "🎬",
    objective: "Write from different perspectives and viewpoints",
    whatYoullLearn: [
      "Adopt different character perspectives",
      "Shift viewpoints effectively",
      "Create authentic voice variations",
      "Master role-based writing"
    ],
    hints: ["Choose specific roles", "Define perspective clearly", "Maintain character consistency"],
    goodExamples: ["As a film director, analyze this movie...", "From a critic's perspective..."],
    badExamples: ["Review movie", "Talk about film"],
    gameComponent: "PerspectiveShifterGame"
  },
  {
    id: "story-engine",
    title: "Creative Story Engine",
    description: "Master narrative prompts with plot, structure, and tone",
    difficulty: "Advanced" as const,
    category: "Creative Writing",
    icon: "📚",
    objective: "Combine genre, structure, and tone for compelling narratives",
    whatYoullLearn: [
      "Structure narrative prompts",
      "Combine genre elements",
      "Control story tone and mood",
      "Create compelling plots"
    ],
    hints: ["Choose genre carefully", "Define story structure", "Set tone and mood"],
    goodExamples: ["Write a sci-fi mystery with noir tone..."],
    badExamples: ["Write story", "Make fiction"],
    gameComponent: "StoryEngineGame"
  },
  // Fact-Checking & Verification
  {
    id: "truth-detective",
    title: "Truth Detective",
    description: "Spot AI hallucinations in 'Two Truths and a Lie' format",
    difficulty: "Intermediate" as const,
    category: "Fact-Checking & Verification",
    icon: "🕵️",
    objective: "Identify AI-generated inaccuracies and hallucinations",
    whatYoullLearn: [
      "Recognize AI hallucinations",
      "Fact-check AI responses",
      "Identify suspicious claims",
      "Verify information accuracy"
    ],
    hints: ["Look for inconsistencies", "Check factual claims", "Trust but verify"],
    goodExamples: ["This fact seems suspicious because..."],
    badExamples: ["Believe everything", "Don't question"],
    gameComponent: "TruthDetective"
  },
  {
    id: "source-hunter",
    title: "Source Hunter",
    description: "Find credible sources to verify AI claims",
    difficulty: "Advanced" as const,
    category: "Fact-Checking & Verification", 
    icon: "🔍",
    objective: "Locate and evaluate credible sources for verification",
    whatYoullLearn: [
      "Find credible sources",
      "Evaluate source reliability",
      "Cross-reference information",
      "Build verification skills"
    ],
    hints: ["Look for reputable sources", "Cross-reference claims", "Check publication dates"],
    goodExamples: ["According to Reuters and BBC..."],
    badExamples: ["Random website says...", "Someone posted..."],
    gameComponent: "SourceHunter"
  },
  {
    id: "prompt-escape",
    title: "Prompt Escape Room",
    description: "Escape by finding which prompt caused problematic responses",
    difficulty: "Advanced" as const,
    category: "Prompt Analysis",
    icon: "🔓",
    objective: "Identify problematic prompts and their issues",
    whatYoullLearn: [
      "Analyze prompt effectiveness",
      "Identify prompt problems",
      "Debug AI responses",
      "Improve prompt quality"
    ],
    hints: ["Examine prompt structure", "Look for ambiguity", "Check for bias"],
    goodExamples: ["This prompt fails because..."],
    badExamples: ["Prompt looks fine", "Don't analyze"],
    gameComponent: "PromptEscape"
  }
];

const Index = () => {
  const [gameState, setGameState] = useState<"welcome" | "learning-path" | "playing">("welcome");
  const [currentExperience, setCurrentExperience] = useState<LearningExperience | null>(null);
  const [playerData, setPlayerData] = useState({
    level: 1,
    score: 0,
    completedChallenges: 0
  });
  const [completedExperienceIds, setCompletedExperienceIds] = useState<Set<string>>(new Set());
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Load saved progress from localStorage
  useEffect(() => {
    const savedPlayerData = localStorage.getItem('aiLiteracy_playerData');
    const savedCompletedExperiences = localStorage.getItem('aiLiteracy_completedExperiences');
    const savedGameState = localStorage.getItem('aiLiteracy_gameState');

    if (savedPlayerData) {
      setPlayerData(JSON.parse(savedPlayerData));
    }
    if (savedCompletedExperiences) {
      setCompletedExperienceIds(new Set(JSON.parse(savedCompletedExperiences)));
    }
    if (savedGameState && savedGameState !== 'playing') {
      setGameState(savedGameState as "welcome" | "learning-path");
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('aiLiteracy_playerData', JSON.stringify(playerData));
  }, [playerData]);

  useEffect(() => {
    localStorage.setItem('aiLiteracy_completedExperiences', JSON.stringify([...completedExperienceIds]));
  }, [completedExperienceIds]);

  useEffect(() => {
    localStorage.setItem('aiLiteracy_gameState', gameState);
  }, [gameState]);

  const handleStartLearning = () => {
    setGameState("learning-path");
  };

  const handleExperienceSelect = (experience: LearningExperience) => {
    setCurrentExperience(experience);
    setGameState("playing");
  };

  const handleExperienceComplete = (score: number = 100) => {
    if (currentExperience) {
      setCompletedExperienceIds(prev => new Set([...prev, currentExperience.id]));
      setPlayerData(prev => ({
        ...prev,
        score: prev.score + score,
        completedChallenges: prev.completedChallenges + 1,
        level: Math.floor((prev.completedChallenges + 1) / 3) + 1
      }));
      
      toast(`Experience completed! +${score} points`, {
        description: `You've earned ${score} points and advanced your AI literacy skills!`,
      });
    }
    setGameState("learning-path");
    setCurrentExperience(null);
  };

  const handleExperienceCompleteNoScore = () => {
    handleExperienceComplete(100);
  };

  const handleBackToLearningPath = () => {
    setGameState("learning-path");
    setCurrentExperience(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 border-green-200";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Advanced": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Prompting Fundamentals": "bg-blue-100 text-blue-800",
      "Format & Output Control": "bg-purple-100 text-purple-800",
      "Precision & Constraints": "bg-orange-100 text-orange-800",
      "Perspective & Viewpoint": "bg-indigo-100 text-indigo-800",
      "Creative Writing": "bg-pink-100 text-pink-800",
      "Fact-Checking & Verification": "bg-teal-100 text-teal-800",
      "Prompt Analysis": "bg-gray-100 text-gray-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  // Welcome Screen
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
              <Button variant="ghost" onClick={() => setGameState("learning-path")} className="text-sm">
                🎓 Learn
              </Button>
              <span className="text-sm text-muted-foreground">Level {playerData.level} • {playerData.score} pts</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 pt-16 sm:pt-20">
          <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <div className="max-w-4xl mx-auto text-center space-y-8 sm:space-y-12">
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                  Master AI Literacy
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Learn effective AI prompting and fact-checking through interactive experiences. 
                  From basic prompts to advanced techniques and verification skills.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  onClick={handleStartLearning}
                  size="lg"
                  className="text-lg px-8 py-4 bg-primary hover:bg-primary/90"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Learning Journey
                </Button>
                <div className="text-sm text-muted-foreground">
                  {allLearningExperiences.length} interactive experiences • All skill levels
                </div>
              </div>

              {completedExperienceIds.size > 0 && (
                <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="text-primary font-medium">Your Progress</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {completedExperienceIds.size} of {allLearningExperiences.length} experiences completed
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Learning Path Screen - Show ALL games
  if (gameState === "learning-path") {
    const categorizedExperiences = allLearningExperiences.reduce((acc, exp) => {
      if (!acc[exp.category]) acc[exp.category] = [];
      acc[exp.category].push(exp);
      return acc;
    }, {} as Record<string, LearningExperience[]>);

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
              <span className="text-sm font-medium text-primary">🎓 Learn</span>
              <span className="text-sm text-muted-foreground">Level {playerData.level} • {playerData.score} pts</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 pt-16 sm:pt-20 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Choose Your Learning Path</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Master AI prompting and literacy through hands-on interactive experiences. Each experience teaches you specific skills to become an AI expert.
              </p>
              <div className="flex justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-muted-foreground">{completedExperienceIds.size} Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground">{allLearningExperiences.length - completedExperienceIds.size} Available</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {Object.entries(categorizedExperiences).map(([category, experiences]) => (
                <div key={category} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-foreground">{category}</h2>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
                      {experiences.length} experiences
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {experiences.map((experience) => {
                      const isCompleted = completedExperienceIds.has(experience.id);
                      
                      return (
                        <Card 
                          key={experience.id}
                          className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                            isCompleted 
                              ? 'border-green-500 bg-green-50/50' 
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => handleExperienceSelect(experience)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{experience.icon}</span>
                                <div className="flex-1 min-w-0">
                                  <CardTitle className="text-base leading-tight">{experience.title}</CardTitle>
                                </div>
                              </div>
                              {isCompleted && (
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              )}
                            </div>
                            <CardDescription className="text-sm">{experience.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(experience.difficulty)}`}>
                                  {experience.difficulty}
                                </span>
                                <Button size="sm" variant={isCompleted ? "outline" : "default"}>
                                  {isCompleted ? "Review" : "Start"}
                                </Button>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                <strong>Objective:</strong> {experience.objective}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen - Codecademy-style split screen
  if (gameState === "playing" && currentExperience) {
    const GameComponent = (() => {
      switch (currentExperience.gameComponent) {
        case "PromptBuilderGame": return PromptBuilderGame;
        case "RoleMatcher": return RoleMatcher;
        case "DetailDetective": return DetailDetective;
        case "ToneController": return ToneController;
        case "MultiTaskMaster": return MultiTaskMaster;
        case "CreativeChallenge": return CreativeChallenge;
        case "FormatCrafterGame": return FormatCrafterGame;
        case "PrecisionTargeterGame": return PrecisionTargeterGame;
        case "PerspectiveShifterGame": return PerspectiveShifterGame;
        case "StoryEngineGame": return StoryEngineGame;
        case "TruthDetective": return TruthDetective;
        case "SourceHunter": return SourceHunter;
        case "PromptEscape": return PromptEscape;
        default: return null;
      }
    })();

    if (!GameComponent) {
      return <div>Experience not found</div>;
    }

    const shouldUseNoScore = ["FormatCrafterGame", "PrecisionTargeterGame", "PerspectiveShifterGame", "StoryEngineGame"].includes(currentExperience.gameComponent);

    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Navigation Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToLearningPath}
                className="text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-lg">{currentExperience.icon}</span>
                <span className="font-bold text-sm sm:text-base">{currentExperience.title}</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(currentExperience.difficulty)}`}>
                {currentExperience.difficulty}
              </span>
              <span className="text-sm text-muted-foreground">Level {playerData.level} • {playerData.score} pts</span>
            </div>
            <div className="sm:hidden">
              <Button variant="ghost" size="sm" onClick={() => setShowMobileSidebar(!showMobileSidebar)}>
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Split Screen Layout */}
        <div className="flex flex-col lg:flex-row flex-1 pt-16 sm:pt-20">
          {/* Learning Sidebar - Codecademy Style */}
          <div className={`${showMobileSidebar ? 'block' : 'hidden lg:block'} fixed lg:relative top-16 sm:top-20 left-0 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] lg:h-auto w-full lg:w-96 bg-card border-r border-border overflow-y-auto shadow-lg lg:shadow-none z-40`}>
            <div className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                {/* Close button for mobile */}
                <div className="lg:hidden flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Learning Guide</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowMobileSidebar(false)}>
                    ✕
                  </Button>
                </div>

                {/* Current Experience Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl">{currentExperience.icon}</span>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base">{currentExperience.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{currentExperience.category}</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{currentExperience.description}</p>
                </div>

                {/* Objective */}
                <div className="space-y-2">
                  <h4 className="font-medium text-xs sm:text-sm flex items-center gap-2">
                    <Target className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    Your Mission
                  </h4>
                  <p className="text-xs sm:text-sm bg-primary/5 p-2 sm:p-3 rounded-lg border border-primary/20">
                    {currentExperience.objective}
                  </p>
                </div>

                {/* What You'll Learn */}
                <div className="space-y-3">
                  <h4 className="font-medium text-xs sm:text-sm flex items-center gap-2">
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    What You'll Learn
                  </h4>
                  <ul className="space-y-2">
                    {currentExperience.whatYoullLearn.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs sm:text-sm">
                        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hints */}
                <div className="space-y-3">
                  <h4 className="font-medium text-xs sm:text-sm text-blue-800">💡 Helpful Hints</h4>
                  <ul className="space-y-2">
                    {currentExperience.hints.map((hint, index) => (
                      <li key={index} className="text-xs text-blue-700 bg-blue-50 p-2 rounded">
                        • {hint}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Examples */}
                <div className="space-y-3">
                  <h4 className="font-medium text-xs sm:text-sm">📋 Examples</h4>
                  {currentExperience.goodExamples.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-green-800">✅ Good Example:</div>
                      <div className="text-xs text-green-700 bg-green-50 p-2 sm:p-3 rounded border border-green-200 max-h-24 sm:max-h-32 overflow-y-auto">
                        "{currentExperience.goodExamples[0]}"
                      </div>
                    </div>
                  )}
                  {currentExperience.badExamples.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-red-800">❌ Avoid This:</div>
                      <div className="text-xs text-red-700 bg-red-50 p-2 sm:p-3 rounded border border-red-200">
                        "{currentExperience.badExamples[0]}"
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Game Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden p-3 border-b border-border bg-card">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setShowMobileSidebar(true)}
              >
                📚 View Learning Guide
              </Button>
            </div>

            {/* Game Content Area */}
            <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto">
              <GameComponent
                onComplete={shouldUseNoScore ? handleExperienceCompleteNoScore : handleExperienceComplete}
                onBack={handleBackToLearningPath}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div>No content to display</div>;
};

export default Index;