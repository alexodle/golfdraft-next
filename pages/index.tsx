import { GetServerSideProps, NextPage } from 'next';

const Home: NextPage = () => {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  // TODO: hihi redirect to live tourney if draft is over
  return { redirect: { permanent: false, destination: '/draft'} };
}

export default Home;
