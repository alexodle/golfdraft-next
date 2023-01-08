import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { useCurrentUser } from './users';

type ActiveUsersData = {
  active: boolean;
  userId: number;
};

type ActiveUserPresenceState = {
  [key: number]: ActiveUsersData[];
};

/**
 * Opens up presence channel for active users. Note: do not use directly. Use context instead.
 */
export const useActiveUsersData = () => {
  const supabase = useSupabaseClient();
  const { data: user } = useCurrentUser();

  const [activeUsers, setActiveUsers] = useState(() => new Set<number>());

  useEffect(() => {
    if (!user) {
      return;
    }

    const channel = supabase.channel('active-users', {
      config: {
        presence: { key: user.id.toString() },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceByUserId = channel.presenceState() as unknown as ActiveUserPresenceState;
        const newActiveUsers = new Set<number>([...Object.keys(presenceByUserId).map((s) => +s), user.id]);
        setActiveUsers(newActiveUsers);
      })
      .subscribe();

    const myPresence: ActiveUsersData = { userId: user.id, active: true };
    channel.track(myPresence);

    return () => {
      channel.unsubscribe();
    };
  }, [user, supabase]);

  return activeUsers;
};
