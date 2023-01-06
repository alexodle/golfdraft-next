import { withPageAuth } from '@supabase/auth-helpers-nextjs';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import App from '../../lib/App';
import AppHeader from '../../lib/legacy/js/components/AppHeader';
import { TourneyApp } from '../../lib/legacy/js/components/TourneyApp';
import { withAuth } from '../../lib/util/withAuth';

const Tourney: NextPage = () => {
  const {
    query: { tourneyId: tourneyIdStr },
    push,
  } = useRouter();

  const tourneyId = tourneyIdStr ? +tourneyIdStr : NaN;
  useEffect(() => {
    if (isNaN(tourneyId)) {
      push('/');
    }
  });
  if (isNaN(tourneyId)) {
    return null;
  }

  return (
    <App tourneyId={tourneyId}>
      <AppHeader />
      <TourneyApp />
    </App>
  );
};

export const getServerSideProps = withAuth(async (props) => {
  return { props };
});

export default Tourney;
