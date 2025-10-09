import React, { useState } from 'react';
import type { LearningExperience } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Eye, User, Lightbulb, Camera } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PerspectiveShifterGameProps {
  onComplete: () => void;
  lesson: LearningExperience;
}

const PerspectiveShifterGame: React.FC<PerspectiveShifterGameProps> = ({ lesson, onComplete }) => {
  const [selectedPerspective, setSelectedPerspective] = useState<string>('');
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [selectedFocus, setSelectedFocus] = useState<string>('');
  const [showResult, setShowResult] = useState(false);

  const perspectives = [
    { 
      id: 'director', 
      name: 'Film Director', 
      icon: Camera, 
      description: 'Creative visionary focused on storytelling',
      voice: 'Think about visual storytelling, character development, and emotional impact'
    },
    { 
      id: 'critic', 
      name: 'Movie Critic', 
      icon: Eye, 
      description: 'Analytical reviewer with high standards',
      voice: 'Focus on technical craft, narrative structure, and cultural significance'
    },
    { 
      id: 'audience', 
      name: 'Casual Viewer', 
      icon: User, 
      description: 'Entertainment-seeking moviegoer',
      voice: 'Consider what\'s fun, engaging, and easy to follow'
    },
    { 
      id: 'producer', 
      name: 'Studio Producer', 
      icon: Lightbulb, 
      description: 'Business-minded creative executive',
      voice: 'Think about market appeal, budget considerations, and commercial success'
    }
  ];

  const scenarios = [
    { 
      id: 'superhero', 
      name: 'Superhero Movie Review', 
      description: 'Latest Marvel/DC blockbuster film',
      context: 'a superhero blockbuster with stunning visuals but a predictable plot'
    },
    { 
      id: 'indie', 
      name: 'Independent Drama', 
      description: 'Small-budget character study',
      context: 'an independent drama with brilliant acting but slow pacing'
    },
    { 
      id: 'horror', 
      name: 'Horror Thriller', 
      description: 'Psychological horror film',
      context: 'a psychological horror film with innovative scares but minimal character development'
    },
    { 
      id: 'comedy', 
      name: 'Romantic Comedy', 
      description: 'Feel-good romantic film',
      context: 'a romantic comedy with great chemistry between leads but familiar storyline'
    }
  ];

  const focuses = [
    { 
      id: 'positive', 
      name: 'Highlight Strengths', 
      description: 'Emphasize what works well',
      approach: 'Focus on the positive aspects and what makes this film worth watching'
    },
    { 
      id: 'constructive', 
      name: 'Constructive Analysis', 
      description: 'Balanced view with improvements',
      approach: 'Provide balanced feedback with specific suggestions for improvement'
    },
    { 
      id: 'comparative', 
      name: 'Compare to Others', 
      description: 'Reference similar films',
      approach: 'Compare this film to others in the genre and explain how it stands out'
    },
    { 
      id: 'audience-specific', 
      name: 'Target Audience Focus', 
      description: 'Who would enjoy this most',
      approach: 'Identify the ideal audience and explain why they would connect with this film'
    }
  ];

  const generatePrompt = () => {
    const perspective = perspectives.find(p => p.id === selectedPerspective);
    const scenario = scenarios.find(s => s.id === selectedScenario);
    const focus = focuses.find(f => f.id === selectedFocus);

    return `You are a ${perspective?.name.toLowerCase()} reviewing ${scenario?.context}. ${perspective?.voice}. Write your review with this approach: ${focus?.approach}. Keep the tone authentic to how a ${perspective?.name.toLowerCase()} would actually speak and what they would prioritize in their analysis.`;
  };

  const handleComplete = () => {
    if (selectedPerspective && selectedScenario && selectedFocus) {
      setShowResult(true);
      setTimeout(() => onComplete(), 2000);
    }
  };

  const isComplete = selectedPerspective && selectedScenario && selectedFocus;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">Hollywood Perspective Shifter</CardTitle>
          <CardDescription className="text-lg">
            Learn how different viewpoints transform AI responses by writing movie reviews from various perspectives
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Perspective Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="w-5 h-5" />
              1. Choose Perspective
            </CardTitle>
            <CardDescription>Who is writing this review?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {perspectives.map((perspective) => (
              <button
                key={perspective.id}
                onClick={() => setSelectedPerspective(perspective.id)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedPerspective === perspective.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <perspective.icon className="w-5 h-5 mt-1" />
                  <div>
                    <div className="font-medium">{perspective.name}</div>
                    <div className="text-sm text-muted-foreground mb-2">{perspective.description}</div>
                    <div className="text-xs italic">"{perspective.voice}"</div>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Scenario Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. Pick Movie Type</CardTitle>
            <CardDescription>What kind of film are they reviewing?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario.id)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedScenario === scenario.id
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-medium">{scenario.name}</div>
                <div className="text-sm text-muted-foreground mb-2">{scenario.description}</div>
                <div className="text-xs italic">Reviewing: {scenario.context}</div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Focus Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">3. Set Review Focus</CardTitle>
            <CardDescription>What angle should they take?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {focuses.map((focus) => (
              <button
                key={focus.id}
                onClick={() => setSelectedFocus(focus.id)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedFocus === focus.id
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-medium">{focus.name}</div>
                <div className="text-sm text-muted-foreground mb-2">{focus.description}</div>
                <div className="text-xs italic">{focus.approach}</div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Perspective Lens Visualization */}
      {isComplete && (
        <Card className="border-2 border-amber-500/20 bg-gradient-to-br from-amber-50 to-orange-50 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg text-amber-700 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Perspective Lens Active
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Lens view simulation */}
            <div className="relative p-6 bg-background rounded-lg border-4 border-amber-300">
              <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
              <div className="absolute top-2 right-2 text-xs text-amber-600 font-mono">REC ●</div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    {React.createElement(perspectives.find(p => p.id === selectedPerspective)?.icon || Camera, { className: "w-6 h-6 text-blue-600" })}
                  </div>
                  <div>
                    <div className="font-bold text-blue-700">
                      {perspectives.find(p => p.id === selectedPerspective)?.name}
                    </div>
                    <div className="text-xs text-muted-foreground italic">
                      "{perspectives.find(p => p.id === selectedPerspective)?.voice}"
                    </div>
                  </div>
                </div>
                
                <div className="h-px bg-border" />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-purple-50 rounded border border-purple-200">
                    <div className="font-medium text-purple-700 mb-1">Reviewing</div>
                    <div className="text-xs">{scenarios.find(s => s.id === selectedScenario)?.name}</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded border border-green-200">
                    <div className="font-medium text-green-700 mb-1">Focus</div>
                    <div className="text-xs">{focuses.find(f => f.id === selectedFocus)?.name}</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-amber-600 font-mono">
                PERSPECTIVE LOCKED
              </div>
            </div>
            
            <div className="text-xs text-center text-muted-foreground italic">
              The same movie seen through different eyes tells a completely different story
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Prompt */}
      {isComplete && (
        <Card className="border-2 border-green-500/20 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-lg text-green-700">Your Perspective-Shifting Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-background p-4 rounded-lg border">
              <code className="text-sm">{generatePrompt()}</code>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              This prompt will generate a review that authentically captures the chosen perspective's voice and priorities!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {showResult && (
        <Card className="border-2 border-green-500 bg-green-50">
          <CardContent className="text-center p-6">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800 mb-2">Perspective Mastered!</h3>
            <p className="text-green-700">You've learned how different viewpoints completely transform AI responses!</p>
          </CardContent>
        </Card>
      )}

      {/* Complete Button */}
      <div className="text-center">
        <Button 
          onClick={handleComplete}
          disabled={!isComplete}
          size="lg"
          className="bg-primary hover:bg-primary/90"
        >
          {isComplete ? "Generate Review from Perspective" : "Complete All Selections"}
        </Button>
      </div>
    </div>
  );
};

export default PerspectiveShifterGame;