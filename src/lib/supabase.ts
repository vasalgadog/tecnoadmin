import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'x-client-info': 'tecnoadmin',
    },
    // fetch nativo con timeout para evitar peticiones colgadas de 15s
    fetch: (url, options = {}) => {
      return fetch(url, {
        ...options,
        signal: options?.signal || AbortSignal.timeout(15000),
      });
    },
  },
});

