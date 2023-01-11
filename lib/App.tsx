import { useSession } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { ActiveUsersCtxProvider } from './ctx/ActiveUsersCtx';
import { AppStateCtxProvider } from './ctx/AppStateCtx';
import { useCurrentUser } from './data/users';

const App = ({
  tourneyId,
  requireGdUser = true,
  children,
}: {
  tourneyId: number;
  requireGdUser?: boolean;
  children?: React.ReactNode;
}): React.ReactElement | null => {
  const session = useSession();
  const router = useRouter();
  const gdUserResult = useCurrentUser();

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
    if (requireGdUser && !gdUserResult.isLoading && !gdUserResult.data) {
      router.push('/pending');
    }
  }, [requireGdUser, router, session, gdUserResult.isLoading, gdUserResult.data]);

  if (!session || gdUserResult.isLoading) {
    return null;
  }

  return (
    <AppStateCtxProvider appState={{ tourneyId }}>
      <ActiveUsersCtxProvider>
        <div className="container">{children}</div>
      </ActiveUsersCtxProvider>
    </AppStateCtxProvider>
  );
};

export default App;
