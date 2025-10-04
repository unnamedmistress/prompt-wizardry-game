import React, { useState } from "react";
import type { LearningExperience } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ContextualHint } from "@/components/ContextualHint";
import { InsightTooltip } from "@/components/InsightTooltip";
import { AnimatedText } from "@/components/AnimatedText";

interface AIIntroGameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
  lesson: LearningExperience;
}

const characters = [
  { id: "mickey", name: "Mickey Mouse", response: "Gosh! Being truthful is always the top policy!" },
  { id: "scrooge", name: "Ebenezer Scrooge", response: "Bah! Yet honesty remains the soundest policy for profit." },
  { id: "cat", name: "A Cat", response: "Mew... honesty keeps the bowl full." },
  { id: "dog", name: "A Dog", response: "Woof! Honesty is the best bone to chew on!" },
  { id: "santa", name: "Santa Claus", response: "Ho ho ho! Honesty is the merriest policy of all." },
  { id: "dropbox", name: "Dropbox", response: "At Dropbox, integrity is our best policy." },
  { id: "sherlock", name: "Sherlock Holmes", response: "Elementary, my dear Watson: honesty is the best policy." },
  { id: "yoda", name: "Yoda", response: "Best policy, honesty is, hmmm." },
  { id: "pirate", name: "Pirate", response: "Arrr, speakin' true be the finest code o' conduct." },
  { id: "shakespeare", name: "Shakespeare", response: "Verily, honesty doth prove the noblest policy." }
];

const toneWords = [
  "compelling",
  "pathetic",
  "mad",
  "happy",
  "distracted",
  "short",
  "formal",
  "friendly",
  "urgent",
  "apologetic"
];

const toneResponses: Record<string, string> = {
  compelling: "Hey boss, I'm really under the weather and won't be able to give my best today. I'll make up for it when I'm back.",
  pathetic: "Hey boss, I'm sooo sick... I can't even move. Please let me stay home.",
  mad: "Boss, I'm sick. Don't expect me in.",
  happy: "Morning! Feeling pretty ill today, so I'll rest up and be back with a smile tomorrow.",
  distracted: "Hi - um, I'm sick today, can't come. Thanks.",
  short: "Sick today, staying home.",
  formal: "Dear Boss, I regret to inform you that illness prevents my attendance today.",
  friendly: "Hey Boss! I'm feeling rough today, going to rest and catch you tomorrow.",
  urgent: "Boss, I woke up really sick. Need to stay home and recover.",
  apologetic: "I'm sorry, but I'm too sick to come in today. I'll keep you posted."
};

export function AIIntroGame({ onComplete, onBack }: AIIntroGameProps) {
  const [step, setStep] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0].id);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [showWrong, setShowWrong] = useState(false);
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleSend = () => {
    const char = characters.find(c => c.id === selectedCharacter);
    if (!char) return;
    setMessages(prev => [
      ...prev,
      { role: "user", text: `Honesty is the best policy. Re write this in the voice of ${char.name}.` },
      { role: "assistant", text: char.response }
    ]);
  };

  const handleOptionClick = (option: string) => {
    if (option === "Policy") {
      setStep(3);
    } else {
      setShowWrong(true);
    }
  };

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const tone = e.dataTransfer.getData("text/plain");
    if (tone) setSelectedTone(tone);
    setIsDragOver(false);
  };
  const handleDragStart = (e: React.DragEvent, tone: string) => {
    e.dataTransfer.setData("text/plain", tone);
  };
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return; // ignore internal moves
    setIsDragOver(false);
  };
  const handleToneClick = (tone: string) => {
    setSelectedTone(tone);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {step === 1 && (
        <Card>
          <CardContent className="space-y-4">
            {/* Chat Messages Area */}
            <div className="h-64 border rounded-lg p-4 overflow-y-auto bg-background space-y-4">
              {messages.length === 0 && (
                <p className="text-muted-foreground text-center text-sm">Start a conversation by selecting a character and clicking Send.</p>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    m.role === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-foreground border"
                  }`}>
                    <div className="text-xs opacity-70 mb-1 flex items-center gap-2">
                      {m.role === "user" ? "You" : (
                        <>
                          <span>AI Assistant</span>
                          {/* Waveform animation for AI responses */}
                          <div className="flex gap-0.5 items-center h-3">
                            {[1, 2, 3, 4].map((bar) => (
                              <div
                                key={bar}
                                className="w-0.5 bg-primary animate-pulse rounded-full"
                                style={{
                                  height: `${Math.random() * 8 + 4}px`,
                                  animationDelay: `${bar * 0.1}s`,
                                  animationDuration: '0.8s'
                                }}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="text-sm">{m.text}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area - ChatGPT Style */}
            <div className="border rounded-lg bg-background p-3">
              <div className="flex gap-2 items-center">
                <span className="text-sm text-muted-foreground">Rewrite "Honesty is the best policy" in the voice of</span>
                <select
                  className="border rounded-md px-3 py-2 bg-background text-foreground z-50"
                  value={selectedCharacter}
                  onChange={e => setSelectedCharacter(e.target.value)}
                >
                  {characters.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <Button onClick={handleSend} size="sm">
                  Send
                </Button>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={onBack}>Back to Lessons</Button>
              <Button onClick={() => setStep(2)}>Next Game</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">🎯 Word Prediction</CardTitle>
            <CardDescription className="text-lg font-semibold text-foreground mb-3">AI Basics</CardDescription>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                AI uses patterns from its training to predict what word comes next. Some combinations are much more likely than others.
              </p>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Your Mission</h4>
                <p>Select the word an AI would most likely predict to complete the sentence.</p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Activity</h4>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Read the incomplete sentence below.</li>
                  <li>Think about which word would most commonly follow.</li>
                  <li>Click your choice to see if you think like an AI!</li>
                </ol>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-medium">Honesty is the best ___</p>
            
            {/* Probability Visualization */}
            <div className="p-4 bg-muted/50 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-3">AI Prediction Likelihood:</p>
              <div className="space-y-2">
                {[
                  { word: "Policy", probability: 94, color: "bg-green-500" },
                  { word: "Banana", probability: 2, color: "bg-red-400" },
                  { word: "Spaceship", probability: 1, color: "bg-red-500" },
                  { word: "Revenge", probability: 3, color: "bg-amber-500" }
                ].map(opt => (
                  <div key={opt.word} className="flex items-center gap-2">
                    <span className="text-xs w-20 font-medium">{opt.word}</span>
                    <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${opt.color} transition-all duration-1000 ease-out animate-fade-in flex items-center justify-end pr-2`}
                        style={{ width: `${opt.probability}%` }}
                      >
                        <span className="text-xs font-bold text-white">{opt.probability}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { word: "Policy", hint: "This is the most common phrase completion", prob: 94 },
                { word: "Banana", hint: "This doesn't fit the pattern", prob: 2 },
                { word: "Spaceship", hint: "AI rarely predicts random words", prob: 1 },
                { word: "Revenge", hint: "This contradicts the meaning", prob: 3 }
              ].map(opt => (
                <InsightTooltip key={opt.word} content={opt.hint}>
                  <Button 
                    onClick={() => handleOptionClick(opt.word)} 
                    variant="secondary"
                    className="w-full relative"
                  >
                    <div className="flex items-center gap-2">
                      <span>{opt.word}</span>
                      <div className={`w-2 h-2 rounded-full animate-pulse ${opt.prob > 50 ? 'bg-green-500' : 'bg-red-400'}`} />
                    </div>
                  </Button>
                </InsightTooltip>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={onBack}>Back to Lessons</Button>
              <Button onClick={() => setStep(3)}>Skip</Button>
            </div>
            <Dialog open={showWrong} onOpenChange={setShowWrong}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>You would not make a good robot, pick again.</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                  <Button onClick={() => setShowWrong(false)}>Try Again</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">🎭 Tone Changes Everything</CardTitle>
            <CardDescription className="text-lg font-semibold text-foreground mb-3">AI Basics</CardDescription>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                The same prompt can produce completely different responses based on just one word that changes the tone.
              </p>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Your Mission</h4>
                <p>Pick (click) or drag a tone word to see how dramatically the AI's response changes.</p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Activity</h4>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Click OR drag a tone word into the blank tone slot.</li>
                  <li>Watch how the message to your boss completely transforms.</li>
                  <li>Try several tones and compare style differences.</li>
                </ol>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-medium leading-relaxed">
              Write a
              <span
                onDrop={handleDrop}
                onDragOver={allowDrop}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                className={
                  `mx-2 inline-flex min-w-[120px] items-center justify-center px-3 py-1 rounded-md border-2 text-sm font-semibold transition-colors select-none
                  ${isDragOver ? 'border-primary bg-primary/10' : selectedTone ? 'border-green-500 bg-green-50 text-green-800' : 'border-dashed border-muted-foreground/40 bg-muted/30'}
                  `
                }
                role="button"
                tabIndex={0}
                onClick={() => setSelectedTone(null)}
                title={selectedTone ? 'Click to clear or pick another tone below' : 'Drag or click a tone word below'}
              >
                {selectedTone || 'choose tone'}
              </span>
              text to my boss to call out sick today.
            </p>
            <div className="text-xs text-muted-foreground -mt-2">Tip: You can click a tone word below OR drag it into the highlighted box. Click the box to clear.</div>
            <div className="flex flex-wrap gap-2">
              {toneWords.map(word => (
                <InsightTooltip 
                  key={word}
                  content={
                    <div className="text-xs">
                      <p className="font-medium">"{word}" changes how the message is perceived</p>
                      {toneResponses[word] && <p className="mt-1 text-muted-foreground">Try it to see the {word} version</p>}
                    </div>
                  }
                >
                    <button
                      draggable
                      onDragStart={e => handleDragStart(e, word)}
                      onClick={() => handleToneClick(word)}
                      className={
                        `px-3 py-1 rounded-md border text-sm font-medium shadow-sm transition-all
                        ${selectedTone === word ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted border-muted-foreground/30'}
                        focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer`}
                      type="button"
                    >
                      {word}
                    </button>
                  </InsightTooltip>
              ))}
            </div>
            {selectedTone && (
              <div className="p-3 border rounded bg-muted animate-slide-up">
                <AnimatedText text={toneResponses[selectedTone]} speed={15} />
              </div>
            )}
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={onBack}>Back to Lessons</Button>
              <Button onClick={() => onComplete(100)}>Finish Lesson</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default AIIntroGame;
