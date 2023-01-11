import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import App from '../lib/App';
import { getActiveTourneyId } from '../lib/data/appState';
import { useCurrentUser } from '../lib/data/users';
import AppHeader from '../lib/legacy/js/components/AppHeader';
import { adminSupabase } from '../lib/supabase';
import { withAuth } from '../lib/util/withAuth';

const PendingPage = ({ activeTourneyId }: { activeTourneyId: number }) => {
  const { data: currentUser } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push('/');
    }
  }, [router, currentUser]);

  return (
    <App tourneyId={activeTourneyId}>
      <AppHeader />
      <div className="jumbotron">
        <h1>Waiting for confirmation</h1>
        <p>
          Hang tight. Waiting for the league commissioner to match this email with your username. This page should
          automatically refresh when your user is ready.
        </p>
        {/** TODO: chat room */}
      </div>
    </App>
  );
};

export default PendingPage;

export const getServerSideProps = withAuth(async (props) => {
  const activeTourneyId = await getActiveTourneyId(adminSupabase());
  return { props: { ...props, activeTourneyId } };
});
