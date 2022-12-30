import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useEffect } from 'react';
import { useTourneyId } from '../ctx/AppStateCtx';

const INTERVAL = 2000;

export const AutoPicker = () => {
    const tourneyId = useTourneyId();
    useEffect(() => {
        const id = setInterval(() => {
            supabaseClient.rpc('auto_pick', {
                tourneyId
            });
        }, INTERVAL);
        return () => {
            clearInterval(id);
        }
    }, [tourneyId]);

    return null;
}
