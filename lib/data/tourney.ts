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
  const { commissioners, ...tourneyData } = tourney;

  const result = await adminSupabase()
    .from<Tourney>(TOURNEY_TABLE)
    .upsert(tourneyData, { onConflict: 'name' })
    .single();

  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to upsert tourney`);
  }

  await updateCommissioners(result.data.id, commissioners);

  return { ...tourney, ...result.data };
}

export async function updateTourney(tourney: Partial<Tourney> & { id: number }): Promise<void> {
  const { commissioners, ...tourneyData } = tourney;

  const result = await adminSupabase()
    .from<Tourney>(TOURNEY_TABLE)
    .update(tourneyData, { returning: 'minimal' })
    .eq('id', tourney.id);

  await updateCommissioners(tourney.id, commissioners);

  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to update tourney`);
  }
}

export async function touchTourney(tourneyId: number): Promise<Tourney> {
  const result = await adminSupabase().from<Tourney>(TOURNEY_TABLE)
    .update({ lastUpdatedEpochMillis: Date.now( )})
    .eq('id', tourneyId)
    .single();
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to create tourney`);
  }
  return result.data;
}

async function updateCommissioners(tourneyId: number, commissioners: Tourney['commissioners']): Promise<void> {
  if (!commissioners) {
    return;
  }

  const results = [];

  results.push(await adminSupabase()
    .from('commissioners')
    .delete({ returning: 'minimal' })
    .eq('tourneyId', tourneyId));

  results.push(await adminSupabase()
    .from('commissioners')
    .insert(commissioners.map((c) => ({ userId: c.userId, tourneyId })), { returning: 'minimal' }));

  const errs = results.flatMap((r) => r.error ?? []);
  if (errs.length) {
    console.dir(errs);
    throw new Error(`Failed to update tourney`);
  }
}

function getTourneyQueryClientKey(tourneyId: number): unknown[] {
  return [TOURNEY_TABLE, tourneyId];
}
