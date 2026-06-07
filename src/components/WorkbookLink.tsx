import { ArrowLeft } from 'lucide-react';

// The workbook this game ships with. Players launch Prompt Wizardry from the
// "Think Clearly with AI" workbook, so every screen offers a clear way back.
// Same-tab navigation by design: the workbook is usually still open in the
// tab they came from.
const WORKBOOK_URL = 'https://www.myaievolution.com/privateworkbook';

/**
 * A small fixed pill, shown on every screen, that returns the player to the
 * workbook. Rendered once at the app root so it survives route changes.
 */
const WorkbookLink = () => (
  <a
    href={WORKBOOK_URL}
    title="Return to the Think Clearly with AI workbook"
    className="fixed bottom-4 left-4 z-50 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-card/80 px-3 py-2 text-sm text-muted-foreground shadow-lg backdrop-blur transition-colors hover:border-primary hover:text-primary"
  >
    <ArrowLeft className="h-4 w-4" />
    <span className="hidden sm:inline">Back to the workbook</span>
  </a>
);

export default WorkbookLink;
