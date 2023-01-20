import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { SupabaseClient } from '@supabase/supabase-js';
import { useCallback, useMemo } from 'react';
import { QueryClient, useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from 'react-query';
import { useTourneyId } from '../ctx/AppStateCtx';
import { DraftPickList } from '../models';
import { useSharedSubscription } from './subscription';
import { useCurrentUser } from './users';

const DRAFT_PICK_LIST_TABLE = 'draft_pick_list';
const PICK_LIST_USER_TABLE = 'pick_list_user';

export function usePickListUsers(): UseQueryResult<Set<number>> {
  const tourneyId = useTourneyId();
  const queryClient = useQueryClient();
  const queryClientKey = useMemo(() => getPickListUsersQueryClientKey(tourneyId), [tourneyId]);
  const supabase = useSupabaseClient();

  const result = useQuery<Set<number>>(queryClientKey, async () => {
    return new Set(await getDraftPickListUsers(tourneyId, supabase));
  });

  useSharedSubscription(
    DRAFT_PICK_LIST_TABLE,
    `tourneyId=eq.${tourneyId}`,
    useCallback(() => {
      return queryClient.invalidateQueries(queryClientKey);
    }, [queryClient, queryClientKey]),
    { disabled: !result.isSuccess },
  );

  return result;
}

export function usePickList(): UseQueryResult<number[] | null> {
  const tourneyId = useTourneyId();
  const { data: myUser } = useCurrentUser();
  const queryClientKey = useMemo(() => getPickListQueryClientKey(tourneyId, myUser?.id), [tourneyId, myUser?.id]);
  const supabase = useSupabaseClient();

  const result = useQuery<number[] | null>(
    queryClientKey,
    async () => {
      if (!myUser) {
        throw new Error(`Not ready`);
      }
      return await getDraftPickList(tourneyId, myUser.id as number, supabase);
    },
    { enabled: !!myUser?.id },
  );

  return result;
}

export function prefetchPickList(
  { userId, tourneyId }: { userId: number; tourneyId: number },
  queryClient: QueryClient,
  supabase: SupabaseClient,
): Promise<void> {
  return queryClient.prefetchQuery(getPickListQueryClientKey(tourneyId, userId), async () => {
    return await getDraftPickList(tourneyId, userId, supabase);
  });
}

export type UpdatePickListRequest = {
  pickList: number[];
};

export function usePickListUpdater():
  | UseMutationResult<UpdatePickListRequest, unknown, UpdatePickListRequest, unknown>
  | undefined {
  const tourneyId = useTourneyId();
  const { data: myUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const queryClientKey = useMemo(() => getPickListQueryClientKey(tourneyId, myUser?.id), [tourneyId, myUser?.id]);
  const supabase = useSupabaseClient();

  const result = useMutation(
    async ({ pickList }: UpdatePickListRequest) => {
      if (!myUser) {
        throw new Error('Not ready');
      }
      await updatePickList({ tourneyId, userId: myUser.id, golferIds: pickList }, supabase);
      return { pickList };
    },
    {
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
    },
  );

  return myUser ? result : undefined;
}

export async function getDraftPickListUsers(tourneyId: number, supabase: SupabaseClient): Promise<number[]> {
  const result = await supabase.from(PICK_LIST_USER_TABLE).select('userId').eq('tourneyId', tourneyId);
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch pick lists`);
  }
  return result.data.map((pl) => pl.userId);
}

export async function getDraftPickList(
  tourneyId: number,
  userId: number,
  supabase: SupabaseClient,
): Promise<number[] | null> {
  const result = await supabase
    .from(DRAFT_PICK_LIST_TABLE)
    .select('golferId')
    .eq('tourneyId', tourneyId)
    .eq('userId', userId);
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch pick lists`);
  }
  if (result.data.length === 0) {
    return null;
  }
  return result.data.map((pl) => pl.golferId);
}

async function updatePickList(pickList: DraftPickList, supabase: SupabaseClient) {
  const result = await supabase.rpc('set_pick_list', {
    golfer_ids: pickList.golferIds.join(','),
    tourney_id: pickList.tourneyId,
    user_id: pickList.userId,
  });
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to update pick list: ${result.statusText}`);
  }
}

function getPickListQueryClientKey(tourneyId: number, userId: number | undefined): Array<unknown> {
  return [DRAFT_PICK_LIST_TABLE, tourneyId, userId];
}

function getPickListUsersQueryClientKey(tourneyId: number): unknown[] {
  return [PICK_LIST_USER_TABLE, tourneyId];
}
