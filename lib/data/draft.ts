import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { pick } from 'lodash';
import { useEffect, useMemo } from 'react';
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from 'react-query';
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
const DRAFT_PICK_LIST_TABLE = 'draft_pick_list';
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

export function useDraftPicker(): { 
  pickMutation: UseMutationResult<CompletedDraftPick, unknown, { pendingDraftPick: PendingDraftPick, golferId: number}, unknown>; 
  pickListPickMutation: UseMutationResult<unknown, unknown, PendingDraftPick, unknown>; 
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

  const pickListPickMutation = useMutation((draftPick: PendingDraftPick) => {
    throw new Error(`hihi TODO: ${draftPick}`);
  });

  return {
    pickMutation,
    pickListPickMutation,
  }
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
  return currentPick  ?? 'none';
}

export function useAutoPickUsers(): UseQueryResult<Set<number>> {
  const tourneyId = useTourneyId();
  const queryClient = useQueryClient();
  const queryClientKey = useMemo(() => [DRAFT_AUTO_PICK_TABLE, tourneyId], [tourneyId]);

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

export async function getDraftPicks(tourneyId: number, supabase = supabaseClient): Promise<DraftPick[]> {
  const result = await supabase.from<DraftPick>(DRAFT_PICKS_TABLE).select('*').filter('tourneyId', 'eq', tourneyId).order('pickNumber');
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch picks`);
  }
  return result.data;
}

export async function getCompletedDraftPicks(tourneyId: number, supabase = supabaseClient): Promise<CompletedDraftPick[]> {
  const result = await supabase.from<CompletedDraftPick>(DRAFT_PICKS_TABLE).select('*')
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

export async function makePick(dp: CompletedDraftPick, supabase = supabaseClient) {
  const match = pick(dp, 'tourneyId', 'pickNumber', 'userId');
  const result = await supabase.from<CompletedDraftPick>(DRAFT_PICKS_TABLE)
    .update(dp, { returning: 'minimal' })
    .is('golferId', null)
    .match(match);
  if (result.error) {
    console.dir(result);
    throw new Error(`Failed to make draft pick: ${result.statusText}`);
  }
}

export function isPendingDraftPick(dp: DraftPick): dp is PendingDraftPick {
  return !isCompletedDraftPick(dp);
}

export function isCompletedDraftPick(dp: DraftPick): dp is CompletedDraftPick {
  return dp.golferId !== undefined && dp.golferId !== null;
}

function getDraftPicksQueryClientKey(tourneyId: number): Array<unknown> {
  return [DRAFT_PICKS_TABLE, tourneyId];
}
