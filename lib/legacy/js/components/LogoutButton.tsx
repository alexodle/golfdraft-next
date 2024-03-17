import { useRouter } from 'next/router';
import React from 'react';
import Loading from '../../../Loading';
import { useSession } from '../../../ctx/SessionContext';
import { useCurrentUser } from '../../../data/users';

export const LogoutButton: React.FC = () => {
  const router = useRouter();

  const { isLoading: userIsLoading, data: currentUser } = useCurrentUser();
  const sessionUser = useSession()?.user;

  if (userIsLoading) {
    return <Loading />;
  }

  return (
    <input
      type="submit"
      className="logout-button"
      value={`I'm not ${currentUser?.name ?? sessionUser?.email}`}
      onClick={async (ev) => {
        ev.preventDefault();
        router.push('/logout');
      }}
    />
  );
};

export default LogoutButton;
