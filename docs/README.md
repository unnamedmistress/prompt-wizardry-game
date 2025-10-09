# Prompt Wizardry Documentation

Welcome to the Prompt Wizardry documentation. This directory contains comprehensive guides for developers, content authors, and stakeholders.

## Documentation Index

### For Developers

**[ARCHITECTURE.md](./ARCHITECTURE.md)** - System Architecture Overview
- Component hierarchy and data flow
- State management patterns
- Type system architecture
- Analytics events
- Performance considerations
- Security and extensibility

**[roadmap-implementation.md](./roadmap-implementation.md)** - Implementation Tracker
- Feature completion status
- Phase-by-phase progress
- Code change references
- Integration examples
- Success metrics
- Next steps

### For Content Authors

**[lesson-schema.md](./lesson-schema.md)** - Lesson Authoring Guide
- Module taxonomy (Initiate/Adept/Archmage)
- Required and optional fields
- Evaluation rubric design
- Hint system best practices
- Difficulty calibration
- Testing checklist

### For Product/Stakeholders

**[FEATURES.md](./FEATURES.md)** - Feature Documentation
- Complete feature descriptions
- Use cases and examples
- UI integration details
- Success metrics
- User benefits

## Quick Start

### For Developers
1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system design
2. Review [roadmap-implementation.md](./roadmap-implementation.md) for current status
3. Check component files in `src/components/` for implementation details

### For Content Authors
1. Start with [lesson-schema.md](./lesson-schema.md) to learn the structure
2. Review existing lessons in `src/data/lessons.json` for examples
3. Follow the content authoring checklist before publishing

### For Product Managers
1. Read [FEATURES.md](./FEATURES.md) to understand delivered features
2. Review [roadmap-implementation.md](./roadmap-implementation.md) for progress
3. Check success metrics section for KPIs

## Key Features Implemented

### ✅ Phase 1: Content Architecture
- Module taxonomy with 3 tiers
- Evaluation rubric system
- Structured lesson schema

### ✅ Phase 2: Core Mechanics
- Multi-attempt flow (3 tries per challenge)
- Tiered hint system with penalties
- Attempt tracking and analytics

### ✅ Phase 3: Progression & Rewards
- 5-tier wizard rank system
- XP and level progression
- 8 achievements with token rewards
- Daily spell trials with streak tracking
- Arcane token economy

### 🔜 Phase 4: Social & Competitive (Planned)
- Async duels
- Leaderboards
- Guilds and teams
- Replay sharing

### 🔜 Phase 5: Operational Foundations (Planned)
- Analytics dashboard
- Content versioning
- A/B testing
- Cost tracking

## New Components

All components are located in `src/components/`:

- **WizardProgressBar** - Shows current rank and XP progress
- **AchievementGrimoire** - Displays all achievements with unlock status
- **DailySpellTrial** - Daily challenge with streak tracking
- **MultiAttemptWrapper** - Manages 3-attempt challenge flow

## Updated Systems

- **GameStore** (`src/store/useGameStore.ts`) - Extended with progression, achievements, and analytics
- **Types** (`src/types.ts`) - New interfaces for rubrics, ranks, and achievements
- **Index** (`src/pages/Index.tsx`) - Integrated new progression UI components

## File Structure

```
docs/
├── README.md (this file)
├── ARCHITECTURE.md       - Technical architecture
├── FEATURES.md          - Feature documentation
├── lesson-schema.md     - Content authoring guide
└── roadmap-implementation.md - Progress tracker

src/
├── components/
│   ├── WizardProgressBar.tsx
│   ├── AchievementGrimoire.tsx
│   ├── DailySpellTrial.tsx
│   └── MultiAttemptWrapper.tsx
├── store/
│   └── useGameStore.ts (extended)
├── types.ts (extended)
└── data/
    └── lessons.json (updated with new schema)
```

## Contributing

### Adding New Features
1. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for design patterns
2. Follow existing component structure
3. Add TypeScript types in `src/types.ts`
4. Update store if needed in `src/store/useGameStore.ts`
5. Document changes in relevant docs

### Adding New Lessons
1. Follow [lesson-schema.md](./lesson-schema.md) specification
2. Use module tier appropriate for difficulty
3. Define evaluation rubric with balanced weights
4. Test with target audience before publishing
5. Monitor analytics after release

### Updating Documentation
- Keep docs synchronized with code changes
- Update relevant sections when adding features
- Include examples and use cases
- Document breaking changes prominently

## Support

For questions or issues:
1. Check existing documentation first
2. Review component implementation in `src/`
3. Consult the roadmap for planned features
4. Create an issue with detailed description

## Version History

### v1.0.0 - Roadmap Phases 1-3 Implementation
- Content architecture with module tiers
- Core mechanics with multi-attempt flow
- Progression systems (XP, ranks, achievements)
- Daily trials and token economy
- Comprehensive documentation

## License

See main repository for license information.
