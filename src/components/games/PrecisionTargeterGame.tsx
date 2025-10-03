import React, { useState } from 'react';
import type { LearningExperience } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Target, Activity, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PrecisionTargeterGameProps {
  onComplete: () => void;
  lesson: LearningExperience;
}

const PrecisionTargeterGame: React.FC<PrecisionTargeterGameProps> = ({ lesson, onComplete }) => {
  const [selectedConstraints, setSelectedConstraints] = useState<string[]>([]);
  const [selectedDelimiters, setSelectedDelimiters] = useState<string[]>([]);
  const [selectedScope, setSelectedScope] = useState<string>('');
  const [showResult, setShowResult] = useState(false);

  const constraints = [
    { id: 'word-limit', name: 'Word Limit', icon: Target, description: 'Exactly 50 words', value: 'in exactly 50 words' },
    { id: 'time-frame', name: 'Time Constraint', icon: Clock, description: '5-minute routine', value: 'for a 5-minute morning routine' },
    { id: 'skill-level', name: 'Skill Level', icon: Activity, description: 'Beginner-friendly', value: 'suitable for complete beginners' },
    { id: 'safety-focus', name: 'Safety Priority', icon: AlertTriangle, description: 'Include safety warnings', value: 'with important safety warnings highlighted' }
  ];

  const delimiters = [
    { id: 'numbered', name: 'Numbered Steps', description: '1. 2. 3. format', value: 'Format as numbered steps (1. 2. 3.)' },
    { id: 'sections', name: 'Clear Sections', description: 'WARMUP: EXERCISE: COOLDOWN:', value: 'Use sections: WARMUP:, MAIN EXERCISE:, COOLDOWN:' },
    { id: 'duration', name: 'Time Brackets', description: '[30 seconds] timing', value: 'Include duration in brackets [30 seconds]' },
    { id: 'difficulty', name: 'Difficulty Tags', description: '(Easy) (Medium) tags', value: 'Tag difficulty level (Easy), (Medium), (Hard)' }
  ];

  const scopes = [
    { id: 'core-strength', name: 'Core Strengthening', description: 'Focus only on abdominal exercises' },
    { id: 'flexibility', name: 'Morning Flexibility', description: 'Stretching and mobility only' },
    { id: 'cardio-burst', name: 'Quick Cardio', description: 'Heart rate boosting exercises' },
    { id: 'posture-fix', name: 'Posture Improvement', description: 'Desk worker posture correction' }
  ];

  const toggleConstraint = (id: string) => {
    setSelectedConstraints(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleDelimiter = (id: string) => {
    setSelectedDelimiters(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const generatePrompt = () => {
    const selectedConstraintValues = constraints
      .filter(c => selectedConstraints.includes(c.id))
      .map(c => c.value);
    
    const selectedDelimiterValues = delimiters
      .filter(d => selectedDelimiters.includes(d.id))
      .map(d => d.value);
    
    const scope = scopes.find(s => s.id === selectedScope);

    return `You are a certified fitness trainer specializing in home workouts. Create a ${scope?.name.toLowerCase()} routine ${selectedConstraintValues.join(', ')}. ${selectedDelimiterValues.join('. ')}. Focus specifically on ${scope?.description.toLowerCase()} and nothing else.`;
  };

  const handleComplete = () => {
    if (selectedConstraints.length > 0 && selectedDelimiters.length > 0 && selectedScope) {
      setShowResult(true);
      setTimeout(() => onComplete(), 2000);
    }
  };

  const isComplete = selectedConstraints.length > 0 && selectedDelimiters.length > 0 && selectedScope;

  // Calculate precision score
  const precisionScore = (selectedConstraints.length * 25) + (selectedDelimiters.length * 15) + (selectedScope ? 40 : 0);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary flex items-center justify-center gap-2">
            <Target className="w-6 h-6" />
            Fitness Precision Trainer
          </CardTitle>
          <CardDescription className="text-lg">
            Use exact constraints and delimiters to get perfectly targeted workout routines
          </CardDescription>
          
          {/* Bullseye Target Visualization */}
          {(selectedConstraints.length > 0 || selectedDelimiters.length > 0 || selectedScope) && (
            <div className="mt-4 flex items-center justify-center gap-8">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full border-4 border-red-300 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-4 border-amber-300 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-4 border-green-300 flex items-center justify-center">
                      <div className={`w-8 h-8 rounded-full transition-all ${
                        precisionScore >= 80 ? 'bg-green-500 animate-pulse' :
                        precisionScore >= 50 ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}>
                        <div className="w-full h-full rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {precisionScore}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Target className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-primary transition-all ${
                  precisionScore >= 80 ? 'scale-150' : 'scale-100'
                }`} />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium">Precision Score</div>
                <div className="text-3xl font-bold text-primary">{precisionScore}%</div>
                <div className="text-xs text-muted-foreground">
                  {precisionScore >= 80 ? '🎯 Bullseye!' :
                   precisionScore >= 50 ? '👍 Good aim' :
                   '🎯 Keep targeting'}
                </div>
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Constraints */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5" />
              1. Add Constraints
            </CardTitle>
            <CardDescription>Set specific limits and requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {constraints.map((constraint) => (
              <button
                key={constraint.id}
                onClick={() => toggleConstraint(constraint.id)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                  selectedConstraints.includes(constraint.id)
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <constraint.icon className="w-5 h-5" />
                  <div>
                    <div className="font-medium">{constraint.name}</div>
                    <div className="text-sm text-muted-foreground">{constraint.description}</div>
                  </div>
                </div>
              </button>
            ))}
            <p className="text-xs text-muted-foreground">Select multiple constraints</p>
          </CardContent>
        </Card>

        {/* Delimiters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. Choose Delimiters</CardTitle>
            <CardDescription>Structure how the output is formatted</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {delimiters.map((delimiter) => (
              <button
                key={delimiter.id}
                onClick={() => toggleDelimiter(delimiter.id)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                  selectedDelimiters.includes(delimiter.id)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-medium">{delimiter.name}</div>
                <div className="text-sm text-muted-foreground">{delimiter.description}</div>
              </button>
            ))}
            <p className="text-xs text-muted-foreground">Select multiple delimiters</p>
          </CardContent>
        </Card>

        {/* Scope */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">3. Define Scope</CardTitle>
            <CardDescription>Narrow the focus for precision</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {scopes.map((scope) => (
              <button
                key={scope.id}
                onClick={() => setSelectedScope(scope.id)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                  selectedScope === scope.id
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-medium">{scope.name}</div>
                <div className="text-sm text-muted-foreground">{scope.description}</div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Selection Summary */}
      {(selectedConstraints.length > 0 || selectedDelimiters.length > 0 || selectedScope) && (
        <Card className="border-2 border-amber-500/20 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="text-lg text-amber-700">Your Precision Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {selectedConstraints.length > 0 && (
              <div>
                <span className="font-medium text-green-700">Constraints: </span>
                {selectedConstraints.map(id => constraints.find(c => c.id === id)?.name).join(', ')}
              </div>
            )}
            {selectedDelimiters.length > 0 && (
              <div>
                <span className="font-medium text-blue-700">Delimiters: </span>
                {selectedDelimiters.map(id => delimiters.find(d => d.id === id)?.name).join(', ')}
              </div>
            )}
            {selectedScope && (
              <div>
                <span className="font-medium text-purple-700">Scope: </span>
                {scopes.find(s => s.id === selectedScope)?.name}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Generated Prompt */}
      {isComplete && (
        <Card className="border-2 border-green-500/20 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-lg text-green-700">Your Precision Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-background p-4 rounded-lg border">
              <code className="text-sm">{generatePrompt()}</code>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              This prompt uses precise constraints and delimiters for targeted results!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {showResult && (
        <Card className="border-2 border-green-500 bg-green-50">
          <CardContent className="text-center p-6">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800 mb-2">Precision Achieved!</h3>
            <p className="text-green-700">You've mastered using constraints and delimiters for laser-focused AI responses!</p>
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
          {isComplete ? "Execute Precision Prompt" : "Complete All Selections"}
        </Button>
      </div>
    </div>
  );
};

export default PrecisionTargeterGame;