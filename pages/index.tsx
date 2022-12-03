import { supabaseServerClient, withPageAuth } from '@supabase/auth-helpers-nextjs';
import { GetServerSideProps, NextPage } from 'next';
import { getActiveTourneyId } from '../lib/data/appState';
import { getIsDraftComplete } from '../lib/data/draft';

const Home: NextPage = () => {
  return null;
}

export const getServerSideProps: GetServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx) {
    const supabaseClient = supabaseServerClient(ctx);

    const activeTourneyId = await getActiveTourneyId(supabaseClient);
    const isDraftComplete = await getIsDraftComplete(activeTourneyId, supabaseClient);

    if (isDraftComplete) {
      return { redirect: { permanent: false, destination: `/tourney/${activeTourneyId}`} };
    }

    return { redirect: { permanent: false, destination: `/draft/${activeTourneyId}`} };
  }
});

export default Home;
