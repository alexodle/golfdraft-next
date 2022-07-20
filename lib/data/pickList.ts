import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useMemo } from 'react';
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from 'react-query';
import { useTourneyId } from '../ctx/AppStateCtx';
import { DraftPickList } from '../models';
import { difference, union } from '../util/sets';
import { openSharedSubscription } from './subscription';
import { useCurrentUser } from './users';

const DRAFT_PICK_LIST_TABLE = 'draft_pick_list';

export function usePickListUsers(): UseQueryResult<Set<number>> {
  const tourneyId = useTourneyId();
  const queryClient = useQueryClient();
  const queryClientKey = useMemo(() => [`${DRAFT_PICK_LIST_TABLE}_users`, tourneyId], [tourneyId]);

  const result = useQuery<Set<number>>(queryClientKey, async () => {
    return new Set(await getDraftPickListUsers(tourneyId));
  });

  useEffect(() => {
    if (!result.isSuccess) {
      return;
    }

    const sub = openSharedSubscription<DraftPickList>(`${DRAFT_PICK_LIST_TABLE}:tourneyId=eq.${tourneyId}`, (ev) => {
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

export function usePickList(): UseQueryResult<number[] | null> {
  const tourneyId = useTourneyId();
  const myUser = useCurrentUser();
  const queryClientKey = useMemo(() => getPickListQueryClientKey(tourneyId, myUser?.id), [tourneyId, myUser?.id]);

  const result = useQuery<number[] | null>(queryClientKey, async () => {
    if (!myUser) {
      throw new Error(`Not ready`);
    }
    return await getDraftPickList(tourneyId, myUser.id as number);
  }, { enabled: !!myUser?.id });

  return result;
}

export type UpdatePickListRequest = {
  pickList: number[];
}

export type UpdatePickListByNames = {
  namePickList: string[];
}

export function usePickListUpdater(): UseMutationResult<UpdatePickListRequest, unknown, UpdatePickListRequest, unknown> | undefined {
  const tourneyId = useTourneyId();
  const myUser = useCurrentUser();
  const queryClient = useQueryClient();
  const queryClientKey = useMemo(() => getPickListQueryClientKey(tourneyId, myUser?.id), [tourneyId, myUser?.id]);

  const result = useMutation(async ({ pickList }: UpdatePickListRequest) => {
    if (!myUser) {
      throw new Error('Not ready');
    }
    await updatePickList({ tourneyId, userId: myUser.id, golferIds: pickList });
    return { pickList };
  }, {
    onMutate: ({ pickList }) => {
      if (!myUser) {
        throw new Error('Not ready');
      }
      queryClient.setQueryData<number[]>(queryClientKey, pickList);
    },
    onError: (e) => {
      console.dir(e);
      queryClient.invalidateQueries(queryClientKey);
    },
  });

  return myUser ? result : undefined;
}

export async function getDraftPickListUsers(tourneyId: number, supabase = supabaseClient): Promise<number[]> {
  const result = await supabase.from<Pick<DraftPickList, 'userId' | 'tourneyId'>>(DRAFT_PICK_LIST_TABLE).select('userId').filter('tourneyId', 'eq', tourneyId);
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch pick lists`);
  }
  return result.data.map(pl => pl.userId);
}

export async function getDraftPickList(tourneyId: number, userId: number, supabase = supabaseClient): Promise<number[] | null> {
  const result = await supabase.from<DraftPickList>(DRAFT_PICK_LIST_TABLE).select('golferIds').filter('tourneyId', 'eq', tourneyId).eq('userId', userId).maybeSingle();
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch pick lists`);
  }
  return result.data?.golferIds ?? null;
}

async function updatePickList(pickList: DraftPickList) {
  const result = await supabaseClient.from(DRAFT_PICK_LIST_TABLE).upsert(pickList, { returning: 'minimal' });
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to update pick list: ${result.statusText}`);
  }
}

function getPickListQueryClientKey(tourneyId: number, userId: number | undefined): Array<unknown> {
  return  [DRAFT_PICK_LIST_TABLE, tourneyId, userId];
}

