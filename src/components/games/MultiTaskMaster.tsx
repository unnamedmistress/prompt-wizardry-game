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

function needsIncludePhrase(text: string) {
  return !/^(include|add|provide|incorporate|list)/i.test(text.trim());
}
function assemblePrompt(f: CollectedFields) {
  const specificsPart = needsIncludePhrase(f.specifics)
    ? `Please include ${f.specifics}`
    : `Please ${f.specifics}`;
  return `You are a ${f.role}. Your task is to ${f.task} for ${f.audience}. The budget/limits are ${f.constraints}. ${specificsPart}. Format the answer as ${f.format}.`;
}

type CategoryKey = 'Role' | 'Task' | 'Constraints' | 'Audience' | 'Specifics' | 'Format' | 'Alignment';
interface EvaluationResult { score: number; bullets: string[]; proVersion: string; categories: Record<CategoryKey, 'good' | 'warn' | 'bad'>; }

function evaluatePrompt(fields: CollectedFields): EvaluationResult {
  let score = 0; // will accumulate per category, capped 10
  const bullets: string[] = [];
  const categories: Record<CategoryKey, 'good' | 'warn' | 'bad'> = {
    Role: 'bad', Task: 'bad', Constraints: 'bad', Audience: 'bad', Specifics: 'bad', Format: 'bad', Alignment: 'bad'
  };

  // Helper metrics
  const wordCount = (s: string) => s.trim() ? s.trim().split(/\s+/).length : 0;
  const hasNumber = /\d/.test(fields.constraints + ' ' + fields.task + ' ' + fields.specifics);
  const constraintTokens = fields.constraints.split(/[,;\n]/).map(t => t.trim()).filter(Boolean);
  const numericConstraintItems = constraintTokens.filter(t => /\b(\d+|\$\d+)/.test(t));
  const audienceDescriptors = fields.audience.match(/(young|older|experienced|beginner|foodie|remote|high\s*school|college|professional|family|couple|team|group|students?)/ig) || [];
  const roleHasDomain = /(planner|coach|expert|specialist|strategist|consultant|designer|chef|guide)/i.test(fields.role);
  const taskVerb = fields.task.match(/^(plan|create|design|draft|generate|outline|develop|build|craft)\b/i);
  const formatKeywords = fields.format.match(/(bullet|list|schedule|table|outline|sections?|steps?)/ig) || [];
  const specificsComplexity = /,|and|;|\b(backup|alternative|variants?|metrics?|KPIs?|constraints?)\b/i.test(fields.specifics);

  // 1. Role clarity (0-1)
  if (fields.role.trim().length === 0) { bullets.push('❌ Missing role (who the AI should be).'); categories.Role = 'bad'; }
  else if (roleHasDomain) { score += 1; bullets.push('✅ Role has a clear domain.'); categories.Role = 'good'; } 
  else { bullets.push('⚠️ Role is generic—add a domain (e.g. "experienced strength coach").'); categories.Role = 'warn'; }

  // 2. Task specificity (0-2)
  if (!fields.task.trim()) { bullets.push('❌ Missing main task.'); categories.Task = 'bad'; }
  else {
    let local = 0;
    if (taskVerb) local += 1; else bullets.push('⚠️ Start task with an action verb (e.g. plan, design).');
    if (wordCount(fields.task) >= 5) local += 1; else bullets.push('⚠️ Task is short—add outcome or scope details.');
    score += local;
    if (local === 2) { bullets.push('✅ Task is action-oriented & scoped.'); categories.Task = 'good'; }
    else categories.Task = local === 1 ? 'warn' : 'bad';
  }

  // 3. Constraints richness (0-2)
  if (!fields.constraints.trim()) { bullets.push('❌ No constraints (budget/time/limits).'); categories.Constraints = 'bad'; }
  else {
    let local = 0;
    if (hasNumber) local += 1; else bullets.push('⚠️ Add numeric constraints (duration, counts, budget).');
    if (numericConstraintItems.length >= 2 || wordCount(fields.constraints) >= 6) local += 1; else bullets.push('⚠️ Add a second constraint or more detail.');
    score += local;
    if (local === 2) { bullets.push('✅ Constraints are specific.'); categories.Constraints = 'good'; }
    else categories.Constraints = local === 1 ? 'warn' : 'bad';
  }

  // 4. Audience specificity (0-2)
  if (!fields.audience.trim()) { bullets.push('❌ Missing audience.'); categories.Audience = 'bad'; }
  else {
    let local = 0;
    if (audienceDescriptors.length > 0) local += 1; else bullets.push('⚠️ Audience could use descriptors (age, experience, interests).');
    if (wordCount(fields.audience) >= 4) local += 1; else bullets.push('⚠️ Add a second descriptor to audience.');
    score += local;
    if (local === 2) { bullets.push('✅ Audience richly described.'); categories.Audience = 'good'; }
    else categories.Audience = local === 1 ? 'warn' : 'bad';
  }

  // 5. Specific requests (0-1)
  if (!fields.specifics.trim()) { bullets.push('❌ No extra specifics—add must-have elements.'); categories.Specifics = 'bad'; }
  else if (specificsComplexity || /\b(indoor|backup|alternative|compare|metrics?)\b/i.test(fields.specifics)) { score += 1; bullets.push('✅ Specific requests add depth.'); categories.Specifics = 'good'; } 
  else { bullets.push('⚠️ Add multiple specifics or edge cases (backup, variants, metrics).'); categories.Specifics = 'warn'; }

  // 6. Format clarity (0-1)
  if (!fields.format.trim()) { bullets.push('❌ No format—specify structure (list, outline, schedule).'); categories.Format = 'bad'; }
  else if (formatKeywords.length > 0) { score += 1; bullets.push('✅ Format structure clear.'); categories.Format = 'good'; } 
  else { bullets.push('⚠️ Format vague—add structural keyword.'); categories.Format = 'warn'; }

  // 7. Alignment bonus (0-1)
  const roleDomain = fields.role.toLowerCase();
  const taskDomain = fields.task.toLowerCase();
  const aligned = (roleDomain.includes('travel') && /trip|itinerary/.test(taskDomain)) ||
                  (roleDomain.includes('coach') && /workout|training|program/.test(taskDomain)) ||
                  (roleDomain.includes('planner') && /event|party|trip/.test(taskDomain));
  if (aligned) { score += 1; bullets.push('✅ Role aligns with task domain.'); categories.Alignment = 'good'; } else { bullets.push('⚠️ Role and task feel slightly misaligned.'); categories.Alignment = 'warn'; }

  // Cap & clean bullet empties
  score = Math.min(10, score);
  const cleaned = bullets.filter(b => b && b.trim().length > 0);

  // Pro version rewrite: augment weak areas
  const improved: CollectedFields = { ...fields };
  if (!roleHasDomain) improved.role = 'experienced ' + fields.role.toLowerCase();
  if (wordCount(fields.task) < 5) improved.task = (taskVerb ? fields.task : 'Plan ') + ' with clear phases and measurable outcome';
  if (numericConstraintItems.length < 2) improved.constraints = fields.constraints + ' | Duration: 5 days | Budget: add realistic range';
  if (audienceDescriptors.length === 0) improved.audience = 'group of friends in their 20s who enjoy social indoor activities';
  if (!specificsComplexity) improved.specifics = fields.specifics + ', backup rainy-day options, variations by energy level';
  if (formatKeywords.length === 0) improved.format = fields.format + ' with section headings (Overview, Day-by-Day, Tips)';

  const pro = assemblePrompt(improved) + ' Make outputs scoped, concise, and include optional variations.';

  return { score, bullets: cleaned, proVersion: pro, categories };
}

function enrich(text: string, addon: string) { return /provide|create|design|plan/i.test(text) ? text : addon + ': ' + text; }
function ensureVerb(text: string) { return /include|add|provide|incorporate/i.test(text) ? text : 'include ' + text; }

export const MultiTaskMaster = ({ lesson, onComplete, onBack }: MultiTaskMasterProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState<number | null>(null); // null until user confirms ready
  const [input, setInput] = useState("");
  const [fields, setFields] = useState<CollectedFields>({ role: '', task: '', constraints: '', audience: '', specifics: '', format: '' });
  const [evaluated, setEvaluated] = useState<EvaluationResult | null>(null);
  const [finished, setFinished] = useState(false);
  const [provisionalScore, setProvisionalScore] = useState<number>(0);
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

  const fieldHint = (stepKey: keyof CollectedFields, value: string): string | null => {
    const v = value.trim();
    if (v === '') return 'Try adding at least a little detail.';
    switch(stepKey) {
      case 'role':
        if (!/(planner|coach|expert|specialist|strategist|consultant|designer|chef|guide)/i.test(v)) return 'Add a descriptor (e.g. experienced, senior, specialist).';
        break;
      case 'task':
        if (!/^(plan|create|design|draft|generate|outline|develop|build|craft)\b/i.test(v)) return 'Start with an action verb like "Plan" or "Design".';
        if (v.split(/\s+/).length < 4) return 'Add scope or outcome to the task.';
        break;
      case 'constraints':
        if (!/\d/.test(v)) return 'Add at least one number (days, budget, count).';
        if (v.split(/[,;]| and /).length < 2) return 'Add a second constraint (budget, time, limit).';
        break;
      case 'audience':
        if (v.split(/\s+/).length < 3) return 'Add descriptors (age, experience, interest).';
        break;
      case 'specifics':
        if (!/,| and |;/.test(v) && v.split(/\s+/).length < 4) return 'Add multiple specifics separated by commas.';
        break;
      case 'format':
        if (!/(list|bullet|schedule|outline|table|steps?)/i.test(v)) return 'Specify a structure like list, outline, or schedule.';
        break;
    }
    return null;
  };

  const handleSubmitInput = () => {
    if (input.trim() === '' || currentStep === null) return;
    const step = steps[currentStep];
    pushUser(input.trim());
    setFields(f => ({ ...f, [step.key]: input.trim() }));
    setInput('');
    // Provisional evaluation after each field
    const partialEval = evaluatePrompt({ ...fields, [step.key]: input.trim() });
    setProvisionalScore(partialEval.score);
    const hint = fieldHint(step.key, input.trim());
    if (hint) setTimeout(() => pushBot('💡 Hint: ' + hint), 250);
    setTimeout(() => pushBot(`(Provisional score so far: ${partialEval.score}/10 — will improve with more detail.)`), 300);
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
              <div className="mt-4 space-y-3">
                <div className="text-center text-sm font-medium">Session Score: {evaluated.score}/10</div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {Object.entries(evaluated.categories).map(([cat, status]) => {
                    const color = status === 'good' ? 'bg-green-100 text-green-800 border-green-300' : status === 'warn' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-red-100 text-red-800 border-red-300';
                    const label = status === 'good' ? 'Good' : status === 'warn' ? 'Needs More' : 'Missing';
                    return (
                      <span key={cat} className={`text-xs px-2 py-1 rounded border font-medium ${color}`}>{cat}: {label}</span>
                    );
                  })}
                </div>
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