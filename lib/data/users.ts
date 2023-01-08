import { SupabaseClient, User, useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { keyBy } from 'lodash';
import { useQuery, UseQueryResult } from 'react-query';
import { GDUser } from '../models';
import { useSharedSubscription } from './subscription';

const USER_TABLE = 'gd_user';

export type IndexedUsers = Record<number, GDUser>;

export function useCurrentUser(): UseQueryResult<GDUser | undefined> {
  const supabase = useSupabaseClient();
  const user = useUser();

  if (!user) {
    throw new Error('Unexpectedly missing auth user');
  }

  const myUserResult = useQuery<GDUser | undefined>([USER_TABLE, user.id], async () => {
    return await getMyGdUser(user, supabase);
  });

  useSharedSubscription('gd_user_map', `profileId=eq.${user.id}`, () => {
    myUserResult.refetch();
  });

  return myUserResult;
}

export function useAllUsers(): UseQueryResult<IndexedUsers> {
  const supabase = useSupabaseClient();
  return useQuery<IndexedUsers>(USER_TABLE, async () => {
    const result = await getAllUsers(supabase);
    return keyBy(result, (u) => u.id);
  });
}

export async function getMyGdUser(user: User, supabase: SupabaseClient): Promise<GDUser | undefined> {
  const result = await supabase
    .from(USER_TABLE)
    .select(
      `
    *, gd_user_map!inner (
      profileId
    )
    `,
    )
    .eq('gd_user_map.profileId', user.id)
    .maybeSingle();

  if (result.error) {
    console.dir(result.error);
    throw new Error('Failed to fetch my user');
  }
  return result.data;
}

export async function getAllUsers(supabase: SupabaseClient): Promise<GDUser[]> {
  const result = await supabase.from(USER_TABLE).select('*');
  if (result.error) {
    console.dir(result.error);
    throw new Error('Failed to fetch users');
  }
  return result.data;
}
