import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { RealtimeSubscription, SupabaseRealtimePayload } from '@supabase/supabase-js';
import { memoize } from 'lodash';

export type SubscriptionCallback<T> = (ev: SupabaseRealtimePayload<T>) => void;

export type Subscription<T> = {
  onAll(cb: SubscriptionCallback<T>): object;
  unsubscribe(sub: object): void;
}

const getOrCreateSub = memoize(<T>(topic: string) => {
  const cbs: SubscriptionCallback<T>[] = [];
  
  let sub: RealtimeSubscription | undefined = undefined;
  const ensureSub = () => {
    sub = sub ?? supabaseClient.from<T>(topic)
      .on('*', (ev) => {
        cbs.forEach((cb) => cb(ev));
      })
      .subscribe();
    return sub;
  }

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
    }
  }
});

/**
 * Opens a supabase subscription and shares it among all consumers. Handles closing and opening as needed.
 */
export const openSharedSubscription = <T>(topic: string, cb: SubscriptionCallback<T>): { unsubscribe: () => void; }  => {
  const { addCb, removeCb } = getOrCreateSub<T>(topic);
  
  const myCbs: SubscriptionCallback<T>[] = [];
  addCb(cb);

  return {
    unsubscribe: () => {
      removeCb(cb);
    }
  }
}
