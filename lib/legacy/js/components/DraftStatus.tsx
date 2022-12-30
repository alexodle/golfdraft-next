import React from 'react';
import { useAllUsers } from '../../../data/users';
import Loading from '../../../Loading';
import { PendingDraftPick } from '../../../models';

export const DraftStatus: React.FC<{ 
  currentPick: PendingDraftPick,
  onDraftForUser: (pid: number) => void;
}> = ({
  currentPick,
  onDraftForUser
}) => {
  const { data: allUsers } = useAllUsers();

  if (!allUsers) {
    return <Loading />;
  }

  const userName = allUsers[currentPick.userId].name;
  return (
    <div>
      <p className='draft-status'>
        Now drafting (Pick #{currentPick.pickNumber}): <b>{userName}</b>
      </p>
      <a href='#' onClick={(ev) => { ev.preventDefault(); onDraftForUser(currentPick.userId) }}>{`I'll pick for ${userName}`}</a>
    </div>
  );
}

export default DraftStatus;
