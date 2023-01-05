import { useSession } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppStateCtxProvider } from './ctx/AppStateCtx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000 * 60,
      retry: 2,
    },
  }
});

const App: React.FC<{ tourneyId: number; children?: React.ReactNode; }> = ({ tourneyId, children }) => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [router]);

  if (!session) {
    return null;
  }

  return (
    <AppStateCtxProvider appState={{ tourneyId }}>
      <QueryClientProvider client={queryClient}>
        <div className='container'>
          {children}
        </div>
      </QueryClientProvider>
    </AppStateCtxProvider>
  )
}

export default App;
