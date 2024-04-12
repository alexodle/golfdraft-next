import type { NextApiRequest, NextApiResponse } from 'next';
import { getActiveTourneyId } from '../../../lib/data/appState';
import { getTourney } from '../../../lib/data/tourney';
import readerConfig from '../../../lib/legacy/scores_sync/readerConfig';
import * as updateScore from '../../../lib/legacy/scores_sync/updateScore';
import { TourneyConfig } from '../../../lib/models';
import { adminSupabase } from '../../../lib/supabase';
import { fromZonedTime } from 'date-fns-tz';

if (!process.env.ADMIN_SCRIPT_API_KEY?.length) {
  throw new Error('Missing ADMIN_SCRIPT_API_KEY env var');
}

const [MIN_LOCAL_HOUR, MAX_LOCAL_HOUR] = [7, 20]; // 7am - 10pm inclusive

async function updateScoresApi(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(404).end();
    return;
  }
  if (req.headers['gd-admin-script-api-key'] !== process.env.ADMIN_SCRIPT_API_KEY) {
    res.status(401).end();
    return;
  }

  const supabase = adminSupabase();
  const tourneyId = await getActiveTourneyId(supabase);
  const tourney = await getTourney(tourneyId, supabase);

  const tourneyConfig = JSON.parse(tourney.config) as TourneyConfig;

  if (tourneyConfig.timezone) {
    const currLocalTourneyHour = localHourIn(tourneyConfig.timezone);
    if (currLocalTourneyHour < MIN_LOCAL_HOUR || currLocalTourneyHour > MAX_LOCAL_HOUR) {
      res.status(200).send({ status: 'noop - outside tourney hours' });
      return;
    }
  }

  const reader = readerConfig[tourneyConfig.scores.type]?.reader;
  if (!reader) {
    throw new Error(`Unsupported reader type: ${tourneyConfig.scores.type}`);
  }

  await updateScore.run(tourneyId, reader, tourneyConfig);

  res.status(201).end();
}

function localHourIn(timezone: string) {
  const d = fromZonedTime(new Date(), timezone);
  return d.getHours();
}

export default updateScoresApi;
