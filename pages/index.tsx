import { GetServerSideProps, NextPage } from 'next';
import { getActiveTourneyId } from '../lib/data/appState';
import { getIsDraftComplete } from '../lib/data/draft';
import { createClient } from '../lib/supabase/server-props';
import { adminSupabase } from '../lib/supabase';

const Home: NextPage = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async () => {
  const activeTourneyId = await getActiveTourneyId(adminSupabase());
  const isDraftComplete = await getIsDraftComplete(activeTourneyId, adminSupabase());

  if (isDraftComplete) {
    return { redirect: { permanent: false, destination: `/tourney/${activeTourneyId}` } };
  }

  return { redirect: { permanent: false, destination: `/draft/${activeTourneyId}` } };
};

export default Home;
