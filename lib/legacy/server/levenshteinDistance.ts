import { levenshtein } from 'underscore.string';

/** Runs the given sourceStr against all strings in the target list, and returns the matches in order of levenshtein distance from source */
export function levenshteinAll<T>(
  sourceStr: string,
  targetList: T[],
  getValue: (v: T) => string,
): { target: T; dist: number; coeff: number }[] {
  const results = targetList.map((targetStr) => {
    return { target: targetStr, ...calcLevenshtein(sourceStr, getValue(targetStr)) };
  });

  results.sort((r1, r2) => {
    if (r1.coeff !== r2.coeff) {
      return r2.coeff - r1.coeff; // reverse;
    }
    return getValue(r1.target).localeCompare(getValue(r2.target));
  });

  return results;
}

/** VisibleForTesting */
export function calcLevenshtein(s1: string, s2: string): { dist: number; coeff: number } {
  const norms1 = normalize(s1);
  const norms2 = normalize(s2);

  let bestDist = Number.MAX_VALUE;
  forEachWordPermutation(norms1.split(' '), (s1perm: string) => {
    bestDist = Math.min(bestDist, levenshtein(s1perm, norms2));
    return bestDist > 0;
  });

  const longestLength = Math.max(norms1.length, norms2.length);
  return {
    dist: bestDist,
    coeff: (longestLength - bestDist) / longestLength,
  };
}

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

function forEachWordPermutation(words: string[], callback: (perm: string) => void, output: string[] = []): void {
  if (words.length === 0) {
    return callback(output.join(' '));
  }

  words.forEach((w, i) => {
    const newWords = words.slice(0, i).concat(words.slice(i + 1, words.length));
    forEachWordPermutation(newWords, callback, output.concat([w]));
  });
}
