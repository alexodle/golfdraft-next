import { createClient } from '../supabase/component';
import { SupabaseClient } from '@supabase/supabase-js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { QueryClient, useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from 'react-query';
import { useTourneyId } from '../ctx/AppStateCtx';
import { DraftSettings } from '../models';
import { useSharedSubscription } from './subscription';
import { useInterval } from 'usehooks-ts';

const DRAFT_SETTINGS_TABLE = 'draft_settings';

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

export function useHasDraftStarted(): boolean {
  const settings = useDraftSettings();

  const [nowEpoch, setNowEpoch] = useState(Date.now());

  const startEpoch = settings.data ? new Date(settings.data.draftStart).getTime() : undefined;
  const hasDraftStarted = !!startEpoch && startEpoch <= nowEpoch;

  useInterval(
    () => {
      setNowEpoch(Date.now());
    },
    !hasDraftStarted ? 5000 : null,
  );

  return hasDraftStarted;
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
