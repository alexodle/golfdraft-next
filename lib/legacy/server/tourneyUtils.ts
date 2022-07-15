import {clone, flatten} from 'lodash';
import { GDUser, PendingDraftPick } from '../../models';

/**
 Given an ordered list of users, returns a set of DraftPickOrders
 in snake draft order.
 */
export function snakeDraftOrder(tourneyId: number, userOrder: GDUser[]) : PendingDraftPick[] {
  const reverseOrder = clone(userOrder).reverse();
  const fullOrder = flatten([
    userOrder,
    reverseOrder,
    userOrder,
    reverseOrder
  ]);
  const pickOrder = fullOrder.map<PendingDraftPick>((user, i) => ({
    tourneyId,
    userId: user.id,
    pickNumber: i + 1,
  }));
  return pickOrder;
}
