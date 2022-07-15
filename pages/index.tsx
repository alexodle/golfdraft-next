import { GetServerSideProps, NextPage } from 'next';
import { BootstrapPayload } from '../lib/legacy/js/types/ClientTypes';

const Home: NextPage = () => {
  return null;
}

export const getServerSideProps: GetServerSideProps<BootstrapPayload> = async () => {
  return { redirect: { permanent: false, destination: '/draft'} };
}

export default Home;
