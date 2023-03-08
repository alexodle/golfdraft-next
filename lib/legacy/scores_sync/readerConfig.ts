import pgatourFieldReader from './pgatourFieldReader';
import pgaTourLbDataReader from './pgaTourLbDataReader';
import pgaTourScraper2 from './pgaTourDotComScraper2';
import pgaTourLbDataScraperReader from './pgaTourLbDataScraperReader';
import { Reader } from './Types';

export interface ReaderConfig {
  [key: string]: { reader: Reader };
}

const readerConfig: ReaderConfig = {
  pgatour_field: {
    reader: pgatourFieldReader,
  },

  // New pgatour.com json format (2019)
  pgatour_lbdata: {
    reader: pgaTourLbDataReader,
  },

  // New pgatour.com json format (2023)
  pgatour_scraper_2: {
    reader: pgaTourScraper2,
  },

  // Required for unique pgatour_lbdata urls (2020)
  pgatour_lbdata_scraper: {
    reader: pgaTourLbDataScraperReader,
  },
};

export default readerConfig as ReaderConfig;
