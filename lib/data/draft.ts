import { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient, UseQueryResult, useMutation } from 'react-query';
import { useTourneyId } from '../ctx/AppStateCtx';
import { DraftAutoPick, DraftPick, DraftPickList, DraftPickOrder } from '../models';
import supabase from '../supabase';
import { difference, union } from '../util/sets';
import { useCurrentUser } from './users';

const DRAFT_PICKS_TABLE = 'draft_pick';
const DRAFT_PICK_ORDER_TABLE = 'draft_pick_order';
const DRAFT_PICK_LIST_TABLE = 'draft_pick_list';
const DRAFT_AUTO_PICK_TABLE = 'draft_auto_pick';

export async function makePick(dp: DraftPick) {
  await supabase.from(DRAFT_PICKS_TABLE).insert(dp);
}

export function useDraftPickOrder(): UseQueryResult<DraftPickOrder[]> {
  const tourneyId = useTourneyId();
  return useQuery<DraftPickOrder[]>(DRAFT_PICK_ORDER_TABLE, async () => {
    return await getDraftPickOrder(tourneyId);
  });
}

export function useDraftPicks(): UseQueryResult<DraftPick[]> {
  const tourneyId = useTourneyId();
  const queryClient = useQueryClient();

  const queryClientKey = useMemo(() => [DRAFT_PICKS_TABLE, tourneyId], [tourneyId]);

  const result = useQuery<DraftPick[]>(queryClientKey, async () => {
    return await getDraftPicks(tourneyId);
  });

  useEffect(() => {
    if (!result.isSuccess) {
      return;
    }

    const sub = supabase.from<DraftPick>(`${DRAFT_PICKS_TABLE}:tourney_id=eq.${tourneyId}`)
      .on('INSERT', (ins) => {
        queryClient.setQueryData<DraftPick[]>(queryClientKey, (curr) => [...(curr ?? []), ins.new]);
      })
      .on('DELETE', (del) => {
        queryClient.setQueryData<DraftPick[]>(queryClientKey, (curr) => (curr ?? []).filter(it => it.pickNumber !== (del.old.pickNumber ?? del.new.pickNumber)));
      })
      .on('UPDATE', () => {
        queryClient.invalidateQueries(queryClientKey);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(sub);
    }
  }, [queryClient, queryClientKey, tourneyId, result.isSuccess]);

  return result;
}

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

    const sub = supabase.from<DraftPickList>(`${DRAFT_PICK_LIST_TABLE}:tourney_id=eq.${tourneyId}`)
      .on('INSERT', (ins) => {
        queryClient.setQueryData<Set<number>>(queryClientKey, (curr) => union(curr, ins.new.userId));
      })
      .on('DELETE', (del) => {
        queryClient.setQueryData<Set<number>>(queryClientKey, (curr) => difference(curr ?? new Set(), del.old.userId ?? del.new.userId));
      })
      .on('UPDATE', () => {
        queryClient.invalidateQueries(queryClientKey);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(sub);
    }
  }, [queryClient, queryClientKey, tourneyId, result.isSuccess]);

  return result;
}

export function usePickList(): UseQueryResult<number[] | undefined> {
  const tourneyId = useTourneyId();
  const myUser = useCurrentUser();
  const queryClient = useQueryClient();
  const queryClientKey = useMemo(() => [DRAFT_PICK_LIST_TABLE, tourneyId, myUser?.id], [tourneyId, myUser?.id]);

  const result = useQuery<number[] | undefined>(queryClientKey, async () => {
    return await getDraftPickList(tourneyId, myUser?.id as number);
  }, { enabled: !!myUser?.id });

  useEffect(() => {
    if (!result.isSuccess) {
      return;
    }

    const sub = supabase.from<DraftAutoPick>(`${DRAFT_AUTO_PICK_TABLE}:tourney_id=eq.${tourneyId}`)
      .on('*', () => {
        queryClient.invalidateQueries(queryClientKey);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(sub);
    }
  }, [queryClient, queryClientKey, tourneyId, result.isSuccess]);

  return result;
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

    const sub = supabase.from<DraftAutoPick>(`${DRAFT_AUTO_PICK_TABLE}:tourney_id=eq.${tourneyId}`)
      .on('INSERT', (ins) => {
        queryClient.setQueryData<Set<number>>(queryClientKey, (curr) => union(curr, ins.new.userId));
      })
      .on('DELETE', (del) => {
        queryClient.setQueryData<Set<number>>(queryClientKey, (curr) => difference(curr ?? new Set(), del.old.userId ?? del.new.userId));
      })
      .on('UPDATE', () => {
        queryClient.invalidateQueries(queryClientKey);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(sub);
    }
  }, [queryClient, queryClientKey, tourneyId, result.isSuccess]);

  return result;
}

export async function getDraftPickOrder(tourneyId: number): Promise<DraftPickOrder[]> {
  const result = await supabase
    .from<DraftPickOrder>(DRAFT_PICK_ORDER_TABLE)
    .select('*')
    .filter('tourneyId', 'eq', tourneyId)
    .order('pickNumber');
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch pick order`);
  }
  return result.data;
}

export async function getDraftPicks(tourneyId: number): Promise<DraftPick[]> {
  const result = await supabase.from<DraftPick>(DRAFT_PICKS_TABLE).select('*').filter('tourneyId', 'eq', tourneyId).order('pickNumber');
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch picks`);
  }
  return result.data;
}

export async function getDraftPickListUsers(tourneyId: number): Promise<number[]> {
  const result = await supabase.from<Pick<DraftPickList, 'userId' | 'tourneyId'>>(DRAFT_PICK_LIST_TABLE).select('userId').filter('tourneyId', 'eq', tourneyId);
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch pick lists`);
  }
  return result.data.map(pl => pl.userId);
}

export async function getDraftPickList(tourneyId: number, userId: number): Promise<number[] | undefined> {
  const result = await supabase.from<DraftPickList>(DRAFT_PICK_LIST_TABLE).select('golferIds').filter('tourneyId', 'eq', tourneyId).eq('userId', userId).maybeSingle();
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch pick lists`);
  }
  return result.data?.golferIds;
}

export async function getAutoPickUsers(tourneyId: number): Promise<number[]> {
  const result = await supabase.from<Pick<DraftAutoPick, 'userId' | 'tourneyId'>>(DRAFT_AUTO_PICK_TABLE).select('userId').filter('tourneyId', 'eq', tourneyId);
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch auto picks`);
  }
  return result.data.map(pl => pl.userId);
}
