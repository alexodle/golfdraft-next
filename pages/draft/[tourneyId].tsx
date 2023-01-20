import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { QueryClient } from 'react-query';
import App from '../../lib/App';
import { AutoPicker } from '../../lib/components/AutoPicker';
import { prefetchDraftPicks } from '../../lib/data/draft';
import { prefetchGolfers } from '../../lib/data/golfers';
import { prefetchTourney } from '../../lib/data/tourney';
import { prefetchAllUsers } from '../../lib/data/users';
import AppHeader from '../../lib/legacy/js/components/AppHeader';
import DraftApp from '../../lib/legacy/js/components/DraftApp';
import { withAuth } from '../../lib/util/withAuth';

const Draft: NextPage = () => {
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
      <DraftApp />

      <AutoPicker />
    </App>
  );
};

export const getServerSideProps = withAuth(async (props, ctx, supabase) => {
  const queryClient = new QueryClient();

  const tourneyId = +(ctx.query.tourneyId as string);
  if (isNaN(tourneyId)) {
    return { redirect: { permanent: false, destination: '/' } };
  }

  await Promise.all([
    prefetchTourney(tourneyId, queryClient, supabase),
    prefetchDraftPicks(tourneyId, queryClient, supabase),
    prefetchGolfers(tourneyId, queryClient, supabase),
    prefetchAllUsers(queryClient, supabase),
  ]);

  return { props };
});

export default Draft;
