import { clone, flatten } from 'lodash';
import { PendingDraftPick } from '../../models';

/**
 Given an ordered list of users, returns a set of DraftPickOrders
 in snake draft order.
 */
export function snakeDraftOrder(tourneyId: number, userIdOrder: number[]): PendingDraftPick[] {
  const reverseOrder = clone(userIdOrder).reverse();
  const fullOrder = flatten([userIdOrder, reverseOrder, userIdOrder, reverseOrder]);
  const pickOrder = fullOrder.map<PendingDraftPick>((userId, i) => ({
    tourneyId,
    userId,
    pickNumber: i + 1,
  }));
  return pickOrder;
}
