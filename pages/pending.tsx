import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useCurrentUser } from '../lib/data/users';
import { withAuth } from '../lib/util/withAuth';

const PendingPage = () => {
  const { data: currentUser } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push('/');
    }
  }, [router, currentUser]);

  return (
    <div className="container">
      <div className="jumbotron">
        <h1>Waiting for confirmation</h1>
        <p>
          Hang tight. Waiting for the league commissioner to match this email with your username. This page should
          automatically refresh when your user is ready.
        </p>
        {/** TODO: chat room */}
      </div>
    </div>
  );
};

export default PendingPage;

export const getServerSideProps = withAuth(async (props) => {
  return { props };
});
