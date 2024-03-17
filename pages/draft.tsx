import { GetServerSideProps, NextPage } from 'next';
import { getActiveTourneyId } from '../lib/data/appState';
import { createClient } from '../lib/supabase/server-props';

const Draft: NextPage = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const activeTourneyId = await getActiveTourneyId(createClient(ctx));
  return { redirect: { permanent: false, destination: `/draft/${activeTourneyId}` } };
};

export default Draft;
