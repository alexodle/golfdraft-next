import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useEffect } from 'react';
import { useTourneyId } from '../ctx/AppStateCtx';
import { useAutoPickUsers, useCurrentPick } from '../data/draft';
import { useDraftSettings } from '../data/draftSettings';

const INTERVAL = 1000;

export const AutoPicker = () => {
    const tourneyId = useTourneyId();
    const isAutoPickUser = useIsAutoPickUser();
    useEffect(() => {
        if (!isAutoPickUser) {
            return;
        }

        (async () => {
            await supabaseClient.rpc('run_auto_pick', {
                tourney_id: tourneyId
            });
        })();
        const id = setInterval(async () => {
            await supabaseClient.rpc('run_auto_pick', {
                tourney_id: tourneyId
            });
        }, INTERVAL);
        
        return () => {
            clearInterval(id);
        }
    }, [tourneyId, isAutoPickUser]);

    return null;
}

const useIsAutoPickUser = (): boolean => {
    const { data: autoPickUsers } = useAutoPickUsers();
    const currentPick = useCurrentPick();
    const { data: draftSettings} = useDraftSettings();
    if (!draftSettings || !autoPickUsers || !currentPick || currentPick === 'none') {
        return false;
    }
    if (!draftSettings.draftHasStarted || draftSettings.isDraftPaused) {
        return false;
    }
    return autoPickUsers.has(currentPick.userId);
}