import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from '../lib/ctx/SessionContext';
import { createClient } from '../lib/supabase/component';
import { withAuth } from '../lib/util/withAuth';

const LogoutPage: NextPage = () => {
  const supabase = createClient();
  const router = useRouter();
  const user = useSession()?.user;

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
