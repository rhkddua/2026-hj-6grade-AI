import { createClient } from '@supabase/supabase-js';

type PublicSupabaseConfig = {
  url?: string;
  publishableKey?: string;
};

function readRuntimeConfig(): PublicSupabaseConfig {
  if (typeof document === 'undefined') return {};

  return {
    url: document.documentElement.dataset.supabaseUrl,
    publishableKey: document.documentElement.dataset.supabasePublishableKey,
  };
}

// Sites keeps runtime variables on the Worker. The root layout places the two
// public Supabase values on the HTML element before this client code runs.
const runtimeConfig = readRuntimeConfig();
const supabaseUrl = (runtimeConfig.url ?? import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const supabasePublishableKey = (runtimeConfig.publishableKey ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabasePublishableKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null;
