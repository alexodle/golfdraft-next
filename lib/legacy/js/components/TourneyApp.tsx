import moment from 'moment';
import { useState } from 'react';
import { useGolfers } from '../../../data/golfers';
import { useCurrentTourney } from '../../../data/tourney';
import { useTourneyStandings } from '../../../data/tourneyStandings';
import { useCurrentUser } from '../../../data/users';
import Loading from '../../../Loading';
import { toGolferScoreStr } from '../../common/utils';
import GolferLogic from '../logic/GolferLogic';
import ChatRoom from './ChatRoom';
import { GolfDraftPanel } from './GolfDraftPanel';
import { UserDetails } from './UserDetails';
import { UserStandings } from './UserStandings';

export const TourneyApp = () => {
  const { data: user } = useCurrentUser();
  const tourney = useCurrentTourney();
  const standings = useTourneyStandings();
  const golferLookup = useGolfers();

  const [userDetailsUserId, setUserDetailsUserId] = useState<number>();

  if (!user || !tourney.data || !standings.data || !golferLookup.data) {
    return <Loading />;
  }

  if (!standings.data.standings.length) {
    return (
      <div>
        <p>No standings yet. Check back in a bit.</p>
      </div>
    );
  }

  return (
    <section>
      <p>
        <small>
          Scores sync every 30 minutes. Last sync: <b>{moment(tourney.data.lastUpdatedEpochMillis).calendar()}</b>
        </small>
      </p>

      <GolfDraftPanel heading="Overall Standings">
        <UserStandings selectedUserId={userDetailsUserId} onUserSelected={setUserDetailsUserId} />
      </GolfDraftPanel>

      <a id="UserDetails" />
      <GolfDraftPanel heading="Score Details">
        <UserDetails userId={userDetailsUserId ?? user.id} />
      </GolfDraftPanel>

      {!standings.data.worstScoresForDay.length ? null : (
        <GolfDraftPanel heading="Worst Scores of the Day">
          <ul className="list-unstyled">
            {standings.data.worstScoresForDay.map((s) => {
              const golfer = golferLookup.data.getGolfer(s.golferId);
              return (
                <li key={s.day}>
                  <b>Day {s.day + 1}</b>: {toGolferScoreStr(s.score)}
                  <span> </span>
                  {GolferLogic.renderGolfer(golfer)}
                </li>
              );
            })}
          </ul>
        </GolfDraftPanel>
      )}

      <GolfDraftPanel heading="Chat Room">
        <ChatRoom />
      </GolfDraftPanel>
    </section>
  );
};
