export function logEvent(name: string, data?: Record<string, any>) {
  console.log('[Analytics]', name, data);
}
