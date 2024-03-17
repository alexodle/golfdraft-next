import { createClient as createClientPrimitive } from '@supabase/supabase-js';
import { supabaseAnonKey, supabaseUrl } from './constants';

export function createClient() {
  const supabase = createClientPrimitive(supabaseUrl, supabaseAnonKey);
  return supabase;
}
