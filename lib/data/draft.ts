import { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient, UseQueryResult, useMutation } from 'react-query';
import { useTourneyId } from '../ctx/AppStateCtx';
import { CompletedDraftPick, DraftAutoPick, DraftPick, DraftPickList, PendingDraftPick } from '../models';
import {default as supabaseClient, adminSupabase} from '../supabase';
import { difference, union } from '../util/sets';
import { useCurrentUser } from './users';

const DRAFT_PICKS_TABLE = 'draft_pick';
const DRAFT_PICK_ORDER_TABLE = 'draft_pick_order';
const DRAFT_PICK_LIST_TABLE = 'draft_pick_list';
const DRAFT_AUTO_PICK_TABLE = 'draft_auto_pick';

export async function makePick(dp: DraftPick) {
  await supabaseClient.from(DRAFT_PICKS_TABLE).insert(dp);
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

    const sub = supabaseClient.from<DraftPick>(`${DRAFT_PICKS_TABLE}:tourney_id=eq.${tourneyId}`)
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
      supabaseClient.removeSubscription(sub);
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

    const sub = supabaseClient.from<DraftPickList>(`${DRAFT_PICK_LIST_TABLE}:tourney_id=eq.${tourneyId}`)
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
      supabaseClient.removeSubscription(sub);
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

    const sub = supabaseClient.from<DraftAutoPick>(`${DRAFT_AUTO_PICK_TABLE}:tourney_id=eq.${tourneyId}`)
      .on('*', () => {
        queryClient.invalidateQueries(queryClientKey);
      })
      .subscribe();

    return () => {
      supabaseClient.removeSubscription(sub);
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

    const sub = supabaseClient.from<DraftAutoPick>(`${DRAFT_AUTO_PICK_TABLE}:tourney_id=eq.${tourneyId}`)
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
      supabaseClient.removeSubscription(sub);
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
    throw new Error(`Failed to fetch picks`);
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

export async function getDraftPickListUsers(tourneyId: number, supabase = supabaseClient): Promise<number[]> {
  const result = await supabase.from<Pick<DraftPickList, 'userId' | 'tourneyId'>>(DRAFT_PICK_LIST_TABLE).select('userId').filter('tourneyId', 'eq', tourneyId);
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch pick lists`);
  }
  return result.data.map(pl => pl.userId);
}

export async function getDraftPickList(tourneyId: number, userId: number, supabase = supabaseClient): Promise<number[] | undefined> {
  const result = await supabase.from<DraftPickList>(DRAFT_PICK_LIST_TABLE).select('golferIds').filter('tourneyId', 'eq', tourneyId).eq('userId', userId).maybeSingle();
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch pick lists`);
  }
  return result.data?.golferIds;
}

export async function getAutoPickUsers(tourneyId: number, supabase = supabaseClient): Promise<number[]> {
  const result = await supabase.from<Pick<DraftAutoPick, 'userId' | 'tourneyId'>>(DRAFT_AUTO_PICK_TABLE).select('userId').filter('tourneyId', 'eq', tourneyId);
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to fetch auto picks`);
  }
  return result.data.map(pl => pl.userId);
}
