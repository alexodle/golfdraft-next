import pgaTourLeaderboardJsonReader from './pgaTourLeaderboardJsonReader';
import { Reader } from './Types';

interface ReaderConfig {
  [key: string]: { reader: Reader };
}

const readerConfig: ReaderConfig = {
  // TODO: change name
  pgatour_scraper_2: {
    reader: pgaTourLeaderboardJsonReader,
  },
};

export default readerConfig as ReaderConfig;
