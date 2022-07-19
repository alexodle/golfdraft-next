import constants from '../common/constants';
import reader from '../scores_sync/pgaTourLbDataReader';
import { TourneyConfig } from '../../models';

const { MISSED_CUT } = constants;

const config: TourneyConfig = {
  name: "test tourney",
  startDate: new Date().toISOString(),
  par: 72,
  scores: {
    type: "pgatour_field",
    url: "http://test",
    nameMap: {},
  },
  draftOrder: [],
  wgr: {
    url: "http://testtest",
    nameMap: {},
  },
};

function readPreStartJson() {
  return 'test/files/pgatour_lbdata.pre_start.json'
}

function readMidRoundJson() {
  return 'test/files/pgatour_lbdata.midround.json'
}

function readMidRoundJson2() {
  return 'test/files/pgatour_lbdata.midround2.json'
}

function readMidRoundJsonDay2() {
  return 'test/files/pgatour_lbdata.midround.day2.json'
}

function readPostRound3Json() {
  return 'test/files/pgatour_lbdata.postround.day3.json'
}

function readPostStartJson() {
  return 'test/files/pgatour_lbdata.finished.json'
}

describe('PgaTourLbReader', () => {
  describe('parseGolfer', () => {

    it('parses pre-tourney golfer', async () => {
      const result = await reader.run(config, readPreStartJson());
      const g = result.golfers.find(g => g.golfer === 'Francesco Molinari');
      expect(g).toEqual({
        golfer: 'Francesco Molinari',
        scores: [0, 0, 0, 0],
        day: 1,
        thru: null,
      });
    });

    it('parses post-tourney json', async () => {
      const result = await reader.run(config, readPostStartJson());
      expect(result.par).toEqual(config.par);
    });

    it('parses finished golfer', async () => {
      const result = await reader.run(config, readPostStartJson());
      const g = result.golfers.find(g => g.golfer === 'Francesco Molinari');
      expect(g).toEqual({
        golfer: 'Francesco Molinari',
        scores: [-3, -2, 1, -8],
        day: 4,
        thru: 18,
      });
    });

    it('parses mid-round golfer', async () => {
      const result = await reader.run(config, readMidRoundJson());
      const g = result.golfers.find(g => g.golfer === 'Michael Thompson');
      expect(g).toEqual({
        golfer: 'Michael Thompson',
        scores: [-2, 0, 0, 0],
        day: 1,
        thru: 6,
      });
    });

    it('parses mid-round golfer2', async () => {
      const result = await reader.run(config, readMidRoundJson2());
      const g = result.golfers.find(g => g.golfer === 'Michael Thompson');
      expect(g).toEqual({
        golfer: 'Michael Thompson',
        scores: [-3, 0, 0, 0],
        day: 2,
        thru: 1,
      });
    });

    it('parses post round MC golfer correctly', async () => {
      const result = await reader.run(config, readPostRound3Json());
      const g = result.golfers.find(g => g.golfer === 'Billy Horschel');
      expect(g).toEqual({
        golfer: 'Billy Horschel',
        scores: [4, -1, MISSED_CUT, MISSED_CUT],
        day: 3,
        thru: null
      })
    })

    it('parses mc golfer correctly', async () => {
      const result = await reader.run(config, readPostStartJson());
      const mcGolfer = result.golfers.find(g => g.golfer === 'Charley Hoffman');
      expect(mcGolfer?.scores).toEqual([3, -1, MISSED_CUT, MISSED_CUT]);
    });

    it('parses wd correctly', async () => {
      const result = await reader.run(config, readPostStartJson());
      const wdGolfer = result.golfers.find(g => g.golfer === 'Jason DayWhoFinishedHisRound');
      expect(wdGolfer?.scores).toEqual([-1, MISSED_CUT, MISSED_CUT, MISSED_CUT]);
    });

    it('parses wd mid-round correctly', async () => {
      const result = await reader.run(config, readPostStartJson());
      const wdGolfer = result.golfers.find(g => g.golfer === 'Jason Day');
      expect(wdGolfer?.scores).toEqual([MISSED_CUT, MISSED_CUT, MISSED_CUT, MISSED_CUT]);
    });

    it('parses day 2 scores correctly', async () => {
      const result = await reader.run(config, readMidRoundJsonDay2());
      const g = result.golfers.find(g => g.golfer === 'Cameron Smith');
      expect(g).toEqual({
        golfer: 'Cameron Smith',
        scores: [-2, 0, 0, 0],
        day: 2,
        thru: null,
      });
    });

  });
});
