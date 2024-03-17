import { Session, SupabaseClient, User } from '@supabase/supabase-js';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, PreviewData } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getActiveTourneyId } from '../data/appState';
import { createClient } from '../supabase/server-props';

export type ActiveProps = Readonly<{
  activeTourneyId: number;
  initialSession: Session;
  user: User;
}>;

export const withAuth = <P extends { [key: string]: any }>(
  getServerSideProps: (
    props: ActiveProps,
    ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
    supabase: SupabaseClient,
  ) => Promise<GetServerSidePropsResult<P>>,
): GetServerSideProps<P> => {
  return async (ctx) => {
    const supabase = createClient(ctx);
    const props = await getServerSidePropsHelper(supabase);
    if (props.redirect) {
      return props;
    }
    return getServerSideProps(props.props, ctx, supabase);
  };
};

const getServerSidePropsHelper = async (supabase: SupabaseClient) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const activeTourneyId = await getActiveTourneyId(supabase);
  return {
    props: {
      activeTourneyId,
      initialSession: session!,
      user,
    },
  };
};
