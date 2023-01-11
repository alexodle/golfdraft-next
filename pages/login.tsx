import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/auth-ui-react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const AuthPage: NextPage = () => {
  const supabase = useSupabaseClient();

  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [router, user]);

  if (user) {
    return null;
  }

  return (
    <div className="container">
      <Auth supabaseClient={supabase} magicLink redirectTo="/" />
    </div>
  );
};

export default AuthPage;
