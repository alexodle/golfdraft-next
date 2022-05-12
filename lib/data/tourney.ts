import { AppState, Tourney } from '../models';
import supabase from '../supabase';
import { UseQueryResult, useQuery, useQueryClient } from 'react-query';
import { useTourneyId } from '../ctx/AppStateCtx';
import { useMemo, useEffect } from 'react';

const TOURNEY_TABLE = 'tourney';

export function useCurrentTourney(): UseQueryResult<Tourney> {
  const tourneyId = useTourneyId();
  const queryClient = useQueryClient();
  const queryClientKey = useMemo(() => [TOURNEY_TABLE, tourneyId], [tourneyId]);

  const result = useQuery<Tourney>(queryClientKey, async () => {
    return await getTourney(tourneyId);
  });

  useEffect(() => {
    if (!result.isSuccess) {
      return;
    }

    const sub = supabase.from<Tourney>(`${TOURNEY_TABLE}:tourney_id=eq.${tourneyId}`)
      .on('UPDATE', (update) => {
        queryClient.setQueryData(queryClientKey, update.new);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(sub);
    }
  }, [queryClient, queryClientKey, tourneyId, result.isSuccess]);

  return result;
}

export type TourneyInfo = Pick<Tourney, 'id' | 'name' | 'startDateEpochMillis' | 'lastUpdatedEpochMillis'>;

export async function getAllTourneys(): Promise<TourneyInfo[]> {
  const result = await supabase.from<TourneyInfo>(TOURNEY_TABLE).select('id, name, startDateEpochMillis, lastUpdatedEpochMillis').order('startDateEpochMillis', { ascending: false });
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch tourneys`);
  }
  return result.data;
}

export async function getTourney(tourneyId: number): Promise<Tourney> {
  const result = await supabase.from<Tourney>(TOURNEY_TABLE).select('*').eq('id', tourneyId).single();
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch tourney: ${tourneyId}`);
  }
  return result.data;
}
