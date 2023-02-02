import { Page } from 'puppeteer-core';
import { TourneyConfig } from '../../models';
import constants from '../common/constants';
import { createPuppeteerBrowser } from './puppeteer';
import { Reader, ReaderResult, Score, Thru, UpdateGolfer } from './Types';

function requireParseInt(intStr: string, errMsg: string): number {
  const n = parseInt(intStr, 10);
  if (isNaN(n)) {
    throw new Error(`Failed to parse int: '${intStr}' - ${errMsg}`);
  }
  return n;
}

class PgaTourScraperReader implements Reader {
  async run(config: TourneyConfig, url: string): Promise<ReaderResult> {
    const page = await getLeaderboardPage(url);
    return parse(page, config.par);
  }
}

async function getLeaderboardPage(leaderboardHTMLUrl: string): Promise<Page> {
  const browser = await createPuppeteerBrowser();
  try {
    const page = await browser.newPage();
    await page.goto(leaderboardHTMLUrl);

    // HACK - taking a screenshot seems to force the table to load, when nothing else will
    await page.screenshot({ path: '/tmp/last.png' });

    await page.waitForSelector('table.leaderboard tbody tr.line-row', { timeout: 1000 * 60 });

    return page;
  } finally {
    await browser.close();
  }
}

export async function parse(page: Page, par: number): Promise<ReaderResult> {
  const rows = await page.$$('table.leaderboard tbody tr.line-row');

  const golfers: UpdateGolfer[] = await Promise.all(
    rows.map(async (tr) => {
      const nameCol = await tr.$('td.player-name .player-name-col');
      if (!nameCol) {
        throw new Error(`Failed to find nameCol for row: ${await tr.asElement()?.getInnerHTML()}`);
      }
      const thruCol = await tr.$('td.thru');
      if (!thruCol) {
        throw new Error(`Failed to find thruCol for row: ${await tr.asElement()?.getInnerHTML()}`);
      }
      const roundsCols = await tr.$$('td.round-x');
      if (!roundsCols.length) {
        throw new Error(`Failed to find roundsCols for row: ${await tr.asElement()?.getInnerHTML()}`);
      }
      const positionCol = await tr.$('td.position');
      if (!positionCol) {
        throw new Error(`Failed to find positionCol for row: ${await tr.asElement()?.getInnerHTML()}`);
      }
      const roundCol = await tr.$('td.round');
      if (!roundCol) {
        throw new Error(`Failed to find roundCol for row: ${await tr.asElement()?.getInnerHTML()}`);
      }

      const name = (await nameCol.getInnerText()).replace(' #', '').replace(' (a)', '').trim();
      const rawThru = (await thruCol.getInnerText()).replace('*', '').trim();
      const rawRounds: string[] = await Promise.all(
        roundsCols.map(async (td) => await (await td.getInnerText()).trim()),
      );

      const positionStr = (await positionCol.getInnerText()).trim();
      const isWD = positionStr === 'WD';
      const isCut = positionStr === 'CUT';

      let scores: Score[] = rawRounds.map(safeParseInt).map((n) => (n !== null ? n - par : null));
      let thru = parseThru(rawThru);
      const day = calcCurrentDay(scores, rawThru === 'F');

      if (rawThru !== 'F') {
        if (!isWD) {
          const currentRoundScore = parseRoundScore((await roundCol.getInnerText()).trim());
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
      return g;
    }),
  );

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
  return str === null || str.startsWith('--') || str === 'null' || str.trim().length === 0;
}

function parseThru(thruStr: string): Thru {
  thruStr = thruStr.replace('*', '').trim();
  if (isNullStr(thruStr)) {
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

export default new PgaTourScraperReader();
