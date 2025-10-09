# Lesson Schema Documentation

## Overview
This document defines the structure and requirements for creating lessons in the Prompt Wizardry Game. The schema supports a progression-based learning experience with module tiers, multi-attempt mechanics, and rubric-based evaluation.

## Module Taxonomy

Lessons are organized into three progressive tiers:

1. **Initiate (Basics)**
   - Focus: Clarity, structure, tone setting
   - Target: New prompt engineers
   - Complexity: Simple, single-concept challenges

2. **Adept (Intermediate)**
   - Focus: Role-play, context management, handling constraints
   - Target: Learners with basic prompting knowledge
   - Complexity: Multi-component challenges

3. **Archmage (Advanced)**
   - Focus: Hallucination mitigation, adversarial prompts, multi-turn strategies
   - Target: Experienced prompt engineers
   - Complexity: Complex, nuanced scenarios

## Lesson Schema

### Required Fields

```typescript
{
  "id": string,                    // Unique identifier (kebab-case)
  "title": string,                 // Display name
  "description": string,           // Short description (1-2 sentences)
  "difficulty": "Beginner" | "Intermediate" | "Advanced",
  "category": string,              // Grouping category
  "icon": string,                  // Emoji icon
  "objective": string,             // Learning goal
  "whatYoullLearn": string[],     // Learning outcomes (3-5 items)
  "hints": string[],              // Progressive hints (3-5 items)
  "goodExamples": string[],       // Example prompts (2-3)
  "badExamples": string[],        // Counter-examples (2-3)
  "gameComponent": string         // React component name
}
```

### Optional Fields (New)

```typescript
{
  "moduleTier": "Initiate" | "Adept" | "Archmage",  // Curriculum tier
  "maxAttempts": number,           // Default: 3
  "hintPenalty": number,          // Score reduction per hint (default: 5)
  "requiredStars": number,        // Prerequisites
  "evaluationRubric": [           // Scoring criteria
    {
      "name": string,              // Criterion name
      "description": string,       // What to evaluate
      "weight": number,            // 0.0 to 1.0 (must sum to 1.0)
      "keywords": string[]         // Keywords to detect (optional)
    }
  ]
}
```

## Content Authoring Checklist

- [ ] Unique, descriptive ID
- [ ] Clear, engaging title
- [ ] 1-2 sentence description
- [ ] Appropriate difficulty level
- [ ] Meaningful category
- [ ] Relevant emoji icon
- [ ] Specific, measurable objective
- [ ] 3-5 learning outcomes
- [ ] 3-5 progressive hints
- [ ] 2-3 good examples
- [ ] 2-3 bad examples
- [ ] Valid game component name
- [ ] Module tier assigned
- [ ] Evaluation rubric defined (weights sum to 1.0)
- [ ] Appropriate hint penalty
- [ ] Prerequisites set (if applicable)

## Testing Guidelines

Before publishing a lesson:
1. Validate JSON schema
2. Test all attempts (1st, 2nd, 3rd)
3. Verify hint progression
4. Check evaluation rubric weights
5. Playtest with target audience
6. Monitor completion rates
7. Adjust difficulty based on data
