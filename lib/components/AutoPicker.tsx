import { useEffect, useMemo } from 'react';
import { useTourneyId } from '../ctx/AppStateCtx';
import { useAutoPickUsers, useCurrentPick } from '../data/draft';
import { useDraftSettings, useHasDraftStarted } from '../data/draftSettings';
import { createClient } from '../supabase/component';

const INTERVAL = 1000;

export const AutoPicker = () => {
  const tourneyId = useTourneyId();
  const isAutoPickUser = useIsAutoPickUser();
  const supabase = useMemo(() => createClient(), []);

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
  }, [tourneyId, isAutoPickUser, supabase]);

  return null;
};

const useIsAutoPickUser = (): boolean => {
  const { data: autoPickUsers } = useAutoPickUsers();
  const { data: draftSettings } = useDraftSettings();

  const currentPick = useCurrentPick();
  const { data: hasDraftStarted } = useHasDraftStarted();

  if (!draftSettings || !autoPickUsers || !currentPick || currentPick === 'none') {
    return false;
  }
  if (!hasDraftStarted || draftSettings.isDraftPaused) {
    return false;
  }
  return autoPickUsers.has(currentPick.userId);
};
