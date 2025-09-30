import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { usePromptScoring } from '@/hooks/usePromptScoring';
import { PromptScore } from '@/types/game';
import { Loader2, Sparkles, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PromptTester() {
  const [prompt, setPrompt] = useState('');
  const [score, setScore] = useState<PromptScore | null>(null);
  const { scorePrompt, isScoring } = usePromptScoring();

  const handleTest = async () => {
    if (!prompt.trim()) return;
    
    const result = await scorePrompt(prompt);
    if (result) {
      setScore(result);
    }
  };

  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-green-500';
    if (value >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreGrade = (value: number) => {
    if (value >= 90) return 'A';
    if (value >= 80) return 'B';
    if (value >= 70) return 'C';
    if (value >= 60) return 'D';
    return 'F';
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">AI Prompt Tester</h2>
          </div>

          <Textarea
            placeholder="Enter your prompt here to get instant AI-powered feedback..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[150px] text-base"
          />

          <Button 
            onClick={handleTest} 
            disabled={isScoring || !prompt.trim()}
            className="w-full"
          >
            {isScoring ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Test Prompt
              </>
            )}
          </Button>
        </div>
      </Card>

      <AnimatePresence>
        {score && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6 space-y-6">
              {/* Overall Score */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className={`text-6xl font-bold ${getScoreColor(score.overall)} mb-2`}
                >
                  {getScoreGrade(score.overall)}
                </motion.div>
                <p className="text-2xl font-bold text-foreground">{score.overall}/100</p>
                <p className="text-muted-foreground">Overall Score</p>
              </div>

              {/* Category Scores */}
              <div className="space-y-4">
                {[
                  { name: 'Clarity', value: score.clarity },
                  { name: 'Specificity', value: score.specificity },
                  { name: 'Context', value: score.context },
                  { name: 'Structure', value: score.structure },
                ].map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category.name}</span>
                      <Badge variant="secondary" className={getScoreColor(category.value)}>
                        {category.value}/100
                      </Badge>
                    </div>
                    <Progress value={category.value} className="h-2" />
                  </div>
                ))}
              </div>

              {/* Feedback */}
              {score.feedback && score.feedback.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    Detailed Feedback
                  </h3>
                  <div className="space-y-2">
                    {score.feedback.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`flex gap-3 p-3 rounded-lg ${
                          item.type === 'strength' 
                            ? 'bg-green-500/10 border border-green-500/20'
                            : item.type === 'weakness'
                            ? 'bg-red-500/10 border border-red-500/20'
                            : 'bg-blue-500/10 border border-blue-500/20'
                        }`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {item.type === 'strength' ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : item.type === 'weakness' ? (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          ) : (
                            <Lightbulb className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium capitalize">{item.category}</p>
                          <p className="text-sm text-muted-foreground mt-1">{item.message}</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {item.impact} impact
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {score.suggestions && score.suggestions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold">💡 Improvement Suggestions</h3>
                  <ul className="space-y-2">
                    {score.suggestions.map((suggestion, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 + 0.3 }}
                        className="flex gap-2 text-sm text-muted-foreground"
                      >
                        <span className="text-primary">•</span>
                        <span>{suggestion}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
