import chromium from '@sparticuz/chromium-min';
import puppeteer, { Browser, PuppeteerLaunchOptions } from 'puppeteer-core';

export async function createPuppeteerBrowser(): Promise<Browser> {
  const options: PuppeteerLaunchOptions = process.env.AWS_REGION
    ? {
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(
          'https://github.com/Sparticuz/chromium/releases/download/v122.0.0/chromium-v122.0.0-pack.tar',
        ),
        headless: true,
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
