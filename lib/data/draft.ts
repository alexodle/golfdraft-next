import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { pick } from 'lodash';
import { useEffect, useMemo } from 'react';
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from 'react-query';
import { UndoLastPickRequest } from '../../pages/api/commish/undoLastPick';
import { MakePickApiRequest } from '../../pages/api/draftPick';
import { useTourneyId } from '../ctx/AppStateCtx';
import { postJson } from '../legacy/js/fetch';
import { CompletedDraftPick, DraftAutoPick, DraftPick, DraftPickList, Golfer, PendingDraftPick } from '../models';
import { adminSupabase } from '../supabase';
import { difference, union } from '../util/sets';
import { useGolfers } from './golfers';
import { openSharedSubscription } from './subscription';
import { useCurrentUser } from './users';

const DRAFT_PICKS_TABLE = 'draft_pick';
const DRAFT_AUTO_PICK_TABLE = 'draft_auto_pick';

export function useDraftPicks(): UseQueryResult<DraftPick[]> {
  const tourneyId = useTourneyId();
  const queryClient = useQueryClient();

  const queryClientKey = useMemo(() => getDraftPicksQueryClientKey(tourneyId), [tourneyId]);

  const result = useQuery<DraftPick[]>(queryClientKey, async () => {
    return await getDraftPicks(tourneyId);
  });

  useEffect(() => {
    if (!result.isSuccess) {
      return;
    }
    const sub = openSharedSubscription<DraftPick>(`${DRAFT_PICKS_TABLE}:tourneyId=eq.${tourneyId}`, (ev) => {
      if (ev.eventType === 'UPDATE') {
        queryClient.setQueryData<DraftPick[]>(queryClientKey, (curr) => {
          return (curr ?? []).map(dp => dp.tourneyId === ev.new.tourneyId && dp.pickNumber === ev.new.pickNumber ? ev.new : dp);
        });
      }
    });
    return () => {
      sub.unsubscribe();
    }
  }, [queryClient, queryClientKey, tourneyId, result.isSuccess]);

  return result;
}

export function useCompleteDraftPicks(): UseQueryResult<CompletedDraftPick[]> {
  const tourneyId = useTourneyId();

  const queryClientKey = [ ...getDraftPicksQueryClientKey(tourneyId), 'completed' ];
  const result = useQuery(queryClientKey, async () => {
    return await getCompletedDraftPicks(tourneyId);
  });

  return result;
}

export function useDraftPicker(): { 
  pickMutation: UseMutationResult<CompletedDraftPick, unknown, { pendingDraftPick: PendingDraftPick, golferId: number}, unknown>; 
  autoPickMutation: UseMutationResult<unknown, unknown, PendingDraftPick, unknown>; 
} {
  const queryClient = useQueryClient();
  const myUser = useCurrentUser();

  const pickMutation = useMutation(async ({ pendingDraftPick: draftPick, golferId }: { pendingDraftPick: PendingDraftPick, golferId: number}) => {
    const req: MakePickApiRequest = { ...draftPick, golferId, clientTimestampEpochMillis: Date.now() };
    const result = await postJson<CompletedDraftPick>('/api/draftPick', req);
    return result;
  }, {
    onMutate: ({ pendingDraftPick, golferId }) => {
      const queryClientKey = getDraftPicksQueryClientKey(pendingDraftPick.tourneyId);
      queryClient.setQueryData<DraftPick[]>(queryClientKey, (curr) => {
        const completedPick: CompletedDraftPick = { ...pendingDraftPick, golferId, clientTimestampEpochMillis: Date.now(), timestampEpochMillis: Date.now(), pickedByUserId: myUser?.id ?? -1 };
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
    const result = await supabaseClient.rpc('make_pick_list_or_wgr_pick', { 
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

export function useUndoLastPickMutation(): UseMutationResult<void, unknown, number, unknown> {
  const mutation = useMutation(async (tourneyId: number) => {
    try {
      const req: UndoLastPickRequest = { tourneyId };
      await postJson('/api/commish/undoLastPick', req);
    } catch (e) {
      console.dir(e);
      throw new Error('Failed to undo last pick');
    } 
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

  const result = useQuery<Set<number>>(queryClientKey, async () => {
    return new Set(await getAutoPickUsers(tourneyId));
  });

  useEffect(() => {
    if (!result.isSuccess) {
      return;
    }

    const sub = openSharedSubscription<DraftPickList>(`${DRAFT_AUTO_PICK_TABLE}:tourneyId=eq.${tourneyId}`, (ev) => {
      switch (ev.eventType) {
        case 'INSERT':
          return queryClient.setQueryData<Set<number>>(queryClientKey, (curr) => union(curr, ev.new.userId));
        case 'DELETE':
          return queryClient.setQueryData<Set<number>>(queryClientKey, (curr) => difference(curr ?? new Set(), ev.old.userId));
      }
    });

    return () => {
      sub.unsubscribe();
    }
  }, [queryClient, queryClientKey, tourneyId, result.isSuccess]);

  return result;
}

export function useAutoPickUsersMutation(): UseMutationResult<void, unknown, { userId: number; autoPick: boolean; }> {
  const tourneyId = useTourneyId();
  const queryClient = useQueryClient();
  const queryClientKey = useMemo(() => getAutoPickUsersQueryClientKey(tourneyId), [tourneyId]);
  
  const mutation = useMutation(async ({ userId, autoPick }: { userId: number; autoPick: boolean; }) => {
    const result = autoPick ? 
      await supabaseClient.from<DraftAutoPick>(DRAFT_AUTO_PICK_TABLE).upsert({ userId, tourneyId }, { returning: 'minimal' }) :
      await supabaseClient.from<DraftAutoPick>(DRAFT_AUTO_PICK_TABLE).delete().match({ userId, tourneyId });
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

export async function getIsDraftComplete(tourneyId: number, supabase = supabaseClient): Promise<boolean> {
  const result = await supabase.from<DraftPick>(DRAFT_PICKS_TABLE)
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

export async function getCurrentDraftPick(tourneyId: number, supabase = supabaseClient): Promise<PendingDraftPick | undefined> {
  const result = await supabase.from<PendingDraftPick>(DRAFT_PICKS_TABLE)
    .select('tourneyId')
    .eq('tourneyId', tourneyId)
    .is('golferId', null)
    .order('pickNumber', { ascending: true })
    .limit(1);
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch picks`);
  }
  return result.data[0];
}

export async function getDraftPicks(tourneyId: number, supabase = supabaseClient): Promise<DraftPick[]> {
  const result = await supabase.from<DraftPick>(DRAFT_PICKS_TABLE).select('*').filter('tourneyId', 'eq', tourneyId).order('pickNumber');
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch picks`);
  }
  return result.data;
}

export async function getCompletedDraftPicks(tourneyId: number, supabase = supabaseClient): Promise<CompletedDraftPick[]> {
  const result = await supabase.from<CompletedDraftPick>(DRAFT_PICKS_TABLE)
    .select('*')
    .eq('tourneyId', tourneyId)
    .not('golferId',  'is', null)
    .order('pickNumber');
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch completed picks`);
  }
  return result.data;
}

export async function setDraftPicks(tourneyId: number, draftPicks: PendingDraftPick[]): Promise<PendingDraftPick[]> {
  const deleteResult = await adminSupabase().from<DraftPick>(DRAFT_PICKS_TABLE).delete().match({ tourneyId });
  if (deleteResult.error) {
    console.dir(deleteResult.error);
    throw new Error(`Failed to remove existing picks`);
  }

  const result = await adminSupabase().from<PendingDraftPick>(DRAFT_PICKS_TABLE).insert(draftPicks, { returning: 'representation' });
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to add new picks`);
  }
  
  return result.data;
}

export async function getAutoPickUsers(tourneyId: number, supabase = supabaseClient): Promise<number[]> {
  const result = await supabase.from<Pick<DraftAutoPick, 'userId' | 'tourneyId'>>(DRAFT_AUTO_PICK_TABLE).select('userId').filter('tourneyId', 'eq', tourneyId);
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch auto picks`);
  }
  return result.data.map(pl => pl.userId);
}

export async function undoLastPick(tourneyId: number, supbase = supabaseClient) {
  const result = await supbase.rpc('undo_last_pick', { tourney_id: tourneyId });
  if (result.error) {
    console.dir(result.error);
    throw new Error('Failed to undo last pick');
  }
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
