import React, { useState } from 'react';
import type { LearningExperience } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, BookOpen, Users, Zap, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StoryEngineGameProps {
  onComplete: () => void;
  lesson: LearningExperience;
}

const StoryEngineGame: React.FC<StoryEngineGameProps> = ({ lesson, onComplete }) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedStructure, setSelectedStructure] = useState<string>('');
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [selectedTone, setSelectedTone] = useState<string>('');
  const [showResult, setShowResult] = useState(false);

  const genres = [
    { 
      id: 'mystery', 
      name: 'Mystery Detective', 
      icon: BookOpen, 
      description: 'Crime-solving adventure',
      prompt: 'a mystery story where students must solve a case'
    },
    { 
      id: 'sci-fi', 
      name: 'Science Fiction', 
      icon: Zap, 
      description: 'Futuristic technology tale',
      prompt: 'a science fiction story set in a school of the future'
    },
    { 
      id: 'friendship', 
      name: 'Friendship Drama', 
      icon: Heart, 
      description: 'Relationship and growth story',
      prompt: 'a heartwarming story about unlikely friendships at school'
    },
    { 
      id: 'adventure', 
      name: 'School Adventure', 
      icon: Users, 
      description: 'Exciting quest or journey',
      prompt: 'an adventure story where students discover something extraordinary'
    }
  ];

  const structures = [
    { 
      id: 'three-act', 
      name: 'Three-Act Structure', 
      description: 'Setup → Confrontation → Resolution',
      framework: 'Use a three-act structure: Setup (introduce characters and problem), Confrontation (develop conflict and obstacles), Resolution (solve problem and show growth)'
    },
    { 
      id: 'heros-journey', 
      name: 'Hero\'s Journey', 
      description: 'Call to adventure → Transformation → Return',
      framework: 'Follow the hero\'s journey: Ordinary world, call to adventure, meeting mentor, facing trials, transformation, and return with wisdom'
    },
    { 
      id: 'problem-solution', 
      name: 'Problem-Solution', 
      description: 'Challenge identified → Attempts → Success',
      framework: 'Structure as problem-solution: Present clear challenge, show multiple attempts to solve it, leading to creative resolution'
    },
    { 
      id: 'character-growth', 
      name: 'Character Arc', 
      description: 'Flaw revealed → Struggle → Growth',
      framework: 'Focus on character development: Reveal character flaw or weakness, put them through challenges that force growth, show transformation'
    }
  ];

  const elements = [
    { 
      id: 'dialogue', 
      name: 'Realistic Dialogue', 
      description: 'Natural student conversations',
      instruction: 'Include realistic dialogue that sounds like how students actually talk'
    },
    { 
      id: 'setting', 
      name: 'Vivid Setting', 
      description: 'Detailed school environment',
      instruction: 'Create vivid descriptions of school locations (classroom, hallway, cafeteria, etc.)'
    },
    { 
      id: 'conflict', 
      name: 'Internal Conflict', 
      description: 'Character\'s inner struggle',
      instruction: 'Include internal conflict where characters struggle with personal decisions or fears'
    },
    { 
      id: 'plot-twist', 
      name: 'Plot Twist', 
      description: 'Unexpected revelation',
      instruction: 'Include a surprising plot twist that changes everything the reader thought they knew'
    },
    { 
      id: 'symbolism', 
      name: 'Symbolic Element', 
      description: 'Object with deeper meaning',
      instruction: 'Include a symbolic object or element that represents the story\'s deeper theme'
    }
  ];

  const tones = [
    { 
      id: 'inspiring', 
      name: 'Inspiring & Uplifting', 
      description: 'Motivational and hopeful',
      voice: 'Write with an inspiring and uplifting tone that motivates readers'
    },
    { 
      id: 'humorous', 
      name: 'Light & Humorous', 
      description: 'Fun with gentle comedy',
      voice: 'Use a light, humorous tone with funny moments and witty observations'
    },
    { 
      id: 'dramatic', 
      name: 'Dramatic & Emotional', 
      description: 'Intense and moving',
      voice: 'Create drama and emotional depth that makes readers feel deeply invested'
    },
    { 
      id: 'suspenseful', 
      name: 'Suspenseful & Engaging', 
      description: 'Tension and anticipation',
      voice: 'Build suspense and tension that keeps readers on the edge of their seats'
    }
  ];

  const toggleElement = (id: string) => {
    setSelectedElements(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const generatePrompt = () => {
    const genre = genres.find(g => g.id === selectedGenre);
    const structure = structures.find(s => s.id === selectedStructure);
    const tone = tones.find(t => t.id === selectedTone);
    const elementInstructions = elements
      .filter(e => selectedElements.includes(e.id))
      .map(e => e.instruction);

    return `You are a creative writing teacher helping students craft engaging stories. Write ${genre?.prompt} for a creative writing assignment. ${structure?.framework}. ${tone?.voice}. ${elementInstructions.join('. ')}. Make it approximately 500 words and suitable for high school students to read and learn from.`;
  };

  const handleComplete = () => {
    if (selectedGenre && selectedStructure && selectedElements.length > 0 && selectedTone) {
      setShowResult(true);
      setTimeout(() => onComplete(), 2000);
    }
  };

  const isComplete = selectedGenre && selectedStructure && selectedElements.length > 0 && selectedTone;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">Creative Story Engine</CardTitle>
          <CardDescription className="text-lg">
            Build compelling narrative prompts by combining genre, structure, elements, and tone
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Genre Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              1. Choose Genre
            </CardTitle>
            <CardDescription>What type of story?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                  selectedGenre === genre.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <genre.icon className="w-5 h-5" />
                  <div>
                    <div className="font-medium">{genre.name}</div>
                    <div className="text-sm text-muted-foreground">{genre.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Structure Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. Pick Structure</CardTitle>
            <CardDescription>How should it be organized?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {structures.map((structure) => (
              <button
                key={structure.id}
                onClick={() => setSelectedStructure(structure.id)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                  selectedStructure === structure.id
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-medium">{structure.name}</div>
                <div className="text-sm text-muted-foreground">{structure.description}</div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Elements Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">3. Add Elements</CardTitle>
            <CardDescription>What literary devices to include?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {elements.map((element) => (
              <button
                key={element.id}
                onClick={() => toggleElement(element.id)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                  selectedElements.includes(element.id)
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-medium">{element.name}</div>
                <div className="text-sm text-muted-foreground">{element.description}</div>
              </button>
            ))}
            <p className="text-xs text-muted-foreground">Select multiple elements</p>
          </CardContent>
        </Card>

        {/* Tone Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">4. Set Tone</CardTitle>
            <CardDescription>What mood and voice?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tones.map((tone) => (
              <button
                key={tone.id}
                onClick={() => setSelectedTone(tone.id)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                  selectedTone === tone.id
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-medium">{tone.name}</div>
                <div className="text-sm text-muted-foreground">{tone.description}</div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Story Recipe */}
      {isComplete && (
        <Card className="border-2 border-amber-500/20 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="text-lg text-amber-700">Your Story Recipe</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-700">Genre: </span>
              {genres.find(g => g.id === selectedGenre)?.name}
            </div>
            <div>
              <span className="font-medium text-green-700">Structure: </span>
              {structures.find(s => s.id === selectedStructure)?.name}
            </div>
            <div>
              <span className="font-medium text-purple-700">Elements: </span>
              {selectedElements.map(id => elements.find(e => e.id === id)?.name).join(', ')}
            </div>
            <div>
              <span className="font-medium text-orange-700">Tone: </span>
              {tones.find(t => t.id === selectedTone)?.name}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Prompt */}
      {isComplete && (
        <Card className="border-2 border-green-500/20 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-lg text-green-700">Your Story Engine Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-background p-4 rounded-lg border">
              <code className="text-sm">{generatePrompt()}</code>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              This prompt combines all elements to create a compelling, well-structured narrative!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {showResult && (
        <Card className="border-2 border-green-500 bg-green-50">
          <CardContent className="text-center p-6">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800 mb-2">Story Engine Mastered!</h3>
            <p className="text-green-700">You've learned how to build narrative prompts with plot, structure, and tone!</p>
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
          {isComplete ? "Generate Your Story" : "Complete All Selections"}
        </Button>
      </div>
    </div>
  );
};

export default StoryEngineGame;