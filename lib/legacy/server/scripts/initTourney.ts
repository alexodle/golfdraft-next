import { keyBy } from 'lodash';
import { upsertAppState } from '../../../data/appState';
import { getDraftPicks, setDraftPicks } from '../../../data/draft';
import { upsertTourney } from '../../../data/tourney';
import { getAllUsers } from '../../../data/users';
import { TourneyConfig } from '../../../models';
import readerConfig, { ReaderType } from '../../scores_sync/readerConfig';
import * as updateScore from '../../scores_sync/updateScore';
import * as updateTourneyStandings from '../../scores_sync/updateTourneyStandings';
import { updateWgr } from '../../wgr/updateWgr';
import { loadConfig } from '../tourneyConfigReader';
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
  const tourney = await upsertTourney({
    name: tourneyCfg.name,
    draftHasStarted: false,
    isDraftPaused: false,
    allowClock: true,
    startDateEpochMillis: new Date(tourneyCfg.startDate).getTime(),
    lastUpdatedEpochMillis: Date.now(),
    config: JSON.stringify(tourneyCfg),
  });
  
  const users = await getAllUsers();
  const usersByName = keyBy(users, u => u.name);

  const sortedUsers = tourneyCfg.draftOrder.map(name => ensureTruthy(usersByName[name], `User not found: ${name}`));
  const pickOrder = tourneyUtils.snakeDraftOrder(tourney.id, sortedUsers);

  const existingPicks = await getDraftPicks(tourney.id);
  if (existingPicks.some(p => p.golferId)) {
    throw new Error(`Cannot init tourney after draft has already started`);
  }

  await setDraftPicks(tourney.id, pickOrder);
  
  await updateScore.run(
    tourney.id,
    readerConfig[tourneyCfg.scores.type as ReaderType].reader,
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

async function run(configPath: string) {
  const tourneyCfg = loadConfig(configPath);
  console.log(JSON.stringify(tourneyCfg, null, 2));
  
  await initTourney(tourneyCfg);
}

if (require.main === module) {
  if (process.argv.length !== 3) {
    console.error(`Usage: ${process.argv[0]} ${process.argv[1]} <tourney_config>`);
    process.exit(1);
  }
  
  run(process.argv[2]);
}
