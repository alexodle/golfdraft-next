import '../styles/globals.css';
import '../lib/legacy/less/app.less';
import '../lib/legacy/less/app_header.less';
import '../lib/legacy/less/bootstrap_repl.less';
import '../lib/legacy/less/chat.less';
import '../lib/legacy/less/tourney_app.less';

import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { UserProvider } from '@supabase/auth-helpers-react';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider supabaseClient={supabaseClient}>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
