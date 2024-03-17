import { useCallback, useMemo } from 'react';
import { QueryClient, UseQueryResult, useQuery, useQueryClient } from 'react-query';
import { useTourneyId } from '../ctx/AppStateCtx';
import { Tourney } from '../models';
import { SupabaseClient, adminSupabase } from '../supabase';
import { createClient } from '../supabase/component';
import { useSharedSubscription } from './subscription';

const TOURNEY_TABLE = 'tourney';

export function useCurrentTourney(): UseQueryResult<Tourney> {
  const tourneyId = useTourneyId();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const queryClientKey = useMemo(() => getTourneyQueryClientKey(tourneyId), [tourneyId]);

  const result = useQuery<Tourney>(queryClientKey, async () => {
    return await getTourney(tourneyId, supabase);
  });

  useSharedSubscription<Tourney>(
    TOURNEY_TABLE,
    `id=eq.${tourneyId}`,
    useCallback(
      (ev) => {
        if (ev.eventType === 'UPDATE') {
          queryClient.setQueryData(queryClientKey, ev.new);
        }
      },
      [queryClient, queryClientKey],
    ),
    { disabled: !result.isSuccess },
  );

  return result;
}

export function prefetchTourney(tourneyId: number, queryClient: QueryClient, supabase: SupabaseClient): void {
  queryClient.prefetchQuery(getTourneyQueryClientKey(tourneyId), async () => {
    return await getTourney(tourneyId, supabase);
  });
}

export type TourneyInfo = Pick<Tourney, 'id' | 'name' | 'startDateEpochMillis' | 'lastUpdatedEpochMillis'>;

export async function getAllTourneys(supabase: SupabaseClient): Promise<TourneyInfo[]> {
  const result = await supabase
    .from(TOURNEY_TABLE)
    .select('id, name, startDateEpochMillis, lastUpdatedEpochMillis')
    .order('startDateEpochMillis', { ascending: false });
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch tourneys`);
  }
  return result.data;
}

export async function getTourney(tourneyId: number, supabase: SupabaseClient): Promise<Tourney> {
  const result = await supabase
    .from(TOURNEY_TABLE)
    .select(
      `
        *,
        commissioners (
          userId
        )
    `,
    )
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
    .from(TOURNEY_TABLE)
    .upsert(tourneyData, { onConflict: 'name' })
    .select()
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

  const result = await adminSupabase().from(TOURNEY_TABLE).update(tourneyData).eq('id', tourney.id);

  await updateCommissioners(tourney.id, commissioners);

  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to update tourney`);
  }
}

export async function touchTourney(tourneyId: number): Promise<Tourney> {
  const result = await adminSupabase()
    .from(TOURNEY_TABLE)
    .update({ lastUpdatedEpochMillis: Date.now() })
    .eq('id', tourneyId)
    .select()
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

  results.push(await adminSupabase().from('commissioners').delete().eq('tourneyId', tourneyId));

  results.push(
    await adminSupabase()
      .from('commissioners')
      .insert(commissioners.map((c) => ({ userId: c.userId, tourneyId }))),
  );

  const errs = results.flatMap((r) => r.error ?? []);
  if (errs.length) {
    console.dir(errs);
    throw new Error(`Failed to update tourney`);
  }
}

function getTourneyQueryClientKey(tourneyId: number): unknown[] {
  return [TOURNEY_TABLE, tourneyId];
}
