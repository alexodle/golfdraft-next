import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import React from 'react';
import { useCurrentUser } from '../../../data/users';
import Loading from '../../../Loading';

export const LogoutButton: React.FC = () => {
  const router = useRouter();

  const { isLoading: userIsLoading, data: currentUser } = useCurrentUser();
  const sessionUser = useUser();

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
