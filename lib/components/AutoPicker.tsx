import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect } from 'react';
import { useTourneyId } from '../ctx/AppStateCtx';
import { useAutoPickUsers, useCurrentPick } from '../data/draft';
import { useDraftSettings } from '../data/draftSettings';

const INTERVAL = 1000;

export const AutoPicker = () => {
  const tourneyId = useTourneyId();
  const isAutoPickUser = useIsAutoPickUser();
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!isAutoPickUser) {
      return;
    }

    (async () => {
      await supabase.rpc('run_auto_pick', {
        tourney_id: tourneyId,
      });
    })();
    const id = setInterval(async () => {
      await supabase.rpc('run_auto_pick', {
        tourney_id: tourneyId,
      });
    }, INTERVAL);

    return () => {
      clearInterval(id);
    };
  }, [tourneyId, isAutoPickUser]);

  return null;
};

const useIsAutoPickUser = (): boolean => {
  const { data: autoPickUsers } = useAutoPickUsers();
  const currentPick = useCurrentPick();
  const { data: draftSettings } = useDraftSettings();
  if (!draftSettings || !autoPickUsers || !currentPick || currentPick === 'none') {
    return false;
  }
  if (!draftSettings.draftHasStarted || draftSettings.isDraftPaused) {
    return false;
  }
  return autoPickUsers.has(currentPick.userId);
};
