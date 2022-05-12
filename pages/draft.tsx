import { GetServerSideProps, NextPage } from 'next';
import { getActiveTourneyId } from '../lib/data/appState';
import { BootstrapPayload } from '../lib/legacy/js/types/ClientTypes';

const Draft: NextPage = () => {
  return null;
}

export const getServerSideProps: GetServerSideProps<BootstrapPayload> = async () => {
  const activeTourneyId = getActiveTourneyId();
  return { redirect: { permanent: false, destination: `/draft/${activeTourneyId}`} };
}

export default Draft;
