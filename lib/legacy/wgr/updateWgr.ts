import { keyBy, maxBy, minBy, uniq } from 'lodash';
import { getGolfers, upsertGolfers } from '../../data/golfers';
import { getTourney } from '../../data/tourney';
import { Golfer, TourneyConfig } from '../../models';
import { rawWgrReader } from './rawWgrReader';
import { adminSupabase } from '../../supabase';
import { levenshteinAll } from '../server/levenshteinDistance';

export async function updateWgr(tourneyId: number) {
  const [tourney, golfers] = await Promise.all([
    getTourney(tourneyId, adminSupabase()),
    getGolfers(tourneyId, adminSupabase()),
  ]);
  const tourneyCfg = JSON.parse(tourney.config) as TourneyConfig;

  const url = tourneyCfg.wgr.url;
  const nameMap = tourneyCfg.wgr.nameMap;

  console.log('downloading and parsing');
  const wgrEntries = await rawWgrReader(url);
  console.log('parsed %d entries', wgrEntries.length);

  const golfersByName = keyBy([...golfers], (g) => g.name);

  const updated = wgrEntries.flatMap<Golfer>(({ name, wgr }) => {
    const resolvedName = nameMap[name] ?? name;
    const golfer = golfersByName[resolvedName] ?? golfersByName[name];
    if (!golfer) {
      return [];
    }
    return { ...golfer, wgr };
  });

  await upsertGolfers(updated);

  const allWgrGolfers = wgrEntries.map((it) => it.name);
  const allGolfers = await getGolfers(tourneyId, adminSupabase());
  for (const golfer of allGolfers) {
    if (golfer.wgr) {
      continue;
    }

    const name = nameMap[golfer.name] ?? golfer.name;
    const closestMatch = findCloseMatch(name, allWgrGolfers);
    if (closestMatch) {
      console.log(`WGR golfer not found: '${name}'. Did you mean '${closestMatch}'?`);
    } else {
      console.log(`WGR golfer not found: '${name}'.`);
    }
  }

  console.log('success');
}

const MIN_COEFF = 0.65;

function findCloseMatch(name: string, wgrGolferNames: string[]): string | undefined {
  const best = levenshteinAll(name, wgrGolferNames)[0];
  if (!best || best.coeff < MIN_COEFF) {
    return undefined;
  }
  return best.target;
}
