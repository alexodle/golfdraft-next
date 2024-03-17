import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { NextPage } from 'next';
import { createClient } from '../lib/supabase/component';

const AuthPage: NextPage = () => {
  return (
    <div className="container">
      <Auth
        supabaseClient={createClient()}
        magicLink
        redirectTo="/"
        view="magic_link"
        providers={[]}
        appearance={{ theme: ThemeSupa }}
      />
    </div>
  );
};

export default AuthPage;
