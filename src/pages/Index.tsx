import { useState, useEffect } from "react";
import { toast } from "sonner";
import { GameHeader } from "@/components/GameHeader";
import { GameCard } from "@/components/GameCard";
import { PromptBuilder } from "@/components/PromptBuilder";
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
}

const challenges: Challenge[] = [
  {
    id: "1",
    title: "Basic Prompt Structure",
    description: "Learn the fundamental elements of a well-structured prompt",
    difficulty: "Beginner",
    objective: "Create a prompt that asks AI to write a professional email about a meeting reschedule",
    hints: [
      "Start by giving the AI a role or context",
      "Be specific about what you want",
      "Mention the tone and format you prefer",
      "Include relevant details"
    ],
    goodExamples: ["You are a professional assistant. Write a polite email to reschedule a team meeting..."],
    badExamples: ["Write email about meeting"]
  },
  {
    id: "2", 
    title: "Adding Context & Role",
    description: "Master the art of giving AI proper context and role definition",
    difficulty: "Beginner",
    objective: "Create a prompt where AI acts as a cooking instructor explaining how to make pasta",
    hints: [
      "Define who the AI should be",
      "Set the audience level (beginner, expert, etc.)",
      "Specify the communication style",
      "Include the specific task"
    ],
    goodExamples: [],
    badExamples: []
  },
  {
    id: "3",
    title: "Specificity & Details",
    description: "Learn how being specific dramatically improves AI responses",
    difficulty: "Intermediate", 
    objective: "Create a detailed prompt for AI to write a product description for a smart home device",
    hints: [
      "Include target audience",
      "Specify key features to highlight",
      "Mention desired length and tone",
      "Add formatting requirements"
    ],
    goodExamples: [],
    badExamples: []
  },
  {
    id: "4",
    title: "Output Formatting",
    description: "Control how AI structures and presents information",
    difficulty: "Intermediate",
    objective: "Get AI to create a structured comparison between two programming languages",
    hints: [
      "Specify the exact format (table, list, etc.)",
      "Define comparison criteria",
      "Set length constraints",
      "Request specific sections"
    ],
    goodExamples: [],
    badExamples: []
  },
  {
    id: "5",
    title: "Chain of Thought",
    description: "Guide AI through step-by-step reasoning processes",
    difficulty: "Advanced",
    objective: "Create a prompt that makes AI solve a complex problem step-by-step",
    hints: [
      "Ask AI to think step by step",
      "Request reasoning for each step",
      "Include verification methods",
      "Structure the thinking process"
    ],
    goodExamples: [],
    badExamples: []
  },
  {
    id: "6",
    title: "Few-Shot Examples",
    description: "Use examples to guide AI behavior and output style",
    difficulty: "Advanced", 
    objective: "Use examples to teach AI a specific writing style for social media posts",
    hints: [
      "Provide 2-3 good examples",
      "Show the pattern you want",
      "Explain what makes examples good",
      "Request similar output"
    ],
    goodExamples: [],
    badExamples: []
  }
];

const Index = () => {
  const [gameState, setGameState] = useState<"welcome" | "challenges" | "playing">("welcome");
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
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
    setGameState("challenges");
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
    setGameState("challenges");
    setCurrentChallenge(null);
  };

  if (gameState === "welcome") {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="relative z-10 container mx-auto px-4 py-24">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-6xl font-bold bg-gradient-mystical bg-clip-text text-transparent">
                  Prompt Wizardry
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Master the ancient art of AI prompting through magical challenges. 
                  Learn to craft spells that make AI do exactly what you want.
                </p>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button 
                  variant="magical" 
                  size="lg"
                  onClick={handleStartGame}
                  className="text-lg px-8 py-6"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Begin Your Journey
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-gradient-card border-primary/20 text-center">
              <CardHeader>
                <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-foreground">Learn by Doing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Interactive challenges that teach you practical prompting techniques through hands-on experience.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-accent/20 text-center">
              <CardHeader>
                <Target className="w-12 h-12 text-accent mx-auto mb-4" />
                <CardTitle className="text-foreground">Instant Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get real-time analysis of your prompts with specific suggestions for improvement.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-primary/20 text-center">
              <CardHeader>
                <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-foreground">Track Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Level up your skills and unlock advanced techniques as you complete challenges.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "playing" && currentChallenge) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <PromptBuilder
            challenge={currentChallenge}
            onComplete={handleChallengeComplete}
            onBack={handleBackToChallenges}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <GameHeader
          level={playerData.level}
          score={playerData.score}
          totalChallenges={challenges.length}
          completedChallenges={playerData.completedChallenges}
        />

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Choose Your Challenge</h2>
            <p className="text-muted-foreground">
              Select a challenge to practice your prompting skills
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {challenges.map((challenge, index) => {
              const isCompleted = completedChallengeIds.has(challenge.id);
              const isLocked = index > 0 && !completedChallengeIds.has(challenges[index - 1].id);
              
              return (
                <GameCard
                  key={challenge.id}
                  title={challenge.title}
                  description={challenge.description}
                  difficulty={challenge.difficulty}
                  completed={isCompleted}
                  locked={isLocked}
                  onClick={() => handleChallengeSelect(challenge)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
