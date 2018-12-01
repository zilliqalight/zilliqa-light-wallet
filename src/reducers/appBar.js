import { RESET_STATE } from '../actions/constants';

import { SHOW_NETWORK } from '../actions/appBar';

const initialState = {
  importPrivateKeyOpen: false,
  importMnemonicOpen: false,
  importKeystoreOpen: false,
  createAccountOpen: false,
  networkOpen: false,
};

export function appBarReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_NETWORK: {
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
