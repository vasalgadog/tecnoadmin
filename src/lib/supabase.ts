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
    fetch: async (url, options = {}) => {
      const headers = new Headers(options.headers || {});

      try {
        const { data } = await supabase.auth.getSession();
        const token = data?.session?.access_token;
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      } catch {
        // Continue with default headers if session fetch fails
      }

      return fetch(url, {
        ...options,
        headers,
      });
    },
  },
});

