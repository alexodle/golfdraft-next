import { createBrowserClient } from '@supabase/ssr';
import { supabaseAnonKey, supabaseUrl } from './constants';

export function createClient() {
  const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return supabase;
}
