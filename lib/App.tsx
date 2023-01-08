import { useSession } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { ActiveUsersCtxProvider } from './ctx/ActiveUsersCtx';
import { AppStateCtxProvider } from './ctx/AppStateCtx';
import { useCurrentUser } from './data/users';

const App: React.FC<{ tourneyId: number; children?: React.ReactNode }> = ({ tourneyId, children }) => {
  const session = useSession();
  const router = useRouter();
  const gdUserResult = useCurrentUser();

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
    if (!gdUserResult.isLoading && !gdUserResult.data) {
      router.push('/pending');
    }
  }, [router, session, gdUserResult.isLoading, gdUserResult.data]);

  if (!session || !gdUserResult.data) {
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
