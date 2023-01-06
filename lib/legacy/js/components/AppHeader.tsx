import React from 'react';
import { useCurrentTourney } from '../../../data/tourney';
import { useCurrentUser } from '../../../data/users';
import Loading from '../../../Loading';
import LogoutButton from './LogoutButton';

export const AppHeader: React.FC = () => {
  const { data: tourney } = useCurrentTourney();
  const currentUser = useCurrentUser();

  if (!tourney || !currentUser) {
    return <Loading />;
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
        <span className="name">{currentUser.name}</span>
        <LogoutButton />
      </div>
    </div>
  );
};

export default AppHeader;
