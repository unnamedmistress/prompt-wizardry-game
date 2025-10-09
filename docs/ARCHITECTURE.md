# System Architecture - Prompt Wizardry Progression Systems

## Overview

This document provides a technical overview of the progression and reward systems architecture implemented to align with the roadmap for creating a wizard-themed prompt engineering academy.

## Component Hierarchy

```
Index (Main App)
├── Header
│   ├── Navigation
│   └── Status Display
│       ├── Wizard Rank (e.g., "Apprentice", "Adept")
│       ├── XP Counter (e.g., "125 XP")
│       ├── Coins Counter (existing)
│       └── Stars Counter (existing)
│
├── Learning Path View
│   ├── Progress Section (Grid: 2 columns)
│   │   ├── WizardProgressBar
│   │   │   ├── Current Rank Display
│   │   │   ├── XP Progress Bar
│   │   │   └── Next Rank Preview
│   │   └── DailySpellTrial
│   │       ├── Today's Challenge Info
│   │       ├── Streak Counter
│   │       └── Start Challenge Button
│   │
│   ├── Achievements Section
│   │   └── AchievementGrimoire
│   │       └── Achievement Grid (2 columns on desktop)
│   │           ├── First Steps
│   │           ├── No-Hint Hero
│   │           ├── First Try Triumph
│   │           ├── Week Warrior
│   │           ├── Dedicated Student
│   │           ├── Master Learner
│   │           ├── Initiate Achieved
│   │           └── Adept Mastery
│   │
│   └── Lesson Categories
│       └── Lesson Cards (existing)
│
└── Game Play View
    ├── MultiAttemptWrapper (new)
    │   ├── Attempt Tracker
    │   ├── Progress Bar
    │   ├── Attempt History
    │   └── Status Messages
    └── Game Component (existing)
        └── Challenge Content
```

## State Management Flow

```
useGameStore (Zustand + Persist)
├── Progression State
│   ├── xp: number
│   ├── wizardRank: string
│   ├── level: number (existing)
│   ├── completedChallenges: number (existing)
│   └── completedExperienceIds: string[] (existing)
│
├── Rewards State
│   ├── coins: number (existing)
│   ├── stars: number (existing)
│   ├── arcaneTokens: number (new)
│   └── achievements: string[] (new)
│
├── Engagement State
│   ├── dailyStreak: number
│   ├── lastDailyDate: string | null
│   └── firstTimeExperiences: string[] (existing)
│
└── Analytics State
    └── attemptRecords: Record<string, AttemptRecord>
        └── {
              lessonId: string
              attempts: number
              hintsUsed: number
              completed: boolean
              bestScore: number
            }
```

## Data Flow Diagrams

### Lesson Completion Flow

```
User completes lesson
    ↓
onComplete(score) called
    ↓
completeExperience(id, stars, coins)
    ↓
┌─────────────────────────────┐
│ GameStore Updates:          │
│ 1. Add coins (parameter)    │
│ 2. Add stars (parameter)    │
│ 3. Calculate XP (stars×20)  │
│ 4. Update wizardRank        │
│ 5. Award tokens (stars÷2)   │
│ 6. Increment challenges     │
│ 7. Add to completed IDs     │
└─────────────────────────────┘
    ↓
┌─────────────────────────────┐
│ Side Effects:               │
│ • Check for achievements    │
│ • Log analytics event       │
│ • Update UI displays        │
│ • Persist to localStorage   │
└─────────────────────────────┘
    ↓
UI updates automatically via React hooks
```

### Achievement Unlock Flow

```
Lesson completed OR
Daily streak updated OR
Rank threshold reached
    ↓
Achievement condition checked
    ↓
    Is condition met?
    ├─ No → Continue
    └─ Yes ↓
        unlockAchievement(id)
            ↓
        ┌─────────────────────────┐
        │ GameStore Updates:      │
        │ 1. Add to achievements  │
        │ 2. Award 5 tokens       │
        └─────────────────────────┘
            ↓
        Log analytics event
            ↓
        Show notification (future)
```

### XP and Rank Progression

```
XP Gained (e.g., 60 XP from 3 stars)
    ↓
addXP(60) or completeExperience()
    ↓
newXP = currentXP + amount
    ↓
calculateWizardRank(newXP)
    ↓
┌────────────────────────────────┐
│ Rank Thresholds:               │
│ Apprentice: 0 XP               │
│ Initiate:   100 XP  ← User at  │
│ Adept:      300 XP             │
│ Sage:       600 XP             │
│ Archmage:   1000 XP            │
└────────────────────────────────┘
    ↓
wizardRank = "Initiate"
    ↓
Update UI (header, progress bar)
    ↓
Check for rank achievements
```

### Daily Streak Logic

```
User opens app
    ↓
checkDailyStreak() called
    ↓
today = "2024-01-15"
lastDailyDate = "2024-01-14"
    ↓
    Is same date?
    ├─ Yes → No change
    └─ No ↓
        Is yesterday?
        ├─ Yes → dailyStreak++
        │        lastDailyDate = today
        │        Log streak_updated
        └─ No → dailyStreak = 1
                 lastDailyDate = today
                 Log streak_reset
    ↓
Update DailySpellTrial UI
```

### Multi-Attempt Flow

```
User starts lesson
    ↓
MultiAttemptWrapper renders
    ↓
currentAttempt = 1
maxAttempts = 3
    ↓
User submits answer
    ↓
submitAttempt(score, success)
    ↓
    Record attempt
    │
    ├─ Success = true OR
    │  currentAttempt >= maxAttempts
    │  └─> onFinalComplete(bestScore, attemptsUsed)
    │      ├─ Calculate final score
    │      ├─ Apply hint penalties
    │      └─ Complete lesson
    │
    └─ Success = false AND
       attemptsRemaining > 0
       └─> currentAttempt++
           Show feedback
           Enable retry
```

## Type System Architecture

```typescript
// Core Experience Definition
interface LearningExperience {
  // Existing fields (backward compatible)
  id: string
  title: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  category: string
  // ... other existing fields
  
  // New progression fields
  moduleTier?: "Initiate" | "Adept" | "Archmage"
  maxAttempts?: number
  hintPenalty?: number
  evaluationRubric?: EvaluationCriteria[]
}

// Evaluation System
interface EvaluationCriteria {
  name: string          // "Role Clarity"
  description: string   // What to measure
  weight: number        // Must sum to 1.0
  keywords?: string[]   // Detection patterns
}

// Progression Tracking
interface WizardRank {
  name: string          // "Apprentice"
  minXP: number         // 0
  title: string         // "Apprentice Wizard"
  icon: string          // "🧙‍♂️"
}

// Achievement System
interface Achievement {
  id: string            // "first-lesson"
  name: string          // "First Steps"
  description: string   // Details
  icon: string          // Emoji
  requirement: string   // Condition type
  reward: number        // Arcane tokens
}

// Analytics
interface AttemptRecord {
  lessonId: string
  attempts: number
  hintsUsed: number
  completed: boolean
  bestScore: number
}
```

## Analytics Events

All events are logged via `logEvent()` from `@/lib/analytics`:

```typescript
// Existing events
'lesson_completed' → { lessonId, stars, coins }
'hint_purchased' → { lessonId, hintIndex, cost }

// New events
'xp_gained' → { amount }
'achievement_unlocked' → { achievementId }
'attempt_recorded' → { lessonId, attempt, score, hintsUsed, completed }
'daily_streak_updated' → { streak }
'tokens_spent' → { amount }
```

## Storage Architecture

### LocalStorage Structure
```javascript
// Zustand persist middleware
{
  "promptwizard-store": {
    "state": {
      // Legacy fields
      "coins": 150,
      "stars": 12,
      "level": 4,
      "completedChallenges": 12,
      "completedExperienceIds": ["what-is-ai", "role-mastery", ...],
      "firstTimeExperiences": ["what-is-ai", ...],
      
      // New progression fields
      "xp": 240,
      "wizardRank": "Initiate",
      "arcaneTokens": 18,
      "achievements": ["first-lesson", "dedicated-student"],
      "dailyStreak": 5,
      "lastDailyDate": "2024-01-15",
      
      // Analytics
      "attemptRecords": {
        "role-mastery": {
          "lessonId": "role-mastery",
          "attempts": 2,
          "hintsUsed": 1,
          "completed": true,
          "bestScore": 85
        }
      }
    },
    "version": 0
  }
}
```

## Component Communication Patterns

### Props Flow (Unidirectional)
```
Index
  ↓ (props)
MultiAttemptWrapper
  ↓ (render props)
Game Component
  ↓ (callbacks)
MultiAttemptWrapper.submitAttempt()
  ↓ (callbacks)
Index.handleExperienceComplete()
  ↓ (store action)
useGameStore.completeExperience()
```

### State Subscription (Observer)
```
useGameStore (Zustand)
  ↓ (subscribe)
WizardProgressBar component
  ↓ (reads)
{ xp, wizardRank }
  ↓ (renders)
Updated UI
```

### Effect Chains
```
User action
  ↓
Store update
  ↓
React re-render
  ↓
useEffect in component
  ↓
Side effect (e.g., check achievements)
  ↓
Additional store update if needed
  ↓
React re-render
```

## Performance Considerations

### Optimization Strategies

1. **Memoization**
   - Rank calculations cached in store
   - Achievement checks only on relevant events
   - Component re-renders minimized via Zustand selectors

2. **Persistence**
   - Zustand persist middleware handles serialization
   - Only store state changes trigger localStorage writes
   - No manual JSON.stringify/parse needed

3. **Lazy Loading**
   - Components loaded on demand
   - Achievement checking deferred until relevant
   - Daily trial only checked on mount

4. **Event Throttling**
   - Analytics events batched where possible
   - Streak checks only once per app load
   - Attempt recording happens on submit, not keystroke

## Security Considerations

### Data Validation
- XP values validated as numbers
- Rank calculations use safe math operations
- Achievement IDs validated against known set
- Date parsing uses safe methods

### State Protection
- No direct state mutation (Zustand immutability)
- Achievements can only be added, not removed
- Streak can't be artificially inflated
- Token spending validates balance

## Extensibility Points

### Adding New Features

**New Achievement:**
```typescript
// 1. Add to ACHIEVEMENTS array in AchievementGrimoire.tsx
{
  id: 'speed-master',
  name: 'Speed Master',
  description: 'Complete a lesson in under 2 minutes',
  icon: '⚡',
  requirement: 'completionTime',
  threshold: 120
}

// 2. Add unlock logic in lesson completion flow
if (completionTime < 120) {
  unlockAchievement('speed-master');
}
```

**New Wizard Rank:**
```typescript
// Update WIZARD_RANKS in useGameStore.ts
{ name: 'Grandmaster', minXP: 2000, title: 'Grandmaster Wizard' }
```

**New Daily Challenge:**
```typescript
// Add to DAILY_CHALLENGES in DailySpellTrial.tsx
{
  id: 'bonus-challenge',
  title: 'Weekend Bonus',
  timeLimit: 600,
  xpReward: 100
}
```

## Migration Strategy

### Backward Compatibility
- All new fields are optional
- Existing lessons work without changes
- Store gracefully handles missing fields
- Default values provided for new state

### Data Migration
```typescript
// Store initialization handles missing fields
{
  xp: state.xp ?? 0,
  wizardRank: state.wizardRank ?? 'Apprentice',
  arcaneTokens: state.arcaneTokens ?? 0,
  achievements: state.achievements ?? [],
  dailyStreak: state.dailyStreak ?? 0,
  lastDailyDate: state.lastDailyDate ?? null,
  attemptRecords: state.attemptRecords ?? {}
}
```

## Testing Strategy

### Unit Testing (Future)
- Store actions (addXP, unlockAchievement)
- Rank calculation logic
- Streak validation
- Achievement unlock conditions

### Integration Testing (Future)
- Full lesson completion flow
- Multi-attempt scenarios
- Daily challenge workflow
- Achievement unlock flow

### User Testing
- Playtest with target audience
- Monitor completion rates
- Gather feedback on progression speed
- Validate achievement attainability

## Deployment Considerations

### Environment Variables
- Analytics endpoint configuration
- Feature flags for gradual rollout
- A/B testing variants

### Monitoring
- Track XP distribution
- Monitor achievement unlock rates
- Analyze streak retention
- Watch for anomalies in attempt counts

## Future Architecture Plans

### Phase 4: Social Features
- Add multiplayer state management
- Implement leaderboard API integration
- Create guild data structures
- Add replay storage system

### Phase 5: Analytics
- Implement metrics aggregation
- Create dashboard data pipeline
- Add A/B testing framework
- Build content versioning system

## References

- [Lesson Schema Documentation](./lesson-schema.md)
- [Roadmap Implementation](./roadmap-implementation.md)
- [Features Documentation](./FEATURES.md)
- Zustand: https://github.com/pmndrs/zustand
- React: https://react.dev
