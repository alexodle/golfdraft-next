import moment from 'moment';
import React, { useState } from 'react';
//import ChatRoom from './ChatRoom';
import GolfDraftPanel from './GolfDraftPanel';
import GolferLogic from '../logic/GolferLogic';
import { UserDetails } from './UserDetails';
import { UserStandings } from './UserStandings';
import * as utils from '../../common/utils';
import { useCurrentTourney } from '../../../data/tourney';
import { useCurrentUser } from '../../../data/users';
import { useTourneyStandings } from '../../../data/tourneyStandings';
import { useGolfers } from '../../../data/golfers';
import Loading from '../../../Loading';

export const TourneyApp = () => {
  const { data: currentUser } = useCurrentUser();
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
          Scores sync every 10 minutes. Last sync: <b>{moment(tourney.data.lastUpdatedEpochMillis).calendar()}</b>
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
                  <b>Day {s.day + 1}</b>: {utils.toGolferScoreStr(s.score)}
                  <span> </span>
                  {GolferLogic.renderGolfer(golfer)}
                </li>
              );
            })}
          </ul>
        </GolfDraftPanel>
      )}

      {/* <ChatRoom
          currentUser={this.props.currentUser}
          messages={this.props.chatMessages}
          activeUsers={this.props.activeUsers}
          enabled={this.props.isViewingActiveTourney}
        /> */}
    </section>
  );
};
