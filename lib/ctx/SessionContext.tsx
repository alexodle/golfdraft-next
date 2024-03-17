import { Session } from '@supabase/supabase-js';
import { createContext, useContext } from 'react';

export type SessionContextType = Readonly<{
  session: Session | undefined;
}>;

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('Expected SessionContext');
  }
  return ctx.session;
}
