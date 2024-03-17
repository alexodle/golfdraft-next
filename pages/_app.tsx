import '../styles/globals.css';
import '../lib/legacy/less/app.css';
import '../lib/legacy/less/app_header.css';
import '../lib/legacy/less/bootstrap_repl.css';
import '../lib/legacy/less/chat.css';
import '../lib/legacy/less/tourney_app.css';

import type { AppProps } from 'next/app';
import { useState } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { createClient } from '../lib/supabase/component';
import { SessionContext } from '../lib/ctx/SessionContext';
import { Session } from '@supabase/supabase-js';

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000 * 60,
            retry: 2,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <SessionContext.Provider value={{ session: pageProps.initialSession as Session }}>
          <Component {...pageProps} />
        </SessionContext.Provider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
