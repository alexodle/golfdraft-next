import edgeChromium from 'chrome-aws-lambda';
import { Browser } from 'puppeteer-core';

const LOCAL_CHROME_EXECUTABLE = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export async function createPuppeteerBrowser(): Promise<Browser> {
  const executablePath = (await edgeChromium.executablePath) ?? LOCAL_CHROME_EXECUTABLE;

  const browser = await edgeChromium.puppeteer.launch({
    executablePath,
    args: edgeChromium.args,
    headless: edgeChromium.headless,
    defaultViewport: edgeChromium.defaultViewport,
  });

  return browser;
}
