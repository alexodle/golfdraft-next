import { getActiveTourneyId } from '../../data/appState';
import { updateWgr } from './updateWgr';

async function run() {
  const tourneyId = await getActiveTourneyId();
  await updateWgr(tourneyId);
}

if (require.main === module) {
  run();
}
