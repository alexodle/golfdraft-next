import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { keyBy, omit } from 'lodash';
import { useQuery, UseQueryResult } from 'react-query';
import { useTourneyId } from '../ctx/AppStateCtx';
import { Golfer } from '../models';
import { adminSupabase } from '../supabase';

const GOLFERS_TABLE = 'golfer';

export const PENDING_GOLFER: Omit<Golfer, 'tourneyId'> = {
  id: -2,
  name: 'Pending...',
}

export type UseGolfersResult = Readonly<{
  /** Lookup golfers by ID, including PENDING_GOLFER. Throws if not found. */
  getGolfer: (gid: number) => Golfer;
  /** Unordered list of all golfers */
  golfers: Golfer[];
}>

export function useGolfers(): UseQueryResult<UseGolfersResult> {
  const tourneyId = useTourneyId();
  return useQuery<UseGolfersResult>(GOLFERS_TABLE, async () => {
    const golfers = await getGolfers(tourneyId);
    const lookup = keyBy([...golfers, { ...PENDING_GOLFER, tourneyId }], g => g.id);
    return {
      golfers,
      getGolfer: (gid: number) => {
        const g = lookup[gid];
        if (!g) {
          throw new Error(`Golfer not found: ${gid}`);
        }
        return g;
      },
    };
  });
}

export async function getGolfers(tourneyId: number, supabase = supabaseClient): Promise<Golfer[]> {
  const result = await supabase
    .from<Golfer>(GOLFERS_TABLE)
    .select('*')
    .eq('tourneyId', tourneyId);
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to get golfers for tourneyId: ${tourneyId}`);
  }
  return result.data;
}

export async function upsertGolfers(golfers: Omit<Golfer, 'id'>[]): Promise<Golfer[]> {
  const withoutId = golfers.map(g => omit(g, 'id'));
  const result = await adminSupabase()
    .from<Golfer>(GOLFERS_TABLE)
    .upsert(withoutId, { returning: 'representation', onConflict: 'tourneyId, name' });
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to upsert golfers`);
  }
  return result.data;
}
