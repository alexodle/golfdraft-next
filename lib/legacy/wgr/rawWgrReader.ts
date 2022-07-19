import { JSDOM } from 'jsdom';
import request from 'request';

const AMATEUR_REGEX = /\(Am\)$/i;

function download(url: string): Promise<string> {
  return new Promise((fulfill, reject) => {
    request({ url }, (error, _response, body) => {
      if (error) {
        reject(error);
        return;
      }
      fulfill(body);
    });
  });
}

export type WgrEntry = Readonly<{
  name: string;
  wgr: number;
}>

export async function rawWgrReader(url: string): Promise<WgrEntry[]> {
  const wgrs: WgrEntry[] = [];

  const body = await download(url);
  const dom = new JSDOM(body);

  const trs = dom.window.document.body.querySelectorAll('#ranking_table > .table_container > table > tbody > tr');
  trs.forEach(tr => {
    const tds = tr.querySelectorAll('td');
    const wgr = +(tds.item(0).textContent ?? NaN);
    if (isNaN(wgr)) {
      throw new Error(`Invalid wgr for row: ${tr.textContent}`);
    }

    const name = tr.querySelector('td.name')
      ?.textContent
      ?.trim()
      .replace(AMATEUR_REGEX, '');
    if (!name?.length) {
      throw new Error(`Invalid name for row: ${tr.textContent}`);
    }

    wgrs.push({ wgr, name });
  });
  
  return wgrs;
}
