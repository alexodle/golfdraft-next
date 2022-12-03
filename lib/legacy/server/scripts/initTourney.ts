import { keyBy } from 'lodash';
import { upsertAppState } from '../../../data/appState';
import { getDraftPicks, setDraftPicks } from '../../../data/draft';
import { upsertDraftSettings } from '../../../data/draftSettings';
import { upsertTourney } from '../../../data/tourney';
import { getAllUsers } from '../../../data/users';
import { TourneyConfig } from '../../../models';
import readerConfig from '../../scores_sync/readerConfig';
import * as updateScore from '../../scores_sync/updateScore';
import * as updateTourneyStandings from '../../scores_sync/updateTourneyStandings';
import { updateWgr } from '../../wgr/updateWgr';
import * as tourneyUtils from '../tourneyUtils';

function assert(cond: unknown, msg: string) {
  if (!cond) {
    throw new Error('Assert: ' + msg);
  }
}

function ensureTruthy<T>(obj: T, msg: string): T {
  assert(!!obj, msg);
  return obj;
}

export async function initTourney(tourneyCfg: TourneyConfig): Promise<number> {
  const reader = readerConfig[tourneyCfg.scores.type].reader;
  if (!reader) {
    throw new Error(`Unsupported reader type: ${tourneyCfg.scores.type}`)
  }

  const users = await getAllUsers();
  const usersByName = keyBy(users, u => u.name);

  const commissioners = tourneyCfg.commissioners.map(name => {
    return { userId: ensureTruthy(usersByName[name]?.id, `Commissioner not found: ${name}`) };
  });

  const tourney = await upsertTourney({
    name: tourneyCfg.name,
    commissioners,
    startDateEpochMillis: new Date(tourneyCfg.startDate).getTime(),
    lastUpdatedEpochMillis: Date.now(),
    config: JSON.stringify(tourneyCfg),
  });
  await upsertDraftSettings({
    tourneyId: tourney.id,
    draftHasStarted: false,
    isDraftPaused: false,
    allowClock: true,
  });
  
  const sortedUsers = tourneyCfg.draftOrder.map(name => ensureTruthy(usersByName[name], `User not found: ${name}`));
  const pickOrder = tourneyUtils.snakeDraftOrder(tourney.id, sortedUsers.map(u => u.id));

  const existingPicks = await getDraftPicks(tourney.id);
  if (existingPicks.some(p => p.golferId)) {
    throw new Error(`Cannot init tourney after draft has already started`);
  }

  await setDraftPicks(tourney.id, pickOrder);
  
  await updateScore.run(
    tourney.id,
    reader,
    tourneyCfg,
    true
  );
  await updateTourneyStandings.run(tourney.id);

  await upsertAppState({
    activeTourneyId: tourney.id,
  });

  console.log("Updating WGR");
  await updateWgr(tourney.id);

  return tourney.id;
}
