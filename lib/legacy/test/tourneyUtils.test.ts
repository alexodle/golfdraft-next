import { snakeDraftOrder } from '../server/tourneyUtils';

describe('tourneyUtils', function () {
  describe('snakeDraftOrder', function () {
    it('behaves in a snake-like fashion', function () {
      expect(snakeDraftOrder(1, [101, 102])).toEqual([
        { tourneyId: 1, pickNumber: 0, user: 101 },
        { tourneyId: 1, pickNumber: 1, user: 102 },

        { tourneyId: 1, pickNumber: 2, user: 102 },
        { tourneyId: 1, pickNumber: 3, user: 101 },

        { tourneyId: 1, pickNumber: 4, user: 101 },
        { tourneyId: 1, pickNumber: 5, user: 102 },

        { tourneyId: 1, pickNumber: 6, user: 102 },
        { tourneyId: 1, pickNumber: 7, user: 101 },
      ]);
    });
  });
});
