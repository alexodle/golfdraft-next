import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { withAuth } from '../lib/util/withAuth';

const LogoutPage: NextPage = () => {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const user = useUser();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    (async () => {
      setIsLoading(true);
      if (user) {
        await supabase.auth.signOut();
        router.push('/');
      } else {
        router.push('/login');
      }
    })();
  });

  return null;
};

export const getServerSideProps = withAuth(async (props) => {
  return { props };
});

export default LogoutPage;