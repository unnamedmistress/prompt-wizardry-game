export function logEvent(name: string, data?: Record<string, unknown>) {
  console.log('[Analytics]', name, data);
}
