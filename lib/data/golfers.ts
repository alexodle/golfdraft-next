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

export type IndexedGolfers = Record<number, Golfer>;

export function useGolfers(): UseQueryResult<IndexedGolfers> {
  const tourneyId = useTourneyId();
  return useQuery<Record<number, Golfer>>(GOLFERS_TABLE, async () => {
    const golfers = [...await getGolfers(tourneyId), { ...PENDING_GOLFER, tourneyId }];
    return keyBy(golfers, g => g.id);
  });
}

export async function getGolfers(tourneyId: number, supabase = supabaseClient): Promise<Golfer[]> {
  const result = await supabase.from<Golfer>(GOLFERS_TABLE).select('*').filter('tourneyId', 'eq', tourneyId);
  if (!result.data) {
    throw new Error(`No golfers found`);
  }
  return result.data;
}

export async function upsertGolfers(golfers: Omit<Golfer, 'id'>[]): Promise<Golfer[]> {
  const withoutId = golfers.map(g => omit(g, 'id'));
  const result = await adminSupabase().from<Golfer>(GOLFERS_TABLE).upsert(withoutId, { returning: 'representation', onConflict: 'tourneyId, name' });
  if (result.error) {
    console.dir(result.error);
    throw new Error(`Failed to upsert golfers`);
  }
  return result.data;
}
