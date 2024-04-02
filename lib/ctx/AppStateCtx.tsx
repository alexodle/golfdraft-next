import React, { createContext, useContext } from 'react';

interface AppStateType {
  tourneyId: number;
}

const AppStateCtx = createContext<AppStateType | undefined>(undefined);

export const AppStateCtxProvider: React.FC<{ appState: AppStateType; children?: React.ReactNode }> = ({
  appState,
  children,
}) => {
  return <AppStateCtx.Provider value={appState}>{children}</AppStateCtx.Provider>;
};

const useAppState = (): AppStateType => {
  const ctx = useContext(AppStateCtx);
  if (!ctx) {
    throw new Error(`Missing app state context`);
  }
  return ctx;
};

export const useTourneyId = (): number => {
  const { tourneyId } = useAppState();
  return tourneyId;
};
