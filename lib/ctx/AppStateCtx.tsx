import React, { createContext, useContext } from 'react';
import { ChatMessage, IndexedGolfers, IndexedUsers, Tourney, TourneyStandings, User } from "../legacy/js/types/ClientTypes";
import { DraftProps } from "../legacy/js/types/SharedProps";

export interface AppStateType {
  activeTourneyId: number;
  tourneyName: string;
  isViewingActiveTourney: boolean;
  currentUser?: User;
  activeUsers: Set<number>;
  golfers: IndexedGolfers;
  users: IndexedUsers;
  draft: DraftProps;
  tourneyStandings: TourneyStandings;
  lastScoresUpdate: Date;
  chatMessages?: ChatMessage[];
  isAdmin: boolean;
  isPaused: boolean;
  allowClock: boolean;
  draftHasStarted: boolean;
  autoPickUsers: Set<string>;
  pickListUsers: Set<string>;
  allTourneys: Record<number, Tourney>;
  tourneyId: number;
}

const AppStateCtx = createContext<AppStateType | undefined>(undefined);

export const AppStateCtxProvider: React.FC<{ appState: AppStateType; children?: React.ReactNode }> = ({ appState, children }) => {
  return (
    <AppStateCtx.Provider value={appState}>
      {children}
    </AppStateCtx.Provider>
  );
}

export const useAppState = (): AppStateType => {
  const ctx = useContext(AppStateCtx);
  if (!ctx) {
    throw new Error(`Missing app state context`);
  }
  return ctx;
}

export const useTourneyId = (): number => {
  const { tourneyId } = useAppState();
  return tourneyId;
}
