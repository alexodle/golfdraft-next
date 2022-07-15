import { chain, groupBy, isNumber, keyBy, mapValues, maxBy, sumBy, times, sortBy } from 'lodash';
import constants from '../common/constants';
import { getGolferScores } from '../../data/scores';
import { getDraftPicks, getCompletedDraftPicks } from '../../data/draft';
import { CompletedDraftPick, GolferScore, TourneyStandings, WorstDayScore, TourneyStandingGolferScore, TourneyStandingPlayerDayScore, TourneyStandingPlayerScore } from '../../models';
import { updateTourneyStandings } from '../../data/tourneyStandings';
import { adminSupabase } from '../../supabase';

function buildPlayerScore(
  tourneyId: number,
  userId: number,
  rawScores: GolferScore[],
  worstScoresForDay: WorstDayScore[]
): TourneyStandingPlayerScore {
  const dayScores = times<TourneyStandingPlayerDayScore>(constants.NDAYS, day => {

    const golferScores = rawScores.map((golferScores, idx) => {
      const missedCut = golferScores.scores[day] === constants.MISSED_CUT;
      const dayScore = missedCut ? worstScoresForDay[day].score : golferScores.scores[day] as number;
      return {
        day,
        idx,
        missedCut,
        thru: day + 1 === golferScores.day ? golferScores.thru : null,
        golferId: golferScores.golferId,
        score: dayScore
      }
    });

    const usedScores = chain(golferScores)
      .sortBy(ds => ds.score)
      .take(constants.NSCORES_PER_DAY)
      .map(ds => ds.idx)
      .value();
    const golferScoresFinal = golferScores.map<TourneyStandingGolferScore>(gs => {
      const scoreUsed = usedScores.indexOf(gs.idx) >= 0;
      return {
        golferId: gs.golferId,
        score: gs.score,
        missedCut: gs.missedCut,
        thru: gs.thru ?? null,
        scoreUsed,
      };
    });

    const totalDayScore = sumBy(golferScoresFinal, ds => ds.scoreUsed ? ds.score : 0);
    return {
      totalScore: totalDayScore,
      day,
      golferScores: golferScoresFinal
    };
  });

  const totalScore = sumBy(dayScores, sbd => sbd.totalScore);

  return {
    tourneyId,
    userId,
    totalScore,

    // Filled in later
    standing: -1,
    isTied: false,

    dayScores,
  };
}

function isTied(sortedScores: TourneyStandingPlayerScore[], i: number) {
  const totalScore = sortedScores[i].totalScore;
  return (
    (i > 0 && sortedScores[i - 1].totalScore === totalScore) ||
    (i < sortedScores.length - 1 && sortedScores[sortedScores.length - 1].totalScore === totalScore));
}

function fillInStandings(sortedScores: TourneyStandingPlayerScore[]) {
  let currentStanding = -1;
  sortedScores.forEach((ps, i) => {
    if (i === 0 || ps.totalScore !== sortedScores[i - 1].totalScore) {
      currentStanding++;
    }
    ps.isTied = isTied(sortedScores, i);
    ps.standing = currentStanding;
  });
}

function estimateCurrentDay(scores: GolferScore[]) {
  const nonMissedCutScore = scores.find(gs => !gs.scores.some(s => s === constants.MISSED_CUT));
  if (nonMissedCutScore === undefined) {
    throw new Error(`Could not estimate current day for scores: ${JSON.stringify(scores)}`);
  }
  return nonMissedCutScore.day;
}

export async function run(tourneyId: number): Promise<TourneyStandings> {
  const [scores, draftPicks] = await Promise.all([
    getGolferScores(tourneyId, adminSupabase()),
    getCompletedDraftPicks(tourneyId, adminSupabase()),
  ]);

  if (!scores.length) {
    throw new Error(`No scores found for tourney: ${tourneyId}`);
  }

  console.log("Running player score update");

  // Summary info
  const worstScoresForDay = times<WorstDayScore>(constants.NDAYS, day => {
    const maxGolferScore = maxBy(scores, s => isNumber(s.scores[day]) ?
      s.scores[day] :
      Number.MIN_VALUE) as GolferScore;
    const maxScore = isNumber(maxGolferScore.scores[day]) ?
      maxGolferScore.scores[day] as number :
      0;
    return {
      day,
      golferId: maxGolferScore.golferId,
      score: maxScore
    };
  });

  const picksByUser = groupBy(draftPicks, p => p.userId);
  const scoresByPlayer = keyBy(scores, s => s.golferId);
  const playerRawScores = mapValues(picksByUser, picks => {
    const scores =  picks.map(p => {
      const score = scoresByPlayer[p.golferId];
      if (!score) {
        throw new Error(`No score found for golfer: ${p.golferId} in map: ${JSON.stringify(scoresByPlayer, null, 2).substring(0,500)}`);
      }
      return score;
    });
    return scores;
  });

  const playerScores = sortBy(
    Object.entries(playerRawScores)
      .map(([pid, rawScores]) => buildPlayerScore(tourneyId, +pid, rawScores, worstScoresForDay)), 
    ps => ps.totalScore);

  fillInStandings(playerScores);

  const currentDay = estimateCurrentDay(scores);
  const tourneyStandings: TourneyStandings = { tourneyId, currentDay, worstScoresForDay };

  updateTourneyStandings(tourneyStandings, playerScores);
  console.log("DONE Running player score update");

  return tourneyStandings;
}
