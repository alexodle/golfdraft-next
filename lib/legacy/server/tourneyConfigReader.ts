// Refreshes users, pick order, draft picks, and chat

import * as fs from 'fs';
import { TourneyConfig } from '../../models';

function ensureReplaceKey(o: any, oldKey: string, newKey: string) {
  if (o[oldKey]) {
    o[newKey] = o[oldKey];
    delete o[oldKey];
  }
}

export function loadConfig(tourneyCfgPath: string): TourneyConfig {
  const cfg: TourneyConfig = JSON.parse(fs.readFileSync(tourneyCfgPath, 'utf8'));

  // Back-compat
  ensureReplaceKey(cfg, 'scoresSync', 'scores');
  ensureReplaceKey(cfg.scores, 'syncType', 'type');

  return cfg;
}
