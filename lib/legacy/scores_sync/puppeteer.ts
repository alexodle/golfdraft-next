import chrome from 'chrome-aws-lambda';
import puppeteer, { Browser } from 'puppeteer-core';

export async function createPuppeteerBrowser(): Promise<Browser> {
  const options = process.env.AWS_REGION
    ? {
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
      }
    : {
        args: [],
        executablePath:
          process.platform === 'linux'
            ? '/usr/bin/google-chrome'
            : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      };

  const browser = await puppeteer.launch(options);
  return browser;
}
