import { AppState } from '../models';
import supabase from '../supabase';

const APP_STATE_TABLE = 'app_state';

export async function getAppStateFromDb(): Promise<AppState> {
  const result = await supabase.from<AppState>(APP_STATE_TABLE).select('*').single();
  if (result.error) {
    console.dir(result.error);
    throw new Error('Failed to fetch app state')
  }
  return result.data;
}

export async function getActiveTourneyId(): Promise<number> {
  return await (await getAppStateFromDb()).activeTourneyId;
}
