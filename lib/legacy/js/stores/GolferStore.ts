import * as _ from 'lodash';
import { Golfer } from '../../../models';
import AppConstants from '../constants/AppConstants';
import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';

let _golfers: Record<number, Golfer> = null;

class GolferStoreImpl extends Store {
  changeEvent() { return 'GolferStore:change'; }
  getAll() { return _golfers; }
  getGolfer(id: number) {
    return _golfers[id];
  }
}
const GolferStore = new GolferStoreImpl();

// Register to handle all updates
AppDispatcher.register(function (payload) {
  const action = payload.action;

  switch(action.actionType) {
    case AppConstants.SET_GOLFERS:
      _golfers = _.keyBy(action.golfers, 'id');
      GolferStore.emitChange();
      break;
  }

  return true;
});

export default GolferStore;
