import { RESET_STATE } from '../actions/constants';
import {
  IMPORT_PRIVATE_KEY,
  SHOW_CREATE_ACCOUNT,
  SHOW_IMPORT_MNEMONIC,
  SHOW_IMPORT_PRIVATE_KEY,
  SHOW_RECEIVE_TOKEN,
  SHOW_SEND_TOKEN,
  SHOW_WALLET_KEYS,
  SHOW_WALLET_BACKUP,
  SHOW_WALLET_RESET,
} from '../actions/wallet';

const initialState = {
  sendTokenOpen: false,
  receiveTokenOpen: false,
  createAccountOpen: false,
  importMnemonicOpen: false,
  importPrivateKeyOpen: false,
  walletKeysOpen: false,
  walletBackupOpen: false,
  walletResetOpen: false,
};

export function walletReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_IMPORT_PRIVATE_KEY:
    case SHOW_IMPORT_MNEMONIC:
    case SHOW_CREATE_ACCOUNT:
    case SHOW_SEND_TOKEN:
    case SHOW_RECEIVE_TOKEN:
    case SHOW_WALLET_KEYS:
    case SHOW_WALLET_BACKUP:
    case SHOW_WALLET_RESET:
    case IMPORT_PRIVATE_KEY: {
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
