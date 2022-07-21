import { useEffect, useMemo } from 'react';
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from 'react-query';
import { useTourneyId } from '../ctx/AppStateCtx';
import { Tourney } from '../models';
import { adminSupabase} from '../supabase';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { openSharedSubscription } from './subscription';

const TOURNEY_TABLE = 'tourney';

export function useCurrentTourney(): UseQueryResult<Tourney> {
  const tourneyId = useTourneyId();
  const queryClient = useQueryClient();
  const queryClientKey = useMemo(() => getTourneyQueryClientKey(tourneyId), [tourneyId]);

  const result = useQuery<Tourney>(queryClientKey, async () => {
    return await getTourney(tourneyId);
  });

  useEffect(() => {
    if (!result.isSuccess) {
      return;
    }

    const sub = openSharedSubscription<Tourney>(`${TOURNEY_TABLE}:id=eq.${tourneyId}`, (ev) => {
      if (ev.eventType === 'UPDATE') {
        queryClient.setQueryData(queryClientKey, ev.new);
      }
    });

    return () => {
      sub.unsubscribe();
    }
  }, [queryClient, queryClientKey, tourneyId, result.isSuccess]);

  return result;
}

export function useTourneyMutation(): UseMutationResult<unknown, unknown, Partial<Tourney> & { id: number }, unknown> {
  const queryClient = useQueryClient();

  const tourneyMutation = useMutation(async (tourney: Partial<Tourney> & { id: number }) => {
    await updateTourney(tourney);
  }, {
    onMutate: (tourney) => {
      const key = getTourneyQueryClientKey(tourney.id);
      queryClient.setQueryData<Tourney>(key, (curr) => ({ ...curr, ...(tourney as Tourney) }));
    },
    onError: (e, tourney) => {
      console.dir(e);
      queryClient.invalidateQueries(getTourneyQueryClientKey(tourney.id));
    }
  });

  return tourneyMutation;
}

export type TourneyInfo = Pick<Tourney, 'id' | 'name' | 'startDateEpochMillis' | 'lastUpdatedEpochMillis'>;

export async function getAllTourneys(supabase = supabaseClient): Promise<TourneyInfo[]> {
  const result = await supabase.from<TourneyInfo>(TOURNEY_TABLE)
    .select('id, name, startDateEpochMillis, lastUpdatedEpochMillis')
    .order('startDateEpochMillis', { ascending: false });
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch tourneys`);
  }
  return result.data;
}

export async function getTourney(tourneyId: number, supabase = supabaseClient): Promise<Tourney> {
  const result = await supabase.from<Tourney>(TOURNEY_TABLE)
    .select(`
        *,
        commissioners (
          userId
        )
    `)
    .eq('id', tourneyId)
    .single();
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
    throw new Error(`Failed to upsert tourney`);
  }
  return { ...tourney, ...result.data };
}

export async function updateTourney(tourney: Partial<Tourney> & { id: number }): Promise<void> {
  const result = await adminSupabase()
    .from<Tourney>(TOURNEY_TABLE)
    .update(tourney, { returning: 'minimal' })
    .eq('id', tourney.id);
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to update tourney`);
  }
}

export async function touchTourney(tourneyId: number): Promise<Tourney> {
  const result = await adminSupabase().from<Tourney>(TOURNEY_TABLE)
    .update({ id: tourneyId, lastUpdatedEpochMillis: Date.now( )})
    .eq('id', tourneyId)
    .single();
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to create tourney`);
  }
  return result.data;
}

function getTourneyQueryClientKey(tourneyId: number): unknown[] {
  return [TOURNEY_TABLE, tourneyId];
}
