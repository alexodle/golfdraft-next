import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { ActiveUsersCtxProvider } from './ctx/ActiveUsersCtx';
import { AppStateCtxProvider } from './ctx/AppStateCtx';
import { useCurrentUser } from './data/users';
import { useSession } from './ctx/SessionContext';

const App = ({
  tourneyId,
  requireGdUser,
  children,
}: {
  tourneyId: number;
  requireGdUser?: boolean;
  children?: React.ReactNode;
}): React.ReactElement | null => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [router, session]);

  if (!session) {
    return null;
  }

  return (
    <InnerApp tourneyId={tourneyId} requireGdUser={requireGdUser}>
      {children}
    </InnerApp>
  );
};

const InnerApp = ({
  tourneyId,
  requireGdUser = true,
  children,
}: {
  tourneyId: number;
  requireGdUser?: boolean;
  children?: React.ReactNode;
}) => {
  const router = useRouter();
  const gdUserResult = useCurrentUser();

  useEffect(() => {
    if (requireGdUser && !gdUserResult.isLoading && !gdUserResult.data) {
      router.push('/pending');
    }
  }, [requireGdUser, router, gdUserResult.isLoading, gdUserResult.data]);

  if (requireGdUser && !gdUserResult.data) {
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
