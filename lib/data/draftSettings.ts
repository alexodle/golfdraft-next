import { SupabaseClient } from '@supabase/supabase-js';
import { useCallback, useMemo } from 'react';
import { QueryClient, UseMutationResult, UseQueryResult, useMutation, useQuery, useQueryClient } from 'react-query';
import { useInterval } from 'usehooks-ts';
import { useTourneyId } from '../ctx/AppStateCtx';
import { DraftSettings } from '../models';
import { createClient } from '../supabase/component';
import { useSharedSubscription } from './subscription';

const DRAFT_SETTINGS_TABLE = 'draft_settings';
const HAS_DRAFT_STARTED_FUNC = 'has_draft_started';

export function useDraftSettings(): UseQueryResult<DraftSettings> {
  const tourneyId = useTourneyId();
  const queryClient = useQueryClient();
  const queryClientKey = useMemo(() => getDraftSettingsQueryClientKey(tourneyId), [tourneyId]);
  const supabase = createClient();

  const result = useQuery<DraftSettings>(queryClientKey, async () => {
    return await getDraftSettings(tourneyId, supabase);
  });

  useSharedSubscription<DraftSettings>(
    DRAFT_SETTINGS_TABLE,
    `tourneyId=eq.${tourneyId}`,
    useCallback(
      (ev) => {
        if (ev.eventType === 'UPDATE' || ev.eventType === 'INSERT') {
          queryClient.setQueryData(queryClientKey, ev.new);
        }
      },
      [queryClient, queryClientKey],
    ),
    { disabled: !result.isSuccess },
  );

  return result;
}

export function useHasDraftStarted(): UseQueryResult<boolean> {
  const tourneyId = useTourneyId();
  const supabase = createClient();

  const result = useQuery<boolean>(getHasDraftStartedQueryClientKey(tourneyId), async () => {
    return await getHasDraftStarted(tourneyId, supabase);
  });

  useInterval(
    () => {
      result.refetch();
    },
    result.data !== undefined && !result.data ? 5000 : null,
  );

  return result;
}

export function prefetchDraftSettings(
  tourneyId: number,
  queryClient: QueryClient,
  supabase: SupabaseClient,
): Promise<void> {
  return queryClient.prefetchQuery(getDraftSettingsQueryClientKey(tourneyId), async () => {
    return await getDraftSettings(tourneyId, supabase);
  });
}

export function prefetchHasDraftStarted(
  tourneyId: number,
  queryClient: QueryClient,
  supabase: SupabaseClient,
): Promise<void> {
  return queryClient.prefetchQuery(getHasDraftStartedQueryClientKey(tourneyId), async () => {
    return await getHasDraftStarted(tourneyId, supabase);
  });
}

export function useDraftSettingsMutation(): UseMutationResult<unknown, unknown, DraftSettings, unknown> {
  const queryClient = useQueryClient();
  const supabase = createClient();

  const draftSettingsMutation = useMutation(
    async (settings: DraftSettings) => {
      await upsertDraftSettings(settings, supabase);
    },
    {
      onMutate: (settings) => {
        const key = getDraftSettingsQueryClientKey(settings.tourneyId);
        queryClient.setQueryData<DraftSettings>(key, settings);
      },
      onError: (e, settings) => {
        console.dir(e);
        const key = getDraftSettingsQueryClientKey(settings.tourneyId);
        queryClient.invalidateQueries(key);
      },
    },
  );

  return draftSettingsMutation;
}

async function getHasDraftStarted(tourneyId: number, supabase: SupabaseClient): Promise<boolean> {
  const result = await supabase.rpc(HAS_DRAFT_STARTED_FUNC, { tourney_id: tourneyId });
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch has_draft_started: ${tourneyId}`);
  }
  return result.data;
}

async function getDraftSettings(tourneyId: number, supabase: SupabaseClient): Promise<DraftSettings> {
  const result = await supabase.from(DRAFT_SETTINGS_TABLE).select(`*`).eq('tourneyId', tourneyId);
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch tourney: ${tourneyId}`);
  }
  return (
    result.data[0] ?? {
      tourneyId,
      draftStart: new Date(2050, 1, 1),
      hasDraftStarted: false,
      isDraftPaused: false,
      allowClock: true,
    }
  );
}

export async function upsertDraftSettings(settings: DraftSettings, supabase: SupabaseClient): Promise<DraftSettings> {
  const result = await supabase
    .from(DRAFT_SETTINGS_TABLE)
    .upsert(settings, { onConflict: 'tourneyId' })
    .select()
    .single();

  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to upsert draft settings`);
  }

  return result.data;
}

function getDraftSettingsQueryClientKey(tourneyId: number): unknown[] {
  return [DRAFT_SETTINGS_TABLE, tourneyId];
}

function getHasDraftStartedQueryClientKey(tourneyId: number): unknown[] {
  return [HAS_DRAFT_STARTED_FUNC, tourneyId];
}
