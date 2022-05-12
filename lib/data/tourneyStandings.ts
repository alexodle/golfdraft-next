import { TourneyStandings, TourneyStandingScores } from '../models';
import supabase from '../supabase';

const TOURNEY_STANDINGS_TABLE = 'tourney_standings';
const TOURNEY_STANDING_SCORES_TABLE = 'tourney_standing_scores';

export async function getTourneyStandings(tourneyId: number): Promise<TourneyStandings[]> {
  const result = await supabase.from<TourneyStandings>(TOURNEY_STANDINGS_TABLE).select('*').eq('tourneyId', tourneyId);
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch tourney: ${tourneyId}`);
  }
  return result.data;
}

export async function getTourneyStandingScores(tourneyId: number): Promise<TourneyStandingScores[]> {
  const result = await supabase.from<TourneyStandingScores>(TOURNEY_STANDING_SCORES_TABLE).select('*').eq('tourneyId', tourneyId);
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch tourney: ${tourneyId}`);
  }
  return result.data;
}
