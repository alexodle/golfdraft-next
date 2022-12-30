import { withPageAuth } from '@supabase/auth-helpers-nextjs';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import App from '../../lib/App';
import { AutoPicker } from '../../lib/components/AutoPicker';
import AppHeader from '../../lib/legacy/js/components/AppHeader';
import DraftApp from '../../lib/legacy/js/components/DraftApp';

const Draft: NextPage = () => {
  const { query: { tourneyId: tourneyIdStr }, push } = useRouter();

  const tourneyId = tourneyIdStr ? +tourneyIdStr : NaN;
  useEffect(() => {
    if (isNaN(tourneyId)) {
      push('/');
    }
  });
  if (isNaN(tourneyId)) {
    return null;
  }

  return (
    <App tourneyId={tourneyId}>
      <AppHeader />
      <DraftApp  />

      <AutoPicker />
    </App>
  );
}

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
});

export default Draft;
