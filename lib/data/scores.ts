import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { DbGolferScore, DbGolferScoreOverride, GolferScore, GolferScoreOverride } from '../models';
import { adminSupabase } from '../supabase';

const GOLFER_SCORE_TABLE = 'golfer_score';
const GOLFER_SCORE_OVERRIDE_TABLE = 'golfer_score_override';

export async function getGolferScores(tourneyId: number, supabase = supabaseClient): Promise<GolferScore[]> {
  const result = await supabase.from<DbGolferScore>(GOLFER_SCORE_TABLE).select('*');
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch golfer scores for tourney: ${tourneyId}`);
  }
  return result.data.map(g => ({
    ...g,
    scores: JSON.parse(g.scores) as GolferScore['scores'],
  }));
}

export async function getGolferScoreOverrides(tourneyId: number, supabase = supabaseClient): Promise<GolferScoreOverride[]> {
  const result = await supabase.from<DbGolferScoreOverride>(GOLFER_SCORE_OVERRIDE_TABLE).select('*');
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
  const dbScores = scores.map<DbGolferScore>(g => ({ ...g, scores: JSON.stringify(g.scores) }));
  const result = await adminSupabase().from<DbGolferScore>(GOLFER_SCORE_TABLE).upsert(dbScores, { onConflict: 'tourneyId, golferId', returning: 'minimal' });
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to update golfer scores`);
  }
}
