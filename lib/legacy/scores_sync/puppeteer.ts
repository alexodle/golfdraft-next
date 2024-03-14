import chromium from '@sparticuz/chromium-min';
import puppeteer, { Browser } from 'puppeteer-core';

export async function createPuppeteerBrowser(): Promise<Browser> {
  const options = process.env.AWS_REGION
    ? {
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(
          'https://github.com/Sparticuz/chromium/releases/download/v110.0.1/chromium-v110.0.1-pack.tar',
        ),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
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
