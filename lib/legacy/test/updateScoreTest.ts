import { keyBy } from 'lodash';
import constants from '../common/constants';
import {
  ReaderResult
} from '../scores_sync/Types';
import * as updater from '../scores_sync/updateScore';

const { MISSED_CUT } = constants;

const tid = 1000;

describe('updateScore', function () {

  describe('validate', function () {

    it('catches invalid par data', function () {
      expect(updater.validate({ par: 68 } as ReaderResult)).toBe(false);
    });

    it('catches bad golfer names', function () {
      expect(updater.validate({
        par: 70,
        golfers: [{golfer: '-'}]
      } as ReaderResult)).toBe(false);
    });

    it('catches non-numeric golfer score', function () {
      expect(updater.validate({
        par: 70,
        golfers: [{ golfer: 'Jack Bauer', scores: [1, 'a', 2, 3] }]
      } as ReaderResult)).toBe(false);
    });

    it('catches NaN golfer scores', function () {
      expect(updater.validate({
        par: 70,
        golfers: [{ golfer: 'Jack Bauer', scores: [1, NaN, 2, 3] }]
      } as ReaderResult)).toBe(false);
    });

    it('allows "MC" as a golfer score', function () {
      expect(updater.validate({
        par: 70,
        golfers: [{
          golfer: 'Jack Bauer',
          scores: [1, -1, MISSED_CUT, MISSED_CUT],
          day: 4
        }]
      } as ReaderResult)).toBe(true);
    });

    it('catches bad day values', function () {
      expect(updater.validate({
        par: 70,
        golfers: [{ golfer: 'Jack Bauer', scores: [1, -1, 0, 0], day: 5 }]
      } as ReaderResult)).toBe(false);
      expect(updater.validate({
        par: 70,
        golfers: [{ golfer: 'Jack Bauer', scores: [1, -1, 0, 0], day: -1 }]
      } as ReaderResult)).toBe(false);
    });

  });

  describe('mergeOverrides', function () {

    it('merges override scores', function () {
      const gid1 = 1;
      const gid2 = 2;
      const gid3 = 3;
      const merged = keyBy(updater.mergeOverrides(
        [
          { tourneyId: tid, golferId: gid1, day: 4, scores: [-1, -20, -30, 0], thru: 1 },
          { tourneyId: tid, golferId: gid2, day: 4, scores: [-1, 2, -2, 0], thru: 1 },
          { tourneyId: tid, golferId: gid3, day: 3, scores: [-1, -30, MISSED_CUT, MISSED_CUT], thru: 1 }
        ],
        [
          { tourneyId: tid, golferId: gid1, day: undefined, scores: [-1, MISSED_CUT, MISSED_CUT, MISSED_CUT] },
          { tourneyId: tid, golferId: gid3, day: 4, scores: [-1, MISSED_CUT, MISSED_CUT, MISSED_CUT] }
        ]
      ), 'golfer');

      expect(merged[gid1.toString()]).toEqual({
        tourneyId: tid,
        golfer: gid1.toString(),
        day: 4,
        scores: [-1, MISSED_CUT, MISSED_CUT, MISSED_CUT],
        thru: 1
      });
      expect(merged[gid2.toString()]).toEqual({
        tourneyId: tid,
        golfer: gid2.toString(),
        day: 4,
        scores: [-1, 2, -2, 0],
        thru: 1
      });
      expect(merged[gid3.toString()]).toEqual({
        tourneyId: tid,
        golfer: gid3.toString(),
        day: 4,
        scores: [-1, MISSED_CUT, MISSED_CUT, MISSED_CUT],
        thru: 1
      });
    });

  });

});
