import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PromptScore } from '@/types/game';
import { useToast } from '@/hooks/use-toast';

export function usePromptScoring() {
  const [isScoring, setIsScoring] = useState(false);
  const { toast } = useToast();

  const scorePrompt = async (
    prompt: string,
    context?: string,
    expectedType?: string
  ): Promise<PromptScore | null> => {
    setIsScoring(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('score-prompt', {
        body: { prompt, context, expectedType }
      });

      if (error) throw error;

      return data as PromptScore;
    } catch (error) {
      console.error('Error scoring prompt:', error);
      toast({
        title: 'Scoring Error',
        description: 'Unable to score prompt. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsScoring(false);
    }
  };

  return { scorePrompt, isScoring };
}
