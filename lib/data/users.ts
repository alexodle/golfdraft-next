import { SupabaseClient, User } from '@supabase/supabase-js';
import { keyBy } from 'lodash';
import { QueryClient, useMutation, useQuery, UseQueryResult } from 'react-query';
import { GDUser } from '../models';
import { createClient } from '../supabase/component';
import { useSharedSubscription } from './subscription';
import { useSession } from '../ctx/SessionContext';

const USER_TABLE = 'gd_user';
const USER_MAP_TABLE = 'gd_user_map';

export type IndexedUsers = Record<number, GDUser>;

export type UserMapping = Readonly<{
  userId: number | null;
  profileId: string;
  email: string;
}>;

export function useCurrentUser(): UseQueryResult<GDUser | undefined> {
  const supabase = createClient();
  const user = useSession()?.user;

  if (!user) {
    throw new Error('Unexpectedly missing auth user');
  }

  const result = useQuery<GDUser | undefined>([USER_TABLE, user.id], async () => {
    return await getMyGdUser(user, supabase);
  });

  useSharedSubscription(USER_MAP_TABLE, `profileId=eq.${user.id}`, () => {
    result.refetch();
  });

  return result;
}

export function useAllUsers(): UseQueryResult<IndexedUsers> {
  const supabase = createClient();
  return useQuery<IndexedUsers>(USER_TABLE, async () => {
    return await getAllUsers(supabase);
  });
}

export async function prefetchAllUsers(queryClient: QueryClient, supabase: SupabaseClient): Promise<void> {
  return queryClient.prefetchQuery(USER_TABLE, async () => {
    return await getAllUsers(supabase);
  });
}

export function useUserMappingsCommishOnly(): UseQueryResult<UserMapping[]> {
  const supabase = createClient();
  const user = useSession()?.user;

  if (!user) {
    throw new Error('Unexpectedly missing auth user');
  }

  const results = useQuery(
    USER_MAP_TABLE,
    async () => {
      return await getUserMappings(supabase);
    },
    {
      refetchInterval: 10_000,
    },
  );

  useSharedSubscription(USER_MAP_TABLE, '', () => {
    results.refetch();
  });

  return results;
}

export function userUserMappingsMutationCommishOnly() {
  const supabase = createClient();
  return useMutation({
    mutationFn: async ({ userId, profileId }: { userId?: number; profileId: string }) => {
      const delResult = await supabase.from(USER_MAP_TABLE).delete().eq('profileId', profileId);
      if (delResult.error) {
        console.dir(delResult.error);
        throw new Error('Failed to delete old user mapping');
      }

      if (userId !== undefined) {
        const addResult = await supabase.from(USER_MAP_TABLE).insert({
          gdUserId: userId,
          profileId,
        });
        if (addResult.error) {
          console.dir(addResult.error);
          throw new Error('Failed to add user mapping');
        }
      }
    },
  });
}

export async function getMyGdUser(user: User, supabase: SupabaseClient): Promise<GDUser | undefined> {
  const result = await supabase
    .from(USER_TABLE)
    .select(
      `
    *, ${USER_MAP_TABLE}!inner (
      profileId
    )
    `,
    )
    .eq(`${USER_MAP_TABLE}.profileId`, user.id)
    .maybeSingle();

  if (result.error) {
    console.dir(result.error);
    throw new Error('Failed to fetch my user');
  }
  return result.data;
}

export async function getAllUsers(supabase: SupabaseClient): Promise<IndexedUsers> {
  const result = await supabase.from(USER_TABLE).select('*');
  if (result.error) {
    console.dir(result.error);
    throw new Error('Failed to fetch users');
  }
  return keyBy(result.data, (u) => u.id);
}

export async function getUserMappings(supabase: SupabaseClient): Promise<UserMapping[]> {
  const result = await supabase.rpc('get_user_mappings');
  if (result.error) {
    console.dir(result.error);
    throw new Error('Failed to fetch user mappings');
  }
  return result.data;
}
