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
  const [alignmentTweaked, setAlignmentTweaked] = useState(false);
  const [customMode, setCustomMode] = useState(false); // unlock manual typing
  const [tip, setTip] = useState<string | null>(null); // inline compact tip
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

  const fieldTip = (stepKey: keyof CollectedFields, value: string): string | null => {
    const v = value.trim();
    if (v === '') return 'Add a little more detail.';
    switch(stepKey) {
      case 'role': if (!/(planner|coach|expert|specialist|strategist|consultant|designer|chef|guide)/i.test(v)) return 'Add a descriptor (e.g. experienced).'; break;
      case 'task': if (!/^(plan|create|design|draft|generate|outline|develop|build|craft)\b/i.test(v)) return 'Start with an action verb.'; if (v.split(/\s+/).length < 4) return 'Add scope/outcome.'; break;
      case 'constraints': if (!/\d/.test(v)) return 'Add a number.'; if (v.split(/[,;]| and /).length < 2) return 'Add another constraint.'; break;
      case 'audience': if (v.split(/\s+/).length < 3) return 'Add audience descriptors.'; break;
      case 'specifics': if (!/,| and |;/.test(v) && v.split(/\s+/).length < 4) return 'List multiple specifics.'; break;
      case 'format': if (!/(list|bullet|schedule|outline|table|steps?)/i.test(v)) return 'State a structure.'; break;
    }
    return null;
  };

  const handleSubmitInput = (override?: string) => {
    if (currentStep === null) return;
    const raw = (override ?? input).trim();
    if (raw === '') return;
    const step = steps[currentStep];
    pushUser(raw);
    setFields(f => ({ ...f, [step.key]: raw }));
    setInput('');
    const partialEval = evaluatePrompt({ ...fields, [step.key]: raw });
    setProvisionalScore(partialEval.score);
    setTip(fieldTip(step.key, raw));
    const next = currentStep + 1;
    if (next < steps.length) {
      setCurrentStep(next);
      setTimeout(() => pushBot(steps[next].prompt), 240);
    } else {
      setCurrentStep(next);
      const assembled = assemblePrompt({ ...fields, [step.key]: raw });
      setTimeout(() => {
        pushBot('Great! Here is the prompt you built:');
        pushBot('"' + assembled + '"');
        pushBot('Now let’s test it! I’ll score it for clarity, detail, and effectiveness.');
        const result = evaluatePrompt({ ...fields, [step.key]: raw });
        setEvaluated(result);
        pushBot(`✅ Score: ${result.score}/10`);
        result.bullets.forEach(b => pushBot('📌 ' + b));
        pushBot('Pro Version: "' + result.proVersion + '"');
        pushBot('Want to try another challenge? Next: plan a surprise birthday party!');
        if (result.categories.Alignment !== 'good') {
          pushBot('🌀 Domain Clash! Your role & task vibe are a bit off. Scroll below for a "Mismatch Remix" to adjust.');
        }
      }, 360);
    }
  };

  // Guided suggestion presets (first round no typing required)
  const suggestions: Record<keyof CollectedFields, string[]> = {
    role: ['experienced travel planner', 'certified fitness coach', 'creative event designer', 'strategic study mentor'],
    task: ['plan a 5-day European rail itinerary', 'design a balanced 4-week strength program', 'create a themed birthday party outline', 'outline a focused 2-hour study sprint'],
    constraints: ['$1500 budget, 2 people, mid-May', '4 weeks, 3 sessions/week, minimal equipment', 'indoors, 15 guests, 3-hour window', '120 minutes total, 3 subjects, Pomodoro timing'],
    audience: ['a foodie couple in their 30s', 'beginner adults returning to fitness', 'a group of mixed-age friends', 'two college students before exams'],
    specifics: ['backup rainy-day options, local hidden gems', 'progressive overload, recovery tips', 'lighting, music playlist, surprise element', 'energy management, micro-break techniques'],
    format: ['day-by-day schedule with bullet lists', 'weekly table with phases & notes', 'sectioned outline (Setup | Activities | Finale)', 'timed checklist with intervals']
  };

  const renderSuggestions = () => {
    if (currentStep === null || evaluated || customMode) return null;
    const step = steps[currentStep];
    if (!step) return null;
    return (
      <div className="mt-4 space-y-2">
        <div className="flex flex-wrap gap-2">
          {suggestions[step.key].map(opt => (
            <Button key={opt} size="sm" variant="outline" className="text-xs" onClick={() => handleSubmitInput(opt)}>
              {opt}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px]" onClick={() => setCustomMode(true)}>Custom input</Button>
          {tip && <span className="text-[11px] text-muted-foreground flex items-center gap-1">💡 {tip}</span>}
        </div>
      </div>
    );
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
          <CardTitle className="text-xl font-bold">🧠 Multi-Task Master</CardTitle>
          <CardDescription>Build powerful prompts by adding components one at a time</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Visual Pipeline Progress */}
          {currentStep !== null && !evaluated && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Building Your Prompt</span>
                <span className="text-xs text-muted-foreground">{currentStep}/{steps.length} components</span>
              </div>
              <div className="flex items-center gap-2">
                {steps.map((step, idx) => (
                  <div key={step.key} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      idx < currentStep ? 'bg-green-500 text-white' :
                      idx === currentStep ? 'bg-primary text-primary-foreground animate-pulse' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {idx < currentStep ? '✓' : idx + 1}
                    </div>
                    {idx < steps.length - 1 && (
                      <div className={`h-0.5 w-8 transition-colors ${
                        idx < currentStep ? 'bg-green-500' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="relative h-[460px] overflow-y-auto border rounded-md p-4 bg-muted/30 space-y-4 text-sm">
            {provisionalScore > 0 && !evaluated && currentStep !== null && (
              <div className="absolute top-2 right-2 flex items-center gap-1 text-[11px] font-medium bg-primary/10 border border-primary/30 text-primary px-2 py-1 rounded-full backdrop-blur-sm shadow-sm animate-pulse">
                <Sparkles className="w-3 h-3" />
                <span>Score ~ {provisionalScore}/10</span>
              </div>
            )}
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
                <div className="text-center text-lg font-bold text-primary animate-scale-in">
                  <Sparkles className="w-6 h-6 inline mr-2" />
                  Session Score: {evaluated.score}/10
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(evaluated.categories).map(([cat, status]) => {
                    const configs = {
                      good: { color: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400', icon: '✓', label: 'Good' },
                      warn: { color: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400', icon: '⚠', label: 'Improve' },
                      bad: { color: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400', icon: '✗', label: 'Missing' }
                    };
                    const config = configs[status];
                    return (
                      <div key={cat} className={`text-xs px-2 py-2 rounded border font-medium ${config.color} flex flex-col items-center gap-1 animate-fade-in`}>
                        <span className="text-base">{config.icon}</span>
                        <span className="font-bold">{cat}</span>
                        <span className="text-[10px]">{config.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Guided Suggestions / Input Area */}
          {!evaluated && (
            <div className="mt-4 space-y-3">
              {currentStep === null && (
                <Button className="w-full" onClick={advance}>Start Guided Build <ArrowRight className="w-4 h-4 ml-1" /></Button>
              )}
              {renderSuggestions()}
              {customMode && currentStep !== null && currentStep < steps.length && (
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSubmitInput(); }}
                    placeholder={steps[currentStep]?.placeholder || ''}
                    className="flex-1 px-3 py-2 rounded border bg-background"
                    disabled={currentStep >= steps.length}
                  />
                  <Button onClick={() => handleSubmitInput()} disabled={input.trim()==='' || currentStep >= steps.length}>Send</Button>
                </div>
              )}
            </div>
          )}

          {evaluated && (
            <>
              {evaluated.categories.Alignment !== 'good' && !alignmentTweaked && (
                <div className="mt-6 border rounded-md p-4 bg-background/70 space-y-3">
                  <div className="text-sm font-semibold flex items-center gap-2">⚔️ Mismatch Remix <span className="text-xs font-normal text-muted-foreground">(role ↔ task tuning)</span></div>
                  <p className="text-xs text-muted-foreground leading-snug">Your role and task domains don’t strongly align. Choose a remix below or keep the creative clash. Each button instantly re-evaluates.</p>
                  <RemixBar fields={fields} setFields={setFields} setEvaluated={setEvaluated} evaluated={evaluated} pushBot={pushBot} setAlignmentTweaked={setAlignmentTweaked} />
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="secondary" onClick={handleReplay}><RotateCcw className="w-4 h-4 mr-1" />Replay</Button>
                <Button onClick={handleComplete} disabled={finished}><Sparkles className="w-4 h-4 mr-1" />Finish & Save</Button>
                <Button variant="outline" onClick={onBack} className="ml-auto">Back</Button>
                {!customMode && <Button variant="ghost" size="sm" onClick={() => setCustomMode(true)}>Refine Manually</Button>}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// --- Remix Component for Alignment Suggestions ---
interface RemixBarProps { 
  fields: CollectedFields; 
  setFields: (f: CollectedFields | ((prev: CollectedFields)=>CollectedFields)) => void; 
  setEvaluated: (e: EvaluationResult) => void; 
  evaluated: EvaluationResult | null; 
  pushBot: (m: string) => void;
  setAlignmentTweaked: (v:boolean)=>void;
}

function detectTaskDomain(task: string) {
  const t = task.toLowerCase();
  if (/trip|itinerary|travel|destination/.test(t)) return 'travel';
  if (/workout|training|fitness|exercise|program/.test(t)) return 'fitness';
  if (/event|party|celebration|wedding|conference/.test(t)) return 'event';
  return 'generic';
}

function domainRole(domain: string) {
  switch(domain){
    case 'travel': return 'experienced travel itinerary strategist';
    case 'fitness': return 'certified strength & conditioning coach';
    case 'event': return 'creative event experience planner';
    default: return 'specialist consultant';
  }
}

function augmentTaskForRole(role: string, task: string) {
  if (/travel/.test(role) && !/itinerary|trip/.test(task.toLowerCase())) return task + ' with a structured day-by-day itinerary';
  if (/coach|fitness/.test(role) && !/progress|phases?/.test(task.toLowerCase())) return task + ' with progressive phases and recovery guidance';
  if (/event/.test(role) && !/schedule|run ?of ?show/.test(task.toLowerCase())) return task + ' including a run-of-show schedule';
  return task;
}

function crossDomainPerspective(role: string, task: string) {
  return `${task}. Leverage unique insights from the perspective of a ${role} to add unexpected value.`;
}

const RemixBar = ({ fields, setFields, setEvaluated, evaluated, pushBot, setAlignmentTweaked }: RemixBarProps) => {
  if (!evaluated) return null;
  const domain = detectTaskDomain(fields.task);
  const alignedRole = domainRole(domain);
  const roleAdjust = () => {
    const newFields = { ...fields, role: alignedRole };
    const res = evaluatePrompt(newFields);
    setFields(newFields);
    setEvaluated(res);
    pushBot('🔧 Remixed role to match task domain.');
    setAlignmentTweaked(true);
  };
  const taskAdjust = () => {
    const newTask = augmentTaskForRole(fields.role, fields.task);
    const newFields = { ...fields, task: newTask };
    const res = evaluatePrompt(newFields);
    setFields(newFields);
    setEvaluated(res);
    pushBot('🛠️ Enhanced task to leverage chosen role.');
    setAlignmentTweaked(true);
  };
  const embraceMismatch = () => {
    const newTask = crossDomainPerspective(fields.role, fields.task);
    const newFields = { ...fields, task: newTask };
    const res = evaluatePrompt(newFields);
    setFields(newFields);
    setEvaluated(res);
    pushBot('🎭 Keeping mismatch but framing it as a creative perspective.');
    setAlignmentTweaked(true);
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={roleAdjust}>Align Role</Button>
        <Button size="sm" variant="outline" onClick={taskAdjust}>Refine Task</Button>
        <Button size="sm" variant="secondary" onClick={embraceMismatch}>Embrace Mismatch</Button>
      </div>
      <p className="text-[10px] text-muted-foreground">Pick one: replace role, enhance task, or keep mismatch with an explicit cross-domain angle.</p>
    </div>
  );
};