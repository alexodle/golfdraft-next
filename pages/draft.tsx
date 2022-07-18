import {
  supabaseServerClient, withPageAuth
} from '@supabase/auth-helpers-nextjs';
import { GetServerSideProps, NextPage } from 'next';
import { getActiveTourneyId } from '../lib/data/appState';
import { BootstrapPayload } from '../lib/legacy/js/types/ClientTypes';

const Draft: NextPage = () => {
  return null;
}

export const getServerSideProps: GetServerSideProps<BootstrapPayload> = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx) {
    const activeTourneyId = await getActiveTourneyId(supabaseServerClient(ctx));
    return { redirect: { permanent: false, destination: `/draft/${activeTourneyId}`} };
  }
});

export default Draft;
