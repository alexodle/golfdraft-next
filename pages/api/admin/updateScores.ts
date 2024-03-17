import type { NextApiRequest, NextApiResponse } from 'next';
import { getActiveTourneyId } from '../../../lib/data/appState';
import { getTourney } from '../../../lib/data/tourney';
import readerConfig from '../../../lib/legacy/scores_sync/readerConfig';
import * as updateScore from '../../../lib/legacy/scores_sync/updateScore';
import { TourneyConfig } from '../../../lib/models';
import { adminSupabase } from '../../../lib/supabase';

if (!process.env.ADMIN_SCRIPT_API_KEY?.length) {
  throw new Error('Missing ADMIN_SCRIPT_API_KEY env var');
}

async function updateScoresApi(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(404).end();
  }
  if (req.headers['gd-admin-script-api-key'] !== process.env.ADMIN_SCRIPT_API_KEY) {
    return res.status(401).end();
  }

  // res.send('Running');

  const supabase = adminSupabase();
  const tourneyId = await getActiveTourneyId(supabase);
  const tourney = await getTourney(tourneyId, supabase);

  const tourneyConfig = JSON.parse(tourney.config) as TourneyConfig;

  const reader = readerConfig[tourneyConfig.scores.type]?.reader;
  if (!reader) {
    throw new Error(`Unsupported reader type: ${tourneyConfig.scores.type}`);
  }

  await updateScore.run(tourneyId, reader, tourneyConfig);

  res.status(201).end();
}

// export const runtime = 'edge';

// export const config = {
//   maxDuration: 30, // seconds
// };

export default updateScoresApi;
