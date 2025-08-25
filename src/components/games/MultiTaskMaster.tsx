import { useState, useEffect, useRef } from "react";
import type { LearningExperience } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";

interface MultiTaskMasterProps { onComplete: (score: number) => void; onBack: () => void; lesson: LearningExperience; }

type ChatRole = 'bot' | 'user' | 'system';
interface ChatMessage { id: string; role: ChatRole; content: string; meta?: string }

interface CollectedFields {
  role: string;
  task: string;
  constraints: string;
  audience: string;
  specifics: string;
  format: string;
}

const steps: { key: keyof CollectedFields; prompt: string; placeholder: string }[] = [
  { key: 'role', prompt: 'First, who should the AI pretend to be? (Example: travel planner, fitness coach, event organizer).', placeholder: 'e.g. travel planner' },
  { key: 'task', prompt: 'Great. Now, what’s the main job you want AI to do? (Example: plan a trip, make a workout, design a party).', placeholder: 'e.g. plan a 5-day Italy trip' },
  { key: 'constraints', prompt: 'Good. Now give me any limits. (Example: budget, time, number of people).', placeholder: 'e.g. $1500 budget, 2 people, mid-May' },
  { key: 'audience', prompt: 'Nice. Who is this for? (Example: a couple, a family, a group of friends).', placeholder: 'e.g. a couple in their 30s who love food' },
  { key: 'specifics', prompt: 'Add something extra you want included. (Example: restaurant suggestions, indoor activities, backup plans).', placeholder: 'e.g. regional food stops + rainy day alternatives' },
  { key: 'format', prompt: 'Last step! How should the answer be shaped? (Example: list, daily schedule, bullet points).', placeholder: 'e.g. day-by-day schedule with bullet lists' }
];

const introLine = "Welcome to Multi-Task Master! I’ll help you build a powerful prompt step by step. At the end, we’ll test how good it is. Ready?";

function assemblePrompt(f: CollectedFields) {
  return `You are a ${f.role}. Your task is to ${f.task} for ${f.audience}. The budget/limits are ${f.constraints}. Please include ${f.specifics}. Format the answer as ${f.format}.`;
}

interface EvaluationResult {
  score: number; // 0-10
  bullets: string[]; // feedback lines with emojis
  proVersion: string; // improved prompt
}

function evaluatePrompt(fields: CollectedFields): EvaluationResult {
  let score = 0;
  const bullets: string[] = [];

  // Clarity: each field present
  (Object.entries(fields) as [keyof CollectedFields, string][]).forEach(([k, v]) => {
    if (v.trim().length > 0) score += 1; // up to 6 points
  });

  // Detail heuristics
  const hasNumber = /\d/.test(fields.constraints + fields.specifics + fields.task);
  if (hasNumber) { score += 1; bullets.push('Detail: includes numeric specifics ✅'); } else bullets.push('Detail: consider adding numbers (days, counts, budget) ❌');

  const hasFormatKeyword = /(list|bullet|schedule|table|sections?|outline|steps?)/i.test(fields.format);
  if (hasFormatKeyword) { score += 1; bullets.push('Format clarity ✅'); } else bullets.push('Format could be clearer (add list / schedule) ❌');

  const hasAudienceDescriptor = /(family|couple|team|students?|friends?|beginner|advanced)/i.test(fields.audience);
  if (hasAudienceDescriptor) { score += 1; bullets.push('Audience described ✅'); } else bullets.push('Audience lacks descriptive detail ❌');

  score = Math.min(10, score); // cap

  // Baseline bullets for required pieces
  if (fields.role.trim()) bullets.unshift('Clear role chosen ✅'); else bullets.unshift('Role missing ❌');
  if (fields.task.trim()) bullets.unshift('Main task stated ✅'); else bullets.unshift('Main task unclear ❌');
  if (fields.constraints.trim().split(/\s+/).length < 3) bullets.push('Constraint missing detail ❌ (add time, budget, or quantity)'); else bullets.push('Constraints reasonably specific ✅');
  if (fields.format.trim()) bullets.push('Format specified ✅');

  // Pro version rewrite: add instructive polish
  const pro = assemblePrompt({
    ...fields,
    task: enrich(fields.task, 'Provide a structured, outcome-focused solution'),
    specifics: ensureVerb(fields.specifics),
    format: fields.format.match(/schedule|day/i) ? fields.format + ' Include concise daily headings.' : fields.format + ' Include clear section headings.'
  }) + ' Ensure concise, actionable language and include estimate ranges where helpful.';

  return { score, bullets, proVersion: pro };
}

function enrich(text: string, addon: string) {
  return /provide|create|design|plan/i.test(text) ? text : addon + ': ' + text;
}
function ensureVerb(text: string) {
  return /include|add|provide|incorporate/i.test(text) ? text : 'Include ' + text;
}

export const MultiTaskMaster = ({ lesson, onComplete, onBack }: MultiTaskMasterProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState<number | null>(null); // null until user confirms ready
  const [input, setInput] = useState("");
  const [fields, setFields] = useState<CollectedFields>({ role: '', task: '', constraints: '', audience: '', specifics: '', format: '' });
  const [evaluated, setEvaluated] = useState<EvaluationResult | null>(null);
  const [finished, setFinished] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, evaluated]);

  // Initialize intro
  useEffect(() => {
    setMessages([{ id: crypto.randomUUID(), role: 'bot', content: introLine }]);
  }, []);

  const advance = () => {
    if (currentStep === null) { // start collection
      setCurrentStep(0);
      pushBot(steps[0].prompt);
      return;
    }
    // all steps done -> build + evaluate
    if (currentStep >= steps.length) return;
  };

  const pushBot = (content: string) => setMessages(m => [...m, { id: crypto.randomUUID(), role: 'bot', content }]);
  const pushUser = (content: string) => setMessages(m => [...m, { id: crypto.randomUUID(), role: 'user', content }]);

  const handleSubmitInput = () => {
    if (input.trim() === '' || currentStep === null) return;
    const step = steps[currentStep];
    pushUser(input.trim());
    setFields(f => ({ ...f, [step.key]: input.trim() }));
    setInput('');
    const next = currentStep + 1;
    if (next < steps.length) {
      setCurrentStep(next);
      setTimeout(() => pushBot(steps[next].prompt), 300);
    } else {
      // build assembled prompt
      setCurrentStep(next); // mark complete
      const assembled = assemblePrompt({ ...fields, [step.key]: input.trim() });
      setTimeout(() => {
        pushBot('Great! Here is the prompt you built:');
        pushBot('"' + assembled + '"');
        pushBot('Now let’s test it! I’ll score it for clarity, detail, and effectiveness.');
        const result = evaluatePrompt({ ...fields, [step.key]: input.trim() });
        setEvaluated(result);
        pushBot(`✅ Score: ${result.score}/10`);
        result.bullets.forEach(b => pushBot('📌 ' + b));
        pushBot('Pro Version: "' + result.proVersion + '"');
        pushBot('Want to try another challenge? Next: plan a surprise birthday party!');
      }, 400);
    }
  };

  const handleReplay = () => {
    setFields({ role: '', task: '', constraints: '', audience: '', specifics: '', format: '' });
    setMessages([
      { id: crypto.randomUUID(), role: 'bot', content: 'New mission! Build a prompt for: plan a surprise birthday party. Ready?' }
    ]);
    setEvaluated(null);
    setCurrentStep(null);
    setFinished(false);
  };

  const handleComplete = () => {
    if (evaluated && !finished) {
      setFinished(true);
      onComplete(evaluated.score * 10); // scale to 100
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">🧠 Multi-Task Master (Chatbot Edition)</CardTitle>
          <CardDescription>Practice building multi-part prompts like a real conversation.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[460px] overflow-y-auto border rounded-md p-4 bg-muted/30 space-y-4 text-sm">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-md shadow-sm whitespace-pre-wrap leading-snug ${
                  msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background border'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {currentStep === null && !evaluated && (
              <div className="text-center text-xs text-muted-foreground">Click Start to begin.</div>
            )}
            {evaluated && (
              <div className="text-center mt-4">
                <div className="text-sm font-medium">Session Score: {evaluated.score}/10</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          {!evaluated && (
            <div className="mt-4 flex gap-2">
              {currentStep === null ? (
                <Button className="flex-1" onClick={advance}>Start <ArrowRight className="w-4 h-4 ml-1" /></Button>
              ) : (
                <>
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSubmitInput(); }}
                    placeholder={steps[currentStep]?.placeholder || ''}
                    className="flex-1 px-3 py-2 rounded border bg-background"
                    disabled={currentStep >= steps.length}
                  />
                  <Button onClick={handleSubmitInput} disabled={input.trim()==='' || currentStep >= steps.length}>
                    Send
                  </Button>
                </>
              )}
            </div>
          )}

          {evaluated && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={handleReplay}><RotateCcw className="w-4 h-4 mr-1" />Replay</Button>
              <Button onClick={handleComplete} disabled={finished}><Sparkles className="w-4 h-4 mr-1" />Finish & Save</Button>
              <Button variant="outline" onClick={onBack} className="ml-auto">Back</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};