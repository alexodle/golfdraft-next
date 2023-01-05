import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { PostgrestResponse, SupabaseClient } from '@supabase/supabase-js';
import { useCallback, useMemo } from 'react';
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from 'react-query';
import { useTourneyId } from '../ctx/AppStateCtx';
import { CompletedDraftPick, DraftPick, DraftPickList, Golfer, PendingDraftPick } from '../models';
import { adminSupabase } from '../supabase';
import { difference, union } from '../util/sets';
import { useGolfers } from './golfers';
import { useSharedSubscription } from './subscription';
import { useCurrentUser } from './users';

const DRAFT_PICKS_TABLE = 'draft_pick';
const DRAFT_AUTO_PICK_TABLE = 'draft_auto_pick';

export function useDraftPicks(): UseQueryResult<DraftPick[]> {
  const tourneyId = useTourneyId();
  const queryClient = useQueryClient();
  const queryClientKey = useMemo(() => getDraftPicksQueryClientKey(tourneyId), [tourneyId]);
  const supabase = useSupabaseClient();

  const result = useQuery<DraftPick[]>(queryClientKey, async () => {
    return await getDraftPicks(tourneyId, supabase);
  });

  useSharedSubscription<DraftPick>(DRAFT_PICKS_TABLE, `tourneyId=eq.${tourneyId}`, useCallback((ev) => {
    if (ev.eventType === 'UPDATE') {
      queryClient.setQueryData<DraftPick[]>(queryClientKey, (curr) => {
        return (curr ?? []).map(dp => dp.tourneyId === ev.new.tourneyId && dp.pickNumber === ev.new.pickNumber ? ev.new : dp);
      });
    }
  }, [queryClient, queryClientKey]), { disabled: !result.isSuccess });

  return result;
}

export function useCompleteDraftPicks(): UseQueryResult<CompletedDraftPick[]> {
  const tourneyId = useTourneyId();
  const queryClientKey = [ ...getDraftPicksQueryClientKey(tourneyId), 'completed' ];
  const supabase = useSupabaseClient();

  const result = useQuery(queryClientKey, async () => {
    return await getCompletedDraftPicks(tourneyId, supabase);
  });

  return result;
}

export function useDraftPicker(): { 
  pickMutation: UseMutationResult<unknown, unknown, { pendingDraftPick: PendingDraftPick, golferId: number}, unknown>; 
  autoPickMutation: UseMutationResult<unknown, unknown, PendingDraftPick, unknown>; 
} {
  const queryClient = useQueryClient();
  const tourneyId = useTourneyId();
  const supabase = useSupabaseClient();
  const user = useCurrentUser();

  const pickMutation = useMutation(async ({ pendingDraftPick: draftPick, golferId }: { pendingDraftPick: PendingDraftPick, golferId: number}) => {
    const result = await supabase.rpc('make_pick', {
      tourney_id: tourneyId, 
      user_id: draftPick.userId,
      pick_number: draftPick.pickNumber, 
      golfer_id: golferId,
    });
    return result;
  }, {
    onMutate: ({ pendingDraftPick, golferId }) => {
      const queryClientKey = getDraftPicksQueryClientKey(pendingDraftPick.tourneyId);
      queryClient.setQueryData<DraftPick[]>(queryClientKey, (curr) => {
        const completedPick: CompletedDraftPick = { 
          ...pendingDraftPick, 
          golferId, 
          clientTimestampEpochMillis: Date.now(), 
          timestampEpochMillis: Date.now(), 
          pickedByUserId: user?.id ?? -1 
        };
        return (curr ?? []).map(dp => dp.tourneyId === pendingDraftPick.tourneyId && dp.pickNumber === pendingDraftPick.pickNumber ? completedPick : dp);
      });
    },
    onError: (e, { pendingDraftPick }) => {
      console.dir(e);
      const queryClientKey = getDraftPicksQueryClientKey(pendingDraftPick.tourneyId);
      queryClient.invalidateQueries(queryClientKey);
    }
  });

  const autoPickMutation = useMutation(async (draftPick: PendingDraftPick) => {
    const result = await supabase.rpc('make_pick_list_or_wgr_pick', { 
      tourney_id: draftPick.tourneyId, 
      pick_number: draftPick.pickNumber, 
      user_id: draftPick.userId
    });
    return result;
  });

  return {
    pickMutation,
    autoPickMutation,
  }
}

export function useUndoLastPickMutation(): UseMutationResult<PostgrestResponse<any>, unknown, void, unknown> {
  const supabase = useSupabaseClient();
  const tourneyId = useTourneyId();

  const mutation = useMutation(async () => {
    const result = await supabase.rpc('undo_last_pick', { 
      tourney_id: tourneyId,
    });
    return result;
  });

  return mutation;
}

export function useRemainingGolfers(): Golfer[] | undefined {
  const { data: { golfers: allGolfers } = {} } = useGolfers();
  const { data: draftPicks } = useDraftPicks();

  const remaining = useMemo(() => {
    if (!allGolfers || !draftPicks) {
      return undefined;
    }

    const pickedGolfers = new Set(draftPicks.filter(isCompletedDraftPick).map(dp => dp.golferId));
    return allGolfers.filter(g => !pickedGolfers.has(g.id));
  }, [draftPicks, allGolfers]);

  return remaining;
}

export function useCurrentPick(): PendingDraftPick | 'none' | undefined {
  const pickResult = useDraftPicks();
  if (!pickResult.data) {
    return undefined;
  }

  const currentPick = pickResult.data.find(p => isPendingDraftPick(p)) as PendingDraftPick | undefined;
  return currentPick ?? 'none';
}

export function useAutoPickUsers(): UseQueryResult<Set<number>> {
  const tourneyId = useTourneyId();
  const queryClient = useQueryClient();
  const queryClientKey = useMemo(() => getAutoPickUsersQueryClientKey(tourneyId), [tourneyId]);
  const supabase = useSupabaseClient();

  const result = useQuery<Set<number>>(queryClientKey, async () => {
    return new Set(await getAutoPickUsers(tourneyId, supabase));
  });

  useSharedSubscription<DraftPickList>(DRAFT_AUTO_PICK_TABLE, `tourneyId=eq.${tourneyId}`, useCallback((ev) => {
    switch (ev.eventType) {
      case 'INSERT':
        return queryClient.setQueryData<Set<number>>(queryClientKey, (curr) => union(curr, ev.new.userId));
      case 'DELETE':
        return queryClient.setQueryData<Set<number>>(queryClientKey, (curr) => difference(curr ?? new Set(), ev.old.userId));
    }
  }, [queryClient, queryClientKey]), { disabled: !result.isSuccess });

  return result;
}

export function useAutoPickUsersMutation(): UseMutationResult<void, unknown, { userId: number; autoPick: boolean; }> {
  const tourneyId = useTourneyId();
  const queryClient = useQueryClient();
  const queryClientKey = useMemo(() => getAutoPickUsersQueryClientKey(tourneyId), [tourneyId]);
  const supabase = useSupabaseClient();
  
  const mutation = useMutation(async ({ userId, autoPick }: { userId: number; autoPick: boolean; }) => {
    const result = autoPick ? 
      await supabase.from(DRAFT_AUTO_PICK_TABLE).upsert({ userId, tourneyId }) :
      await supabase.from(DRAFT_AUTO_PICK_TABLE).delete().match({ userId, tourneyId });
    if (result.error) {
      console.dir(result.error);
      throw new Error(`Failed to update auto pick for user: ${userId}, tourney: ${tourneyId}`);
    }
  }, {
    onMutate: ({ userId, autoPick }) => {
      queryClient.setQueryData<Set<number>>(queryClientKey, (curr) => autoPick ? union(curr, userId) : difference(curr ?? new Set(), userId));
    },
    onError: (e) => {
      console.dir(e);
      queryClient.invalidateQueries(queryClientKey);
    }
  });

  return mutation;
}

export async function getIsDraftComplete(tourneyId: number, supabase: SupabaseClient): Promise<boolean> {
  const result = await supabase.from(DRAFT_PICKS_TABLE)
    .select('tourneyId')
    .eq('tourneyId', tourneyId)
    .is('golferId', null)
    .limit(1);
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch picks`);
  }
  return result.data.length === 0;
}

export async function getDraftPicks(tourneyId: number, supabase: SupabaseClient): Promise<DraftPick[]> {
  const result = await supabase
    .from(DRAFT_PICKS_TABLE)
    .select('*')
    .eq('tourneyId', tourneyId)
    .order('pickNumber');
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch picks`);
  }
  return result.data;
}

export async function getCompletedDraftPicks(tourneyId: number, supabase: SupabaseClient): Promise<CompletedDraftPick[]> {
  const result = await supabase.from(DRAFT_PICKS_TABLE)
    .select('*')
    .eq('tourneyId', tourneyId)
    .not('golferId', 'is', null)
    .order('pickNumber');
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch completed picks`);
  }
  return result.data;
}

export async function setDraftPicks(tourneyId: number, draftPicks: PendingDraftPick[]): Promise<PendingDraftPick[]> {
  const deleteResult = await adminSupabase().from(DRAFT_PICKS_TABLE).delete().match({ tourneyId });
  if (deleteResult.error) {
    console.dir(deleteResult.error);
    throw new Error(`Failed to remove existing picks`);
  }

  const result = await adminSupabase().from(DRAFT_PICKS_TABLE).insert(draftPicks).select().single();
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to add new picks`);
  }
  
  return result.data;
}

export async function getAutoPickUsers(tourneyId: number, supabase: SupabaseClient): Promise<number[]> {
  const result = await supabase
    .from(DRAFT_AUTO_PICK_TABLE)
    .select('userId')
    .eq('tourneyId', tourneyId);
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch auto picks`);
  }
  return result.data.map(pl => pl.userId);
}

export function isPendingDraftPick(dp: DraftPick): dp is PendingDraftPick {
  return !isCompletedDraftPick(dp);
}

export function isCompletedDraftPick(dp: DraftPick): dp is CompletedDraftPick {
  return dp.golferId !== undefined && dp.golferId !== null;
}

function getDraftPicksQueryClientKey(tourneyId: number): unknown[] {
  return [DRAFT_PICKS_TABLE, tourneyId];
}

function getAutoPickUsersQueryClientKey(tourneyId: number): unknown[] {
  return [DRAFT_AUTO_PICK_TABLE, tourneyId];
}
