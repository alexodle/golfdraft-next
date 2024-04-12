import type { NextApiRequest, NextApiResponse } from 'next';
import { initTourney } from '../../../lib/legacy/server/scripts/initTourney';
import { TourneyConfig } from '../../../lib/models';
import { fromZonedTime } from 'date-fns-tz';

if (!process.env.ADMIN_SCRIPT_API_KEY?.length) {
  throw new Error('Missing ADMIN_SCRIPT_API_KEY env var');
}

async function initTourneyApi(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(404).end();
    return;
  }
  if (req.headers['gd-admin-script-api-key'] !== process.env.ADMIN_SCRIPT_API_KEY) {
    res.status(401).end();
    return;
  }

  const cfg = req.body as TourneyConfig;
  const [isValid, issues] = validateTourneyConfig(cfg);
  if (!isValid) {
    res.status(400).json({ issues });
    return;
  }

  const tourneyId = await initTourney(cfg);
  res.send({ tourneyId });
}

const tourneyConfigValidations: [(cfg: Partial<TourneyConfig>) => boolean, string][] = [
  [(cfg) => cfg !== undefined && cfg !== null, 'null config'],
  [(cfg) => typeof cfg.name === 'string' && cfg.name.length > 0, 'invalid name'],
  [(cfg) => typeof cfg.startDate === 'string' && !isNaN(new Date(cfg.startDate).getTime()), 'invalid date'],
  [(cfg) => typeof cfg.par === 'number' && cfg.par >= 68, 'invalid par'],
  [(cfg) => typeof cfg.scores?.type === 'string', 'invalid scores.type'],
  [(cfg) => typeof cfg.scores?.url === 'string' && cfg.scores.url.length > 0, 'invalid scores.url'],
  [(cfg) => typeof cfg.scores?.nameMap === 'object' && cfg.scores.nameMap !== null, 'invalid scores.nameMap'],
  [(cfg) => Array.isArray(cfg.commissioners) && cfg.commissioners.length > 0, 'invalid commissioners'],
  [(cfg) => Array.isArray(cfg.draftOrder) && cfg.draftOrder.length > 0, 'invalid draft order'],
  [(cfg) => typeof cfg.wgr?.url === 'string' && cfg.wgr.url.length > 0, 'invalid wgr url'],
  [(cfg) => typeof cfg.wgr?.nameMap === 'object' && cfg.wgr.nameMap !== null, 'invalid wgr name map'],
  [(cfg) => typeof cfg.timezone === 'string' && isValidTimezone(cfg.timezone), 'invalid timezone'],
];

function validateTourneyConfig(cfg: TourneyConfig): [boolean, string[]] {
  const issues = tourneyConfigValidations.filter(([v]) => !v(cfg)).map(([, issue]) => issue);
  return [issues.length === 0, issues];
}

function isValidTimezone(timezone: string): boolean {
  return !isNaN(fromZonedTime(new Date(), timezone).getTime());
}

export default initTourneyApi;
