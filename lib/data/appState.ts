import { AppState } from '../models';
import { adminSupabase } from '../supabase';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';

const APP_STATE_TABLE = 'app_state';
const ID = 1;

export async function getAppStateFromDb(supabase = supabaseClient): Promise<AppState> {
  const result = await supabase.from<AppState>(APP_STATE_TABLE).select('*').eq('id', ID).single();
  if (result.error) {
    console.dir(result.error);
    throw new Error('Failed to fetch app state')
  }
  return result.data;
}

export async function getActiveTourneyId(supabase = supabaseClient): Promise<number> {
  return (await getAppStateFromDb(supabase)).activeTourneyId;
}

export async function upsertAppState(appState: Omit<AppState, 'id'>): Promise<void> {
  const result = await adminSupabase().from<AppState>(APP_STATE_TABLE).upsert({ ...appState, id: ID });
  if (result.error) {
    console.dir(result.error);
    throw new Error('Failed to update app state')
  }
}
