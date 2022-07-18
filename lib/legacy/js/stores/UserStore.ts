import * as _ from 'lodash';
import AppConstants from '../constants/AppConstants';
import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';
import UserActions from '../actions/UserActions';
import {post} from '../fetch';
import { GDUser } from '../../../models';

let _currentUser: number = null;
let _users: Record<number, GDUser> = null;
let _isAdmin: boolean = false;
let _activeUsers: Set<number> = null; // active users indexed by user id
let _pickListUsers: Set<number> = null; // picklist users indexed by user id

class UserStoreImpl extends Store {
  changeEvent() { return 'UserStore:change'; }
  getCurrentUser() { return _users[_currentUser]; }
  getUser(userId: number) { return _users[userId]; }
  getUserByName(name: string) { return _.find(_users, { name }); }
  isAdmin() { return _isAdmin; }
  getAll() { return _users; }
  getActive() { return _activeUsers; }
  getPickListUsers() { return _pickListUsers; }
}
const UserStore = new UserStoreImpl();

// Register to handle all updates
AppDispatcher.register(async (payload) => {
  const action = payload.action;

  switch(action.actionType) {

    case AppConstants.SET_USERS:
      _users = _.keyBy(action.users, 'id');
      UserStore.emitChange();
      break;

    case AppConstants.CURRENT_USER_CHANGE:
      _currentUser = action.currentUser;

      if (!_currentUser && !action.isHydration) {
        try {
          await post('/logout')
          UserActions.setCurrentUserSynced();
        } catch {
          window.location.reload();
        }
      } else {
        UserActions.setCurrentUserSynced(action.isHydration);
      }

      UserStore.emitChange();
      break;

    case AppConstants.SET_IS_ADMIN:
      _isAdmin = action.isAdmin;
      UserStore.emitChange();
      break;

    case AppConstants.SET_ACTIVE_USERS:
      _activeUsers = action.activeUsers;
      UserStore.emitChange();
      break;
    
    case AppConstants.SET_PICKLIST_USERS:
      _pickListUsers = action.pickListUsers;
      UserStore.emitChange();
      break;

  }

  return true; // No errors.  Needed by promise in Dispatcher.
});

export default UserStore;
