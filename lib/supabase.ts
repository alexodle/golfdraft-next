
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {once} from 'lodash';

export type { SupabaseClient };

const supabaseUrl = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = requireEnv('NEXT_PUBLIC_SUPABASE_KEY');

const supabase = createClient(supabaseUrl, supabaseKey);

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

export default supabase;
