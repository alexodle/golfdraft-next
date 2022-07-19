import { JSDOM } from 'jsdom';
import { find, parseInt, slice } from 'lodash';
import { TourneyConfig } from '../../models';
import constants from '../common/constants';
import { Reader, ReaderResult, UpdateGolfer } from './Types';
import { fetchData } from './util';

function assert(cond: boolean, msg: string) {
  if (!cond) {
    throw new Error(msg);
  }
}

function ensureTruthy(o: any, msg: string) {
  assert(!!o, msg);
  return o;
}

function findPar(doc: Document): number {
  const possibleSpans = doc.querySelectorAll('span.header-row span.row');
  const parRowText = ensureTruthy(find(possibleSpans, it => it.textContent?.startsWith('PAR: ')), 'Par not found').textContent;
  return parseInt(parRowText.split(': ')[1]);
}

function parseDayScore(td: Element, par: number): number | 'MC' {
  const text = td.textContent?.trim();
  if (!text?.length) {
    // TODO: Turn this into typescript compatible
    return constants.MISSED_CUT as 'MC';
  }
  return parseInt(text) - par;
}

class PgaTourFieldReader implements Reader {

  async run(_config: TourneyConfig, url: string): Promise<ReaderResult> {
    const data = await fetchData(url);
    const dom = new JSDOM(data);
    const doc = dom.window.document;

    const par: number = findPar(doc);

    const golferTrs = Array.from(doc.querySelectorAll('table.table-styled > tbody > tr')).slice(1); // slice(1) to skip header row
    const golfers: UpdateGolfer[] = golferTrs.map(tr => {
      const tds = tr.querySelectorAll('td');
      const name = tds[0].textContent?.trim();
      if (!name?.length) {
        throw new Error('Name not found on golfer row');
      }
      const dayScores = slice(tds, 2, 6).map(td => parseDayScore(td, par));
      return {
        scores: dayScores,
        golfer: name,
        day: dayScores.length,
        thru: constants.NHOLES
      };
    });

    return { par, golfers };
  }

}

export default new PgaTourFieldReader();
