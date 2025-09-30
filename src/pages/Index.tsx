import { useState, useEffect } from "react";
import lessons from "@/data/lessons.json";
import type { LearningExperience } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { TruthDetective } from "@/components/games/TruthDetective";
import { SourceHunter } from "@/components/games/SourceHunter";
import { PromptEscape } from "@/components/games/PromptEscape";
import { PromptBuilderGame } from "@/components/games/PromptBuilderGame";
import { AIIntroGame } from "@/components/games/AIIntroGame";
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
import { Sparkles, BookOpen, Target, Trophy, CheckCircle, Menu, Play, ArrowLeft, Coins, Star, Lock } from "lucide-react";
import { GenieMentor } from "@/components/GenieMentor";
import { useGameStore } from "@/store/useGameStore";
import { getModelHint } from "@/lib/hintGenerator";
import { AppSidebar } from "@/components/AppSidebar";

const allLearningExperiences: LearningExperience[] = lessons as LearningExperience[];
const HINT_COST = 10;

const Index = () => {
  const [gameState, setGameState] = useState<"welcome" | "learning-path" | "playing" | "sequential">("welcome");
  const [currentExperience, setCurrentExperience] = useState<LearningExperience | null>(null);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const { coins, stars, level, completedExperienceIds, completeExperience, purchaseHint } = useGameStore();
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [genieMessage, setGenieMessage] = useState("");
  const [isGenieOpen, setIsGenieOpen] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [lastResult, setLastResult] = useState<{ stars: number; coins: number }>({ stars: 0, coins: 0 });
  

  // Load saved game state
  useEffect(() => {
    const savedGameState = localStorage.getItem('aiLiteracy_gameState');
    if (savedGameState && savedGameState !== 'playing') {
      setGameState(savedGameState as "welcome" | "learning-path");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('aiLiteracy_gameState', gameState);
  }, [gameState]);

  useEffect(() => {
    if (gameState === "playing" && currentExperience) {
      // Only show genie open for the first game (AI Intro)
      if (currentExperience.id === "what-is-ai") {
        setGenieMessage("🧞 Hi! I'm here if you need a hint or some motivation!");
        setIsGenieOpen(true);
      } else {
        setIsGenieOpen(false);
      }
    }
  }, [gameState, currentExperience]);

  const handleStartLearning = () => {
    setGameState("sequential");
    setCurrentGameIndex(0);
    setCurrentExperience(allLearningExperiences[0]);
    setHintsUsed(0);
  };

  const handleStartSequentialLearning = () => {
    setGameState("playing");
    setCurrentGameIndex(0);
    setCurrentExperience(allLearningExperiences[0]);
    setHintsUsed(0);
  };

  const handleExperienceSelect = (experience: LearningExperience) => {
    setCurrentExperience(experience);
    setGameState("playing");
    setHintsUsed(0);
  };

  const handleExperienceComplete = (score: number = 100) => {
    if (currentExperience) {
      let starsEarned = score >= 100 ? 3 : score >= 50 ? 2 : score > 0 ? 1 : 0;
      if (hintsUsed >= 1 && starsEarned > 2) starsEarned = 2;
      if (hintsUsed >= 2 && starsEarned > 1) starsEarned = 1;
      const coinsEarned = starsEarned * 50;
      completeExperience(currentExperience.id, starsEarned, coinsEarned);
      setLastResult({ stars: starsEarned, coins: coinsEarned });
      
      if (gameState === "sequential") {
        // Auto-advance to next game in sequential mode
        handleSequentialNext();
      } else {
        setShowCompletionModal(true);
      }
    }
  };

  const handleSequentialNext = () => {
    if (currentGameIndex < allLearningExperiences.length - 1) {
      const nextIndex = currentGameIndex + 1;
      setCurrentGameIndex(nextIndex);
      setCurrentExperience(allLearningExperiences[nextIndex]);
      setHintsUsed(0);
    } else {
      // All games completed
      toast("🎉 Congratulations! You've completed the entire learning journey!");
      setGameState("learning-path");
      setCurrentExperience(null);
    }
  };

  const handleModalContinue = () => {
    setShowCompletionModal(false);
    if (gameState === "sequential") {
      handleSequentialNext();
    } else {
      setGameState("learning-path");
      setCurrentExperience(null);
    }
  };

  const handleModalRetry = () => {
    setShowCompletionModal(false);
    setHintsUsed(0);
  };

  const handleExperienceCompleteNoScore = () => {
    handleExperienceComplete(100);
  };

  const handleBackToLearningPath = () => {
    setGameState("learning-path");
    setCurrentExperience(null);
  };

  const handleGetHint = async () => {
    if (!currentExperience) return;
    const hints = currentExperience.hints || [];

    if (hintsUsed >= hints.length + 1) {
      setGenieMessage("No more hints available.");
      setIsGenieOpen(true);
      return;
    }

    // Static hints available
    if (hintsUsed < hints.length) {
      const purchased = purchaseHint(currentExperience.id, hintsUsed, HINT_COST);
      if (!purchased) {
        setGenieMessage("Not enough coins for a hint.");
        setIsGenieOpen(true);
        return;
      }
      const hintText = hints[hintsUsed];
      setHintsUsed(prev => prev + 1);
      setGenieMessage(hintText);
      setIsGenieOpen(true);
      return;
    }

    // Fetch model-generated hint
    const purchased = purchaseHint(currentExperience.id, hintsUsed, HINT_COST);
    if (!purchased) {
      setGenieMessage("Not enough coins for a hint.");
      setIsGenieOpen(true);
      return;
    }

    setGenieMessage("🔮 Thinking of a hint for you...");
    setIsGenieOpen(true);
    const modelHint = await getModelHint(currentExperience.id);
    setHintsUsed(hints.length + 1);
    setGenieMessage(modelHint);
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
                🎓 Review Lessons
              </Button>
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <span>Level {level}</span>
                <span className="flex items-center gap-1"><Coins className="w-4 h-4 text-yellow-500" />{coins}</span>
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" />{stars}</span>
              </span>
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
                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                  Think of AI like a well-read parrot: it has seen countless sentences, so when you
                  prompt it, it guesses the words that usually come next.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  onClick={handleStartSequentialLearning}
                  size="lg"
                  className="text-lg px-8 py-4 bg-primary hover:bg-primary/90"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Learning Journey
                </Button>
                <Button 
                  onClick={() => setGameState("learning-path")}
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Review Individual Lessons
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                {allLearningExperiences.length} interactive experiences • All skill levels
              </div>

              {completedExperienceIds.length > 0 && (
                <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="text-primary font-medium">Your Progress</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {completedExperienceIds.length} of {allLearningExperiences.length} experiences completed
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
              <Button variant="ghost" onClick={handleStartSequentialLearning} className="text-sm">
                🎮 Play All Games
              </Button>
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <span>Level {level}</span>
                <span className="flex items-center gap-1"><Coins className="w-4 h-4 text-yellow-500" />{coins}</span>
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" />{stars}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 pt-16 sm:pt-20 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Review Individual Lessons</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Review completed lessons or jump into specific topics. For a guided experience, use "Start Learning Journey" instead.
              </p>
              <Button onClick={handleStartSequentialLearning} className="mb-4">
                <Play className="w-4 h-4 mr-2" />
                Start Sequential Learning Journey
              </Button>
              <div className="flex justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-muted-foreground">{completedExperienceIds.length} Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground">{allLearningExperiences.length - completedExperienceIds.length} Available</span>
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
                      const isCompleted = completedExperienceIds.includes(experience.id);
                      const isLocked = experience.requiredStars !== undefined && stars < experience.requiredStars;

                      const ariaLabel = `${experience.title} - ${experience.difficulty} - ${
                        isLocked
                          ? 'Locked, requires ' + experience.requiredStars + ' stars'
                          : isCompleted
                          ? 'Completed'
                          : 'Not completed'
                      }`;

                      return (
                        <Card
                          key={experience.id}
                          role="button"
                          tabIndex={0}
                          aria-label={ariaLabel}
                          aria-disabled={isLocked}
                          className={`relative transition-all border-2 ${
                            isCompleted
                              ? 'border-green-500 bg-green-50/50'
                              : 'border-border'
                          } ${
                            isLocked
                              ? 'opacity-50 cursor-not-allowed'
                              : 'cursor-pointer hover:shadow-lg hover:border-primary/50'
                          }`}
                          onClick={() => {
                            if (isLocked) {
                              toast('Earn more stars to unlock this lesson.');
                              return;
                            }
                            handleExperienceSelect(experience);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              if (isLocked) {
                                toast('Earn more stars to unlock this lesson.');
                                return;
                              }
                              handleExperienceSelect(experience);
                            }
                          }}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{experience.icon}</span>
                                <div className="flex-1 min-w-0">
                                  <CardTitle className="text-base leading-tight">{experience.title}</CardTitle>
                                </div>
                              </div>
                              {isCompleted && !isLocked && (
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
                                <span className="text-sm font-medium" aria-hidden="true">
                                  {isLocked ? `Requires ⭐${experience.requiredStars}` : isCompleted ? 'Review' : 'Start'}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                <strong>Objective:</strong> {experience.objective}
                              </div>
                            </div>
                          </CardContent>
                          {isLocked && (
                            <div className="absolute inset-0 rounded-lg bg-secondary/80 backdrop-blur-sm flex items-center justify-center">
                              <Lock className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
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
  if ((gameState === "playing" || gameState === "sequential") && currentExperience) {
    const GameComponent = (() => {
      switch (currentExperience.gameComponent) {
        case "PromptBuilderGame": return PromptBuilderGame;
        case "AIIntroGame": return AIIntroGame;
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
    const hintDisabled = coins < HINT_COST || hintsUsed >= (currentExperience.hints?.length ?? 0) + 1;

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
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <span>Level {level}</span>
                <span className="flex items-center gap-1"><Coins className="w-4 h-4 text-yellow-500" />{coins}</span>
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" />{stars}</span>
              </span>
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
            {currentExperience?.id === "what-is-ai" ? (
              <AppSidebar 
                currentStep={1} 
                gameTitle={currentExperience.title}
                showMobileSidebar={showMobileSidebar}
                setShowMobileSidebar={setShowMobileSidebar}
              />
            ) : (
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

                </div>
              </div>
            )}
          </div>

          {/* Main Game Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Sequential Mode Progress Header */}
            {gameState === "sequential" && (
              <div className="p-4 bg-card border-b border-border">
                <div className="text-center space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Game {currentGameIndex + 1} of {allLearningExperiences.length}
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${((currentGameIndex + 1) / allLearningExperiences.length) * 100}%` }}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setGameState("learning-path")}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Review Lessons
                  </Button>
                </div>
              </div>
            )}
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
                lesson={currentExperience}
                onComplete={shouldUseNoScore ? handleExperienceCompleteNoScore : handleExperienceComplete}
                onBack={gameState === "sequential" ? () => setGameState("learning-path") : handleBackToLearningPath}
              />
            </div>
          </div>
        </div>
        <Dialog open={showCompletionModal}>
          <DialogContent className="text-center [&>button]:hidden">
            <DialogHeader>
              <DialogTitle>Lesson Complete!</DialogTitle>
              <DialogDescription aria-live="polite">
                You earned {lastResult.stars} star{lastResult.stars !== 1 ? 's' : ''} and {lastResult.coins} coins.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2" aria-label={`${lastResult.stars} out of 3 stars`}>
                {[0,1,2].map(i => (
                  <Star
                    key={i}
                    fill="currentColor"
                    className={`w-8 h-8 ${i < lastResult.stars ? 'text-yellow-500' : 'text-muted-foreground'} star-pop`}
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1 text-yellow-500 font-semibold coin-pop" style={{ animationDelay: '0.6s' }}>
                <Coins className="w-5 h-5" />
                <span>+{lastResult.coins}</span>
              </div>
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="text-4xl">🧞</span>
                <span>Great job! You earned {lastResult.stars} star{lastResult.stars !== 1 ? 's' : ''}!</span>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button onClick={handleModalContinue} autoFocus>Continue</Button>
              <Button variant="outline" onClick={handleModalRetry}>Retry</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <GenieMentor
          message={genieMessage}
          isOpen={isGenieOpen}
          onClose={() => setIsGenieOpen(false)}
          onGetHint={handleGetHint}
          hintCost={HINT_COST}
          hintDisabled={hintDisabled}
        />
      </div>
    );
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
            <Button variant="ghost" onClick={() => setGameState("welcome")} className="text-sm">
              🏠 Home
            </Button>
            <Button variant="ghost" onClick={() => setGameState("learning-path")} className="text-sm">
              🎓 Review Lessons
            </Button>
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <span>Level {level}</span>
              <span className="flex items-center gap-1"><Coins className="w-4 h-4 text-yellow-500" />{coins}</span>
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" />{stars}</span>
            </span>
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
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Think of AI like a well-read parrot: it has seen countless sentences, so when you
                prompt it, it guesses the words that usually come next.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={handleStartSequentialLearning}
                size="lg"
                className="text-lg px-8 py-4 bg-primary hover:bg-primary/90"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Learning Journey
              </Button>
              <Button 
                onClick={() => setGameState("learning-path")}
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Review Individual Lessons
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {allLearningExperiences.length} interactive experiences • All skill levels
            </div>

            {completedExperienceIds.length > 0 && (
              <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="text-primary font-medium">Your Progress</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {completedExperienceIds.length} of {allLearningExperiences.length} experiences completed
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;