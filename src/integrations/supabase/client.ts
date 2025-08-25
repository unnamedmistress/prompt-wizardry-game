import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY; // canonical name

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Fail fast instead of silently using stale hard‑coded values
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment.');
}

console.log('Supabase config (sanitized):', { url: SUPABASE_URL, keyPrefix: SUPABASE_ANON_KEY.slice(0, 8) + '…' });

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});