import { keyBy } from 'lodash';
import { getGolfers, upsertGolfers } from '../../data/golfers';
import { getTourney } from '../../data/tourney';
import { Golfer, TourneyConfig } from '../../models';
import { rawWgrReader } from './rawWgrReader';
import { adminSupabase } from '../../supabase';

export async function updateWgr(tourneyId: number) {
  const [tourney, golfers] = await Promise.all([
    getTourney(tourneyId, adminSupabase()),
    getGolfers(tourneyId, adminSupabase()),
  ]);
  const tourneyCfg = JSON.parse(tourney.config) as TourneyConfig;

  const url = tourneyCfg.wgr.url;
  const nameMap = tourneyCfg.wgr.nameMap;

  console.log('downloading and parsing');
  let wgrEntries = await rawWgrReader(url);
  console.log('parsed %d entries', wgrEntries.length);

  const golfersByName = keyBy([...golfers], (g) => g.name);

  const updated = wgrEntries.flatMap<Golfer>(({ name, wgr }) => {
    const resolvedName = nameMap[name] ?? name;
    const golfer = golfersByName[resolvedName];
    if (!golfer) {
      return [];
    }
    return { ...golfer, wgr };
  });

  upsertGolfers(updated);
  console.log('success');
}
