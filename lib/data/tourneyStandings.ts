import { DbTourneyStandingPlayerScore, DbTourneyStandings, TourneyStandingGolferScore, TourneyStandingPlayerDayScore, TourneyStandingPlayerScore, TourneyStandings as ModelTourneyStandings, WorstDayScore } from '../models';
import { adminSupabase } from '../supabase';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';

const TOURNEY_STANDINGS_TABLE = 'tourney_standings';
const TOURNEY_STANDINGS_PLAYER_SCORES_TABLE = 'tourney_standings_player_scores';

export type TourneyStandings = ModelTourneyStandings & Readonly<{
  standings: TourneyStandingPlayerScore[]
}>;

export async function getTourneyStandings(tourneyId: number, supabase = supabaseClient): Promise<TourneyStandings> {
  const result = await supabase
    .from<DbTourneyStandings & { tourney_standings_player_scores: DbTourneyStandingPlayerScore[] }>(TOURNEY_STANDINGS_TABLE)
    .select(`
      *,
      tourney_standings_player_scores (
        *
      )
    `)
    .eq('tourneyId', tourneyId)
    .single();

  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch tourney stadings: ${tourneyId}`);
  }

  const { worstScoresForDay, tourney_standings_player_scores: dbPlayerScores, ...tourneyStandings } = result.data;

  return {
    ...tourneyStandings,
    worstScoresForDay: worstScoresForDay ? JSON.parse(worstScoresForDay) as WorstDayScore[] : [],
    standings: dbPlayerScores.map(s => ({
      ...s,
      dayScores: JSON.parse(s.dayScores) as TourneyStandingPlayerDayScore[],
    })),
  };
}

export async function updateTourneyStandings(tourneyStanding: TourneyStandings, playerScores: TourneyStandingPlayerScore[]): Promise<void> {
  const [result1, result2] = await Promise.all([
    adminSupabase()
      .from<DbTourneyStandings>(TOURNEY_STANDINGS_TABLE)
      .upsert({ ...tourneyStanding, worstScoresForDay: JSON.stringify(tourneyStanding.worstScoresForDay) }, { returning: 'minimal' }),
    adminSupabase()
      .from<DbTourneyStandingPlayerScore>(TOURNEY_STANDINGS_PLAYER_SCORES_TABLE)
      .upsert(playerScores.map(s => ({
        ...s,
        dayScores: JSON.stringify(s.dayScores),
      })))
  ]);

  for (const result of [result1, result2]) {
    if (result.error) {
      console.dir(result.error);
      throw new Error(`Failed to upsert tourneyStanding player scores: ${tourneyStanding.tourneyId}`);
    }
  }
}
