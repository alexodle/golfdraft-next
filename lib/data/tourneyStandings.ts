import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { omit } from 'lodash';
import { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient, UseQueryResult } from 'react-query';
import { useTourneyId } from '../ctx/AppStateCtx';
import { DbTourneyStandingPlayerScore, DbTourneyStandings, TourneyStandingPlayerDayScore, TourneyStandingPlayerScore, TourneyStandings as ModelTourneyStandings, WorstDayScore } from '../models';
import { adminSupabase, SupabaseClient } from '../supabase';
import { useSharedSubscription } from './subscription';

const TOURNEY_STANDINGS_TABLE = 'tourney_standings';
const TOURNEY_STANDINGS_PLAYER_SCORES_TABLE = 'tourney_standings_player_scores';

export type TourneyStandings = ModelTourneyStandings & Readonly<{
  standings: TourneyStandingPlayerScore[]
}>;

export function useTourneyStandings(): UseQueryResult<TourneyStandings> {
  const tourneyId = useTourneyId();
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient();

  const queryClientKey = useMemo(() => getTourneyStandingsQueryKey(tourneyId), [tourneyId]);

  const result = useQuery<TourneyStandings>(queryClientKey, async () => {
    return await getTourneyStandings(tourneyId, supabase);
  });

  useSharedSubscription<TourneyStandings>(TOURNEY_STANDINGS_TABLE, `tourneyId=eq.${tourneyId}`, useCallback((ev) => {
    if (ev.eventType === 'UPDATE') {
      queryClient.invalidateQueries(queryClientKey);
    }
  }, [queryClient, queryClientKey]), { disabled: !result.isSuccess });

  return result;
}

export async function getTourneyStandings(tourneyId: number, supabase: SupabaseClient): Promise<TourneyStandings> {
  const result = await supabase
    .from(TOURNEY_STANDINGS_TABLE)
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

  const { worstScoresForDay, tourney_standings_player_scores: dbPlayerScores, ...tourneyStandings } = result.data as (DbTourneyStandings & { tourney_standings_player_scores: DbTourneyStandingPlayerScore[] });

  const standings = dbPlayerScores.map<TourneyStandingPlayerScore>(s => ({
    ...s,
    dayScores: JSON.parse(s.dayScores) as TourneyStandingPlayerDayScore[],
  }))
  .sort((a, b) => a.standing - b.standing); 

  return {
    ...tourneyStandings,
    worstScoresForDay: worstScoresForDay ? JSON.parse(worstScoresForDay) as WorstDayScore[] : [],
    standings,
  };
}

export async function updateTourneyStandings(tourneyStanding: TourneyStandings): Promise<void> {
  const dbTourneyStandings: DbTourneyStandings = { 
    ...omit(tourneyStanding, 'standings'),
    worstScoresForDay: JSON.stringify(tourneyStanding.worstScoresForDay) 
  };
  const playerScores = tourneyStanding.standings.map<DbTourneyStandingPlayerScore>(s => ({
    ...s,
    dayScores: JSON.stringify(s.dayScores),
  }));
  
  const [result1, result2] = await Promise.all([
    adminSupabase()
      .from(TOURNEY_STANDINGS_TABLE)
      .upsert(dbTourneyStandings),
    adminSupabase()
      .from(TOURNEY_STANDINGS_PLAYER_SCORES_TABLE)
      .upsert(playerScores)
  ]);

  for (const result of [result1, result2]) {
    if (result.error) {
      console.dir(result.error);
      throw new Error(`Failed to upsert tourneyStanding player scores: ${tourneyStanding.tourneyId}`);
    }
  }
}

function getTourneyStandingsQueryKey(tourneyId: number): unknown[] {
  return [TOURNEY_STANDINGS_TABLE, tourneyId];
}
