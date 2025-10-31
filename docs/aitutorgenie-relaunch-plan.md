# AITutorGenie Relaunch Plan

## 1. Product Vision

AITutorGenie reimagines the Prompt Wizardry prototype as an adaptive prompt-engineering arcade. Each session runs as a 60-second challenge loop guided by a tutoring agent that diagnoses learner gaps and prescribes the next micro-game. Inspired by the mastery-tracking approach in [OATutor](https://github.com/CAHLR/OATutor), the system keeps lightweight learner models, scaffolds hints, and offers worked solutions that grow in depth as the learner struggles.

### Core Principles
- **Kid-clear UX:** Every instruction is phrased so a 4th-grader could follow along without losing adult-level rigor.
- **One big action per screen:** Each game presents a single interaction pattern (tap, type, drag) with an oversized primary button for focus.
- **Explain the "why":** After every turn, the agent explains the rationale for both the feedback and the next recommended activity.
- **Adaptive pacing:** Fatigue, streaks, and hint usage influence the next-game choice and difficulty ramp.
- **Data minimalism:** Store only the mastery signals, anonymized events, and authored game templates—no personal text is persisted without the learner’s consent.

## 2. Game Catalog Overview

Ten replayable games cover core prompt-engineering sub-skills. Each shares a consistent contract: `explain`, `render`, `validate`, `feedback`, and `nextItem`.

| # | Game | Focus Skill | Loop Highlights |
|---|------|-------------|-----------------|
|1|**Promptle**|Tone, audience, format selection|Wordle-like slot guessing with “Right / Almost / Not yet” feedback, auto-clues after two misses.|
|2|**Two Prompts and a Lie**|Error diagnosis|Spot the flawed prompt, justify the flaw, receive micro-lesson and fix.|
|3|**Prompt Sudoku**|Constraint harmonizing|Fill 3×3 grid without conflicts; conflicts highlighted if idle.|
|4|**Tone or No-Tone**|Audience empathy|Pick tone cards to match scenario; shows sample line for chosen tones.|
|5|**Prompt Remix**|Rewrite discipline|Transform vague prompt into crisp one-liner; rubric covers clarity, brevity, completeness.|
|6|**Prompt Crosswords**|Vocabulary & concepts|Solve 5×5 grids; each word unlocks a “Genie Tip.”|
|7|**Context Quest**|Clarifying questions|Ask best clarifier; reveals missing info and shows upgraded prompt.|
|8|**Role Roulette**|Persona alignment|Write as assigned persona with tone/jargon rubric.|
|9|**Chain Reaction**|Decomposition|Draft three micro-prompts that build toward big goal; validates order and coverage.|
|10|**Hallucination Hunt**|Verification habits|Identify suspect claim and craft a re-prompt demanding evidence.|

Each game follows the hint ladder (Clue → Pattern → Worked) and includes gentle protections (auto-clues, idle highlights, scaffold templates) to reduce frustration.

## 3. Agent Loop (LangGraph.js on Vercel)

1. **Plan:** Evaluate mastery, fatigue, streak, and recent results to pick `{next_game, target_skill, difficulty, hint_strategy}`.
2. **Select Item:** Pull a matching Firestore `items` document and hydrate UI payload.
3. **Hint Policy:** Monitor misses and hint taps; escalate from Clue to Worked Example per ladder.
4. **Reflect:** Update mastery probabilities, fatigue score, streak state, and log an event for analytics/audit.

Policies adapt difficulty down when mastery < 0.5, schedule quick wins when fatigue is high, and introduce mixed review (Memory Vault) after three consecutive wins.

## 4. Technical Architecture

- **Frontend:** Next.js (App Router) deployed on Vercel. Shared `GameBoard` layout component orchestrates instructions, inputs, hint button, and progress ring.
- **Agent Services:** Vercel Functions using LangGraph.js for the tutor workflow (`/api/plan`, `/api/reflect`, `/api/hint`). Firestore Admin SDK validates authenticated calls.
- **Authentication:** Firebase email-link auth for passwordless onboarding. Anonymous sessions upgrade to linked accounts seamlessly.
- **Data Layer:** Firestore collections
  - `profiles` – minimal learner metadata.
  - `mastery` – per skill probability, timestamps.
  - `sessions` – active learning sessions, streaks, fatigue.
  - `items` – authorable game templates (read-only client access).
  - `events` – append-only log of plans, results, hint usage.
- **Content Pipeline:** Game templates live in GitHub (`/content/<game>/<skill>/<difficulty>.json`). A CI script imports them into Firestore on deploy, ensuring version control for learning materials.

## 5. Learning Analytics & UX Signals

Track:
- **Time to First Win** per session.
- **Hint Efficiency** (hints used vs. correctness).
- **Mastery delta** per skill per session.
- **Drop-off points** (game + step where learners exit).
- **Mode impact** (difficulty vs. success).

Dashboards run off aggregated `events`. Planner rationales and outcomes stay auditable to debug agent decisions.

## 6. Implementation Roadmap

### Phase 0 – Foundations (Week 1)
- Bootstrap Next.js app on Vercel, connect Firebase SDKs, and scaffold Firestore security rules.
- Import 2 skills (Clarity, Context) with 5 items each across Promptle, Two Prompts and a Lie, and Context Quest.
- Implement `GameBoard` shell with explanation header, progress ring, streak indicator, and single CTA.

### Phase 1 – Agent Loop & Persistence (Weeks 2–3)
- Implement LangGraph.js planner and reflection nodes with mastery + fatigue model.
- Wire `/api/plan` and `/api/reflect` to Firestore `mastery` and `events` collections.
- Add hint ladder controller and analytics logging.

### Phase 2 – Game Catalogue Expansion (Weeks 3–5)
- Port remaining seven games, ensuring each abides by contract and hint ladder.
- Enrich content library per skill with easy/medium/hard variants.
- Add Memory Vault mixed-review mode triggered after six plays.

### Phase 3 – UX Polish & Safety (Week 6)
- Implement “Why this next?” rationale banner and “Stop for now” save state button.
- Add privacy copy (“What we store and why”) and fine-tune accessibility (keyboard, ARIA).
- Run usability passes with target learners; iterate on copy to maintain kid-clear tone.

### Phase 4 – Demo Readiness (Week 7)
- Capture scripted walkthrough with 3-minute demo link.
- Configure optional Firebase Scheduled Function for “Review Lamp” nudges.
- Document authoring workflow and agent behavior in repo wiki.

## 7. Future Enhancements

- Spaced review queue based on success/failure intervals.
- Variant testing for hint policies (A/B recorded via `events`).
- Persona sticker packs for Role Roulette and collectible badges for streak milestones.
- Optional personal-best leaderboards (opt-in, no public ranks).

---

This plan provides the roadmap for restarting the project as an adaptive prompt-engineering tutor, reusing the Prompt Wizardry foundation while aligning with OATutor-inspired mastery modeling and LangGraph.js agent orchestration.
