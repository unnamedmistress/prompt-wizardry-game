import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, RotateCcw, ArrowLeft, ThumbsUp, ThumbsDown, Minus, Loader2 } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

interface PromptBuilderGameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

interface PromptElement {
  id: string;
  text: string;
  type: string;
  category: string;
}

interface ToneOption {
  id: string;
  name: string;
  example: string;
}

const level1Elements: PromptElement[] = [
  { id: '1', text: 'You are a helpful assistant.', type: 'role', category: 'Role' },
  { id: '2', text: 'Write an email to my boss.', type: 'task', category: 'Task' },
  { id: '3', text: "I'm sick today and need to call out.", type: 'context', category: 'Context' },
  { id: '4', text: 'Use a professional tone.', type: 'tone', category: 'Tone' },
];

const correctOrder = ['1', '2', '3', '4'];

const toneOptions: ToneOption[] = [
  { 
    id: 'professional', 
    name: 'Professional', 
    example: `Subject: Sick Day Notification

Hi [Boss's Name],

I'm not feeling well today and won't be able to come into work. I'll rest and plan to return tomorrow.

Thank you for your understanding,
[Your Name]`
  },
  { 
    id: 'angry', 
    name: 'Angry', 
    example: `Subject: Out Sick

I'm sick today and won't be coming in. I've been pushing through work nonstop, and now my health is paying the price.

[Your Name]`
  },
  { 
    id: 'casual', 
    name: 'Casual', 
    example: `Hey [Boss's Name],

Just wanted to give you a heads up I'm feeling under the weather today and won't make it in. Hoping to be back tomorrow.

Thanks,
[Your Name]`
  },
  { 
    id: 'compelling', 
    name: 'Compelling', 
    example: `Subject: Sick Day Request

Hi [Boss's Name],

I wanted to reach out because I'm not feeling well today and it's best for me and the team if I stay home. This way I won't risk anyone else getting sick.

I'll rest up and aim to be back tomorrow.

Best,
[Your Name]`
  },
  { 
    id: 'persuasive', 
    name: 'Persuasive', 
    example: `Subject: Sick Day Request

Hi [Boss's Name],

I strongly believe it's in the company's best interest for me to stay home today, as I don't want to compromise productivity by spreading illness to the team.

Please approve my sick day and I'll ensure to catch up as soon as I return.

Thank you,
[Your Name]`
  }
];

const communityResults = {
  professional: 70,
  casual: 20,
  persuasive: 10,
  compelling: 0,
  angry: 0
};

const baseEmail = `Hi [Boss's Name],

I wanted to let you know that I'm not feeling well today and won't be able to come into work.
[SLOT1] understand that I'll rest and keep you updated.
I'll aim to return tomorrow and [SLOT2] reach out if things change.

Thank you for your [SLOT3] understanding,
[Your Name]`;

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export function PromptBuilderGame({ onComplete, onBack }: PromptBuilderGameProps) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedElements, setSelectedElements] = useState<PromptElement[]>([]);
  const [availableElements, setAvailableElements] = useState<PromptElement[]>(level1Elements);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<string>('');
  
  // Level 2 states
  const [selectedTone, setSelectedTone] = useState<string>('');
  const [userToneChoice, setUserToneChoice] = useState<string>('');
  const [showCommunityResults, setShowCommunityResults] = useState(false);
  
  // Level 3 states
  const [pleaseSlots, setPleaseSlots] = useState<{[key: string]: boolean}>({ slot1: false, slot2: false, slot3: false });
  const [userPleaseOpinion, setUserPleaseOpinion] = useState<string>('');
  const [showPleaseResults, setShowPleaseResults] = useState(false);

  const handleElementClick = (element: PromptElement) => {
    setSelectedElements([...selectedElements, element]);
    setAvailableElements(availableElements.filter(e => e.id !== element.id));
  };

  const handleRemoveElement = (element: PromptElement) => {
    setSelectedElements(selectedElements.filter(e => e.id !== element.id));
    setAvailableElements([...availableElements, element].sort((a, b) => parseInt(a.id) - parseInt(b.id)));
  };

  const generateEmailWithAPI = async (prompt: string, tone: string = 'professional') => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-prompt-response', {
        body: { prompt, tone }
      });

      if (error) throw error;
      return data.email;
    } catch (error) {
      console.error('Error generating email:', error);
      return 'Error generating email. Please try again.';
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLevel1Submit = async () => {
    const userOrder = selectedElements.map(e => e.id);
    const isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);
    
    if (isCorrect) {
      const prompt = selectedElements.map(e => e.text).join(' ');
      const email = await generateEmailWithAPI(prompt);
      setGeneratedEmail(email);
      setScore(100);
      setShowFeedback(true);
      setTimeout(() => {
        setCurrentLevel(2);
        setShowFeedback(false);
      }, 3000);
    } else {
      setGeneratedEmail("Hey, I'm sick and not coming in. Thanks.");
      setScore(0);
      setShowFeedback(true);
    }
  };

  const handleLevel2ToneSelect = async (toneId: string) => {
    setSelectedTone(toneId);
    
    // Generate email with selected tone
    const basePrompt = "You are a helpful assistant. Write an email to my boss. I'm sick today and need to call out.";
    const email = await generateEmailWithAPI(basePrompt, toneId);
    
    // Update the tone option with generated email
    const updatedOptions = toneOptions.map(option => 
      option.id === toneId 
        ? { ...option, example: email }
        : option
    );
    
    // Force re-render by updating a state that triggers component update
    setGeneratedEmail(email);
  };

  const handleLevel2Submit = (choice: string) => {
    setUserToneChoice(choice);
    setShowCommunityResults(true);
    setTimeout(() => {
      setCurrentLevel(3);
      setShowCommunityResults(false);
    }, 4000);
  };

  const togglePleaseSlot = (slot: string) => {
    setPleaseSlots(prev => ({ ...prev, [slot]: !prev[slot] }));
  };

  const handleLevel3Submit = (opinion: string) => {
    setUserPleaseOpinion(opinion);
    setShowPleaseResults(true);
    setTimeout(() => {
      setIsComplete(true);
      onComplete(100);
    }, 3000);
  };

  const handleReset = () => {
    setCurrentLevel(1);
    setSelectedElements([]);
    setAvailableElements(level1Elements);
    setIsComplete(false);
    setScore(0);
    setShowFeedback(false);
    setSelectedTone('');
    setUserToneChoice('');
    setShowCommunityResults(false);
    setPleaseSlots({ slot1: false, slot2: false, slot3: false });
    setUserPleaseOpinion('');
    setShowPleaseResults(false);
  };

  const generateEmailWithPlease = () => {
    return baseEmail
      .replace('[SLOT1]', pleaseSlots.slot1 ? 'Please' : '')
      .replace('[SLOT2]', pleaseSlots.slot2 ? 'please' : '')
      .replace('[SLOT3]', pleaseSlots.slot3 ? 'please' : '');
  };

  if (isComplete) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Congratulations!</h2>
          <p className="text-muted-foreground">
            You've mastered the building blocks of prompting!
          </p>
          <div className="bg-gradient-card border border-primary/20 rounded-lg p-6 space-y-2">
            <h3 className="font-semibold text-foreground">What You Learned:</h3>
            <ul className="text-muted-foreground space-y-1">
              <li>• Structure matters: Role → Task → Context → Tone</li>
              <li>• Tone dramatically affects AI output</li>
              <li>• Word choice has subtle but important effects</li>
            </ul>
          </div>
          <div className="space-y-2">
            <Button onClick={onBack} className="mr-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Games
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Level 1: Basic Prompt Structure
  if (currentLevel === 1) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          ← Back to Games
        </Button>

        <Card className="bg-gradient-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-foreground">Level 1: Basic Prompt Structure</CardTitle>
            <CardDescription>
              Learn that good prompts follow: Role → Task → Context → Tone
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-card border-primary/20">
            <CardHeader>
              <CardTitle className="text-foreground">Available Elements</CardTitle>
              <CardDescription>Click to add to your prompt</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {availableElements.map((element) => (
                  <div
                    key={element.id}
                    className="p-3 bg-secondary/30 border border-secondary/50 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                    onClick={() => handleElementClick(element)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-foreground">{element.text}</span>
                      <Badge variant="outline">{element.category}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-primary/20">
            <CardHeader>
              <CardTitle className="text-foreground">Your Prompt</CardTitle>
              <CardDescription>Arrange in correct order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-[200px] space-y-2">
                {selectedElements.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    Select elements to build your prompt
                  </div>
                ) : (
                  selectedElements.map((element, index) => (
                    <div
                      key={`${element.id}-${index}`}
                      className="p-3 bg-accent/20 border border-accent/30 rounded-lg cursor-pointer hover:bg-accent/30 transition-colors"
                      onClick={() => handleRemoveElement(element)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-foreground">{element.text}</span>
                        <Badge variant="outline">#{index + 1}</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
               {selectedElements.length === 4 && (
                 <Button 
                   variant="magical" 
                   onClick={handleLevel1Submit}
                   className="w-full mt-4"
                   disabled={isGenerating}
                 >
                   {isGenerating ? (
                     <>
                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                       Generating...
                     </>
                   ) : (
                     'Check My Prompt ✨'
                   )}
                 </Button>
               )}
            </CardContent>
          </Card>
        </div>

        {showFeedback && (
          <Card className={`border-2 ${score > 0 ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'}`}>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {score > 0 ? (
                  <>
                    <div className="text-center">
                      <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <p className="text-foreground font-semibold">Perfect! Here's your polished AI output:</p>
                    </div>
                     <div className="bg-background/50 border rounded-lg p-4">
                       <pre className="text-sm text-foreground whitespace-pre-wrap">
                         {generatedEmail || `Subject: Sick Day Notification

Hi [Boss's Name],

I wanted to let you know that I'm not feeling well today and won't be able to come into work. I'll rest and keep you updated, with the goal of returning tomorrow.

Thank you for your understanding,
[Your Name]`}
                       </pre>
                     </div>
                    <p className="text-center text-muted-foreground">Moving to Level 2...</p>
                  </>
                ) : (
                  <>
                    <p className="text-foreground font-semibold text-center">Not quite - try reordering for a clearer result.</p>
                     <div className="bg-background/50 border rounded-lg p-4">
                       <pre className="text-sm text-foreground whitespace-pre-wrap">
                         {generatedEmail || "Hey, I'm sick and not coming in. Thanks."}
                       </pre>
                     </div>
                    <p className="text-muted-foreground text-center">Hint: Role → Task → Context → Tone</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Level 2: Experiment with Tone
  if (currentLevel === 2) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="bg-gradient-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-foreground">Level 2: Experiment with Tone</CardTitle>
            <CardDescription>
              See how different tones change the AI's output. Which would work best for your boss?
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {toneOptions.map((tone) => (
            <Card 
              key={tone.id}
              className={`cursor-pointer transition-all hover:border-primary/50 ${selectedTone === tone.id ? 'border-primary bg-primary/10' : 'bg-gradient-card border-primary/20'}`}
              onClick={() => handleLevel2ToneSelect(tone.id)}
            >
              <CardHeader>
                <CardTitle className="text-foreground text-lg">{tone.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-background/50 border rounded-lg p-3 min-h-[200px] flex items-center justify-center">
                  {selectedTone === tone.id && isGenerating ? (
                    <div className="flex items-center text-muted-foreground">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </div>
                  ) : (
                    <pre className="text-xs text-foreground whitespace-pre-wrap">{tone.example}</pre>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedTone && !showCommunityResults && (
          <Card className="bg-gradient-card border-primary/20">
            <CardHeader>
              <CardTitle className="text-foreground">Which email would work best for your boss?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {toneOptions.map((tone) => (
                  <Button
                    key={tone.id}
                    variant={tone.id === selectedTone ? "default" : "outline"}
                    onClick={() => handleLevel2Submit(tone.id)}
                  >
                    {tone.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {showCommunityResults && (
          <Card className="bg-gradient-card border-primary/20">
            <CardHeader>
              <CardTitle className="text-foreground">Community Results</CardTitle>
              <CardDescription>You chose: {toneOptions.find(t => t.id === userToneChoice)?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(communityResults).map(([tone, percentage]) => (
                  <div key={tone} className="flex items-center justify-between">
                    <span className="text-foreground capitalize">{tone}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-secondary/30 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-muted-foreground text-sm">{percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-muted-foreground mt-4">Moving to Level 3...</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Level 3: The Word "Please"
  if (currentLevel === 3) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-gradient-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-foreground">Level 3: The Word "Please"</CardTitle>
            <CardDescription>
              Explore micro-language choices. Click the slots to add "please" and see the effect.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-foreground">Email Template</CardTitle>
            <CardDescription>Click the [+] buttons to add "please"</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-background/50 border rounded-lg p-4">
              <pre className="text-sm text-foreground whitespace-pre-wrap">
{`Hi [Boss's Name],

I wanted to let you know that I'm not feeling well today and won't be able to come into work.
`}
                <Button
                  size="sm"
                  variant={pleaseSlots.slot1 ? "destructive" : "outline"}
                  onClick={() => togglePleaseSlot('slot1')}
                  className="mx-1"
                >
                  {pleaseSlots.slot1 ? 'Please' : '+'}
                </Button>
{` understand that I'll rest and keep you updated.
I'll aim to return tomorrow and `}
                <Button
                  size="sm"
                  variant={pleaseSlots.slot2 ? "destructive" : "outline"}
                  onClick={() => togglePleaseSlot('slot2')}
                  className="mx-1"
                >
                  {pleaseSlots.slot2 ? 'please' : '+'}
                </Button>
{` reach out if things change.

Thank you for your `}
                <Button
                  size="sm"
                  variant={pleaseSlots.slot3 ? "destructive" : "outline"}
                  onClick={() => togglePleaseSlot('slot3')}
                  className="mx-1"
                >
                  {pleaseSlots.slot3 ? 'please' : '+'}
                </Button>
{` understanding,
[Your Name]`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-foreground">Your Email Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-background/50 border rounded-lg p-4">
              <pre className="text-sm text-foreground whitespace-pre-wrap">{generateEmailWithPlease()}</pre>
            </div>
          </CardContent>
        </Card>

        {!showPleaseResults && (
          <Card className="bg-gradient-card border-primary/20">
            <CardHeader>
              <CardTitle className="text-foreground">Did adding "please" help, hurt, or remain neutral?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 justify-center flex-wrap">
                <Button variant="outline" onClick={() => handleLevel3Submit('helped')}>
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Helped
                </Button>
                <Button variant="outline" onClick={() => handleLevel3Submit('neutral')}>
                  <Minus className="w-4 h-4 mr-2" />
                  Neutral
                </Button>
                <Button variant="outline" onClick={() => handleLevel3Submit('hurt')}>
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Hurt
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {showPleaseResults && (
          <Card className="bg-gradient-card border-primary/20">
            <CardHeader>
              <CardTitle className="text-foreground">Community Poll Results</CardTitle>
              <CardDescription>You chose: {userPleaseOpinion}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Helped</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-secondary/30 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full w-1/4" />
                    </div>
                    <span className="text-muted-foreground text-sm">25%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Neutral</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-secondary/30 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full w-1/2" />
                    </div>
                    <span className="text-muted-foreground text-sm">50%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Hurt</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-secondary/30 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full w-1/4" />
                    </div>
                    <span className="text-muted-foreground text-sm">25%</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-muted-foreground mt-4">Completing game...</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return null;
}