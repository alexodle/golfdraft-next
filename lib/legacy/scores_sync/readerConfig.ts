import pgatourFieldReader from './pgatourFieldReader';
import pgaTourHistoricHtmlReader from './pgaTourHistoricHtmlReader';
import pgaTourLbDataReader from './pgaTourLbDataReader';
import pgaTourLbDataScraperReader from './pgaTourLbDataScraperReader';
import { Reader } from './Types';

export interface ReaderConfig {
  [key: string]: { reader: Reader };
}

const readerConfig: ReaderConfig = {
  pgatour_field: {
    reader: pgatourFieldReader,
  },

  pgatour_historic_html: {
    reader: pgaTourHistoricHtmlReader,
  },

  // New pgatour.com json format (2019)
  pgatour_lbdata: {
    reader: pgaTourLbDataReader,
  },

  // Required for unique pgatour_lbdata urls (2020)
  pgatour_lbdata_scraper: {
    reader: pgaTourLbDataScraperReader,
  },
};

export default readerConfig as ReaderConfig;
