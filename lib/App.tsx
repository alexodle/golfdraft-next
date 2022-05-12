import { omit } from 'lodash';
import React, { useEffect, useState } from 'react';
import { AppStateCtxProvider, AppStateType } from './ctx/AppStateCtx';
import hydrate from './legacy/js/hydrate';
import AppSettingsStore from "./legacy/js/stores/AppSettingsStore";
import ChatStore from "./legacy/js/stores/ChatStore";
import DraftStore from "./legacy/js/stores/DraftStore";
import GolferStore from "./legacy/js/stores/GolferStore";
import ScoreStore from "./legacy/js/stores/ScoreStore";
import TourneyStore from "./legacy/js/stores/TourneyStore";
import UserStore from "./legacy/js/stores/UserStore";
import { BootstrapPayload, IndexedGolfers, DraftPick } from "./legacy/js/types/ClientTypes";

const RELEVANT_STORES = [
  AppSettingsStore,
  ChatStore,
  DraftStore,
  ScoreStore,
  UserStore
];

const App: React.FC<{ tourneyId: number; boostrap: BootstrapPayload; children?: React.ReactNode }> = ({ tourneyId, boostrap, children }) => {
  const [appState, setAppState] = useState<AppStateType | undefined>();

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (!hydrated) {
      hydrate(boostrap);
      setHydrated(true);
    }
  }, [hydrated, boostrap]);

  useEffect(() => {
    if (!appState && hydrated) {
      const onChange = () => {
        setAppState(getAppState(tourneyId));
      }

      RELEVANT_STORES.forEach(s => {
        s.addChangeListener(onChange);
      });

      onChange();
      
      return () => {
        RELEVANT_STORES.forEach(s => {
          s.removeChangeListener(onChange);
        });
      }
    }
  }, [appState, hydrated, tourneyId]);

  if (!appState) {
    return null;
  }

  return (
    <AppStateCtxProvider appState={appState}>
      {children}
    </AppStateCtxProvider>
  )

}

export default App;

function getAppState(tourneyId: number): AppStateType {
  return {
    tourneyId,

    activeTourneyId: TourneyStore.getActiveTourneyId(),
    allTourneys: TourneyStore.getAllTourneys(),

    tourneyName: TourneyStore.getTourneyName(),
    isViewingActiveTourney: TourneyStore.isViewingActiveTourney(),
    currentUser: UserStore.getCurrentUser(),
    activeUsers: UserStore.getActive(),
    golfers: GolferStore.getAll(),
    users: UserStore.getAll(),

    draft: {
      pickOrder: DraftStore.getPickOrder(),
      isMyDraftPick: DraftStore.getIsMyDraftPick(),
      currentPick: DraftStore.getCurrentPick(),
      draftPicks: DraftStore.getDraftPicks(),
      pickingForUsers: DraftStore.getPickingForUsers(),
      syncedPickList: DraftStore.getPickList(),
      pendingPickList: DraftStore.getPendingPickList(),
      golfersRemaining: getGolfersRemaining(GolferStore.getAll(), DraftStore.getDraftPicks()),
    },

    tourneyStandings: ScoreStore.getTourneyStandings(),
    lastScoresUpdate: ScoreStore.getLastUpdated(),

    chatMessages: ChatStore.getMessages(),

    isAdmin: UserStore.isAdmin(),
    isPaused: AppSettingsStore.getIsPaused(),
    allowClock: AppSettingsStore.getAllowClock(),
    draftHasStarted: AppSettingsStore.getDraftHasStarted(),
    autoPickUsers: AppSettingsStore.getAutoPickUsers(),
    pickListUsers: UserStore.getPickListUsers(),
  };
}

function getGolfersRemaining(golfers: IndexedGolfers, draftPicks: DraftPick[]): IndexedGolfers {
  const pickedGolfers = draftPicks.map(dp => dp.golfer);
  const golfersRemaining = omit(golfers, pickedGolfers);
  return golfersRemaining;
}
