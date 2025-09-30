import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, context, expectedType } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Score the prompt using AI
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert AI prompt evaluator. Analyze prompts for:
- Clarity (0-100): How clear and unambiguous is the request?
- Specificity (0-100): How specific and detailed are the instructions?
- Context (0-100): How much relevant context is provided?
- Structure (0-100): How well-organized and structured is the prompt?

Provide constructive feedback with specific examples of strengths and weaknesses.
Return your analysis as JSON with this exact structure:
{
  "clarity": <number>,
  "specificity": <number>,
  "context": <number>,
  "structure": <number>,
  "overall": <number>,
  "feedback": [
    {
      "type": "strength" | "weakness" | "tip",
      "category": "clarity" | "specificity" | "context" | "structure",
      "message": "<specific feedback>",
      "impact": "high" | "medium" | "low"
    }
  ],
  "suggestions": [
    "<specific improvement suggestion>"
  ]
}`
          },
          {
            role: 'user',
            content: `Evaluate this prompt:

Prompt: "${prompt}"
${context ? `Context: ${context}` : ''}
${expectedType ? `Expected output type: ${expectedType}` : ''}

Provide detailed scoring and feedback.`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from AI');
    }

    const scoreData = JSON.parse(content);
    
    console.log('Prompt scored:', { 
      overall: scoreData.overall,
      feedbackCount: scoreData.feedback?.length || 0 
    });

    return new Response(
      JSON.stringify(scoreData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error scoring prompt:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        overall: 0,
        clarity: 0,
        specificity: 0,
        context: 0,
        structure: 0,
        feedback: [],
        suggestions: ['Unable to score prompt at this time. Please try again.']
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
