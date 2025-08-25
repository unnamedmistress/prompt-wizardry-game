import { useState } from "react";
import type { LearningExperience } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, RefreshCcw } from "lucide-react";

interface ToneControllerProps { onComplete: (score: number) => void; onBack: () => void; lesson: LearningExperience; }

interface SimpleScenario {
  id: number;
  roundTitle: string;
  situation: string;
  tones: string[]; // tone options
  correctIndex: number; // which tone is the strong one
  good: string;
  bad: string;
  tip: string;
}

const scenarios: SimpleScenario[] = [
  {
    id: 1,
    roundTitle: "Asking Your Boss for Time Off",
    situation: "You need Friday off during a busy week.",
    tones: [
      "Polite & Respectful", // correct
      "Over‑Apologetic & Hesitant",
      "Super Casual & Loose",
      "Direct & Blunt"
    ],
    correctIndex: 0,
    good: "I know this week is busy, but may I take Friday off? I’ll finish my work early.",
    bad: "Yo boss 😎 I’m out Friday, deal with it.",
    tip: "Polite words make the ask sound professional."
  },
  {
    id: 2,
    roundTitle: "Texting a Friend to Hang Out",
    situation: "You want to ask your friend to hang out Saturday.",
    tones: [
      "Fun & Friendly", // correct
      "Formal & Serious",
      "Bossy",
      "Over‑Energetic & Clingy"
    ],
    correctIndex: 0,
    good: "Hey! Want to hang out Saturday? We could watch a movie.",
    bad: "You must come over Saturday at 2:00. Don’t be late.",
    tip: "Friends like casual and fun, not bossy orders."
  },
  {
    id: 3,
    roundTitle: "Talking to a Teacher About Homework",
    situation: "You need more time to finish homework.",
    tones: [
      "Polite & Honest", // correct
      "Excuses & Whiny",
      "Rude",
      "Polite but Vague"
    ],
    correctIndex: 0,
    good: "I’ve been working on the assignment, but I need one more day to finish. Could I have an extension?",
    bad: "Ugh, your homework is way too hard. I’m not doing it.",
    tip: "Being polite and clear gets you the best chance."
  },
  {
    id: 4,
    roundTitle: "Replying to an Upset Customer",
    situation: "Someone is mad about their late food delivery.",
    tones: [
      "Calm & Helpful", // correct
      "Angry Back",
      "Joking",
      "Over‑Apologetic & Dramatic"
    ],
    correctIndex: 0,
    good: "I’m sorry your food was late. I’ll talk to the driver and make sure it doesn’t happen again.",
    bad: "It’s not my fault. Chill out, dude.",
    tip: "Staying calm makes the problem easier to fix."
  },
  {
    id: 5,
    roundTitle: "Thanking Your Coach",
    situation: "Your coach helped you train for a big game.",
    tones: [
      "Warm & Thankful", // correct
      "Short & Cold",
      "Silly & Random",
      "Formal & Stiff"
    ],
    correctIndex: 0,
    good: "Thank you for all your help, Coach. I really appreciate your support!",
    bad: "K thx lol.",
    tip: "A kind tone makes people feel valued."
  }
];

export const ToneController = ({ lesson, onComplete, onBack }: ToneControllerProps) => {
  const [round, setRound] = useState(0);
  const [selectedTone, setSelectedTone] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const scenario = scenarios[round];

  const handleToneClick = (i: number) => {
    if (revealed) return; // lock after first pick for simplicity
    setSelectedTone(i);
    setRevealed(true);
    if (i === scenario.correctIndex) setScore(s => s + 20);
  };

  const handleNext = () => {
    if (round < scenarios.length - 1) {
      setRound(r => r + 1);
      setSelectedTone(null);
      setRevealed(false);
    } else {
      setFinished(true);
      onComplete(score);
    }
  };

  const handleTryAgain = () => {
    // allow re-try only if incorrect choice
    if (selectedTone !== null && selectedTone !== scenario.correctIndex) {
      setSelectedTone(null);
      setRevealed(false);
    }
  };

  if (finished) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md text-center w-full">
          <CardHeader>
            <CardTitle className="text-xl">� Tone & Style Game Complete!</CardTitle>
            <CardDescription>Score: {score} / {scenarios.length * 20}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Different situations need different tones—and you just practiced five.</p>
            <Button onClick={onBack}>Back to Lessons</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">� Tone & Style Game: Say It the Right Way</CardTitle>
          <CardDescription className="text-lg font-semibold text-foreground mb-3">Round {round + 1} of {scenarios.length}</CardDescription>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>Click a tone. Instantly see a good vs bad example plus a quick tip. Fast visual learning.</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center text-sm text-muted-foreground mb-6">Score: {score}</div>

          <div className="space-y-8">
            <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
              <h4 className="font-medium text-foreground mb-2">⭐ Round {round + 1}: {scenario.roundTitle}</h4>
              <p className="text-sm text-muted-foreground mb-1"><strong>Situation:</strong> {scenario.situation}</p>
            </div>

            {!revealed && (
              <div>
                <h4 className="font-medium text-foreground mb-3">Pick a tone:</h4>
                <div className="grid md:grid-cols-3 gap-3">
                  {scenario.tones.map((t, i) => {
                    const isSelected = i === selectedTone;
                    return (
                      <button
                        key={t}
                        onClick={() => handleToneClick(i)}
                        className={`p-4 border rounded-lg text-sm text-left transition focus:outline-none focus:ring-2 focus:ring-primary/40 hover:border-primary ${isSelected ? 'border-primary bg-primary/5' : ''}`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {revealed && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border border-green-600/50 rounded-lg bg-green-200/60 dark:bg-green-900/60">
                    <div className="font-semibold mb-2 text-green-900 dark:text-green-200">✅ Good</div>
                    <p className="text-sm leading-snug text-green-950 dark:text-green-100">“{scenario.good}”</p>
                  </div>
                  <div className="p-4 border border-red-600/50 rounded-lg bg-red-200/60 dark:bg-red-900/60">
                    <div className="font-semibold mb-2 text-red-900 dark:text-red-200">❌ Bad</div>
                    <p className="text-sm leading-snug text-red-950 dark:text-red-100">“{scenario.bad}”</p>
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-muted/40">
                  <div className="text-sm"><strong>Tip:</strong> {scenario.tip}</div>
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                  {selectedTone !== scenario.correctIndex && (
                    <Button variant="secondary" size="sm" onClick={handleTryAgain}><RefreshCcw className="w-4 h-4 mr-1" />Try Again</Button>
                  )}
                  <Button size="sm" onClick={handleNext}>{round < scenarios.length - 1 ? 'Next Round' : 'Finish'} <ArrowRight className="w-4 h-4 ml-1" /></Button>
                  <span className="text-xs text-muted-foreground">{selectedTone === scenario.correctIndex ? '✔ Correct tone' : 'You picked a weaker tone'}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-6">
              <Button variant="outline" onClick={onBack} className="flex-1">Exit</Button>
              <div className="flex-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};