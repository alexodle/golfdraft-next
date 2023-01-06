import React, { createContext, useContext } from 'react';
import { useActiveUsersData } from '../data/activeUsers';

export type ActiveUsersCtxType = Readonly<{
  activeUsers: Set<number>;
}>;

const ActiveUsersCtx = createContext<ActiveUsersCtxType>({ activeUsers: new Set() });

export const ActiveUsersCtxProvider = ({ children }: { children?: React.ReactNode }) => {
  const activeUsers = useActiveUsersData();
  return <ActiveUsersCtx.Provider value={{ activeUsers }}>{children}</ActiveUsersCtx.Provider>;
};

export const useActiveUsers = () => useContext(ActiveUsersCtx);
