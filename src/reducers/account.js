import { RESET_STATE } from '../actions/constants';
import {
  SET_ACTIVE_ACCOUNT_DETAILS,
  SET_ACCOUNT_INFO,
} from '../actions/account';

const initialState = {
  accounts: [],
  activeAccount: null,
  setActiveAccountDetails: null,
};

export function accountReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ACTIVE_ACCOUNT_DETAILS:
    case SET_ACCOUNT_INFO: {
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
