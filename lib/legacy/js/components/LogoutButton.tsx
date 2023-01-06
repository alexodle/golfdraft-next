import React from 'react';
import { useCurrentUser } from '../../../data/users';
import Loading from '../../../Loading';

export const LogoutButton: React.FC = () => {
  const currentUser = useCurrentUser();

  if (!currentUser) {
    return <Loading />;
  }

  return (
    <form action="/logout" method="post">
      <input
        type="submit"
        className="logout-button"
        value={`I'm not ${currentUser.name}`}
        onSubmit={() => {
          throw new Error(`hihi TODO`);
        }}
      />
    </form>
  );
};

export default LogoutButton;
