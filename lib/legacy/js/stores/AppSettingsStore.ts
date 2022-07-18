import * as _ from 'lodash';
import AppConstants from '../constants/AppConstants';
import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';
import {AppSettings} from '../types/ClientTypes';
import { Tourney } from '../../../models';

let _tourney: Tourney = null;

class AppSettingsStoreImpl extends Store {
  changeEvent() { return 'AppSettingsStore:change'; }
  getIsPaused() { return _tourney.isDraftPaused; }
  getAllowClock() { return _tourney.allowClock; }
  getDraftHasStarted() { return _tourney.draftHasStarted; }
  getAutoPickUsers() { return _tourney.autoPickUsers; }
}
const AppSettingsStore = new AppSettingsStoreImpl();

// Register to handle all updates
AppDispatcher.register(function (payload) {
  const action = payload.action;

  switch(action.actionType) {

    case AppConstants.SET_APP_STATE:
      _appState = _.extend({}, action.appState, {
        autoPickUsers: _.keyBy(action.appState.autoPickUsers)
      });
      AppSettingsStore.emitChange();
      break;

  }

  return true; // No errors.  Needed by promise in Dispatcher.
});

export default AppSettingsStore;
