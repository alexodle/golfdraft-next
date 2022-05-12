import { keyBy } from 'lodash';
import { useQuery, UseQueryResult } from 'react-query';
import { useTourneyId } from '../ctx/AppStateCtx';
import { Golfer } from '../models';
import supabase from '../supabase';

const GOLFERS_TABLE = 'golfer';

export type IndexedGolfers = Record<number, Golfer>;

export function useGolfers(): UseQueryResult<IndexedGolfers> {
  const tourneyId = useTourneyId();
  return useQuery<Record<number, Golfer>>(GOLFERS_TABLE, async () => {
    const golfers = await getGolfers(tourneyId);
    return keyBy(golfers, g => g.id);
  });
}

export async function getGolfers(tourneyId: number): Promise<Golfer[]> {
  const result = await supabase.from<Golfer>(GOLFERS_TABLE).select('*').filter('tourneyId', 'eq', tourneyId);
  if (!result.data) {
    throw new Error(`No golfers found`);
  }
  return result.data;
}
