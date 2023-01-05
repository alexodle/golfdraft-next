import { GetServerSideProps, NextPage } from 'next';
import { getActiveTourneyId } from '../lib/data/appState';
import { adminSupabase } from '../lib/supabase';

const Draft: NextPage = () => {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const activeTourneyId = await getActiveTourneyId(adminSupabase());
  return { redirect: { permanent: false, destination: `/draft/${activeTourneyId}`} };
}

export default Draft;
