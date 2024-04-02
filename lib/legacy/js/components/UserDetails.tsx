import cx from 'classnames';
import _ from 'lodash';
import { useCompleteDraftPicks } from '../../../data/draft';
import { useGolfers } from '../../../data/golfers';
import { useCurrentTourney } from '../../../data/tourney';
import { useTourneyStandings } from '../../../data/tourneyStandings';
import { useAllUsers } from '../../../data/users';
import * as utils from '../../common/utils';

type UserDetailsProps = Readonly<{
  userId: number;
}>;

export const UserDetails = ({ userId }: UserDetailsProps) => {
  const allUsers = useAllUsers();
  const tourney = useCurrentTourney();
  const standings = useTourneyStandings();
  const draftPicks = useCompleteDraftPicks();
  const golferLookup = useGolfers();

  if (!allUsers.data || !tourney.data || !standings.data || !draftPicks.data || !golferLookup.data) {
    return null;
  }

  const user = allUsers.data[userId];

  const currentDayIndex = (standings.data.currentDay ?? 0) - 1;
  const userScores = standings.data.standings;

  const userScoreIndex = userScores.findIndex((us) => us.userId === user?.id);
  const userScore = userScores[userScoreIndex];

  const golferPickNumbers: Record<string, number> = {};
  draftPicks.data.forEach((dp, i) => {
    golferPickNumbers[dp.golferId] = i;
  });

  const golferScores = _.chain(userScore.dayScores)
    .flatMap((ds) => ds.golferScores)
    .groupBy((gs) => gs.golferId)
    .toPairs()
    .sortBy(([golfer]) => golferPickNumbers[golfer])
    .value();

  const trs = _.map(golferScores, ([golferId, golferScores]) => {
    const golferTotal = _.sumBy(golferScores, (gs) => gs.score);
    const golfer = golferLookup.data.getGolfer(Number(golferId));
    return (
      <tr key={golferId}>
        <td>
          {golfer.name}
          <small> ({utils.getOrdinal(golferPickNumbers[golferId] + 1)} pick)</small>
        </td>
        <td>{utils.toGolferScoreStr(golferTotal)}</td>
        {golferScores.map((gs, i) => {
          return (
            <td
              key={i}
              className={cx({
                'missed-cut': gs.missedCut,
                'score-used': gs.scoreUsed,
              })}
            >
              {utils.toGolferScoreStr(gs.score)}
              <sup className="missed-cut-text"> MC</sup>
              {i !== currentDayIndex ? null : <sup className="thru-text"> {utils.toThruStr(gs.thru ?? 0)}</sup>}
            </td>
          );
        })}
      </tr>
    );
  });

  return (
    <section>
      <h2>
        {user.name}
        <span> </span>({utils.toGolferScoreStr(userScore.totalScore)})
        <small>
          {' '}
          {utils.getOrdinal(userScore.standing + 1)} place {userScore.isTied ? '(Tie)' : null}
        </small>
      </h2>
      <table className="table user-details-table">
        <thead>
          <tr>
            <th>Golfer</th>
            <th>Score</th>
            <th>Day 1</th>
            <th>Day 2</th>
            <th>Day 3</th>
            <th>Day 4</th>
          </tr>
        </thead>
        <tbody>{trs}</tbody>
      </table>
    </section>
  );
};
