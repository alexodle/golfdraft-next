import { calcCurrentDay } from '../scores_sync/pgaTourLbDataScraperReader';
import { createPuppeteerBrowser } from '../scores_sync/puppeteer';
import { parse } from '../scores_sync/pgaTourLbDataScraperReader';
import { Browser } from 'puppeteer-core';

describe('PgaTourScraperReader', () => {
  let browser: Browser;
  beforeAll(async () => {
    browser = await createPuppeteerBrowser();
  }, 20_000);

  afterAll(async () => {
    await browser?.close();
  });

  describe('parse', () => {
    it('parses mid round', async () => {
      const page = await browser.newPage();
      await page.goto(`file:///${__dirname}/files/pgatour_lbdata_scraper.midround.html`);
      const results = await parse(page, 72);
      console.dir(results);
    });

    // it('parses for missed cut', () => {
    //   // TODO
    // });

    // it('parses for WD', () => {
    //   // TODO
    // });

    // it('parses for mid-day WD', () => {
    //   // TODO
    // });
  });

  /*
  NF: [,,,] -> 0
  F: [1,,,] -> 0
  NF: [1,,,] -> 1
  F: [1,1,,] -> 1
  NF: [1,1,,] -> 2
  F: [1,1,1,1] -> 3
  ----- NF: [1,1,1,1] -----
  */
  describe('calcCurrentDay', () => {
    it('parses active day 0', () => {
      expect(calcCurrentDay([null, null, null, null], false)).toEqual(0);
    });

    it('parses finished day 0', () => {
      expect(calcCurrentDay([0, null, null, null], true)).toEqual(0);
    });

    it('parses active day 1', () => {
      expect(calcCurrentDay([0, null, null, null], false)).toEqual(1);
    });

    it('parses finished final day', () => {
      expect(calcCurrentDay([0, 0, 0, 0], true)).toEqual(3);
    });
  });
});
