import { DbGolferScore, GolferScore, GolferScoreOverride } from '../models';
import { adminSupabase, SupabaseClient } from '../supabase';

const GOLFER_SCORE_TABLE = 'golfer_score';
const GOLFER_SCORE_OVERRIDE_TABLE = 'golfer_score_override';

export async function getGolferScores(tourneyId: number, supabase: SupabaseClient): Promise<GolferScore[]> {
  const result = await supabase
    .from(GOLFER_SCORE_TABLE)
    .select('*')
    .eq('tourneyId', tourneyId);
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch golfer scores for tourney: ${tourneyId}`);
  }
  return result.data.map(g => ({
    ...g,
    scores: JSON.parse(g.scores) as GolferScore['scores'],
  }));
}

export async function getGolferScoreOverrides(tourneyId: number, supabase: SupabaseClient): Promise<GolferScoreOverride[]> {
  const result = await supabase
    .from(GOLFER_SCORE_OVERRIDE_TABLE)
    .select('*')
    .eq('tourneyId', tourneyId);
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch golfer score overrides for tourney: ${tourneyId}`);
  }
  return result.data.map(g => ({
    ...g,
    scores: g.scores ? JSON.parse(g.scores) as GolferScoreOverride['scores'] : undefined,
  }));
}

export async function updateScores(scores: GolferScore[]): Promise<void> {
  const dbScores = scores.map<DbGolferScore>(g => ({ ...g, thru: g.thru ?? null, scores: JSON.stringify(g.scores) }));
  const result = await adminSupabase()
    .from(GOLFER_SCORE_TABLE)
    .upsert(dbScores, { onConflict: 'tourneyId, golferId' });
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to update golfer scores`);
  }
}
