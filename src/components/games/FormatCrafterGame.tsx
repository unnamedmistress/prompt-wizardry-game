import React, { useState } from 'react';
import type { LearningExperience } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, FileText, Table, List, BarChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FormatCrafterGameProps {
  onComplete: () => void;
  lesson: LearningExperience;
}

const FormatCrafterGame: React.FC<FormatCrafterGameProps> = ({ lesson, onComplete }) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [selectedContent, setSelectedContent] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState<string>('');
  const [showResult, setShowResult] = useState(false);

  const formats = [
    { id: 'table', name: 'Table Format', icon: Table, description: 'Organized rows and columns' },
    { id: 'list', name: 'Numbered List', icon: List, description: 'Sequential steps or items' },
    { id: 'script', name: 'Email Script', icon: FileText, description: 'Professional email template' },
    { id: 'chart', name: 'Data Summary', icon: BarChart, description: 'Key metrics and insights' }
  ];

  const contents = [
    { id: 'meeting', name: 'Team Meeting Agenda', description: 'Quarterly planning session' },
    { id: 'report', name: 'Project Status Report', description: 'Weekly progress update' },
    { id: 'proposal', name: 'Budget Proposal', description: 'New software purchase request' },
    { id: 'training', name: 'Training Schedule', description: 'Employee skill development plan' }
  ];

  const tones = [
    { id: 'formal', name: 'Formal Business', description: 'Professional and structured' },
    { id: 'friendly', name: 'Friendly Professional', description: 'Approachable but business-like' },
    { id: 'concise', name: 'Concise & Direct', description: 'Brief and to the point' },
    { id: 'detailed', name: 'Comprehensive', description: 'Thorough with explanations' }
  ];

  const generatePrompt = () => {
    const format = formats.find(f => f.id === selectedFormat);
    const content = contents.find(c => c.id === selectedContent);
    const tone = tones.find(t => t.id === selectedTone);

    return `You are a professional office manager. Create a ${format?.name.toLowerCase()} for a ${content?.name.toLowerCase()}. Use a ${tone?.name.toLowerCase()} tone. Format the output as a clear ${format?.description.toLowerCase()} that can be easily shared with the team.`;
  };

  const handleComplete = () => {
    if (selectedFormat && selectedContent && selectedTone) {
      setShowResult(true);
      setTimeout(() => onComplete(), 2000);
    }
  };

  const isComplete = selectedFormat && selectedContent && selectedTone;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">Office Format Master</CardTitle>
          <CardDescription className="text-lg">
            Transform messy information into professional business formats
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Format Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">1. Choose Output Format</CardTitle>
            <CardDescription>How should the information be structured?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {formats.map((format) => (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                  selectedFormat === format.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <format.icon className="w-5 h-5" />
                  <div>
                    <div className="font-medium">{format.name}</div>
                    <div className="text-sm text-muted-foreground">{format.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Content Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. Select Content Type</CardTitle>
            <CardDescription>What information needs formatting?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {contents.map((content) => (
              <button
                key={content.id}
                onClick={() => setSelectedContent(content.id)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                  selectedContent === content.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-medium">{content.name}</div>
                <div className="text-sm text-muted-foreground">{content.description}</div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Tone Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">3. Pick Communication Style</CardTitle>
            <CardDescription>What tone fits your audience?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tones.map((tone) => (
              <button
                key={tone.id}
                onClick={() => setSelectedTone(tone.id)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                  selectedTone === tone.id
                    ? 'border-primary bg-primary/10 text-primary'
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

      {/* Generated Prompt Preview */}
      {isComplete && (
        <Card className="border-2 border-green-500/20 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-lg text-green-700">Your Professional Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-background p-4 rounded-lg border">
              <code className="text-sm">{generatePrompt()}</code>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              This prompt will generate professional, well-formatted business documents!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {showResult && (
        <Card className="border-2 border-green-500 bg-green-50">
          <CardContent className="text-center p-6">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800 mb-2">Format Mastered!</h3>
            <p className="text-green-700">You've learned how to structure AI output for professional business communication!</p>
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
          {isComplete ? "Generate Professional Format" : "Complete All Selections"}
        </Button>
      </div>
    </div>
  );
};

export default FormatCrafterGame;