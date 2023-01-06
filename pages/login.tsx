import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/auth-ui-react';
import { NextPage } from 'next';

const AuthPage: NextPage = () => {
  const supabase = useSupabaseClient();
  return <Auth supabaseClient={supabase} magicLink redirectTo="/" />;
};

export default AuthPage;
