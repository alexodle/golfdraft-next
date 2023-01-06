import { AppState } from '../models';
import { adminSupabase, SupabaseClient } from '../supabase';

const APP_STATE_TABLE = 'app_state';
const ID = 1;

export async function getAppStateFromDb(supabase: SupabaseClient): Promise<AppState> {
  const result = await supabase.from(APP_STATE_TABLE).select('*').eq('id', ID).single();
  if (result.error) {
    console.dir(result.error);
    throw new Error('Failed to fetch app state');
  }
  return result.data;
}

export async function getActiveTourneyId(supabase: SupabaseClient): Promise<number> {
  return (await getAppStateFromDb(supabase)).activeTourneyId;
}

export async function upsertAppState(appState: Omit<AppState, 'id'>): Promise<void> {
  const result = await adminSupabase()
    .from(APP_STATE_TABLE)
    .upsert({ ...appState, id: ID });
  if (result.error) {
    console.dir(result.error);
    throw new Error('Failed to update app state');
  }
}
