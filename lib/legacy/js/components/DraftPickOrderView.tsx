import cx from 'classnames';
import * as React from 'react';
import { useAutoPickUsers, useCurrentPick, useDraftPicks, usePickListUsers } from '../../../data/draft';
import { useAllUsers, useCurrentUser } from '../../../data/users';
import Loading from '../../../Loading';
import constants from '../../common/constants';

export const DraftPickOrderView: React.FC<{
  pickingForUsers: Set<number>;
  onUserSelected: (pid: number) => void;
}> = ({
  pickingForUsers,
  onUserSelected
}) => {
  const { data: draftPicks } = useDraftPicks();
  const { data: allUsers } = useAllUsers();
  const { data: autoPickUsers = new Set() } = useAutoPickUsers();
  const { data: pickListUsers = new Set() } = usePickListUsers();
  const currentUser = useCurrentUser();
  const currentPick = useCurrentPick();
  
  if (!draftPicks || !currentPick || !currentUser || !allUsers) {
    return <Loading />;
  }

  const currentPickUserId = currentPick !== 'none' ? currentPick.userId : null;
  const pickOrder = draftPicks.slice(0, draftPicks.length / constants.NGOLFERS);

  return (
    <div>
      <ol className='pick-order-list'>
        {pickOrder.map(pick => {
          return (
            <li
              key={pick.userId}
              className={cx({
                'my-user': (
                  currentUser.id === pick.userId ||
                  pickingForUsers.has(pick.userId)
                ),
                'current-user': currentPickUserId === pick.userId
              })}
            >
              <a href='#DraftHistory' onClick={() => onUserSelected(pick.userId)}>
                {allUsers[pick.userId].name}
              </a>
              {!autoPickUsers.has(pick.userId) ? null : (
                <span> <span className='label label-success info-label'>AUTO</span></span>
              )}
              {!pickListUsers.has(pick.userId) ? null : (
                <span> <span className='label label-info info-label'>PL</span></span>
              )}
            </li>);
        })}
      </ol>
    </div>
  );
}

export default DraftPickOrderView;
