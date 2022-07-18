import { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient, UseQueryResult } from 'react-query';
import { useTourneyId } from '../ctx/AppStateCtx';
import { Tourney } from '../models';
import { adminSupabase} from '../supabase';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';

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

    const sub = supabaseClient.from<Tourney>(`${TOURNEY_TABLE}:tourney_id=eq.${tourneyId}`)
      .on('UPDATE', (update) => {
        queryClient.setQueryData(queryClientKey, update.new);
      })
      .subscribe();

    return () => {
      supabaseClient.removeSubscription(sub);
    }
  }, [queryClient, queryClientKey, tourneyId, result.isSuccess]);

  return result;
}

export type TourneyInfo = Pick<Tourney, 'id' | 'name' | 'startDateEpochMillis' | 'lastUpdatedEpochMillis'>;

export async function getAllTourneys(supabase = supabaseClient): Promise<TourneyInfo[]> {
  const result = await supabase.from<TourneyInfo>(TOURNEY_TABLE).select('id, name, startDateEpochMillis, lastUpdatedEpochMillis').order('startDateEpochMillis', { ascending: false });
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch tourneys`);
  }
  return result.data;
}

export async function getTourney(tourneyId: number, supabase = supabaseClient): Promise<Tourney> {
  const result = await supabase.from<Tourney>(TOURNEY_TABLE).select('*').eq('id', tourneyId).single();
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch tourney: ${tourneyId}`);
  }
  return result.data;
}

export async function upsertTourney(tourney: Omit<Tourney, 'id'>): Promise<Tourney> {
  const result = await adminSupabase().from<Tourney>(TOURNEY_TABLE).upsert(tourney, { onConflict: 'name' }).single();
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to create tourney`);
  }
  return { ...tourney, ...result.data };
}

export async function touchTourney(tourneyId: number): Promise<Tourney> {
  const result = await adminSupabase().from<Tourney>(TOURNEY_TABLE).update({ id: tourneyId, lastUpdatedEpochMillis: Date.now( )}).single();
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to create tourney`);
  }
  return result.data;
}
