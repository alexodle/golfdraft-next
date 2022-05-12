import { GDUser, GDUser2 } from '../models';
import supabase from '../supabase';
import { UseQueryResult, useQuery } from 'react-query';
import { keyBy } from 'lodash';
import { useCallback, useMemo } from 'react';

const USER_TABLE = 'user';

export type IndexedUsers = Record<number, GDUser2>;

export function useCurrentUser(): GDUser2 | undefined {
  const currentUserId = getCurrentUserClient()?.id;
  const userLookup = useAllUsers(); 
  if (!currentUserId) {
    throw new Error('No current user');
  }
  if (!userLookup.data) {
    return undefined;
  }
  const me = userLookup.data[+currentUserId];
  if (!me) {
    throw new Error(`User not found: ${currentUserId}`);
  }
  return me;
}

export function useAllUsers(): UseQueryResult<IndexedUsers> {
  return useQuery<IndexedUsers>(USER_TABLE, async () => {
    const result = await getAllUsers();
    return keyBy(result, u => u.id);
  });
}

export async function getAllUsers(): Promise<GDUser2[]> {
  const result = await supabase.from<GDUser2>(USER_TABLE).select('*');
  if (result.error) {
    console.dir(result.error);
    throw new Error('Failed to fetch users');
  }
  return result.data;
}

export async function getCurrentUserServer(req: any, res: any): Promise<GDUser | null> {
  return (await supabase.auth.api.getUserByCookie(req, res)).user as GDUser | null;
}

function getCurrentUserClient(): GDUser | null {
  return supabase.auth.user() as GDUser | null;
}
