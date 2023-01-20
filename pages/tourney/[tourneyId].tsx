import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import App from '../../lib/App';
import { prefetchDraftPicks } from '../../lib/data/draft';
import { prefetchGolfers } from '../../lib/data/golfers';
import { prefetchTourney } from '../../lib/data/tourney';
import { prefetchTourneyStandings } from '../../lib/data/tourneyStandings';
import { prefetchAllUsers } from '../../lib/data/users';
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
    prefetchTourneyStandings(tourneyId, queryClient, supabase),
    prefetchAllUsers(queryClient, supabase),
  ]);

  return { props: { ...props, dehydratedState: dehydrate(queryClient) } };
});

export default Tourney;
