import '../styles/globals.css';
import '../lib/legacy/less/app.less';
import '../lib/legacy/less/app_header.less';
import '../lib/legacy/less/bootstrap_repl.less';
import '../lib/legacy/less/chat.less';
import '../lib/legacy/less/tourney_app.less';

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import type { AppProps } from 'next/app';
import { useState } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const [supabase] = useState(() => createBrowserSupabaseClient())
  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
      <Component {...pageProps} />
    </SessionContextProvider>
  );
}

export default MyApp;
