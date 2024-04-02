import React from 'react';
import { useCurrentTourney } from '../../../data/tourney';
import { useCurrentUser } from '../../../data/users';
import Loading from '../../../Loading';
import LogoutButton from './LogoutButton';
import { useSession } from '../../../ctx/SessionContext';

const AppHeader = (): React.ReactElement => {
  const { data: tourney } = useCurrentTourney();
  const { isLoading: userIsLoading, data: currentUser } = useCurrentUser();
  const sessionUser = useSession()?.user;

  if (!sessionUser) {
    throw new Error('No session user');
  }

  if (!tourney || userIsLoading) {
    return (
      <div className="page-header draft-page-header">
        <div className="header-title-section">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="page-header draft-page-header">
      <div className="header-title-section">
        <h1>
          Welcome to the Pool Party
          <br />
          <small>{tourney.name}</small>
        </h1>
      </div>
      <div className="header-user-section">
        <span className="name">{currentUser?.name ?? sessionUser.email}</span>
        <LogoutButton />
      </div>
    </div>
  );
};

export default AppHeader;
