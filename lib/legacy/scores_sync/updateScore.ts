import { every, has, includes, isFinite, keyBy, omitBy, pick, range } from 'lodash';
import moment from 'moment';
import { getGolfers, invalidateGolfers, upsertGolfers } from '../../data/golfers';
import { getGolferScoreOverrides, updateScores } from '../../data/scores';
import { touchTourney } from '../../data/tourney';
import { Golfer, GolferScore, GolferScoreOverride, TourneyConfig } from '../../models';
import { adminSupabase } from '../../supabase';
import constants from '../common/constants';
import { Reader, ReaderResult } from './Types';
import * as updateTourneyStandings from './updateTourneyStandings';
import { difference } from '../../util/sets';

const DAYS = constants.NDAYS;
const MISSED_CUT = constants.MISSED_CUT;
const OVERRIDE_KEYS: (keyof GolferScoreOverride)[] = ['golferId', 'day', 'scores'];

export function validate(result: ReaderResult): boolean {
  if (has(result, 'par') && !includes([70, 71, 72], result.par)) {
    console.log('ERROR - Par invalid:' + result.par);
    return false;
  }

  return every(result.golfers, (g) => {
    const validScores = every(g.scores, (s) => isFinite(s) || s === MISSED_CUT);
    let inv = false;

    if (g.golfer === '-') {
      console.log('ERROR - Invalid golfer name');
      inv = true;
    } else if (g.scores.length !== DAYS) {
      console.log('ERROR - Invalid golfer scores length');
      inv = true;
    } else if (!validScores) {
      console.log('ERROR - Invalid golfer scores');
      inv = true;
    } else if (!includes(range(DAYS + 1), g.day)) {
      console.log('ERROR - Invalid golfer day');
      inv = true;
    }

    if (inv) {
      console.log(JSON.stringify(g));
    }
    return !inv;
  });
}

export function mergeOverrides(scores: GolferScore[], scoreOverrides: GolferScoreOverride[]): GolferScore[] {
  const overridesByGolfer: Record<number, GolferScoreOverride> = keyBy(scoreOverrides, (o) => o.golferId);

  const newScores = scores.map<GolferScore>((s) => {
    const override = overridesByGolfer[s.golferId];
    if (override) {
      const toUse = pick(
        omitBy(override, (v) => v !== null && v !== undefined),
        OVERRIDE_KEYS,
      );
      s = { ...s, ...toUse } as GolferScore;
    }
    return s;
  });

  return newScores;
}

export async function run(tourneyId: number, reader: Reader, config: TourneyConfig) {
  const url = config.scores.url;

  const ts = moment().format('YMMDD_HHmmss');
  console.log(`Updating scores at ${ts}`);

  const rawTourney = await reader.run(config, url);

  // Quick assertion of data
  if (!rawTourney || !validate(rawTourney)) {
    console.error('Invalid data for updateScore', rawTourney);
    throw new Error('Invalid data for updateScore');
  }

  // Update all names
  const nameMap = config.scores.nameMap;
  rawTourney.golfers.forEach((g) => (g.golfer = nameMap[g.golfer] || g.golfer));

  const validGolferIdsBefore = new Set((await getGolfers(tourneyId, adminSupabase())).filter(g => !g.invalid).map((g) => g.id));
  const golfers = await upsertGolfers(
    rawTourney.golfers.map<Omit<Golfer, 'id'>>((g) => ({ tourneyId, name: g.golfer, invalid: false })),
  );

  // Invalidate all golfers who are no longer in the update (assume they withdrew)
  const newlyInvalidGolfers = difference(
    validGolferIdsBefore,
    golfers.map((g) => g.id),
  );
  if (newlyInvalidGolfers.size) {
    await invalidateGolfers(tourneyId, [...newlyInvalidGolfers]);
  }

  const scoreOverrides = await getGolferScoreOverrides(tourneyId, adminSupabase());

  // Build scores with golfer id
  const golfersByName = keyBy(golfers, (gs) => gs.name);
  const scores = rawTourney.golfers.map<GolferScore>((g) => {
    const golferName = g.golfer;
    if (!golfersByName[golferName]) {
      throw new Error('ERROR: Could not find golfer: ' + golferName);
    }

    const golferId = golfersByName[golferName].id;
    return {
      tourneyId,
      golferId,
      day: g.day,
      thru: g.thru ?? undefined,
      scores: g.scores,
    };
  });

  // Merge in overrides
  const finalScores = mergeOverrides(scores, scoreOverrides);
  if (!finalScores.length) {
    throw new Error('wtf. no scores.');
  }

  // Save
  await updateScores(finalScores);

  // Calculate standings
  await updateTourneyStandings.run(tourneyId);

  // Mark as updated
  await touchTourney(tourneyId);

  console.log('HOORAY! - scores updated');
}
