import { useEffect, useMemo } from 'react';
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from 'react-query';
import { useTourneyId } from '../ctx/AppStateCtx';
import { DraftSettings } from '../models';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { openSharedSubscription } from './subscription';

const DRAFT_SETTINGS_TABLE = 'draft_settings';

export function useDraftSettings(): UseQueryResult<DraftSettings> {
  const tourneyId = useTourneyId();
  const queryClient = useQueryClient();
  const queryClientKey = useMemo(() => getDraftSettingsQueryClientKey(tourneyId), [tourneyId]);

  const result = useQuery<DraftSettings>(queryClientKey, async () => {
    return await getDraftSettings(tourneyId);
  });

  useEffect(() => {
    if (!result.isSuccess) {
      return;
    }

    const sub = openSharedSubscription<DraftSettings>(`${DRAFT_SETTINGS_TABLE}:tourneyId=eq.${tourneyId}`, (ev) => {
      if (ev.eventType === 'UPDATE' || ev.eventType === 'INSERT') {
        queryClient.setQueryData(queryClientKey, ev.new);
      }
    });

    return () => {
      sub.unsubscribe();
    }
  }, [queryClient, queryClientKey, tourneyId, result.isSuccess]);

  return result;
}

export function useDraftSettingsMutation(): UseMutationResult<unknown, unknown, DraftSettings, unknown> {
  const queryClient = useQueryClient();

  const draftSettingsMutation = useMutation(async (settings: DraftSettings) => {
    await upsertDraftSettings(settings);
  }, {
    onMutate: (settings) => {
      const key = getDraftSettingsQueryClientKey(settings.tourneyId);
      queryClient.setQueryData<DraftSettings>(key, settings);
    },
    onError: (e, settings) => {
      console.dir(e);
      const key = getDraftSettingsQueryClientKey(settings.tourneyId);
      queryClient.invalidateQueries(key);
    }
  });

  return draftSettingsMutation;
}

export async function getDraftSettings(tourneyId: number, supabase = supabaseClient): Promise<DraftSettings> {
  const result = await supabase.from<DraftSettings>(DRAFT_SETTINGS_TABLE)
    .select(`*`)
    .eq('tourneyId', tourneyId);
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch tourney: ${tourneyId}`);
  }
  return result.data[0] ?? {
    tourneyId,
    draftHasStarted: false,
    isDraftPaused: false,
    allowClock: true,
  };
}

export async function upsertDraftSettings(settings: DraftSettings, supabase = supabaseClient): Promise<DraftSettings> {
  const result = await supabase
    .from<DraftSettings>(DRAFT_SETTINGS_TABLE)
    .upsert(settings, { onConflict: 'tourneyId' })
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