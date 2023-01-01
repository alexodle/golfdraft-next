import {
  getUser, supabaseClient, supabaseServerClient
} from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { keyBy } from 'lodash';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useQuery, UseQueryResult } from 'react-query';
import { GDUser } from '../models';

const USER_TABLE = 'gd_user';

export type IndexedUsers = Record<number, GDUser>;

export function useCurrentUser(): GDUser | undefined {
  const { user, error } = useUser();
  const { push } = useRouter();
  if (error) {
    throw error;
  }
  
  const userLookup = useAllUsers(); 
  const me = useMemo(() => {
    if (!userLookup.data || !user?.id) {
      return undefined;
    }
    return Object.values(userLookup.data ?? {}).find(u => u.profileId === user.id);
  }, [userLookup, user?.id]);

  useEffect(() => {
    if (!userLookup.isLoading && userLookup.isSuccess && !me) {
      push('/pending'); // hihi TODO build
    }
  }, [push, userLookup, me]);

  return me;
}

export function useAllUsers(): UseQueryResult<IndexedUsers> {
  return useQuery<IndexedUsers>(USER_TABLE, async () => {
    const result = await getAllUsers();
    return keyBy(result, u => u.id);
  });
}

export async function getAllUsers(supabase = supabaseClient): Promise<GDUser[]> {
  const result = await supabase.from<GDUser>(USER_TABLE).select('*');
  if (result.error) {
    console.dir(result.error);
    throw new Error('Failed to fetch users');
  }
  return result.data;
}

export async function getCurrentUserServer(ctx: GetServerSidePropsContext | { req: NextApiRequest, res: NextApiResponse  }): Promise<GDUser | 'pending'> {
  const supbase = supabaseServerClient(ctx);

  const { user: sessionUser, error } = await getUser(ctx);
  if (!sessionUser) {
    throw (error ?? new Error(`Could not get current user`));
  }

  let user = (await supbase.from<GDUser>(USER_TABLE).select('*').eq('profileId', sessionUser.id).single()).data;
  if (!user) {
    return 'pending';
  }

  return user;
}
