import { RESET_STATE } from '../actions/constants';
import {
  SET_SCREEN,
  SCREEN_UNLOCK_WALLET,
  SET_APP_SALT,
  SET_PASSWORD_HASH,
  SET_NETWORK,
} from '../actions/app';

const initialState = {
  screen: SCREEN_UNLOCK_WALLET,
  appSalt: null,
  network: null,
  passwordHashInBackground: null,
  passwordHashInStorage: null,
};

export function appReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SCREEN:
    case SET_APP_SALT:
    case SET_PASSWORD_HASH:
    case SET_NETWORK: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case RESET_STATE:
      return initialState;
    default:
      return state;
  }
}
