import cx from 'classnames';
import React from 'react';
import * as utils from '../../common/utils';
import constants from '../../common/constants';
import { useCurrentTourney } from '../../../data/tourney';
import { useAllUsers, useCurrentUser } from '../../../data/users';
import { useTourneyStandings } from '../../../data/tourneyStandings';
import { useCompleteDraftPicks, useDraftPicks } from '../../../data/draft';

export type UserDetailsProps = Readonly<{
    selectedUserId?: number;
    onUserSelected: (userId: number) => void;
}>;

export const UserStandings = ({ selectedUserId, onUserSelected }: UserDetailsProps) => {
    const user = useCurrentUser();
    const allUsers = useAllUsers();
    const tourney = useCurrentTourney();
    const standings = useTourneyStandings();
    const draftPicks = useCompleteDraftPicks();
    
    if (!user || !tourney.data || !standings.data || !allUsers.data || !draftPicks.data) {
        return null;
    }

    const currentDayIndex = standings.data.currentDay ?? 0 - 1;

    const trs = standings.data.standings.map((ps) => {
      const p = allUsers.data[ps.userId];
      const userIsMe = user.id === p.id;
      const userIsSelected = selectedUserId === p.id;

      const holesLeft = ps.dayScores[currentDayIndex].golferScores.reduce((memo, gs) => {
        if (gs.missedCut) {
          return 0;
        } else if (gs.thru === null) {
          return constants.NHOLES;
        } else {
          return constants.NHOLES - gs.thru;
        }
      }, 0);

      const pickNumber = draftPicks.data.findIndex(dpo => dpo.userId === ps.userId);

      return (
        <tr
          key={p.id}
          className={cx({
            'selected-user-row': userIsSelected
          })}
          onClick={() => { onUserSelected(p.id)}}
        >
          <td>{ps.standing + 1}</td>
          <td>{userIsMe ? (<b>{p.name}</b>) : p.name}</td>
          <td>{utils.toGolferScoreStr(ps.totalScore)}</td>
          <td>{pickNumber}</td>
          <td className='hidden-xs'>{holesLeft > 0 ? holesLeft : 'F'}</td>
          {ps.dayScores.map(ds => {
            return (<td className='hidden-xs' key={ds.day}>{utils.toGolferScoreStr(ds.totalScore)}</td>);
          })}
          <td className='visible-xs'><a href='#UserDetails' onClick={() => { onUserSelected(p.id) }}>Details</a></td>
        </tr>
      );
    });

    return (
      <section>
        <p>
          <small>
            <b>Tip:</b> Click on a player row to view details
          </small>
        </p>
        <table className='table standings-table table-hover'>
          <thead>
            <tr>
              <th>#</th>
              <th>Pool Player</th>
              <th>Total</th>
              <th>Pick Number</th>
              <th className='hidden-xs'>Holes Left Today</th>
              <th className='hidden-xs'>Day 1</th>
              <th className='hidden-xs'>Day 2</th>
              <th className='hidden-xs'>Day 3</th>
              <th className='hidden-xs'>Day 4</th>
              <th className='visible-xs'></th>
            </tr>
          </thead>
          <tbody>{trs}</tbody>
        </table>
      </section>
    );
}
