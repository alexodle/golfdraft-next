import { GetServerSideProps, NextPage } from 'next';
import { getActiveTourneyId } from '../lib/data/appState';
import { getIsDraftComplete } from '../lib/data/draft';
import { adminSupabase } from '../lib/supabase';

const Home: NextPage = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async () => {
  const supabaseClient = adminSupabase();

  const activeTourneyId = await getActiveTourneyId(supabaseClient);
  const isDraftComplete = await getIsDraftComplete(activeTourneyId, supabaseClient);

  if (isDraftComplete) {
    return { redirect: { permanent: false, destination: `/tourney/${activeTourneyId}` } };
  }

  return { redirect: { permanent: false, destination: `/draft/${activeTourneyId}` } };
};

export default Home;
