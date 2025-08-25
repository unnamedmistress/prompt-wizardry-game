import { useState } from "react";
import type { LearningExperience } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Wand2, Repeat, FileText, MessageSquare, CheckCircle2, Brain, Sparkles, ArrowRight } from "lucide-react";

interface ToneControllerProps {
  onComplete: (score: number) => void;
  onBack: () => void;
  lesson: LearningExperience;
}

interface WorkshopScenario {
  id: number;
  situation: string;
  audience: string;
  objective: string;
  recommendedDirections: string[]; // quick pick tone directives
  guidance: string; // hint why tone matters here
}

const scenarios: WorkshopScenario[] = [
  {
    id: 1,
    situation: "You need to ask your boss for time off during a busy period at work.",
    audience: "Manager (stressed, balancing workload)",
    objective: "Request a specific day off without causing friction",
    recommendedDirections: ["Professional but understanding", "Respectful and solution-focused", "Polite and proactive"],
    guidance: "Show awareness of timing + offer mitigation (covering tasks, early handoff)."
  },
  {
    id: 2,
    situation: "You want to text a coworker to swap shifts this weekend.",
    audience: "Peer teammate",
    objective: "Get a shift trade while sounding considerate",
    recommendedDirections: ["Casual but clear", "Friendly and concise", "Polite and appreciative"],
    guidance: "Keep it human and low-pressure; clarity + respect = better response."
  },
  {
    id: 3,
    situation: "You need to reply to an angry customer email about a delayed order.",
    audience: "Frustrated customer",
    objective: "Defuse tension + rebuild trust",
    recommendedDirections: ["Calm and apologetic", "Empathetic but confident", "Reassuring and solution-focused"],
    guidance: "Validation + ownership + next steps beats defensive explanations."
  },
  {
    id: 4,
    situation: "You are writing a resignation note to HR and your manager.",
    audience: "HR / Manager",
    objective: "Leave on good terms + maintain bridges",
    recommendedDirections: ["Positive and formal", "Grateful and professional", "Warm but polished"],
    guidance: "Tone shapes future references; optimistic closure signals professionalism."
  },
  {
    id: 5,
    situation: "You want to send a thank‑you note to a mentor who helped your growth.",
    audience: "Mentor",
    objective: "Express genuine appreciation and impact",
    recommendedDirections: ["Warm and appreciative", "Sincere and specific", "Grateful and reflective"],
    guidance: "Specific impact + authentic warmth > generic thanks."
  }
];

interface GeneratedSample { id: string; directive: string; text: string; baseline?: boolean }

export const ToneController = ({ lesson, onComplete, onBack }: ToneControllerProps) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [toneInput, setToneInput] = useState("");
  const [samples, setSamples] = useState<Record<number, GeneratedSample[]>>({});
  const [reflections, setReflections] = useState<Record<number, { fits?: string; risk?: string; redirect?: string }>>({});
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const scenario = scenarios[currentScenario];
  const scenarioSamples = samples[scenario.id] || [];
  const scenarioReflection = reflections[scenario.id] || {};

  const ensureBaseline = () => {
    if (scenarioSamples.some(s => s.baseline)) return;
    const baseline: GeneratedSample = {
      id: crypto.randomUUID(),
      directive: "(no tone specified)",
      baseline: true,
      text: genericGenerate(scenario, "")
    };
    setSamples(prev => ({ ...prev, [scenario.id]: [baseline, ...(prev[scenario.id] || [])] }));
  };

  const genericGenerate = (sc: WorkshopScenario, directive: string) => {
    // Lightweight template-based generation (placeholder for real model)
    const base = sc.situation.replace(/You /i, "I ");
    const toneBits = directive.toLowerCase();
    let style = "";
    if (!directive) {
      style = `Hi, I wanted to address this: ${base}. Let me know.`;
    } else {
      if (toneBits.includes("professional") || toneBits.includes("formal")) style += "Maintaining a professional, clear tone. ";
      if (toneBits.includes("warm") || toneBits.includes("appreciative") || toneBits.includes("grateful")) style += "Expressing genuine appreciation. ";
      if (toneBits.includes("calm") || toneBits.includes("de-escal")) style += "Keeping language calm and steady. ";
      if (toneBits.includes("apologetic")) style += "Offering concise apology up front. ";
      if (toneBits.includes("casual")) style += "Light, conversational phrasing. ";
      if (toneBits.includes("confident")) style += "Assertive yet respectful framing. ";
      if (toneBits.includes("solution") || toneBits.includes("proactive")) style += "Proposing next steps proactively. ";
      style += "";
      style = style.trim();
    }
    const body = (() => {
      if (scenario.id === 1) {
        return directive ? `I know this period is busy; ${directive} — I'd like Friday off and have already arranged coverage for my open tasks to keep momentum.` : `I need Friday off. Let me know.`;
      }
      if (scenario.id === 2) {
        return directive ? `Could you swap shifts with me this Saturday? ${directive}. I can cover one of yours next week.` : `Can you swap my shift?`;
      }
      if (scenario.id === 3) {
        return directive ? `I’m sorry about the delay. ${directive}. I've expedited the replacement and will update you by 5PM.` : `Delay happened. We are working on it.`;
      }
      if (scenario.id === 4) {
        return directive ? `I'm submitting my resignation effective two weeks from today. ${directive}. I'm grateful for the growth and will document handoffs.` : `I'm resigning. Two weeks.`;
      }
      return directive ? `Thank you for your guidance this year. ${directive}. Your feedback changed how I approach challenges.` : `Thanks for the help.`;
    })();
    return directive ? `${body} (${style})` : body;
  };

  const handleGenerate = () => {
    if (!toneInput.trim()) {
      toast("Enter a tone directive first or use suggestions.");
      return;
    }
    ensureBaseline();
    const newSample: GeneratedSample = {
      id: crypto.randomUUID(),
      directive: toneInput.trim(),
      text: genericGenerate(scenario, toneInput.trim())
    };
    setSamples(prev => ({ ...prev, [scenario.id]: [...(prev[scenario.id] || []), newSample] }));
    setToneInput("");
  };

  const handleQuickPick = (dir: string) => {
    setToneInput(dir);
  };

  const updateReflection = (field: keyof typeof scenarioReflection, value: string) => {
    setReflections(prev => ({ ...prev, [scenario.id]: { ...prev[scenario.id], [field]: value } }));
  };

  const scenarioComplete = () => {
    const hasBaseline = scenarioSamples.some(s => s.baseline);
    const customCount = scenarioSamples.filter(s => !s.baseline).length;
    const reflectionDone = !!scenarioReflection.fits;
    return hasBaseline && customCount >= 1 && reflectionDone;
  };

  const handleNext = () => {
    // scoring: 20 base + 5 each extra custom (beyond first) up to 30 total per scenario
    const customCount = scenarioSamples.filter(s => !s.baseline).length;
    const earned = 20 + Math.min(Math.max(customCount - 1, 0) * 5, 10); // max 30
    setScore(prev => prev + earned);
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
    } else {
      setGameComplete(true);
      onComplete(score + earned);
    }
  };

  // Initialize baseline when scenario first opens for exploration
  if (!samples[scenario.id]) {
    // Lazy baseline creation deferred until user acts; we can auto-create here for guidance
  }

  if (gameComplete) {
    const maxPotential = scenarios.length * 30;
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl">🎵 Tone Workshop Complete!</CardTitle>
            <CardDescription>Final Score: {score} / {maxPotential} points</CardDescription>
          </CardHeader>
            <CardContent>
              <p className="mb-4">You explored how directive wording reshapes AI tone and intent.</p>
              <Button onClick={onBack}>Continue Learning</Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
      <CardTitle className="text-2xl font-bold">🎵 Tone & Style Workshop</CardTitle>
      <CardDescription className="text-lg font-semibold text-foreground mb-3">Communication Mastery</CardDescription>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
        Instead of guessing, practice steering AI with explicit tone directives. Compare a generic output vs. intentional variants and reflect on fitness.
            </p>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2">Your Mission</h4>
        <p>Guide AI tone across changing audiences and goals. Generate, compare, refine, and reflect.</p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Activity</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>Read each workplace scenario carefully.</li>
                <li>Think about who you're talking to and what you want to happen.</li>
                <li>Choose the tone that gets the best result without causing problems.</li>
              </ol>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2 mb-6">
            <div className="text-sm text-muted-foreground">
              Scenario {currentScenario + 1} of {scenarios.length} | Score: {score}/105
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
              <h4 className="font-medium text-foreground mb-2">🎭 Situation</h4>
              <p className="text-lg font-medium text-foreground">{scenario.situation}</p>
              <div className="mt-2 text-xs flex flex-wrap gap-4 text-muted-foreground">
                <span><strong>Audience:</strong> {scenario.audience}</span>
                <span><strong>Objective:</strong> {scenario.objective}</span>
              </div>
              <div className="mt-2 text-xs text-primary/80">
                Hint: {scenario.guidance}
              </div>
            </div>
            <div className="space-y-5">
              <div className="p-4 border rounded-lg bg-muted/40">
                <h4 className="font-semibold mb-2 flex items-center gap-2"><FileText className="w-4 h-4" /> 1. Baseline (No Tone Instruction)</h4>
                <p className="text-sm text-muted-foreground mb-3">See what happens when you give AI minimal direction. Generate a baseline first.</p>
                <Button size="sm" variant="outline" onClick={ensureBaseline} disabled={scenarioSamples.some(s => s.baseline)}>
                  Generate Baseline
                </Button>
              </div>

              <div className="p-4 border rounded-lg bg-muted/40 space-y-3">
                <h4 className="font-semibold flex items-center gap-2"><Wand2 className="w-4 h-4" /> 2. Add Tone Direction</h4>
                <div className="flex flex-wrap gap-2">
                  {scenario.recommendedDirections.map(d => (
                    <Button key={d} size="sm" variant="secondary" onClick={() => handleQuickPick(d)}>{d}</Button>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    value={toneInput}
                    onChange={e => setToneInput(e.target.value)}
                    placeholder="e.g. Professional but understanding, concise and calm"
                    className="flex-1 px-3 py-2 rounded border bg-background text-sm"
                  />
                  <Button onClick={handleGenerate} disabled={!toneInput.trim()}><Sparkles className="w-4 h-4 mr-1" />Generate</Button>
                </div>
                <p className="text-xs text-muted-foreground">Tip: Combine 2–3 descriptors (tone + attitude + style). Avoid single vague words like "nice".</p>
              </div>

              {scenarioSamples.length > 0 && (
                <div className="p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-semibold mb-2 flex items-center gap-2"><Repeat className="w-4 h-4" /> 3. Compare Variants</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {scenarioSamples.map(sample => (
                      <div key={sample.id} className={`p-3 rounded border text-sm bg-background/70 ${sample.baseline ? 'border-dashed' : 'border-primary/40'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${sample.baseline ? 'bg-muted' : 'bg-primary/10 text-primary'} font-medium`}>{sample.directive}</span>
                          {!sample.baseline && <span className="text-[10px] text-muted-foreground">Custom</span>}
                        </div>
                        <p className="leading-snug whitespace-pre-wrap">{sample.text}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">Notice shifts in confidence, empathy, directness, and specificity.</p>
                </div>
              )}

              {scenarioSamples.filter(s => !s.baseline).length > 0 && (
                <div className="p-4 border rounded-lg bg-muted/40 space-y-4">
                  <h4 className="font-semibold flex items-center gap-2"><Brain className="w-4 h-4" /> 4. Reflection</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-2">
                      <label className="font-medium text-foreground text-xs uppercase tracking-wide">Fit?</label>
                      <div className="flex gap-2">
                        <Button type="button" size="sm" variant={scenarioReflection.fits === 'yes' ? 'default' : 'secondary'} onClick={() => updateReflection('fits','yes')}>Yes</Button>
                        <Button type="button" size="sm" variant={scenarioReflection.fits === 'no' ? 'default' : 'secondary'} onClick={() => updateReflection('fits','no')}>No</Button>
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="font-medium text-xs uppercase tracking-wide">What risk or mismatch could this cause?</label>
                      <input
                        className="w-full px-3 py-2 rounded border bg-background text-xs"
                        placeholder="e.g. Might sound too casual during crunch week"
                        value={scenarioReflection.risk || ''}
                        onChange={e => updateReflection('risk', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-3">
                      <label className="font-medium text-xs uppercase tracking-wide">How would you redirect AI if off-tone?</label>
                      <input
                        className="w-full px-3 py-2 rounded border bg-background text-xs"
                        placeholder="e.g. Make it more concise and reduce apologetic language"
                        value={scenarioReflection.redirect || ''}
                        onChange={e => updateReflection('redirect', e.target.value)}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Reflection locks in skill: naming risks = faster iteration next time.</p>
                </div>
              )}

              <div className="p-3 border rounded bg-muted/20 flex flex-wrap gap-4 text-xs">
                <div><strong>Status:</strong> {scenarioSamples.some(s => s.baseline) ? 'Baseline ✔' : 'Baseline needed'}</div>
                <div><strong>Custom Variants:</strong> {scenarioSamples.filter(s => !s.baseline).length}</div>
                <div><strong>Reflection:</strong> {scenarioReflection.fits ? 'Started ✔' : 'Pending'}</div>
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <Button variant="outline" onClick={onBack} className="flex-1">
                Back to Lessons
              </Button>
              <Button 
                onClick={handleNext}
                disabled={!scenarioComplete()}
                className="flex-1"
              >
                {currentScenario < scenarios.length - 1 ? 'Lock & Next Scenario' : 'Finish Workshop'} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};