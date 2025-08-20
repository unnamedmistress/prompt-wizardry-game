import { logEvent } from "@/lib/analytics";

const hintCache: Record<string, string> = {};

export async function getModelHint(lessonId: string, contextData: Record<string, unknown> = {}): Promise<string> {
  // Check in-memory cache
  if (hintCache[lessonId]) {
    return hintCache[lessonId];
  }

  // Check localStorage for cached hint
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(`hint_${lessonId}`);
    if (stored) {
      hintCache[lessonId] = stored;
      return stored;
    }
  }

  try {
    const res = await fetch('/api/functions/v1/generate-hint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, ...contextData })
    });

    const data = await res.json().catch(() => ({}));
    const hint = data.hint as string | undefined;
    if (!hint) {
      return 'No further hints available.';
    }

    hintCache[lessonId] = hint;
    if (typeof window !== "undefined") {
      localStorage.setItem(`hint_${lessonId}`, hint);
    }
    logEvent('model_hint_generated', { lessonId });
    return hint;
  } catch (e) {
    return 'No further hints available.';
  }
}
