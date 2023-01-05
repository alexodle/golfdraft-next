import { createServerSupabaseClient, Session, User } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, GetServerSidePropsContext, PreviewData, GetServerSidePropsResult } from "next";
import { ParsedUrlQuery } from "querystring";
import { getActiveTourneyId } from "../data/appState";

export type ActiveProps = Readonly<{
    activeTourneyId: number;
    initialSession: Session,
    user: User, 
}>;

export const withAuth = <P extends { [key: string]: any }>(getServerSideProps: (props: ActiveProps, ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => Promise<GetServerSidePropsResult<P>>): GetServerSideProps<P> => {
    return async (ctx) => {
        const props = await getServerSidePropsHelper(ctx);
        if (props.redirect) {
            return props;
        }
        return getServerSideProps(props.props, ctx);
    };
}

const getServerSidePropsHelper = async (ctx: GetServerSidePropsContext) => {
    const supabase = createServerSupabaseClient(ctx);

    const {  data: { session } } = await supabase.auth.getSession()
    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        };
    }

    const activeTourneyId = await getActiveTourneyId(supabase);
    return { 
        props: { 
            activeTourneyId,
            initialSession: session,
            user: session.user, 
        } 
    };
}
