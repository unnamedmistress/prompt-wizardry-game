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
    { id: 'list', name: 'Numbered List', icon: List, description: 'Step-by-step items' },
    { id: 'script', name: 'Email Script', icon: FileText, description: 'Professional email template' },
    { id: 'chart', name: 'Data Summary', icon: BarChart, description: 'Key facts and numbers' }
  ];

  const contents = [
    { id: 'meeting', name: 'Team Meeting Agenda', description: 'Planning session topics' },
    { id: 'report', name: 'Project Status Report', description: 'Weekly progress update' },
    { id: 'proposal', name: 'Budget Proposal', description: 'New software purchase request' },
    { id: 'training', name: 'Training Schedule', description: 'Employee skill development plan' }
  ];

  const tones = [
    { id: 'formal', name: 'Formal Business', description: 'Professional and proper' },
    { id: 'friendly', name: 'Friendly Professional', description: 'Nice but business-like' },
    { id: 'concise', name: 'Short & Direct', description: 'Brief and to the point' },
    { id: 'detailed', name: 'Complete', description: 'Thorough with explanations' }
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
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">📄 Format Crafter</CardTitle>
          <CardDescription className="text-lg font-semibold text-foreground mb-3">Professional Communication</CardDescription>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              The same information can look messy or professional depending on how it's formatted. AI can organize information in different ways based on how you ask.
            </p>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2">Your Mission</h4>
              <p>Learn how to tell AI exactly what format you want for professional business documents.</p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Activity</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>Pick the best format for organizing information.</li>
                <li>Choose what type of document you need to create.</li>
                <li>Select the right tone for your audience.</li>
              </ol>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Format Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-foreground">1. Choose Output Format</CardTitle>
                <CardDescription>How should the information be organized?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {formats.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                      selectedFormat === format.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50 text-foreground'
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
                <CardTitle className="text-lg text-foreground">2. Select Content Type</CardTitle>
                <CardDescription>What kind of document do you need?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {contents.map((content) => (
                  <button
                    key={content.id}
                    onClick={() => setSelectedContent(content.id)}
                    className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                      selectedContent === content.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50 text-foreground'
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
                <CardTitle className="text-lg text-foreground">3. Pick Communication Style</CardTitle>
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
                        : 'border-border hover:border-primary/50 text-foreground'
                    }`}
                  >
                    <div className="font-medium">{tone.name}</div>
                    <div className="text-sm text-muted-foreground">{tone.description}</div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Live Document Preview */}
          {isComplete && (
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-blue-50 to-purple-50 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg text-primary flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Live Document Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mock document preview */}
                <div className="bg-white p-6 rounded-lg border-2 border-primary/20 shadow-lg">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="font-bold text-lg">
                        {contents.find(c => c.id === selectedContent)?.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    
                    {selectedFormat === 'table' && (
                      <div className="border rounded overflow-hidden">
                        <div className="grid grid-cols-3 gap-0">
                          <div className="bg-muted p-2 border-b font-semibold text-sm">Item</div>
                          <div className="bg-muted p-2 border-b border-l font-semibold text-sm">Details</div>
                          <div className="bg-muted p-2 border-b border-l font-semibold text-sm">Status</div>
                          <div className="p-2 text-sm">Task 1</div>
                          <div className="p-2 border-l text-sm">Description</div>
                          <div className="p-2 border-l text-sm">✓ Complete</div>
                        </div>
                      </div>
                    )}
                    
                    {selectedFormat === 'list' && (
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>First agenda item with details...</li>
                        <li>Second important topic...</li>
                        <li>Action items and next steps...</li>
                      </ol>
                    )}
                    
                    {selectedFormat === 'script' && (
                      <div className="space-y-2 text-sm">
                        <p><strong>Subject:</strong> {contents.find(c => c.id === selectedContent)?.name}</p>
                        <p><strong>Dear Team,</strong></p>
                        <p className="ml-4">Email content structured professionally...</p>
                        <p className="ml-4">Best regards,</p>
                      </div>
                    )}
                    
                    {selectedFormat === 'chart' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-24 text-sm font-medium">Progress:</div>
                          <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                            <div className="h-full w-3/4 bg-primary" />
                          </div>
                          <span className="text-sm">75%</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2 bg-blue-50 rounded"><div className="text-2xl font-bold">12</div><div className="text-xs">Total</div></div>
                          <div className="p-2 bg-green-50 rounded"><div className="text-2xl font-bold">9</div><div className="text-xs">Done</div></div>
                          <div className="p-2 bg-amber-50 rounded"><div className="text-2xl font-bold">3</div><div className="text-xs">Pending</div></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-background p-4 rounded-lg border">
                  <div className="text-xs text-muted-foreground mb-2">Generated Prompt:</div>
                  <code className="text-sm text-foreground">{generatePrompt()}</code>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {showResult && (
            <Card className="border-2 border-green-500 bg-green-50">
              <CardContent className="text-center p-6">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">Format Mastered!</h3>
                <p className="text-green-700">You've learned how to make AI create professional business documents!</p>
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
              {isComplete ? "Create Professional Format" : "Complete All Selections"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormatCrafterGame;