import { calcLevenshtein, levenshteinAll } from '../server/levenshteinDistance';

describe('levenshteinDistance', function () {

  describe('calcLevenshtein', function () {

    it('returns 0 for equal strings', function () {
      expect(calcLevenshtein('string', 'string')).toEqual({
        dist: 0,
        coeff: 1.0
      });
    });

    it('returns 1 for almost equal strings', function () {
      expect(calcLevenshtein('string', 'string1')).toEqual({
        dist: 1,
        coeff: (7 - 1) / 7
      });
    });

    it('returns correctly for fully unequal strings', function () {
      expect(calcLevenshtein('a', 'b')).toEqual({
        dist: 1,
        coeff: 0
      });
    });

    it('tries word permutations', function () {
      expect(calcLevenshtein('a b', 'b a')).toEqual({
        dist: 0,
        coeff: 1
      });
    });

    it('ignores case', function () {
      expect(calcLevenshtein('A', 'a')).toEqual({
        dist: 0,
        coeff: 1
      });
    });

    it('uses longest string to calc coeff', function () {
      expect(calcLevenshtein('aaab', 'b')).toEqual({
        dist: 3,
        coeff: (4 - 3) / 4
      });
    });

  });

  describe('levenshteinAll', function () {

    it('tries all combos', function () {
      expect(levenshteinAll(
        'test1',
        ['alxx1', 'test2'],
        (v) => v
      )).toEqual({ source: 'test1', results: [
        { target: 'test2', dist: 1, coeff: (5 - 1) / 5 },
        { target: 'alxx1', dist: 4, coeff: (5 - 4) / 5 }
      ]});
    });

    it('preserves original casing', function () {
      expect(levenshteinAll('Ac', ['a', 'B'], (v) => v)).toEqual({ source: 'Ac', results: [
          { target: 'a', dist: 1, coeff: (2 - 1) / 2 },
          { target: 'B', dist: 2, coeff: 0 }
        ]}
      );
    });

    it('sorts by [coeff, target]', function () {
      expect(levenshteinAll('a', ['d', 'c', 'b'], (v) => v)).toEqual({
        source: 'a', results: [
          { target: 'b', dist: 1, coeff: 0 },
          { target: 'c', dist: 1, coeff: 0 },
          { target: 'd', dist: 1, coeff: 0 }
        ]}
      );
    });

  });

});

