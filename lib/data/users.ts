import { keyBy } from 'lodash';
import { useQuery, UseQueryResult } from 'react-query';
import { GDUser } from '../models';
import supabase from '../supabase';

const USER_TABLE = 'gd_user';

export type IndexedUsers = Record<number, GDUser>;

export function useCurrentUser(): GDUser | undefined {
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

export async function getAllUsers(): Promise<GDUser[]> {
  const result = await supabase.from<GDUser>(USER_TABLE).select('*');
  if (result.error) {
    console.dir(result.error);
    throw new Error('Failed to fetch users');
  }
  return result.data;
}

export async function getCurrentUserServer(req: any, res: any): Promise<GDUser | null> {
  return (await supabase.auth.api.getUserByCookie(req, res)).user as GDUser | null;
}

interface SBUser {
  id: string;
}

function getCurrentUserClient(): SBUser | null {
  return supabase.auth.user() as SBUser | null;
}
