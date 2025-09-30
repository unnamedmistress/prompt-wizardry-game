import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sparkles, Copy, RotateCcw, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PromptComponent {
  id: string;
  label: string;
  placeholder: string;
  example: string;
  optional?: boolean;
}

const PROMPT_COMPONENTS: PromptComponent[] = [
  {
    id: 'role',
    label: 'Role/Persona',
    placeholder: 'Who should the AI act as?',
    example: 'You are an experienced marketing strategist...'
  },
  {
    id: 'task',
    label: 'Task/Goal',
    placeholder: 'What do you want the AI to do?',
    example: 'Help me create a social media content calendar...'
  },
  {
    id: 'context',
    label: 'Context/Background',
    placeholder: 'What context does the AI need?',
    example: 'For a startup launching a productivity app targeting remote workers...',
    optional: true
  },
  {
    id: 'format',
    label: 'Output Format',
    placeholder: 'How should the response be structured?',
    example: 'Provide as a bullet-point list with dates and platform suggestions...',
    optional: true
  },
  {
    id: 'constraints',
    label: 'Constraints/Requirements',
    placeholder: 'What limits or requirements?',
    example: 'Keep posts under 280 characters, focus on LinkedIn and Twitter...',
    optional: true
  },
  {
    id: 'tone',
    label: 'Tone/Style',
    placeholder: 'What tone should the AI use?',
    example: 'Professional but approachable, with occasional humor...',
    optional: true
  }
];

const PROMPT_TEMPLATES = {
  business: {
    role: 'You are a business consultant with 15 years of experience',
    task: 'Analyze the following business scenario and provide strategic recommendations',
    format: 'Structure your response with: 1) Current situation analysis, 2) Key challenges, 3) Recommendations with pros/cons'
  },
  creative: {
    role: 'You are a creative director known for innovative storytelling',
    task: 'Generate creative concepts for the following brief',
    tone: 'Inspiring and imaginative, but grounded in practical execution'
  },
  technical: {
    role: 'You are a senior software architect with expertise in scalable systems',
    task: 'Provide technical guidance on the following implementation',
    format: 'Include code examples, architecture diagrams in text, and best practices'
  },
  research: {
    role: 'You are a research analyst specializing in data-driven insights',
    task: 'Research and synthesize information about the following topic',
    constraints: 'Cite sources, focus on peer-reviewed research, include statistics where relevant'
  }
};

export function EnhancedPromptBuilder() {
  const { toast } = useToast();
  const [components, setComponents] = useState<Record<string, string>>({});
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const updateComponent = (id: string, value: string) => {
    setComponents({ ...components, [id]: value });
  };

  const loadTemplate = (templateKey: string) => {
    const template = PROMPT_TEMPLATES[templateKey as keyof typeof PROMPT_TEMPLATES];
    if (template) {
      setComponents(template);
      setSelectedTemplate(templateKey);
    }
  };

  const buildPrompt = (): string => {
    return PROMPT_COMPONENTS
      .filter(c => components[c.id]?.trim())
      .map(c => components[c.id].trim())
      .join('\n\n');
  };

  const copyPrompt = () => {
    const prompt = buildPrompt();
    navigator.clipboard.writeText(prompt);
    toast({
      title: 'Copied to clipboard!',
      description: 'Your prompt is ready to use',
    });
  };

  const resetBuilder = () => {
    setComponents({});
    setSelectedTemplate('');
  };

  const getPromptScore = (): number => {
    const filledRequired = PROMPT_COMPONENTS.filter(c => !c.optional && components[c.id]?.trim()).length;
    const requiredCount = PROMPT_COMPONENTS.filter(c => !c.optional).length;
    const filledOptional = PROMPT_COMPONENTS.filter(c => c.optional && components[c.id]?.trim()).length;
    const optionalCount = PROMPT_COMPONENTS.filter(c => c.optional).length;
    
    const requiredScore = (filledRequired / requiredCount) * 70;
    const optionalScore = (filledOptional / optionalCount) * 30;
    
    return Math.round(requiredScore + optionalScore);
  };

  const score = getPromptScore();
  const finalPrompt = buildPrompt();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            Interactive Prompt Builder
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Craft perfect prompts with guided components
          </p>
        </div>

        <div className="flex gap-2">
          <Select value={selectedTemplate} onValueChange={loadTemplate}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Load template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="research">Research</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={resetBuilder}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Prompt Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {PROMPT_COMPONENTS.map((component, index) => (
          <motion.div
            key={component.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    {component.label}
                    {!component.optional && (
                      <Badge variant="secondary" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </Label>
                  
                  {component.optional && (
                    <Badge variant="outline" className="text-xs">
                      Optional
                    </Badge>
                  )}
                </div>

                <Textarea
                  placeholder={component.placeholder}
                  value={components[component.id] || ''}
                  onChange={(e) => updateComponent(component.id, e.target.value)}
                  className="min-h-[100px] resize-none"
                />

                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>Example: {component.example}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Output Preview */}
      <Card className="p-6 bg-gradient-card border-primary/30">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold">Your Prompt</h3>
              <Badge 
                variant={score >= 70 ? 'default' : 'secondary'}
                className="text-sm"
              >
                {score}% Complete
              </Badge>
            </div>

            <Button onClick={copyPrompt} disabled={!finalPrompt}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Prompt
            </Button>
          </div>

          {finalPrompt ? (
            <div className="bg-background/50 p-4 rounded-lg border border-border">
              <pre className="text-sm whitespace-pre-wrap font-mono text-foreground">
                {finalPrompt}
              </pre>
            </div>
          ) : (
            <div className="bg-muted/30 p-8 rounded-lg border border-dashed border-border text-center">
              <p className="text-muted-foreground">
                Start filling out the components above to build your prompt
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
