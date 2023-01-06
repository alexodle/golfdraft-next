import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { once } from 'lodash';

export type { SupabaseClient };

const supabaseUrl = require(process.env.NEXT_PUBLIC_SUPABASE_URL);

function require(v: string | undefined | null): string {
  if (!v) {
    throw new Error(`Missing required env var: ${v}`);
  }
  return v;
}

function requireEnv(v: string): string {
  const value = process.env[v];
  if (!value) {
    throw new Error(`Missing required env var: ${v}`);
  }
  return value;
}

export const adminSupabase = once(() => {
  return createClient(supabaseUrl, requireEnv('SUPABASE_SERVICE_KEY'));
});
