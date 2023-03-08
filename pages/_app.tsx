import '../styles/globals.css';
import '../lib/legacy/less/app.css';
import '../lib/legacy/less/app_header.css';
import '../lib/legacy/less/bootstrap_repl.css';
import '../lib/legacy/less/chat.css';
import '../lib/legacy/less/tourney_app.css';

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';

function MyApp({ Component, pageProps }: AppProps) {
  const [supabase] = useState(() => createBrowserSupabaseClient());
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
        <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
          <Component {...pageProps} />
        </SessionContextProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
