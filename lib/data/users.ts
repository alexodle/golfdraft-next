import { SupabaseClient, useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { keyBy } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useQuery, UseQueryResult } from 'react-query';
import { GDUser } from '../models';

const USER_TABLE = 'gd_user';

export type IndexedUsers = Record<number, GDUser>;

export function useCurrentUser(): GDUser | undefined {
  const user = useUser();
  const { push } = useRouter();

  const userLookup = useAllUsers();
  const me = useMemo(() => {
    if (!userLookup.data || !user?.id) {
      return undefined;
    }
    return Object.values(userLookup.data ?? {}).find((u) => u.profileIds.includes(user.id));
  }, [userLookup, user?.id]);

  useEffect(() => {
    if (!userLookup.isLoading && userLookup.isSuccess && !me) {
      push('/pending'); // hihi TODO fix
    }
  }, [push, userLookup, me]);

  return me;
}

export function useAllUsers(): UseQueryResult<IndexedUsers> {
  const supabase = useSupabaseClient();
  return useQuery<IndexedUsers>(USER_TABLE, async () => {
    const result = await getAllUsers(supabase);
    return keyBy(result, (u) => u.id);
  });
}

export async function getAllUsers(supabase: SupabaseClient): Promise<GDUser[]> {
  const result = await supabase.from(USER_TABLE).select('*');
  if (result.error) {
    console.dir(result.error);
    throw new Error('Failed to fetch users');
  }
  return result.data;
}
