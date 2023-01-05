import reader from '../scores_sync/pgatourFieldReader';
import { UpdateGolfer } from '../scores_sync/Types';
import { TourneyConfig } from '../../models';

const config: TourneyConfig = {
  name: "test tourney",
  startDate: new Date().toISOString(),
  par: 72,
  scores: {
    type: "pgatour_field",
    url: "http://test",
    nameMap: {},
  },
  commissioners: [],
  draftOrder: [],
  wgr: {
    url: "http://testtest",
    nameMap: {},
  },
};

describe('PgaTourFieldReader', () => {
  describe('parseJson', () => {

    it('parses field', async () => {
      const json = require('./files/pgatour_field');
      const baseGolfer = {
        scores: [0, 0, 0, 0],
        thru: 0,
        day: 0
      };

      const result = await reader.run(config, json);
      expect(result).toEqual({
        par: config.par,
        golfers: [
          { golfer: 'Gary Woodland', ...baseGolfer },
          { golfer: 'Tiger Woods', ...baseGolfer },
          { golfer: 'Ian Woosnam', ...baseGolfer },
          { golfer: 'Ted Potter, Jr.', ...baseGolfer }
        ] as UpdateGolfer[]});
    });

  });
});
