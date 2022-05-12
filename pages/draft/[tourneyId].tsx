import { groupBy, sortBy } from 'lodash';
import { GetServerSideProps, NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import { useEffect } from 'react';
import App from '../../lib/App';
import { useAppState } from '../../lib/ctx/AppStateCtx';
import { getAppStateFromDb } from '../../lib/data/appState';
import { getAutoPickUsers, getDraftPickList, getDraftPickListUsers, getDraftPickOrder, getDraftPicks } from '../../lib/data/draft';
import { getGolfers } from '../../lib/data/golfers';
import { getAllTourneys, getTourney } from '../../lib/data/tourney';
import { getTourneyStandings, getTourneyStandingScores } from '../../lib/data/tourneyStandings';
import { getAllUsers, getCurrentUserServer } from '../../lib/data/users';
import { PlayerDayScore, PlayerGolferDayScore, PlayerScore } from '../../lib/legacy/common/types/CommonTypes';
import AppHeader from '../../lib/legacy/js/components/AppHeader';
import DraftApp from '../../lib/legacy/js/components/DraftApp';
import { BootstrapPayload, TourneyStandings } from '../../lib/legacy/js/types/ClientTypes';
import { Tourney, WorstDayScore } from '../../lib/models';

const Draft: NextPage<BootstrapPayload> = (props) => {
  const { query: { tourneyId } } = useRouter();
  return (
    <App tourneyId={+(tourneyId as string)} boostrap={props}>
      <DraftInner />
    </App>
  )
}

const DraftInner: React.FC = () => {
  const {
    currentUser,
    tourneyName,
    draft,
    chatMessages,
    isPaused,
    activeUsers,
    allowClock,
    draftHasStarted,
    autoPickUsers,
    pickListUsers,
    tourneyId,
    activeTourneyId
  } = useAppState();

  useEffect(() => {
    if (!currentUser) {
      Router.push('/login');
    }
  }, [currentUser]);
  if (!currentUser) {
    return null;
  }

  return (
    <>
      <AppHeader
        tourneyName={tourneyName}
        currentUser={currentUser}
        drafting
      />
      <DraftApp
        currentUser={currentUser}
        currentPick={draft.currentPick}
        isMyDraftPick={draft.isMyDraftPick}
        draftPicks={draft.draftPicks}
        chatMessages={chatMessages ?? []}
        isPaused={isPaused}
        golfersRemaining={draft.golfersRemaining}
        pickingForUsers={draft.pickingForUsers}
        pickOrder={draft.pickOrder}
        activeUsers={activeUsers}
        allowClock={allowClock}
        syncedPickList={draft.syncedPickList}
        pendingPickList={draft.pendingPickList}
        draftHasStarted={draftHasStarted}
        autoPickUsers={autoPickUsers}
        pickListUsers={pickListUsers}
        tourneyId={tourneyId}
        isViewingActiveTourney={activeTourneyId === tourneyId}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<BootstrapPayload> = async (ctx) => {
  const { query: { tourneyIdStr } } = ctx;
  const tourneyId = +(tourneyIdStr as string);

  const currentUserSession = await getCurrentUserServer(ctx.req, ctx.res);
  if (!currentUserSession) {
    return { redirect: { permanent: false, destination: '/login'} };
  }

  const [
    { activeTourneyId },
    tourney,
    allTourneys,
    golfers,
    users,
    userPickList,
    autoPickUsers,
    draftPicks,
    pickListUsers,
    pickOrder,
  ] = await Promise.all([
    getAppStateFromDb(),
    getTourney(tourneyId),
    getAllTourneys(),
    getGolfers(tourneyId),
    getAllUsers(),
    getDraftPickList(tourneyId, +currentUserSession.id),
    getAutoPickUsers(tourneyId),
    getDraftPicks(tourneyId),
    getDraftPickListUsers(tourneyId),
    getDraftPickOrder(tourneyId),
  ]);

  const user = users.find(u => String(u.id) === currentUserSession.id);
  if (!user) {
    throw new Error(`User not found: ${currentUserSession.id}`);
  }

  const tourneyStandings = await buildTourneyStandings(tourney);
  const bootstrap: BootstrapPayload = {
    user,
    golfers,
    tourney,
    users,
    draft: {
      picks: draftPicks,
      pickOrder: pickOrder,
      serverTimestampEpochMillis: Date.now(),
      currentPick: pickOrder[draftPicks.length],
    },
    tourneyStandings,
    userPickList: userPickList,
    pickListUsers,
    appState: {
      autoPickUsers,
      activeTourneyId,
      isDraftPaused: tourney.isDraftPaused,
      allowClock: tourney.allowClock,
      draftHasStarted: tourney.draftHasStarted,
    },
    activeTourneyId,
    allTourneys,
  }

  return { props: bootstrap };
}

const buildTourneyStandings = async (tourney: Tourney): Promise<TourneyStandings> => {
  const [standings, standingScores] = await Promise.all([
    getTourneyStandings(tourney.id),
    getTourneyStandingScores(tourney.id),
  ]);

  const standingScoresByPlayer = groupBy(standingScores, s => s.playerId);

  const playerScores = standings.map<PlayerScore>(player => {
    const scores =  standingScoresByPlayer[player.playerId];
    if (!scores?.length) {
      throw new Error(`Scores not found for player: ${player.playerId}`);
    }
    const dayScores =  sortBy(scores, s => s.day).map<PlayerDayScore>((score) => ({
      ...score,
      golferScores: JSON.parse(score.golferScores) as PlayerGolferDayScore[],
    }));
    return {
      ...player,
      dayScores: dayScores,
    }
  });
  
  return {
    currentDay: tourney.currentDay ?? -1,
    worstScoresForDay: JSON.parse(tourney.worstScoresForDay) as WorstDayScore[],
    playerScores,
  };
}

export default Draft;
