import { TourneyConfig } from '../../models';
import constants from '../common/constants';
import { PGATourLeaderboardJSONReaderNextData, PlayerElement } from './PgaTourLeaderboardJsonReaderNextData';
import { Reader, ReaderResult, Score, Thru, UpdateGolfer } from './Types';

class PgaTourLeaderboardJsonReader implements Reader {
  async run(config: TourneyConfig, url: string): Promise<ReaderResult> {
    const data = await fetchJson(url);
    const parsed = parse(data.props.pageProps.leaderboard.players, config.par);
    return parsed;
  }
}

function grabNextData(html: string): PGATourLeaderboardJSONReaderNextData {
  const idx = html.indexOf('__NEXT_DATA__');
  if (idx < 0) {
    throw new Error('NEXT_DATA not found');
  }

  const startIdx = html.indexOf('>', idx) + 1;
  const endIdx = html.indexOf('</script>', startIdx);
  const jsonStr = html.substring(startIdx, endIdx);
  const json = JSON.parse(jsonStr) as PGATourLeaderboardJSONReaderNextData;
  return json;
}

async function fetchJson(url: string) {
  const res = await fetch(url);
  const html = await res.text();
  const data = grabNextData(html);
  return data;
}

export function parse(players: PlayerElement[], par: number): ReaderResult {
  const golfers: UpdateGolfer[] = [];

  for (const { player, scoringData } of players) {
    if (!player || !scoringData) {
      continue;
    }

    const name = player.displayName;
    if (name.length === 0) {
      continue;
    }

    const rawThru = scoringData.thru;
    const rawRounds = scoringData.rounds;
    const positionStr = scoringData.position;
    const isWD = positionStr === 'WD';
    const isCut = positionStr === 'CUT';

    let scores = rawRounds.map(safeParseInt).map<Score>((n) => (n !== null ? n - par : null));
    let thru = parseThru(rawThru);

    const day = calcCurrentDay(scores, rawThru === 'F');

    if (rawThru !== 'F') {
      if (!isWD) {
        const currentRoundScore = parseRoundScore(scoringData.score);
        scores[day] = currentRoundScore;
      } else {
        scores[day] = constants.MISSED_CUT;
      }
    }

    if (isWD) {
      scores = scores.map((s) => (s === null ? constants.MISSED_CUT : s));
      thru = null;
    }

    if (isCut) {
      scores[3] = constants.MISSED_CUT;
      scores[2] = constants.MISSED_CUT;
    }

    const g: UpdateGolfer = { golfer: name, scores: scores.map((s) => s || 0), day: day + 1, thru };
    golfers.push(g);
  }

  return { par, golfers };
}

export function calcCurrentDay(rounds: Score[], isFinished: boolean): number {
  let d = isFinished ? -1 : 0;
  for (let i = 0; i < rounds.length && rounds[i] !== null; i++) {
    d++;
  }
  return d;
}

function safeParseInt(str: string): number | null {
  return isNullStr(str) ? null : requireParseInt(str, 'failed to safe-parse int');
}

function isNullStr(str: string): boolean {
  return str === null || str === '-' || str.startsWith('--') || str === 'null' || str.trim().length === 0;
}

function parseThru(thruStr: string): Thru {
  thruStr = thruStr.replace('*', '').trim();
  if (isNullStr(thruStr) || thruStr.includes(' AM') || thruStr.includes(' PM')) {
    return null;
  }
  return thruStr === 'F' ? constants.NHOLES : requireParseInt(thruStr, 'failed to parse thruStr');
}

function parseRoundScore(str: string): number {
  if (isNullStr(str)) return 0;
  if (str === 'E') return 0;
  if (str.startsWith('+')) return requireParseInt(str.substr(1), 'failed to parse positive round score');
  if (str.startsWith('-')) return requireParseInt(str, 'failed to parse negative round score');
  throw new Error(`Unexpected round score: ${str}`);
}

function requireParseInt(intStr: string, errMsg: string): number {
  const n = parseInt(intStr, 10);
  if (isNaN(n)) {
    throw new Error(`Failed to parse int: '${intStr}' - ${errMsg}`);
  }
  return n;
}

export default new PgaTourLeaderboardJsonReader();
