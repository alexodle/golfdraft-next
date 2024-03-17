import { RealtimeChannel, RealtimePostgresChangesPayload, SupabaseClient } from '@supabase/supabase-js';
import { memoize } from 'lodash';
import { useEffect, useState } from 'react';
import { createClient } from '../supabase/component';

export type SubscriptionCallback<T extends { [key: string]: any }> = (ev: RealtimePostgresChangesPayload<T>) => void;

export type Subscription<T extends { [key: string]: any }> = {
  onAll(cb: SubscriptionCallback<T>): object;
  unsubscribe(sub: object): void;
};

const getOrCreateSub = memoize(
  <T extends { [key: string]: any }>(table: string, filter: string, supabase: SupabaseClient) => {
    const cbs: SubscriptionCallback<T>[] = [];

    const createSub = (): RealtimeChannel => {
      return supabase
        .channel(`postgres_changes:${table}:${filter}`)
        .on<T>(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table,
            filter: filter.length ? filter : undefined,
          },
          (payload) => {
            cbs.forEach((cb) => {
              cb(payload);
            });
          },
        )
        .subscribe();
    };

    let sub: RealtimeChannel | undefined = undefined;
    const ensureSub = () => {
      sub = sub ?? createSub();
      return sub;
    };

    return {
      addCb: (cb: SubscriptionCallback<T>) => {
        ensureSub();
        cbs.push(cb);
      },
      removeCb: (cb: SubscriptionCallback<T>) => {
        const index = cbs.indexOf(cb);
        if (index > 0) {
          cbs.splice(index, 1);
        }
        if (cbs.length === 0) {
          sub?.unsubscribe();
        }
      },
    };
  },
);

const openSharedSubscription = <T extends { [key: string]: any }>(
  table: string,
  filter: string,
  cb: SubscriptionCallback<T>,
  supabase: SupabaseClient,
): { unsubscribe: () => void } => {
  const { addCb, removeCb } = getOrCreateSub<T>(table, filter, supabase);
  addCb(cb);
  return {
    unsubscribe: () => {
      removeCb(cb);
    },
  };
};

/**
 * Opens a supabase subscription and shares it among all consumers. Handles closing and opening as needed.
 */
export const useSharedSubscription = <T extends { [key: string]: any }>(
  table: string,
  filter: string,
  cb: SubscriptionCallback<T>,
  { disabled = false }: { disabled?: boolean } = {},
) => {
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    if (disabled) {
      return;
    }

    const sub = openSharedSubscription(table, filter, cb, supabase);
    return () => {
      sub.unsubscribe();
    };
  }, [table, filter, cb, supabase, disabled]);
};
