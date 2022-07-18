import React from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
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
  return (
    <AppStateCtxProvider appState={{ tourneyId }}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </AppStateCtxProvider>
  )
}

export default App;
