import { useInterval } from 'usehooks-ts';
import { useTourneyId } from '../ctx/AppStateCtx';
import { useAutoPickUsers, useCurrentPick } from '../data/draft';
import { useDraftSettings, useHasDraftStarted } from '../data/draftSettings';
import { createClient } from '../supabase/component';

const INTERVAL = 1000;

export const AutoPicker = () => {
  const supabase = createClient();
  const tourneyId = useTourneyId();
  const isAutoPickUser = useIsAutoPickUser();

  useInterval(async () => {
    if (isAutoPickUser) {
      await supabase.rpc('run_auto_pick', {
        tourney_id: tourneyId,
      });
    }
  }, INTERVAL);

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
