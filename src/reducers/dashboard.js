import { RESET_STATE } from '../actions/constants';
import { SHOW_ACCOUNTS, HIDE_ACCOUNTS } from '../actions/dashboard';

const initialState = {
  accountsOpen: false,
  anchorEl: null,
};

export function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_ACCOUNTS:
    case HIDE_ACCOUNTS: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case RESET_STATE:
      return initialState;
    default: {
      return state;
    }
  }
}
