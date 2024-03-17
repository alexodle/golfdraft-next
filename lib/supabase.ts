import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { once } from 'lodash';
import { supabaseUrl } from './supabase/constants';

export type { SupabaseClient };

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
